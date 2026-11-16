import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { PLAYERS } from '../game';
import { borders, colors, radius, spacing, typography } from '../theme';
import { formatElapsedTime } from '../utils/formatTime';
import CheckerPiece from './CheckerPiece';
import CherryButton from './CherryButton';

const REASON_LABELS = {
  elimination: 'Todas as peças adversárias foram capturadas.',
  blocked: 'O adversário ficou sem movimentos legais.',
  resignation: 'Partida encerrada por desistência.',
  repetition: 'Empate por repetição tripla de posição.',
  twenty_moves: 'Empate pela regra de 20 lances sem captura ou movimento de pedra.',
  reduced_endgame: 'Empate em final reduzido conforme regulamento.',
};

export default function GameResultModal({
  visible,
  winner,
  winReason,
  drawReason,
  elapsedMs,
  onPlayAgain,
  onGoHome,
}) {
  const isDraw = !winner;
  const title = isDraw
    ? 'Empate!'
    : winner === PLAYERS.CREAM
    ? 'Vitória do Marfim!'
    : 'Vitória do Cereja!';

  const reasonText =
    REASON_LABELS[winReason || drawReason] || 'Partida encerrada.';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onPlayAgain}
    >
      <View style={styles.overlay}>
        <View style={styles.card} accessibilityViewIsModal>
          <View style={styles.badge}>
            {isDraw ? (
              <View style={styles.drawRow}>
                <CheckerPiece owner={PLAYERS.CREAM} kind="king" size={44} />
                <CheckerPiece owner={PLAYERS.CHERRY} kind="king" size={44} />
              </View>
            ) : (
              <CheckerPiece owner={winner} kind="king" size={56} />
            )}
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.reason}>{reasonText}</Text>
          <Text style={styles.time}>
            Tempo de partida: {formatElapsedTime(elapsedMs)}
          </Text>

          <View style={styles.actions}>
            <CherryButton
              title="JOGAR NOVAMENTE"
              variant="primary"
              onPress={onPlayAgain}
            />
            <CherryButton
              title="VOLTAR AO INÍCIO"
              variant="secondary"
              onPress={onGoHome}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing[5],
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: borders.focus,
    borderColor: colors.crown,
    padding: spacing[6],
    alignItems: 'center',
    gap: spacing[3],
  },
  badge: {
    marginBottom: spacing[1],
  },
  drawRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  title: {
    ...typography.h1,
    fontSize: 26,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  reason: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  time: {
    ...typography.caption,
    color: colors.textOnLight,
    fontWeight: '700',
  },
  actions: {
    width: '100%',
    gap: spacing[3],
    marginTop: spacing[2],
  },
});
