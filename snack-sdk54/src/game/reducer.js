import {
  CPU_DIFFICULTIES,
  GAME_MODES,
  GAME_PHASES,
  PIECE_KINDS,
  PLAYERS,
  PROMOTION_ROW,
  getOpponent,
} from './constants';
import {
  cloneBoard,
  createInitialBoard,
  findPiecePosition,
} from './initialBoard';
import {
  getLegalDestinations,
  getLegalTurnSequencesForBoard,
  sequenceMatchesPrefix,
} from './legalMoves';
import { countPieces, getGameOutcome, getReducedEndgameLimit } from './endConditions';
import { serializePosition } from './serialization';

export function createInitialGame(
  previousSettings = {},
  sessionWins = null,
  modeConfig = null
) {
  const board = createInitialBoard();
  const currentPlayer = PLAYERS.CREAM;
  const legalTurnSequences = getLegalTurnSequencesForBoard(board, currentPlayer);
  const initialKey = serializePosition(board, currentPlayer);
  const mode = modeConfig?.mode || GAME_MODES.PVP;
  const cpuConfig = {
    difficulty: modeConfig?.difficulty || CPU_DIFFICULTIES.MEDIUM,
    cpuPlayer: modeConfig?.cpuPlayer || PLAYERS.CHERRY,
  };

  return {
    board,
    currentPlayer,
    mode,
    cpuConfig,
    selected: null,
    forcedSequence: null,
    legalTurnSequences,
    phase: GAME_PHASES.PLAYING,
    winner: null,
    drawReason: null,
    winReason: null,
    resignedBy: null,
    moveNumber: 1,
    capturedByPlayer: {
      [PLAYERS.CREAM]: 0,
      [PLAYERS.CHERRY]: 0,
    },
    sessionWins: sessionWins
      ? { ...sessionWins }
      : {
          [PLAYERS.CREAM]: 0,
          [PLAYERS.CHERRY]: 0,
        },
    elapsedMs: 0,
    noProgressHalfMoves: 0,
    reducedEndgameHalfMoves: 0,
    lastPositionKey: initialKey,
    positionCounts: {
      [initialKey]: 1,
    },
    lastMove: null,
    lastEvent: null,
    settings: {
      soundEnabled: true,
      ...previousSettings,
    },
  };
}

export function resetGame(previousGame) {
  return createInitialGame(
    previousGame?.settings || {},
    previousGame?.sessionWins || null,
    previousGame
      ? {
          mode: previousGame.mode,
          difficulty: previousGame.cpuConfig?.difficulty,
          cpuPlayer: previousGame.cpuConfig?.cpuPlayer,
        }
      : null
  );
}

export function finishTurn(game, movedPieceId, isCapture, wasManBeforeMove, finalPos, capturedIds) {
  const nextBoard = cloneBoard(game.board);

  // Remove all captured pieces only after the full sequence completes.
  if (capturedIds.length > 0) {
    for (let row = 0; row < nextBoard.length; row += 1) {
      for (let col = 0; col < nextBoard[row].length; col += 1) {
        const cell = nextBoard[row][col];
        if (cell && capturedIds.includes(cell.id)) {
          nextBoard[row][col] = null;
        }
      }
    }
  }

  let promoted = false;
  const finalCell = nextBoard[finalPos.row][finalPos.col];
  if (
    finalCell &&
    finalCell.id === movedPieceId &&
    finalCell.kind === PIECE_KINDS.MAN &&
    finalPos.row === PROMOTION_ROW[game.currentPlayer]
  ) {
    nextBoard[finalPos.row][finalPos.col] = {
      ...finalCell,
      kind: PIECE_KINDS.KING,
    };
    promoted = true;
  }

  const nextCapturedByPlayer = {
    ...game.capturedByPlayer,
    [game.currentPlayer]:
      game.capturedByPlayer[game.currentPlayer] + capturedIds.length,
  };

  const noProgressHalfMoves =
    isCapture || wasManBeforeMove ? 0 : game.noProgressHalfMoves + 1;

  const countsAfter = countPieces(nextBoard);
  const reducedLimit = getReducedEndgameLimit(countsAfter);
  const reducedEndgameHalfMoves =
    reducedLimit !== null && !isCapture
      ? game.reducedEndgameHalfMoves + 1
      : 0;

  const nextPlayer = getOpponent(game.currentPlayer);
  const nextLegalSequences = getLegalTurnSequencesForBoard(nextBoard, nextPlayer);
  const nextPosKey = serializePosition(nextBoard, nextPlayer);
  const nextPositionCounts = {
    ...game.positionCounts,
    [nextPosKey]: (game.positionCounts[nextPosKey] || 0) + 1,
  };

  const nextGame = {
    ...game,
    board: nextBoard,
    currentPlayer: nextPlayer,
    selected: null,
    forcedSequence: null,
    legalTurnSequences: nextLegalSequences,
    moveNumber: game.moveNumber + 1,
    capturedByPlayer: nextCapturedByPlayer,
    noProgressHalfMoves,
    reducedEndgameHalfMoves,
    lastPositionKey: nextPosKey,
    positionCounts: nextPositionCounts,
    lastMove: {
      from: game.forcedSequence?.from || finalPos,
      to: finalPos,
      player: game.currentPlayer,
      capturedCount: capturedIds.length,
      promoted,
    },
    lastEvent: {
      type: promoted ? 'king' : isCapture ? 'capture' : 'move',
      promoted,
      capturedCount: capturedIds.length,
      moveNumber: game.moveNumber,
    },
  };

  const outcome = getGameOutcome(nextGame);
  if (outcome) {
    const nextSessionWins = { ...nextGame.sessionWins };
    if (outcome.type === 'win' && outcome.winner) {
      nextSessionWins[outcome.winner] += 1;
    }

    return {
      ...nextGame,
      phase: GAME_PHASES.FINISHED,
      winner: outcome.winner,
      winReason: outcome.type === 'win' ? outcome.reason : null,
      drawReason: outcome.type === 'draw' ? outcome.reason : null,
      sessionWins: nextSessionWins,
      lastEvent: {
        ...nextGame.lastEvent,
        outcome,
      },
    };
  }

  return nextGame;
}

export function applyMoveStep(game, destination) {
  if (game.phase !== GAME_PHASES.PLAYING || !game.selected) {
    return game;
  }

  const pieceId = game.selected.pieceId;
  const partialPath = game.forcedSequence ? game.forcedSequence.path : [];
  const legalDests = getLegalDestinations(game, pieceId, partialPath);
  const matchedDest = legalDests.find(
    (d) => d.row === destination.row && d.col === destination.col
  );

  if (!matchedDest) {
    return game;
  }

  const located = findPiecePosition(game.board, pieceId);
  if (!located) {
    return game;
  }

  const nextBoard = cloneBoard(game.board);
  nextBoard[located.row][located.col] = null;
  nextBoard[destination.row][destination.col] = { ...located.piece };

  const newPath = [...partialPath, { row: destination.row, col: destination.col }];
  const prevCaptured = game.forcedSequence ? game.forcedSequence.capturedIds : [];
  const newCaptured = matchedDest.capturedId
    ? [...prevCaptured, matchedDest.capturedId]
    : prevCaptured;

  const origin = game.forcedSequence
    ? game.forcedSequence.from
    : { row: located.row, col: located.col };

  const wasManBeforeMove = game.forcedSequence
    ? game.forcedSequence.wasManBeforeMove
    : located.piece.kind === PIECE_KINDS.MAN;

  const hasContinuation = game.legalTurnSequences.some(
    (seq) => seq.pieceId === pieceId && sequenceMatchesPrefix(seq, newPath)
  );

  if (hasContinuation) {
    return {
      ...game,
      board: nextBoard,
      selected: { row: destination.row, col: destination.col, pieceId },
      forcedSequence: {
        pieceId,
        from: origin,
        path: newPath,
        capturedIds: newCaptured,
        wasManBeforeMove,
      },
      lastEvent: {
        type: 'capture_step',
        capturedCount: newCaptured.length,
        moveNumber: game.moveNumber,
      },
    };
  }

  const intermediateGame = {
    ...game,
    board: nextBoard,
    forcedSequence: {
      pieceId,
      from: origin,
      path: newPath,
      capturedIds: newCaptured,
      wasManBeforeMove,
    },
  };

  return finishTurn(
    intermediateGame,
    pieceId,
    matchedDest.isCapture,
    wasManBeforeMove,
    { row: destination.row, col: destination.col },
    newCaptured
  );
}

export function selectSquare(game, row, col) {
  if (game.phase !== GAME_PHASES.PLAYING) {
    return game;
  }

  const cell = game.board[row]?.[col] || null;

  // During a mandatory multi-capture chain, only valid next landing squares are accepted.
  if (game.forcedSequence) {
    return applyMoveStep(game, { row, col });
  }

  if (game.selected) {
    const dests = getLegalDestinations(game, game.selected.pieceId, []);
    const isLegalDest = dests.some((d) => d.row === row && d.col === col);
    if (isLegalDest) {
      return applyMoveStep(game, { row, col });
    }
  }

  if (cell && cell.owner === game.currentPlayer) {
    const hasMoves = game.legalTurnSequences.some((seq) => seq.pieceId === cell.id);
    if (hasMoves) {
      return {
        ...game,
        selected: { row, col, pieceId: cell.id },
        lastEvent: { type: 'select', pieceId: cell.id },
      };
    }
    return {
      ...game,
      selected: null,
      lastEvent: { type: 'invalid_select', pieceId: cell.id },
    };
  }

  if (game.selected) {
    return {
      ...game,
      selected: null,
    };
  }

  return game;
}

export function gameReducer(game, action) {
  switch (action.type) {
    case 'SELECT_OR_MOVE':
      return selectSquare(game, action.row, action.col);
    case 'PLAY_STEP':
      return applyMoveStep(game, action.destination);
    case 'RESTART':
      return resetGame(game);
    case 'SET_MODE':
      return createInitialGame(
        game?.settings || {},
        { [PLAYERS.CREAM]: 0, [PLAYERS.CHERRY]: 0 },
        {
          mode: action.mode,
          difficulty: action.difficulty,
          cpuPlayer: action.cpuPlayer,
        }
      );
    case 'RESIGN': {
      if (game.phase !== GAME_PHASES.PLAYING) {
        return game;
      }
      const resignedPlayer = action.player || game.currentPlayer;
      const winner = getOpponent(resignedPlayer);
      return {
        ...game,
        phase: GAME_PHASES.FINISHED,
        resignedBy: resignedPlayer,
        winner,
        winReason: 'resignation',
        drawReason: null,
        selected: null,
        forcedSequence: null,
        sessionWins: {
          ...game.sessionWins,
          [winner]: game.sessionWins[winner] + 1,
        },
        lastEvent: {
          type: 'resign',
          outcome: { type: 'win', winner, reason: 'resignation' },
        },
      };
    }
    case 'TOGGLE_SOUND':
      return {
        ...game,
        settings: {
          ...game.settings,
          soundEnabled: !game.settings.soundEnabled,
        },
      };
    case 'TICK':
      if (game.phase !== GAME_PHASES.PLAYING) {
        return game;
      }
      return {
        ...game,
        elapsedMs: game.elapsedMs + (action.deltaMs || 1000),
      };
    default:
      return game;
  }
}
