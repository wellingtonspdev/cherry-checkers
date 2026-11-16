import React, { useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CherryButton from './src/components/CherryButton';
import {
  CheckeredOrnament,
  HeroEmblem,
} from './src/components/CherryEmblem';
import ModeSelectModal from './src/components/ModeSelectModal';
import { borders, colors, radius, spacing, typography } from './src/theme';

export default function Tela1({ navigation }) {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;
  const [modeModalOpen, setModeModalOpen] = useState(false);

  const handleStartGame = (modeConfig) => {
    setModeModalOpen(false);
    navigation.navigate('Jogo', modeConfig);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isCompact && styles.scrollContentCompact,
        ]}
        bounces={false}
      >
        <View style={styles.container}>
          <View style={styles.heroSection}>
            <HeroEmblem />
            <Text style={[styles.brandTop, isCompact && styles.brandTopCompact]}>
              CHERRY
            </Text>
            <View style={styles.brandRibbon}>
              <Text style={styles.brandBottom}>CHECKERS</Text>
            </View>
            <Text style={styles.subtitle}>
              Estratégia com sabor de vitória.
            </Text>
          </View>

          <View style={styles.actions}>
            <CherryButton
              title="JOGAR"
              variant="primary"
              icon={<Text style={styles.btnIconLight}>▶</Text>}
              onPress={() => setModeModalOpen(true)}
              accessibilityHint="Escolher modo 1 ou 2 jogadores e iniciar partida"
            />
            <CherryButton
              title="INSTRUÇÕES"
              variant="secondary"
              icon={<Text style={styles.btnIconDark}>▤</Text>}
              onPress={() => navigation.navigate('Instrucoes')}
              accessibilityHint="Abre as regras e instruções do jogo"
            />
            <CherryButton
              title="CRÉDITOS"
              variant="secondary"
              icon={<Text style={styles.btnIconDark}>◇</Text>}
              onPress={() => navigation.navigate('Creditos')}
              accessibilityHint="Exibe os créditos do projeto"
            />
          </View>
        </View>
      </ScrollView>
      <CheckeredOrnament />
      <ModeSelectModal
        visible={modeModalOpen}
        onClose={() => setModeModalOpen(false)}
        onStart={handleStartGame}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[6],
  },
  scrollContentCompact: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[4],
  },
  container: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
    gap: spacing[8],
  },
  heroSection: {
    alignItems: 'center',
    gap: spacing[2],
  },
  brandTop: {
    ...typography.display,
    color: colors.surface,
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: spacing[2],
  },
  brandTopCompact: {
    fontSize: 34,
    lineHeight: 40,
  },
  brandRibbon: {
    backgroundColor: colors.surfaceTint,
    borderRadius: radius.md,
    borderWidth: borders.hairline,
    borderColor: colors.borderGold,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[1],
  },
  brandBottom: {
    ...typography.h2,
    color: colors.textOnLight,
    letterSpacing: 2,
  },
  subtitle: {
    ...typography.body,
    color: colors.textOnDark,
    textAlign: 'center',
    marginTop: spacing[2],
  },
  actions: {
    width: '100%',
    gap: spacing[3],
  },
  btnIconLight: {
    color: colors.surface,
    fontSize: 15,
  },
  btnIconDark: {
    color: colors.textOnLight,
    fontSize: 16,
  },
});
