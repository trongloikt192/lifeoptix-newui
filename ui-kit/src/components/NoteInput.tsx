import { useState } from 'react';
import { BulbIcon, CalendarIcon, ChevronRightIcon } from '../icons';
import { Pressable, StyleSheet, Text, TextInput, View } from '../primitives';
import { MAX_NOTE_LENGTH, colors, font, shadows } from '../theme/tokens';

const LINE = 22.9;
const RULES = [0, 1, 2, 3];

type NoteInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
};

/** Ruled note card with a live character counter. */
export function NoteInput({ value, onChangeText, placeholder }: NoteInputProps) {
  const [focused, setFocused] = useState(false);
  return (
    <View style={styles.card}>
      <View style={styles.rules} pointerEvents="none" accessibilityElementsHidden>
        {RULES.map((i) => (
          <View key={i} style={[styles.rule, { top: i * LINE }]} />
        ))}
      </View>
      <TextInput
        multiline
        accessibilityLabel="What happened today"
        value={value}
        onChangeText={(t) => onChangeText(t.slice(0, MAX_NOTE_LENGTH))}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        maxLength={MAX_NOTE_LENGTH}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        style={styles.input}
      />
      {/* Resting caret drawn by the design; the real one takes over on focus. */}
      {value.length === 0 && !focused && (
        <View style={styles.caret} pointerEvents="none" accessibilityElementsHidden />
      )}
      <Text style={styles.counter}>
        {value.length}/{MAX_NOTE_LENGTH}
      </Text>
    </View>
  );
}

type ExampleChipProps = { label: string; onPress: () => void };

export function ExampleChip({ label, onPress }: ExampleChipProps) {
  return (
    <Pressable onPress={onPress} style={styles.exampleHit}>
      {({ pressed }) => (
        <View style={[styles.exampleChip, pressed && styles.pressed]}>
          <BulbIcon />
          <Text numberOfLines={1} style={styles.exampleLabel}>
            {label}
          </Text>
          <View style={styles.exampleChevron}>
            <ChevronRightIcon color={colors.exampleText} />
          </View>
        </View>
      )}
    </Pressable>
  );
}

type HintRowProps = { title: string; body: string };

export function HintRow({ title, body }: HintRowProps) {
  return (
    <View style={styles.hint}>
      <CalendarIcon size={20.5} color={colors.leaf} check />
      <View style={styles.hintText}>
        <Text style={styles.hintTitle}>{title}</Text>
        <Text style={styles.hintBody}>{body}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 352,
    height: 142,
    marginTop: 12.4,
    marginLeft: 18.5,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: colors.noteBorder,
    backgroundColor: colors.surface,
    boxShadow: shadows.note,
  },
  rules: { position: 'absolute', left: 14.4, right: 13.4, top: 42.4, height: 69.7 },
  rule: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: colors.noteRule },
  input: {
    ...font('400', 14.5, LINE),
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    paddingTop: 15.2,
    paddingRight: 14,
    paddingBottom: 26,
    paddingLeft: 25,
    color: colors.text,
    textAlignVertical: 'top',
  },
  caret: {
    position: 'absolute',
    left: 15.8,
    top: 14,
    width: 2,
    height: LINE,
    borderRadius: 1,
    backgroundColor: colors.caret,
  },
  counter: {
    ...font('500', 10.5, 12),
    position: 'absolute',
    right: 13.5,
    top: 123.5,
    color: colors.textMuted,
  },

  exampleHit: { alignSelf: 'flex-start', height: 44, marginTop: 5.9, marginLeft: 18.8, justifyContent: 'center' },
  exampleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 35.4,
    paddingLeft: 12,
    paddingRight: 7.9,
    borderRadius: 999,
    borderWidth: 1.2,
    borderColor: colors.exampleBorder,
    backgroundColor: colors.exampleBg,
    boxShadow: shadows.example,
  },
  exampleLabel: { ...font('600', 12.45, 16), marginLeft: 9.3, color: colors.exampleText },
  exampleChevron: { marginLeft: 5.1 },
  pressed: { opacity: 0.7 },

  hint: { flexDirection: 'row', alignItems: 'flex-start', gap: 11.04, marginTop: 13, paddingLeft: 25.86 },
  hintText: { width: 252 },
  hintTitle: { ...font('700', 12.45, 16), color: colors.textHintTitle },
  hintBody: { ...font('400', 12.5, 15.6), marginTop: 1.4, color: colors.textHint },
});
