import React from 'react';
import { StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CherryButton from './src/components/CherryButton';
import { CheckeredOrnament } from './src/components/CherryEmblem';
import CherryHeader from './src/components/CherryHeader';
import { borders, colors, radius, spacing, typography } from './src/theme';

export default function Tela4({ navigation }) {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <CherryHeader title="CRÉDITOS" onBack={() => navigation.goBack()} />

      <View style={[styles.content, isCompact && styles.contentCompact]}>
        <Text style={styles.title}>CRÉDITOS</Text>

        <View style={styles.card}>
          <View style={styles.infoBox}>
            <Text style={styles.developerText}>Desenvolvedor: WSP</Text>
          </View>

          <CherryButton
            title="VOLTAR"
            variant="primary"
            icon={<Text style={styles.backIcon}>←</Text>}
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          />
        </View>
      </View>

      <CheckeredOrnament showCenterCherry />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    gap: spacing[4],
  },
  contentCompact: {
    paddingHorizontal: spacing[4],
  },
  title: {
    ...typography.h1,
    color: colors.surface,
    textAlign: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: borders.regular,
    borderColor: colors.borderGold,
    padding: spacing[6],
    gap: spacing[5],
    alignItems: 'center',
  },
  infoBox: {
    width: '100%',
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    borderWidth: borders.hairline,
    borderColor: colors.borderLight,
    paddingVertical: spacing[5],
    paddingHorizontal: spacing[4],
    alignItems: 'center',
  },
  developerText: {
    ...typography.h2,
    color: colors.textOnLight,
    textAlign: 'center',
  },
  backBtn: {
    width: '100%',
  },
  backIcon: {
    color: colors.surface,
    fontSize: 16,
    fontWeight: '800',
  },
});
