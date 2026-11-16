import { BOARD_SIZE, PIECE_KINDS, PLAYERS } from '../constants';

const MAN_VALUE = 100;
const KING_VALUE = 340;

function getGameStage(totalPieces) {
  if (totalPieces >= 18) return 'opening';
  if (totalPieces >= 9) return 'midgame';
  return 'endgame';
}

function hasDiagonalSupport(board, row, col, owner) {
  const backDr = owner === PLAYERS.CREAM ? 1 : -1;
  const r = row + backDr;
  if (r < 0 || r >= BOARD_SIZE) return true; // Back row is naturally protected

  for (const dc of [-1, 1]) {
    const c = col + dc;
    if (c < 0 || c >= BOARD_SIZE) continue;
    const neighbor = board[r][c];
    if (neighbor && neighbor.owner === owner) {
      return true;
    }
  }
  return false;
}

export function evaluateBoard(board, perspectivePlayer, options = {}) {
  const { simple = false, mobilityCount = 0 } = options;

  let totalPieces = 0;
  let myScore = 0;
  let oppScore = 0;
  let myCount = 0;
  let oppCount = 0;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (!piece) continue;
      totalPieces += 1;
      if (piece.owner === perspectivePlayer) myCount += 1;
      else oppCount += 1;
    }
  }

  if (myCount === 0) return -50000;
  if (oppCount === 0) return 50000;

  const stage = getGameStage(totalPieces);

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (!piece) continue;

      const isMine = piece.owner === perspectivePlayer;
      let val = piece.kind === PIECE_KINDS.KING ? KING_VALUE : MAN_VALUE;

      if (!simple) {
        if (piece.kind === PIECE_KINDS.MAN) {
          // Advancement toward promotion row
          const progress =
            piece.owner === PLAYERS.CREAM ? BOARD_SIZE - 1 - row : row;
          val += progress * (stage === 'endgame' ? 14 : 7);

          // Back-row guard during opening & midgame
          const homeRow = piece.owner === PLAYERS.CREAM ? BOARD_SIZE - 1 : 0;
          if (row === homeRow && stage !== 'endgame') {
            val += 18;
          }
        } else {
          // Flying king bonus for central diagonals
          if (row >= 2 && row <= 5 && col >= 2 && col <= 5) {
            val += 18;
          }
        }

        // Center control (rows 3..4, cols 2..5)
        if (row >= 3 && row <= 4 && col >= 2 && col <= 5) {
          val += 12;
        }

        // Edge safety or diagonal support
        if (col === 0 || col === BOARD_SIZE - 1) {
          val += 6;
        } else if (hasDiagonalSupport(board, row, col, piece.owner)) {
          val += 8;
        }
      }

      if (isMine) {
        myScore += val;
      } else {
        oppScore += val;
      }
    }
  }

  let score = myScore - oppScore;
  if (!simple && mobilityCount !== 0) {
    score += mobilityCount * 3;
  }

  // Encourage trading down when ahead in material
  if (!simple && myScore > oppScore + 150) {
    score += (24 - totalPieces) * 4;
  }

  return score;
}
