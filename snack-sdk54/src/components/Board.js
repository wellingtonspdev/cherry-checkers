import React from 'react';
import { StyleSheet, View } from 'react-native';
import { BOARD_SIZE } from '../game';
import { borders, colors, radius } from '../theme';
import BoardCell from './BoardCell';

export default function Board({
  board,
  boardSize,
  selected,
  legalDestinations,
  movablePieceIds,
  capturedIdsInChain = [],
  lastMove,
  onSelectSquare,
}) {
  const innerSize = boardSize - borders.focus * 2;
  const cellSize = Math.floor(innerSize / BOARD_SIZE);
  const exactInnerSize = cellSize * BOARD_SIZE;

  const destMap = new Map();
  for (const dest of legalDestinations) {
    destMap.set(`${dest.row},${dest.col}`, dest);
  }

  return (
    <View
      style={[
        styles.frame,
        {
          width: exactInnerSize + borders.focus * 2,
          height: exactInnerSize + borders.focus * 2,
        },
      ]}
    >
      <View
        style={[
          styles.grid,
          {
            width: exactInnerSize,
            height: exactInnerSize,
          },
        ]}
      >
        {board.map((rowArr, rowIdx) => (
          <View key={rowIdx} style={styles.row}>
            {rowArr.map((piece, colIdx) => {
              const dest = destMap.get(`${rowIdx},${colIdx}`);
              const isSelected =
                selected &&
                selected.row === rowIdx &&
                selected.col === colIdx;
              const isMovable =
                Boolean(piece) && movablePieceIds.includes(piece.id);
              const isCapturedInChain =
                Boolean(piece) && capturedIdsInChain.includes(piece.id);
              const isLastMoveSquare =
                lastMove &&
                ((lastMove.from.row === rowIdx && lastMove.from.col === colIdx) ||
                  (lastMove.to.row === rowIdx && lastMove.to.col === colIdx));

              return (
                <BoardCell
                  key={`${rowIdx}-${colIdx}`}
                  row={rowIdx}
                  col={colIdx}
                  cellSize={cellSize}
                  piece={piece}
                  isSelected={Boolean(isSelected)}
                  isMovable={isMovable}
                  isDestination={Boolean(dest)}
                  isCaptureDest={Boolean(dest?.isCapture)}
                  isCapturedInChain={isCapturedInChain}
                  isLastMoveSquare={Boolean(isLastMoveSquare)}
                  onPress={onSelectSquare}
                />
              );
            })}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    borderRadius: radius.board,
    borderWidth: borders.focus,
    borderColor: colors.boardBorder,
    backgroundColor: colors.boardBorder,
    overflow: 'hidden',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  grid: {
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});
