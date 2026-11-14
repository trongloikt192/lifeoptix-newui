/** One board per card type, every state labelled. */
import { useState } from 'react';
import { StyleSheet, View } from '../primitives';
import { TODAY, addDays } from '../data/format';
import { BADGES, ENTRIES, EVENTS, GOALS, entryById } from '../data/models';
import type { CalendarEvent, Entry } from '../data/models';
import { EntryCard, EventCard, GoalCard, MetricCard, half } from '../ui/Cards';
import { AdviceCard, InsightCard, OriginalEntryCard, ReviewEntryCard } from '../ui/AiCards';
import { CalendarSummaryCard, EnergySummaryCard, GoalsSummaryCard, MoneySummaryCard, ReportCard } from '../ui/SummaryCards';
import { BadgeCard, GardenCard, ProfileCard } from '../ui/PersonalCards';
import type { Plant } from '../ui/PersonalCards';
import { Board, Spec } from './boards';
import { Decor } from '../ui/Decor';
import { CardSprigs } from '../ui/EdgeDecor';
import { TODAY_ANCHORS, TODAY_DECOR } from '../../reference/src/decor/todayDecor';
import type { ReactNode } from 'react';

/** Today-screen leaves around a summary card (anchors measured from the card, reaching the screen edges). */
function TodayEdges({ kind, children }: { kind: 'energy' | 'money' | 'goals'; children: ReactNode }) {
  return (
    <View>
      {children}
      {kind === 'energy' && (
        <>
          <Decor asset={TODAY_DECOR.leafEnergyLeft} style={TODAY_ANCHORS.energy.leafEnergyLeft} />
          <Decor asset={TODAY_DECOR.leafEnergyRight} style={TODAY_ANCHORS.energy.leafEnergyRight} />
        </>
      )}
      {kind === 'money' && <Decor asset={TODAY_DECOR.flowerMoneyRight} style={{ right: -16.3, bottom: -14 }} />}
      {kind === 'goals' && <Decor asset={TODAY_DECOR.leafGoalsRight} style={TODAY_ANCHORS.goals.leafGoalsRight} />}
    </View>
  );
}

const noop = () => {};

export function EntryCardBoard() {
  const by = (k: string) => ENTRIES.find((e) => e.kind === k)!;
  return (
    <Board title="Entry Card">
      {(['meal', 'expense', 'income', 'activity', 'sleep'] as const).map((k) => (
        <Spec key={k} label={k === 'meal' ? 'Meal' : k === 'expense' ? 'Expense' : k === 'income' ? 'Income' : k === 'activity' ? 'Activity' : 'Sleep'}>
          <EntryCard entry={k === 'activity' ? entryById('e7') : by(k)} onPress={noop} onMore={noop} />
        </Spec>
      ))}
      <Spec label="Pressed">
        <EntryCard entry={by('meal')} onPress={noop} onMore={noop} pressedPreview />
      </Spec>
    </Board>
  );
}

const PHO: Entry = { ...entryById('e1') };
const COFFEE: Entry = { id: 'r2', kind: 'expense', date: TODAY, time: 9 * 60 + 5, title: 'Coffee', category: 'Food', amount: 500000 };
const GYM: Entry = { ...entryById('e2') };

export function ReviewCardBoard() {
  return (
    <Board title="Review Entry Card">
      <Spec label="Estimated" note="AI filled a value">
        <ReviewEntryCard sprigIndex={0} entry={PHO} state="estimated" fields={[{ label: 'Calories', value: '450 kcal', estimated: true }]} />
      </Spec>
      <Spec label="Needs a check">
        <ReviewEntryCard sprigIndex={1} entry={COFFEE} state="check" fields={[{ label: 'Category', value: 'Food' }]} question="Was it 50k or 500k? “cà phê 500” could be either." />
      </Spec>
      <Spec label="Edited by you">
        <ReviewEntryCard sprigIndex={2} entry={GYM} state="edited" fields={[{ label: 'Burned', value: '320 kcal', estimated: true }]} />
      </Spec>
    </Board>
  );
}

export function MetricCardBoard() {
  return (
    <Board title="Metric Card">
      <Spec label="Sleep · spending · entries">
        <View style={styles.pair}>
          <MetricCard sprigIndex={0} style={half} label="Sleep last night" icon="sleep" value="7 h 24" unit="min" delta={{ pct: 6, good: true, vs: 'vs avg' }} onPress={noop} />
          <MetricCard sprigIndex={2} style={half} label="Entries this week" icon="note" value="23" caption="Most on Monday" onPress={noop} />
        </View>
        <MetricCard sprigIndex={1} label="Spent this week" icon="expense" value="1,250,000" unit="₫" delta={{ pct: 18, good: false, vs: 'vs last week' }} onPress={noop} />
      </Spec>
      <Spec label="Pressed">
        <MetricCard label="Spent this week" icon="expense" value="1,250,000" unit="₫" caption="Nov 9 – 15" onPress={noop} pressedPreview />
      </Spec>
      <Spec label="Loading · no data · error">
        <View style={styles.pair}>
          <MetricCard style={half} label="Sleep last night" icon="sleep" status="loading" />
          <MetricCard style={half} label="Sleep last night" icon="sleep" caption="Log a night to see it" />
        </View>
        <MetricCard label="Spent this week" icon="expense" status="error" />
      </Spec>
    </Board>
  );
}

export function EnergyCardBoard() {
  return (
    <Board title="Energy Summary Card">
      <Spec label="Within budget">
        <TodayEdges kind="energy">
          <EnergySummaryCard intake={1850} burned={2150} budget={2000} onPress={noop} />
        </TodayEdges>
      </Spec>
      <Spec label="Over budget">
        <EnergySummaryCard intake={2450} burned={2000} budget={2000} onPress={noop} />
      </Spec>
      <Spec label="Pressed">
        <EnergySummaryCard intake={1850} burned={2150} budget={2000} onPress={noop} pressedPreview />
      </Spec>
      <Spec label="Loading">
        <EnergySummaryCard intake={0} burned={0} budget={2000} status="loading" />
      </Spec>
      <Spec label="No data">
        <EnergySummaryCard intake={0} burned={0} budget={2000} status="empty" />
      </Spec>
      <Spec label="Error">
        <EnergySummaryCard intake={0} burned={0} budget={2000} status="error" />
      </Spec>
    </Board>
  );
}

export function MoneyCardBoard() {
  const [p, setP] = useState<'day' | 'week'>('day');
  return (
    <Board title="Money Summary Card">
      <Spec label="Day / week" note="tap Day · Week">
        <TodayEdges kind="money">
          <MoneySummaryCard period={p} onPeriodChange={setP} income={p === 'day' ? 0 : 3500000} expense={p === 'day' ? 88000 : 1250000} onPress={noop} />
        </TodayEdges>
      </Spec>
      <Spec label="Spent more than earned">
        <MoneySummaryCard period="week" income={800000} expense={1735000} onPress={noop} />
      </Spec>
      <Spec label="Pressed">
        <MoneySummaryCard period="week" income={3500000} expense={1250000} onPress={noop} pressedPreview />
      </Spec>
      <Spec label="Loading">
        <MoneySummaryCard period="day" income={0} expense={0} status="loading" />
      </Spec>
      <Spec label="No data">
        <MoneySummaryCard period="day" income={0} expense={0} status="empty" />
      </Spec>
      <Spec label="Error">
        <MoneySummaryCard period="day" income={0} expense={0} status="error" />
      </Spec>
    </Board>
  );
}

export function GoalCardBoard() {
  return (
    <Board title="Goal Card">
      <Spec label="In progress" note="set by you">
        <CardSprigs index={0}>
          <GoalCard goal={GOALS.progress} onPress={noop} onMore={noop} />
        </CardSprigs>
      </Spec>
      <Spec label="Achieved" note="from a template">
        <CardSprigs index={1}>
          <GoalCard goal={GOALS.achieved} source="template" onPress={noop} onMore={noop} />
        </CardSprigs>
      </Spec>
      <Spec label="Over the limit" note="suggested">
        <CardSprigs index={2}>
          <GoalCard goal={GOALS.over} source="suggested" onPress={noop} onMore={noop} />
        </CardSprigs>
      </Spec>
      <Spec label="Not started">
        <CardSprigs index={3}>
          <GoalCard goal={GOALS.notStarted} onPress={noop} onMore={noop} />
        </CardSprigs>
      </Spec>
      <Spec label="Pressed">
        <GoalCard goal={GOALS.progress} onPress={noop} onMore={noop} pressedPreview />
      </Spec>
    </Board>
  );
}

const ALL_DONE = [GOALS.achieved, { ...GOALS.progress, current: 3 }, { ...GOALS.over, current: 1200000 }];

export function GoalsSummaryBoard() {
  return (
    <Board title="Goals Summary Card">
      <Spec label="Some reached">
        <TodayEdges kind="goals">
          <GoalsSummaryCard goals={Object.values(GOALS)} onPress={noop} />
        </TodayEdges>
      </Spec>
      <Spec label="All reached">
        <GoalsSummaryCard goals={[GOALS.achieved, { ...GOALS.progress, current: 3 }]} onPress={noop} />
      </Spec>
      <Spec label="Pressed">
        <GoalsSummaryCard goals={ALL_DONE} onPress={noop} pressedPreview />
      </Spec>
      <Spec label="Loading">
        <GoalsSummaryCard goals={[]} status="loading" />
      </Spec>
      <Spec label="No goals">
        <GoalsSummaryCard goals={[]} status="empty" />
      </Spec>
      <Spec label="Error">
        <GoalsSummaryCard goals={[]} status="error" />
      </Spec>
    </Board>
  );
}

const PAST: CalendarEvent = { id: 'v4', name: 'Lan & Minh’s wedding', calendar: 'solar', date: addDays(TODAY, -3), repeat: 'none', remindDays: 1 };

export function EventCardBoard() {
  const [on, setOn] = useState<Record<string, boolean>>({ v1: true, v2: true, v3: false });
  const toggle = (id: string) => () => setOn((s) => ({ ...s, [id]: !s[id] }));
  return (
    <Board title="Event Card">
      <Spec label="Today">
        <EventCard sprigIndex={0} event={EVENTS.today} onPress={noop} reminderOn={on.v1} onToggleReminder={toggle('v1')} />
      </Spec>
      <Spec label="Upcoming" note="reminder on">
        <EventCard sprigIndex={1} event={EVENTS.soon} onPress={noop} reminderOn={on.v2} onToggleReminder={toggle('v2')} />
      </Spec>
      <Spec label="Far off" note="reminder off">
        <EventCard sprigIndex={2} event={EVENTS.later} onPress={noop} reminderOn={on.v3} onToggleReminder={toggle('v3')} />
      </Spec>
      <Spec label="Past">
        <EventCard event={PAST} onPress={noop} onToggleReminder={noop} />
      </Spec>
      <Spec label="Pressed">
        <EventCard sprigIndex={1} event={EVENTS.soon} onPress={noop} reminderOn onToggleReminder={noop} pressedPreview />
      </Spec>
    </Board>
  );
}

export function CalendarCardBoard() {
  return (
    <Board title="Calendar Summary Card">
      <Spec label="Today · green card" note="Event reminders">
        <CalendarSummaryCard variant="green" />
      </Spec>
      <Spec label="Today · week strip">
        <CalendarSummaryCard nextEvent={{ name: 'Grandpa’s memorial day', inDays: 9 }} onPress={noop} />
      </Spec>
      <Spec label="First day of the lunar month">
        <CalendarSummaryCard date={addDays(TODAY, -2)} onPress={noop} />
      </Spec>
      <Spec label="Full moon (Rằm)">
        <CalendarSummaryCard date={addDays(TODAY, 12)} onPress={noop} />
      </Spec>
      <Spec label="Pressed">
        <CalendarSummaryCard onPress={noop} pressedPreview />
      </Spec>
    </Board>
  );
}

const REPORT = {
  title: 'Weekly report',
  period: 'Nov 2 – 8, 2026',
  description: 'You slept 32 minutes more than the week before and kept eating out under budget on 5 of 7 days.',
  stats: [
    { label: 'Avg sleep', value: '7 h 18' },
    { label: 'Spent', value: '1.1M ₫' },
    { label: 'Workouts', value: '3' },
  ],
};

export function ReportCardBoard() {
  return (
    <Board title="Report Card">
      <Spec label="Ready" note="new">
        <ReportCard {...REPORT} isNew onOpen={noop} />
      </Spec>
      <Spec label="Pressed">
        <ReportCard {...REPORT} onOpen={noop} pressedPreview />
      </Spec>
      <Spec label="Being prepared">
        <ReportCard {...REPORT} status="loading" />
      </Spec>
      <Spec label="Not enough data">
        <ReportCard {...REPORT} title="This week’s report" period="Nov 9 – 15, 2026" status="empty" />
      </Spec>
      <Spec label="Error">
        <ReportCard {...REPORT} status="error" />
      </Spec>
    </Board>
  );
}

export function InsightCardBoard() {
  return (
    <Board title="Insight Card">
      <Spec label="Positive">
        <InsightCard type="positive" title="Your bedtime is steadier" body="You went to bed within 30 minutes of 11 PM on 6 of the last 7 nights." basis="Based on 14 nights · Oct 28 – Nov 10" />
      </Spec>
      <Spec label="Needs attention">
        <InsightCard type="attention" title="Eating out is creeping up" body="You’ve spent 1.7M ₫ on meals out this week — 15% over your limit, mostly at lunch." basis="Based on 9 meals this week" />
      </Spec>
      <Spec label="Connection">
        <InsightCard
          type="connection"
          title="Gym days, better nights"
          link={{ from: 'activity', to: 'sleep', effect: '+38 min sleep' }}
          body="On days you work out, you sleep about 38 minutes longer."
          basis="Based on 21 days · 9 with workouts"
        />
      </Spec>
      <Spec label="Loading">
        <InsightCard type="positive" title="" body="" basis="" status="loading" />
      </Spec>
      <Spec label="Not enough data">
        <InsightCard type="positive" title="" body="" basis="" status="empty" />
      </Spec>
      <Spec label="Error">
        <InsightCard type="positive" title="" body="" basis="" status="error" />
      </Spec>
    </Board>
  );
}

export function AdviceCardBoard() {
  const [added, setAdded] = useState<number[]>([1]);
  const items = [
    { title: 'Walk 15 minutes after lunch', why: 'Your afternoons are the least active part of the day.', icon: 'activity' as const },
    { title: 'Pack lunch twice this week', why: 'Lunches out are most of your food spending.', icon: 'meal' as const },
    { title: 'Phone down by 10:30 PM', why: 'Nights you log before 10:30 you sleep longer.', icon: 'moon' as const },
  ].map((a, i) => ({ ...a, added: added.includes(i) }));
  return (
    <Board title="Advice Card">
      <Spec label="One suggestion">
        <AdviceCard items={[{ title: 'Try a 20-minute walk after dinner', why: 'You sleep about 38 minutes longer on active days, and evenings are when you move least.', icon: 'activity' }]} />
      </Spec>
      <Spec label="Several" note="tap + to add">
        <AdviceCard items={items} onAdd={(i) => setAdded((a) => [...a, i])} />
      </Spec>
      <Spec label="Accepted">
        <AdviceCard items={[{ title: 'Try a 20-minute walk after dinner', why: 'Added as “Walk after dinner, 4× a week”.', icon: 'activity', added: true }]} />
      </Spec>
      <Spec label="Loading">
        <AdviceCard items={[]} status="loading" />
      </Spec>
      <Spec label="Nothing to suggest">
        <AdviceCard items={[]} status="empty" />
      </Spec>
      <Spec label="Error">
        <AdviceCard items={[]} status="error" />
      </Spec>
    </Board>
  );
}

const BASIL: Plant = { name: 'Little Basil', species: 'Basil', stage: 3, health: 'healthy', points: 340, nextAt: 500, today: 12 };

export function GardenCardBoard() {
  return (
    <Board title="Garden Card">
      <Spec label="Healthy">
        <GardenCard plant={BASIL} onPress={noop} />
      </Spec>
      <Spec label="Blooming">
        <GardenCard plant={{ ...BASIL, name: 'Sunny', species: 'Rose', stage: 5, points: 980, nextAt: 1000, today: 8 }} onPress={noop} />
      </Spec>
      <Spec label="Needs care">
        <GardenCard plant={{ ...BASIL, health: 'thirsty', today: 0 }} onPress={noop} />
      </Spec>
      <Spec label="Wilting">
        <GardenCard plant={{ ...BASIL, stage: 2, health: 'wilting', points: 120, nextAt: 250, today: 0 }} onPress={noop} />
      </Spec>
      <Spec label="Pressed">
        <GardenCard plant={BASIL} onPress={noop} pressedPreview />
      </Spec>
      <Spec label="Loading · error">
        <GardenCard plant={BASIL} status="loading" />
        <GardenCard plant={BASIL} status="error" />
      </Spec>
    </Board>
  );
}

export function BadgeCardBoard() {
  return (
    <Board title="Badge Card">
      <Spec label="Earned">
        <BadgeCard badge={BADGES.earned} onPress={noop} />
      </Spec>
      <Spec label="Locked">
        <BadgeCard badge={BADGES.locked} onPress={noop} />
      </Spec>
      <Spec label="Pressed">
        <BadgeCard badge={BADGES.earned} onPress={noop} pressedPreview />
      </Spec>
    </Board>
  );
}

const PERSON = { name: 'Linh Trần', since: 'Sep 2026', streak: 7, entries: 214, badges: 5 };

export function ProfileCardBoard() {
  return (
    <Board title="Profile Card">
      <Spec label="With photo">
        <ProfileCard profile={{ ...PERSON, photo: true }} onPress={noop} />
      </Spec>
      <Spec label="Initials">
        <ProfileCard profile={PERSON} onPress={noop} />
      </Spec>
      <Spec label="Pressed">
        <ProfileCard profile={{ ...PERSON, photo: true }} onPress={noop} pressedPreview />
      </Spec>
      <Spec label="Loading · error">
        <ProfileCard profile={PERSON} status="loading" />
        <ProfileCard profile={PERSON} status="error" />
      </Spec>
    </Board>
  );
}

const LONG =
  'Woke up at 6:30, did gym for 45 min before work. Phở bò for breakfast 50k. Grab to the office 38k because it was raining. Lunch with the team, bún chả 65k, then a long afternoon of meetings. Felt tired but okay. Slept around 11.';

export function OriginalCardBoard() {
  const [collapsed, setCollapsed] = useState(true);
  return (
    <Board title="Original Entry Card">
      <Spec label="Typed">
        <OriginalEntryCard mode="typed" text="Pho 50k, gym 45 min" time={7 * 60 + 52} />
      </Spec>
      <Spec label="Spoken">
        <OriginalEntryCard mode="spoken" duration={9} text="Had phở for breakfast, fifty k. Then gym for forty-five minutes." time={7 * 60 + 52} />
      </Spec>
      <Spec label="Matched to results" note="colour = entry it became">
        <OriginalEntryCard
          mode="typed"
          text="Pho 50k, gym 45 min, grab 38k"
          time={7 * 60 + 52}
          highlights={[
            { phrase: 'Pho 50k', kind: 'meal' },
            { phrase: 'gym 45 min', kind: 'activity' },
            { phrase: 'grab 38k', kind: 'expense' },
          ]}
        />
      </Spec>
      <Spec label="Long note" note="collapsed">
        <OriginalEntryCard
          mode="typed"
          text={LONG}
          time={21 * 60 + 40}
          collapsed={collapsed}
          onToggle={() => setCollapsed((c) => !c)}
          highlights={[
            { phrase: 'gym for 45 min', kind: 'activity' },
            { phrase: 'Phở bò for breakfast 50k', kind: 'meal' },
            { phrase: 'Grab to the office 38k', kind: 'expense' },
            { phrase: 'bún chả 65k', kind: 'meal' },
            { phrase: 'Slept around 11', kind: 'sleep' },
          ]}
        />
      </Spec>
    </Board>
  );
}

const styles = StyleSheet.create({
  pair: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
});
