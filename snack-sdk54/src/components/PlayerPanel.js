import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PLAYERS } from '../game';
import { borders, colors, radius, spacing, typography } from '../theme';
import CheckerPiece from './CheckerPiece';

export default function PlayerPanel({
  capturedByPlayer,
  sessionWins,
  currentPlayer,
}) {
  return (
    <View style={styles.row}>
      <View
        style={[
          styles.card,
          currentPlayer === PLAYERS.CREAM && styles.cardActive,
        ]}
        accessibilityLabel={`Jogador 1 Marfim: ${capturedByPlayer[PLAYERS.CREAM]} capturadas, ${sessionWins[PLAYERS.CREAM]} vitórias`}
      >
        <CheckerPiece owner={PLAYERS.CREAM} kind="man" size={28} />
        <View style={styles.info}>
          <Text style={styles.playerName} numberOfLines={1}>
            Marfim (J1)
          </Text>
          <Text style={styles.scoreValue}>
            {capturedByPlayer[PLAYERS.CREAM]}
          </Text>
          <Text style={styles.winsLabel}>
            Vitórias: {sessionWins[PLAYERS.CREAM]}
          </Text>
        </View>
      </View>

      <Text style={styles.vs} accessible={false}>
        ×
      </Text>

      <View
        style={[
          styles.card,
          currentPlayer === PLAYERS.CHERRY && styles.cardActive,
        ]}
        accessibilityLabel={`Jogador 2 Cereja: ${capturedByPlayer[PLAYERS.CHERRY]} capturadas, ${sessionWins[PLAYERS.CHERRY]} vitórias`}
      >
        <CheckerPiece owner={PLAYERS.CHERRY} kind="man" size={28} />
        <View style={styles.info}>
          <Text style={styles.playerName} numberOfLines={1}>
            Cereja (J2)
          </Text>
          <Text style={styles.scoreValue}>
            {capturedByPlayer[PLAYERS.CHERRY]}
          </Text>
          <Text style={styles.winsLabel}>
            Vitórias: {sessionWins[PLAYERS.CHERRY]}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: spacing[2],
  },
  card: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    backgroundColor: colors.cardDark,
    borderRadius: radius.lg,
    borderWidth: borders.hairline,
    borderColor: 'rgba(244, 213, 164, 0.35)',
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2],
  },
  cardActive: {
    borderColor: colors.borderGold,
    borderWidth: borders.regular,
  },
  info: {
    flex: 1,
  },
  playerName: {
    ...typography.caption,
    color: colors.textOnDark,
  },
  scoreValue: {
    ...typography.score,
    fontSize: 20,
    lineHeight: 24,
    color: colors.surface,
  },
  winsLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.borderGold,
  },
  vs: {
    ...typography.h2,
    color: colors.crown,
    paddingHorizontal: 2,
  },
});
