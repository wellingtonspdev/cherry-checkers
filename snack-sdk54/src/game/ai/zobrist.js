import { BOARD_SIZE, PIECE_KINDS, PLAYERS } from '../constants';

// Deterministic xorshift32 PRNG so Zobrist keys are identical across JS runtimes.
function createPrng(seed = 0x9e3779b9) {
  let state = seed >>> 0;
  return () => {
    state ^= state << 13;
    state ^= state >>> 17;
    state ^= state << 5;
    return state >>> 0;
  };
}

const nextRand = createPrng(0x43484552); // "CHER"

// 4 piece types: 0=cream man, 1=cream king, 2=cherry man, 3=cherry king
const PIECE_KEYS = Array.from({ length: BOARD_SIZE }, () =>
  Array.from({ length: BOARD_SIZE }, () => [
    nextRand(),
    nextRand(),
    nextRand(),
    nextRand(),
  ])
);

const TURN_KEY = nextRand();

function pieceTypeIndex(piece) {
  if (piece.owner === PLAYERS.CREAM) {
    return piece.kind === PIECE_KINDS.KING ? 1 : 0;
  }
  return piece.kind === PIECE_KINDS.KING ? 3 : 2;
}

export function computeBoardHash(board, currentPlayer) {
  let hash = currentPlayer === PLAYERS.CHERRY ? TURN_KEY : 0;

  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const piece = board[row][col];
      if (piece) {
        hash ^= PIECE_KEYS[row][col][pieceTypeIndex(piece)];
      }
    }
  }

  return hash >>> 0;
}
