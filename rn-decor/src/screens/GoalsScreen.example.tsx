/**
 * "Weekly goals" screen (React Native 0.82). Layout numbers are pt measured on the 390pt-wide mockup.
 * Needs: react-native-svg, react-native-safe-area-context, Nunito fonts registered under their PostScript names.
 */
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight, ClockIcon, GoalCapIcon, PlusIcon } from '../components/icons';
import { Decor } from '../decor/Decor';
import {
  GOAL_SPRIGS,
  GOALS_ANCHORS,
  GOALS_DECOR,
  GOALS_PAPER,
  GoalsBottomDecor,
  GoalsHeaderDecor,
} from '../decor/goalsDecor';

export type WeeklyGoal = {
  id: string;
  title: string;
  /** e.g. "Early to bed" */
  category: string;
  /** Who set the goal: shown after the category. */
  source: 'AI' | 'Yours';
  /** "days": reach N days (green, clock). "cap": stay under a limit (amber, arrow to a bar). */
  kind: 'days' | 'cap';
  value: number;
  target: number;
  /** Text right of the bar, e.g. "3/5 days" or "500,000₫/700,000₫". */
  label: string;
};

export type GoalsWeek = {
  title: string; // "This week"
  range: string; // "19/10 – 25/10"
  goals: WeeklyGoal[];
  met: number;
};

export const SAMPLE_GOALS: GoalsWeek = {
  title: 'This week',
  range: '19/10 – 25/10',
  met: 2,
  goals: [
    { id: 'bed', title: 'In bed before 11 PM, 5+ days', category: 'Early to bed', source: 'AI', kind: 'days', value: 3, target: 5, label: '3/5 days' },
    { id: 'spend', title: 'Spend no more than 700,000₫', category: 'Spending cap', source: 'AI', kind: 'cap', value: 500000, target: 700000, label: '500,000₫/700,000₫' },
    { id: 'kcal', title: 'Max 1,800 kcal a day', category: 'Daily calorie cap', source: 'Yours', kind: 'cap', value: 805, target: 1800, label: '805/1,800 kcal' },
    { id: 'move', title: 'Move ≥ 30 min on 3 days', category: 'Active days', source: 'AI', kind: 'days', value: 2, target: 3, label: '2/3 days' },
  ],
};

const C = {
  ink: '#270100',
  sub: '#6C3B22',
  count: '#794A26',
  green: '#3E6A06',
  /** Mockup amber text is #A26701; darkened to reach 4.5:1 on the card. The bar and icon keep the bright tone. */
  amber: '#946000',
  barGreen: '#6A952F',
  barAmber: '#FDBC38',
  track: '#EBDEC6',
  leaf: '#253709',
};

type Props = {
  data?: GoalsWeek;
  onBack?: () => void;
  onPrevWeek?: () => void;
  onNextWeek?: () => void;
  onGoalMenu?: (id: string) => void;
  onAddGoal?: () => void;
};

export default function GoalsScreen({ data = SAMPLE_GOALS, onBack, onPrevWeek, onNextWeek, onGoalMenu, onAddGoal }: Props) {
  const insets = useSafeAreaInsets();
  const headerH = insets.top + 76.3; // title block, down to the week card
  const scrollY = useRef(new Animated.Value(0)).current;
  // once the page scrolls, paper fades in behind the status bar so text never runs under the clock
  const statusOpacity = scrollY.interpolate({ inputRange: [0, 24], outputRange: [0, 1], extrapolate: 'clamp' });

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: Math.max(73.4, insets.bottom + 20) }}
      >
        {/* bottom corners belong to the end of the page (no tab bar here): behind everything, at least screen-high */}
        <GoalsBottomDecor />
        {/* title block: art first, the week card below hides the cat's shadow line */}
        <View style={{ height: headerH }}>
          <GoalsHeaderDecor headerHeight={headerH} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={8}
            style={[styles.back, { top: insets.top + 22.9 }]}
          >
            <ChevronLeft size={17} />
          </Pressable>
          <Text accessibilityRole="header" style={[styles.title, { top: insets.top + 24.6 }]}>Weekly goals</Text>
        </View>

        {/* week switcher */}
        <View style={styles.week}>
          <Decor asset={GOALS_DECOR.sprigWeekLeft} style={GOALS_ANCHORS.sprigWeekLeft} />
          <Decor asset={GOALS_DECOR.sprigWeekRight} style={GOALS_ANCHORS.sprigWeekRight} />
          <Pressable accessibilityRole="button" accessibilityLabel="Previous week" onPress={onPrevWeek} style={[styles.weekBtn, { left: 11.9 }]}>
            <ChevronLeft size={17} color={C.leaf} />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Next week" onPress={onNextWeek} style={[styles.weekBtn, { right: 11.9 }]}>
            <ChevronRight size={17} color={C.leaf} strokeWidth={2.6} />
          </Pressable>
          <Text style={styles.weekTitle}>{data.title}</Text>
          <Text style={styles.weekRange}>{data.range}</Text>
        </View>

        <Text style={styles.count}>{`${data.goals.length} GOALS · ${data.met} MET`}</Text>

        {data.goals.map((g, i) => {
          const sprigs = GOAL_SPRIGS[i % GOAL_SPRIGS.length];
          return (
            <View key={g.id} style={{ marginTop: i === 0 ? 10.1 : 11 }}>
              <GoalCard goal={g} onMenu={() => onGoalMenu?.(g.id)} />
              <Decor asset={sprigs.left} style={sprigs.leftAt} />
              <Decor asset={sprigs.right} style={sprigs.rightAt} />
            </View>
          );
        })}

        <Text style={styles.footnote}>Progress comes from what you log — there's no "mark done" button.</Text>

        <Pressable accessibilityRole="button" onPress={onAddGoal} style={styles.add}>
          <Decor asset={GOALS_DECOR.btnLeavesLeft} style={GOALS_ANCHORS.btnLeavesLeft} />
          <Decor asset={GOALS_DECOR.btnLeavesRight} style={GOALS_ANCHORS.btnLeavesRight} />
          <PlusIcon size={20.5} color="#FEFEE7" />
          <Text style={styles.addText}>Add a goal</Text>
        </Pressable>
      </Animated.ScrollView>

      <Animated.View pointerEvents="none" style={[styles.statusBar, { height: insets.top, opacity: statusOpacity }]} />
    </View>
  );
}

function GoalCard({ goal, onMenu }: { goal: WeeklyGoal; onMenu: () => void }) {
  const days = goal.kind === 'days';
  const pct = Math.max(0, Math.min(1, goal.target > 0 ? goal.value / goal.target : 0));
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <View style={styles.icon}>
          {days ? <ClockIcon size={28} color="#4E7F1E" /> : <GoalCapIcon />}
        </View>
        <View style={styles.texts}>
          <Text style={styles.goalTitle}>{goal.title}</Text>
          <View style={[styles.row, { marginTop: 2.6 }]}>
            <Text style={styles.goalSub} numberOfLines={1}>{goal.category}</Text>
            <Text style={[styles.goalSub, { marginHorizontal: 4.5 }]}>·</Text>
            <Text style={styles.goalSub}>{goal.source}</Text>
          </View>
        </View>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`More options for ${goal.title}`} onPress={onMenu} style={styles.dots}>
        <View style={styles.dot} />
        <View style={[styles.dot, { marginLeft: 2.6 }]} />
        <View style={[styles.dot, { marginLeft: 2.6 }]} />
      </Pressable>
      <View style={[styles.row, { marginTop: 12.4, alignItems: 'center' }]}>
        <View
          style={styles.track}
          accessibilityRole="progressbar"
          accessibilityValue={{ min: 0, max: goal.target, now: goal.value }}
        >
          <View style={{ width: `${pct * 100}%`, height: '100%', borderRadius: 4.35, backgroundColor: days ? C.barGreen : C.barAmber }} />
        </View>
        <Text style={[styles.status, { color: days ? C.green : C.amber }]} numberOfLines={1}>{goal.label}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: GOALS_PAPER },
  row: { flexDirection: 'row', alignItems: 'flex-start' },
  statusBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: GOALS_PAPER },

  back: {
    position: 'absolute', left: 17.6, width: 34, height: 35, borderRadius: 10, backgroundColor: '#6B7836',
    borderWidth: 1, borderColor: '#859352', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 6px rgba(110,80,30,0.22)',
  },
  title: {
    position: 'absolute', left: 63.6, fontFamily: 'Nunito-Black', fontSize: 24.1, lineHeight: 30, letterSpacing: -1,
    color: C.ink,
  },

  week: {
    height: 58.6, marginLeft: 17.9, marginRight: 17.4, borderRadius: 10, borderWidth: 1.2, borderColor: '#D9D4AE',
    backgroundColor: '#FEF6E4', alignItems: 'center', paddingTop: 11, boxShadow: '0 2px 6px rgba(150,120,60,0.10)',
  },
  weekBtn: {
    position: 'absolute', top: 9.1, width: 38, height: 38, borderRadius: 10, borderWidth: 1.2, borderColor: '#C7C29A',
    backgroundColor: '#FEF8EA', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 4px rgba(150,120,60,0.15)',
  },
  weekTitle: { fontFamily: 'Nunito-ExtraBold', fontSize: 12.3, lineHeight: 16, color: C.ink },
  weekRange: { marginTop: 4.2, fontFamily: 'Nunito-Regular', fontSize: 11, lineHeight: 14, color: '#6A3C26' },

  count: {
    marginTop: 18.2, marginLeft: 18.6, fontFamily: 'Nunito-ExtraBold', fontSize: 10.7, lineHeight: 13, letterSpacing: 1,
    color: C.count,
  },

  card: {
    marginLeft: 17.9, marginRight: 17.4, borderRadius: 10, borderWidth: 1.2, borderColor: '#F6DCA8', backgroundColor: '#FEF6E2',
    paddingTop: 16.2, paddingBottom: 17.8, paddingLeft: 18, paddingRight: 12.4, boxShadow: '0 2px 6px rgba(150,120,60,0.10)',
  },
  /** 22pt slot in the layout; the glyph box is bigger so the clock ring is not clipped */
  icon: { width: 26, height: 26, margin: -2, alignItems: 'center', justifyContent: 'center' },
  texts: { flex: 1, marginLeft: 13.3, marginTop: 0.3, marginRight: 46 },
  goalTitle: { fontFamily: 'Nunito-ExtraBold', fontSize: 14.5, lineHeight: 18.5, letterSpacing: -0.4, color: C.ink },
  goalSub: { flexShrink: 1, fontFamily: 'Nunito-Regular', fontSize: 12.6, lineHeight: 16, color: C.sub },
  dots: {
    position: 'absolute', top: 11.2, right: 13.5, width: 36, height: 35, borderRadius: 10, borderWidth: 1.2,
    borderColor: '#B4B68A', backgroundColor: '#FEF7E7', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(150,120,60,0.15)',
  },
  dot: { width: 3.6, height: 3.6, borderRadius: 1.8, backgroundColor: C.leaf },
  track: { flex: 1, height: 8.7, borderRadius: 4.35, backgroundColor: C.track, overflow: 'hidden' },
  status: {
    minWidth: 58.5, marginLeft: 12.5, textAlign: 'right', fontFamily: 'Nunito-ExtraBold', fontSize: 12.2, lineHeight: 15,
    letterSpacing: -0.2,
  },

  footnote: {
    marginTop: 15.9, marginLeft: 23, marginRight: 23, fontFamily: 'Nunito-Regular', fontSize: 11.8, lineHeight: 16.5,
    color: '#673B24',
  },

  add: {
    height: 51.8, marginTop: 14.2, marginLeft: 17.9, marginRight: 17.4, borderRadius: 12, borderWidth: 1.2,
    borderColor: '#86944D', borderBottomWidth: 6.8, borderBottomColor: '#304827', backgroundColor: '#59743A',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(70,80,30,0.25)',
  },
  addText: { marginLeft: 8.75, fontFamily: 'Nunito-ExtraBold', fontSize: 16.6, lineHeight: 21, letterSpacing: -0.4, color: '#FEFEE7' },
});
