import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import CherryButton from './src/components/CherryButton';
import { CheckeredOrnament } from './src/components/CherryEmblem';
import CherryHeader from './src/components/CherryHeader';
import RulesIllustration from './src/components/RulesIllustration';
import { borders, colors, radius, spacing, typography } from './src/theme';

const RULE_CARDS = [
  {
    id: 'move',
    title: 'Movimente',
    text: 'Tabuleiro 8×8 com 12 peças por lado nas casas escuras. Marfim começa. A pedra anda uma casa na diagonal para frente.',
    illustration: 'move',
  },
  {
    id: 'capture',
    title: 'Capture',
    text: 'Salte sobre a peça adversária para casa livre logo atrás. Pedras comuns também capturam para trás.',
    illustration: 'capture',
  },
  {
    id: 'majority',
    title: 'Captura Obrigatória e Maioria',
    text: 'Capturar é obrigatório. Pela Lei da Maioria, você deve escolher a sequência que captura o maior número de peças.',
    illustration: 'majority',
  },
  {
    id: 'king',
    title: 'Vire Dama',
    text: 'Ao terminar o lance na última linha adversária, a pedra vira Dama (♛) e pode percorrer e capturar à distância nas diagonais.',
    illustration: 'king',
  },
];

export default function Tela2({ navigation }) {
  const { width } = useWindowDimensions();
  const isCompact = width < 360;

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <CherryHeader title="COMO JOGAR" onBack={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          isCompact && styles.scrollContentCompact,
        ]}
      >
        <View style={styles.container}>
          <Text style={styles.pageTitle}>COMO JOGAR</Text>
          <View style={styles.ribbon}>
            <Text style={styles.ribbonText}>
              Damas brasileiras • 1 ou 2 jogadores • 8×8
            </Text>
          </View>

          <View style={styles.mainCard}>
            {RULE_CARDS.map((card) => (
              <View key={card.id} style={styles.ruleItem}>
                <RulesIllustration type={card.illustration} />
                <View style={styles.ruleBody}>
                  <Text style={styles.ruleTitle}>{card.title}</Text>
                  <Text style={styles.ruleText}>{card.text}</Text>
                </View>
              </View>
            ))}

            <View style={styles.textBlock}>
              <Text style={styles.ruleTitle}>Vitória e Empate</Text>
              <Text style={styles.ruleText}>
                Vence quem eliminar todas as peças ou bloquear os movimentos do
                adversário. Empates seguem o regulamento brasileiro (CODEX CBD):
                repetição tripla de posição, 20 lances sucessivos só de damas sem
                captura, ou finais reduzidos.
              </Text>
            </View>

            <View style={styles.textBlock}>
              <Text style={styles.ruleTitle}>Controles e Modos</Text>
              <Text style={styles.ruleText}>
                Jogue contra a CPU (Fácil, Médio, Difícil ou Mestre) ou com 2
                jogadores locais. Toque em uma peça destacada e depois no
                destino iluminado. Use o topo da tela para silenciar sons,
                reiniciar ou encerrar.
              </Text>
            </View>

            <CherryButton
              title="COMEÇAR PARTIDA"
              variant="primary"
              icon={<Text style={styles.playIcon}>▶</Text>}
              onPress={() => navigation.navigate('Jogo')}
            />
          </View>
        </View>
      </ScrollView>

      <CheckeredOrnament />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.page,
  },
  scrollContent: {
    paddingHorizontal: spacing[5],
    paddingBottom: spacing[6],
    alignItems: 'center',
  },
  scrollContentCompact: {
    paddingHorizontal: spacing[4],
  },
  container: {
    width: '100%',
    maxWidth: 640,
    alignItems: 'center',
    gap: spacing[3],
  },
  pageTitle: {
    ...typography.h1,
    color: colors.surface,
    textAlign: 'center',
  },
  ribbon: {
    backgroundColor: colors.surfaceTint,
    borderRadius: radius.md,
    borderWidth: borders.hairline,
    borderColor: colors.borderGold,
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[1],
    marginBottom: spacing[1],
  },
  ribbonText: {
    ...typography.caption,
    color: colors.textOnLight,
    fontWeight: '700',
  },
  mainCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: radius.xl,
    borderWidth: borders.regular,
    borderColor: colors.borderGold,
    padding: spacing[4],
    gap: spacing[3],
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    borderWidth: borders.hairline,
    borderColor: colors.borderLight,
    padding: spacing[3],
  },
  ruleBody: {
    flex: 1,
    gap: 2,
  },
  ruleTitle: {
    ...typography.h3,
    fontSize: 16,
    color: colors.textOnLight,
  },
  ruleText: {
    ...typography.body,
    fontSize: 14,
    lineHeight: 20,
    color: colors.textMuted,
  },
  textBlock: {
    backgroundColor: colors.surfaceSoft,
    borderRadius: radius.lg,
    borderWidth: borders.hairline,
    borderColor: colors.borderLight,
    padding: spacing[3],
    gap: 4,
  },
  playIcon: {
    color: colors.surface,
    fontSize: 14,
  },
});
