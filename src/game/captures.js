import {
  ALL_DIAGONALS,
  PIECE_KINDS,
  isInsideBoard,
} from './constants';
import { cloneBoard } from './initialBoard';

function getSingleCapturesFrom(board, row, col, piece, capturedIds) {
  const captures = [];

  if (piece.kind === PIECE_KINDS.MAN) {
    for (const [dr, dc] of ALL_DIAGONALS) {
      const enemyRow = row + dr;
      const enemyCol = col + dc;
      const landRow = row + 2 * dr;
      const landCol = col + 2 * dc;

      if (!isInsideBoard(landRow, landCol)) {
        continue;
      }

      const target = board[enemyRow][enemyCol];
      if (
        target &&
        target.owner !== piece.owner &&
        !capturedIds.has(target.id) &&
        board[landRow][landCol] === null
      ) {
        captures.push({
          row: landRow,
          col: landCol,
          capturedId: target.id,
        });
      }
    }
    return captures;
  }

  // Flying king capture: slides along diagonal to first enemy, lands on any empty square after it.
  for (const [dr, dc] of ALL_DIAGONALS) {
    let r = row + dr;
    let c = col + dc;

    while (isInsideBoard(r, c)) {
      const cell = board[r][c];
      if (cell === null) {
        r += dr;
        c += dc;
        continue;
      }

      if (cell.owner === piece.owner || capturedIds.has(cell.id)) {
        break;
      }

      let lr = r + dr;
      let lc = c + dc;
      while (isInsideBoard(lr, lc) && board[lr][lc] === null) {
        captures.push({
          row: lr,
          col: lc,
          capturedId: cell.id,
        });
        lr += dr;
        lc += dc;
      }
      break;
    }
  }

  return captures;
}

function exploreCaptures(board, row, col, piece, origin, path, capturedIds, results) {
  const nextSteps = getSingleCapturesFrom(board, row, col, piece, capturedIds);

  if (nextSteps.length === 0) {
    if (path.length > 0) {
      results.push({
        pieceId: piece.id,
        from: origin,
        path,
        capturedIds: Array.from(capturedIds),
        isCapture: true,
      });
    }
    return;
  }

  for (const step of nextSteps) {
    const nextBoard = cloneBoard(board);
    nextBoard[row][col] = null;
    nextBoard[step.row][step.col] = { ...piece };

    const nextCaptured = new Set(capturedIds);
    nextCaptured.add(step.capturedId);

    const nextPath = [...path, { row: step.row, col: step.col }];
    exploreCaptures(
      nextBoard,
      step.row,
      step.col,
      piece,
      origin,
      nextPath,
      nextCaptured,
      results
    );
  }
}

export function getAllCaptureSequences(board, player) {
  const allSequences = [];

  for (let row = 0; row < board.length; row += 1) {
    for (let col = 0; col < board[row].length; col += 1) {
      const piece = board[row][col];
      if (!piece || piece.owner !== player) {
        continue;
      }

      exploreCaptures(
        board,
        row,
        col,
        piece,
        { row, col },
        [],
        new Set(),
        allSequences
      );
    }
  }

  if (allSequences.length === 0) {
    return [];
  }

  // Lei da Maioria: only sequences capturing the maximum number of pieces are legal.
  let maxCaptures = 0;
  for (const seq of allSequences) {
    if (seq.capturedIds.length > maxCaptures) {
      maxCaptures = seq.capturedIds.length;
    }
  }

  return allSequences.filter((seq) => seq.capturedIds.length === maxCaptures);
}
