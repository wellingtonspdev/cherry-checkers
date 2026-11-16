import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PIECE_KINDS, PLAYERS } from '../game';
import { borders, colors, radius } from '../theme';
import CheckerPiece from './CheckerPiece';

export default function RulesIllustration({ type }) {
  const cellSize = 26;

  if (type === 'king') {
    return (
      <View style={styles.kingBox}>
        <CheckerPiece owner={PLAYERS.CHERRY} kind={PIECE_KINDS.KING} size={50} />
        <Text style={styles.kingCaption}>♛ Dama</Text>
      </View>
    );
  }

  const grid = [0, 1, 2];

  return (
    <View style={styles.miniBoard}>
      {grid.map((row) => (
        <View key={row} style={styles.row}>
          {grid.map((col) => {
            const isDark = (row + col) % 2 === 1;
            let piece = null;
            let isTarget = false;

            if (type === 'move') {
              if (row === 2 && col === 1) {
                piece = { owner: PLAYERS.CREAM, kind: PIECE_KINDS.MAN };
              }
              if (row === 1 && col === 2) {
                isTarget = true;
              }
            } else if (type === 'capture') {
              if (row === 0 && col === 1) {
                piece = { owner: PLAYERS.CHERRY, kind: PIECE_KINDS.MAN };
              }
              if (row === 1 && col === 2) {
                piece = { owner: PLAYERS.CREAM, kind: PIECE_KINDS.MAN };
              }
              if (row === 2 && col === 1) {
                isTarget = true;
              }
            } else if (type === 'majority') {
              if (row === 2 && col === 1) {
                piece = { owner: PLAYERS.CREAM, kind: PIECE_KINDS.MAN };
              }
              if (row === 1 && col === 2) {
                piece = { owner: PLAYERS.CHERRY, kind: PIECE_KINDS.MAN };
              }
              if (row === 0 && col === 1) {
                isTarget = true;
              }
            }

            return (
              <View
                key={`${row}-${col}`}
                style={[
                  styles.cell,
                  {
                    width: cellSize,
                    height: cellSize,
                    backgroundColor: isDark
                      ? colors.boardDark
                      : colors.boardLight,
                  },
                ]}
              >
                {piece ? (
                  <CheckerPiece
                    owner={piece.owner}
                    kind={piece.kind}
                    size={20}
                  />
                ) : null}
                {isTarget ? <View style={styles.targetBox} /> : null}
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  miniBoard: {
    borderRadius: radius.sm,
    borderWidth: borders.regular,
    borderColor: colors.boardBorder,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetBox: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: colors.allowedMove,
    borderWidth: 1.5,
    borderColor: colors.pageDeep,
  },
  kingBox: {
    width: 82,
    height: 82,
    borderRadius: radius.md,
    backgroundColor: colors.boardLight,
    borderWidth: borders.regular,
    borderColor: colors.boardBorder,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  kingCaption: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.textOnLight,
  },
});
