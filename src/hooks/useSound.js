import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';

let Haptics = null;
try {
  // Optional extra: degrades safely if unavailable in Snack or web
  Haptics = require('expo-haptics');
} catch {
  Haptics = null;
}

function playWebTone(kind) {
  if (typeof window === 'undefined') {
    return;
  }
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) {
    return;
  }

  try {
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playNote = (freq, startOffset, duration, type = 'sine', gainVal = 0.12) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now + startOffset);
      gain.gain.setValueAtTime(gainVal, now + startOffset);
      gain.gain.exponentialRampToValueAtTime(0.001, now + startOffset + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now + startOffset);
      osc.stop(now + startOffset + duration);
    };

    if (kind === 'select') {
      playNote(520, 0, 0.06, 'triangle', 0.08);
    } else if (kind === 'move') {
      playNote(320, 0, 0.08, 'sine', 0.12);
    } else if (kind === 'capture') {
      playNote(440, 0, 0.07, 'triangle', 0.14);
      playNote(620, 0.06, 0.1, 'triangle', 0.12);
    } else if (kind === 'king') {
      playNote(523.25, 0, 0.1, 'triangle', 0.12);
      playNote(659.25, 0.09, 0.1, 'triangle', 0.12);
      playNote(783.99, 0.18, 0.18, 'triangle', 0.14);
    } else if (kind === 'win') {
      playNote(523.25, 0, 0.12, 'triangle', 0.14);
      playNote(659.25, 0.11, 0.12, 'triangle', 0.14);
      playNote(783.99, 0.22, 0.12, 'triangle', 0.14);
      playNote(1046.5, 0.34, 0.28, 'triangle', 0.16);
    }

    setTimeout(() => {
      if (ctx.state !== 'closed') {
        ctx.close().catch(() => {});
      }
    }, 800);
  } catch {
    // Ignore audio errors safely
  }
}

export function useSound(soundEnabled) {
  const enabledRef = useRef(soundEnabled);
  enabledRef.current = soundEnabled;

  const triggerHaptic = useCallback((kind) => {
    if (!Haptics || Platform.OS === 'web') {
      return;
    }
    try {
      if (kind === 'capture' || kind === 'king') {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
      } else if (kind === 'win') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => {});
      } else if (kind === 'select') {
        Haptics.selectionAsync().catch(() => {});
      }
    } catch {
      // Ignore haptic errors safely
    }
  }, []);

  const playSound = useCallback(
    (kind) => {
      triggerHaptic(kind);
      if (!enabledRef.current) {
        return;
      }
      if (Platform.OS === 'web') {
        playWebTone(kind);
      }
    },
    [triggerHaptic]
  );

  return { playSound };
}
