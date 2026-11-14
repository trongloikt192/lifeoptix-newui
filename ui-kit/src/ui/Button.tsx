import type { ReactNode } from 'react';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from '../primitives';
import type { StyleProp } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, elevation, font, radii, ui } from '../theme/tokens';
import { REVIEW_ANCHORS, REVIEW_DECOR } from '../../reference/src/decor/reviewDecor';
import { Decor } from './Decor';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'dangerGhost';

type ButtonProps = {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  icon?: IconName;
  iconRight?: IconName;
  disabled?: boolean;
  loading?: boolean;
  /** Stretch to fill a row (flex: 1). */
  grow?: boolean;
  /** Light leaves painted inside a green button (on by default for md primary, as in the mockup). */
  leaves?: boolean;
  style?: StyleProp;
};

export function Button({ label, onPress, variant = 'primary', size = 'md', icon, iconRight, disabled, loading, grow, leaves, style }: ButtonProps) {
  const accent = useAccent();
  const off = disabled || loading;
  const v = palette(variant, accent, !!disabled);
  const showLeaves = (leaves ?? (variant === 'primary' && size === 'md')) && variant === 'primary' && !disabled;
  const content: ReactNode = (
    <>
      {showLeaves && <Decor asset={REVIEW_DECOR.saveLeavesLeft} style={REVIEW_ANCHORS.saveLeavesLeft} />}
      {showLeaves && <Decor asset={REVIEW_DECOR.saveLeavesRight} style={REVIEW_ANCHORS.saveLeavesRight} />}
      {loading ? <ActivityIndicator color={v.ink} /> : icon && <Icon name={icon} size={size === 'sm' ? 18 : 20} color={v.ink} />}
      <Text numberOfLines={1} style={[size === 'sm' ? styles.labelSm : styles.label, { color: v.ink }]}>
        {label}
      </Text>
      {iconRight && !loading && <Icon name={iconRight} size={18} color={v.ink} />}
    </>
  );
  return (
    <Pressable
      onPress={onPress}
      disabled={off}
      accessibilityState={{ disabled: !!disabled, busy: !!loading }}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' ? styles.sm : styles.md,
        { backgroundColor: v.bg, borderColor: v.border, boxShadow: v.shadow },
        v.ledge ? { borderBottomWidth: size === 'sm' ? 3.5 : 5, borderBottomColor: v.ledge } : null,
        grow && styles.grow,
        pressed && !off && { opacity: 0.82, transform: [{ scale: 0.985 }] },
        style,
      ]}
    >
      {content}
    </Pressable>
  );
}

function palette(variant: ButtonVariant, accent: string, disabled: boolean): { bg: string; border: string; ink: string; shadow: string; ledge?: string } {
  if (disabled && (variant === 'primary' || variant === 'danger'))
    return { bg: colors.disabledBg, border: colors.disabledBorder, ink: colors.disabledText, shadow: 'none' };
  switch (variant) {
    // Flat green with a darker bottom ledge — "Add a goal", "Save all 4", "Add event".
    case 'primary':
      return { bg: accent, border: colors.accentRing, ink: colors.onAccent, shadow: elevation.button, ledge: colors.accentRingDark };
    // Cream with an olive border — "Discard".
    case 'secondary':
      return { bg: colors.tabBg, border: ui.lineStrong, ink: disabled ? colors.disabledText : colors.tabText, shadow: disabled ? 'none' : elevation.card };
    case 'ghost':
      return { bg: 'transparent', border: 'transparent', ink: disabled ? colors.disabledText : ui.accentInk, shadow: 'none' };
    case 'danger':
      return { bg: ui.danger, border: '#C25A36', ink: colors.white, shadow: elevation.button, ledge: '#5E1500' };
    case 'dangerGhost':
      return { bg: 'transparent', border: 'transparent', ink: ui.danger, shadow: 'none' };
  }
}

type IconButtonProps = {
  icon: IconName;
  label: string;
  onPress?: () => void;
  /** plain: bare glyph · raised: cream disc · accent: filled moss · danger: soft red disc */
  variant?: 'plain' | 'raised' | 'accent' | 'danger';
  size?: number;
  disabled?: boolean;
  selected?: boolean;
};

/** Always a 44 × 44 touch target; the visible disc is `size`. */
export function IconButton({ icon, label, onPress, variant = 'raised', size = 36, disabled, selected }: IconButtonProps) {
  const disc =
    variant === 'accent'
      ? { backgroundColor: '#5B7038', borderColor: '#46602A', boxShadow: '0 3px 6px rgba(110,80,30,0.22)' }
      : variant === 'danger'
        ? { backgroundColor: ui.dangerSoft, borderColor: ui.dangerBorder }
        : variant === 'raised'
          ? { backgroundColor: selected ? ui.accentSoft : '#FEF7E7', borderColor: selected ? colors.accentRing : colors.closeBorder, boxShadow: elevation.raised }
          : { backgroundColor: 'transparent', borderColor: 'transparent' };
  const ink = disabled ? colors.disabledText : variant === 'accent' ? colors.onAccent : variant === 'danger' ? ui.danger : colors.closeIcon;
  return (
    <Pressable
      accessibilityLabel={label}
      accessibilityState={selected != null ? { selected } : undefined}
      onPress={onPress}
      disabled={disabled}
      style={styles.hit}
    >
      {({ pressed }) => (
        <View style={[styles.disc, { width: size, height: size - 1, borderRadius: Math.round(size * 0.28) }, disc, pressed && { opacity: 0.7 }]}>
          <Icon name={icon} size={Math.round(size * 0.56)} color={ink} strokeWidth={variant === 'accent' ? 2.6 : 2.3} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.2,
    borderRadius: radii.md,
  },
  md: { height: 50, paddingHorizontal: 18 },
  sm: { height: 40, paddingHorizontal: 14, borderRadius: 11 },
  grow: { flex: 1, flexBasis: 0 },
  label: { ...font('800', 16, 21), letterSpacing: -0.4 },
  labelSm: { ...font('800', 13.5, 18), letterSpacing: -0.2 },
  hit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  disc: { borderWidth: 1.2, alignItems: 'center', justifyContent: 'center' },
});
