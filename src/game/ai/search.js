import { PIECE_KINDS, PROMOTION_ROW, getOpponent } from '../constants';
import { cloneBoard } from '../initialBoard';
import { getAllCaptureSequences } from '../captures';
import { getLegalTurnSequencesForBoard } from '../legalMoves';
import { evaluateBoard } from './evaluator';
import { computeBoardHash } from './zobrist';

const TT_EXACT = 0;
const TT_LOWER = 1;
const TT_UPPER = 2;
const INF = 1000000;

export function sequenceKey(seq) {
  const last = seq.path[seq.path.length - 1];
  return `${seq.pieceId}:${seq.from.row},${seq.from.col}->${last.row},${last.col}:${seq.capturedIds.length}`;
}

export function simulateSequence(board, player, sequence) {
  const nextBoard = cloneBoard(board);
  const { from, path, capturedIds } = sequence;
  const piece = nextBoard[from.row][from.col];
  nextBoard[from.row][from.col] = null;

  if (capturedIds.length > 0) {
    const capSet = new Set(capturedIds);
    for (let r = 0; r < nextBoard.length; r += 1) {
      for (let c = 0; c < nextBoard[r].length; c += 1) {
        const cell = nextBoard[r][c];
        if (cell && capSet.has(cell.id)) {
          nextBoard[r][c] = null;
        }
      }
    }
  }

  const dest = path[path.length - 1];
  const promoted =
    piece.kind === PIECE_KINDS.MAN && dest.row === PROMOTION_ROW[player];

  nextBoard[dest.row][dest.col] = {
    ...piece,
    kind: promoted ? PIECE_KINDS.KING : piece.kind,
  };

  return {
    board: nextBoard,
    nextPlayer: getOpponent(player),
  };
}

function scoreMoveForOrdering(seq, board, player, pvKey) {
  if (pvKey && sequenceKey(seq) === pvKey) {
    return 100000;
  }
  let s = 0;
  if (seq.isCapture) {
    s += 1000 + seq.capturedIds.length * 100;
  }
  const dest = seq.path[seq.path.length - 1];
  const piece = board[seq.from.row][seq.from.col];
  if (
    piece &&
    piece.kind === PIECE_KINDS.MAN &&
    dest.row === PROMOTION_ROW[player]
  ) {
    s += 500;
  }
  if (dest.row >= 3 && dest.row <= 4 && dest.col >= 2 && dest.col <= 5) {
    s += 20;
  }
  return s;
}

function orderSequences(sequences, board, player, pvKey) {
  if (sequences.length <= 1) return sequences;
  return [...sequences].sort(
    (a, b) =>
      scoreMoveForOrdering(b, board, player, pvKey) -
      scoreMoveForOrdering(a, board, player, pvKey)
  );
}

function quiescence(
  board,
  player,
  maximizingPlayer,
  alpha,
  beta,
  deadline,
  qDepth,
  simpleEval,
  state
) {
  if (Date.now() >= deadline) {
    state.aborted = true;
    return 0;
  }

  const captures = getAllCaptureSequences(board, player);
  if (captures.length === 0 || qDepth >= 4) {
    return evaluateBoard(board, maximizingPlayer, { simple: simpleEval });
  }

  const isMax = player === maximizingPlayer;
  if (isMax) {
    let best = -INF;
    for (const seq of captures) {
      const sim = simulateSequence(board, player, seq);
      const val = quiescence(
        sim.board,
        sim.nextPlayer,
        maximizingPlayer,
        alpha,
        beta,
        deadline,
        qDepth + 1,
        simpleEval,
        state
      );
      if (state.aborted) return 0;
      if (val > best) best = val;
      if (val > alpha) alpha = val;
      if (beta <= alpha) break;
    }
    return best;
  }

  let best = INF;
  for (const seq of captures) {
    const sim = simulateSequence(board, player, seq);
    const val = quiescence(
      sim.board,
      sim.nextPlayer,
      maximizingPlayer,
      alpha,
      beta,
      deadline,
      qDepth + 1,
      simpleEval,
      state
    );
    if (state.aborted) return 0;
    if (val < best) best = val;
    if (val < beta) beta = val;
    if (beta <= alpha) break;
  }
  return best;
}

function alphaBeta(
  board,
  player,
  maximizingPlayer,
  depth,
  alpha,
  beta,
  tt,
  deadline,
  config,
  state
) {
  if (state.nodes % 256 === 0 && Date.now() >= deadline) {
    state.aborted = true;
    return 0;
  }
  state.nodes += 1;

  const isMax = player === maximizingPlayer;
  const origAlpha = alpha;
  const origBeta = beta;

  let hash = 0;
  let ttBestKey = null;
  if (config.useTT) {
    hash = computeBoardHash(board, player);
    const entry = tt.get(hash);
    if (entry && entry.depth >= depth) {
      if (entry.flag === TT_EXACT) return entry.score;
      if (entry.flag === TT_LOWER && entry.score > alpha) alpha = entry.score;
      else if (entry.flag === TT_UPPER && entry.score < beta) beta = entry.score;
      if (alpha >= beta) return entry.score;
    }
    if (entry?.bestKey) {
      ttBestKey = entry.bestKey;
    }
  }

  const sequences = getLegalTurnSequencesForBoard(board, player);
  if (sequences.length === 0) {
    // Player to move has no legal moves -> loses (prefer faster wins / slower losses)
    return isMax ? -40000 - depth * 10 : 40000 + depth * 10;
  }

  if (depth <= 0) {
    if (config.useQuiescence) {
      return quiescence(
        board,
        player,
        maximizingPlayer,
        alpha,
        beta,
        deadline,
        0,
        config.simpleEval,
        state
      );
    }
    return evaluateBoard(board, maximizingPlayer, {
      simple: config.simpleEval,
      mobilityCount: isMax ? sequences.length : -sequences.length,
    });
  }

  const ordered = orderSequences(sequences, board, player, ttBestKey);
  let bestVal = isMax ? -INF : INF;
  let bestSeqKey = sequenceKey(ordered[0]);

  for (const seq of ordered) {
    const sim = simulateSequence(board, player, seq);
    const val = alphaBeta(
      sim.board,
      sim.nextPlayer,
      maximizingPlayer,
      depth - 1,
      alpha,
      beta,
      tt,
      deadline,
      config,
      state
    );
    if (state.aborted) return 0;

    if (isMax) {
      if (val > bestVal) {
        bestVal = val;
        bestSeqKey = sequenceKey(seq);
      }
      if (val > alpha) alpha = val;
    } else {
      if (val < bestVal) {
        bestVal = val;
        bestSeqKey = sequenceKey(seq);
      }
      if (val < beta) beta = val;
    }

    if (beta <= alpha) {
      break;
    }
  }

  if (config.useTT) {
    let flag = TT_EXACT;
    if (bestVal <= origAlpha) flag = TT_UPPER;
    else if (bestVal >= origBeta) flag = TT_LOWER;
    if (tt.size > 40000) {
      tt.clear();
    }
    tt.set(hash, { depth, score: bestVal, flag, bestKey: bestSeqKey });
  }

  return bestVal;
}

export function searchBestSequence(game, config) {
  const sequences = game.legalTurnSequences;
  if (!sequences || sequences.length === 0) {
    return null;
  }
  if (sequences.length === 1) {
    return {
      sequence: sequences[0],
      score: 0,
      depthReached: 0,
      nodesSearched: 1,
    };
  }

  const maximizingPlayer = game.currentPlayer;
  const deadline = Date.now() + config.timeBudgetMs;
  const tt = new Map();
  const state = { aborted: false, nodes: 0 };

  let bestSequence = sequences[0];
  let bestScore = 0;
  let bestDepth = 0;
  let scoredCandidates = sequences.map((seq) => ({ seq, score: 0 }));

  for (let depth = 1; depth <= config.maxDepth; depth += 1) {
    state.aborted = false;
    const pvKey = bestSequence ? sequenceKey(bestSequence) : null;
    const ordered = orderSequences(sequences, game.board, maximizingPlayer, pvKey);

    let iterBestSeq = ordered[0];
    let iterBestScore = -INF;
    const iterCandidates = [];

    for (const seq of ordered) {
      const sim = simulateSequence(game.board, maximizingPlayer, seq);
      const val = alphaBeta(
        sim.board,
        sim.nextPlayer,
        maximizingPlayer,
        depth - 1,
        -INF,
        INF,
        tt,
        deadline,
        config,
        state
      );
      if (state.aborted) break;

      iterCandidates.push({ seq, score: val });
      if (val > iterBestScore) {
        iterBestScore = val;
        iterBestSeq = seq;
      }
    }

    if (state.aborted) {
      break;
    }

    bestSequence = iterBestSeq;
    bestScore = iterBestScore;
    bestDepth = depth;
    scoredCandidates = iterCandidates;

    if (Date.now() >= deadline) {
      break;
    }
  }

  // For lower difficulties, allow controlled top-K variety among near-best moves.
  if (config.topKRandom > 1 && scoredCandidates.length > 1) {
    scoredCandidates.sort((a, b) => b.score - a.score);
    const topScore = scoredCandidates[0].score;
    const pool = scoredCandidates
      .slice(0, config.topKRandom)
      .filter((c) => topScore - c.score <= config.randomTolerance);
    if (pool.length > 0) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      bestSequence = pick.seq;
      bestScore = pick.score;
    }
  }

  return {
    sequence: bestSequence,
    score: bestScore,
    depthReached: bestDepth,
    nodesSearched: state.nodes,
  };
}
