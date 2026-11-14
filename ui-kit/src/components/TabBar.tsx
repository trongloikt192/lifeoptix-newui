import type { ReactNode } from 'react';
import { CalendarIcon, GardenIcon, LessonsIcon, MenuIcon, PlusIcon } from '../icons';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import { accentSheen, colors, font, shadows } from '../theme/tokens';

export type TabKey = 'today' | 'garden' | 'lessons' | 'menu';

type TabSpec = {
  key: TabKey;
  label: string;
  width: number;
  marginLeft: number;
  paddingRight?: number;
  iconOffset: number;
  icon: (active: boolean) => ReactNode;
};

/** Widths and gaps are the design's own optical spacing; they sum to the 390 frame. */
const LEFT: TabSpec[] = [
  {
    key: 'today',
    label: 'Today',
    width: 66.5,
    marginLeft: 0,
    iconOffset: 1.4,
    icon: (active) => <CalendarIcon size={25} color={active ? colors.tabActiveIcon : colors.tabIcon} check />,
  },
  {
    key: 'garden',
    label: 'Garden',
    width: 73.9,
    marginLeft: 7.8,
    paddingRight: 2.6,
    iconOffset: 0,
    icon: (active) => (
      <GardenIcon
        color={active ? colors.tabActiveIcon : colors.tabIcon}
        cutout={active ? colors.tabActiveBg : colors.tabBg}
      />
    ),
  },
];

const RIGHT: TabSpec[] = [
  { key: 'lessons', label: 'Lessons', width: 73.9, marginLeft: 12.6, iconOffset: 2, icon: () => <LessonsIcon /> },
  {
    key: 'menu',
    label: 'Menu',
    width: 64.3,
    marginLeft: 8.7,
    iconOffset: 0.6,
    icon: (active) => <MenuIcon color={active ? colors.tabActiveIcon : colors.tabIcon} />,
  },
];

type TabBarProps = {
  active: TabKey;
  accent: string;
  /** Bottom safe-area inset (useSafeAreaInsets().bottom in the app). */
  bottomInset: number;
  onTabPress?: (key: TabKey) => void;
  onAddPress?: () => void;
};

export function TabBar({ active, accent, bottomInset, onTabPress, onAddPress }: TabBarProps) {
  const renderTab = (tab: TabSpec) => {
    const isActive = tab.key === active;
    return (
      <Pressable
        key={tab.key}
        accessibilityRole="tab"
        accessibilityState={{ selected: isActive }}
        onPress={() => onTabPress?.(tab.key)}
        style={({ pressed }) => [
          styles.tab,
          { width: tab.width, marginLeft: tab.marginLeft, paddingRight: tab.paddingRight ?? 0 },
          isActive && styles.tabActive,
          pressed && styles.pressed,
        ]}
      >
        <View style={styles.tabIcon}>
          <View style={{ marginTop: tab.iconOffset }}>{tab.icon(isActive)}</View>
        </View>
        <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.label}</Text>
      </Pressable>
    );
  };

  return (
    <View accessibilityRole="tablist" accessibilityLabel="Main" style={[styles.bar, { height: 50.9 + bottomInset }]}>
      {LEFT.map(renderTab)}
      <Pressable
        accessibilityLabel="Add entry"
        onPress={onAddPress}
        style={({ pressed }) => [styles.fab, { backgroundColor: accent }, pressed && styles.fabPressed]}
      >
        <PlusIcon />
      </Pressable>
      {RIGHT.map(renderTab)}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingTop: 3.9,
    paddingLeft: 7.1,
    paddingRight: 8,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    backgroundColor: colors.surface,
    boxShadow: shadows.tabBar,
  },
  tab: {
    height: 54.6,
    paddingTop: 5,
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.tabBorder,
    backgroundColor: colors.tabBg,
  },
  tabActive: { borderColor: colors.tabActiveBorder, backgroundColor: colors.tabActiveBg },
  tabIcon: { height: 25, flexDirection: 'row', alignItems: 'center' },
  tabLabel: { ...font('700', 10.2, 13), marginTop: 2.1, color: colors.tabText },
  tabLabelActive: { ...font('800', 10.4, 13), color: colors.tabActiveText },
  fab: {
    width: 55.5,
    height: 55,
    marginTop: -12.3,
    marginLeft: 11.7,
    borderRadius: 17,
    borderWidth: 2,
    borderColor: colors.accentBorder,
    experimental_backgroundImage: accentSheen,
    boxShadow: shadows.fab,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fabPressed: { transform: [{ scale: 0.95 }] },
  pressed: { opacity: 0.7 },
});
