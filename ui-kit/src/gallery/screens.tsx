/**
 * Context screens the overlays and states sit on. Built only from the kit,
 * so they double as reference layouts for the RN screens.
 */
import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { BottomNav, useNavHeight } from '../../reference/src/components/BottomNav';
import { ENTRIES_DECOR, ENTRIES_HEADER_HEIGHT, ENTRIES_PAPER } from '../../reference/src/decor/entriesDecor';
import { EVENTS_DECOR, EVENTS_PAPER, EVENTS_SCENE_OVERLAP } from '../../reference/src/decor/eventsDecor';
import { GOALS_DECOR, GOALS_PAPER } from '../../reference/src/decor/goalsDecor';
import { CardSprigs } from '../ui/EdgeDecor';
import { Decor } from '../ui/Decor';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View, useKeyboardHeight, useSafeAreaInsets } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, font, kinds, radii, ui } from '../theme/tokens';
import { TODAY, addDays, dateLabel } from '../data/format';
import { ENTRIES, EVENTS, GOALS } from '../data/models';
import type { Entry, Goal } from '../data/models';
import { IconButton } from '../ui/Button';
import { EntryCard, EventCard, GoalCard, MetricCard, half } from '../ui/Cards';
import { CalendarSummaryCard } from '../ui/SummaryCards';
import { Chip, ChipRow } from '../ui/Controls';
import { SearchBar } from '../ui/Field';
import { useToast } from '../ui/Feedback';
import { Button } from '../ui/Button';
import { Banner, Bone, SkeletonCard, SkeletonList, StateView } from '../ui/States';
import { ActionSheet } from '../sheets/MenuSheets';
import { AddEntrySheet, EntryDetailSheet, FilterSheet } from '../sheets/EntrySheets';
import { EventSheet, GoalSheet } from '../sheets/PlanSheets';
import { ConfirmDialog } from '../ui/Feedback';

/* ---------- scaffold ---------- */

/**
 * Page frame copied from the reference screens: the whole page scrolls (title + art included),
 * art and anchors come from reference/src/decor, and only All entries keeps the tab bar.
 */
export type ScreenKind = 'entries' | 'goals' | 'events';

const PAPER: Record<ScreenKind, string> = { entries: ENTRIES_PAPER, goals: GOALS_PAPER, events: EVENTS_PAPER };

type ScreenProps = {
  kind: ScreenKind;
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  onBack?: () => void;
  /** Search / chips under the title (full width, own margins). */
  top?: ReactNode;
  children: ReactNode;
  /** Last block of the page, e.g. the green "Add" button. */
  footer?: ReactNode;
};

export function Screen({ kind, title, subtitle, actions, onBack = () => {}, top, children, footer }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const keyboard = useKeyboardHeight();
  const navH = useNavHeight();
  const hasNav = kind === 'entries';
  const head = HEAD[kind];
  const headerH = insets.top + head.height;
  const sceneSpace = EVENTS_DECOR.bottomScene.height - EVENTS_SCENE_OVERLAP;
  const bottomPad = keyboard ? keyboard + 16 : kind === 'events' ? sceneSpace : hasNav ? navH + 29 : Math.max(73, insets.bottom + 20);
  return (
    <View style={[styles.screen, { backgroundColor: PAPER[kind] }]}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1, paddingBottom: bottomPad }} keyboardShouldPersistTaps="handled">
        {/* end-of-page art first, so every card scrolls over it */}
        {kind === 'goals' && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Decor asset={GOALS_DECOR.garlandBottomLeft} style={{ left: 0, bottom: 0 }} />
            <Decor asset={GOALS_DECOR.garlandBottomRight} style={{ right: 0, bottom: 0 }} />
          </View>
        )}
        {kind === 'events' && !keyboard && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Decor asset={EVENTS_DECOR.bottomScene} style={{ left: 0, bottom: 0 }} />
          </View>
        )}

        <View style={{ height: headerH }}>
          {kind === 'entries' && <Decor asset={ENTRIES_DECOR.heroTop} style={{ left: 0, top: Math.min(0, headerH - ENTRIES_HEADER_HEIGHT) }} />}
          {kind === 'goals' && (
            <>
              <Decor asset={GOALS_DECOR.leavesTopLeft} style={{ left: 0, top: 0 }} />
              <Decor asset={GOALS_DECOR.catTopRight} style={{ right: 0, top: 0 }} />
              <Decor asset={GOALS_DECOR.leavesHeaderLeft} style={{ left: 0, top: 92.1 }} />
            </>
          )}
          {kind === 'events' && (
            <>
              <Decor asset={EVENTS_DECOR.leavesTopLeft} style={{ left: 0, top: 0 }} />
              <Decor asset={EVENTS_DECOR.flowersTopRight} style={{ right: 0, top: 0 }} />
            </>
          )}
          <View style={[styles.back, { top: insets.top + head.backTop }]}>
            <IconButton icon="chevronLeft" label="Back" variant="accent" size={35} onPress={onBack} />
          </View>
          <Text accessibilityRole="header" numberOfLines={1} style={[head.big ? styles.titleBig : styles.title, { top: insets.top + head.titleTop, left: head.titleLeft }]}>
            {title}
          </Text>
          {subtitle && <Text style={[styles.subtitle, { top: insets.top + head.titleTop + 35.8 }]}>{subtitle}</Text>}
          {actions && <View style={[styles.actions, { top: insets.top + head.backTop - 4 }]}>{actions}</View>}
        </View>

        {top && <View style={styles.top}>{top}</View>}
        <View style={styles.content}>{children}</View>
        {footer && <View style={styles.footer}>{footer}</View>}

        {hasNav && !keyboard && (
          <View pointerEvents="none" style={StyleSheet.absoluteFill}>
            <Decor asset={ENTRIES_DECOR.garlandEndLeft} style={{ left: 0, bottom: navH + 2.7 }} />
            <Decor asset={ENTRIES_DECOR.garlandEndRight} style={{ right: 0, bottom: navH + 2.7 }} />
          </View>
        )}
      </ScrollView>
      {hasNav && !keyboard && <BottomNav active="menu" />}
    </View>
  );
}

/** Title block per page, in pt below the status bar (from the reference screens). */
const HEAD: Record<ScreenKind, { height: number; backTop: number; titleTop: number; titleLeft: number; big: boolean }> = {
  entries: { height: 140, backTop: 36.4, titleTop: 78.1, titleLeft: 20.6, big: true },
  goals: { height: 76.3, backTop: 22.9, titleTop: 24.6, titleLeft: 63.6, big: false },
  events: { height: 65.7, backTop: 21.6, titleTop: 24.1, titleLeft: 63.6, big: false },
};

export function SectionLabel({ children }: { children: string }) {
  return <Text style={styles.sectionLabel}>{children}</Text>;
}

/* ---------- Entries ---------- */

export type EntriesState =
  | 'list'
  | 'empty'
  | 'loading'
  | 'analyzing'
  | 'searchNoResults'
  | 'filterNoResults'
  | 'offline'
  | 'loadError'
  | 'processFailed'
  | 'saved'
  | 'searchTyping';

const NEW_ENTRY: Entry = { id: 'n1', kind: 'expense', date: TODAY, time: 10 * 60 + 44, title: 'Coffee with Lan', category: 'Food', amount: 45000 };

export function EntriesScreen({ state = 'list' }: { state?: EntriesState }) {
  const toast = useToast();
  const [query, setQuery] = useState(state === 'searchNoResults' ? 'bánh xèo' : state === 'searchTyping' ? 'ph' : '');
  const [detail, setDetail] = useState<Entry | null>(null);
  const [menu, setMenu] = useState<Entry | null>(null);
  const [confirm, setConfirm] = useState<Entry | null>(null);
  const [filters, setFilters] = useState(false);
  const [adding, setAdding] = useState(false);
  const [retrying, setRetrying] = useState(false);

  useEffect(() => {
    if (state === 'saved') toast({ kind: 'success', message: 'Saved: Coffee with Lan', action: { label: 'Undo', onPress: () => {} }, duration: 600000 });
  }, [state, toast]);

  const filterOn = state === 'filterNoResults';
  const searching = query.length > 0;
  const list = (state === 'saved' ? [NEW_ENTRY, ...ENTRIES] : ENTRIES).filter((e) => !searching || e.title.toLowerCase().includes(query.toLowerCase()));
  const today = list.filter((e) => e.date.d === TODAY.d);
  const earlier = list.filter((e) => e.date.d !== TODAY.d);

  const card = (e: Entry) => <EntryCard key={e.id} entry={e} onPress={() => setDetail(e)} onMore={() => setMenu(e)} />;

  const body = () => {
    switch (state) {
      case 'empty':
        return (
          <StateView
            art="entries"
            title="Nothing logged yet"
            message="Tell me about a meal, a walk or a little win. One line is enough."
            primary={{ label: 'Add your first entry', icon: 'plus', onPress: () => setAdding(true) }}
            secondary={{ label: 'See an example' }}
            style={{ marginTop: 24 }}
          />
        );
      case 'loading':
        return (
          <>
            <View style={styles.metrics}>
              {[0, 1].map((i) => (
                <View key={i} style={styles.metricSk}>
                  <Bone w={90} h={11} />
                  <Bone w={120} h={22} r={7} />
                  <Bone w={70} h={11} />
                </View>
              ))}
            </View>
            <SectionLabel>Today</SectionLabel>
            <SkeletonList count={5} />
          </>
        );
      case 'searchNoResults':
        return (
          <StateView art="search" title={`No entries for “${query}”`} message="Try a shorter word, or search by type." style={{ marginTop: 8 }}>
            <ChipRow>
              {(['meal', 'expense', 'activity'] as const).map((k) => (
                <Chip key={k} label={kinds[k].label} icon={k} tone={kinds[k]} selected={false} />
              ))}
            </ChipRow>
          </StateView>
        );
      case 'filterNoResults':
        return (
          <StateView
            art="search"
            title="No entries match"
            message="Nothing logged as Sleep between Nov 1 and Nov 5."
            primary={{ label: 'Clear filters', icon: 'close' }}
            secondary={{ label: 'Change filters', onPress: () => setFilters(true) }}
            style={{ marginTop: 8 }}
          />
        );
      case 'loadError':
        return (
          <StateView
            art="offline"
            title="Can’t load your entries"
            message="You seem to be offline. Your notes are safe — we’ll show them once you’re connected."
            primary={{ label: retrying ? 'Trying again…' : 'Try again', icon: 'refresh', loading: retrying, onPress: () => setRetrying(true) }}
            style={{ marginTop: 24 }}
          />
        );
      default:
        return (
          <>
            {state === 'offline' && (
              <Banner tone="warn" icon="wifiOff" title="You’re offline" message="New entries are kept on this phone and sync later." />
            )}
            {state === 'analyzing' && <AnalyzingCard />}
            {state === 'processFailed' && <ProcessFailedCard />}
            {!searching && (
              <View style={styles.metrics}>
                <MetricCard style={half} label="Spent today" icon="expense" value="88,000" unit="₫" delta={{ pct: -18, good: true, vs: 'vs. last Wed' }} />
                <MetricCard style={half} label="Moved" icon="activity" value="45" unit="min" delta={{ pct: 12, good: true, vs: 'vs. avg.' }} />
              </View>
            )}
            {today.length > 0 && <SectionLabel>{searching ? `${list.length} result${list.length === 1 ? '' : 's'}` : 'Today'}</SectionLabel>}
            <View style={styles.cards}>{today.map(card)}</View>
            {earlier.length > 0 && <SectionLabel>{dateLabel(addDays(TODAY, -1), { relative: true }) + ' & earlier'}</SectionLabel>}
            <View style={styles.cards}>{earlier.map(card)}</View>
          </>
        );
    }
  };

  const showSearch = !['empty', 'loadError', 'loading'].includes(state);

  return (
    <>
      <Screen
        kind="entries"
        title="All entries"
        subtitle="Little moments, all in one place."
        actions={<IconButton icon="filter" label={filterOn ? 'Filters (2 on)' : 'Filter'} selected={filterOn} onPress={() => setFilters(true)} />}
        top={
          <>
            {showSearch && (
              <SearchBar
                value={query}
                onChangeText={setQuery}
                autoFocus={state === 'searchTyping'}
                showFocus={state === 'searchTyping'}
                searching={state === 'searchTyping'}
                onCancel={() => setQuery('')}
              />
            )}
            {filterOn && (
              <ChipRow wrap={false}>
                <Chip label="Sleep" icon="sleep" tone={kinds.sleep} selected onPress={() => setFilters(true)} />
                <Chip label="Nov 1 – 5" icon="calendar" selected onPress={() => setFilters(true)} />
              </ChipRow>
            )}
          </>
        }
      >
        {body()}
      </Screen>

      {detail && <EntryDetailSheet visible entry={detail} onClose={() => setDetail(null)} />}
      <ActionSheet
        visible={!!menu}
        onClose={() => setMenu(null)}
        title={menu?.title ?? ''}
        subtitle={menu ? `${kinds[menu.kind].label} · ${dateLabel(menu.date, { relative: true })}` : undefined}
        actions={entryActions(() => setConfirm(menu), toast)}
      />
      <ConfirmDialog
        visible={!!confirm}
        title="Delete this entry?"
        message={`“${confirm?.title}” will be removed from your log and goals.`}
        confirmLabel="Delete"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          toast({ kind: 'info', message: 'Entry deleted', action: { label: 'Undo', onPress: () => {} } });
        }}
      />
      {filters && <FilterSheet visible onClose={() => setFilters(false)} />}
      {adding && <AddEntrySheet visible onClose={() => setAdding(false)} />}
    </>
  );
}

export function entryActions(onDelete: () => void, toast: ReturnType<typeof useToast>) {
  return [
    { label: 'Edit', icon: 'edit' as const, onPress: () => toast({ message: 'Opening editor…', kind: 'success' as const }) },
    { label: 'Duplicate', icon: 'copy' as const, hint: 'Same details, logged now', onPress: () => toast({ kind: 'success' as const, message: 'Duplicated to today' }) },
    { label: 'Move to another day', icon: 'calendarMove' as const },
    { label: 'Delete entry', icon: 'trash' as const, destructive: true, onPress: onDelete },
  ];
}

function AnalyzingCard() {
  const accent = useAccent();
  return (
    <View style={styles.analyze} accessibilityLiveRegion="polite">
      <View style={styles.analyzeHead}>
        <ActivityIndicator color={accent} />
        <View style={{ flex: 1 }}>
          <Text style={styles.analyzeTitle}>Organizing your note…</Text>
          <Text numberOfLines={1} style={styles.analyzeQuote}>
            “Pho 50k, gym 45 min, slept at 11”
          </Text>
        </View>
      </View>
      <SkeletonCard />
      <SkeletonCard />
    </View>
  );
}

function ProcessFailedCard() {
  return (
    <View style={[styles.analyze, { borderColor: ui.dangerBorder, backgroundColor: '#FFF7F3' }]}>
      <StateView
        art="failed"
        title="Couldn’t organize that note"
        message="Something went wrong on our side. Your words are kept — try again, or save them as a plain note."
        primary={{ label: 'Try again', icon: 'refresh' }}
        secondary={{ label: 'Save as plain note' }}
        style={{ paddingHorizontal: 4, paddingVertical: 4 }}
      />
    </View>
  );
}

/* ---------- Goals ---------- */

export function GoalsScreen({ empty }: { empty?: boolean }) {
  const toast = useToast();
  const [edit, setEdit] = useState<Goal | null | 'new'>(null);
  const [menu, setMenu] = useState<Goal | null>(null);
  const [confirm, setConfirm] = useState<Goal | null>(null);
  return (
    <>
      <Screen
        kind="goals"
        title="Weekly goals"
        footer={
          empty ? undefined : (
            <>
              <Text style={styles.footnote}>Progress comes from what you log — there’s no “mark done” button.</Text>
              <Button label="Add a goal" icon="plus" onPress={() => setEdit('new')} />
            </>
          )
        }
      >
        {empty ? (
          <StateView
            art="goals"
            title="No goals yet"
            message="Pick one small thing — a spending limit, 3 workouts a week, 7 hours of sleep."
            primary={{ label: 'Set a goal', icon: 'target', onPress: () => setEdit('new') }}
            style={{ marginTop: 24 }}
          />
        ) : (
          <View style={styles.cards}>
            <SectionLabel>4 goals · 1 met</SectionLabel>
            {Object.values(GOALS).map((g, i) => (
              <CardSprigs key={g.id} index={i}>
                <GoalCard goal={g} source={i === 3 ? 'suggested' : 'you'} onPress={() => setEdit(g)} onMore={() => setMenu(g)} />
              </CardSprigs>
            ))}
          </View>
        )}
      </Screen>
      {edit && <GoalSheet visible goal={edit === 'new' ? undefined : edit} onClose={() => setEdit(null)} />}
      <ActionSheet
        visible={!!menu}
        onClose={() => setMenu(null)}
        title={menu?.title ?? ''}
        subtitle="Goal"
        actions={goalActions(() => menu && setEdit(menu), () => setConfirm(menu), toast)}
      />
      <ConfirmDialog
        visible={!!confirm}
        title="Delete this goal?"
        message={`“${confirm?.title}” and its progress history will be removed. Your entries stay.`}
        confirmLabel="Delete goal"
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          setConfirm(null);
          toast({ kind: 'info', message: 'Goal deleted', action: { label: 'Undo', onPress: () => {} } });
        }}
      />
    </>
  );
}

export function goalActions(onEdit: () => void, onDelete: () => void, toast: ReturnType<typeof useToast>) {
  return [
    { label: 'Edit goal', icon: 'edit' as const, onPress: onEdit },
    { label: 'Pause goal', icon: 'pause' as const, hint: 'Keeps progress, stops reminders', onPress: () => toast({ kind: 'success' as const, message: 'Goal paused' }) },
    { label: 'Share progress', icon: 'share' as const },
    { label: 'Delete goal', icon: 'trash' as const, destructive: true, onPress: onDelete },
  ];
}

/* ---------- Events ---------- */

export function EventsScreen({ empty }: { empty?: boolean }) {
  const [edit, setEdit] = useState<keyof typeof EVENTS | 'new' | null>(null);
  return (
    <>
      <Screen kind="events" title="Event reminders" footer={empty ? undefined : <Button label="Add event" icon="plus" onPress={() => setEdit('new')} />}>
        {empty ? (
          <StateView
            art="events"
            title="No events saved"
            message="Add birthdays, anniversaries or memorial days — solar or lunar — and we’ll remind you ahead of time."
            primary={{ label: 'Add an event', icon: 'plus', onPress: () => setEdit('new') }}
            style={{ marginTop: 24 }}
          />
        ) : (
          <View style={styles.cards}>
            <CalendarSummaryCard variant="green" />
            <SectionLabel>Your events · lunar dates auto-converted to solar</SectionLabel>
            <EventCard event={EVENTS.today} sprigIndex={0} reminderOn onToggleReminder={() => {}} onPress={() => setEdit('today')} />
            <EventCard event={EVENTS.soon} sprigIndex={1} reminderOn onToggleReminder={() => {}} onPress={() => setEdit('soon')} />
            <EventCard event={EVENTS.later} sprigIndex={2} onToggleReminder={() => {}} onPress={() => setEdit('later')} />
          </View>
        )}
      </Screen>
      {edit && <EventSheet visible event={edit === 'new' ? undefined : EVENTS[edit]} onClose={() => setEdit(null)} />}
    </>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.ground, overflow: 'hidden' },
  back: { position: 'absolute', left: 13.5 },
  title: { position: 'absolute', right: 16, fontFamily: 'Nunito', fontWeight: '900', fontSize: 24.1, lineHeight: 30, letterSpacing: -1, color: '#270100' },
  titleBig: { position: 'absolute', right: 16, fontFamily: 'Nunito', fontWeight: '900', fontSize: 33, lineHeight: 40, letterSpacing: -1.5, color: '#270100' },
  subtitle: { position: 'absolute', left: 21.4, fontFamily: 'Nunito', fontWeight: '400', fontSize: 14.1, lineHeight: 18, color: '#5C3F2E' },
  actions: { position: 'absolute', right: 12, flexDirection: 'row' },
  top: { paddingHorizontal: 17.5, paddingBottom: 4, gap: 2 },
  content: { paddingHorizontal: 17.5, paddingTop: 8, gap: 11 },
  footer: { paddingHorizontal: 17.5, paddingTop: 14, gap: 14 },
  footnote: { ...font('400', 11.8, 16.5), color: '#673B24', paddingHorizontal: 5 },
  sectionLabel: { ...font('800', 11.5, 15), letterSpacing: 1, textTransform: 'uppercase', color: '#664838', marginTop: 6 },
  cards: { gap: 10 },
  metrics: { flexDirection: 'row', alignItems: 'stretch', gap: 10 },
  metricSk: { flex: 1, flexBasis: 0, height: 98, padding: 14, gap: 9, borderRadius: radii.lg, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card },
  analyze: { padding: 12, gap: 10, borderRadius: radii.lg, borderWidth: 1.4, borderColor: '#C9D3B0', backgroundColor: '#F7F8EF' },
  analyzeHead: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingHorizontal: 2 },
  analyzeTitle: { ...font('800', 14.5, 19), color: colors.text },
  analyzeQuote: { ...font('500', 13, 17), color: colors.textSoft, fontStyle: 'italic' },
});
