/**
 * "All entries" screen (React Native 0.82), opened from Menu → All entries. Layout numbers are pt measured on the
 * 390pt-wide mockup. Needs: react-native-svg, react-native-safe-area-context, Nunito fonts (PostScript names).
 * Entries come grouped by day (`groups`); search text and the selected chip are controlled or internal.
 */
import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, TextInput, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav, useNavHeight } from '../components/BottomNav';
import {
  CalendarPencilIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CoinIcon,
  DumbbellFlatIcon,
  ForkKnifeIcon,
  MoonIcon,
  SearchIcon,
  SlidersIcon,
  WalletIcon,
} from '../components/icons';
import { Decor } from '../decor/Decor';
import {
  ENTRIES_ANCHORS,
  ENTRIES_DECOR,
  ENTRIES_PAPER,
  EntriesEndGarlands,
  EntriesHero,
} from '../decor/entriesDecor';

export type EntryKind = 'income' | 'expense' | 'exercise' | 'meal' | 'sleep';
export type Entry = {
  id: string;
  kind: EntryKind;
  title: string;
  /** Small line under the title, e.g. "Income". The time is appended after a dot. */
  category: string;
  time: string;
  /** Right-hand value, already formatted ("+2,000,000đ", "30 min", "~500 kcal"). */
  value: string;
};
export type EntryGroup = { key: string; title: string; entries: Entry[] };
export type ChipKey = 'all' | 'meals' | 'money' | 'activity' | 'sleep';

/** Chips in mockup order; `w` is the chip's share of the row (its width in the mockup, pt). */
export const ENTRY_CHIPS: { key: ChipKey; label: string; w: number }[] = [
  { key: 'all', label: 'All', w: 59.6 },
  { key: 'meals', label: 'Meals', w: 66.9 },
  { key: 'money', label: 'Money', w: 66.9 },
  { key: 'activity', label: 'Activity', w: 71.5 },
  { key: 'sleep', label: 'Sleep', w: 60.4 },
];

export const SAMPLE_GROUPS: EntryGroup[] = [
  {
    key: '2026-10-24',
    title: 'Today · Sat, Oct 24',
    entries: [
      { id: 'e1', kind: 'income', title: 'Bonus', category: 'Income', time: '8:30 PM', value: '+2,000,000đ' },
      { id: 'e2', kind: 'exercise', title: 'Evening run', category: 'Exercise', time: '6:10 PM', value: '30 min' },
      { id: 'e3', kind: 'expense', title: 'Beef pho', category: 'Expense', time: '8:15 AM', value: '−50,000đ' },
      { id: 'e4', kind: 'meal', title: 'Beef pho', category: 'Meal', time: '8:15 AM', value: '~500 kcal' },
    ],
  },
  {
    key: '2026-10-23',
    title: 'Yesterday · Fri, Oct 23',
    entries: [{ id: 'e5', kind: 'sleep', title: 'Night sleep', category: 'Sleep', time: '7:10 AM', value: '7h 20m' }],
  },
];

const KIND: Record<EntryKind, { tile: string; value: string }> = {
  income: { tile: '#E1EEBE', value: '#24500A' },
  meal: { tile: '#E1EEBE', value: '#24500A' },
  expense: { tile: '#FDE6B1', value: '#9A2A08' },
  exercise: { tile: '#C6EAF7', value: '#073445' },
  sleep: { tile: '#C6EAF7', value: '#073445' },
};

function KindIcon({ kind }: { kind: EntryKind }) {
  switch (kind) {
    case 'income':
      return <WalletIcon width={21.1} height={19.7} color="#244807" bg={KIND.income.tile} />;
    case 'exercise':
      return <DumbbellFlatIcon />;
    case 'expense':
      return <CoinIcon />;
    case 'meal':
      return <ForkKnifeIcon width={18.3} height={21.5} color="#1C3E04" />;
    case 'sleep':
      return <MoonIcon size={25.6} color="#01445C" />;
  }
}

type Props = {
  groups?: EntryGroup[];
  query?: string;
  onQueryChange?: (q: string) => void;
  chip?: ChipKey;
  onChipChange?: (c: ChipKey) => void;
  dateLabel?: string;
  onBack?: () => void;
  onDatePress?: () => void;
  onFiltersPress?: () => void;
  onEntryPress?: (id: string) => void;
};

export default function EntriesScreen({
  groups = SAMPLE_GROUPS,
  query: queryProp,
  onQueryChange,
  chip: chipProp,
  onChipChange,
  dateLabel = 'All dates',
  onBack,
  onDatePress,
  onFiltersPress,
  onEntryPress,
}: Props) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();
  const { width } = useWindowDimensions();
  const narrow = Math.min(1, width / 390);
  const headerH = insets.top + 140; // title block, down to the search box
  const [queryState, setQuery] = useState('');
  const [chipState, setChip] = useState<ChipKey>('all');
  const query = queryProp ?? queryState;
  const chip = chipProp ?? chipState;
  const scrollY = useRef(new Animated.Value(0)).current;
  const statusOpacity = scrollY.interpolate({ inputRange: [0, 24], outputRange: [0, 1], extrapolate: 'clamp' });
  const chipFont = { fontSize: 12.2 * Math.max(0.92, narrow) };

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: navH + 29.2 }}
      >
        <View style={{ height: headerH }}>
          <EntriesHero headerHeight={headerH} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={6}
            style={({ pressed }) => [styles.back, { top: insets.top + 36.4 }, pressed ? styles.pressed : null]}
          >
            <ChevronLeft size={23} strokeWidth={2.8} />
          </Pressable>
          <Text accessibilityRole="header" style={[styles.title, { top: insets.top + 78.1 }]}>All entries</Text>
          <Text style={[styles.subtitle, { top: insets.top + 113.9 }]}>Little moments, all in one place.</Text>
        </View>

        {/* search */}
        <View style={styles.search}>
          <SearchIcon />
          <TextInput
            value={query}
            onChangeText={(q) => {
              setQuery(q);
              onQueryChange?.(q);
            }}
            placeholder="Search your entries..."
            placeholderTextColor="#866857"
            returnKeyType="search"
            accessibilityLabel="Search your entries"
            style={styles.searchInput}
          />
        </View>

        {/* category chips */}
        <View>
          <Decor asset={ENTRIES_DECOR.flowersChipsLeft} style={ENTRIES_ANCHORS.flowersChipsLeft} />
          <View style={styles.chips} accessibilityRole="tablist">
            {ENTRY_CHIPS.map((c) => {
              const on = c.key === chip;
              return (
                <Pressable
                  key={c.key}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: on }}
                  onPress={() => {
                    setChip(c.key);
                    onChipChange?.(c.key);
                  }}
                  style={[styles.chip, { flexGrow: c.w }, on ? styles.chipOn : null]}
                >
                  <Text numberOfLines={1} style={[on ? styles.chipTextOn : styles.chipText, chipFont]}>{c.label}</Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* dates + filters; zIndex so the corner flowers lie over the first card like in the mockup */}
        <View style={{ zIndex: 2 }}>
          <View style={styles.tools}>
            <Pressable accessibilityRole="button" onPress={onDatePress} style={({ pressed }) => [styles.dates, pressed ? styles.pressed : null]}>
              <CalendarPencilIcon />
              <Text numberOfLines={1} style={styles.toolText}>{dateLabel}</Text>
              <ChevronDown size={18} color="#282E0B" strokeWidth={2.6} style={styles.caret} />
            </Pressable>
            <Pressable accessibilityRole="button" onPress={onFiltersPress} style={({ pressed }) => [styles.filters, pressed ? styles.pressed : null]}>
              <SlidersIcon />
              <Text style={[styles.toolText, { marginLeft: 10.8 }]}>Filters</Text>
            </Pressable>
          </View>
          <Decor asset={ENTRIES_DECOR.flowersFiltersRight} style={ENTRIES_ANCHORS.flowersFiltersRight} />
        </View>

        {groups.map((g, gi) => (
          <View key={g.key}>
            <Text accessibilityRole="header" style={[styles.section, gi === 0 ? { marginTop: 15 } : null]}>
              {g.title.toUpperCase()}
            </Text>
            {g.entries.map((e, i) => (
              <Pressable
                key={e.id}
                accessibilityRole="button"
                accessibilityLabel={`${e.title}, ${e.category}, ${e.time}, ${e.value}`}
                onPress={() => onEntryPress?.(e.id)}
                style={({ pressed }) => [styles.card, i > 0 ? { marginTop: 4.2 } : null, pressed ? styles.pressed : null]}
              >
                <View style={[styles.tile, { backgroundColor: KIND[e.kind].tile }]}>
                  <KindIcon kind={e.kind} />
                </View>
                <View style={styles.cardText}>
                  <Text numberOfLines={1} style={styles.cardTitle}>{e.title}</Text>
                  <View style={styles.subRow}>
                    <Text numberOfLines={1} style={styles.cardSub}>{e.category}</Text>
                    <Text style={styles.cardDot}>·</Text>
                    <Text style={styles.cardSub}>{e.time}</Text>
                  </View>
                </View>
                <Text numberOfLines={1} style={[styles.value, { color: KIND[e.kind].value, fontSize: 15.2 * Math.max(0.9, narrow) }]}>
                  {e.value}
                </Text>
                <View style={styles.chev}>
                  <ChevronRight size={18} color="#1A4201" strokeWidth={2.6} />
                </View>
              </Pressable>
            ))}
          </View>
        ))}

        <EntriesEndGarlands navHeight={navH} />
      </Animated.ScrollView>

      <Animated.View pointerEvents="none" style={[styles.statusBar, { height: insets.top, opacity: statusOpacity }]} />
      <BottomNav active="menu" />
    </View>
  );
}

const INK = '#1E0000';
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: ENTRIES_PAPER },
  statusBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: ENTRIES_PAPER },
  pressed: { opacity: 0.7 },

  back: {
    position: 'absolute', left: 17.9, width: 34.4, height: 35.4, borderRadius: 9.5, backgroundColor: '#5B7038',
    borderWidth: 1, borderColor: '#46602A', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 6px rgba(110,80,30,0.22)',
  },
  title: {
    position: 'absolute', left: 20.6, fontFamily: 'Nunito-Black', fontSize: 33, lineHeight: 40, letterSpacing: -1.5, color: INK,
  },
  subtitle: { position: 'absolute', left: 21.4, fontFamily: 'Nunito-Regular', fontSize: 14.1, lineHeight: 18, color: '#5C3F2E' },

  search: {
    marginLeft: 17.9, marginRight: 17.4, height: 49, borderRadius: 13, borderWidth: 1.2, borderColor: '#BAB995',
    backgroundColor: '#FEF9ED', flexDirection: 'row', alignItems: 'center', paddingLeft: 19.2,
    boxShadow: '0 1px 3px rgba(120, 100, 60, 0.12)',
  },
  searchInput: {
    flex: 1, alignSelf: 'stretch', marginLeft: 12.4, paddingVertical: 0, paddingRight: 12, fontFamily: 'Nunito-Regular',
    fontSize: 14, color: INK,
  },

  chips: { flexDirection: 'row', marginTop: 9.6, marginLeft: 19.4, marginRight: 17.2, gap: 7 },
  chip: {
    flexBasis: 0, height: 34.2, borderRadius: 13, borderWidth: 1.2, borderColor: '#BAB995', backgroundColor: '#FEF4DF',
    alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4,
  },
  chipOn: { backgroundColor: '#405A27', borderColor: '#2F4319', boxShadow: '0 2px 4px rgba(50,70,20,0.25)' },
  chipText: { fontFamily: 'Nunito-ExtraBold', fontSize: 12.2, lineHeight: 16, letterSpacing: -0.3, color: '#2C0806' },
  chipTextOn: { fontFamily: 'Nunito-ExtraBold', fontSize: 12.2, lineHeight: 16, letterSpacing: -0.3, color: '#FFF8E6' },

  tools: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 11, marginLeft: 19.2, marginRight: 17.4 },
  dates: {
    width: 165.4, maxWidth: '58%', height: 36.7, borderRadius: 12, borderWidth: 1.2, borderColor: '#BAB995',
    backgroundColor: '#FEF8EC', flexDirection: 'row', alignItems: 'center', paddingLeft: 14.9, paddingRight: 11,
  },
  filters: {
    width: 93.5, height: 36.7, borderRadius: 12, borderWidth: 1.2, borderColor: '#BAB995', backgroundColor: '#FEF8EC',
    flexDirection: 'row', alignItems: 'center', paddingLeft: 14.7,
  },
  toolText: { flexShrink: 1, marginLeft: 12.3, fontFamily: 'Nunito-ExtraBold', fontSize: 12.6, lineHeight: 16, letterSpacing: -0.3, color: '#2C0806' },
  caret: { marginLeft: 'auto' },

  section: {
    marginTop: 13.7, marginBottom: 5.7, marginLeft: 20.6, fontFamily: 'Nunito-ExtraBold', fontSize: 12.45, lineHeight: 15,
    letterSpacing: 0.5, color: '#664838',
  },
  card: {
    marginLeft: 19.2, marginRight: 17, height: 64.3, borderRadius: 13, borderWidth: 1.2, borderColor: '#BAB995',
    backgroundColor: '#FEF7EA', flexDirection: 'row', alignItems: 'center', paddingLeft: 10.8, paddingRight: 9.3,
    boxShadow: '0 1px 3px rgba(120, 100, 60, 0.12)',
  },
  tile: { width: 41.7, height: 41.7, borderRadius: 9.5, alignItems: 'center', justifyContent: 'center' },
  cardText: { flex: 1, marginLeft: 14.6, marginRight: 8 },
  cardTitle: { fontFamily: 'Nunito-ExtraBold', fontSize: 15.3, lineHeight: 19, letterSpacing: -0.3, color: '#320805' },
  subRow: { flexDirection: 'row', alignItems: 'center', marginTop: 1.9 },
  cardSub: { flexShrink: 1, fontFamily: 'Nunito-Regular', fontSize: 11.9, lineHeight: 15, color: '#6E4E3D' },
  cardDot: { marginHorizontal: 3.4, fontFamily: 'Nunito-ExtraBold', fontSize: 11.9, lineHeight: 15, color: '#6E4E3D' },
  value: { marginRight: 9.6, fontFamily: 'Nunito-ExtraBold', fontSize: 15.2, lineHeight: 19, letterSpacing: -0.5 },
  chev: {
    width: 31.6, height: 31.6, borderRadius: 15.8, alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F2DD',
    borderWidth: 1, borderColor: '#DCDDBB',
  },
});
