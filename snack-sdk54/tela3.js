import React, { useCallback, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Board from './src/components/Board';
import CherryButton from './src/components/CherryButton';
import { CheckeredOrnament } from './src/components/CherryEmblem';
import CherryHeader from './src/components/CherryHeader';
import ConfirmModal from './src/components/ConfirmModal';
import GameResultModal from './src/components/GameResultModal';
import PlayerPanel from './src/components/PlayerPanel';
import TurnBanner from './src/components/TurnBanner';
import { GAME_PHASES } from './src/game';
import { useGame } from './src/hooks/useGame';
import { colors, radius, spacing, typography } from './src/theme';

export default function Tela3({ navigation, route }) {
  const { width, height } = useWindowDimensions();
  const isWide = width >= 700;
  const isCompact = width < 360;

  const [confirmRestartOpen, setConfirmRestartOpen] = useState(false);
  const [confirmExitOpen, setConfirmExitOpen] = useState(false);
  const [confirmResignOpen, setConfirmResignOpen] = useState(false);
  const [isPausedForInstructions, setIsPausedForInstructions] = useState(false);

  const isPaused =
    confirmRestartOpen ||
    confirmExitOpen ||
    confirmResignOpen ||
    isPausedForInstructions;

  const initialModeConfig = route?.params || null;

  const {
    game,
    isCpuTurn,
    isCpuThinking,
    legalDestinations,
    movablePieceIds,
    hasMandatoryCapture,
    selectOrMove,
    restart,
    resign,
    toggleSound,
  } = useGame(isPaused, initialModeConfig);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setIsPausedForInstructions(false);
    });
    return unsubscribe;
  }, [navigation]);

  const handleRequestBack = useCallback(() => {
    if (game.phase === GAME_PHASES.PLAYING && game.moveNumber > 1) {
      setConfirmExitOpen(true);
      return;
    }
    navigation.goBack();
  }, [game.phase, game.moveNumber, navigation]);

  const handleOpenInstructions = useCallback(() => {
    setIsPausedForInstructions(true);
    navigation.navigate('Instrucoes');
  }, [navigation]);

  const horizontalPadding = isCompact ? spacing[4] : spacing[5];
  const boardMaxByWidth = isWide
    ? Math.min(440, Math.floor(width * 0.48))
    : Math.min(440, width - horizontalPadding * 2);
  const boardMaxByHeight = Math.max(240, height - (isWide ? 160 : 350));
  const boardSize = Math.min(boardMaxByWidth, boardMaxByHeight);

  const statusToast = game.lastEvent?.promoted
    ? 'Dama coroada!'
    : game.lastEvent?.type === 'invalid_select'
    ? hasMandatoryCapture
      ? 'Existe captura obrigatória disponível.'
      : 'Esta peça não possui movimentos válidos.'
    : null;

  const controlsSection = (
    <View style={styles.controlsCol}>
      <TurnBanner
        currentPlayer={game.currentPlayer}
        elapsedMs={game.elapsedMs}
        hasMandatoryCapture={hasMandatoryCapture}
        isChainActive={Boolean(game.forcedSequence)}
        isCpuTurn={isCpuTurn}
        isCpuThinking={isCpuThinking}
      />

      {statusToast ? (
        <View style={styles.toast}>
          <Text style={styles.toastText}>{statusToast}</Text>
        </View>
      ) : null}

      <PlayerPanel
        capturedByPlayer={game.capturedByPlayer}
        sessionWins={game.sessionWins}
        currentPlayer={game.currentPlayer}
        mode={game.mode}
        cpuConfig={game.cpuConfig}
      />

      <View style={styles.actionStack}>
        <CherryButton
          title="REINICIAR PARTIDA"
          variant="primary"
          onPress={() => setConfirmRestartOpen(true)}
        />
        <View style={styles.secondaryActions}>
          <CherryButton
            title="INSTRUÇÕES"
            variant="secondary"
            onPress={handleOpenInstructions}
            style={styles.halfBtn}
          />
          <CherryButton
            title="DESISTIR"
            variant="danger"
            onPress={() => setConfirmResignOpen(true)}
            disabled={game.phase !== GAME_PHASES.PLAYING}
            style={styles.halfBtn}
          />
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <CherryHeader
        title="CHERRY CHECKERS"
        onBack={handleRequestBack}
        showSoundToggle
        soundEnabled={game.settings.soundEnabled}
        onToggleSound={toggleSound}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingHorizontal: horizontalPadding },
        ]}
      >
        {isWide ? (
          <View style={styles.wideLayout}>
            <View style={styles.boardCol}>
              <Board
                board={game.board}
                boardSize={boardSize}
                selected={game.selected}
                legalDestinations={legalDestinations}
                movablePieceIds={movablePieceIds}
                capturedIdsInChain={game.forcedSequence?.capturedIds || []}
                lastMove={game.lastMove}
                onSelectSquare={selectOrMove}
              />
            </View>
            <View style={styles.sideCol}>{controlsSection}</View>
          </View>
        ) : (
          <View style={styles.mobileLayout}>
            <TurnBanner
              currentPlayer={game.currentPlayer}
              elapsedMs={game.elapsedMs}
              hasMandatoryCapture={hasMandatoryCapture}
              isChainActive={Boolean(game.forcedSequence)}
              isCpuTurn={isCpuTurn}
              isCpuThinking={isCpuThinking}
            />

            {statusToast ? (
              <View style={styles.toast}>
                <Text style={styles.toastText}>{statusToast}</Text>
              </View>
            ) : null}

            <Board
              board={game.board}
              boardSize={boardSize}
              selected={game.selected}
              legalDestinations={legalDestinations}
              movablePieceIds={movablePieceIds}
              capturedIdsInChain={game.forcedSequence?.capturedIds || []}
              lastMove={game.lastMove}
              onSelectSquare={selectOrMove}
            />

            <PlayerPanel
              capturedByPlayer={game.capturedByPlayer}
              sessionWins={game.sessionWins}
              currentPlayer={game.currentPlayer}
              mode={game.mode}
              cpuConfig={game.cpuConfig}
            />

            <View style={styles.actionStack}>
              <CherryButton
                title="REINICIAR PARTIDA"
                variant="primary"
                onPress={() => setConfirmRestartOpen(true)}
              />
              <View style={styles.secondaryActions}>
                <CherryButton
                  title="INSTRUÇÕES"
                  variant="secondary"
                  onPress={handleOpenInstructions}
                  style={styles.halfBtn}
                />
                <CherryButton
                  title="DESISTIR"
                  variant="danger"
                  onPress={() => setConfirmResignOpen(true)}
                  disabled={game.phase !== GAME_PHASES.PLAYING}
                  style={styles.halfBtn}
                />
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      <CheckeredOrnament />

      <ConfirmModal
        visible={confirmRestartOpen}
        title="Reiniciar partida?"
        message="Reiniciar a partida? O progresso atual será perdido."
        confirmLabel="Reiniciar"
        onCancel={() => setConfirmRestartOpen(false)}
        onConfirm={() => {
          setConfirmRestartOpen(false);
          restart();
        }}
      />

      <ConfirmModal
        visible={confirmExitOpen}
        title="Sair da partida?"
        message="Sair da partida? O jogo em andamento será encerrado."
        confirmLabel="Sair"
        onCancel={() => setConfirmExitOpen(false)}
        onConfirm={() => {
          setConfirmExitOpen(false);
          navigation.goBack();
        }}
      />

      <ConfirmModal
        visible={confirmResignOpen}
        title="Confirmar desistência?"
        message="Ao desistir, a vitória será atribuída ao adversário."
        confirmLabel="Desistir"
        onCancel={() => setConfirmResignOpen(false)}
        onConfirm={() => {
          setConfirmResignOpen(false);
          resign();
        }}
      />

      <GameResultModal
        visible={game.phase === GAME_PHASES.FINISHED}
        winner={game.winner}
        winReason={game.winReason}
        drawReason={game.drawReason}
        elapsedMs={game.elapsedMs}
        onPlayAgain={restart}
        onGoHome={() => navigation.navigate('BoasVindas')}
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
    alignItems: 'center',
    paddingVertical: spacing[2],
  },
  mobileLayout: {
    width: '100%',
    maxWidth: 440,
    alignItems: 'center',
    gap: spacing[3],
  },
  wideLayout: {
    width: '100%',
    maxWidth: 900,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[6],
    paddingVertical: spacing[3],
  },
  boardCol: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideCol: {
    flex: 1,
    maxWidth: 380,
  },
  controlsCol: {
    width: '100%',
    gap: spacing[4],
  },
  actionStack: {
    width: '100%',
    gap: spacing[2],
  },
  secondaryActions: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  halfBtn: {
    flex: 1,
  },
  toast: {
    backgroundColor: colors.surfaceTint,
    borderRadius: radius.pill,
    paddingHorizontal: spacing[3],
    paddingVertical: 4,
  },
  toastText: {
    ...typography.caption,
    color: colors.textOnLight,
    fontWeight: '700',
  },
});
