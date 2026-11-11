/** Bottom tab bar shared by every screen (measured on the "Today" mockup). */
import React from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BookIcon, CalendarIcon, GardenFlowerIcon, GridIcon, PlusIcon, SparklesIcon, SproutIcon } from './icons';

export const ACCENT = '#55693B';

export type TabKey = 'today' | 'garden' | 'insights' | 'lessons' | 'menu';

type Tab = { key: TabKey; label: string; icon: React.ReactNode; flex: number };

const TAB_DEFS: Record<TabKey, Omit<Tab, 'flex'>> = {
  today: { key: 'today', label: 'Today', icon: <CalendarIcon size={24.5} color="#3C5C1E" check /> },
  garden: { key: 'garden', label: 'Garden', icon: <SproutIcon size={22.5} color="#3F1709" /> },
  insights: { key: 'insights', label: 'Insights', icon: <SparklesIcon size={23} color="#3A0F02" /> },
  lessons: { key: 'lessons', label: 'Lessons', icon: <BookIcon size={24} /> },
  menu: { key: 'menu', label: 'Menu', icon: <GridIcon size={21.5} color="#3C1506" /> },
};

/** Tile widths (pt at 390) from the mockup; tiles share the remaining width in these proportions. */
const FLEX = [67.8, 73.3, 74.4, 67.1];

/** Panel height above the safe-area padding; the bottom padding is added from the insets. */
export const NAV_CONTENT_HEIGHT = 4.9 + 53.1;

export function useNavHeight() {
  const insets = useSafeAreaInsets();
  return NAV_CONTENT_HEIGHT + navBottomPadding(insets.bottom);
}

function navBottomPadding(bottomInset: number) {
  return Math.max(bottomInset - 6.7, 10);
}

type Props = {
  /** Four tabs, two each side of the + button. The latest mockup uses Insights; the first one used Lessons. */
  tabs?: [TabKey, TabKey, TabKey, TabKey];
  /** Highlighted tab; `null` = none (e.g. a review screen opened from the + button). */
  active?: TabKey | null;
  onTabPress?: (key: TabKey) => void;
  onAddPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function BottomNav({ tabs = ['today', 'garden', 'insights', 'menu'], active = 'today', onTabPress, onAddPress, style }: Props) {
  const insets = useSafeAreaInsets();
  const items = tabs.map((k, i) => ({ ...TAB_DEFS[k], flex: FLEX[i] }));
  const tile = (t: Tab, extra?: StyleProp<ViewStyle>) => {
    const on = t.key === active;
    return (
      <Pressable
        key={t.key}
        accessibilityRole="button"
        accessibilityState={on ? { selected: true } : undefined}
        onPress={() => onTabPress?.(t.key)}
        style={[styles.tile, { flexGrow: t.flex }, on ? styles.tileOn : null, extra]}
      >
        <View style={styles.icon}>
          {t.key === 'today' && !on ? (
            <CalendarIcon size={24.5} color="#3F1709" check />
          ) : t.key === 'garden' && on ? (
            <GardenFlowerIcon />
          ) : (
            t.icon
          )}
        </View>
        <Text style={[styles.label, on ? styles.labelOn : null]}>{t.label}</Text>
      </Pressable>
    );
  };
  return (
    <View style={[styles.bar, { paddingBottom: navBottomPadding(insets.bottom) }, style]}>
      {tile(items[0])}
      {tile(items[1], { marginLeft: 6.4 })}
      <Pressable accessibilityRole="button" accessibilityLabel="Add entry" onPress={onAddPress} style={styles.fab}>
        <PlusIcon size={31} />
      </Pressable>
      {tile(items[2], { marginLeft: 10.6 })}
      {tile(items[3], { marginLeft: 6.2 })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute', left: 0, right: 0, bottom: 0, flexDirection: 'row', alignItems: 'flex-start',
    paddingTop: 4.9, paddingLeft: 9.2, paddingRight: 8.2, backgroundColor: '#FDF7EA',
    borderTopLeftRadius: 14, borderTopRightRadius: 14, boxShadow: '0 -3px 10px rgba(160,120,80,0.12)',
  },
  tile: {
    flexBasis: 0, height: 53.1, paddingTop: 5, alignItems: 'center', borderRadius: 10, borderWidth: 1,
    borderColor: '#F3E8D8', backgroundColor: '#FDF5E5',
  },
  tileOn: { borderColor: '#DFDEC3', backgroundColor: '#EFEDD4' },
  icon: { height: 25, alignItems: 'center', justifyContent: 'center' },
  label: { marginTop: 0.3, fontFamily: 'Nunito-Bold', fontSize: 9.9, lineHeight: 13, color: '#431A0B' },
  labelOn: { marginTop: 2, fontFamily: 'Nunito-ExtraBold', fontSize: 10.3, color: '#1F4012' },
  fab: {
    width: 56.8, height: 56.2, marginTop: -16.6, marginLeft: 9.9, borderRadius: 17, borderWidth: 2, borderColor: '#97A873',
    backgroundColor: ACCENT, alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 0 1px #3F5129, 0 5px 12px rgba(190,120,60,0.30)',
  },
});
