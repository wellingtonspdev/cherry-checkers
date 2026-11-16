import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { colors, palette } from '../theme';

export function CherryIcon({ size = 28 }) {
  const berrySize = Math.round(size * 0.46);
  return (
    <View
      style={[styles.iconRoot, { width: size, height: size }]}
      pointerEvents="none"
      accessible={false}
    >
      <View
        style={[
          styles.leaf,
          {
            width: Math.round(size * 0.34),
            height: Math.round(size * 0.18),
            top: Math.round(size * 0.04),
            right: Math.round(size * 0.14),
          },
        ]}
      />
      <View
        style={[
          styles.stem,
          {
            height: Math.round(size * 0.42),
            left: Math.round(size * 0.36),
            top: Math.round(size * 0.12),
            transform: [{ rotate: '14deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.stem,
          {
            height: Math.round(size * 0.42),
            right: Math.round(size * 0.32),
            top: Math.round(size * 0.14),
            transform: [{ rotate: '-14deg' }],
          },
        ]}
      />
      <View
        style={[
          styles.berry,
          {
            width: berrySize,
            height: berrySize,
            borderRadius: berrySize / 2,
            left: Math.round(size * 0.08),
            bottom: Math.round(size * 0.04),
          },
        ]}
      >
        <View style={styles.berryShine} />
      </View>
      <View
        style={[
          styles.berry,
          {
            width: berrySize,
            height: berrySize,
            borderRadius: berrySize / 2,
            right: Math.round(size * 0.08),
            bottom: Math.round(size * 0.04),
          },
        ]}
      >
        <View style={styles.berryShine} />
      </View>
    </View>
  );
}

export function HeroEmblem() {
  return (
    <View style={styles.heroWrap} pointerEvents="none" accessible={false}>
      <View style={styles.heroHalo} />
      <CherryIcon size={86} />
      <View style={styles.heroPiecesRow}>
        <View style={[styles.heroDisc, styles.heroDiscCherry]}>
          <View style={styles.heroDiscInnerCherry} />
        </View>
        <View style={[styles.heroDisc, styles.heroDiscCream]}>
          <View style={styles.heroDiscInnerCream} />
        </View>
      </View>
      <View style={styles.crownBadge}>
        <Text style={styles.crownText}>♛</Text>
      </View>
    </View>
  );
}

export function CheckeredOrnament({ showCenterCherry = false }) {
  const cells = Array.from({ length: 16 }, (_, idx) => idx);
  return (
    <View style={styles.ornamentWrap} pointerEvents="none" accessible={false}>
      <View style={styles.ornamentGrid}>
        {cells.map((idx) => {
          const row = Math.floor(idx / 8);
          const col = idx % 8;
          const isLight = (row + col) % 2 === 0;
          return (
            <View
              key={idx}
              style={[
                styles.ornamentCell,
                {
                  backgroundColor: isLight
                    ? 'rgba(255, 240, 218, 0.22)'
                    : 'rgba(163, 30, 59, 0.38)',
                },
              ]}
            />
          );
        })}
      </View>
      {showCenterCherry ? (
        <View style={styles.ornamentCherryCenter}>
          <CherryIcon size={34} />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  iconRoot: {
    position: 'relative',
  },
  leaf: {
    position: 'absolute',
    backgroundColor: palette.leaf600,
    borderTopLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: palette.gold200,
    transform: [{ rotate: '-20deg' }],
  },
  stem: {
    position: 'absolute',
    width: 2.5,
    backgroundColor: palette.gold200,
    borderRadius: 2,
  },
  berry: {
    position: 'absolute',
    backgroundColor: palette.cherry500,
    borderWidth: 1.5,
    borderColor: palette.cherry800,
  },
  berryShine: {
    position: 'absolute',
    top: 3,
    left: 3,
    width: '30%',
    height: '30%',
    borderRadius: 99,
    backgroundColor: palette.cherry100,
    opacity: 0.85,
  },
  heroWrap: {
    width: 150,
    height: 122,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  heroHalo: {
    position: 'absolute',
    width: 104,
    height: 104,
    borderRadius: 52,
    backgroundColor: 'rgba(255, 240, 218, 0.14)',
    borderWidth: 2,
    borderColor: 'rgba(244, 213, 164, 0.35)',
  },
  heroPiecesRow: {
    flexDirection: 'row',
    marginTop: -12,
    gap: 6,
  },
  heroDisc: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  heroDiscCherry: {
    backgroundColor: colors.pieceCherry,
    borderColor: colors.pieceCherryBorder,
  },
  heroDiscInnerCherry: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.pieceCherryHighlight,
    opacity: 0.65,
  },
  heroDiscCream: {
    backgroundColor: colors.pieceCream,
    borderColor: colors.pieceCreamBorder,
  },
  heroDiscInnerCream: {
    width: 28,
    height: 28,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: colors.pieceCreamBorder,
  },
  crownBadge: {
    position: 'absolute',
    bottom: 2,
    backgroundColor: colors.pageDeep,
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  crownText: {
    color: colors.crown,
    fontSize: 13,
    fontWeight: '800',
  },
  ornamentWrap: {
    width: '100%',
    height: 44,
    overflow: 'hidden',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  ornamentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    height: 44,
  },
  ornamentCell: {
    width: '12.5%',
    height: 22,
  },
  ornamentCherryCenter: {
    position: 'absolute',
    alignSelf: 'center',
    bottom: 4,
  },
});
