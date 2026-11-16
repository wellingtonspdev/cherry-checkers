import {
  BOARD_SIZE,
  GAME_PHASES,
  PIECE_KINDS,
  PLAYERS,
  applyMoveStep,
  createEmptyBoard,
  createInitialBoard,
  createInitialGame,
  gameReducer,
  getAllCaptureSequences,
  getGameOutcome,
  getLegalDestinations,
  getLegalTurnSequencesForBoard,
  isPlayableSquare,
  resetGame,
  selectSquare,
  serializePosition,
} from '../index';

function placePiece(board, row, col, owner, kind = PIECE_KINDS.MAN, id = null) {
  board[row][col] = {
    id: id || `${owner}-${row}-${col}`,
    owner,
    kind,
  };
}

describe('Cherry Checkers - Motor de Regras Brasileiras', () => {
  test('1. Tabuleiro inicial: 8x8, 32 casas jogáveis, 12 peças por lado, linhas 3 e 4 vazias, Marfim começa', () => {
    const game = createInitialGame();
    let playableCount = 0;
    let creamCount = 0;
    let cherryCount = 0;

    for (let r = 0; r < BOARD_SIZE; r += 1) {
      for (let c = 0; c < BOARD_SIZE; c += 1) {
        if (isPlayableSquare(r, c)) {
          playableCount += 1;
        }
        const cell = game.board[r][c];
        if (cell) {
          expect(isPlayableSquare(r, c)).toBe(true);
          if (cell.owner === PLAYERS.CREAM) creamCount += 1;
          if (cell.owner === PLAYERS.CHERRY) cherryCount += 1;
        }
      }
    }

    expect(playableCount).toBe(32);
    expect(creamCount).toBe(12);
    expect(cherryCount).toBe(12);
    expect(game.board[3].every((c) => c === null)).toBe(true);
    expect(game.board[4].every((c) => c === null)).toBe(true);
    expect(game.currentPlayer).toBe(PLAYERS.CREAM);
    expect(game.phase).toBe(GAME_PHASES.PLAYING);
  });

  test('2. Pedra comum move uma casa diagonal para frente; rejeita ré sem captura e casas inválidas', () => {
    const board = createEmptyBoard();
    placePiece(board, 5, 2, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');
    placePiece(board, 0, 1, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');

    const seqs = getLegalTurnSequencesForBoard(board, PLAYERS.CREAM);
    expect(seqs).toHaveLength(2);
    const dests = seqs.map((s) => `${s.path[0].row},${s.path[0].col}`).sort();
    expect(dests).toEqual(['4,1', '4,3']);
  });

  test('3. Dama voadora move por todas as quatro diagonais até bloqueio', () => {
    const board = createEmptyBoard();
    placePiece(board, 3, 4, PLAYERS.CREAM, PIECE_KINDS.KING, 'k1');
    placePiece(board, 1, 2, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c2'); // bloqueio próprio
    placePiece(board, 5, 6, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1'); // bloqueio inimigo distante

    // Como (5,6) está na diagonal sem casa livre depois? Não, (6,7) está livre! Então há captura obrigatória!
    // Vamos colocar r1 em (6,7) na borda para testar apenas movimento simples.
    board[5][6] = null;
    placePiece(board, 6, 7, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');

    const seqs = getLegalTurnSequencesForBoard(board, PLAYERS.CREAM).filter(
      (s) => s.pieceId === 'k1'
    );
    const dests = seqs.map((s) => `${s.path[0].row},${s.path[0].col}`);

    expect(dests).toContain('2,3');
    expect(dests).not.toContain('1,2');
    expect(dests).not.toContain('0,1');
    expect(dests).toContain('0,7'); // diagonal cima-direita livre
    expect(dests).toContain('4,5');
    expect(dests).toContain('5,6');
    expect(dests).not.toContain('6,7');
    expect(dests).toContain('6,1');
  });

  test('4. Captura obrigatória impede movimento simples de qualquer peça', () => {
    const board = createEmptyBoard();
    placePiece(board, 5, 2, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');
    placePiece(board, 4, 3, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');
    placePiece(board, 5, 6, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c2');

    const seqs = getLegalTurnSequencesForBoard(board, PLAYERS.CREAM);
    expect(seqs).toHaveLength(1);
    expect(seqs[0].pieceId).toBe('c1');
    expect(seqs[0].isCapture).toBe(true);
    expect(seqs[0].path).toEqual([{ row: 3, col: 4 }]);
  });

  test('5. Pedra comum captura para trás e para frente, inclusive dama inimiga', () => {
    const board = createEmptyBoard();
    placePiece(board, 3, 4, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');
    placePiece(board, 4, 5, PLAYERS.CHERRY, PIECE_KINDS.KING, 'rk1'); // atrás!

    const captures = getAllCaptureSequences(board, PLAYERS.CREAM);
    expect(captures).toHaveLength(1);
    expect(captures[0].path).toEqual([{ row: 5, col: 6 }]);
    expect(captures[0].capturedIds).toEqual(['rk1']);
  });

  test('6. Dama captura à distância com múltiplas casas de pouso possíveis', () => {
    const board = createEmptyBoard();
    placePiece(board, 6, 1, PLAYERS.CREAM, PIECE_KINDS.KING, 'ck1');
    placePiece(board, 4, 3, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');

    const captures = getAllCaptureSequences(board, PLAYERS.CREAM);
    const landings = captures.map((c) => `${c.path[0].row},${c.path[0].col}`).sort();
    expect(landings).toEqual(['0,7', '1,6', '2,5', '3,4']);
  });

  test('7. Cadeias múltiplas: peça capturada bloqueia trajetória e não é capturada duas vezes', () => {
    const board = createEmptyBoard();
    placePiece(board, 6, 1, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');
    placePiece(board, 5, 2, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');
    placePiece(board, 3, 4, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r2');

    const captures = getAllCaptureSequences(board, PLAYERS.CREAM);
    expect(captures).toHaveLength(1);
    expect(captures[0].path).toEqual([
      { row: 4, col: 3 },
      { row: 2, col: 5 },
    ]);
    expect(captures[0].capturedIds).toEqual(['r1', 'r2']);
  });

  test('8. Lei da Maioria global: rota com 2 capturas é obrigatória sobre rota com 1', () => {
    const board = createEmptyBoard();
    // c1 pode capturar apenas 1 peça
    placePiece(board, 5, 0, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');
    placePiece(board, 4, 1, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');
    // c2 pode capturar 2 peças em cadeia
    placePiece(board, 6, 3, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c2');
    placePiece(board, 5, 4, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r2');
    placePiece(board, 3, 6, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r3');

    const seqs = getLegalTurnSequencesForBoard(board, PLAYERS.CREAM);
    expect(seqs).toHaveLength(1);
    expect(seqs[0].pieceId).toBe('c2');
    expect(seqs[0].capturedIds).toHaveLength(2);
  });

  test('9. Coroação: pedra que passa por row=0 durante captura não promove; pedra que termina em row=0 promove', () => {
    // Passa por row=0 e continua capturando para trás
    const boardPass = createEmptyBoard();
    placePiece(boardPass, 2, 1, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');
    placePiece(boardPass, 1, 2, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');
    placePiece(boardPass, 1, 4, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r2');

    let game = createInitialGame();
    game.board = boardPass;
    game.legalTurnSequences = getLegalTurnSequencesForBoard(boardPass, PLAYERS.CREAM);

    game = selectSquare(game, 2, 1);
    game = selectSquare(game, 0, 3); // passa por row=0, ainda tem captura de (1,4)->(2,5)
    expect(game.currentPlayer).toBe(PLAYERS.CREAM);
    expect(game.board[0][3].kind).toBe(PIECE_KINDS.MAN); // não promove no meio!
    expect(game.forcedSequence).not.toBeNull();

    game = selectSquare(game, 2, 5); // termina em row=2
    expect(game.currentPlayer).toBe(PLAYERS.CHERRY);
    expect(game.board[2][5].kind).toBe(PIECE_KINDS.MAN);

    // Termina em row=0 -> promove!
    const boardStop = createEmptyBoard();
    placePiece(boardStop, 1, 2, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');
    placePiece(boardStop, 7, 0, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');
    let game2 = createInitialGame();
    game2.board = boardStop;
    game2.legalTurnSequences = getLegalTurnSequencesForBoard(boardStop, PLAYERS.CREAM);

    game2 = selectSquare(game2, 1, 2);
    game2 = selectSquare(game2, 0, 1);
    expect(game2.board[0][1].kind).toBe(PIECE_KINDS.KING);
    expect(game2.lastEvent.promoted).toBe(true);
  });

  test('10. Troca de seleção, toque fora e reinício em captura parcial não corrompem estado', () => {
    let game = createInitialGame();
    game = gameReducer(game, { type: 'SELECT_OR_MOVE', row: 5, col: 0 });
    expect(game.selected?.pieceId).toBe('cream-1');

    // Toque em casa inválida limpa seleção
    game = gameReducer(game, { type: 'SELECT_OR_MOVE', row: 0, col: 0 });
    expect(game.selected).toBeNull();

    // Reinício durante captura parcial restaura 12+12
    const restarted = resetGame(game);
    expect(restarted.moveNumber).toBe(1);
    expect(restarted.currentPlayer).toBe(PLAYERS.CREAM);
    expect(restarted.forcedSequence).toBeNull();
  });

  test('11. Vitória por eliminação e por bloqueio, além de desistência', () => {
    const boardBlock = createEmptyBoard();
    placePiece(boardBlock, 7, 0, PLAYERS.CHERRY, PIECE_KINDS.MAN, 'r1');
    // Cherry move para baixo (row+1), então em row=7 não tem movimentos!
    placePiece(boardBlock, 5, 2, PLAYERS.CREAM, PIECE_KINDS.MAN, 'c1');

    let game = createInitialGame();
    game.board = boardBlock;
    game.currentPlayer = PLAYERS.CHERRY;
    game.legalTurnSequences = getLegalTurnSequencesForBoard(boardBlock, PLAYERS.CHERRY);

    const outcome = getGameOutcome(game);
    expect(outcome).toEqual({
      type: 'win',
      winner: PLAYERS.CREAM,
      reason: 'blocked',
    });

    // Desistência
    const normalGame = createInitialGame();
    const resigned = gameReducer(normalGame, { type: 'RESIGN' });
    expect(resigned.phase).toBe(GAME_PHASES.FINISHED);
    expect(resigned.winner).toBe(PLAYERS.CHERRY);
    expect(resigned.sessionWins[PLAYERS.CHERRY]).toBe(1);
  });

  test('12. Empate por 20 lances de dama sem captura e por repetição tripla', () => {
    const board = createEmptyBoard();
    placePiece(board, 0, 1, PLAYERS.CREAM, PIECE_KINDS.KING, 'ck1');
    placePiece(board, 7, 6, PLAYERS.CHERRY, PIECE_KINDS.KING, 'rk1');

    let game = createInitialGame();
    game.board = board;
    game.legalTurnSequences = getLegalTurnSequencesForBoard(board, PLAYERS.CREAM);
    game.noProgressHalfMoves = 39;

    game = selectSquare(game, 0, 1);
    game = selectSquare(game, 1, 2);
    expect(game.phase).toBe(GAME_PHASES.FINISHED);
    expect(game.drawReason).toBe('twenty_moves');

    // Repetição tripla
    const boardRep = createEmptyBoard();
    placePiece(boardRep, 0, 1, PLAYERS.CREAM, PIECE_KINDS.KING, 'ck1');
    placePiece(boardRep, 7, 6, PLAYERS.CHERRY, PIECE_KINDS.KING, 'rk1');
    placePiece(boardRep, 6, 5, PLAYERS.CHERRY, PIECE_KINDS.KING, 'rk2');
    const key = serializePosition(boardRep, PLAYERS.CHERRY);

    let repGame = createInitialGame();
    repGame.board = boardRep;
    repGame.currentPlayer = PLAYERS.CHERRY;
    repGame.lastPositionKey = key;
    repGame.positionCounts = { [key]: 3 };
    repGame.legalTurnSequences = getLegalTurnSequencesForBoard(boardRep, PLAYERS.CHERRY);
    expect(getGameOutcome(repGame)).toEqual({
      type: 'draw',
      winner: null,
      reason: 'repetition',
    });
  });

  test('13. Reducer e serializer são determinísticos e não mutam estado anterior', () => {
    const g1 = createInitialGame();
    const snapBefore = JSON.stringify(g1);
    const g2 = gameReducer(g1, { type: 'SELECT_OR_MOVE', row: 5, col: 0 });
    const g3 = gameReducer(g2, { type: 'SELECT_OR_MOVE', row: 4, col: 1 });

    expect(JSON.stringify(g1)).toBe(snapBefore);
    expect(g3.currentPlayer).toBe(PLAYERS.CHERRY);
    expect(serializePosition(g3)).not.toBe(serializePosition(g1));
  });
});
