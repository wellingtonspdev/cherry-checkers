import React from 'react';
import { Modal, StyleSheet, Text, View } from 'react-native';
import { borders, colors, radius, spacing, typography } from '../theme';
import CherryButton from './CherryButton';

export default function ConfirmModal({
  visible,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.card} accessibilityViewIsModal>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>
          <View style={styles.actions}>
            <CherryButton
              title={cancelLabel}
              variant="secondary"
              onPress={onCancel}
              style={styles.btn}
            />
            <CherryButton
              title={confirmLabel}
              variant="primary"
              onPress={onConfirm}
              style={styles.btn}
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
    borderWidth: borders.regular,
    borderColor: colors.borderGold,
    padding: spacing[6],
    gap: spacing[4],
  },
  title: {
    ...typography.h2,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  message: {
    ...typography.body,
    color: colors.textMuted,
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing[3],
  },
  btn: {
    flex: 1,
  },
});
