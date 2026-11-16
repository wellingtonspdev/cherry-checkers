import { useCallback, useEffect, useMemo, useReducer, useRef, useState } from 'react';
import {
  GAME_MODES,
  GAME_PHASES,
  createInitialGame,
  gameReducer,
  getLegalDestinations,
  getMovablePieceIds,
} from '../game';
import { chooseCpuSequence } from '../game/ai';
import { useElapsedTime } from './useElapsedTime';
import { useSound } from './useSound';

export function useGame(isPaused = false, initialModeConfig = null) {
  const [game, dispatch] = useReducer(gameReducer, initialModeConfig, (cfg) =>
    createInitialGame({}, null, cfg)
  );
  const [isCpuThinking, setIsCpuThinking] = useState(false);
  const { playSound } = useSound(game.settings.soundEnabled);
  const prevEventRef = useRef(null);

  const isTimerActive = game.phase === GAME_PHASES.PLAYING && !isPaused;
  const isCpuTurn =
    game.mode === GAME_MODES.CPU &&
    game.phase === GAME_PHASES.PLAYING &&
    game.currentPlayer === game.cpuConfig?.cpuPlayer;

  const handleTick = useCallback((deltaMs) => {
    dispatch({ type: 'TICK', deltaMs });
  }, []);

  useElapsedTime(isTimerActive, handleTick);

  useEffect(() => {
    if (!game.lastEvent || game.lastEvent === prevEventRef.current) {
      return;
    }
    prevEventRef.current = game.lastEvent;

    if (game.lastEvent.outcome?.type === 'win') {
      playSound('win');
    } else if (game.lastEvent.type === 'king') {
      playSound('king');
    } else if (
      game.lastEvent.type === 'capture' ||
      game.lastEvent.type === 'capture_step'
    ) {
      playSound('capture');
    } else if (game.lastEvent.type === 'move') {
      playSound('move');
    } else if (game.lastEvent.type === 'select') {
      playSound('select');
    }
  }, [game.lastEvent, playSound]);

  // Execute CPU turn asynchronously so UI remains responsive
  const gameSnapshotRef = useRef(game);
  gameSnapshotRef.current = game;

  useEffect(() => {
    if (!isCpuTurn || isPaused) {
      setIsCpuThinking(false);
      return undefined;
    }

    let cancelled = false;
    const timers = [];
    setIsCpuThinking(true);

    const thinkTimer = setTimeout(() => {
      if (cancelled) return;
      const currentGame = gameSnapshotRef.current;
      const result = chooseCpuSequence(
        currentGame,
        currentGame.cpuConfig?.difficulty
      );

      if (cancelled || !result?.sequence) {
        setIsCpuThinking(false);
        return;
      }

      const seq = result.sequence;
      dispatch({ type: 'SELECT_OR_MOVE', row: seq.from.row, col: seq.from.col });

      seq.path.forEach((step, idx) => {
        const stepTimer = setTimeout(() => {
          if (cancelled) return;
          dispatch({ type: 'PLAY_STEP', destination: step });
          if (idx === seq.path.length - 1) {
            setIsCpuThinking(false);
          }
        }, 260 * (idx + 1));
        timers.push(stepTimer);
      });
    }, 320);

    timers.push(thinkTimer);

    return () => {
      cancelled = true;
      timers.forEach((id) => clearTimeout(id));
      setIsCpuThinking(false);
    };
  }, [isCpuTurn, isPaused, game.moveNumber]);

  const legalDestinations = useMemo(() => {
    if (!game.selected || isCpuTurn) {
      return [];
    }
    const partialPath = game.forcedSequence ? game.forcedSequence.path : [];
    return getLegalDestinations(game, game.selected.pieceId, partialPath);
  }, [game, isCpuTurn]);

  const movablePieceIds = useMemo(
    () => (isCpuTurn ? [] : getMovablePieceIds(game)),
    [game, isCpuTurn]
  );

  const hasMandatoryCapture = useMemo(
    () => game.legalTurnSequences.some((seq) => seq.isCapture),
    [game.legalTurnSequences]
  );

  const selectOrMove = useCallback(
    (row, col) => {
      if (isCpuTurn || isCpuThinking) {
        return;
      }
      dispatch({ type: 'SELECT_OR_MOVE', row, col });
    },
    [isCpuTurn, isCpuThinking]
  );

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const resign = useCallback(() => {
    dispatch({ type: 'RESIGN' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  const setMode = useCallback((mode, difficulty, cpuPlayer) => {
    dispatch({ type: 'SET_MODE', mode, difficulty, cpuPlayer });
  }, []);

  return {
    game,
    isCpuTurn,
    isCpuThinking,
    legalDestinations,
    movablePieceIds,
    hasMandatoryCapture,
    selectOrMove,
    restart,
    resign,
    toggleSound,
    setMode,
  };
}
