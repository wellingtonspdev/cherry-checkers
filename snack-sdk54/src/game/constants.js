export const BOARD_SIZE = 8;

export const PLAYERS = {
  CREAM: 'cream',
  CHERRY: 'cherry',
};

export const PIECE_KINDS = {
  MAN: 'man',
  KING: 'king',
};

export const GAME_PHASES = {
  PLAYING: 'playing',
  FINISHED: 'finished',
};

export const GAME_MODES = {
  PVP: 'pvp',
  CPU: 'cpu',
};

export const CPU_DIFFICULTIES = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard',
  MASTER: 'master',
};

export const PROMOTION_ROW = {
  [PLAYERS.CREAM]: 0,
  [PLAYERS.CHERRY]: BOARD_SIZE - 1,
};

export const FORWARD_ROW_DELTA = {
  [PLAYERS.CREAM]: -1,
  [PLAYERS.CHERRY]: 1,
};

export const ALL_DIAGONALS = [
  [-1, -1],
  [-1, 1],
  [1, -1],
  [1, 1],
];

// CBD CODEX / FENAE: 20 full moves (40 half-moves) with kings only and no captures.
export const MAX_KING_ONLY_HALF_MOVES = 40;
export const REPETITION_LIMIT = 3;

export function isPlayableSquare(row, col) {
  return (row + col) % 2 === 1;
}

export function isInsideBoard(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

export function getOpponent(player) {
  return player === PLAYERS.CREAM ? PLAYERS.CHERRY : PLAYERS.CREAM;
}
