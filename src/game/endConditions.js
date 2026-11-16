import {
  BOARD_SIZE,
  MAX_KING_ONLY_HALF_MOVES,
  PIECE_KINDS,
  PLAYERS,
  REPETITION_LIMIT,
  getOpponent,
} from './constants';

export function countPieces(board) {
  const counts = {
    [PLAYERS.CREAM]: { total: 0, men: 0, kings: 0 },
    [PLAYERS.CHERRY]: { total: 0, men: 0, kings: 0 },
  };

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = board[row][col];
      if (!cell) {
        continue;
      }
      counts[cell.owner].total += 1;
      if (cell.kind === PIECE_KINDS.KING) {
        counts[cell.owner].kings += 1;
      } else {
        counts[cell.owner].men += 1;
      }
    }
  }

  return counts;
}

// CBD CODEX reduced endgame half-move limits (no men on board, no captures).
export function getReducedEndgameLimit(counts) {
  const c = counts[PLAYERS.CREAM];
  const r = counts[PLAYERS.CHERRY];

  if (c.men > 0 || r.men > 0) {
    return null;
  }

  const maxKings = Math.max(c.kings, r.kings);
  const minKings = Math.min(c.kings, r.kings);

  if (minKings === 1 && (maxKings === 1 || maxKings === 2)) {
    return 10; // 5 full moves each
  }
  if (minKings === 1 && maxKings === 3) {
    return 30; // 15 full moves each
  }
  return null;
}

export function getGameOutcome(game) {
  if (game.resignedBy) {
    return {
      type: 'win',
      winner: getOpponent(game.resignedBy),
      reason: 'resignation',
    };
  }

  const counts = countPieces(game.board);
  const current = game.currentPlayer;
  const opponent = getOpponent(current);

  if (counts[current].total === 0) {
    return {
      type: 'win',
      winner: opponent,
      reason: 'elimination',
    };
  }

  if (counts[opponent].total === 0) {
    return {
      type: 'win',
      winner: current,
      reason: 'elimination',
    };
  }

  if (game.legalTurnSequences.length === 0) {
    return {
      type: 'win',
      winner: opponent,
      reason: 'blocked',
    };
  }

  const posHash = game.lastPositionKey;
  if (posHash && (game.positionCounts[posHash] || 0) >= REPETITION_LIMIT) {
    return {
      type: 'draw',
      winner: null,
      reason: 'repetition',
    };
  }

  if (game.noProgressHalfMoves >= MAX_KING_ONLY_HALF_MOVES) {
    return {
      type: 'draw',
      winner: null,
      reason: 'twenty_moves',
    };
  }

  const reducedLimit = getReducedEndgameLimit(counts);
  if (reducedLimit !== null && game.reducedEndgameHalfMoves >= reducedLimit) {
    return {
      type: 'draw',
      winner: null,
      reason: 'reduced_endgame',
    };
  }

  return null;
}
