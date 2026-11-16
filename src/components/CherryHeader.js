import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { borders, colors, radius, spacing, typography } from '../theme';
import { CherryIcon } from './CherryEmblem';

export default function CherryHeader({
  onBack,
  title = 'CHERRY CHECKERS',
  showSoundToggle = false,
  soundEnabled = true,
  onToggleSound,
}) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack}
        accessibilityRole="button"
        accessibilityLabel="Voltar"
        accessibilityHint="Retorna para a tela anterior"
        style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
      >
        <Text style={styles.backChevron}>‹</Text>
      </Pressable>

      <View style={styles.center}>
        <CherryIcon size={22} />
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
      </View>

      {showSoundToggle ? (
        <Pressable
          onPress={onToggleSound}
          accessibilityRole="button"
          accessibilityLabel={soundEnabled ? 'Silenciar sons' : 'Ativar sons'}
          accessibilityState={{ checked: soundEnabled }}
          style={({ pressed }) => [styles.iconBtn, pressed && styles.iconBtnPressed]}
        >
          <Text style={styles.soundText}>{soundEnabled ? '♪' : '✕'}</Text>
        </Pressable>
      ) : (
        <View style={styles.spacer} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[2],
    minHeight: 54,
  },
  iconBtn: {
    width: 44,
    height: 44,
    borderRadius: radius.md,
    backgroundColor: colors.cardDark,
    borderWidth: borders.hairline,
    borderColor: colors.borderGold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBtnPressed: {
    backgroundColor: colors.primaryPressed,
  },
  backChevron: {
    color: colors.textOnDark,
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 30,
    marginTop: -2,
  },
  soundText: {
    color: colors.textOnDark,
    fontSize: 18,
    fontWeight: '800',
  },
  center: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
  },
  title: {
    ...typography.label,
    color: colors.textOnDark,
    letterSpacing: 0.8,
  },
  spacer: {
    width: 44,
    height: 44,
  },
});
