/**
 * "Reports" screen (React Native 0.82), opened from the Insights tab. Layout numbers are pt measured on the
 * 390pt-wide mockup. Needs: react-native-svg, react-native-safe-area-context, Nunito fonts (PostScript names).
 */
import React, { useRef, useState } from 'react';
import { Animated, Pressable, StyleSheet, Text, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav, useNavHeight } from '../components/BottomNav';
import {
  BookOpenIcon,
  ChevronLeft,
  ChevronRight,
  LinkIcon,
  MoonClockIcon,
  MoonIcon,
  SparkleIcon,
  TrendUpIcon,
  WalletIcon,
} from '../components/icons';
import { Decor } from '../decor/Decor';
import {
  REPORTS_ANCHORS,
  REPORTS_DECOR,
  REPORTS_PAPER,
  ReportsHero,
  ReportsNavGarlands,
  STAT_SPRIGS,
} from '../decor/reportsDecor';

export type Period = 'week' | 'month';
export type StatKind = 'sleep' | 'food' | 'short' | 'entries';

export type Stat = {
  kind: StatKind;
  label: string;
  value: string;
  /** Line under the value. Ignored when `chip` is set. */
  sub?: string;
  /** Small highlighted comparison, e.g. "+28% vs last week". */
  chip?: string;
};

export type ReportsData = {
  range: string; // "12–18 Oct"
  rangeSub: string; // "Week 42 · 26 entries"
  stats: [Stat, Stat, Stat, Stat];
  pattern?: { title: string; text: string; sub: string };
  review: { title: string; sub: string; meta: string };
};

export const SAMPLE_REPORTS: ReportsData = {
  range: '12–18 Oct',
  rangeSub: 'Week 42 · 26 entries',
  stats: [
    { kind: 'sleep', label: 'Average sleep', value: '6h 10m', sub: 'per night' },
    { kind: 'food', label: 'Food spending', value: '612,000đ', chip: '+28% vs last week' },
    { kind: 'short', label: 'Short nights', value: '3', sub: 'under 6 hours' },
    { kind: 'entries', label: 'Entries logged', value: '26', sub: 'moments recorded' },
  ],
  pattern: {
    title: 'A pattern to explore',
    text: 'On tired days, spending was 35% above average.',
    sub: 'A connection to reflect on this week.',
  },
  review: {
    title: 'A strong week, with room for more rest.',
    sub: 'Sleep, spending and small steps for next week.',
    meta: 'AI Coach · 2 min read',
  },
};

const STAT_STYLE: Record<StatKind, { tile: string; label: string }> = {
  sleep: { tile: '#C6ECF8', label: '#09566C' },
  food: { tile: '#FEEDBF', label: '#924F00' },
  short: { tile: '#FEE7C3', label: '#872A03' },
  entries: { tile: '#E3EEC5', label: '#093300' },
};

function StatIcon({ kind }: { kind: StatKind }) {
  switch (kind) {
    case 'sleep':
      return <MoonIcon size={24} color="#0A4A68" />;
    case 'food':
      return <WalletIcon width={20.7} height={18} color="#B67702" bg="#FEEDBF" />;
    case 'short':
      return <MoonClockIcon size={25} />;
    case 'entries':
      return <BookOpenIcon />;
  }
}

type Props = {
  data?: ReportsData;
  period?: Period;
  onPeriodChange?: (p: Period) => void;
  onPrev?: () => void;
  onNext?: () => void;
  onOpenReview?: () => void;
};

export default function ReportsScreen({ data = SAMPLE_REPORTS, period: periodProp, onPeriodChange, onPrev, onNext, onOpenReview }: Props) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();
  const headerH = insets.top + 94.6; // title block, down to the Week/Month switch
  const [periodState, setPeriod] = useState<Period>('week');
  const period = periodProp ?? periodState;
  const scrollY = useRef(new Animated.Value(0)).current;
  const statusOpacity = scrollY.interpolate({ inputRange: [0, 24], outputRange: [0, 1], extrapolate: 'clamp' });
  const pick = (p: Period) => {
    setPeriod(p);
    onPeriodChange?.(p);
  };
  const [s1, s2, s3, s4] = data.stats;

  return (
    <View style={styles.root}>
      <ReportsNavGarlands navHeight={navH} />

      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={{ paddingBottom: navH + 19.2 }}
      >
        <View style={{ height: headerH }}>
          <ReportsHero headerHeight={headerH} />
          <Text accessibilityRole="header" style={[styles.title, { top: insets.top + 27.85 }]}>Reports</Text>
          <Text style={[styles.subtitle, { top: insets.top + 66.2 }]}>A little reflection, a clearer week.</Text>
        </View>

        {/* Week / Month */}
        <View style={styles.segment} accessibilityRole="tablist">
          {(['week', 'month'] as const).map((p) => {
            const on = p === period;
            return (
              <Pressable
                key={p}
                accessibilityRole="tab"
                accessibilityState={{ selected: on }}
                onPress={() => pick(p)}
                style={[styles.segItem, on ? styles.segOn : null]}
              >
                <Text style={on ? styles.segTextOn : styles.segText}>{p === 'week' ? 'Week' : 'Month'}</Text>
              </Pressable>
            );
          })}
        </View>

        {/* range switcher */}
        <View style={{ marginTop: 8.4 }}>
          <Decor asset={REPORTS_DECOR.leavesWeekLeft} style={REPORTS_ANCHORS.leavesWeekLeft} />
          <View style={styles.range}>
            <Pressable accessibilityRole="button" accessibilityLabel="Previous" onPress={onPrev} style={[styles.round, { left: 11.9 }]}>
              <ChevronLeft size={17} color="#253709" />
            </Pressable>
            <Pressable accessibilityRole="button" accessibilityLabel="Next" onPress={onNext} style={[styles.round, { right: 11.9 }]}>
              <ChevronRight size={17} color="#253709" strokeWidth={2.6} />
            </Pressable>
            <Text style={styles.rangeText}>{data.range}</Text>
            <Text style={styles.rangeSub}>{data.rangeSub}</Text>
          </View>
          <Decor asset={REPORTS_DECOR.leavesWeekRight} style={REPORTS_ANCHORS.leavesWeekRight} />
        </View>

        <Text accessibilityRole="header" style={styles.section}>Your week at a glance</Text>

        <View style={[styles.statRow, { marginTop: 6.9 }]}>
          <StatCard stat={s1} index={0} />
          <StatCard stat={s2} index={1} />
        </View>
        <View style={[styles.statRow, { marginTop: 8.7 }]}>
          <StatCard stat={s3} index={2} />
          <StatCard stat={s4} index={3} />
        </View>

        {data.pattern ? (
          <View style={{ marginTop: 8 }}>
            <View style={styles.pattern}>
              <View style={[styles.rowCenter]}>
                <LinkIcon width={18.3} height={11} color="#0F5F80" style={{ transform: [{ rotate: '-30deg' }] }} />
                <Text style={styles.patternTitle}>{data.pattern.title}</Text>
              </View>
              <Text style={styles.patternText}>{data.pattern.text}</Text>
              <Text style={styles.patternSub}>{data.pattern.sub}</Text>
            </View>
            <Decor asset={REPORTS_DECOR.flowersPattern} style={REPORTS_ANCHORS.flowersPattern} />
          </View>
        ) : null}

        {/* weekly review */}
        <View style={{ marginTop: 9.2 }}>
          <Decor asset={REPORTS_DECOR.leavesReviewLeft} style={REPORTS_ANCHORS.leavesReviewLeft} />
          <View style={styles.review}>
            <Decor asset={REPORTS_DECOR.reviewArt} style={REPORTS_ANCHORS.reviewArt} />
            <Decor asset={REPORTS_DECOR.reviewArtLeft} style={REPORTS_ANCHORS.reviewArtLeft} />
            <View style={styles.rowCenter}>
              <SparkleIcon size={13.3} color="#BE8106" />
              <Text style={styles.reviewLabel}>YOUR WEEKLY REVIEW</Text>
            </View>
            <Text style={styles.reviewTitle}>{data.review.title}</Text>
            <Text style={styles.reviewSub}>{data.review.sub}</Text>
            <Text style={styles.reviewMeta}>{data.review.meta}</Text>
            <Pressable accessibilityRole="button" onPress={onOpenReview} style={styles.reviewBtn}>
              <Text style={styles.reviewBtnText}>Read weekly report</Text>
              <ChevronRight size={15} color="#FFF8E6" strokeWidth={2.6} style={{ marginLeft: 5 }} />
            </Pressable>
          </View>
          <Decor asset={REPORTS_DECOR.reviewLeavesRight} style={REPORTS_ANCHORS.reviewLeavesRight} />
        </View>
      </Animated.ScrollView>

      <Animated.View pointerEvents="none" style={[styles.statusBar, { height: insets.top, opacity: statusOpacity }]} />
      <BottomNav active="insights" />
    </View>
  );
}

function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const st = STAT_STYLE[stat.kind];
  // the value shares its column with the icon tile: on narrow phones it shrinks instead of being cut ("612,00…")
  const { width } = useWindowDimensions();
  const textW = (Math.min(width, 600) - 36.7 - 8.2) / 2 - 72.7;
  const valueSize = 23.2 * Math.min(1, textW / 99.85);
  const sprig = STAT_SPRIGS[index % STAT_SPRIGS.length];
  return (
    <View style={styles.statWrap}>
      <View style={[styles.stat, { paddingBottom: stat.chip ? 9.3 : 15.9 }]}>
        <View style={[styles.tile, { backgroundColor: st.tile }]}>
          <StatIcon kind={stat.kind} />
        </View>
        <Text style={[styles.statLabel, { color: st.label }]} numberOfLines={1}>{stat.label}</Text>
        <Text style={[styles.statValue, { fontSize: valueSize }]} numberOfLines={1}>{stat.value}</Text>
        {stat.chip ? (
          <View style={styles.chip}>
            <TrendUpIcon />
            <Text style={styles.chipText} numberOfLines={1}>{stat.chip}</Text>
          </View>
        ) : (
          <Text style={styles.statSub} numberOfLines={2}>{stat.sub}</Text>
        )}
      </View>
      <Decor asset={sprig.asset} style={sprig.at} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: REPORTS_PAPER },
  rowCenter: { flexDirection: 'row', alignItems: 'center' },
  statusBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: REPORTS_PAPER },

  title: {
    position: 'absolute', left: 19.5, fontFamily: 'Nunito-Black', fontSize: 35.5, lineHeight: 42, letterSpacing: -1.2,
    color: '#2A0500',
  },
  subtitle: { position: 'absolute', left: 19.5, fontFamily: 'Nunito-Regular', fontSize: 12.7, lineHeight: 16, color: '#512F1E' },

  segment: {
    flexDirection: 'row', height: 38, marginLeft: 18.3, marginRight: 18.8, borderRadius: 19, borderWidth: 1.2,
    borderColor: '#E3D9B9', backgroundColor: '#FDF4E3', padding: 1.5, boxShadow: '0 2px 5px rgba(150,120,60,0.10)',
  },
  segItem: { flex: 1, borderRadius: 16.3, alignItems: 'center', justifyContent: 'center' },
  segOn: { backgroundColor: '#465D29', borderWidth: 1.2, borderColor: '#2F4319', boxShadow: '0 2px 4px rgba(50,70,20,0.25)' },
  segText: { fontFamily: 'Nunito-ExtraBold', fontSize: 13.3, lineHeight: 17, letterSpacing: -0.2, color: '#5B3B2A' },
  segTextOn: { fontFamily: 'Nunito-ExtraBold', fontSize: 13.3, lineHeight: 17, letterSpacing: -0.2, color: '#FFF8E6' },

  range: {
    height: 57.3, marginLeft: 17.9, marginRight: 18.3, borderRadius: 10, borderWidth: 1.2, borderColor: '#D5D0B0',
    backgroundColor: '#FDF5E5', alignItems: 'center', paddingTop: 10.25, boxShadow: '0 2px 6px rgba(150,120,60,0.10)',
  },
  round: {
    position: 'absolute', top: 9.45, width: 36, height: 36, borderRadius: 18, borderWidth: 1.2, borderColor: '#AEB78E',
    backgroundColor: '#F4F0DB', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(150,120,60,0.15)',
  },
  rangeText: { fontFamily: 'Nunito-ExtraBold', fontSize: 15.3, lineHeight: 19, letterSpacing: -0.3, color: '#160200' },
  rangeSub: { marginTop: 1.5, fontFamily: 'Nunito-Regular', fontSize: 12.1, lineHeight: 15, color: '#4E3123' },

  section: {
    marginTop: 11.3, marginLeft: 18.6, fontFamily: 'Nunito-ExtraBold', fontSize: 19.1, lineHeight: 24, letterSpacing: -0.5,
    color: '#160200',
  },

  statRow: { flexDirection: 'row', gap: 8.2, marginLeft: 17.9, marginRight: 18.8 },
  statWrap: { flex: 1 },
  stat: {
    flex: 1, borderRadius: 10, borderWidth: 1.2, borderColor: '#E1DCC2', backgroundColor: '#FDF7E9',
    paddingTop: 11.2, paddingLeft: 64.3, paddingRight: 6, boxShadow: '0 2px 6px rgba(150,120,60,0.10)',
  },
  tile: {
    position: 'absolute', left: 10.2, top: 8.9, width: 44, height: 43, borderRadius: 10, alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: { fontFamily: 'Nunito-ExtraBold', fontSize: 11.2, lineHeight: 14, letterSpacing: -0.2 },
  statValue: { marginTop: 2.5, fontFamily: 'Nunito-ExtraBold', fontSize: 23.2, lineHeight: 28, letterSpacing: -1, color: '#170000' },
  statSub: { marginTop: 0.5, fontFamily: 'Nunito-Regular', fontSize: 11.8, lineHeight: 16, color: '#553326' },
  chip: {
    marginTop: 3.2, marginLeft: -55.3, height: 22.9, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center',
    paddingLeft: 10.5, paddingRight: 10, borderRadius: 11.5, backgroundColor: '#FCECC3',
  },
  chipText: { marginLeft: 7.4, fontFamily: 'Nunito-ExtraBold', fontSize: 10.75, lineHeight: 13, letterSpacing: -0.2, color: '#8A4A00' },

  pattern: {
    marginLeft: 17.9, marginRight: 18.3, borderRadius: 10, borderWidth: 1.2, borderColor: '#86C1CD', backgroundColor: '#EAF4F6',
    paddingTop: 11.05, paddingLeft: 13.9, paddingRight: 14, paddingBottom: 10.6,
  },
  patternTitle: { marginLeft: 12.4, fontFamily: 'Nunito-ExtraBold', fontSize: 12.65, lineHeight: 16, letterSpacing: -0.2, color: '#0C3F5C' },
  patternText: { marginTop: 7, marginLeft: 1.1, marginRight: 26, /* wraps before the corner flowers on narrow phones */ fontFamily: 'Nunito-Regular', fontSize: 13.1, lineHeight: 17, color: '#1A0A05' },
  patternSub: { marginTop: 1.4, marginLeft: 1.1, fontFamily: 'Nunito-Regular', fontSize: 11.8, lineHeight: 15, color: '#60493B' },

  review: {
    marginLeft: 17.9, marginRight: 18.3, borderRadius: 11, borderWidth: 1.2, borderColor: '#BDBC92', backgroundColor: '#FEF6E1',
    overflow: 'hidden', paddingTop: 14.3, paddingLeft: 15.7, paddingRight: 9.4, paddingBottom: 8.2,
  },
  reviewLabel: { marginLeft: 8, fontFamily: 'Nunito-ExtraBold', fontSize: 9.9, lineHeight: 12, letterSpacing: 0.5, color: '#2C3B0A' },
  reviewTitle: {
    marginTop: 5.3, maxWidth: 226, fontFamily: 'Nunito-ExtraBold', fontSize: 19, lineHeight: 22, letterSpacing: -0.6,
    color: '#1E0300',
  },
  reviewSub: { marginTop: 2.9, fontFamily: 'Nunito-Regular', fontSize: 11.8, lineHeight: 15.5, color: '#4E2819' },
  reviewMeta: { marginTop: 4.5, fontFamily: 'Nunito-Regular', fontSize: 10.7, lineHeight: 14, color: '#866548' },
  reviewBtn: {
    marginTop: 6.9, marginLeft: -5.5, height: 36.6, borderRadius: 18.3, borderWidth: 1.2, borderColor: '#2F4319',
    backgroundColor: '#4A6232', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 6px rgba(60,80,30,0.25)',
  },
  reviewBtnText: { fontFamily: 'Nunito-ExtraBold', fontSize: 13.1, lineHeight: 17, letterSpacing: -0.2, color: '#FFF8E6' },
});
