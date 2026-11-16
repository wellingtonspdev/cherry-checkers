import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { PIECE_KINDS, PLAYERS, isPlayableSquare } from '../game';
import { colors } from '../theme';
import CheckerPiece from './CheckerPiece';

function buildAccessibilityLabel({
  row,
  col,
  piece,
  isSelected,
  isDestination,
  isCaptureDest,
  isMovable,
}) {
  const pos = `linha ${row + 1}, coluna ${col + 1}`;
  if (isCaptureDest) {
    return `Capturar na ${pos}`;
  }
  if (isDestination) {
    return `Mover para ${pos}`;
  }
  if (piece) {
    const kindLabel = piece.kind === PIECE_KINDS.KING ? 'Dama' : 'Pedra';
    const ownerLabel = piece.owner === PLAYERS.CREAM ? 'marfim' : 'cereja';
    const stateLabel = isSelected
      ? '; selecionada'
      : isMovable
      ? '; pode mover'
      : '';
    return `${kindLabel} ${ownerLabel} em ${pos}${stateLabel}`;
  }
  return `Casa ${isPlayableSquare(row, col) ? 'escura' : 'clara'} em ${pos}`;
}

export default function BoardCell({
  row,
  col,
  cellSize,
  piece,
  isSelected,
  isMovable,
  isDestination,
  isCaptureDest,
  isCapturedInChain,
  isLastMoveSquare,
  onPress,
}) {
  const playable = isPlayableSquare(row, col);
  const pieceSize = Math.round(cellSize * 0.76);
  const dotSize = Math.round(cellSize * 0.34);

  return (
    <Pressable
      onPress={() => onPress(row, col)}
      accessibilityRole="button"
      accessibilityLabel={buildAccessibilityLabel({
        row,
        col,
        piece,
        isSelected,
        isDestination,
        isCaptureDest,
        isMovable,
      })}
      style={[
        styles.cell,
        {
          width: cellSize,
          height: cellSize,
          backgroundColor: playable ? colors.boardDark : colors.boardLight,
        },
        isLastMoveSquare && styles.lastMove,
        isSelected && styles.selectedCell,
      ]}
    >
      {piece ? (
        <CheckerPiece
          owner={piece.owner}
          kind={piece.kind}
          size={pieceSize}
          selected={isSelected}
          movable={isMovable}
          captured={isCapturedInChain}
        />
      ) : null}

      {isDestination ? (
        <View
          style={[
            isCaptureDest ? styles.captureMarker : styles.moveMarker,
            {
              width: isCaptureDest ? Math.round(cellSize * 0.62) : dotSize,
              height: isCaptureDest ? Math.round(cellSize * 0.62) : dotSize,
              borderRadius: cellSize / 2,
            },
          ]}
          pointerEvents="none"
        >
          {isCaptureDest ? <View style={styles.captureInnerDot} /> : null}
        </View>
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  selectedCell: {
    backgroundColor: '#A92848',
  },
  lastMove: {
    borderWidth: 1,
    borderColor: 'rgba(244, 213, 164, 0.45)',
  },
  moveMarker: {
    backgroundColor: colors.allowedMove,
    borderWidth: 2,
    borderColor: colors.pageDeep,
    opacity: 0.92,
  },
  captureMarker: {
    borderWidth: 3,
    borderStyle: 'dashed',
    borderColor: colors.mandatoryCapture,
    backgroundColor: 'rgba(244, 213, 164, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureInnerDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.mandatoryCapture,
  },
});
