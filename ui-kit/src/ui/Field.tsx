import { useState } from 'react';
import { Icon } from '../icons/Icon';
import { ActivityIndicator, Pressable, StyleSheet, Text, TextInput, View } from '../primitives';
import type { StyleProp } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, font, ui } from '../theme/tokens';

type TextFieldProps = {
  label?: string;
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  helper?: string;
  error?: string;
  multiline?: boolean;
  /** Rows of a text area (multiline only). */
  rows?: number;
  maxLength?: number;
  prefix?: string;
  suffix?: string;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad';
  autoFocus?: boolean;
  /** Draws the focused look without focus — for static mockup boards. */
  showFocus?: boolean;
  /** Large numeric display for amount fields. */
  large?: boolean;
  optional?: boolean;
  /** Accessible name when there is no visible label. */
  a11yLabel?: string;
  style?: StyleProp;
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  helper,
  error,
  multiline,
  rows = 4,
  maxLength,
  prefix,
  suffix,
  keyboardType,
  autoFocus,
  showFocus,
  large,
  optional,
  a11yLabel,
  style,
}: TextFieldProps) {
  const accent = useAccent();
  const [focused, setFocused] = useState(false);
  const active = focused || showFocus;
  const borderColor = error ? ui.danger : active ? accent : ui.lineStrong;
  const lineH = large ? 34 : 22;
  return (
    <View style={[styles.wrap, style]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {optional && <Text style={styles.optional}>Optional</Text>}
        </View>
      )}
      <View
        style={[
          styles.box,
          multiline ? { minHeight: rows * lineH + 26, alignItems: 'flex-start' } : { height: large ? 60 : 50 },
          { borderColor, borderWidth: active || error ? 1.8 : 1.2 },
          active && !error && { boxShadow: `0 0 0 3px ${ui.accentSoft}` },
          error ? { boxShadow: `0 0 0 3px ${ui.dangerSoft}` } : null,
        ]}
      >
        {prefix && <Text style={[styles.affix, large && styles.affixLarge]}>{prefix}</Text>}
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          selectionColor={accent}
          multiline={multiline}
          maxLength={maxLength}
          keyboardType={keyboardType}
          autoFocus={autoFocus}
          accessibilityLabel={label ?? a11yLabel ?? placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={[
            large ? styles.inputLarge : styles.input,
            multiline && { alignSelf: 'stretch', minHeight: rows * lineH, paddingVertical: 12, textAlignVertical: 'top' },
          ]}
        />
        {suffix && <Text style={[styles.affix, large && styles.affixLarge]}>{suffix}</Text>}
      </View>
      {(error || helper || maxLength) && (
        <View style={styles.below}>
          {error ? (
            <View style={styles.errorRow} accessibilityLiveRegion="polite">
              <Icon name="alert" size={15} color={ui.danger} />
              <Text style={styles.error}>{error}</Text>
            </View>
          ) : (
            <Text style={styles.helper}>{helper ?? ''}</Text>
          )}
          {maxLength != null && (
            <Text style={styles.counter}>
              {value.length}/{maxLength}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}

type SearchBarProps = {
  value: string;
  onChangeText: (t: string) => void;
  placeholder?: string;
  searching?: boolean;
  autoFocus?: boolean;
  showFocus?: boolean;
  onCancel?: () => void;
};

export function SearchBar({ value, onChangeText, placeholder = 'Search entries', searching, autoFocus, showFocus, onCancel }: SearchBarProps) {
  const accent = useAccent();
  const [focused, setFocused] = useState(false);
  const active = focused || showFocus;
  return (
    <View accessibilityRole="search" style={styles.searchRow}>
      <View style={[styles.search, active && { borderColor: accent, boxShadow: `0 0 0 3px ${ui.accentSoft}` }]}>
        <Icon name="search" size={19} color={active ? colors.accentRingDark : colors.textMuted} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.textMuted}
          selectionColor={accent}
          keyboardType="web-search"
          returnKeyType="search"
          autoFocus={autoFocus}
          accessibilityLabel={placeholder}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={styles.searchInput}
        />
        {searching && <ActivityIndicator size={18} color={accent} />}
        {value.length > 0 && (
          <Pressable accessibilityLabel="Clear search" onPress={() => onChangeText('')} style={styles.clearHit}>
            <View style={styles.clear}>
              <Icon name="close" size={12} color={colors.white} strokeWidth={3} />
            </View>
          </Pressable>
        )}
      </View>
      {(active || value.length > 0) && onCancel && (
        <Pressable onPress={onCancel} style={styles.cancel}>
          <Text style={styles.cancelLabel}>Cancel</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 7 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  label: { ...font('700', 13.5, 18), color: colors.textHintTitle },
  optional: { ...font('500', 12, 16), color: colors.textMuted },
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    borderRadius: 13,
    backgroundColor: ui.field,
    boxShadow: '0 1px 3px rgba(120,100,60,0.12)',
  },
  input: { ...font('500', 15.5, 22), flex: 1, color: colors.text, alignSelf: 'stretch' },
  inputLarge: { ...font('800', 26, 34), flex: 1, color: colors.text, alignSelf: 'stretch', letterSpacing: -0.4 },
  affix: { ...font('600', 15, 20), color: colors.textMuted },
  affixLarge: { ...font('700', 20, 26) },
  below: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, minHeight: 16 },
  helper: { ...font('500', 12.5, 16), color: colors.textMuted, flex: 1 },
  errorRow: { flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1 },
  error: { ...font('600', 12.5, 16), color: ui.danger, flex: 1 },
  counter: { ...font('500', 12, 16), color: colors.textMuted },

  searchRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  search: {
    flex: 1,
    height: 49,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingLeft: 17,
    paddingRight: 4,
    borderRadius: 13,
    borderWidth: 1.2,
    boxShadow: '0 1px 3px rgba(120,100,60,0.12)',
    borderColor: ui.lineStrong,
    backgroundColor: ui.field,
  },
  searchInput: { ...font('500', 15, 20), flex: 1, alignSelf: 'stretch', color: colors.text },
  clearHit: { width: 36, height: 44, alignItems: 'center', justifyContent: 'center' },
  clear: { width: 20, height: 20, borderRadius: 10, backgroundColor: '#9C8B80', alignItems: 'center', justifyContent: 'center' },
  cancel: { height: 44, paddingHorizontal: 8, justifyContent: 'center' },
  cancelLabel: { ...font('700', 14.5, 20), color: colors.accentRingDark },
});
