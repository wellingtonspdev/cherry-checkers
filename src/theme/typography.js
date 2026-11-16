import { Platform } from 'react-native';

const fontFamily = Platform.select({
  ios: 'System',
  android: 'sans-serif',
  default: 'System',
});

export const typography = {
  display: {
    fontFamily,
    fontSize: 40,
    fontWeight: '900',
    lineHeight: 46,
    letterSpacing: 1,
  },
  h1: {
    fontFamily,
    fontSize: 30,
    fontWeight: '800',
    lineHeight: 36,
    letterSpacing: 0.5,
  },
  h2: {
    fontFamily,
    fontSize: 22,
    fontWeight: '800',
    lineHeight: 28,
  },
  h3: {
    fontFamily,
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
  },
  body: {
    fontFamily,
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 22,
  },
  label: {
    fontFamily,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  caption: {
    fontFamily,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 17,
  },
  score: {
    fontFamily,
    fontSize: 26,
    fontWeight: '800',
    lineHeight: 32,
    fontVariant: ['tabular-nums'],
  },
  timer: {
    fontFamily,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
    fontVariant: ['tabular-nums'],
  },
};
