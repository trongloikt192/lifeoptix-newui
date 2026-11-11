/**
 * "Garden" screen (React Native 0.82), the Garden tab. Layout numbers are pt measured on the 390pt-wide mockup.
 * Needs: react-native-svg, react-native-safe-area-context, Nunito fonts (PostScript names).
 * The plant card's picture (without the tree) is part of the top art (GardenHero); the tree of the current stage is
 * its own layer (GardenTree, data.tree); the card frame, labels and info panel are code laid over them with
 * useGardenGeometry(), so everything stays on the picture on every screen width.
 */
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav, useNavHeight } from '../components/BottomNav';
import { DropIcon, LockIcon } from '../components/icons';
import { Decor, type DecorAsset } from '../decor/Decor';
import {
  GARDEN_ANCHORS,
  GARDEN_DECOR,
  GARDEN_PAPER,
  GardenEndGarlands,
  GardenHero,
  GardenTree,
  GARDEN_TREES,
  type TreeArt,
  STAT_SPRIGS,
  useGardenGeometry,
} from '../decor/gardenDecor';

export type Badge = {
  key: string;
  title: string;
  /** "Earned 30/09" when earned, otherwise how to get it. */
  sub: string;
  earned: boolean;
  art: DecorAsset;
};

export type GardenData = {
  /** Tree picture of the current stage (GARDEN_TREES.mature, …). */
  tree: TreeArt;
  stageLabel: string; // "Day 31 · Mature"
  health: string; // "Healthy"
  tip: string;
  points: number;
  /** Points still needed for the next stage, its name, and how far the plant is through the current stage (0–1). */
  toNext: number;
  nextStage: string;
  stageProgress: number;
  streak: number;
  badgesEarned: number;
  badges: Badge[];
  warning: string;
};

export const SAMPLE_GARDEN: GardenData = {
  tree: GARDEN_TREES.mature,
  stageLabel: 'Day 31 · Mature',
  health: 'Healthy',
  tip: 'Log at least once today to keep your plant growing',
  points: 45,
  toNext: 45,
  nextStage: 'Blooming',
  stageProgress: 0, // Mature starts at 45 points, Blooming at 90: the bar is empty in the mockup
  streak: 31,
  badgesEarned: 2,
  badges: [
    { key: '7day', title: '7-day\nstreak', sub: 'Earned 30/09', earned: true, art: GARDEN_DECOR.badge7Day },
    { key: '30day', title: '30-day\nstreak', sub: 'Earned 24/10', earned: true, art: GARDEN_DECOR.badge30Day },
    { key: '100day', title: '100-day\nstreak', sub: '100-day streak', earned: false, art: GARDEN_DECOR.badge100DayLocked },
    { key: 'discipline', title: 'Discipline\nmaster', sub: '180-day streak', earned: false, art: GARDEN_DECOR.badgeDisciplineLocked },
    { key: 'greenlife', title: 'Green life', sub: 'Plant reaches\n90 points', earned: false, art: GARDEN_DECOR.badgeGreenLifeLocked },
  ],
  warning: 'Miss 3 days and your tree starts to wilt',
};

type Props = { data?: GardenData; onBadgePress?: (key: string) => void };

const COLS = 4;
/** Stat card widths and gaps in the mockup (pt); cards share the row in these proportions. */
const STAT_W = [117.8, 115.5, 116.9];
const STAT_GAP = [6.4, 5];

export default function GardenScreen({ data = SAMPLE_GARDEN, onBadgePress }: Props) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();
  const { width } = useWindowDimensions();
  const narrow = Math.min(1, width / 390);
  const g = useGardenGeometry(insets.top);
  const scrollY = useRef(new Animated.Value(0)).current;
  const statusOpacity = scrollY.interpolate({ inputRange: [0, 24], outputRange: [0, 1], extrapolate: 'clamp' });
  const progress = Math.max(0, Math.min(1, data.stageProgress));
  const rows: Badge[][] = [];
  data.badges.forEach((b, i) => (i % COLS ? rows[rows.length - 1].push(b) : rows.push([b])));
  const stats = [
    { value: String(data.streak), label: 'day streak', green: false },
    { value: String(data.points), label: 'growth points', green: false },
    { value: String(data.badgesEarned), label: 'badges earned', green: true },
  ];

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: navH + 30.4 }}
      >
        <GardenHero top={g.top} />
        <Text accessibilityRole="header" style={[styles.title, { top: insets.top + 25.7 }]}>Garden</Text>

        {/* plant card: transparent frame over the picture in the hero, info panel below it */}
        <View style={{ height: g.cardTop }} />
        <View style={[styles.card, { marginLeft: g.cardLeft, width: g.cardWidth }]}>
          <View style={{ height: g.pictureHeight }} />
          <View style={styles.panel}>
            <View style={styles.tipRow}>
              <DropIcon />
              <Text style={[styles.tip, { fontSize: 11.5 * Math.max(0.93, narrow) }]} numberOfLines={2}>{data.tip}</Text>
              <Text style={styles.pts}>{data.points} pts</Text>
            </View>
            <View
              style={styles.track}
              accessibilityRole="progressbar"
              accessibilityValue={{ min: 0, max: 100, now: Math.round(progress * 100) }}
            >
              <View style={[styles.fill, { width: `${Math.round(progress * 100)}%` }]} />
            </View>
            <Text style={styles.toNext}>{`${data.toNext} points to ${data.nextStage}`}</Text>
          </View>
        </View>
        <GardenTree tree={data.tree} top={g.top} left={g.artLeft} />
        {/* labels on the picture: after the tree so a big tree never hides them */}
        <Text style={[styles.stage, { left: g.cardLeft + 1.4 + 13.2, top: g.cardTop + 1.4 + 15 }]}>
          {data.stageLabel.toUpperCase()}
        </Text>
        <View style={[styles.health, { right: width - g.cardLeft - g.cardWidth + 1.4 + 10.1, top: g.cardTop + 1.4 + 14.4 }]}>
          <Text style={styles.healthText}>{data.health}</Text>
        </View>

        {/* stats */}
        <View>
          <View style={styles.stats}>
            {stats.map((st, i) => (
              <View key={st.label} style={[styles.stat, { flexGrow: STAT_W[i], marginLeft: i ? STAT_GAP[i - 1] : 0 }]}>
                {/* sprig first: the label is drawn over its leaves, as in the mockup */}
                <Decor asset={STAT_SPRIGS[i % 3].asset} style={STAT_SPRIGS[i % 3].at} />
                <Text style={[styles.statValue, st.green ? { color: '#1E4A06' } : null]}>{st.value}</Text>
                <Text numberOfLines={1} style={[styles.statLabel, { fontSize: 12.2 * Math.max(0.9, narrow) }]}>{st.label}</Text>
              </View>
            ))}
          </View>
          <Decor asset={GARDEN_DECOR.leavesLeftMid} style={GARDEN_ANCHORS.leavesLeftMid} />
          <Decor asset={GARDEN_DECOR.leavesRightMid} style={GARDEN_ANCHORS.leavesRightMid} />
        </View>

        {/* badges */}
        <Text accessibilityRole="header" style={styles.section}>BADGES</Text>
        {rows.map((row, ri) => (
          <View key={ri} style={[styles.badgeRow, ri ? { marginTop: 4 } : null]}>
            {Array.from({ length: COLS }, (_, ci) => {
              const b = row[ci];
              if (!b) return <View key={ci} style={styles.badgeSlot} />;
              return (
                <Pressable
                  key={b.key}
                  accessibilityRole="button"
                  accessibilityLabel={`${b.title.replace('\n', ' ')}, ${b.earned ? b.sub : `locked, ${b.sub.replace('\n', ' ')}`}`}
                  onPress={() => onBadgePress?.(b.key)}
                  style={[styles.badgeSlot, styles.badge, b.earned ? styles.badgeEarned : styles.badgeLocked]}
                >
                  <View style={styles.art}>
                    <Decor asset={b.art} style={{ left: 0, top: 0 }} />
                    {b.earned ? null : <LockIcon style={styles.lock} />}
                  </View>
                  <Text style={[styles.badgeTitle, b.earned ? null : styles.lockedTitle]}>{b.title}</Text>
                  <Text style={[styles.badgeSub, b.earned ? null : styles.lockedSub]}>{b.sub}</Text>
                </Pressable>
              );
            })}
          </View>
        ))}

        <View style={styles.warnRow}>
          <Text style={styles.warn}>{data.warning}</Text>
          <Decor asset={GARDEN_DECOR.wiltFlower} style={{ position: 'relative', marginLeft: 2.8 }} />
        </View>

        <GardenEndGarlands navHeight={navH} />
      </Animated.ScrollView>

      <Animated.View pointerEvents="none" style={[styles.statusBar, { height: insets.top, opacity: statusOpacity }]} />
      <BottomNav active="garden" />
    </View>
  );
}

const INK = '#2A0A02';
const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GARDEN_PAPER },
  statusBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: GARDEN_PAPER },
  title: {
    position: 'absolute', left: 15.4, fontFamily: 'Nunito-Black', fontSize: 29.3, lineHeight: 36, letterSpacing: -1, color: INK,
  },

  card: {
    borderRadius: 11.5, borderWidth: 1.4, borderColor: '#C3BE8C', overflow: 'hidden',
    boxShadow: '0 2px 5px rgba(120, 100, 60, 0.14)',
  },
  stage: {
    position: 'absolute', fontFamily: 'Nunito-ExtraBold', fontSize: 11, lineHeight: 14, letterSpacing: 0.7,
    color: '#3F4207',
  },
  health: {
    position: 'absolute', height: 20.6, paddingHorizontal: 9, borderRadius: 8,
    backgroundColor: '#FCF7E6', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px rgba(90, 80, 40, 0.15)',
  },
  healthText: { fontFamily: 'Nunito-ExtraBold', fontSize: 12.1, lineHeight: 15, letterSpacing: -0.2, color: '#1E4A06' },
  panel: {
    paddingTop: 11.6, paddingBottom: 8.8, paddingLeft: 12.8, paddingRight: 12.8, backgroundColor: '#FEF8EC',
    borderTopLeftRadius: 10, borderTopRightRadius: 10, boxShadow: '0 -1px 3px rgba(120, 100, 60, 0.10)',
  },
  tipRow: { flexDirection: 'row', alignItems: 'center', minHeight: 16 },
  tip: { flex: 1, marginLeft: 10.9, marginRight: 4, fontFamily: 'Nunito-Regular', fontSize: 11.5, lineHeight: 15, color: '#5C3F2E' },
  pts: { fontFamily: 'Nunito-ExtraBold', fontSize: 13, lineHeight: 16, color: '#1E4A06' },
  track: { marginTop: 8.4, marginLeft: -0.9, marginRight: -1.3, height: 7.8, borderRadius: 3.9, backgroundColor: '#F2E4D0', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 3.9, backgroundColor: '#8FA75A' },
  toNext: { marginTop: 4.4, fontFamily: 'Nunito-Regular', fontSize: 10.8, lineHeight: 14, color: '#6E5242' },

  stats: { flexDirection: 'row', marginTop: 7.3, marginLeft: 14.7, marginRight: 13.7 },
  stat: {
    flexBasis: 0, height: 63.7, paddingTop: 7.6, paddingLeft: 11.6, borderRadius: 12, borderWidth: 1.2, borderColor: '#C8C49B',
    backgroundColor: '#FEF8EC', boxShadow: '0 1px 3px rgba(120, 100, 60, 0.12)',
  },
  statValue: { fontFamily: 'Nunito-Black', fontSize: 23.4, lineHeight: 28, color: INK },
  statLabel: { marginTop: 0.6, fontFamily: 'Nunito-Regular', fontSize: 12.2, lineHeight: 16, color: '#4A2E22' },

  section: {
    marginTop: 12.4, marginBottom: 5.4, marginLeft: 16, fontFamily: 'Nunito-ExtraBold', fontSize: 11.3, lineHeight: 14,
    letterSpacing: 1, color: '#3A0C00',
  },
  badgeRow: { flexDirection: 'row', marginLeft: 15.1, marginRight: 13.7, gap: 4.6 },
  badgeSlot: { flex: 1 },
  badge: {
    alignItems: 'center', paddingTop: 4.8, paddingBottom: 9.9, paddingHorizontal: 3, borderRadius: 12,
    borderWidth: 1.2,
  },
  badgeEarned: { borderColor: '#EBD8A0', backgroundColor: '#FEF7E6', boxShadow: '0 2px 3px rgba(222, 184, 90, 0.35)' },
  badgeLocked: { borderColor: '#EDE4D3', backgroundColor: '#FDF7EC', boxShadow: '0 1px 2px rgba(120, 100, 60, 0.08)' },
  art: { width: 60, height: 60 },
  lock: { position: 'absolute', left: 43.4, top: 40.6 },
  badgeTitle: {
    marginTop: -1, textAlign: 'center', fontFamily: 'Nunito-ExtraBold', fontSize: 12.1, lineHeight: 12.8, letterSpacing: -0.3,
    color: INK,
  },
  lockedTitle: { color: '#6E5A4C' },
  badgeSub: { marginTop: 2.9, textAlign: 'center', fontFamily: 'Nunito-Regular', fontSize: 9.9, lineHeight: 11.4, color: '#5C3F2E' },
  lockedSub: { color: '#8E7B6E' },

  warnRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 1, paddingLeft: 22, paddingRight: 4 },
  warn: { flexShrink: 1, textAlign: 'center', fontFamily: 'Nunito-Regular', fontSize: 11.4, lineHeight: 15, color: '#5C3F2E' },
});
