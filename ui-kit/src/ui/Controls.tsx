import type { ReactNode } from 'react';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, elevation, font, ui } from '../theme/tokens';

/* ---------- Filter chip ---------- */

type ChipProps = {
  label: string;
  selected: boolean;
  onPress?: () => void;
  icon?: IconName;
  /** Ink/tint for an entry-kind chip. */
  tone?: { fg: string; bg: string; border: string };
  count?: number;
  /** radio when only one can be picked, checkbox for multi-select. */
  role?: 'radio' | 'checkbox';
  disabled?: boolean;
};

export function Chip({ label, selected, onPress, icon, tone, count, role = 'checkbox', disabled }: ChipProps) {
  const accent = useAccent();
  // Mockup: a selected chip is filled dark moss with cream text, whatever its kind.
  const sel = { backgroundColor: ui.chipOn, borderColor: ui.chipOnBorder, ink: ui.chipOnText };
  void accent;
  const ink = disabled ? colors.disabledText : selected ? sel.ink : colors.tabText;
  return (
    <Pressable
      accessibilityRole={role}
      accessibilityState={{ checked: selected, disabled }}
      onPress={onPress}
      disabled={disabled}
      style={styles.chipHit}
    >
      {({ pressed }) => (
        <View
          style={[
            styles.chip,
            selected
              ? { backgroundColor: sel.backgroundColor, borderColor: sel.borderColor, boxShadow: elevation.selected }
              : { backgroundColor: '#FEF4DF', borderColor: ui.lineStrong },
            pressed && { opacity: 0.75 },
          ]}
        >
          {selected ? (
            <Icon name="check" size={16} color={ink} strokeWidth={2.8} />
          ) : (
            icon && <Icon name={icon} size={17} color={tone && !disabled ? tone.fg : ink} />
          )}
          <Text numberOfLines={1} style={[styles.chipLabel, { color: ink }, selected && { fontWeight: '800' }]}>
            {label}
          </Text>
          {count != null && <Text style={[styles.chipCount, { color: ink }]}>{count}</Text>}
        </View>
      )}
    </Pressable>
  );
}

export function ChipRow({ children, wrap = true }: { children: ReactNode; wrap?: boolean }) {
  return <View style={[styles.chipRow, wrap && { flexWrap: 'wrap' }]}>{children}</View>;
}

/* ---------- Segmented control ---------- */

type SegmentedProps<T extends string> = {
  options: { value: T; label: string; icon?: IconName }[];
  value: T;
  onChange: (v: T) => void;
  label: string;
};

export function Segmented<T extends string>({ options, value, onChange, label }: SegmentedProps<T>) {
  return (
    <View accessibilityRole="radiogroup" accessibilityLabel={label} style={styles.seg}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable
            key={o.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: on }}
            onPress={() => onChange(o.value)}
            style={[styles.segItem, on && styles.segItemOn]}
          >
            {o.icon && <Icon name={o.icon} size={17} color={on ? ui.chipOnText : colors.textSoft} />}
            <Text numberOfLines={1} style={[styles.segLabel, on && styles.segLabelOn]}>
              {o.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

/* ---------- Switch / Checkbox / Radio ---------- */

export function Switch({ value, onValueChange, label, disabled }: { value: boolean; onValueChange: (v: boolean) => void; label: string; disabled?: boolean }) {
  const accent = useAccent();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      style={styles.switchHit}
    >
      <View
        style={[
          styles.track,
          value ? { backgroundColor: accent, borderColor: colors.accentRing } : { backgroundColor: ui.track, borderColor: ui.lineStrong },
          disabled && { opacity: 0.45 },
        ]}
      >
        <View style={[styles.thumb, { transform: [{ translateX: value ? 20 : 0 }] }]}>
          {value && <Icon name="check" size={13} color={accent} strokeWidth={3.2} />}
        </View>
      </View>
    </Pressable>
  );
}

function Mark({ type, on, disabled }: { type: 'checkbox' | 'radio'; on: boolean; disabled?: boolean }) {
  const accent = useAccent();
  const round = type === 'radio';
  return (
    <View
      style={[
        styles.mark,
        { borderRadius: round ? 12 : 7 },
        on ? { borderColor: accent, backgroundColor: round ? ui.field : accent } : { borderColor: '#A8957F', backgroundColor: ui.field },
        disabled && { opacity: 0.45 },
      ]}
    >
      {on && (round ? <View style={[styles.dot, { backgroundColor: accent }]} /> : <Icon name="check" size={15} color={colors.white} strokeWidth={3.2} />)}
    </View>
  );
}

type OptionRowProps = {
  type: 'checkbox' | 'radio' | 'switch';
  label: string;
  description?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  icon?: ReactNode;
  disabled?: boolean;
  last?: boolean;
};

/** A full-width row: icon · label + description · control. The whole row is the target. */
export function OptionRow({ type, label, description, checked, onChange, icon, disabled, last }: OptionRowProps) {
  const body = (
    <>
      {icon}
      <View style={styles.optText}>
        <Text style={[styles.optLabel, disabled && { color: colors.disabledText }]}>{label}</Text>
        {description && <Text style={styles.optDesc}>{description}</Text>}
      </View>
    </>
  );
  if (type === 'switch') {
    return (
      <View style={[styles.optRow, !last && styles.divider]}>
        {body}
        <Switch value={checked} onValueChange={onChange} label={label} disabled={disabled} />
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole={type}
      accessibilityState={{ checked, disabled }}
      disabled={disabled}
      onPress={() => onChange(type === 'radio' ? true : !checked)}
      style={({ pressed }) => [styles.optRow, !last && styles.divider, pressed && { backgroundColor: '#F7EEE1' }]}
    >
      {body}
      <Mark type={type} on={checked} disabled={disabled} />
    </Pressable>
  );
}

export { Mark as ControlMark };

/* ---------- Stepper ---------- */

export function Stepper({ value, onChange, step = 1, min = 0, max = 999, unit, label }: { value: number; onChange: (v: number) => void; step?: number; min?: number; max?: number; unit?: string; label: string }) {
  const btn = (dir: -1 | 1) => {
    const disabled = dir < 0 ? value <= min : value >= max;
    return (
      <Pressable
        accessibilityLabel={`${dir < 0 ? 'Decrease' : 'Increase'} ${label}`}
        disabled={disabled}
        onPress={() => onChange(Math.min(max, Math.max(min, value + dir * step)))}
        style={({ pressed }) => [styles.stepBtn, disabled && { opacity: 0.4 }, pressed && { backgroundColor: ui.accentSoft }]}
      >
        <Icon name={dir < 0 ? 'minus' : 'plus'} size={20} color={colors.text} strokeWidth={2.4} />
      </Pressable>
    );
  };
  return (
    <View style={styles.stepper}>
      {btn(-1)}
      <View style={styles.stepValue} accessibilityLiveRegion="polite">
        <Text style={styles.stepNum}>{value}</Text>
        {unit && <Text style={styles.stepUnit}>{unit}</Text>}
      </View>
      {btn(1)}
    </View>
  );
}

const styles = StyleSheet.create({
  chipHit: { minHeight: 44, justifyContent: 'center' },
  chip: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 13,
    borderRadius: 13,
    borderWidth: 1.2,
  },
  chipLabel: { ...font('800', 13, 17), letterSpacing: -0.3, color: colors.tabText },
  chipCount: { ...font('800', 12, 16), opacity: 0.8 },
  chipRow: { flexDirection: 'row', columnGap: 8, rowGap: 0 },

  seg: { flexDirection: 'row', padding: 3, borderRadius: 13, backgroundColor: '#FEF4DF', borderWidth: 1.2, borderColor: ui.lineStrong },
  segItem: { flex: 1, flexBasis: 0, height: 40, flexDirection: 'row', gap: 6, alignItems: 'center', justifyContent: 'center', borderRadius: 10, borderWidth: 1, borderColor: 'transparent' },
  segItemOn: { backgroundColor: ui.chipOn, borderColor: ui.chipOnBorder, boxShadow: elevation.selected },
  segLabel: { ...font('600', 14, 18), color: colors.textSoft },
  segLabelOn: { ...font('800', 14, 18), color: ui.chipOnText },

  switchHit: { width: 56, height: 44, alignItems: 'center', justifyContent: 'center' },
  track: { width: 50, height: 30, borderRadius: 15, borderWidth: 1.2, padding: 2, justifyContent: 'center' },
  thumb: { width: 24, height: 24, borderRadius: 12, backgroundColor: '#FFFDF8', boxShadow: '0 1px 3px rgba(60,40,20,0.3)', alignItems: 'center', justifyContent: 'center' },

  mark: { width: 24, height: 24, borderWidth: 2, alignItems: 'center', justifyContent: 'center' },
  dot: { width: 12, height: 12, borderRadius: 6 },

  optRow: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingVertical: 8, paddingHorizontal: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: ui.line },
  optText: { flex: 1, gap: 2 },
  optLabel: { ...font('600', 15, 20), color: colors.text },
  optDesc: { ...font('500', 12.5, 17), color: colors.textMuted },

  stepper: { flexDirection: 'row', alignItems: 'center', borderRadius: 13, borderWidth: 1.2, borderColor: ui.lineStrong, backgroundColor: ui.field, height: 52, overflow: 'hidden' },
  stepBtn: { width: 52, height: 50, alignItems: 'center', justifyContent: 'center' },
  stepValue: { flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: 5, borderLeftWidth: 1, borderRightWidth: 1, borderColor: ui.line, alignSelf: 'stretch', paddingTop: 12 },
  stepNum: { ...font('800', 20, 26), color: colors.text },
  stepUnit: { ...font('600', 14, 18), color: colors.textMuted },
});
