/**
 * "Today" dashboard (React Native 0.82, New Architecture).
 * Needs react-native-svg, react-native-safe-area-context and the Nunito font files registered under the
 * PostScript names used in F below. Data comes in through props; SAMPLE_TODAY mirrors the mockup.
 */
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav, useNavHeight } from '../components/BottomNav';
import { BellIcon, ChevronRight, ClockIcon, FlagIcon, LimitIcon, MoonIcon } from '../components/icons';
import { Decor, useArtScale } from '../decor/Decor';
import { BottomGarlands, TODAY_ANCHORS, TODAY_DECOR, TODAY_PAPER, TODAY_SPOTS, TodayHero } from '../decor/todayDecor';

const F = {
  regular: 'Nunito-Regular',
  medium: 'Nunito-Medium',
  semibold: 'Nunito-SemiBold',
  bold: 'Nunito-Bold',
  extrabold: 'Nunito-ExtraBold',
  black: 'Nunito-Black',
};

const C = {
  ink: '#33110A',
  body: '#644534',
  green: '#457805',
  greenDark: '#1C360A',
  teal: '#005C7C',
  amber: '#946000', // text: 4.8:1 on the cards (the mockup's #B87701 is 3.3:1)
  amberIcon: '#B57A00',
  red: '#7E1A00',
  barGreen: '#67962B',
  barBlue: '#71D0EE',
  barAmber: '#F8BC3E',
  track: '#F3E7D6',
};

export type Goal = {
  title: string;
  /** "days" goals count up (clock icon, green); "limit" goals must stay under a ceiling (amber). */
  kind: 'days' | 'limit';
  value: number;
  target: number;
  /** Text on the right, e.g. "3/5 days". */
  label: string;
};

export type TodayData = {
  dateLabel: string;
  streak: number;
  reminder?: { title: string; tag?: string; detail: string };
  energy: { inKcal: number; burnedKcal: number; budgetKcal: number };
  money: { spentToday: number; earnedToday: number; weekSpent: number; weekEarned: number };
  /** The card shows the first three goals; the pill counts all of them. */
  goalsSummary: { met: number; total: number };
  goals: Goal[];
  entries: { id: string; kind: 'sleep'; title: string }[];
};

export const SAMPLE_TODAY: TodayData = {
  dateLabel: 'SAT, OCT 24',
  streak: 31,
  reminder: { title: "Grandpa's memorial", tag: 'LUNAR', detail: '17/9 ÂL → Mon, Oct 26 · in 2 days' },
  energy: { inKcal: 1650, burnedKcal: 380, budgetKcal: 2650 },
  money: { spentToday: 115000, earnedToday: 500000, weekSpent: 115000, weekEarned: 500000 },
  goalsSummary: { met: 2, total: 4 },
  goals: [
    { title: 'In bed before 11 PM, 5+ days', kind: 'days', value: 3, target: 5, label: '3/5 days' },
    { title: 'Spend no more than 700,000₫', kind: 'limit', value: 500000, target: 700000, label: '500,000đ/700,000đ' },
    { title: 'Max 1,800 kcal a day', kind: 'limit', value: 805, target: 1800, label: '805/1,800 kcal' },
  ],
  entries: [{ id: 'sleep-1', kind: 'sleep', title: 'Night sleep 7h20' }],
};

const n = (v: number) => v.toLocaleString('en-US');
const vnd = (v: number) => `${n(v)}đ`;
const MINUS = '−';

export default function TodayScreen({ data = SAMPLE_TODAY }: { data?: TodayData }) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();
  const s = useArtScale();
  const artH = TODAY_DECOR.hero.height * s;
  const artW = 390 * s;
  // The reminder card covers the art's cut edge, so it follows the art; it never rides up into the title.
  const cardTop = Math.max(TODAY_SPOTS.cardTop * artH, insets.top + 89.6);
  // The date sits under the hanging leaves: follow the art, but never slide under the status bar.
  const headerTop = Math.max(TODAY_SPOTS.headerTop * artH, insets.top + 29.8);
  const { energy, money } = data;
  const inPct = Math.min(1, energy.inKcal / energy.budgetKcal);
  const burnPct = Math.min(1 - inPct, energy.burnedKcal / energy.budgetKcal);
  const net = energy.inKcal - energy.burnedKcal;

  return (
    <View style={styles.root}>
      {/* garlands rest on the tab bar, stay put while the list scrolls and sit BEHIND it, so they never cover content */}
      <BottomGarlands barHeight={navH} />
      <ScrollView contentContainerStyle={{ paddingBottom: navH + 20 }}>
        {/* 1. art under the status bar + header; the badge sits on the window sill, so it follows the art */}
        <View style={{ height: cardTop }}>
          <TodayHero>
            <View
              accessible
              accessibilityLabel={`${data.streak} day streak`}
              style={[styles.badge, { top: TODAY_SPOTS.badgeTop * artH, right: TODAY_SPOTS.badgeRight * artW }]}
            >
              <View style={styles.badgeDot} />
              <Text style={styles.badgeText}>{data.streak}</Text>
            </View>
          </TodayHero>
          <View style={[styles.header, { top: headerTop }]}>
            <Text style={styles.date}>{data.dateLabel}</Text>
            <Text style={[styles.title, { fontSize: 28.6 * Math.min(1, s) }]} accessibilityRole="header">Today</Text>
          </View>
        </View>

        {/* 2. reminder */}
        {data.reminder ? (
          <Pressable accessibilityRole="button" style={[styles.card, styles.reminder]}>
            <BellIcon size={20.5} color={C.amberIcon} style={{ marginLeft: -0.5 }} />
            <View style={styles.reminderText}>
              <View style={styles.row}>
                <Text style={styles.reminderTitle} numberOfLines={1}>{data.reminder.title}</Text>
                {data.reminder.tag ? (
                  <View style={styles.tag}><Text style={styles.tagText}>{data.reminder.tag}</Text></View>
                ) : null}
              </View>
              <Text style={styles.reminderDetail} numberOfLines={1}>{data.reminder.detail}</Text>
            </View>
            <ChevronRight size={15.5} color={C.amberIcon} strokeWidth={2.6} />
          </Pressable>
        ) : null}

        {/* 3. energy; its two sprigs paint over the card, so they come after it */}
        <View style={{ marginTop: 10 }}>
          <View style={[styles.card, styles.cardPad, { paddingTop: 12.7, paddingBottom: 15.4 }]}>
            <Text style={[styles.label, { color: C.green, fontSize: 11.3, letterSpacing: -0.1, marginTop: 1.5 }]}>ENERGY</Text>
            <View style={[styles.row, { marginTop: 7.4, alignItems: 'stretch' }]}>
              <Stat value={n(energy.inKcal)} label="kcal in" color={C.greenDark} flex={103.3} />
              <View style={styles.divider} />
              <Stat value={n(energy.burnedKcal)} label="burned" color={C.teal} flex={94.4} pad={16} />
              <View style={styles.divider} />
              <Stat value={`${net >= 0 ? '+' : MINUS}${n(Math.abs(net))}`} label="net" color={C.ink} flex={98.7} pad={13.2} />
            </View>
            <View style={styles.bar} accessibilityLabel={`${Math.round(inPct * 100)} percent of budget used`}>
              <View style={{ width: `${inPct * 100}%`, backgroundColor: C.barGreen }} />
              <View style={{ width: `${burnPct * 100}%`, backgroundColor: C.barBlue }} />
            </View>
            <Text style={styles.caption}>{`${Math.round(inPct * 100)}% of ${n(energy.budgetKcal)} kcal budget used`}</Text>
          </View>
          <Decor asset={TODAY_DECOR.leafEnergyLeft} style={TODAY_ANCHORS.energy.leafEnergyLeft} />
          <Decor asset={TODAY_DECOR.leafEnergyRight} style={TODAY_ANCHORS.energy.leafEnergyRight} />
        </View>

        {/* 4. money */}
        <View style={{ marginTop: 8.7 }}>
          <View style={[styles.card, styles.cardPad, { paddingTop: 12.8, paddingBottom: 12.3 }]}>
            <View style={[styles.row, { justifyContent: 'space-between' }]}>
              <Text style={[styles.label, { color: C.amber, fontSize: 11.6, letterSpacing: -0.3 }]}>MONEY</Text>
              <Text style={styles.week} numberOfLines={1}>
                {`This week: ${MINUS}${vnd(money.weekSpent)} · +${vnd(money.weekEarned)}`}
              </Text>
            </View>
            <View style={[styles.row, { marginTop: 9.1, alignItems: 'stretch' }]}>
              <Stat value={`${MINUS}${vnd(money.spentToday)}`} label="spent today" color={C.red} flex={157.4} big={20.4} gap={2.5} />
              <View style={styles.divider} />
              <Stat value={`+${vnd(money.earnedToday)}`} label="earned today" color="#447209" flex={153.3} pad={15.9} big={20.4} gap={2.5} />
            </View>
          </View>
        </View>

        {/* 5. weekly goals; the decorations around it paint over both cards, so they come after this card */}
        <View style={{ marginTop: 8.7 }}>
          <View style={[styles.card, styles.cardPad, { paddingTop: 12.1, paddingBottom: 14.6 }]}>
            <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
              <View style={[styles.row, { alignItems: 'center' }]}>
                <View style={styles.flagTile}><FlagIcon size={17} /></View>
                <Text style={[styles.label, { color: '#437408', fontSize: 11.2, marginLeft: 7.5 }]}>WEEKLY GOALS</Text>
              </View>
              <Pressable accessibilityRole="button" style={styles.metPill}>
                <Text style={styles.metText}>{`${data.goalsSummary.met}/${data.goalsSummary.total} met`}</Text>
                <ChevronRight size={14} color="#2A5401" strokeWidth={2.8} style={{ marginLeft: 3.5 }} />
              </Pressable>
            </View>
            {data.goals.slice(0, 3).map((g, i) => (
              <GoalRow key={g.title} goal={g} first={i === 0} />
            ))}
          </View>
          <Decor asset={TODAY_DECOR.flowerMoneyRight} style={TODAY_ANCHORS.goals.flowerMoneyRight} />
          <Decor asset={TODAY_DECOR.leafMoneyLeft} style={TODAY_ANCHORS.goals.leafMoneyLeft} />
          <Decor asset={TODAY_DECOR.leafGoalsRight} style={TODAY_ANCHORS.goals.leafGoalsRight} />
        </View>

        {/* 6. today's entries (the "See all" button sits over the goals sprig, so it comes after it) */}
        <View style={[styles.row, styles.entriesHead]}>
          <Text style={styles.entriesTitle} accessibilityRole="header">Today’s entries</Text>
          <Pressable accessibilityRole="button" style={styles.seeAll}>
            <Text style={styles.seeAllText}>See all</Text>
            <ChevronRight size={14} color="#173202" strokeWidth={2.8} style={{ marginLeft: 3 }} />
          </Pressable>
        </View>
        {data.entries.map((e, i) => (
          <Pressable key={e.id} accessibilityRole="button" style={[styles.card, styles.entry, { marginTop: i === 0 ? 6 : 8 }]}>
            <View style={styles.entryIcon}><MoonIcon size={18.5} /></View>
            <Text style={styles.entryText} numberOfLines={1}>{e.title}</Text>
            <ChevronRight size={15} color={C.amberIcon} strokeWidth={2.6} />
          </Pressable>
        ))}
      </ScrollView>

      <BottomNav tabs={['today', 'garden', 'insights', 'menu']} active="today" />
    </View>
  );
}

function Stat({ value, label, color, flex, pad = 0, big = 20.5, gap = 3.45 }: {
  value: string; label: string; color: string; flex: number; pad?: number; big?: number; gap?: number;
}) {
  return (
    <View style={{ flexGrow: flex, flexBasis: 0, paddingLeft: pad }}>
      <Text style={[styles.big, { color, fontSize: big, letterSpacing: big > 20.6 ? -1.2 : -0.8 }]} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75}>{value}</Text>
      <Text style={[styles.sub, { marginTop: gap }]}>{label}</Text>
    </View>
  );
}

function GoalRow({ goal, first }: { goal: Goal; first: boolean }) {
  const days = goal.kind === 'days';
  const pct = Math.max(0, Math.min(1, goal.value / goal.target));
  const tone = days ? C.green : C.amber;
  return (
    <View style={{ marginTop: first ? 14.2 : 12.5 }}>
      <View style={[styles.row, { justifyContent: 'space-between', alignItems: 'center' }]}>
        <Text style={styles.goalTitle} numberOfLines={2}>{goal.title}</Text>
        <View style={[styles.row, { alignItems: 'center', flexShrink: 0, marginLeft: 8 }]}>
          {days ? <ClockIcon size={13.5} color="#3F7502" /> : <LimitIcon size={13.5} color={C.amberIcon} />}
          <Text style={[styles.goalStatus, { color: days ? '#3F7502' : tone }]}>{goal.label}</Text>
        </View>
      </View>
      <View style={[styles.bar, { marginTop: 7.2, height: 7.5 }]}>
        <View style={{ width: `${pct * 100}%`, backgroundColor: days ? C.barGreen : C.barAmber, borderRadius: 4 }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: TODAY_PAPER },
  row: { flexDirection: 'row' },
  header: { position: 'absolute', left: 18.3 },
  date: { fontFamily: F.bold, fontSize: 11.6, lineHeight: 14, color: '#6A4636' },
  title: { marginTop: 1.6, fontFamily: F.black, lineHeight: 32, letterSpacing: -1.2, color: C.ink },
  badge: {
    position: 'absolute', width: 42.4, height: 40.6, borderRadius: 11, backgroundColor: '#FEF5D4',
    borderWidth: 1, borderColor: '#F3E3BB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 8px rgba(120,80,30,0.20)',
  },
  badgeDot: { width: 6.8, height: 6.8, borderRadius: 3.4, backgroundColor: '#FDBD34', marginRight: 5 },
  badgeText: { fontFamily: F.extrabold, fontSize: 11.5, lineHeight: 14, letterSpacing: -0.4, color: '#3E1200' },
  card: {
    marginLeft: 17.2, marginRight: 16.3, borderRadius: 9, borderWidth: 1.2, borderColor: '#BDC09D',
    backgroundColor: '#FEF7EA', boxShadow: '0 2px 6px rgba(150,120,70,0.14)',
  },
  cardPad: { paddingLeft: 13.5, paddingRight: 13 },
  reminder: {
    height: 55, borderRadius: 11, borderWidth: 1.4, borderColor: '#FDBF25', backgroundColor: '#FEF3D2',
    flexDirection: 'row', alignItems: 'center', paddingLeft: 10, paddingRight: 11,
    boxShadow: '0 2px 6px rgba(190,140,40,0.16)',
  },
  reminderText: { flex: 1, marginLeft: 12.1, marginTop: 3 },
  reminderTitle: { flexShrink: 1, fontFamily: F.bold, fontSize: 12.3, lineHeight: 16, letterSpacing: -0.2, color: '#3A1408' },
  tag: {
    marginLeft: 6.4, height: 15.5, paddingHorizontal: 6, borderRadius: 4.5, borderWidth: 1, borderColor: '#F2D58A',
    backgroundColor: '#FFFDF7', justifyContent: 'center',
  },
  tagText: { fontFamily: F.extrabold, fontSize: 8.6, lineHeight: 11, letterSpacing: 0.2, color: C.amber },
  reminderDetail: { marginTop: 3.5, fontFamily: F.semibold, fontSize: 10.4, lineHeight: 14, color: C.amber },
  label: { fontFamily: F.extrabold, lineHeight: 14 },
  divider: { width: 1, backgroundColor: '#EBDAC1' },
  big: { fontFamily: F.extrabold, lineHeight: 24, letterSpacing: -0.9 },
  sub: { fontFamily: F.regular, fontSize: 12, lineHeight: 15, color: C.body },
  bar: { marginTop: 9.45, height: 8.7, borderRadius: 4.35, overflow: 'hidden', flexDirection: 'row', backgroundColor: C.track },
  caption: { marginTop: 8.7, fontFamily: F.medium, fontSize: 11.3, lineHeight: 14, color: C.body },
  week: { flexShrink: 1, marginLeft: 8, fontFamily: F.medium, fontSize: 10.2, lineHeight: 14, letterSpacing: -0.2, color: C.body },
  flagTile: { width: 28, height: 28, borderRadius: 7, backgroundColor: '#E4EFC3', alignItems: 'center', justifyContent: 'center' },
  metPill: {
    height: 29.1, marginRight: -3.5, paddingLeft: 17, paddingRight: 6.5, borderRadius: 14.6, borderWidth: 1,
    borderColor: '#BEC19B', backgroundColor: '#F8F4E0', flexDirection: 'row', alignItems: 'center',
  },
  metText: { fontFamily: F.extrabold, fontSize: 11.8, lineHeight: 14, color: '#2A5401' },
  goalTitle: { flexShrink: 1, fontFamily: F.bold, fontSize: 12.3, lineHeight: 16, color: '#2F0500' },
  goalStatus: { marginLeft: 3.5, fontFamily: F.extrabold, fontSize: 10.9, lineHeight: 15 },
  entriesHead: { marginTop: 10.8, marginLeft: 18.3, marginRight: 16.3, height: 30.4, alignItems: 'center', justifyContent: 'space-between' },
  entriesTitle: { fontFamily: F.black, fontSize: 20, lineHeight: 24, letterSpacing: -0.8, color: '#2F0800' },
  seeAll: {
    height: 30.4, paddingLeft: 19, paddingRight: 7, borderRadius: 15.2, borderWidth: 1.5, borderColor: '#A3A981',
    backgroundColor: '#F6F2DD', flexDirection: 'row', alignItems: 'center', boxShadow: '0 1px 3px rgba(120,120,80,0.15)',
  },
  seeAllText: { fontFamily: F.extrabold, fontSize: 10.6, lineHeight: 14, color: '#173202' },
  entry: {
    height: 60.9, borderRadius: 12, borderWidth: 1, borderColor: '#F1DABA', flexDirection: 'row', alignItems: 'center',
    paddingLeft: 12.7, paddingRight: 11,
  },
  entryIcon: { width: 37.6, height: 37.1, borderRadius: 8, backgroundColor: '#C4EEF8', alignItems: 'center', justifyContent: 'center' },
  entryText: { flex: 1, marginLeft: 12.6, fontFamily: F.bold, fontSize: 13.3, lineHeight: 17, color: '#2D0400' },
});
