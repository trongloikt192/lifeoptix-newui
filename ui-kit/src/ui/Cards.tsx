import { useState } from 'react';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { GOAL_TYPES, goalStatus } from '../data/models';
import type { Badge, CalendarEvent, Entry, Goal, GoalStatus } from '../data/models';
import { TODAY, dateLabel, diffDays, durationLabel, money, monthShort, sleepMinutes, timeLabel } from '../data/format';
import { canChi, solarToLunar } from '../data/lunar';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import type { StyleProp } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, elevation, font, kinds, radii, ui } from '../theme/tokens';
import type { EntryKind } from '../theme/tokens';
import { IconButton } from './Button';
import { Decor } from './Decor';
import { EVENT_SPRIGS } from '../../reference/src/decor/eventsDecor';
import { GARDEN_DECOR } from '../../reference/src/decor/gardenDecor';
import { STAT_SPRIGS } from '../../reference/src/decor/reportsDecor';
import { CardShell, DataState } from './CardShell';
import type { LoadStatus } from './CardShell';

/* ---------- small pieces ---------- */

export function KindTile({ kind, size = 40 }: { kind: EntryKind; size?: number }) {
  const k = kinds[kind];
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size * 0.23, backgroundColor: k.bg, borderColor: k.bg }]}>
      <Icon name={kind} size={Math.round(size * 0.55)} color={k.fg} />
    </View>
  );
}

export type PillTone = 'earned' | 'locked' | 'healthy' | 'lunar' | 'solar' | 'neutral' | 'accent' | 'warn' | 'danger' | 'success';

const PILL: Record<PillTone, { bg: string; border: string; ink: string; icon?: IconName }> = {
  earned: { bg: ui.goldSoft, border: ui.goldBorder, ink: ui.gold, icon: 'award' },
  locked: { bg: ui.lockedSoft, border: '#D9D0C7', ink: ui.locked, icon: 'lock' },
  healthy: { bg: '#E3EEC5', border: '#B9CC8A', ink: '#2E5208', icon: 'heart' },
  lunar: { bg: ui.lunarSoft, border: ui.warnBorder, ink: ui.lunar },
  solar: { bg: ui.solarSoft, border: '#93D8E8', ink: ui.solar },
  neutral: { bg: '#F4F2DD', border: '#DCDDBB', ink: colors.textSoft },
  accent: { bg: ui.accentSoft, border: '#C3CEA7', ink: ui.accentInk },
  warn: { bg: ui.warnSoft, border: ui.warnBorder, ink: ui.warn },
  danger: { bg: ui.dangerSoft, border: ui.dangerBorder, ink: ui.dangerInk },
  success: { bg: '#E3EEC5', border: '#B9CC8A', ink: '#2E5208', icon: 'check' },
};

export function StatusPill({ tone, label, icon, solid, style }: { tone: PillTone; label: string; icon?: IconName | null; solid?: boolean; style?: StyleProp }) {
  const accent = useAccent();
  const p = PILL[tone];
  const glyph = icon === null ? undefined : (icon ?? p.icon);
  const s = solid ? { bg: tone === 'accent' ? accent : p.ink, border: 'transparent', ink: colors.white } : p;
  const tag = tone === 'lunar' || tone === 'solar';
  return (
    <View style={[styles.pill, tag && styles.tag, { backgroundColor: s.bg, borderColor: s.border }, style]}>
      {glyph && <Icon name={glyph} size={13} color={s.ink} strokeWidth={2.4} />}
      <Text numberOfLines={1} style={[tag ? styles.tagLabel : styles.pillLabel, { color: s.ink }]}>
        {tag ? label.toUpperCase() : label}
      </Text>
    </View>
  );
}

export function ProgressBar({ value, max, tone = 'accent', label }: { value: number; max: number; tone?: 'accent' | 'done' | 'over' | 'muted' | 'amber'; label: string }) {
  const pct = Math.max(0, Math.min(1, max ? value / max : 0));
  const fill = tone === 'over' ? ui.danger : tone === 'muted' ? ui.lineStrong : tone === 'amber' ? ui.barAmber : ui.barGreen;
  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max, now: Math.min(value, max) }}
      style={styles.track}
    >
      <View style={[styles.fill, { width: `${pct * 100}%`, backgroundColor: fill }]} />
      {tone === 'over' && <View style={styles.overCap} />}
    </View>
  );
}

/* ---------- Entry card / list row ---------- */

export function entryValue(e: Entry): { text: string; color: string } {
  switch (e.kind) {
    case 'expense':
      return { text: `−${money(e.amount ?? 0)}`, color: kinds.expense.fg };
    case 'income':
      return { text: `+${money(e.amount ?? 0)}`, color: kinds.income.fg };
    case 'meal':
      return { text: e.amount ? money(e.amount) : '', color: colors.textSoft };
    case 'activity':
      return { text: durationLabel(e.minutes ?? 0), color: kinds.activity.fg };
    case 'sleep':
      return { text: durationLabel(sleepMinutes(e.bedtime ?? 0, e.wake ?? 0)), color: kinds.sleep.fg };
  }
}

export function entryMeta(e: Entry) {
  switch (e.kind) {
    case 'meal':
      return `${e.mealType} · ${timeLabel(e.time)}`;
    case 'expense':
    case 'income':
      return `${e.category} · ${timeLabel(e.time)}`;
    case 'activity':
      return e.distanceKm ? `${e.category} · ${e.distanceKm} km` : `${e.category} · ${timeLabel(e.time)}`;
    case 'sleep':
      return `${timeLabel(e.bedtime ?? 0)} – ${timeLabel(e.wake ?? 0)}`;
  }
}

type EntryCardProps = { entry: Entry; onPress?: () => void; onMore?: () => void; variant?: 'card' | 'row'; last?: boolean; pressedPreview?: boolean };

export function EntryCard({ entry, onPress, onMore, variant = 'card', last, pressedPreview }: EntryCardProps) {
  const [down, setDown] = useState(false);
  const v = entryValue(entry);
  const isRow = variant === 'row';
  return (
    <View style={[isRow ? [styles.row, !last && styles.rowDivider] : styles.card, styles.entry, (down || pressedPreview) && (isRow ? styles.entryPressed : styles.pressedCard)]}>
      <Pressable
        onPress={onPress}
        accessibilityLabel={`${kinds[entry.kind].label}: ${entry.title}, ${entryMeta(entry)}${v.text ? `, ${v.text}` : ''}`}
        onPressIn={() => setDown(true)}
        onPressOut={() => setDown(false)}
        style={styles.entryMain}
      >
        <KindTile kind={entry.kind} size={isRow ? 36 : 40} />
        <View style={styles.entryText}>
          <Text numberOfLines={1} style={styles.entryTitle}>
            {entry.title}
          </Text>
          <Text numberOfLines={1} style={styles.entryMeta}>
            {entryMeta(entry)}
          </Text>
        </View>
        {v.text !== '' && <Text style={[styles.entryValue, { color: v.color }]}>{v.text}</Text>}
      </Pressable>
      {onMore && <IconButton icon="more" label={`More actions for ${entry.title}`} variant="plain" size={32} onPress={onMore} />}
    </View>
  );
}

/* ---------- Goal card ---------- */

const STATUS: Record<GoalStatus, { tone: PillTone; label: string }> = {
  notStarted: { tone: 'neutral', label: 'Not started' },
  progress: { tone: 'accent', label: 'On track' },
  achieved: { tone: 'success', label: 'Achieved' },
  over: { tone: 'danger', label: 'Over limit' },
};

export function goalAmount(g: Goal, n: number) {
  const t = GOAL_TYPES[g.type];
  return t.unit === '₫' ? money(n) : `${n} ${n === 1 ? t.unit.replace(/s$/, '') : t.unit}`;
}

export type GoalSource = 'you' | 'suggested' | 'template';
const SOURCE: Record<GoalSource, { icon: IconName; label: string }> = {
  you: { icon: 'user', label: 'Set by you' },
  suggested: { icon: 'sparkles', label: 'Suggested' },
  template: { icon: 'copy', label: 'From a template' },
};

export function GoalCard({ goal, onPress, onMore, source = 'you', pressedPreview }: { goal: Goal; onPress?: () => void; onMore?: () => void; source?: GoalSource; pressedPreview?: boolean }) {
  const status = goalStatus(goal);
  const t = GOAL_TYPES[goal.type];
  const s = STATUS[status];
  const pct = Math.round((goal.current / goal.target) * 100);
  const progressText =
    status === 'over'
      ? `${money(goal.current)} of ${money(goal.target)}`
      : status === 'notStarted'
        ? t.limit
          ? `Nothing spent yet · limit ${money(goal.target)}`
          : `Nothing logged yet · goal ${goalAmount(goal, goal.target)}`
        : `${t.unit === '₫' ? money(goal.current) : goal.current} of ${goalAmount(goal, goal.target)}`;
  return (
    <View style={[styles.card, styles.goal, status === 'achieved' && { borderColor: '#BED3A8' }, status === 'over' && { borderColor: ui.dangerBorder }, pressedPreview && styles.pressedCard]}>
      <View style={styles.goalHead}>
        <KindTile kind={t.icon} size={36} />
        <Pressable onPress={onPress} style={styles.goalTitleWrap} accessibilityLabel={`${goal.title}, ${s.label}, ${progressText}`}>
          <Text numberOfLines={1} style={styles.entryTitle}>
            {goal.title}
          </Text>
          <View style={styles.sourceRow}>
            <Text style={styles.entryMeta}>{goal.period === 'week' ? 'This week' : goal.period === 'month' ? 'November' : 'Today'} ·</Text>
            <Icon name={SOURCE[source].icon} size={13} color={source === 'suggested' ? ui.gold : colors.textMuted} />
            <Text style={[styles.entryMeta, source === 'suggested' && { color: ui.gold }]}>{SOURCE[source].label}</Text>
          </View>
        </Pressable>
        {onMore ? <IconButton icon="more" label={`More actions for ${goal.title}`} variant="plain" size={32} onPress={onMore} /> : null}
      </View>
      <ProgressBar
        value={goal.current}
        max={goal.target}
        label={goal.title}
        tone={status === 'over' ? 'over' : status === 'notStarted' ? 'muted' : t.limit ? 'amber' : 'accent'}
      />
      <View style={styles.goalFoot}>
        <Text numberOfLines={1} style={[styles.goalProgress, status === 'over' && { color: ui.dangerInk }]}>
          {progressText}
        </Text>
        <StatusPill
          tone={s.tone}
          label={status === 'over' ? `Over by ${money(goal.current - goal.target)}` : status === 'progress' ? `${pct}%` : s.label}
          icon={status === 'over' ? 'alert' : undefined}
        />
      </View>
    </View>
  );
}

/* ---------- Event card ---------- */

export function eventWhen(ev: CalendarEvent) {
  const n = diffDays(TODAY, ev.date);
  if (n < 0) return { tone: 'past' as const, label: n === -1 ? 'Yesterday' : `${-n} days ago` };
  if (n === 0) return { tone: 'today' as const, label: 'Today' };
  if (n === 1) return { tone: 'soon' as const, label: 'Tomorrow' };
  if (n <= 14) return { tone: 'soon' as const, label: `In ${n} days` };
  return { tone: 'later' as const, label: `In ${n} days` };
}

type EventCardProps = {
  event: CalendarEvent;
  onPress?: () => void;
  reminderOn?: boolean;
  onToggleReminder?: () => void;
  pressedPreview?: boolean;
  /** Position in the list: picks the leaf pair (i % 3) painted inside the card, as in Event reminders. */
  sprigIndex?: number;
};

/** Date tile tint by distance (mockup: amber = soon, green, blue). */
const EVENT_TONE = {
  today: { fill: '#E6F8C7', border: '#BFE09A', text: '#1A3300' },
  soon: { fill: '#FEF1C5', border: '#F6D58A', text: '#2C0500' },
  later: { fill: '#C3F4FD', border: '#93D8E8', text: '#00212E' },
  past: { fill: '#F1ECE1', border: '#DCD5C6', text: '#5A4B40' },
} as const;

export function EventCard({ event, onPress, reminderOn, onToggleReminder, pressedPreview, sprigIndex }: EventCardProps) {
  const [down, setDown] = useState(false);
  const w = eventWhen(event);
  const lunar = solarToLunar(event.date);
  const tone = EVENT_TONE[w.tone];
  const repeat = event.repeat === 'yearly' ? 'Every year' : event.repeat === 'monthly' ? 'Every month' : 'Once';
  const sprigs = sprigIndex == null ? null : EVENT_SPRIGS[sprigIndex % EVENT_SPRIGS.length];
  return (
    <View
      style={[
        styles.card,
        styles.event,
        { borderColor: '#F3E2B8', backgroundColor: '#FEF7E5' },
        w.tone === 'past' && { backgroundColor: '#F8F2E6', boxShadow: 'none' },
        (down || pressedPreview) && styles.pressedCard,
      ]}
    >
      <Pressable
        onPress={onPress}
        onPressIn={() => setDown(true)}
        onPressOut={() => setDown(false)}
        accessibilityLabel={`${event.name}, ${event.calendar}, ${dateLabel(event.date)}, ${w.label}`}
        style={styles.eventMain}
      >
        <View style={[styles.dateBlock, { backgroundColor: tone.fill, borderColor: tone.border }]}>
          <Text style={[styles.dateDay, { color: tone.text }]}>{event.date.d}</Text>
          <Text style={[styles.dateMonth, { color: tone.text }]}>{monthShort(event.date.m).toUpperCase()}</Text>
        </View>
        {sprigs?.left && <Decor asset={sprigs.left} style={sprigs.leftAt} />}
        <View style={styles.entryText}>
          <View style={styles.titleRow}>
            <Text numberOfLines={1} style={[styles.entryTitle, { flexShrink: 1 }, w.tone === 'past' && { color: colors.textSoft }]}>
              {event.name}
            </Text>
            <StatusPill tone={event.calendar === 'lunar' ? 'lunar' : 'solar'} label={event.calendar === 'lunar' ? 'Lunar' : 'Solar'} />
          </View>
          <Text numberOfLines={1} style={styles.entryMeta}>
            {event.calendar === 'lunar' ? `${lunar.d}/${lunar.m} lunar → ` : ''}
            <Text style={w.tone === 'soon' || w.tone === 'today' ? { color: ui.warn, fontWeight: '800' } : undefined}>
              {monthShort(event.date.m)} {event.date.d} · {w.label}
            </Text>
          </Text>
          <Text numberOfLines={1} style={styles.entryMeta}>
            {repeat}
            {event.remindDays > 0 ? ` · remind ${event.remindDays} d before` : ''}
          </Text>
        </View>
      </Pressable>
      {sprigs?.right && <Decor asset={sprigs.right} style={sprigs.rightAt} />}
      {onToggleReminder && w.tone !== 'past' && (
        <View style={styles.bellSlot}>
          <IconButton
            icon={reminderOn ? 'bell' : 'bellOff'}
            label={reminderOn ? `Reminder on, ${event.remindDays} days before. Turn off` : 'Reminder off. Turn on'}
            selected={reminderOn && w.tone !== 'soon' && w.tone !== 'today'}
            onPress={onToggleReminder}
          />
        </View>
      )}
    </View>
  );
}

export const lunarYearLabel = (y: number) => `${canChi(y)} year`;

/* ---------- Metric card ---------- */

/** Pass as `style` when two metric cards share a row. */
export const half = { flex: 1, flexBasis: 0 } as const;

type MetricCardProps = {
  label: string;
  value?: string;
  unit?: string;
  icon: IconName;
  /** e.g. { pct: 12, good: false } — direction from the sign of pct. */
  delta?: { pct: number; good: boolean; vs: string };
  caption?: string;
  style?: StyleProp;
  status?: LoadStatus;
  onPress?: () => void;
  pressedPreview?: boolean;
  onRetry?: () => void;
  /** Position in a grid: the Reports stat-card sprig i % 4, painted under the text. */
  sprigIndex?: number;
};

export function MetricCard({ label, value, unit, icon, delta, caption, style, status = 'ready', onPress, pressedPreview, onRetry, sprigIndex }: MetricCardProps) {
  const sprig = sprigIndex == null ? null : STAT_SPRIGS[sprigIndex % STAT_SPRIGS.length];
  const empty = value == null || status === 'empty';
  if (status === 'loading' || status === 'error') {
    return (
      <CardShell style={[styles.metricShell, style]} padding={14}>
        <View style={styles.metricHead}>
          <Icon name={icon} size={18} color={colors.textSoft} />
          <Text numberOfLines={1} style={styles.metricLabel}>
            {label}
          </Text>
        </View>
        <DataState status={status} skeleton="metric" loadingLabel={`Loading ${label}`} onRetry={onRetry} errorText="Tap to retry." />
      </CardShell>
    );
  }
  return (
    <CardShell onPress={onPress} pressedPreview={pressedPreview} accessibilityLabel={`${label}: ${value ?? 'no data'} ${unit ?? ''}`} style={[styles.metricShell, style]} padding={14}>
      {sprig && <Decor asset={sprig.asset} style={sprig.at} />}
      <View style={styles.metricHead}>
        <Icon name={icon} size={18} color={colors.textSoft} />
        <Text numberOfLines={1} style={styles.metricLabel}>
          {label}
        </Text>
      </View>
      {empty ? (
        <>
          <Text style={[styles.metricValue, { color: colors.textMuted }]}>—</Text>
          <Text style={styles.metricCaption}>{caption ?? 'No data yet'}</Text>
        </>
      ) : (
        <>
          <View style={styles.metricValueRow}>
            <Text numberOfLines={1} style={styles.metricValue}>
              {value}
            </Text>
            {unit && <Text style={styles.metricUnit}>{unit}</Text>}
          </View>
          {delta ? (
            <View style={styles.deltaRow}>
              <View style={[styles.delta, { backgroundColor: delta.good ? '#E2EDD6' : ui.dangerSoft }]}>
                <Icon name={delta.pct >= 0 ? 'trendUp' : 'trendDown'} size={14} color={delta.good ? '#355F25' : ui.dangerInk} strokeWidth={2.4} />
                <Text style={[styles.deltaLabel, { color: delta.good ? '#355F25' : ui.dangerInk }]}>{Math.abs(delta.pct)}%</Text>
              </View>
              <Text numberOfLines={1} style={styles.metricCaption}>
                {delta.vs}
              </Text>
            </View>
          ) : (
            caption && <Text style={styles.metricCaption}>{caption}</Text>
          )}
        </>
      )}
    </CardShell>
  );
}

/* ---------- Badge medallion ---------- */

/** Badge picture from the Garden mockup; earned and locked art differ. Size is the art box (60 pt in the mockup). */
export function BadgeMedal({ badge, size = 60 }: { badge: Badge; size?: number }) {
  const art = badge.earnedOn ? GARDEN_DECOR.badge7Day : GARDEN_DECOR.badge100DayLocked;
  return (
    <View style={{ width: size, height: size }} accessibilityElementsHidden>
      <Decor asset={art} scale={size / art.width} style={{ left: 0, top: 0 }} />
      {!badge.earnedOn && (
        <View style={[styles.lockDot, { right: size * 0.04, bottom: size * 0.08 }]}>
          <Icon name="lock" size={Math.max(11, size * 0.18)} color={ui.locked} strokeWidth={2.4} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  tile: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  lockDot: { position: 'absolute', padding: 2, borderRadius: 8, backgroundColor: '#FEF7EA' },
  tag: { height: 17, paddingHorizontal: 5, borderRadius: 4.5 },
  tagLabel: { ...font('900', 9.5, 12), letterSpacing: 0.6 },
  eventMain: { flex: 1, flexDirection: 'row', alignItems: 'flex-start', gap: 12, alignSelf: 'stretch' },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 7 },
  bellSlot: { alignSelf: 'flex-start', marginTop: -4, marginRight: -4 },
  pill: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 24, paddingHorizontal: 9, borderRadius: radii.pill, borderWidth: 1, alignSelf: 'flex-start' },
  pillLabel: font('700', 12, 16),

  track: { height: 8.7, borderRadius: 4.35, backgroundColor: ui.track, overflow: 'hidden', flexDirection: 'row' },
  fill: { height: 8.7, borderRadius: 4.35 },
  overCap: { position: 'absolute', right: 0, top: 0, bottom: 0, width: 4, backgroundColor: ui.dangerInk },

  card: { backgroundColor: ui.card, borderWidth: 1.2, borderColor: ui.cardBorder, borderRadius: radii.lg, boxShadow: elevation.card },
  row: { backgroundColor: 'transparent' },
  rowDivider: { borderBottomWidth: 1, borderBottomColor: ui.line },
  entry: { flexDirection: 'row', alignItems: 'center', paddingRight: 2, minHeight: 66, overflow: 'hidden' },
  entryPressed: { backgroundColor: 'rgba(120,80,40,0.07)' },
  pressedCard: { borderColor: ui.lineStrong, boxShadow: 'none', transform: [{ scale: 0.985 }], backgroundColor: '#F6EDE0' },
  sourceRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  entryMain: { flex: 1, alignSelf: 'stretch', flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 11, paddingLeft: 12, paddingRight: 10 },
  entryText: { flex: 1, gap: 2 },
  entryTitle: { ...font('800', 15.3, 19), letterSpacing: -0.3, color: '#320805' },
  entryMeta: { ...font('400', 12.2, 16), color: '#6E4E3D' },
  entryValue: { ...font('800', 15.2, 19), letterSpacing: -0.5 },

  goal: { padding: 14, paddingRight: 6, gap: 11 },
  goalHead: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  goalTitleWrap: { flex: 1, gap: 1 },
  goalFoot: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8, paddingRight: 8 },
  goalProgress: { ...font('600', 13, 17), color: colors.textSoft, flex: 1 },

  event: { flexDirection: 'row', alignItems: 'flex-start', paddingTop: 11.5, paddingBottom: 12.5, paddingLeft: 10, paddingRight: 8, borderRadius: 10, overflow: 'hidden' },
  dateBlock: { width: 44, height: 48, borderRadius: 9, borderWidth: 1.2, alignItems: 'center', justifyContent: 'center' },
  dateMonth: { ...font('900', 10, 12), letterSpacing: 0.6 },
  dateDay: { ...font('900', 18, 22) },
  eventPills: { flexDirection: 'row', gap: 6, marginTop: 5 },

  metricShell: { gap: 6 },
  metricHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricLabel: { ...font('700', 12.5, 16), color: colors.textSoft, flex: 1 },
  metricValueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 4 },
  metricValue: { ...font('900', 22, 28), letterSpacing: -0.5, color: colors.text },
  metricUnit: { ...font('700', 13, 16), color: colors.textSoft },
  metricCaption: { ...font('500', 12, 16), color: colors.textMuted, flex: 1 },
  deltaRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  delta: { flexDirection: 'row', alignItems: 'center', gap: 3, height: 22, paddingHorizontal: 6, borderRadius: 6 },
  deltaLabel: font('800', 12, 16),
});
