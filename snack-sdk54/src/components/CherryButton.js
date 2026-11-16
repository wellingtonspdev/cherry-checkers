import React from 'react';
import {
  ActivityIndicator,
  Animated,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { borders, colors, motion, radius, spacing, typography } from '../theme';

export default function CherryButton({
  title,
  onPress,
  variant = 'primary',
  icon = null,
  disabled = false,
  loading = false,
  style,
  textStyle,
  accessibilityLabel,
  accessibilityHint,
}) {
  const scaleAnim = React.useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.timing(scaleAnim, {
      toValue: 0.97,
      duration: motion.quick,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: motion.quick,
      useNativeDriver: true,
    }).start();
  };

  const isDisabled = disabled || loading;

  return (
    <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
      <Pressable
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={isDisabled}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        accessibilityHint={accessibilityHint}
        accessibilityState={{ disabled: isDisabled, busy: loading }}
        style={({ pressed }) => [
          styles.base,
          styles[variant],
          pressed && !isDisabled && styles[`${variant}Pressed`],
          isDisabled && styles.disabled,
        ]}
      >
        {loading ? (
          <ActivityIndicator
            color={variant === 'secondary' ? colors.textOnLight : colors.textOnDark}
            size="small"
          />
        ) : (
          <View style={styles.content}>
            {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
            <Text
              style={[
                styles.label,
                variant === 'secondary' ? styles.labelDark : styles.labelLight,
                textStyle,
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {title}
            </Text>
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 52,
    paddingHorizontal: spacing[5],
    paddingVertical: spacing[3],
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: borders.regular,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrap: {
    marginRight: spacing[2],
  },
  primary: {
    backgroundColor: colors.primary,
    borderColor: colors.borderGold,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryPressed: {
    backgroundColor: colors.primaryPressed,
  },
  secondary: {
    backgroundColor: colors.surfaceSoft,
    borderColor: colors.borderLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.16,
    shadowRadius: 4,
    elevation: 2,
  },
  secondaryPressed: {
    backgroundColor: colors.borderLight,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: colors.borderGold,
  },
  ghostPressed: {
    backgroundColor: 'rgba(244, 213, 164, 0.14)',
  },
  danger: {
    backgroundColor: colors.cardDark,
    borderColor: colors.borderGold,
  },
  dangerPressed: {
    backgroundColor: colors.pageDeep,
  },
  disabled: {
    opacity: 0.45,
  },
  label: {
    ...typography.label,
    letterSpacing: 0.6,
    textAlign: 'center',
  },
  labelLight: {
    color: colors.surface,
  },
  labelDark: {
    color: colors.textOnLight,
  },
});
