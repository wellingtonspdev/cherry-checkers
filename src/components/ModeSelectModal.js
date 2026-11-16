import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { CPU_DIFFICULTIES, GAME_MODES, PLAYERS } from '../game';
import { DIFFICULTY_PROFILES } from '../game/ai';
import { borders, colors, radius, spacing, typography } from '../theme';
import CheckerPiece from './CheckerPiece';
import CherryButton from './CherryButton';

const DIFFICULTIES = [
  DIFFICULTY_PROFILES[CPU_DIFFICULTIES.EASY],
  DIFFICULTY_PROFILES[CPU_DIFFICULTIES.MEDIUM],
  DIFFICULTY_PROFILES[CPU_DIFFICULTIES.HARD],
  DIFFICULTY_PROFILES[CPU_DIFFICULTIES.MASTER],
];

export default function ModeSelectModal({ visible, onClose, onStart }) {
  const [selectedMode, setSelectedMode] = useState(GAME_MODES.CPU);
  const [difficulty, setDifficulty] = useState(CPU_DIFFICULTIES.MEDIUM);
  const [humanColor, setHumanColor] = useState(PLAYERS.CREAM);

  const handleConfirm = () => {
    const cpuPlayer =
      humanColor === PLAYERS.CREAM ? PLAYERS.CHERRY : PLAYERS.CREAM;
    onStart({
      mode: selectedMode,
      difficulty,
      cpuPlayer,
    });
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card} accessibilityViewIsModal>
          <ScrollView bounces={false} contentContainerStyle={styles.cardInner}>
            <Text style={styles.title}>Modo de Jogo</Text>

            <View style={styles.modeRow}>
              <Pressable
                onPress={() => setSelectedMode(GAME_MODES.CPU)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedMode === GAME_MODES.CPU }}
                style={[
                  styles.modeCard,
                  selectedMode === GAME_MODES.CPU && styles.modeCardActive,
                ]}
              >
                <Text style={styles.modeTitle}>1 Jogador</Text>
                <Text style={styles.modeSub}>Contra a CPU</Text>
              </Pressable>

              <Pressable
                onPress={() => setSelectedMode(GAME_MODES.PVP)}
                accessibilityRole="button"
                accessibilityState={{ selected: selectedMode === GAME_MODES.PVP }}
                style={[
                  styles.modeCard,
                  selectedMode === GAME_MODES.PVP && styles.modeCardActive,
                ]}
              >
                <Text style={styles.modeTitle}>2 Jogadores</Text>
                <Text style={styles.modeSub}>Mesmo aparelho</Text>
              </Pressable>
            </View>

            {selectedMode === GAME_MODES.CPU ? (
              <View style={styles.cpuSection}>
                <Text style={styles.sectionLabel}>Dificuldade da CPU</Text>
                <View style={styles.diffGrid}>
                  {DIFFICULTIES.map((item) => {
                    const active = difficulty === item.id;
                    return (
                      <Pressable
                        key={item.id}
                        onPress={() => setDifficulty(item.id)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: active }}
                        style={[styles.diffPill, active && styles.diffPillActive]}
                      >
                        <Text
                          style={[
                            styles.diffLabel,
                            active && styles.diffLabelActive,
                          ]}
                        >
                          {item.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
                <Text style={styles.diffDesc}>
                  {DIFFICULTY_PROFILES[difficulty].description}
                </Text>

                <Text style={styles.sectionLabel}>Sua cor (Marfim começa)</Text>
                <View style={styles.colorRow}>
                  <Pressable
                    onPress={() => setHumanColor(PLAYERS.CREAM)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: humanColor === PLAYERS.CREAM }}
                    style={[
                      styles.colorBtn,
                      humanColor === PLAYERS.CREAM && styles.colorBtnActive,
                    ]}
                  >
                    <CheckerPiece owner={PLAYERS.CREAM} kind="man" size={24} />
                    <Text style={styles.colorText}>Marfim (1º)</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setHumanColor(PLAYERS.CHERRY)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: humanColor === PLAYERS.CHERRY }}
                    style={[
                      styles.colorBtn,
                      humanColor === PLAYERS.CHERRY && styles.colorBtnActive,
                    ]}
                  >
                    <CheckerPiece owner={PLAYERS.CHERRY} kind="man" size={24} />
                    <Text style={styles.colorText}>Cereja (2º)</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            <View style={styles.actions}>
              <CherryButton
                title="CANCELAR"
                variant="secondary"
                onPress={onClose}
                style={styles.btn}
              />
              <CherryButton
                title="INICIAR"
                variant="primary"
                onPress={handleConfirm}
                style={styles.btn}
              />
            </View>
          </ScrollView>
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
    padding: spacing[4],
  },
  card: {
    width: '100%',
    maxWidth: 420,
    maxHeight: '90%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: borders.regular,
    borderColor: colors.borderGold,
    overflow: 'hidden',
  },
  cardInner: {
    padding: spacing[5],
    gap: spacing[4],
  },
  title: {
    ...typography.h2,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  modeRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  modeCard: {
    flex: 1,
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    borderWidth: borders.regular,
    borderColor: colors.borderLight,
    padding: spacing[3],
    alignItems: 'center',
    gap: 2,
  },
  modeCardActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceTint,
  },
  modeTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textOnLight,
  },
  modeSub: {
    ...typography.caption,
    color: colors.textMuted,
  },
  cpuSection: {
    gap: spacing[2],
  },
  sectionLabel: {
    ...typography.caption,
    color: colors.textOnLight,
    fontWeight: '800',
    marginTop: spacing[1],
  },
  diffGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[2],
  },
  diffPill: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radius.md,
    borderWidth: borders.hairline,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceSoft,
    alignItems: 'center',
  },
  diffPillActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  diffLabel: {
    ...typography.label,
    fontSize: 14,
    color: colors.textOnLight,
  },
  diffLabelActive: {
    color: colors.surface,
  },
  diffDesc: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  colorRow: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  colorBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[3],
    borderRadius: radius.md,
    borderWidth: borders.regular,
    borderColor: colors.borderLight,
    backgroundColor: colors.surfaceSoft,
  },
  colorBtnActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceTint,
  },
  colorText: {
    ...typography.caption,
    color: colors.textOnLight,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
    marginTop: spacing[1],
  },
  btn: {
    flex: 1,
  },
});
