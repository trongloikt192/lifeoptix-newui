import { useState } from 'react';
import { Icon } from '../icons/Icon';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, font, radii, ui } from '../theme/tokens';
import { TODAY, addDays, dateLabel, groupDigits, money, parseAmount, timeLabel } from '../data/format';
import type { YMD } from '../data/format';
import { canChi, lunarToSolar, solarToLunar } from '../data/lunar';
import { GOAL_TYPES } from '../data/models';
import type { Badge, CalendarEvent, Goal, GoalType, Period, Repeat } from '../data/models';
import { Button } from '../ui/Button';
import { BadgeMedal, KindTile, ProgressBar, StatusPill } from '../ui/Cards';
import { Chip, ChipRow, OptionRow, Segmented, Stepper } from '../ui/Controls';
import { TextField } from '../ui/Field';
import { ConfirmDialog, useToast } from '../ui/Feedback';
import { FooterRow, Group, PickerRow, Section, Sheet } from '../ui/Sheet';
import { DatePickerSheet, TimePickerSheet } from './PickerSheets';
import { PermissionPrompt } from './MenuSheets';

/* =====================  Goal  ===================== */

const PERIOD_LABEL: Record<Period, string> = { day: 'day', week: 'week', month: 'month' };

export function GoalSheet({ visible, onClose, goal }: { visible: boolean; onClose: () => void; goal?: Goal }) {
  const accent = useAccent();
  const toast = useToast();
  const [type, setType] = useState<GoalType>(goal?.type ?? 'move');
  const [count, setCount] = useState(goal && GOAL_TYPES[goal.type].unit !== '₫' ? goal.target : 3);
  const [amount, setAmount] = useState(goal && GOAL_TYPES[goal.type].unit === '₫' ? groupDigits(String(goal.target)) : '');
  const [period, setPeriod] = useState<Period>(goal?.period ?? 'week');
  const [start, setStart] = useState<YMD>(goal?.start ?? TODAY);
  const [hasEnd, setHasEnd] = useState(!!goal?.end);
  const [end, setEnd] = useState<YMD>(goal?.end ?? addDays(TODAY, 90));
  const [picker, setPicker] = useState<'start' | 'end' | null>(null);
  const [confirm, setConfirm] = useState(false);

  const t = GOAL_TYPES[type];
  const isMoney = t.unit === '₫';
  const target = isMoney ? parseAmount(amount) : count;
  const summary = `${t.verb} ${isMoney ? (target ? money(target) : '…') : `${count} ${count === 1 ? t.unit.replace(/s$/, '') : t.unit}`} per ${PERIOD_LABEL[period]}`;

  return (
    <>
      <Sheet
        visible={visible && !picker}
        onClose={onClose}
        title={goal ? 'Edit goal' : 'New goal'}
        subtitle={goal ? goal.title : 'Small and steady works best.'}
        footer={
          <FooterRow>
            {goal ? <Button label="Delete" icon="trash" variant="dangerGhost" onPress={() => setConfirm(true)} /> : <Button label="Cancel" variant="secondary" grow onPress={onClose} />}
            <Button
              label={goal ? 'Save changes' : 'Create goal'}
              grow
              disabled={!target}
              onPress={() => {
                onClose();
                toast({ kind: 'success', message: goal ? 'Goal updated' : 'Goal created — good luck!' });
              }}
            />
          </FooterRow>
        }
      >
        <Section title="What kind of goal?">
          <View style={styles.typeGrid} accessibilityRole="radiogroup">
            {(Object.keys(GOAL_TYPES) as GoalType[]).map((g) => {
              const on = g === type;
              return (
                <Pressable
                  key={g}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: on }}
                  onPress={() => setType(g)}
                  style={[styles.typeCard, on && { borderColor: accent, borderWidth: 2, backgroundColor: '#F6F7EC' }]}
                >
                  <KindTile kind={GOAL_TYPES[g].icon} size={34} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.typeLabel}>{GOAL_TYPES[g].label}</Text>
                    <Text style={styles.typeHint}>{GOAL_TYPES[g].hint}</Text>
                  </View>
                  {on && (
                    <View style={[styles.tick, { backgroundColor: accent }]}>
                      <Icon name="check" size={12} color={colors.white} strokeWidth={3.4} />
                    </View>
                  )}
                </Pressable>
              );
            })}
          </View>
        </Section>

        <Section title={t.limit ? 'Limit' : 'Target'}>
          {isMoney ? (
            <TextField value={amount} onChangeText={(v) => setAmount(groupDigits(v))} keyboardType="numeric" suffix="₫" placeholder="0" large />
          ) : (
            <Stepper label="target" value={count} onChange={setCount} min={1} max={31} unit={t.unit} />
          )}
          <Segmented
            label="Per"
            value={period}
            onChange={setPeriod}
            options={[
              { value: 'day', label: 'Per day' },
              { value: 'week', label: 'Per week' },
              { value: 'month', label: 'Per month' },
            ]}
          />
          <View style={styles.summary}>
            <Icon name="target" size={20} color={ui.accentInk} />
            <Text style={styles.summaryText}>{summary}</Text>
          </View>
        </Section>

        <Section title="Timeframe">
          <Group>
            <PickerRow icon="calendar" label="Starts" value={dateLabel(start, { relative: true })} onPress={() => setPicker('start')} />
            <OptionRow type="switch" label="Has an end date" description={hasEnd ? undefined : 'Keeps going until you stop it'} checked={hasEnd} onChange={setHasEnd} last={!hasEnd} />
            {hasEnd && <PickerRow icon="flame" label="Ends" value={dateLabel(end, { year: true })} onPress={() => setPicker('end')} last />}
          </Group>
        </Section>
      </Sheet>

      <DatePickerSheet
        visible={!!picker}
        onClose={() => setPicker(null)}
        allowLunar={false}
        initial={picker === 'end' ? end : start}
        title={picker === 'end' ? 'Goal ends on' : 'Goal starts on'}
        onConfirm={(v) => v.date && (picker === 'end' ? setEnd(v.date) : setStart(v.date))}
      />
      <ConfirmDialog
        visible={confirm}
        title="Delete this goal?"
        message={`“${goal?.title}” and its progress history will be removed. Your entries stay.`}
        confirmLabel="Delete goal"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          onClose();
          toast({ kind: 'info', message: 'Goal deleted', action: { label: 'Undo', onPress: () => {} } });
        }}
      />
    </>
  );
}

/* =====================  Event  ===================== */

const REMIND: { days: number; label: string }[] = [
  { days: 0, label: 'On the day' },
  { days: 1, label: '1 day before' },
  { days: 3, label: '3 days before' },
  { days: 7, label: '1 week before' },
];

export function EventSheet({ visible, onClose, event }: { visible: boolean; onClose: () => void; event?: CalendarEvent }) {
  const toast = useToast();
  const [name, setName] = useState(event?.name ?? '');
  const [cal, setCal] = useState<'solar' | 'lunar'>(event?.calendar ?? 'lunar');
  const [date, setDate] = useState<YMD>(event?.date ?? addDays(TODAY, 9));
  const [repeat, setRepeat] = useState<Repeat>(event?.repeat ?? 'yearly');
  const [remind, setRemind] = useState(event?.remindDays ?? 1);
  const [at, setAt] = useState(8 * 60);
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);
  const [confirm, setConfirm] = useState(false);

  const l = solarToLunar(date);
  const nextYear = repeat === 'yearly' && cal === 'lunar' ? lunarToSolar({ d: l.d, m: l.m, y: l.y + 1, leap: false }) : null;

  return (
    <>
      <Sheet
        visible={visible && !picker}
        onClose={onClose}
        dismissOnBackdrop={!name || name === event?.name}
        title={event ? 'Edit event' : 'New event'}
        subtitle={event ? undefined : 'Birthdays, anniversaries, memorial days…'}
        footer={
          <FooterRow>
            {event ? <Button label="Delete" icon="trash" variant="dangerGhost" onPress={() => setConfirm(true)} /> : <Button label="Cancel" variant="secondary" grow onPress={onClose} />}
            <Button
              label={event ? 'Save changes' : 'Save event'}
              grow
              disabled={!name.trim()}
              onPress={() => {
                onClose();
                toast({ kind: 'success', message: `Saved. We’ll remind you ${REMIND.find((r) => r.days === remind)?.label.toLowerCase()}.` });
              }}
            />
          </FooterRow>
        }
      >
        <TextField label="Name" value={name} onChangeText={setName} placeholder="e.g. Mom’s birthday" maxLength={60} />
        <Section title="Calendar" hint={cal === 'lunar' ? 'Lunar events move on the solar calendar each year — we track that for you.' : undefined}>
          <Segmented
            label="Calendar"
            value={cal}
            onChange={setCal}
            options={[
              { value: 'solar', label: 'Solar', icon: 'sun' },
              { value: 'lunar', label: 'Lunar', icon: 'moon' },
            ]}
          />
          <Group>
            <PickerRow
              icon={cal === 'lunar' ? 'moon' : 'calendar'}
              iconColor={cal === 'lunar' ? ui.lunar : colors.textSoft}
              label="Date"
              value={cal === 'lunar' ? `Lunar ${l.d}/${l.m}${l.leap ? ' (leap)' : ''}` : dateLabel(date, { year: true })}
              valueTone={cal === 'lunar' ? 'lunar' : 'default'}
              detail={cal === 'lunar' ? `${dateLabel(date, { year: true })} · ${canChi(l.y)}` : `Lunar ${l.d}/${l.m}`}
              onPress={() => setPicker('date')}
              last
            />
          </Group>
        </Section>
        <Section title="Repeat" hint={nextYear ? `Next year it falls on ${dateLabel(nextYear, { year: true })}.` : undefined}>
          <ChipRow>
            {(
              [
                ['none', 'Doesn’t repeat'],
                ['monthly', 'Every month'],
                ['yearly', 'Every year'],
              ] as [Repeat, string][]
            ).map(([v, label]) => (
              <Chip key={v} role="radio" label={label} icon={v === 'none' ? undefined : 'repeat'} selected={repeat === v} onPress={() => setRepeat(v)} />
            ))}
          </ChipRow>
        </Section>
        <Section title="Remind me">
          <ChipRow>
            {REMIND.map((r) => (
              <Chip key={r.days} role="radio" label={r.label} selected={remind === r.days} onPress={() => setRemind(r.days)} />
            ))}
          </ChipRow>
          <Group>
            <PickerRow icon="bell" label="At" value={timeLabel(at)} onPress={() => setPicker('time')} last />
          </Group>
        </Section>
      </Sheet>
      <DatePickerSheet visible={picker === 'date'} onClose={() => setPicker(null)} initial={date} initialCalendar={cal} onConfirm={(v) => v.date && (setDate(v.date), setCal(v.calendar))} />
      <TimePickerSheet visible={picker === 'time'} onClose={() => setPicker(null)} variant="reminder" value={at} onConfirm={(v) => typeof v === 'number' && setAt(v)} />
      <ConfirmDialog
        visible={confirm}
        title="Delete this event?"
        message={`“${event?.name}” and its reminders will be removed.`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          onClose();
          toast({ kind: 'info', message: 'Event deleted', action: { label: 'Undo', onPress: () => {} } });
        }}
      />
    </>
  );
}

/* =====================  Reminders  ===================== */

const DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function ReminderSheet({ visible, onClose, initialOn = true, permissionGranted = true }: { visible: boolean; onClose: () => void; initialOn?: boolean; permissionGranted?: boolean }) {
  const accent = useAccent();
  const [on, setOn] = useState(initialOn);
  const [granted, setGranted] = useState(permissionGranted);
  const [asking, setAsking] = useState(false);
  const [time, setTime] = useState(21 * 60);
  const [days, setDays] = useState([true, true, true, true, true, true, true]);
  const [before, setBefore] = useState(1);
  const [goalNudges, setGoalNudges] = useState(true);
  const [picking, setPicking] = useState(false);

  const turn = (v: boolean) => (v && !granted ? setAsking(true) : setOn(v));
  const picked = days.filter(Boolean).length;

  return (
    <>
      <Sheet
        visible={visible && !picking && !asking}
        onClose={onClose}
        title="Reminders"
        subtitle={on ? `Daily at ${timeLabel(time)}` : 'Off'}
        footer={<Button label="Done" onPress={onClose} />}
      >
        <Group>
          <OptionRow
            type="switch"
            label="Daily reminder"
            description="A gentle nudge to log your day"
            checked={on}
            onChange={turn}
            icon={<Icon name="bell" size={22} color={on ? accent : colors.textMuted} />}
            last={!on}
          />
          {on && <PickerRow icon="clock" label="Remind me at" value={timeLabel(time)} valueTone="accent" onPress={() => setPicking(true)} last />}
        </Group>

        <Section title="On these days" hint={on ? (picked === 7 ? 'Every day' : `${picked} days a week`) : 'Turn on the daily reminder to choose days.'}>
          <View style={styles.days}>
            {DAYS.map((d, i) => (
              <Pressable
                key={i}
                accessibilityRole="checkbox"
                accessibilityLabel={DAY_NAMES[i]}
                accessibilityState={{ checked: days[i], disabled: !on }}
                disabled={!on}
                onPress={() => setDays((x) => x.map((v, j) => (j === i ? !v : v)))}
                style={styles.dayHit}
              >
                <View style={[styles.day, days[i] && on ? { backgroundColor: accent, borderColor: colors.accentRing } : null, !on && { opacity: 0.45 }]}>
                  <Text style={[styles.dayLabel, days[i] && on && { color: colors.white }]}>{d}</Text>
                </View>
              </Pressable>
            ))}
          </View>
        </Section>

        <Section title="Before events" hint="Applies to new events. You can change it per event.">
          <ChipRow>
            {REMIND.map((r) => (
              <Chip key={r.days} role="radio" label={r.label} selected={before === r.days} onPress={() => setBefore(r.days)} />
            ))}
          </ChipRow>
        </Section>

        <Group>
          <OptionRow type="switch" label="Goal check-ins" description="A mid-week note if a goal is slipping" checked={goalNudges} onChange={setGoalNudges} icon={<Icon name="target" size={22} color={colors.textSoft} />} last />
        </Group>
      </Sheet>
      <TimePickerSheet visible={picking} onClose={() => setPicking(false)} variant="reminder" value={time} onConfirm={(v) => typeof v === 'number' && setTime(v)} />
      <PermissionPrompt
        visible={asking}
        kind="notifications"
        onClose={() => setAsking(false)}
        onAllow={() => {
          setGranted(true);
          setOn(true);
          setAsking(false);
        }}
      />
    </>
  );
}

/* =====================  Badge  ===================== */

export function BadgeSheet({ visible, onClose, badge }: { visible: boolean; onClose: () => void; badge: Badge }) {
  const earned = !!badge.earnedOn;
  const p = badge.progress;
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={badge.name}
      bare
      footer={
        earned ? (
          <FooterRow>
            <Button label="Share" icon="share" variant="secondary" grow />
            <Button label="Done" grow onPress={onClose} />
          </FooterRow>
        ) : (
          <Button label="Got it" onPress={onClose} />
        )
      }
    >
      <View style={styles.badgeHero}>
        <BadgeMedal badge={badge} size={104} />
        <StatusPill tone={earned ? 'earned' : 'locked'} label={earned ? 'Earned' : 'Locked'} style={{ alignSelf: 'center' }} />
        <Text accessibilityRole="header" style={styles.badgeName}>
          {badge.name}
        </Text>
        <Text style={styles.badgeDesc}>{badge.description}</Text>
      </View>

      {earned ? (
        <Group>
          <PickerRow icon="award" iconColor={ui.gold} label="Earned on" value={dateLabel(badge.earnedOn!, { year: true })} />
          <PickerRow icon="flame" iconColor={ui.gold} label="Streak" value={`${p.current} ${p.unit}`} last />
        </Group>
      ) : (
        <>
          <View style={styles.progressCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.progressLabel}>Progress</Text>
              <Text style={styles.progressNum}>
                {p.current} of {p.target} {p.unit}
              </Text>
            </View>
            <ProgressBar value={p.current} max={p.target} label={`${badge.name} progress`} />
          </View>
          <Section title="How to unlock">
            <View style={styles.conditions}>
              {badge.conditions.map((c) => (
                <View key={c.label} style={styles.condition}>
                  <View style={[styles.condMark, c.done ? { backgroundColor: '#E2EDD6', borderColor: '#BED3A8' } : { backgroundColor: ui.lockedSoft, borderColor: '#D9D0C7' }]}>
                    <Icon name={c.done ? 'check' : 'lock'} size={14} color={c.done ? '#355F25' : ui.locked} strokeWidth={2.6} />
                  </View>
                  <Text style={[styles.condText, c.done && { color: colors.textSoft }]}>{c.label}</Text>
                </View>
              ))}
            </View>
          </Section>
        </>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  typeCard: { flexGrow: 1, flexBasis: '40%', minHeight: 64, flexDirection: 'row', alignItems: 'center', gap: 9, padding: 10, paddingRight: 24, borderRadius: radii.md, borderWidth: 1.3, borderColor: ui.lineStrong, backgroundColor: ui.card },
  typeLabel: { ...font('800', 13.5, 18), color: colors.text },
  typeHint: { ...font('500', 11.5, 15), color: colors.textMuted },
  tick: { position: 'absolute', top: 6, right: 6, width: 18, height: 18, borderRadius: 9, alignItems: 'center', justifyContent: 'center' },
  summary: { flexDirection: 'row', alignItems: 'center', gap: 9, padding: 12, borderRadius: radii.md, backgroundColor: ui.accentSoft, borderWidth: 1, borderColor: '#C9D3B0' },
  summaryText: { ...font('800', 14.5, 20), color: ui.accentInk, flex: 1 },

  days: { flexDirection: 'row', justifyContent: 'space-between' },
  dayHit: { width: 46, height: 46, alignItems: 'center', justifyContent: 'center' },
  day: { width: 42, height: 42, borderRadius: 21, borderWidth: 1.3, borderColor: ui.lineStrong, backgroundColor: colors.tabBg, alignItems: 'center', justifyContent: 'center' },
  dayLabel: { ...font('800', 14, 18), color: colors.tabText },

  badgeHero: { alignItems: 'center', gap: 8, paddingTop: 16 },
  badgeName: { ...font('900', 22, 28), color: colors.text, textAlign: 'center', letterSpacing: -0.4 },
  badgeDesc: { ...font('500', 14.5, 21), color: colors.textSoft, textAlign: 'center', maxWidth: 290 },
  progressCard: { padding: 14, gap: 10, borderRadius: radii.lg, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card },
  progressLabel: { ...font('700', 13.5, 18), color: colors.textSoft },
  progressNum: { ...font('800', 14, 18), color: colors.text },
  conditions: { gap: 10 },
  condition: { flexDirection: 'row', alignItems: 'flex-start', gap: 10 },
  condMark: { width: 24, height: 24, borderRadius: 12, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  condText: { ...font('600', 14.5, 21), color: colors.text, flex: 1, paddingTop: 1 },
});
