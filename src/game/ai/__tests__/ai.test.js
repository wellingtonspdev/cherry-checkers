import {
  CPU_DIFFICULTIES,
  GAME_MODES,
  GAME_PHASES,
  PIECE_KINDS,
  PLAYERS,
  applyMoveStep,
  createEmptyBoard,
  createInitialGame,
  getLegalTurnSequencesForBoard,
  selectSquare,
} from '../../index';
import { chooseCpuSequence } from '../index';

function placePiece(board, row, col, owner, kind = PIECE_KINDS.MAN, id = null) {
  board[row][col] = {
    id: id || `${owner}-${row}-${col}`,
    owner,
    kind,
  };
}

describe('Cherry Checkers - Motor de IA (CPU)', () => {
  test('1. Todos os 4 níveis retornam uma sequência legal na abertura', () => {
    const game = createInitialGame({}, null, {
      mode: GAME_MODES.CPU,
      difficulty: CPU_DIFFICULTIES.EASY,
      cpuPlayer: PLAYERS.CREAM,
    });

    for (const diff of Object.values(CPU_DIFFICULTIES)) {
      const result = chooseCpuSequence(game, diff);
      expect(result).not.toBeNull();
      expect(result.sequence).toBeDefined();
      expect(game.legalTurnSequences).toContainEqual(result.sequence);
    }
  });

  test('2. CPU respeita Lei da Maioria e captura múltipla obrigatória', () => {
    const board = createEmptyBoard();
    placePiece(board, 5, 0, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');
    placePiece(board, 4, 1, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');

    placePiece(board, 6, 3, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c2');
    placePiece(board, 5, 4, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r2');
    placePiece(board, 3, 6, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r3');

    const game = createInitialGame();
    game.board = board;
    game.legalTurnSequences = getLegalTurnSequencesForBoard(board, PLAYERS.CREAM);

    const result = chooseCpuSequence(game, CPU_DIFFICULTIES.HARD);
    expect(result.sequence.pieceId).toBe('c2');
    expect(result.sequence.capturedIds).toHaveLength(2);
  });

  test('3. CPU em nível Difícil/Mestre captura peça livre e evita entregar peça sem compensação', () => {
    const board = createEmptyBoard();
    placePiece(board, 2, 1, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');
    placePiece(board, 4, 3, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');
    placePiece(board, 6, 5, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c2');

    const game = createInitialGame();
    game.board = board;
    game.currentPlayer = PLAYERS.CHERRY;
    game.legalTurnSequences = getLegalTurnSequencesForBoard(board, PLAYERS.CHERRY);

    // r1 em (2,1) pode ir para (3,0) seguro ou (3,2) onde c1 em (4,3) captura!
    const result = chooseCpuSequence(game, CPU_DIFFICULTIES.HARD);
    const dest = result.sequence.path[0];
    expect(dest).toEqual({ row: 3, col: 0 });
  });

  test('4. Partida simulada CPU vs CPU (Mestre vs Fácil) executa até resultado ou limite de lances sem erro', () => {
    let game = createInitialGame();
    let turns = 0;

    while (game.phase === GAME_PHASES.PLAYING && turns < 120) {
      const diff =
        game.currentPlayer === PLAYERS.CREAM
          ? CPU_DIFFICULTIES.MASTER
          : CPU_DIFFICULTIES.EASY;
      const res = chooseCpuSequence(game, diff);
      expect(res).not.toBeNull();

      const seq = res.sequence;
      game = selectSquare(game, seq.from.row, seq.from.col);
      for (const step of seq.path) {
        game = applyMoveStep(game, step);
      }
      turns += 1;
    }

    expect(turns).toBeGreaterThan(0);
    expect([GAME_PHASES.PLAYING, GAME_PHASES.FINISHED]).toContain(game.phase);
  });
});
