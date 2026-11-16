import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { PIECE_KINDS, PLAYERS } from '../game';
import { colors } from '../theme';

export default function CheckerPiece({
  owner,
  kind,
  size,
  selected = false,
  movable = false,
  captured = false,
}) {
  const isCherry = owner === PLAYERS.CHERRY;
  const isKing = kind === PIECE_KINDS.KING;
  const innerSize = Math.round(size * 0.7);

  return (
    <View
      style={[
        styles.outer,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: isCherry ? colors.pieceCherry : colors.pieceCream,
          borderColor: isCherry ? colors.pieceCherryBorder : colors.pieceCreamBorder,
        },
        selected && styles.selected,
        !selected && movable && styles.movable,
        captured && styles.captured,
      ]}
      pointerEvents="none"
    >
      <View
        style={[
          styles.inner,
          {
            width: innerSize,
            height: innerSize,
            borderRadius: innerSize / 2,
            borderColor: isCherry
              ? colors.pieceCherryHighlight
              : colors.pieceCreamBorder,
          },
        ]}
      >
        {isKing ? (
          <Text
            style={[
              styles.crown,
              {
                fontSize: Math.max(12, Math.round(size * 0.45)),
                color: isCherry ? colors.crownLight : colors.crown,
              },
            ]}
          >
            ♛
          </Text>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outer: {
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.28,
    shadowRadius: 3,
    elevation: 3,
  },
  inner: {
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: {
    borderColor: colors.selectionRing,
    borderWidth: 3,
    transform: [{ scale: 1.07 }],
  },
  movable: {
    borderColor: colors.borderGold,
    borderWidth: 2.5,
  },
  captured: {
    opacity: 0.35,
  },
  crown: {
    fontWeight: '900',
    textAlign: 'center',
    includeFontPadding: false,
  },
});
