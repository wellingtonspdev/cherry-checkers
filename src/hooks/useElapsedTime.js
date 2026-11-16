import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';

export function useElapsedTime(isActive, onTick) {
  const onTickRef = useRef(onTick);
  onTickRef.current = onTick;

  const appStateRef = useRef(AppState.currentState);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (nextState) => {
      appStateRef.current = nextState;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!isActive) {
      return undefined;
    }

    const interval = setInterval(() => {
      if (appStateRef.current === 'active') {
        onTickRef.current(1000);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive]);
}
