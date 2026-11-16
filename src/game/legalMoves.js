import {
  ALL_DIAGONALS,
  FORWARD_ROW_DELTA,
  PIECE_KINDS,
  isInsideBoard,
} from './constants';
import { getAllCaptureSequences } from './captures';

function getSimpleMovesForPiece(board, row, col, piece) {
  const sequences = [];

  if (piece.kind === PIECE_KINDS.MAN) {
    const dr = FORWARD_ROW_DELTA[piece.owner];
    for (const dc of [-1, 1]) {
      const nr = row + dr;
      const nc = col + dc;
      if (isInsideBoard(nr, nc) && board[nr][nc] === null) {
        sequences.push({
          pieceId: piece.id,
          from: { row, col },
          path: [{ row: nr, col: nc }],
          capturedIds: [],
          isCapture: false,
        });
      }
    }
    return sequences;
  }

  for (const [dr, dc] of ALL_DIAGONALS) {
    let nr = row + dr;
    let nc = col + dc;
    while (isInsideBoard(nr, nc) && board[nr][nc] === null) {
      sequences.push({
        pieceId: piece.id,
        from: { row, col },
        path: [{ row: nr, col: nc }],
        capturedIds: [],
        isCapture: false,
      });
      nr += dr;
      nc += dc;
    }
  }

  return sequences;
}

export function getLegalTurnSequencesForBoard(board, player) {
  const captures = getAllCaptureSequences(board, player);
  if (captures.length > 0) {
    return captures;
  }

  const simpleMoves = [];
  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const piece = board[row][col];
      if (!piece || piece.owner !== player) {
        continue;
      }
      simpleMoves.push(...getSimpleMovesForPiece(board, row, col, piece));
    }
  }

  return simpleMoves;
}

export function getLegalTurnSequences(game) {
  return getLegalTurnSequencesForBoard(game.board, game.currentPlayer);
}

export function sequenceMatchesPrefix(sequence, partialPath) {
  if (sequence.path.length <= partialPath.length) {
    return false;
  }
  for (let i = 0; i < partialPath.length; i += 1) {
    if (
      sequence.path[i].row !== partialPath[i].row ||
      sequence.path[i].col !== partialPath[i].col
    ) {
      return false;
    }
  }
  return true;
}

export function getLegalDestinations(game, pieceId, partialPath = []) {
  const sequences = game.legalTurnSequences || getLegalTurnSequences(game);
  const byCoord = new Map();

  for (const seq of sequences) {
    if (seq.pieceId !== pieceId) {
      continue;
    }
    if (!sequenceMatchesPrefix(seq, partialPath)) {
      continue;
    }
    const nextStep = seq.path[partialPath.length];
    const key = `${nextStep.row},${nextStep.col}`;
    if (!byCoord.has(key)) {
      byCoord.set(key, {
        row: nextStep.row,
        col: nextStep.col,
        isCapture: seq.isCapture,
        capturedId: seq.isCapture ? seq.capturedIds[partialPath.length] : null,
      });
    }
  }

  return Array.from(byCoord.values());
}

export function getMovablePieceIds(game) {
  const sequences = game.legalTurnSequences || [];
  return Array.from(new Set(sequences.map((seq) => seq.pieceId)));
}
