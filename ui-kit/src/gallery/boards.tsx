/** One phone-sized board per shared component, every variant labelled. */
import { useState } from 'react';
import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, Text, View, useSafeAreaInsets } from '../primitives';
import { colors, font, kindOrder, kinds, radii, ui } from '../theme/tokens';
import { BADGES, ENTRIES, EVENTS, GOALS, entryById } from '../data/models';
import { Button, IconButton } from '../ui/Button';
import { BadgeMedal, EntryCard, EventCard, GoalCard, MetricCard, half, ProgressBar, StatusPill } from '../ui/Cards';
import { Chip, ChipRow, OptionRow, Segmented, Switch } from '../ui/Controls';
import { SearchBar, TextField } from '../ui/Field';
import { AddButton, AppBar, MicControl } from '../ui/Navigation';
import type { MicState } from '../ui/Navigation';
import { Group } from '../ui/Sheet';
import { Decor } from '../ui/Decor';
import { BottomNav } from '../../reference/src/components/BottomNav';
import type { TabKey as RefTab } from '../../reference/src/components/BottomNav';
import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
import { GOALS_DECOR } from '../../reference/src/decor/goalsDecor';
import { EVENTS_DECOR } from '../../reference/src/decor/eventsDecor';

export function Board({ title, children }: { title: string; children: ReactNode }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.board, { paddingTop: insets.top }]}>
      <Decor asset={GOALS_DECOR.leavesTopLeft} style={{ left: 0, top: 0 }} />
      <Decor asset={EVENTS_DECOR.flowersTopRight} style={{ right: 0, top: -64 }} />
      <AppBar title={title} subtitle="Component" onBack={() => {}} />
      <ScrollView style={{ flex: 1 }} contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 24 }]}>
        {children}
      </ScrollView>
    </View>
  );
}

export function Spec({ label, children, note }: { label: string; note?: string; children: ReactNode }) {
  return (
    <View style={styles.spec}>
      <View style={styles.specHead}>
        <Text style={styles.specLabel}>{label}</Text>
        {note && <Text style={styles.specNote}>{note}</Text>}
      </View>
      {children}
    </View>
  );
}

/* ---------- boards ---------- */

export function ButtonsBoard() {
  return (
    <Board title="Button">
      <Spec label="Primary" note="one per screen">
        <Button label="Save entry" />
        <View style={styles.row}>
          <Button label="Saving…" loading grow />
          <Button label="Save" disabled grow />
        </View>
      </Spec>
      <Spec label="Secondary">
        <View style={styles.row}>
          <Button label="Cancel" variant="secondary" grow />
          <Button label="Share" icon="share" variant="secondary" grow />
        </View>
        <Button label="See an example" variant="ghost" />
      </Spec>
      <Spec label="Icon only" note="44 × 44 target">
        <View style={styles.row}>
          <IconButton icon="close" label="Close" />
          <IconButton icon="filter" label="Filter" />
          <IconButton icon="filter" label="Filter on" selected />
          <IconButton icon="more" label="More" variant="plain" />
          <IconButton icon="trash" label="Delete" variant="danger" />
          <AddButton />
        </View>
      </Spec>
      <Spec label="Delete" note="destructive">
        <Button label="Delete entry" icon="trash" variant="danger" />
        <View style={styles.row}>
          <Button label="Delete" icon="trash" variant="dangerGhost" />
          <Button label="Edit" icon="edit" grow />
        </View>
      </Spec>
      <Spec label="Small">
        <View style={styles.row}>
          <Button label="Retry" icon="refresh" size="sm" variant="secondary" />
          <Button label="Allow" size="sm" />
        </View>
      </Spec>
    </Board>
  );
}

export function FieldsBoard() {
  const [a, setA] = useState('');
  const [b, setB] = useState('Phở bò');
  const [c, setC] = useState('Bún ch');
  const [d, setD] = useState('');
  const [e, setE] = useState('Walked to the market, bought vegetables 85k. Felt good.');
  return (
    <Board title="Text field">
      <Spec label="Empty">
        <TextField label="What did you eat?" value={a} onChangeText={setA} placeholder="e.g. Phở bò" />
      </Spec>
      <Spec label="Filled">
        <TextField label="What did you eat?" value={b} onChangeText={setB} />
      </Spec>
      <Spec label="Typing" note="focus ring">
        <TextField label="What did you eat?" value={c} onChangeText={setC} showFocus />
      </Spec>
      <Spec label="Error">
        <TextField label="Amount" value={d} onChangeText={setD} suffix="₫" placeholder="0" large error="Enter an amount" keyboardType="numeric" />
      </Spec>
      <Spec label="Text area" note="with counter">
        <TextField label="Note" value={e} onChangeText={setE} multiline rows={3} maxLength={500} />
      </Spec>
    </Board>
  );
}

export function SearchBoard() {
  const [a, setA] = useState('');
  const [b, setB] = useState('phở');
  const [c, setC] = useState('bún chả');
  return (
    <Board title="Search bar">
      <Spec label="Not typed">
        <SearchBar value={a} onChangeText={setA} />
      </Spec>
      <Spec label="Searching" note="spinner + Cancel">
        <SearchBar value={b} onChangeText={setB} searching showFocus onCancel={() => setB('')} />
      </Spec>
      <Spec label="With clear button">
        <SearchBar value={c} onChangeText={setC} />
      </Spec>
    </Board>
  );
}

export function ChipsBoard() {
  const [sel, setSel] = useState<string[]>(['meal', 'expense']);
  const [one, setOne] = useState('7d');
  return (
    <Board title="Filter chip">
      <Spec label="Selected · unselected">
        <ChipRow>
          <Chip label="Selected" selected />
          <Chip label="Unselected" selected={false} />
          <Chip label="Disabled" selected={false} disabled />
        </ChipRow>
      </Spec>
      <Spec label="Entry types" note="multi-select, tinted">
        <ChipRow>
          {kindOrder.map((k) => (
            <Chip
              key={k}
              label={kinds[k].label}
              icon={k}
              tone={kinds[k]}
              count={ENTRIES.filter((e) => e.kind === k).length}
              selected={sel.includes(k)}
              onPress={() => setSel((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))}
            />
          ))}
        </ChipRow>
      </Spec>
      <Spec label="Single choice" note="radio">
        <ChipRow>
          {[
            ['today', 'Today'],
            ['7d', 'Last 7 days'],
            ['30d', 'Last 30 days'],
          ].map(([v, l]) => (
            <Chip key={v} role="radio" label={l} selected={one === v} onPress={() => setOne(v)} />
          ))}
        </ChipRow>
      </Spec>
    </Board>
  );
}

export function SegmentedBoard() {
  const [p, setP] = useState<'week' | 'month'>('week');
  const [c, setC] = useState<'lunar' | 'solar'>('lunar');
  const [m, setM] = useState<'write' | 'speak' | 'type'>('write');
  return (
    <Board title="Segmented control">
      <Spec label="Week / Month">
        <Segmented label="Period" value={p} onChange={setP} options={[{ value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
      </Spec>
      <Spec label="Lunar / Solar">
        <Segmented
          label="Calendar"
          value={c}
          onChange={setC}
          options={[
            { value: 'solar', label: 'Solar', icon: 'sun' },
            { value: 'lunar', label: 'Lunar', icon: 'moon' },
          ]}
        />
      </Spec>
      <Spec label="Three options">
        <Segmented
          label="Input"
          value={m}
          onChange={setM}
          options={[
            { value: 'write', label: 'Write', icon: 'pen' },
            { value: 'speak', label: 'Speak', icon: 'mic' },
            { value: 'type', label: 'Pick type', icon: 'grid' },
          ]}
        />
      </Spec>
    </Board>
  );
}

export function TogglesBoard() {
  const [s1, setS1] = useState(true);
  const [s2, setS2] = useState(false);
  const [c1, setC1] = useState(true);
  const [c2, setC2] = useState(false);
  const [r, setR] = useState('vi');
  return (
    <Board title="Switch · Checkbox · Radio">
      <Spec label="Switch" note="on · off · disabled">
        <View style={styles.row}>
          <Switch value={s1} onValueChange={setS1} label="On" />
          <Switch value={s2} onValueChange={setS2} label="Off" />
          <Switch value={false} onValueChange={() => {}} label="Disabled" disabled />
          <Switch value onValueChange={() => {}} label="Disabled on" disabled />
        </View>
        <Group>
          <OptionRow type="switch" label="Daily reminder" description="9:00 PM every day" checked={s1} onChange={setS1} last />
        </Group>
      </Spec>
      <Spec label="Checkbox" note="checked · unchecked">
        <Group>
          <OptionRow type="checkbox" label="Food" checked={c1} onChange={setC1} />
          <OptionRow type="checkbox" label="Transport" checked={c2} onChange={setC2} />
          <OptionRow type="checkbox" label="Bills" description="Disabled" checked={false} onChange={() => {}} disabled last />
        </Group>
      </Spec>
      <Spec label="Radio" note="one of many">
        <Group>
          <OptionRow type="radio" label="Tiếng Việt" checked={r === 'vi'} onChange={() => setR('vi')} />
          <OptionRow type="radio" label="English" checked={r === 'en'} onChange={() => setR('en')} last />
        </Group>
      </Spec>
    </Board>
  );
}

export function EntryCardsBoard() {
  const by = (k: string) => ENTRIES.find((e) => e.kind === k)!;
  return (
    <Board title="Entry card">
      {(['income', 'expense', 'meal', 'activity', 'sleep'] as const).map((k) => (
        <Spec key={k} label={kinds[k].label}>
          <EntryCard entry={k === 'activity' ? entryById('e7') : by(k)} onMore={() => {}} />
        </Spec>
      ))}
      <Spec label="List rows" note="inside a group">
        <Group>
          <View style={{ paddingRight: 4 }}>
            {[entryById('e1'), entryById('e4'), entryById('e2')].map((e, i, a) => (
              <EntryCard key={e.id} entry={e} variant="row" last={i === a.length - 1} />
            ))}
          </View>
        </Group>
      </Spec>
    </Board>
  );
}

export function GoalCardsBoard() {
  return (
    <Board title="Goal card · Progress">
      <Spec label="Not started">
        <GoalCard goal={GOALS.notStarted} onMore={() => {}} />
      </Spec>
      <Spec label="In progress">
        <GoalCard goal={GOALS.progress} onMore={() => {}} />
      </Spec>
      <Spec label="Achieved">
        <GoalCard goal={GOALS.achieved} onMore={() => {}} />
      </Spec>
      <Spec label="Over the limit">
        <GoalCard goal={GOALS.over} onMore={() => {}} />
      </Spec>
      <Spec label="Progress bar" note="0 · 40 · 100 · over">
        <View style={{ gap: 12 }}>
          <ProgressBar value={0} max={5} tone="muted" label="Empty" />
          <ProgressBar value={2} max={5} label="Partial" />
          <ProgressBar value={5} max={5} tone="done" label="Done" />
          <ProgressBar value={6} max={5} tone="over" label="Over" />
        </View>
      </Spec>
    </Board>
  );
}

export function EventCardsBoard() {
  return (
    <Board title="Event card">
      <Spec label="Today">
        <EventCard event={EVENTS.today} />
      </Spec>
      <Spec label="Coming up" note="within 2 weeks">
        <EventCard event={EVENTS.soon} />
      </Spec>
      <Spec label="Far off">
        <EventCard event={EVENTS.later} />
      </Spec>
    </Board>
  );
}

export function MetricCardsBoard() {
  return (
    <Board title="Metric card">
      <Spec label="Key number">
        <View style={styles.metricRow}>
          <MetricCard style={half} label="Spent this week" icon="expense" value="1,250,000" unit="₫" caption="Nov 9 – 15" />
        </View>
      </Spec>
      <Spec label="Up · down" note="colour follows good / bad, not direction">
        <View style={styles.metricRow}>
          <MetricCard style={half} label="Spending" icon="expense" value="1.73M" unit="₫" delta={{ pct: 24, good: false, vs: 'vs last wk' }} />
          <MetricCard style={half} label="Sleep" icon="sleep" value="7.4" unit="h" delta={{ pct: 6, good: true, vs: 'vs last wk' }} />
        </View>
        <View style={styles.metricRow}>
          <MetricCard style={half} label="Eating out" icon="meal" value="420k" unit="₫" delta={{ pct: -15, good: true, vs: 'vs last wk' }} />
          <MetricCard style={half} label="Workouts" icon="activity" value="2" delta={{ pct: -33, good: false, vs: 'vs last wk' }} />
        </View>
      </Spec>
      <Spec label="No data yet">
        <View style={styles.metricRow}>
          <MetricCard style={half} label="Income" icon="income" caption="Log an income to see it here" />
          <MetricCard style={half} label="Sleep" icon="sleep" caption="Needs 3 nights" />
        </View>
      </Spec>
    </Board>
  );
}

export function PillsBoard() {
  return (
    <Board title="Badge · Status pill">
      <Spec label="Status pills">
        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          <StatusPill tone="earned" label="Earned" />
          <StatusPill tone="locked" label="Locked" />
          <StatusPill tone="healthy" label="Healthy" />
          <StatusPill tone="lunar" label="Lunar" />
          <StatusPill tone="solar" label="Solar" />
        </View>
        <View style={[styles.row, { flexWrap: 'wrap' }]}>
          <StatusPill tone="accent" label="On track" />
          <StatusPill tone="warn" icon="alert" label="Under 7 h" />
          <StatusPill tone="danger" icon="alert" label="Over limit" />
          <StatusPill tone="accent" solid label="Today" icon={null} />
        </View>
      </Spec>
      <Spec label="Badges" note="earned · locked">
        <View style={[styles.row, { justifyContent: 'space-around' }]}>
          <View style={styles.medal}>
            <BadgeMedal badge={BADGES.earned} size={84} />
            <Text style={styles.medalName}>{BADGES.earned.name}</Text>
            <StatusPill tone="earned" label="Earned" />
          </View>
          <View style={styles.medal}>
            <BadgeMedal badge={BADGES.locked} size={84} />
            <Text style={styles.medalName}>{BADGES.locked.name}</Text>
            <StatusPill tone="locked" label="3 of 5" />
          </View>
        </View>
      </Spec>
    </Board>
  );
}

export function NavigationBoard() {
  return (
    <Board title="Navigation · App bar">
      <Spec label="Root screen" note="large title, + action">
        <View style={styles.frame}>
          <AppBar title="Entries" subtitle="Wed, Nov 11" actions={<><IconButton icon="filter" label="Filter" /><AddButton /></>} />
        </View>
      </Spec>
      <Spec label="Pushed screen" note="back button">
        <View style={styles.frame}>
          <AppBar title="Reminders" onBack={() => {}} actions={<IconButton icon="more" label="More" variant="plain" />} />
        </View>
      </Spec>
      {(['today', 'garden', 'insights', 'menu', null] as (RefTab | null)[]).map((t) => (
        <Spec key={String(t)} label={t ? `Tab bar · ${t[0].toUpperCase() + t.slice(1)} selected` : 'Tab bar · none selected'} note={t ? undefined : 'screens opened from +'}>
          <View style={styles.navFrame}>
            <SafeAreaInsetsContext.Provider value={{ top: 0, bottom: 14, left: 0, right: 0 }}>
              <BottomNav active={t} />
            </SafeAreaInsetsContext.Provider>
          </View>
        </Spec>
      ))}
      <Spec label="Tab bar · Lessons variant" note="How was your day?">
        <View style={styles.navFrame}>
          <SafeAreaInsetsContext.Provider value={{ top: 0, bottom: 14, left: 0, right: 0 }}>
            <BottomNav tabs={['today', 'garden', 'lessons', 'menu']} active="today" />
          </SafeAreaInsetsContext.Provider>
        </View>
      </Spec>
    </Board>
  );
}

export function MicBoard() {
  const states: [MicState, string][] = [
    ['idle', 'Waiting'],
    ['recording', 'Recording'],
    ['processing', 'Processing'],
    ['error', 'Error'],
  ];
  return (
    <Board title="Microphone control">
      {states.map(([s, l]) => (
        <Spec key={s} label={l}>
          <View style={styles.frame}>
            <View style={{ paddingVertical: 14 }}>
              <MicControl state={s} seconds={12} />
            </View>
          </View>
        </Spec>
      ))}
    </Board>
  );
}

const styles = StyleSheet.create({
  board: { flex: 1, backgroundColor: colors.ground },
  content: { paddingHorizontal: 17.5, paddingTop: 4, gap: 22 },
  spec: { gap: 10 },
  specHead: { flexDirection: 'row', alignItems: 'baseline', gap: 8, borderBottomWidth: 1, borderBottomColor: ui.line, paddingBottom: 6 },
  specLabel: { ...font('800', 12, 16), color: colors.textHintTitle, letterSpacing: 0.9, textTransform: 'uppercase' },
  specNote: { ...font('500', 12, 16), color: colors.textMuted },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metricRow: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  frame: { borderRadius: radii.lg, borderWidth: 1.2, borderColor: ui.line, backgroundColor: colors.ground, overflow: 'hidden' },
  navFrame: { height: 98, marginHorizontal: -17.5, borderTopWidth: 1, borderBottomWidth: 1, borderColor: ui.line, backgroundColor: '#F4EBDD', overflow: 'hidden' },
  tabWrap: { height: 78, marginHorizontal: -16, borderTopWidth: 1, borderBottomWidth: 1, borderColor: ui.line, backgroundColor: '#F4EBDD', overflow: 'hidden' },
  medal: { alignItems: 'center', gap: 6 },
  medalName: { ...font('800', 13.5, 18), color: colors.text },
});
