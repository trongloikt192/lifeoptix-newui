import { useEffect, useRef, useState } from 'react';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { Pressable, ScrollView, StyleSheet, Text, View } from '../primitives';
import { colors, font, kindOrder, kinds, radii, ui } from '../theme/tokens';
import type { EntryKind } from '../theme/tokens';
import { TODAY, addDays, compare, dateLabel, durationLabel, groupDigits, money, parseAmount, rangeLabel, sleepMinutes, timeLabel } from '../data/format';
import type { YMD } from '../data/format';
import { ACTIVITIES, ENTRIES, EXPENSE_CATEGORIES, GOALS, INCOME_SOURCES, MEAL_TYPES, SLEEP_QUALITY } from '../data/models';
import type { Entry } from '../data/models';
import { Button } from '../ui/Button';
import { KindTile, ProgressBar, StatusPill } from '../ui/Cards';
import { Chip, ChipRow, Segmented, Stepper } from '../ui/Controls';
import { TextField } from '../ui/Field';
import { ConfirmDialog, useToast } from '../ui/Feedback';
import { MicControl } from '../ui/Navigation';
import type { MicState } from '../ui/Navigation';
import type { Range } from '../ui/Pickers';
import { FooterRow, Group, PickerRow, Section, Sheet } from '../ui/Sheet';
import { Banner } from '../ui/States';
import { DatePickerSheet, TimePickerSheet } from './PickerSheets';

/* =====================  Add entry  ===================== */

export type AddMode = 'write' | 'speak' | 'type';

const TRANSCRIPT = 'Had phở for breakfast, fifty k. Then gym for forty-five minutes.';

type AddEntrySheetProps = {
  visible: boolean;
  onClose: () => void;
  initialMode?: AddMode;
  initialText?: string;
  initialMic?: MicState;
  autoFocus?: boolean;
};

export function AddEntrySheet({ visible, onClose, initialMode = 'write', initialText = '', initialMic = 'idle', autoFocus }: AddEntrySheetProps) {
  const toast = useToast();
  const [mode, setMode] = useState<AddMode>(initialMode);
  const [text, setText] = useState(initialText);
  const [mic, setMic] = useState<MicState>(initialMic);
  const [secs, setSecs] = useState(initialMic === 'recording' ? 8 : 0);
  const [busy, setBusy] = useState(false);
  const [date, setDate] = useState<YMD>(TODAY);
  const [time, setTime] = useState(10 * 60 + 42);
  const [picker, setPicker] = useState<'date' | 'time' | null>(null);
  const [newKind, setNewKind] = useState<EntryKind | null>(null);
  const timer = useRef(0);

  useEffect(() => {
    if (mic !== 'recording') return;
    const id = window.setInterval(() => setSecs((s) => s + 1), 1000);
    return () => window.clearInterval(id);
  }, [mic]);
  useEffect(() => () => window.clearTimeout(timer.current), []);

  const words = TRANSCRIPT.split(' ');
  const live = words.slice(0, Math.min(words.length, Math.round(secs * 1.1))).join(' ');

  const toggleMic = () => {
    if (mic === 'idle' || mic === 'error') {
      setSecs(0);
      setMic('recording');
    } else if (mic === 'recording') {
      setMic('processing');
      timer.current = window.setTimeout(() => {
        setMic('idle');
        setText(TRANSCRIPT);
        setMode('write');
      }, 1600);
    }
  };

  const organize = () => {
    setBusy(true);
    timer.current = window.setTimeout(() => {
      setBusy(false);
      onClose();
      toast({ kind: 'success', message: 'Added 2 entries: Phở bò, Gym 45 min', action: { label: 'View', onPress: () => {} } });
    }, 1400);
  };

  const footer =
    mode === 'write' ? (
      <Button label={busy ? 'Organizing…' : 'Organize my notes'} icon="sparkles" loading={busy} disabled={!text.trim()} onPress={organize} />
    ) : undefined;

  return (
    <>
      <Sheet
        visible={visible && !newKind}
        onClose={onClose}
        title="Add to today"
        dismissOnBackdrop={!text}
        footer={footer}
      >
        <View style={styles.metaRow}>
          <MetaPill icon="calendar" label={dateLabel(date, { relative: true })} onPress={() => setPicker('date')} a11y="Change date" />
          <MetaPill icon="clock" label={timeLabel(time)} onPress={() => setPicker('time')} a11y="Change time" />
        </View>
        <Segmented
          label="How do you want to add it"
          value={mode}
          onChange={setMode}
          options={[
            { value: 'write', label: 'Write', icon: 'pen' },
            { value: 'speak', label: 'Speak', icon: 'mic' },
            { value: 'type', label: 'Pick type', icon: 'grid' },
          ]}
        />

        {mode === 'write' && (
          <>
            <TextField
              value={text}
              onChangeText={setText}
              multiline
              rows={4}
              maxLength={500}
              autoFocus={autoFocus}
              placeholder="A meal, a walk, a little win…"
              a11yLabel="What happened"
              helper="We’ll sort it into meals, money, moves and sleep."
            />
            {!autoFocus && (
              <Section title="Try one">
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
                  {['Pho 50k, gym 45 min', 'Slept 11pm – 6:30', 'Got paid 3.5M'].map((t) => (
                    <Chip key={t} label={t} icon="sparkles" selected={false} onPress={() => setText(t)} />
                  ))}
                </ScrollView>
              </Section>
            )}
          </>
        )}

        {mode === 'speak' && (
          <View style={{ gap: 14 }}>
            <MicControl state={mic} seconds={secs} onPress={toggleMic} onRetry={toggleMic} />
            {(mic === 'recording' || mic === 'processing') && (
              <View style={styles.transcript} accessibilityLiveRegion="polite">
                <Text style={styles.transcriptLabel}>Hearing</Text>
                <Text style={styles.transcriptText}>{mic === 'processing' ? TRANSCRIPT : live || '…'}</Text>
              </View>
            )}
          </View>
        )}

        {mode === 'type' && (
          <View style={styles.typeGrid} accessibilityRole="list">
            {kindOrder.map((k) => (
              <Pressable key={k} onPress={() => setNewKind(k)} style={({ pressed }) => [styles.typeTile, { borderColor: kinds[k].border }, pressed && { backgroundColor: kinds[k].bg }]}>
                <KindTile kind={k} size={42} />
                <Text style={styles.typeLabel}>{kinds[k].label}</Text>
                <Text style={styles.typeHint}>{TYPE_HINT[k]}</Text>
              </Pressable>
            ))}
            <Pressable onPress={() => setMode('write')} style={({ pressed }) => [styles.typeTile, { borderStyle: 'dashed' }, pressed && { backgroundColor: '#F7EEE1' }]}>
              <View style={[styles.noteTile]}>
                <Icon name="note" size={23} color={colors.textSoft} />
              </View>
              <Text style={styles.typeLabel}>Not sure</Text>
              <Text style={styles.typeHint}>Just write it</Text>
            </Pressable>
          </View>
        )}

        {mode !== 'type' && (
          <View style={styles.hint}>
            <Icon name="calendarMove" size={19} color={colors.leaf} />
            <Text style={styles.hintText}>Logging yesterday? Just mention it — “yesterday I had bún chả 65k”.</Text>
          </View>
        )}
      </Sheet>

      <DatePickerSheet visible={picker === 'date'} onClose={() => setPicker(null)} initial={date} allowLunar={false} onConfirm={(v) => v.date && setDate(v.date)} />
      <TimePickerSheet visible={picker === 'time'} onClose={() => setPicker(null)} variant="entry" value={time} onConfirm={(v) => typeof v === 'number' && setTime(v)} />
      {newKind && <EditEntrySheet visible kind={newKind} onClose={() => setNewKind(null)} onSaved={onClose} onBack={() => setNewKind(null)} />}
    </>
  );
}

const TYPE_HINT: Record<EntryKind, string> = {
  meal: 'What you ate',
  expense: 'Money out',
  income: 'Money in',
  activity: 'Workouts, walks',
  sleep: 'Bed & wake time',
};

function MetaPill({ icon, label, onPress, a11y }: { icon: IconName; label: string; onPress: () => void; a11y: string }) {
  return (
    <Pressable onPress={onPress} accessibilityLabel={`${a11y}: ${label}`} style={styles.metaHit}>
      {({ pressed }) => (
        <View style={[styles.metaPill, pressed && { opacity: 0.7 }]}>
          <Icon name={icon} size={17} color={colors.chipText} />
          <Text style={styles.metaLabel}>{label}</Text>
          <Icon name="chevronDown" size={15} color={colors.chipText} strokeWidth={2.4} />
        </View>
      )}
    </Pressable>
  );
}

/* =====================  Edit entry  ===================== */

const DEFAULTS: Record<EntryKind, Entry> = {
  meal: { id: 'new', kind: 'meal', date: TODAY, time: 12 * 60, title: '', mealType: 'Lunch' },
  expense: { id: 'new', kind: 'expense', date: TODAY, time: 10 * 60 + 42, title: '', category: 'Food' },
  income: { id: 'new', kind: 'income', date: TODAY, time: 10 * 60 + 42, title: '', category: 'Salary' },
  activity: { id: 'new', kind: 'activity', date: TODAY, time: 10 * 60 + 42, title: 'Gym', category: 'Gym', minutes: 30 },
  sleep: { id: 'new', kind: 'sleep', date: TODAY, time: 6 * 60 + 30, title: 'Sleep', bedtime: 23 * 60, wake: 6 * 60 + 30, quality: 3 },
};

type EditEntrySheetProps = {
  visible: boolean;
  onClose: () => void;
  kind: EntryKind;
  /** Present = editing; absent = new entry of `kind`. */
  entry?: Entry;
  onSaved?: () => void;
  /** Shown as a back arrow when this sheet is a step of another. */
  onBack?: () => void;
  /** Focus the main field (keyboard-open mockups). */
  autoFocus?: boolean;
  /** Pre-filled draft text for the amount (keyboard mockups). */
  draftAmount?: string;
};

export function EditEntrySheet({ visible, onClose, kind, entry, onSaved, onBack, autoFocus, draftAmount }: EditEntrySheetProps) {
  const toast = useToast();
  const base = entry ?? DEFAULTS[kind];
  const [d, setD] = useState<Entry>(base);
  const [amount, setAmount] = useState(draftAmount ?? (base.amount ? groupDigits(String(base.amount)) : ''));
  const [distance, setDistance] = useState(base.distanceKm ? String(base.distanceKm) : '');
  const [tried, setTried] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [picker, setPicker] = useState<'date' | 'time' | 'sleep' | null>(null);

  const set = (p: Partial<Entry>) => setD((x) => ({ ...x, ...p }));
  const amountNum = parseAmount(amount);
  const dirty = JSON.stringify({ ...d, amount: amountNum || undefined, distanceKm: Number(distance) || undefined }) !== JSON.stringify({ ...base, amount: base.amount, distanceKm: base.distanceKm });
  const k = kinds[kind];
  const needsAmount = kind === 'expense' || kind === 'income';
  const titleError = tried && kind === 'meal' && !d.title.trim() ? 'Add what you ate' : undefined;
  const amountError = tried && needsAmount && !amountNum ? 'Enter an amount' : undefined;

  const requestClose = () => (dirty ? setConfirm(true) : onClose());
  const save = () => {
    setTried(true);
    if ((kind === 'meal' && !d.title.trim()) || (needsAmount && !amountNum)) return;
    onClose();
    onSaved?.();
    toast({ kind: 'success', message: entry ? `${k.label} updated` : `${k.label} saved to ${dateLabel(d.date, { relative: true }).toLowerCase()}` });
  };

  const whenRows = (
    <Group>
      <PickerRow icon="calendar" label="Date" value={dateLabel(d.date, { relative: true })} onPress={() => setPicker('date')} />
      <PickerRow icon="clock" label="Time" value={timeLabel(d.time)} onPress={() => setPicker('time')} last />
    </Group>
  );
  const note = <TextField label="Note" optional value={d.note ?? ''} onChangeText={(t) => set({ note: t })} multiline rows={2} placeholder="Anything else to remember?" />;

  return (
    <>
      <Sheet
        visible={visible && !picker}
        onClose={requestClose}
        dismissOnBackdrop={!dirty}
        title={`${entry ? 'Edit' : 'New'} ${k.label.toLowerCase()}`}
        subtitle={entry ? `${dateLabel(entry.date, { relative: true })} · ${timeLabel(entry.time)}` : undefined}
        leading={onBack ? <BackButton onPress={onBack} /> : <View style={{ paddingTop: 4, paddingLeft: 4 }}><KindTile kind={kind} size={38} /></View>}
        footer={
          <FooterRow>
            <Button label="Cancel" variant="secondary" grow onPress={requestClose} />
            <Button label={entry ? 'Save changes' : 'Save'} grow disabled={!!entry && !dirty} onPress={save} />
          </FooterRow>
        }
      >
        {kind === 'meal' && (
          <>
            <TextField label="What did you eat?" value={d.title} onChangeText={(t) => set({ title: t })} placeholder="e.g. Phở bò" error={titleError} autoFocus={autoFocus} />
            <Section title="Meal">
              <ChipRow>
                {MEAL_TYPES.map((m) => (
                  <Chip key={m} role="radio" label={m} selected={d.mealType === m} onPress={() => set({ mealType: m })} />
                ))}
              </ChipRow>
            </Section>
            <TextField label="Cost" optional value={amount} onChangeText={(t) => setAmount(groupDigits(t))} keyboardType="numeric" suffix="₫" placeholder="0" helper="Also adds an expense under Food." />
            {whenRows}
            {note}
          </>
        )}

        {needsAmount && (
          <>
            <TextField label="Amount" value={amount} onChangeText={(t) => setAmount(groupDigits(t))} keyboardType="numeric" suffix="₫" placeholder="0" large error={amountError} autoFocus={autoFocus} />
            <Section title={kind === 'expense' ? 'Category' : 'Source'}>
              <ChipRow>
                {(kind === 'expense' ? EXPENSE_CATEGORIES : INCOME_SOURCES).map((c) => (
                  <Chip key={c} role="radio" label={c} selected={d.category === c} onPress={() => set({ category: c })} tone={d.category === c ? k : undefined} />
                ))}
              </ChipRow>
            </Section>
            <TextField label={kind === 'expense' ? 'What for?' : 'From'} optional value={d.title} onChangeText={(t) => set({ title: t })} placeholder={kind === 'expense' ? 'e.g. Grab to office' : 'e.g. Logo project'} />
            {whenRows}
          </>
        )}

        {kind === 'activity' && (
          <>
            <Section title="Activity">
              <ChipRow>
                {ACTIVITIES.map((a) => (
                  <Chip key={a} role="radio" label={a} selected={d.category === a} onPress={() => set({ category: a, title: a })} tone={d.category === a ? k : undefined} />
                ))}
              </ChipRow>
            </Section>
            <Section title="Duration">
              <Stepper label="duration" value={d.minutes ?? 0} step={5} min={5} max={600} unit="min" onChange={(m) => set({ minutes: m })} />
            </Section>
            {['Walk', 'Run', 'Cycling', 'Swim'].includes(d.category ?? '') && (
              <TextField label="Distance" optional value={distance} onChangeText={setDistance} keyboardType="decimal-pad" suffix="km" placeholder="0.0" />
            )}
            {whenRows}
          </>
        )}

        {kind === 'sleep' && (
          <>
            <Group>
              <PickerRow icon="moon" label="Went to bed" value={timeLabel(d.bedtime ?? 0)} onPress={() => setPicker('sleep')} />
              <PickerRow icon="sun" label="Woke up" value={timeLabel(d.wake ?? 0)} onPress={() => setPicker('sleep')} last />
            </Group>
            <View style={styles.sleepSum}>
              <Text style={styles.sleepSumText}>{durationLabel(sleepMinutes(d.bedtime ?? 0, d.wake ?? 0))} of sleep</Text>
              {sleepMinutes(d.bedtime ?? 0, d.wake ?? 0) >= 420 ? <StatusPill tone="healthy" label="Healthy" /> : <StatusPill tone="warn" icon="alert" label="Under 7 h" />}
            </View>
            <Section title="How did you sleep?">
              <View style={styles.quality} accessibilityRole="radiogroup">
                {SLEEP_QUALITY.map((q, i) => {
                  const on = d.quality === i + 1;
                  return (
                    <Pressable key={q} accessibilityRole="radio" accessibilityState={{ checked: on }} onPress={() => set({ quality: i + 1 })} style={[styles.qItem, on && { backgroundColor: k.bg, borderColor: k.fg, borderWidth: 1.6 }]}>
                      <Text style={[styles.qNum, on && { color: k.fg }]}>{i + 1}</Text>
                      <Text style={[styles.qLabel, on && { color: k.fg, fontWeight: '800' }]}>{q}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </Section>
            <PickerRowGroupDate date={d.date} onPress={() => setPicker('date')} />
            {note}
          </>
        )}
      </Sheet>

      <ConfirmDialog
        visible={confirm}
        icon="alert"
        tone="danger"
        title="Discard changes?"
        message={`Your edits to this ${k.label.toLowerCase()} won’t be saved.`}
        cancelLabel="Keep editing"
        confirmLabel="Discard"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          onClose();
        }}
      />
      <DatePickerSheet visible={picker === 'date'} onClose={() => setPicker(null)} initial={d.date} allowLunar={false} onConfirm={(v) => v.date && set({ date: v.date })} />
      <TimePickerSheet visible={picker === 'time'} onClose={() => setPicker(null)} variant="entry" value={d.time} onConfirm={(v) => typeof v === 'number' && set({ time: v })} />
      <TimePickerSheet
        visible={picker === 'sleep'}
        onClose={() => setPicker(null)}
        variant="sleep"
        sleep={{ bed: d.bedtime ?? 0, wake: d.wake ?? 0 }}
        onConfirm={(v) => typeof v !== 'number' && set({ bedtime: v.bed, wake: v.wake })}
      />
    </>
  );
}

function PickerRowGroupDate({ date, onPress }: { date: YMD; onPress: () => void }) {
  return (
    <Group>
      <PickerRow icon="calendar" label="Night of" value={dateLabel(addDays(date, -1))} onPress={onPress} last />
    </Group>
  );
}

function BackButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable accessibilityLabel="Back" onPress={onPress} style={styles.back}>
      <Icon name="arrowLeft" size={22} color={colors.closeIcon} />
    </Pressable>
  );
}

/* =====================  Entry detail  ===================== */

type EntryDetailSheetProps = { visible: boolean; onClose: () => void; entry: Entry };

function metricsFor(e: Entry): { label: string; value: string; icon: IconName }[] {
  switch (e.kind) {
    case 'meal':
      return [
        { label: 'Meal', value: e.mealType ?? '—', icon: 'meal' },
        { label: 'Cost', value: e.amount ? money(e.amount) : '—', icon: 'expense' },
      ];
    case 'expense':
    case 'income':
      return [
        { label: 'Amount', value: money(e.amount ?? 0), icon: e.kind },
        { label: e.kind === 'expense' ? 'Category' : 'Source', value: e.category ?? '—', icon: 'tag' },
      ];
    case 'activity':
      return [
        { label: 'Duration', value: durationLabel(e.minutes ?? 0), icon: 'clock' },
        { label: 'Distance', value: e.distanceKm ? `${e.distanceKm} km` : '—', icon: 'activity' },
      ];
    case 'sleep':
      return [
        { label: 'Slept', value: durationLabel(sleepMinutes(e.bedtime ?? 0, e.wake ?? 0)), icon: 'sleep' },
        { label: 'Quality', value: SLEEP_QUALITY[(e.quality ?? 3) - 1], icon: 'heart' },
        { label: 'Bedtime', value: timeLabel(e.bedtime ?? 0), icon: 'moon' },
        { label: 'Woke up', value: timeLabel(e.wake ?? 0), icon: 'sun' },
      ];
  }
}

export function EntryDetailSheet({ visible, onClose, entry }: EntryDetailSheetProps) {
  const toast = useToast();
  const [confirm, setConfirm] = useState(false);
  const [editing, setEditing] = useState(false);
  const k = kinds[entry.kind];
  const goal = entry.kind === 'activity' ? GOALS.progress : entry.kind === 'meal' ? GOALS.achieved : entry.kind === 'expense' ? GOALS.over : null;

  return (
    <>
      <Sheet
        visible={visible && !editing}
        onClose={onClose}
        title={entry.title}
        subtitle={`${k.label} · ${dateLabel(entry.date, { relative: true })}, ${timeLabel(entry.time)}`}
        leading={
          <View style={{ paddingTop: 4, paddingLeft: 4 }}>
            <KindTile kind={entry.kind} size={42} />
          </View>
        }
        footer={
          <FooterRow>
            <Button label="Delete" icon="trash" variant="dangerGhost" onPress={() => setConfirm(true)} />
            <Button label="Edit" icon="edit" grow onPress={() => setEditing(true)} />
          </FooterRow>
        }
      >
        <View style={styles.metrics}>
          {metricsFor(entry).map((m) => (
            <View key={m.label} style={styles.metric}>
              <View style={styles.metricHead}>
                <Icon name={m.icon} size={16} color={k.fg} />
                <Text style={styles.metricLabel}>{m.label}</Text>
              </View>
              <Text numberOfLines={1} style={styles.metricValue}>
                {m.value}
              </Text>
            </View>
          ))}
        </View>

        {entry.source && (
          <Section title="You wrote">
            <View style={styles.quote}>
              <Text style={styles.quoteText}>“{entry.source}”</Text>
              <View style={styles.quoteFoot}>
                <Icon name="sparkles" size={14} color={colors.textMuted} />
                <Text style={styles.quoteMeta}>Organized from your note · {timeLabel(entry.time + 3)}</Text>
              </View>
            </View>
          </Section>
        )}

        {goal && (
          <Section title="Counts toward">
            <View style={styles.goalRow}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 8 }}>
                <Text style={styles.goalTitle}>{goal.title}</Text>
                <Text style={styles.goalNum}>
                  {goal.type === 'spend' ? `${Math.round((goal.current / goal.target) * 100)}%` : `${goal.current}/${goal.target}`}
                </Text>
              </View>
              <ProgressBar value={goal.current} max={goal.target} label={goal.title} tone={goal.current > goal.target && goal.type === 'spend' ? 'over' : 'accent'} />
            </View>
          </Section>
        )}
      </Sheet>

      <ConfirmDialog
        visible={confirm}
        title="Delete this entry?"
        message={`“${entry.title}” will be removed from ${dateLabel(entry.date, { relative: true }).toLowerCase()} and from your goals.`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(false)}
        onConfirm={() => {
          setConfirm(false);
          onClose();
          toast({ kind: 'info', message: 'Entry deleted', action: { label: 'Undo', onPress: () => toast({ kind: 'success', message: 'Entry restored' }) } });
        }}
      />
      {editing && <EditEntrySheet visible kind={entry.kind} entry={entry} onClose={() => setEditing(false)} />}
    </>
  );
}

/* =====================  Filter  ===================== */

export type DatePreset = 'any' | 'today' | '7d' | '30d' | 'custom';
export type Filters = { kinds: EntryKind[]; preset: DatePreset; range?: Required<Range> };

const PRESETS: { value: DatePreset; label: string }[] = [
  { value: 'any', label: 'Any time' },
  { value: 'today', label: 'Today' },
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom…' },
];

export function matchFilters(f: Filters, list = ENTRIES) {
  const from =
    f.preset === 'today' ? TODAY : f.preset === '7d' ? addDays(TODAY, -6) : f.preset === '30d' ? addDays(TODAY, -29) : f.preset === 'custom' ? f.range?.start : undefined;
  const to = f.preset === 'custom' ? f.range?.end : TODAY;
  return list.filter((e) => (!f.kinds.length || f.kinds.includes(e.kind)) && (!from || (compare(e.date, from) >= 0 && (!to || compare(e.date, to) <= 0))));
}

export function FilterSheet({ visible, onClose, initial = { kinds: [], preset: 'any' } }: { visible: boolean; onClose: () => void; initial?: Filters }) {
  const [f, setF] = useState<Filters>(initial);
  const [picking, setPicking] = useState(false);
  const n = matchFilters(f).length;
  const active = f.kinds.length + (f.preset !== 'any' ? 1 : 0);
  const toggle = (k: EntryKind) => setF((x) => ({ ...x, kinds: x.kinds.includes(k) ? x.kinds.filter((y) => y !== k) : [...x.kinds, k] }));

  return (
    <>
      <Sheet
        visible={visible && !picking}
        onClose={onClose}
        title="Filter entries"
        subtitle={active ? `${active} filter${active > 1 ? 's' : ''} on` : 'Showing everything'}
        footer={
          <FooterRow>
            <Button label="Clear all" variant="secondary" disabled={!active} onPress={() => setF({ kinds: [], preset: 'any' })} />
            <Button label={n ? `Show ${n} ${n === 1 ? 'entry' : 'entries'}` : 'No entries match'} grow disabled={!n} onPress={onClose} />
          </FooterRow>
        }
      >
        <Section title="Entry type" hint={f.kinds.length ? undefined : 'Nothing picked = all types.'}>
          <ChipRow>
            {kindOrder.map((k) => (
              <Chip key={k} label={kinds[k].label} icon={k} tone={kinds[k]} selected={f.kinds.includes(k)} onPress={() => toggle(k)} count={ENTRIES.filter((e) => e.kind === k).length} />
            ))}
          </ChipRow>
        </Section>
        <Section title="Date">
          <ChipRow>
            {PRESETS.map((p) => (
              <Chip
                key={p.value}
                role="radio"
                label={p.label}
                selected={f.preset === p.value}
                onPress={() => (p.value === 'custom' ? setPicking(true) : setF((x) => ({ ...x, preset: p.value })))}
              />
            ))}
          </ChipRow>
          {f.preset === 'custom' && f.range && (
            <Group>
              <PickerRow icon="calendar" label="Range" value={`${rangeLabel(f.range.start, f.range.end)}`} valueTone="accent" onPress={() => setPicking(true)} last />
            </Group>
          )}
        </Section>
        {n === 0 && <Banner tone="warn" icon="search" title="Nothing matches these filters" message="Try another type or a wider date range." />}
      </Sheet>
      <DatePickerSheet
        visible={picking}
        mode="range"
        allowLunar={false}
        initialRange={f.range}
        onClose={() => setPicking(false)}
        onConfirm={(v) => v.range && setF((x) => ({ ...x, preset: 'custom', range: v.range }))}
      />
    </>
  );
}

const styles = StyleSheet.create({
  metaRow: { flexDirection: 'row', gap: 8, marginTop: -6, marginBottom: -8 },
  metaHit: { height: 44, justifyContent: 'center' },
  metaPill: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 34, paddingLeft: 11, paddingRight: 9, borderRadius: radii.pill, borderWidth: 1.3, borderColor: colors.chipBorder, backgroundColor: colors.chipBg },
  metaLabel: { ...font('700', 13.5, 18), color: colors.chipText },

  transcript: { padding: 14, borderRadius: radii.md, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card, gap: 4 },
  transcriptLabel: { ...font('800', 11.5, 15), color: colors.textMuted, letterSpacing: 0.8, textTransform: 'uppercase' },
  transcriptText: { ...font('600', 15.5, 22), color: colors.text },

  typeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  typeTile: { flexGrow: 1, flexBasis: '40%', minHeight: 112, padding: 13, gap: 3, borderRadius: radii.lg, borderWidth: 1.4, backgroundColor: ui.card, borderColor: ui.lineStrong },
  noteTile: { width: 42, height: 42, borderRadius: 12, borderWidth: 1, borderColor: ui.line, backgroundColor: colors.tabBg, alignItems: 'center', justifyContent: 'center' },
  typeLabel: { ...font('800', 15, 20), color: colors.text, marginTop: 6 },
  typeHint: { ...font('500', 12.5, 16), color: colors.textMuted },

  hint: { flexDirection: 'row', gap: 10, alignItems: 'flex-start' },
  hintText: { ...font('500', 13, 18), color: colors.textHint, flex: 1 },

  back: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', marginTop: 2 },

  sleepSum: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 4, marginTop: -10 },
  sleepSumText: { ...font('800', 15, 20), color: colors.text },
  quality: { flexDirection: 'row', gap: 6 },
  qItem: { flex: 1, flexBasis: 0, height: 62, borderRadius: 12, borderWidth: 1.2, borderColor: ui.lineStrong, backgroundColor: colors.tabBg, alignItems: 'center', justifyContent: 'center', gap: 1 },
  qNum: { ...font('900', 17, 20), color: colors.text },
  qLabel: { ...font('600', 11, 14), color: colors.textSoft },

  metrics: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metric: { flexGrow: 1, flexBasis: '40%', padding: 13, gap: 4, borderRadius: radii.lg, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card },
  metricHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metricLabel: { ...font('700', 12.5, 16), color: colors.textSoft },
  metricValue: { ...font('900', 19, 25), color: colors.text, letterSpacing: -0.3 },

  quote: { padding: 14, borderRadius: radii.md, backgroundColor: '#F6EEE2', borderWidth: 1, borderColor: ui.line, gap: 8 },
  quoteText: { ...font('600', 15, 22), color: colors.text, fontStyle: 'italic' },
  quoteFoot: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  quoteMeta: { ...font('500', 12, 16), color: colors.textMuted },

  goalRow: { padding: 13, gap: 9, borderRadius: radii.md, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card },
  goalTitle: { ...font('700', 14.5, 19), color: colors.text },
  goalNum: { ...font('800', 14, 19), color: colors.textSoft },
});
