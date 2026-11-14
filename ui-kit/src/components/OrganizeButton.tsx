import { SparklesIcon } from '../icons';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import { colors, font } from '../theme/tokens';

type OrganizeButtonProps = {
  label: string;
  accent: string;
  disabled: boolean;
  onPress?: () => void;
};

/** Primary action. Disabled (muted sage) until the note has content. */
export function OrganizeButton({ label, accent, disabled, onPress }: OrganizeButtonProps) {
  const ink = disabled ? colors.disabledText : colors.white;
  return (
    <Pressable
      disabled={disabled}
      accessibilityState={{ disabled }}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        disabled
          ? { backgroundColor: colors.disabledBg, borderColor: colors.disabledBorder }
          : { backgroundColor: accent, borderColor: colors.accentBorder },
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.icon}>
        <SparklesIcon color={ink} />
      </View>
      <Text style={[styles.label, { color: ink }]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4.3,
    width: 349.6,
    height: 44.5,
    marginTop: 29.8,
    marginLeft: 20,
    paddingLeft: 4.1,
    borderRadius: 9,
    borderWidth: 1,
  },
  icon: { marginTop: 2.5 },
  label: { ...font('600', 13.8, 18), marginTop: 4 },
  pressed: { opacity: 0.85 },
});
