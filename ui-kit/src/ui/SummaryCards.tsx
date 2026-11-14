/** Summary cards: energy, money, goals overview, calendar, report. */
import { Icon } from '../icons/Icon';
import { Circle, G, Pressable, StyleSheet, Svg, Text, View } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, font, kinds, radii, ui } from '../theme/tokens';
import { TODAY, addDays, dateLabel, money, monthLong, sameDay, weekday } from '../data/format';
import type { YMD } from '../data/format';
import { canChi, solarToLunar } from '../data/lunar';
import { GOAL_TYPES, goalStatus } from '../data/models';
import type { Goal, GoalStatus } from '../data/models';
import { Button } from './Button';
import { CardHeader, CardShell, DataState, EstimateTag, TILE, cardText } from './CardShell';
import type { LoadStatus } from './CardShell';
import { StatusPill } from './Cards';
import { Decor } from './Decor';
import { EVENTS_ANCHORS, EVENTS_DECOR } from '../../reference/src/decor/eventsDecor';
import { REPORTS_ANCHORS, REPORTS_DECOR } from '../../reference/src/decor/reportsDecor';

const kcal = (n: number) => n.toLocaleString('en-US');

/* =====================  Energy summary  ===================== */

type EnergyProps = { intake: number; burned: number; budget: number; status?: LoadStatus; onPress?: () => void; pressedPreview?: boolean };

export function EnergySummaryCard({ intake, burned, budget, status = 'ready', onPress, pressedPreview }: EnergyProps) {
  const accent = useAccent();
  const net = intake - burned;
  const over = intake > budget;
  const pct = Math.min(1, intake / budget);
  return (
    <CardShell onPress={status === 'ready' ? onPress : undefined} pressedPreview={pressedPreview} accessibilityLabel={`Energy today: ${intake} kcal in, ${burned} burned`} tone={over && status === 'ready' ? 'warn' : 'default'}>
      <CardHeader icon="flame" tone={TILE.warn} title="Energy today" subtitle="Calories in and out" right={status === 'ready' ? <EstimateTag /> : undefined} />
      {status !== 'ready' ? (
        <DataState
          status={status}
          skeleton="columns"
          loadingLabel="Loading energy"
          emptyIcon="meal"
          emptyTitle="No meals or activity yet"
          emptyText="Log a meal or a workout and we’ll estimate your calories."
          emptyAction={{ label: 'Log a meal' }}
        />
      ) : (
        <>
          <View style={styles.cols}>
            <Col label="In" icon="meal" value={kcal(intake)} unit="kcal" color={kinds.meal.fg} />
            <View style={styles.vline} />
            <Col label="Out" icon="activity" value={kcal(burned)} unit="kcal" color={kinds.activity.fg} />
            <View style={styles.vline} />
            <Col label={net <= 0 ? 'Deficit' : 'Surplus'} icon="scale" value={`${net > 0 ? '+' : '−'}${kcal(Math.abs(net))}`} unit="kcal" color={net <= 0 ? '#355F25' : ui.warn} />
          </View>
          <View style={{ gap: 7 }}>
            <View style={styles.budgetTrack} accessibilityRole="progressbar" accessibilityLabel="Calorie budget" accessibilityValue={{ min: 0, max: budget, now: Math.min(intake, budget) }}>
              <View style={[styles.budgetFill, { width: `${pct * 100}%`, backgroundColor: over ? ui.danger : accent }]} />
            </View>
            <View style={styles.between}>
              <Text style={cardText.meta}>
                {kcal(intake)} of {kcal(budget)} kcal budget
              </Text>
              <Text style={[styles.budgetLeft, over && { color: ui.dangerInk }]}>{over ? `Over by ${kcal(intake - budget)}` : `${kcal(budget - intake)} left`}</Text>
            </View>
          </View>
        </>
      )}
    </CardShell>
  );
}

function Col({ label, icon, value, unit, color }: { label: string; icon: 'meal' | 'activity' | 'scale' | 'income' | 'expense'; value: string; unit: string; color: string }) {
  return (
    <View style={styles.col}>
      <View style={styles.colHead}>
        <Icon name={icon} size={14} color={color} />
        <Text style={cardText.label}>{label}</Text>
      </View>
      <Text numberOfLines={1} style={[styles.colValue, { color }]}>
        {value}
      </Text>
      <Text style={cardText.meta}>{unit}</Text>
    </View>
  );
}

/* =====================  Money summary  ===================== */

type MoneyProps = {
  period: 'day' | 'week';
  income: number;
  expense: number;
  status?: LoadStatus;
  onPeriodChange?: (p: 'day' | 'week') => void;
  onPress?: () => void;
  pressedPreview?: boolean;
};

export function MoneySummaryCard({ period, income, expense, status = 'ready', onPeriodChange, onPress, pressedPreview }: MoneyProps) {
  const net = income - expense;
  const total = income + expense || 1;
  return (
    <CardShell onPress={status === 'ready' && !onPeriodChange ? onPress : undefined} pressedPreview={pressedPreview} accessibilityLabel={`Money ${period === 'day' ? 'today' : 'this week'}`}>
      <CardHeader
        icon="expense"
        tone={TILE.accent}
        title={period === 'day' ? 'Money today' : 'Money this week'}
        subtitle={period === 'day' ? dateLabel(TODAY) : 'Nov 9 – 15'}
        right={
          <View style={styles.periodSwitch} accessibilityRole="radiogroup" accessibilityLabel="Period">
            {(['day', 'week'] as const).map((p) => (
              <Pressable key={p} accessibilityRole="radio" accessibilityState={{ checked: p === period }} onPress={() => onPeriodChange?.(p)} style={[styles.periodItem, p === period && styles.periodOn]}>
                <Text style={[styles.periodLabel, p === period && { color: colors.text, fontWeight: '800' }]}>{p === 'day' ? 'Day' : 'Week'}</Text>
              </Pressable>
            ))}
          </View>
        }
      />
      {status !== 'ready' ? (
        <DataState
          status={status}
          skeleton="columns"
          loadingLabel="Loading money"
          emptyIcon="expense"
          emptyTitle="No money logged yet"
          emptyText="Try “grab 38k” or “got paid 3.5M”."
          emptyAction={{ label: 'Add expense' }}
        />
      ) : (
        <>
          <View style={styles.cols}>
            <View style={styles.col}>
              <View style={styles.colHead}>
                <Icon name="income" size={14} color={kinds.income.fg} />
                <Text style={cardText.label}>Income</Text>
              </View>
              <Text numberOfLines={1} style={[styles.moneyValue, { color: kinds.income.fg }]}>
                {income > 0 ? '+' : ''}
                {money(income)}
              </Text>
            </View>
            <View style={styles.vline} />
            <View style={styles.col}>
              <View style={styles.colHead}>
                <Icon name="expense" size={14} color={kinds.expense.fg} />
                <Text style={cardText.label}>Spent</Text>
              </View>
              <Text numberOfLines={1} style={[styles.moneyValue, { color: kinds.expense.fg }]}>
                −{money(expense)}
              </Text>
            </View>
          </View>
          <View style={styles.split} accessibilityElementsHidden>
            <View style={{ flex: income / total, backgroundColor: '#7FA05F' }} />
            <View style={{ width: 3 }} />
            <View style={{ flex: expense / total, backgroundColor: '#C2735E' }} />
          </View>
          <View style={[styles.netRow, net < 0 && { backgroundColor: ui.dangerSoft, borderColor: ui.dangerBorder }]}>
            <Text style={cardText.label}>Net</Text>
            <Text style={[styles.netValue, { color: net < 0 ? ui.dangerInk : '#355F25' }]}>
              {net < 0 ? '−' : '+'}
              {money(Math.abs(net))}
            </Text>
          </View>
        </>
      )}
    </CardShell>
  );
}

/* =====================  Goals summary  ===================== */

const DOT: Record<GoalStatus, string> = { notStarted: '#C4B5A3', progress: '#8EA16B', achieved: '#4E6B34', over: ui.danger };
const DOT_LABEL: Record<GoalStatus, string> = { notStarted: 'Not started', progress: 'In progress', achieved: 'Reached', over: 'Over limit' };

function Ring({ value, max, size = 76 }: { value: number; max: number; size?: number }) {
  const accent = useAccent();
  const r = (size - 10) / 2;
  const c = 2 * Math.PI * r;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ position: 'absolute', left: 0, top: 0 }} aria-hidden="true">
        <G transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={ui.track} strokeWidth={8} />
          {value > 0 && <Circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={accent} strokeWidth={8} strokeLinecap="round" strokeDasharray={`${(value / max) * c} ${c}`} />}
        </G>
      </Svg>
      <Text style={styles.ringNum}>
        {value}
        <Text style={styles.ringOf}>/{max}</Text>
      </Text>
    </View>
  );
}

export function GoalsSummaryCard({ goals, status = 'ready', onPress, pressedPreview }: { goals: Goal[]; status?: LoadStatus; onPress?: () => void; pressedPreview?: boolean }) {
  const reached = goals.filter((g) => goalStatus(g) === 'achieved').length;
  const all = reached === goals.length && goals.length > 0;
  return (
    <CardShell onPress={status === 'ready' ? onPress : undefined} pressedPreview={pressedPreview} accessibilityLabel={`${reached} of ${goals.length} goals reached`} tone={all && status === 'ready' ? 'accent' : 'default'}>
      {status !== 'ready' ? (
        <>
          <CardHeader icon="target" tone={TILE.accent} title="Goals this week" />
          <DataState status={status} skeleton="list" loadingLabel="Loading goals" emptyIcon="target" emptyTitle="No goals yet" emptyText="One small goal is a good start." emptyAction={{ label: 'Set a goal' }} />
        </>
      ) : (
        <>
          <View style={styles.goalsTop}>
            <Ring value={reached} max={goals.length} />
            <View style={{ flex: 1, gap: 3 }}>
              <Text style={cardText.strong}>{all ? 'Every goal reached' : `${reached} of ${goals.length} goals reached`}</Text>
              <Text style={cardText.meta}>{all ? 'Nice week — take a moment to enjoy it.' : 'This week · 4 days left'}</Text>
            </View>
            <Icon name="chevronRight" size={20} color={colors.textMuted} />
          </View>
          <View style={styles.goalList}>
            {goals.map((g) => {
              const s = goalStatus(g);
              return (
                <View key={g.id} style={styles.goalRow}>
                  <View style={[styles.dot, { backgroundColor: DOT[s] }]} />
                  <Text numberOfLines={1} style={styles.goalName}>
                    {g.title}
                  </Text>
                  <Text style={[styles.goalState, s === 'over' && { color: ui.dangerInk }]}>
                    {s === 'progress' && GOAL_TYPES[g.type].unit !== '₫' ? `${g.current} of ${g.target}` : DOT_LABEL[s]}
                  </Text>
                </View>
              );
            })}
          </View>
        </>
      )}
    </CardShell>
  );
}

/* =====================  Calendar summary  ===================== */

const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const WD_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

type CalendarSummaryProps = {
  date?: YMD;
  nextEvent?: { name: string; inDays: number };
  onPress?: () => void;
  pressedPreview?: boolean;
  /** 'green': the dark "today" card of Event reminders, with leaves inside. 'week': cream card with a week strip. */
  variant?: 'green' | 'week';
};

export function CalendarSummaryCard({ date = TODAY, nextEvent, onPress, pressedPreview, variant = 'week' }: CalendarSummaryProps) {
  const accent = useAccent();
  if (variant === 'green') return <TodayGreenCard date={date} onPress={onPress} pressedPreview={pressedPreview} />;
  const l = solarToLunar(date);
  const special = l.d === 1 ? 'First day of the lunar month' : l.d === 15 ? 'Full moon (Rằm)' : null;
  const monday = addDays(date, -((weekday(date) + 6) % 7));
  const week = Array.from({ length: 7 }, (_, i) => addDays(monday, i));
  return (
    <CardShell onPress={onPress} pressedPreview={pressedPreview} accessibilityLabel={`${dateLabel(date, { year: true })}, lunar ${l.d}/${l.m}`} tone={special ? 'lunar' : 'default'}>
      <View style={styles.calTop}>
        <View style={[styles.dayBlock, { backgroundColor: accent }]}>
          <Text style={styles.dayWd}>{WD[weekday(date)].toUpperCase()}</Text>
          <Text style={styles.dayNum}>{date.d}</Text>
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={cardText.strong}>
            {WD_LONG[weekday(date)]}, {monthLong(date.m)} {date.d}
          </Text>
          <View style={styles.lunarRow}>
            <Icon name="moon" size={14} color={ui.lunar} />
            <Text style={styles.lunarText}>
              Lunar {l.d}/{l.m}
              {l.leap ? ' (leap)' : ''} · {canChi(l.y)} year
            </Text>
          </View>
          {special && <StatusPill tone="lunar" label={special} icon={null} />}
        </View>
      </View>
      <View style={styles.week} accessibilityElementsHidden>
        {week.map((d) => {
          const on = sameDay(d, date);
          const ld = solarToLunar(d);
          return (
            <View key={d.d} style={[styles.weekCell, on && { backgroundColor: ui.accentSoft, borderColor: '#C9D3B0' }]}>
              <Text style={[styles.weekWd, on && { color: ui.accentInk }]}>{WD[weekday(d)][0]}</Text>
              <Text style={[styles.weekD, on && { color: ui.accentInk }]}>{d.d}</Text>
              <Text style={[styles.weekL, (ld.d === 1 || ld.d === 15) && { color: ui.lunar, fontWeight: '800' }]}>{ld.d === 1 ? `1/${ld.m}` : ld.d}</Text>
            </View>
          );
        })}
      </View>
      {nextEvent && (
        <View style={styles.next}>
          <Icon name="bell" size={15} color={colors.textSoft} />
          <Text numberOfLines={1} style={[cardText.meta, { flex: 1, color: colors.textSoft }]}>
            Next: <Text style={{ fontWeight: '800', color: colors.text }}>{nextEvent.name}</Text> · in {nextEvent.inDays} days
          </Text>
        </View>
      )}
    </CardShell>
  );
}

/** The green "today" card of Event reminders: solar left, lunar right, leaves painted inside. */
function TodayGreenCard({ date, onPress, pressedPreview }: { date: YMD; onPress?: () => void; pressedPreview?: boolean }) {
  const l = solarToLunar(date);
  const body = (
    <>
      <Decor asset={EVENTS_DECOR.todayLeavesLeft} style={EVENTS_ANCHORS.todayLeavesLeft} />
      <Decor asset={EVENTS_DECOR.todayLeavesRight} style={EVENTS_ANCHORS.todayLeavesRight} />
      <View style={styles.greenRow}>
        <View style={{ flex: 1 }}>
          <Text style={styles.greenLabel}>TODAY · SOLAR</Text>
          <Text style={styles.greenBig}>
            {WD[weekday(date)]}, {monthLong(date.m).slice(0, 3)} {date.d}
          </Text>
        </View>
        <View style={styles.greenDivider} />
        <View style={{ flex: 1, alignItems: 'flex-end' }}>
          <Text style={styles.greenLabel}>LUNAR</Text>
          <Text style={styles.greenBig}>
            {l.d}/{l.m}
            {l.leap ? '*' : ''}
          </Text>
        </View>
      </View>
      <Text style={styles.greenSub}>
        Lunar day {l.d}, month {l.m}
        {l.leap ? ' (leap)' : ''} · {canChi(l.y)}
      </Text>
    </>
  );
  return (
    <CardShell onPress={onPress} pressedPreview={pressedPreview} accessibilityLabel={`Today ${dateLabel(date)}, lunar ${l.d}/${l.m}`} padding={0} style={styles.green}>
      {body}
    </CardShell>
  );
}

/* =====================  Report  ===================== */

type ReportProps = {
  title: string;
  period: string;
  description: string;
  stats: { label: string; value: string }[];
  isNew?: boolean;
  status?: LoadStatus;
  onOpen?: () => void;
  pressedPreview?: boolean;
};

export function ReportCard({ title, period, description, stats, isNew, status = 'ready', onOpen, pressedPreview }: ReportProps) {
  return (
    <CardShell pressedPreview={pressedPreview} accessibilityLabel={`${title}, ${period}`}>
      {status === 'ready' && <Decor asset={REPORTS_DECOR.reviewArt} style={REPORTS_ANCHORS.reviewArt} />}
      {status === 'ready' && <Decor asset={REPORTS_DECOR.reviewArtLeft} style={REPORTS_ANCHORS.reviewArtLeft} />}
      <CardHeader icon="chart" tone={TILE.sky} title={title} subtitle={period} right={isNew && status === 'ready' ? <StatusPill tone="accent" solid label="New" icon={null} /> : undefined} />
      {status === 'loading' ? (
        <>
          <Text style={cardText.meta}>Putting your week together — this takes a moment.</Text>
          <DataState status="loading" skeleton="columns" loadingLabel="Preparing report" />
        </>
      ) : status !== 'ready' ? (
        <DataState
          status={status}
          emptyIcon="chart"
          emptyTitle="Not enough to report yet"
          emptyText="Log on 3 or more days this week and your report arrives Sunday evening."
        />
      ) : (
        <>
          <Text numberOfLines={3} style={[cardText.body, { marginRight: 96 }]}>
            {description}
          </Text>
          <View style={[styles.reportStats, { marginRight: 96 }]}>
            {stats.map((s, i) => (
              <View key={s.label} style={[styles.reportStat, i > 0 && styles.reportStatDivider]}>
                <Text style={styles.reportValue}>{s.value}</Text>
                <Text style={cardText.meta}>{s.label}</Text>
              </View>
            ))}
          </View>
          <Button label="Read weekly report" size="sm" iconRight="chevronRight" onPress={onOpen} />
        </>
      )}
    </CardShell>
  );
}

const styles = StyleSheet.create({
  cols: { flexDirection: 'row', alignItems: 'stretch' },
  col: { flex: 1, flexBasis: 0, gap: 2, paddingHorizontal: 2 },
  colHead: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  colValue: { ...font('900', 21, 27), letterSpacing: -0.4 },
  vline: { width: 1, backgroundColor: ui.line, marginHorizontal: 8 },
  budgetTrack: { height: 10, borderRadius: 5, backgroundColor: ui.track, overflow: 'hidden', flexDirection: 'row' },
  budgetFill: { height: 10, borderRadius: 5 },
  between: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  budgetLeft: { ...font('800', 12.5, 17), color: '#355F25' },

  periodSwitch: { flexDirection: 'row', padding: 2, borderRadius: 10, backgroundColor: '#F0E6D8', borderWidth: 1, borderColor: ui.line },
  periodItem: { height: 32, minWidth: 48, paddingHorizontal: 9, borderRadius: 8, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'transparent' },
  periodOn: { backgroundColor: '#FFFDF8', borderColor: ui.lineStrong },
  periodLabel: { ...font('600', 12.5, 16), color: colors.textSoft },
  moneyValue: { ...font('900', 18, 24), letterSpacing: -0.3 },
  split: { flexDirection: 'row', height: 8, borderRadius: 4, overflow: 'hidden' },
  netRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, height: 40, borderRadius: radii.md, backgroundColor: '#EEF2E3', borderWidth: 1, borderColor: '#D3DCC0' },
  netValue: font('900', 16, 22),

  goalsTop: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  ringNum: { ...font('900', 22, 26), color: colors.text },
  ringOf: { ...font('700', 13, 16), color: colors.textMuted },
  goalList: { gap: 8, borderTopWidth: 1, borderTopColor: ui.line, paddingTop: 11 },
  goalRow: { flexDirection: 'row', alignItems: 'center', gap: 9 },
  dot: { width: 10, height: 10, borderRadius: 5 },
  goalName: { ...font('600', 14, 19), color: colors.text, flex: 1 },
  goalState: { ...font('700', 12.5, 17), color: colors.textSoft },

  green: {
    gap: 0,
    borderRadius: 12,
    borderWidth: 2.6,
    borderColor: '#B5B469',
    backgroundColor: '#3C5C2A',
    paddingTop: 14,
    paddingLeft: 14,
    paddingRight: 13,
    paddingBottom: 11.5,
    boxShadow: '0 0 0 0.8px #6F8A4A, 0 3px 8px rgba(60,80,30,0.25)',
  },
  greenRow: { flexDirection: 'row', alignItems: 'flex-start' },
  greenDivider: { width: 1.5, height: 37.6, marginTop: 0, backgroundColor: 'rgba(253,243,218,0.45)' },
  greenLabel: { ...font('800', 10.3, 13), letterSpacing: 1, color: '#FDF3DA' },
  greenBig: { ...font('800', 20.6, 25), marginTop: 3, color: '#FFFBEF' },
  greenSub: { ...font('400', 11.6, 15), marginTop: 8, color: '#FDF3DA' },
  calTop: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  dayBlock: { width: 62, height: 68, borderRadius: 16, borderWidth: 1.5, borderColor: colors.accentRing, alignItems: 'center', justifyContent: 'center' },
  dayWd: { ...font('900', 11.5, 14), letterSpacing: 1, color: '#E6ECD6' },
  dayNum: { ...font('900', 30, 34), color: colors.white },
  lunarRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  lunarText: { ...font('700', 13.5, 18), color: ui.lunar },
  week: { flexDirection: 'row', gap: 4 },
  weekCell: { flex: 1, flexBasis: 0, alignItems: 'center', paddingVertical: 6, borderRadius: 11, borderWidth: 1, borderColor: 'transparent' },
  weekWd: { ...font('700', 11, 14), color: colors.textMuted },
  weekD: { ...font('800', 15.5, 20), color: colors.text },
  weekL: { ...font('600', 10, 12), color: colors.textMuted },
  next: { flexDirection: 'row', alignItems: 'center', gap: 7, borderTopWidth: 1, borderTopColor: ui.line, paddingTop: 10 },

  reportStats: { flexDirection: 'row', borderRadius: radii.md, borderWidth: 1, borderColor: ui.line, backgroundColor: '#FBF5EC', paddingVertical: 10 },
  reportStat: { flex: 1, flexBasis: 0, alignItems: 'center', gap: 1 },
  reportStatDivider: { borderLeftWidth: 1, borderLeftColor: ui.line },
  reportValue: { ...font('900', 16.5, 22), color: colors.text },
});
