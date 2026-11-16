import { BOARD_SIZE, PLAYERS, PIECE_KINDS, isPlayableSquare } from './constants';

export function createEmptyBoard() {
  return Array.from({ length: BOARD_SIZE }, () => Array(BOARD_SIZE).fill(null));
}

export function cloneBoard(board) {
  return board.map((row) => row.map((cell) => (cell ? { ...cell } : null)));
}

export function createInitialBoard() {
  const board = createEmptyBoard();
  let cherryIndex = 1;
  let creamIndex = 1;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      if (!isPlayableSquare(row, col)) {
        continue;
      }

      if (row <= 2) {
        board[row][col] = {
          id: `cherry-${cherryIndex}`,
          owner: PLAYERS.CHERRY,
          kind: PIECE_KINDS.MAN,
        };
        cherryIndex += 1;
      } else if (row >= 5) {
        board[row][col] = {
          id: `cream-${creamIndex}`,
          owner: PLAYERS.CREAM,
          kind: PIECE_KINDS.MAN,
        };
        creamIndex += 1;
      }
    }
  }

  return board;
}

export function findPiecePosition(board, pieceId) {
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = board[row][col];
      if (cell && cell.id === pieceId) {
        return { row, col, piece: cell };
      }
    }
  }
  return null;
}
