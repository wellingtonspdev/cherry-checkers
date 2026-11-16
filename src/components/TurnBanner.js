import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PLAYERS } from '../game';
import { borders, colors, radius, spacing, typography } from '../theme';
import { formatElapsedTime } from '../utils/formatTime';
import CheckerPiece from './CheckerPiece';

export default function TurnBanner({
  currentPlayer,
  elapsedMs,
  hasMandatoryCapture,
  isChainActive,
}) {
  const isCream = currentPlayer === PLAYERS.CREAM;
  const turnLabel = isCream ? 'VEZ DO MARFIM' : 'VEZ DO CEREJA';

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <View
          style={[
            styles.turnPill,
            isCream ? styles.turnPillCream : styles.turnPillCherry,
            hasMandatoryCapture && styles.turnPillCapture,
          ]}
          accessibilityRole="text"
          accessibilityLabel={`Turno atual: ${turnLabel}${
            hasMandatoryCapture ? '. Captura obrigatória' : ''
          }`}
        >
          <CheckerPiece owner={currentPlayer} kind="man" size={22} />
          <Text
            style={[
              styles.turnText,
              isCream ? styles.turnTextCream : styles.turnTextCherry,
            ]}
            numberOfLines={1}
          >
            {turnLabel}
          </Text>
        </View>

        <View
          style={styles.timerPill}
          accessibilityLabel={`Tempo decorrido: ${formatElapsedTime(elapsedMs)}`}
        >
          <Text style={styles.timerIcon}>⏱</Text>
          <Text style={styles.timerText}>{formatElapsedTime(elapsedMs)}</Text>
        </View>
      </View>

      {hasMandatoryCapture ? (
        <View style={styles.captureAlert}>
          <Text style={styles.captureAlertText}>
            {isChainActive
              ? 'Continue a sequência de captura!'
              : 'Captura obrigatória!'}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: spacing[2],
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing[2],
  },
  turnPill: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
    borderRadius: radius.pill,
    borderWidth: borders.regular,
  },
  turnPillCream: {
    backgroundColor: colors.crownLight,
    borderColor: colors.crown,
  },
  turnPillCherry: {
    backgroundColor: colors.primary,
    borderColor: colors.borderGold,
  },
  turnPillCapture: {
    borderColor: colors.surface,
  },
  turnText: {
    ...typography.label,
    fontSize: 14,
    letterSpacing: 0.5,
  },
  turnTextCream: {
    color: colors.textOnLight,
  },
  turnTextCherry: {
    color: colors.surface,
  },
  timerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
    backgroundColor: colors.pageDeep,
    borderWidth: borders.hairline,
    borderColor: colors.borderGold,
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  timerIcon: {
    fontSize: 14,
    color: colors.borderGold,
  },
  timerText: {
    ...typography.timer,
    color: colors.textOnDark,
  },
  captureAlert: {
    alignSelf: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
    borderWidth: borders.hairline,
    borderColor: colors.crown,
  },
  captureAlertText: {
    ...typography.caption,
    color: colors.textOnLight,
    fontWeight: '800',
  },
});
