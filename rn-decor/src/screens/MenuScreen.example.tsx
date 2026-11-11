/**
 * "Menu" screen (React Native 0.82), opened from the Menu tab. Layout numbers are pt measured on the
 * 390pt-wide mockup. Needs: react-native-svg, react-native-safe-area-context, Nunito fonts (PostScript names).
 * Rows are data: add, remove or reorder them in MENU_SECTIONS; corner flowers stay on the cards' corners.
 */
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav, useNavHeight } from '../components/BottomNav';
import {
  BellIcon,
  BookWideIcon,
  CalendarBellIcon,
  ChevronRight,
  FlagWavyIcon,
  GlobeIcon,
  HelpBubbleIcon,
  PersonIcon,
  ShieldLeafIcon,
  SunriseIcon,
} from '../components/icons';
import { Decor } from '../decor/Decor';
import { MENU_ANCHORS, MENU_DECOR, MENU_PAPER, MenuHero, MenuNavGarlands } from '../decor/menuDecor';

export type MenuItemKey =
  | 'entries'
  | 'goals'
  | 'events'
  | 'notifications'
  | 'language'
  | 'appearance'
  | 'privacy'
  | 'help';

type Tone = 'green' | 'amber' | 'blue';
export type MenuItem = { key: MenuItemKey; label: string; tone: Tone; icon: React.ReactNode; value?: string };
export type MenuSection = { key: 'journal' | 'prefs' | 'more'; title: string; items: MenuItem[] };

const TILE: Record<Tone, string> = { green: '#E1ECC4', amber: '#FEE9B6', blue: '#C9EBF4' };

export const MENU_SECTIONS: MenuSection[] = [
  {
    key: 'journal',
    title: 'Your journal',
    items: [
      { key: 'entries', label: 'All entries', tone: 'green', icon: <BookWideIcon /> },
      { key: 'goals', label: 'Weekly goals', tone: 'amber', icon: <FlagWavyIcon /> },
      { key: 'events', label: 'Event reminders', tone: 'blue', icon: <CalendarBellIcon width={24.4} height={27.1} style={{ marginTop: -2 }} /> },
    ],
  },
  {
    key: 'prefs',
    title: 'Preferences',
    items: [
      { key: 'notifications', label: 'Notifications', tone: 'amber', icon: <BellIcon size={27.5} color="#B57500" /> },
      { key: 'language', label: 'Language', tone: 'blue', icon: <GlobeIcon />, value: 'English' },
      { key: 'appearance', label: 'Appearance', tone: 'green', icon: <SunriseIcon style={{ marginTop: -2.5 }} />, value: 'Light' },
    ],
  },
  {
    key: 'more',
    title: 'More',
    items: [
      { key: 'privacy', label: 'Data & privacy', tone: 'green', icon: <ShieldLeafIcon width={21.5} height={25.8} /> },
      { key: 'help', label: 'Help & feedback', tone: 'amber', icon: <HelpBubbleIcon /> },
    ],
  },
];

type Props = {
  sections?: MenuSection[];
  profileSub?: string;
  onOpenProfile?: () => void;
  onOpen?: (key: MenuItemKey) => void;
};

function Chevron({ d }: { d: number }) {
  return (
    <View style={[styles.chev, { width: d, height: d, borderRadius: d / 2 }]}>
      <ChevronRight size={18} color="#1A4201" strokeWidth={2.6} />
    </View>
  );
}

function Row({ item, first, onPress }: { item: MenuItem; first: boolean; onPress?: () => void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={item.value ? `${item.label}, ${item.value}` : item.label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed ? styles.pressed : null]}
    >
      {first ? null : <View style={styles.divider} />}
      <View style={[styles.tile, { backgroundColor: TILE[item.tone] }]}>{item.icon}</View>
      <Text numberOfLines={1} style={styles.rowLabel}>{item.label}</Text>
      {item.value ? <Text numberOfLines={1} style={styles.rowValue}>{item.value}</Text> : null}
      <Chevron d={28.4} />
    </Pressable>
  );
}

/** Flowers that sit on each card's corners (rendered after the card). */
function SectionDecor({ k }: { k: MenuSection['key'] }) {
  if (k === 'journal')
    return (
      <>
        <Decor asset={MENU_DECOR.flowersJournalTopRight} style={MENU_ANCHORS.flowersJournalTopRight} />
        <Decor asset={MENU_DECOR.flowersJournalLeft} style={MENU_ANCHORS.flowersJournalLeft} />
        <Decor asset={MENU_DECOR.flowersJournalRight} style={MENU_ANCHORS.flowersJournalRight} />
      </>
    );
  if (k === 'prefs') return <Decor asset={MENU_DECOR.flowersPrefsLeft} style={MENU_ANCHORS.flowersPrefsLeft} />;
  return <Decor asset={MENU_DECOR.flowersMoreTopRight} style={MENU_ANCHORS.flowersMoreTopRight} />;
}

export default function MenuScreen({ sections = MENU_SECTIONS, profileSub = 'Make this space your own', onOpenProfile, onOpen }: Props) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();
  const { width } = useWindowDimensions();
  const narrow = Math.min(1, width / 390);
  const headerH = insets.top + 96; // title block, down to the profile card
  const scrollY = useRef(new Animated.Value(0)).current;
  const statusOpacity = scrollY.interpolate({ inputRange: [0, 24], outputRange: [0, 1], extrapolate: 'clamp' });

  return (
    <View style={styles.root}>
      <MenuNavGarlands navHeight={navH} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={{ paddingBottom: navH + 24.2 }}
      >
        <View style={{ height: headerH }}>
          <MenuHero headerHeight={headerH} />
          <Text accessibilityRole="header" style={[styles.title, { top: insets.top + 29.2 }]}>Menu</Text>
          <Text style={[styles.subtitle, { top: insets.top + 65.5 }]}>Your little corner.</Text>
        </View>

        {/* profile */}
        <View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Your profile. ${profileSub}`}
            onPress={onOpenProfile}
            style={({ pressed }) => [styles.profile, pressed ? styles.pressed : null]}
          >
            <View style={styles.avatar}>
              <PersonIcon width={23} height={27.2} />
            </View>
            <View style={styles.profileText}>
              <Text numberOfLines={1} style={styles.profileTitle}>Your profile</Text>
              <Text numberOfLines={1} style={[styles.profileSub, { fontSize: 13 * Math.max(0.94, narrow) }]}>{profileSub}</Text>
            </View>
            <View style={styles.profileChev}>
              <Chevron d={31.2} />
            </View>
          </Pressable>
          <Decor asset={MENU_DECOR.flowersProfileLeft} style={MENU_ANCHORS.flowersProfileLeft} />
        </View>

        {sections.map((sec) => (
          <View key={sec.key}>
            <Text accessibilityRole="header" style={styles.sectionLabel}>{sec.title.toUpperCase()}</Text>
            <View>
              <View style={styles.card}>
                {sec.items.map((it, i) => (
                  <Row key={it.key} item={it} first={i === 0} onPress={() => onOpen?.(it.key)} />
                ))}
              </View>
              <SectionDecor k={sec.key} />
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <Animated.View pointerEvents="none" style={[styles.statusBar, { height: insets.top, opacity: statusOpacity }]} />
      <BottomNav active="menu" />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: MENU_PAPER },
  statusBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: MENU_PAPER },
  title: {
    position: 'absolute', left: 19.2, fontFamily: 'Nunito-Black', fontSize: 34.1, lineHeight: 40, letterSpacing: -1,
    color: '#1E0000',
  },
  subtitle: { position: 'absolute', left: 21, fontFamily: 'Nunito-Regular', fontSize: 14.9, lineHeight: 18, color: '#5C3F2E' },
  pressed: { opacity: 0.7 },

  profile: {
    marginLeft: 17.4, marginRight: 18.3, height: 66.4, flexDirection: 'row', alignItems: 'center', paddingLeft: 11.7,
    borderRadius: 13, borderWidth: 1.2, borderColor: '#BAB995', backgroundColor: '#FDF5E8',
    boxShadow: '0 1px 3px rgba(120, 100, 60, 0.12)',
  },
  avatar: {
    width: 56.8, height: 56.8, borderRadius: 28.4, backgroundColor: '#E1EAC4', alignItems: 'center', justifyContent: 'center',
  },
  profileText: { flex: 1, alignSelf: 'stretch', marginLeft: 83.6 - 11.7 - 56.8 - 1.2, paddingTop: 11.7 + 0.8, paddingRight: 8 },
  profileTitle: { fontFamily: 'Nunito-ExtraBold', fontSize: 16, lineHeight: 20, letterSpacing: -0.3, color: '#1E0000' },
  profileSub: { marginTop: 2.5, fontFamily: 'Nunito-Regular', fontSize: 13, lineHeight: 16, color: '#5D3E30' },
  profileChev: { marginRight: 13 - 1.2 },

  sectionLabel: {
    marginTop: 15.3, marginBottom: 4.3, marginLeft: 22.3, fontFamily: 'Nunito-ExtraBold', fontSize: 12.45, lineHeight: 15,
    letterSpacing: 1, color: '#5E3A2A',
  },
  card: {
    marginLeft: 17.4, marginRight: 18.3, paddingTop: 2, paddingBottom: 2, borderRadius: 13, borderWidth: 1.2, borderColor: '#BAB995',
    backgroundColor: '#FDF7EB', boxShadow: '0 1px 3px rgba(120, 100, 60, 0.12)',
  },
  row: { height: 50.6, flexDirection: 'row', alignItems: 'center', paddingLeft: 13.5, paddingRight: 9.6 },
  divider: { position: 'absolute', top: 0, left: 8.9, right: 8.7, height: 1, backgroundColor: '#F1E3CB' },
  tile: { width: 40.8, height: 40.8, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  rowLabel: {
    flex: 1, marginLeft: 67.2 - 13.5 - 40.8, fontFamily: 'Nunito-ExtraBold', fontSize: 16.1, lineHeight: 20, letterSpacing: -0.3,
    color: '#1B0000',
  },
  rowValue: { marginLeft: 8, marginRight: 10.3, fontFamily: 'Nunito-Regular', fontSize: 12.6, lineHeight: 16, color: '#1D0000' },
  chev: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#F4F2DD', borderWidth: 1, borderColor: '#DCDDBB' },
});
