import { BOARD_SIZE, PIECE_KINDS, PLAYERS } from './constants';

export function serializePosition(gameOrBoard, maybePlayer) {
  const board = gameOrBoard.board || gameOrBoard;
  const currentPlayer = maybePlayer || gameOrBoard.currentPlayer;
  let encoded = `${currentPlayer}:`;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = board[row][col];
      if (!cell) {
        encoded += '.';
      } else if (cell.owner === PLAYERS.CREAM) {
        encoded += cell.kind === PIECE_KINDS.KING ? 'C' : 'c';
      } else {
        encoded += cell.kind === PIECE_KINDS.KING ? 'R' : 'r';
      }
    }
  }

  return encoded;
}
