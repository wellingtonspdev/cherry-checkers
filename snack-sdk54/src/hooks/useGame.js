import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import {
  GAME_PHASES,
  createInitialGame,
  gameReducer,
  getLegalDestinations,
  getMovablePieceIds,
} from '../game';
import { useElapsedTime } from './useElapsedTime';
import { useSound } from './useSound';

export function useGame(isPaused = false) {
  const [game, dispatch] = useReducer(gameReducer, null, () => createInitialGame());
  const { playSound } = useSound(game.settings.soundEnabled);
  const prevEventRef = useRef(null);

  const isTimerActive = game.phase === GAME_PHASES.PLAYING && !isPaused;

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

  const legalDestinations = useMemo(() => {
    if (!game.selected) {
      return [];
    }
    const partialPath = game.forcedSequence ? game.forcedSequence.path : [];
    return getLegalDestinations(game, game.selected.pieceId, partialPath);
  }, [game]);

  const movablePieceIds = useMemo(() => getMovablePieceIds(game), [game]);

  const hasMandatoryCapture = useMemo(
    () => game.legalTurnSequences.some((seq) => seq.isCapture),
    [game.legalTurnSequences]
  );

  const selectOrMove = useCallback((row, col) => {
    dispatch({ type: 'SELECT_OR_MOVE', row, col });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: 'RESTART' });
  }, []);

  const resign = useCallback(() => {
    dispatch({ type: 'RESIGN' });
  }, []);

  const toggleSound = useCallback(() => {
    dispatch({ type: 'TOGGLE_SOUND' });
  }, []);

  return {
    game,
    legalDestinations,
    movablePieceIds,
    hasMandatoryCapture,
    selectOrMove,
    restart,
    resign,
    toggleSound,
  };
}
