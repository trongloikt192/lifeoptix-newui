import { CalendarIcon, ChevronDownIcon, CloseIcon } from '../icons';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import { colors, font, shadows } from '../theme/tokens';

type HeaderProps = {
  title: string;
  subtitle: string;
  time: string;
  onClose?: () => void;
};

export function Header({ title, subtitle, time, onClose }: HeaderProps) {
  return (
    <View style={styles.header}>
      <Pressable accessibilityLabel="Close" onPress={onClose} style={styles.closeHit}>
        {({ pressed }) => (
          <View style={[styles.closeCircle, pressed && styles.pressed]}>
            <CloseIcon />
          </View>
        )}
      </Pressable>
      <View style={styles.titles}>
        <Text accessibilityRole="header" numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
      <Text style={styles.time}>{time}</Text>
    </View>
  );
}

type DateChipProps = { label: string; onPress?: () => void };

export function DateChip({ label, onPress }: DateChipProps) {
  return (
    <Pressable accessibilityLabel={`Choose date: ${label}`} onPress={onPress} style={styles.dateHit}>
      {({ pressed }) => (
        <View style={[styles.dateChip, pressed && styles.pressed]}>
          <CalendarIcon color={colors.chipText} />
          <Text style={styles.dateLabel}>{label}</Text>
          <View style={styles.dateChevron}>
            <ChevronDownIcon color={colors.chipText} />
          </View>
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    height: 56,
    paddingLeft: 10,
    paddingRight: 16,
  },
  closeHit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  closeCircle: {
    width: 34.4,
    height: 34.4,
    borderRadius: 17.2,
    borderWidth: 1,
    borderColor: colors.closeBorder,
    backgroundColor: colors.surfaceRaised,
    boxShadow: shadows.close,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titles: { flex: 1, marginTop: 8.2, marginLeft: 9.7 },
  title: { ...font('900', 27, 30), letterSpacing: -0.8, color: colors.text },
  subtitle: { ...font('500', 14.7, 18), marginTop: 1.5, marginLeft: 2, color: colors.textSoft },
  time: { ...font('500', 12, 16), marginTop: 13, letterSpacing: -0.3, color: colors.time },

  dateHit: { alignSelf: 'center', height: 44, marginTop: 5.05, justifyContent: 'center' },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 32.5,
    paddingLeft: 17.3,
    paddingRight: 14.7,
    borderRadius: 999,
    borderWidth: 1.4,
    borderColor: colors.chipBorder,
    backgroundColor: colors.chipBg,
  },
  dateLabel: { ...font('700', 14, 18), marginLeft: 8.7, color: colors.chipText },
  dateChevron: { marginLeft: 6.7 },
  pressed: { opacity: 0.7 },
});
