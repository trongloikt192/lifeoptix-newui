/** Every mockup in the gallery: overlays, shared components and screen states. */
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { TodayScreen } from '../screens/TodayScreen';
import { useAccent } from '../theme/accent';
import { BADGES, EVENTS, GOALS, entryById } from '../data/models';
import { addDays, TODAY } from '../data/format';
import type { EntryKind } from '../theme/tokens';
import { ConfirmDialog, useToast } from '../ui/Feedback';
import type { ToastOptions } from '../ui/Feedback';
import { BadgeMedal } from '../ui/Cards';
import { Celebration, SuccessCheck } from '../ui/States';
import { AddEntrySheet, EditEntrySheet, EntryDetailSheet, FilterSheet } from '../sheets/EntrySheets';
import { ActionSheet, PermissionPrompt } from '../sheets/MenuSheets';
import { BadgeSheet, EventSheet, GoalSheet, ReminderSheet } from '../sheets/PlanSheets';
import { DatePickerSheet, SelectionSheet, TimePickerSheet } from '../sheets/PickerSheets';
import type { SelectOption } from '../sheets/PickerSheets';
import { EntriesScreen, EventsScreen, GoalsScreen, entryActions, goalActions } from './screens';
import * as B from './boards';
import * as C from './cardBoards';

export type Ctx = { open: boolean; close: () => void };
export type Variant = { id: string; label: string; render: (c: Ctx) => ReactNode; keyboard?: boolean };
export type Group = 'reference' | 'overlays' | 'components' | 'cards' | 'states';
export type Item = { id: string; group: Group; title: string; vi: string; variants: Variant[] };

const v = (id: string, label: string, render: (c: Ctx) => ReactNode, keyboard?: boolean): Variant => ({ id, label, render, keyboard });
const one = (render: () => ReactNode) => [v('all', 'All variants', render)];

/* ---------- small demo wrappers ---------- */

function Today() {
  const accent = useAccent();
  return <TodayScreen accent={accent} />;
}

function ToastDemo(o: ToastOptions) {
  const toast = useToast();
  useEffect(() => toast({ ...o, duration: 600000 }), [toast, o]);
  return <Today />;
}

const TOASTS: Record<string, ToastOptions> = {
  success: { kind: 'success', message: 'Saved to today' },
  error: { kind: 'error', message: 'Couldn’t save. Check your connection.', action: { label: 'Retry', onPress: () => {} } },
  undo: { kind: 'info', message: 'Entry deleted', action: { label: 'Undo', onPress: () => {} } },
};

function EntryMenuDemo({ open, close }: Ctx) {
  const toast = useToast();
  const e = entryById('e1');
  return (
    <>
      <EntriesScreen />
      <ActionSheet visible={open} onClose={close} title={e.title} subtitle="Meal · Today, 7:40 AM" actions={entryActions(() => toast({ kind: 'info', message: 'Entry deleted', action: { label: 'Undo', onPress: () => {} } }), toast)} />
    </>
  );
}

function GoalMenuDemo({ open, close }: Ctx) {
  const toast = useToast();
  return (
    <>
      <GoalsScreen />
      <ActionSheet visible={open} onClose={close} title={GOALS.progress.title} subtitle="Goal · 2 of 3 this week" actions={goalActions(() => {}, () => toast({ kind: 'info', message: 'Goal deleted', action: { label: 'Undo', onPress: () => {} } }), toast)} />
    </>
  );
}

function ConfirmDemo({ open, close, kind }: Ctx & { kind: 'entry' | 'discard' | 'goal' }) {
  const toast = useToast();
  const copy = {
    entry: { title: 'Delete this entry?', message: '“Phở bò” will be removed from today and from your goals.', confirm: 'Delete', cancel: 'Cancel', icon: 'trash' as const },
    discard: { title: 'Discard changes?', message: 'Your edits to this meal won’t be saved.', confirm: 'Discard', cancel: 'Keep editing', icon: 'alert' as const },
    goal: { title: 'Delete this goal?', message: '“Gym 3× a week” and its progress history will be removed. Your entries stay.', confirm: 'Delete goal', cancel: 'Cancel', icon: 'trash' as const },
  }[kind];
  return (
    <>
      {kind === 'goal' ? <GoalsScreen /> : <EntriesScreen />}
      <ConfirmDialog
        visible={open}
        icon={copy.icon}
        title={copy.title}
        message={copy.message}
        confirmLabel={copy.confirm}
        cancelLabel={copy.cancel}
        onCancel={close}
        onConfirm={() => {
          close();
          if (kind !== 'discard') toast({ kind: 'info', message: kind === 'goal' ? 'Goal deleted' : 'Entry deleted', action: { label: 'Undo', onPress: () => {} } });
        }}
      />
    </>
  );
}

const LANGS: SelectOption[] = [
  { value: 'vi', label: 'Tiếng Việt', description: 'Vietnamese', icon: 'globe' },
  { value: 'en', label: 'English', description: 'English', icon: 'globe' },
];
const THEMES: SelectOption[] = [
  { value: 'system', label: 'Match my phone', description: 'Light by day, dark at night', swatch: 'system' },
  { value: 'light', label: 'Light', description: 'Cream paper', swatch: 'light' },
  { value: 'dark', label: 'Dark', description: 'Easy on the eyes at night', swatch: 'dark' },
];
const CATEGORIES: SelectOption[] = [
  { value: 'food', label: 'Food', icon: 'meal' },
  { value: 'transport', label: 'Transport', icon: 'expense' },
  { value: 'shopping', label: 'Shopping', icon: 'tag' },
  { value: 'bills', label: 'Bills', icon: 'note' },
  { value: 'health', label: 'Health', icon: 'heart' },
  { value: 'family', label: 'Family', icon: 'heart' },
  { value: 'gifts', label: 'Gifts', icon: 'award' },
  { value: 'other', label: 'Other', icon: 'grid' },
];

const editVariant = (kind: EntryKind, id: string, label: string) =>
  v(kind, label, ({ open, close }) => (
    <>
      <EntriesScreen />
      {open && <EditEntrySheet visible kind={kind} entry={entryById(id)} onClose={close} />}
    </>
  ));

/* ---------- catalog ---------- */

/** A screen of the reference package, rendered by react-native-web in its own 390 × 844 document. */
function ReferenceFrame({ screen }: { screen: string }) {
  return (
    <iframe
      title={`Reference: ${screen}`}
      src={`${import.meta.env.BASE_URL}reference.html?screen=${screen}`}
      style={{ width: '100%', height: '100%', border: 0, display: 'block' }}
    />
  );
}

export const CATALOG: Item[] = [
  /* ===== reference mockup screens (lifeoptix-newui/rn-decor) ===== */
  ...(
    [
      ['ref-today', 'Today', 'Tổng quan trong ngày', 'today'],
      ['ref-logday', 'How was your day?', 'Ghi nhanh trong ngày', 'logday'],
      ['ref-review', 'Review entry', 'Duyệt kết quả AI', 'review'],
      ['ref-entries', 'All entries', 'Tất cả ghi chép', 'entries'],
      ['ref-goals', 'Weekly goals', 'Mục tiêu tuần', 'goals'],
      ['ref-events', 'Event reminders', 'Nhắc sự kiện', 'events'],
      ['ref-garden', 'Garden', 'Khu vườn', 'garden'],
      ['ref-reports', 'Reports', 'Báo cáo', 'reports'],
      ['ref-coach', 'AI Coach', 'Nhận xét và gợi ý AI', 'coach'],
      ['ref-menu', 'Menu', 'Menu', 'menu'],
    ] as const
  ).map(([id, title, vi, screen]): Item => ({ id, group: 'reference', title, vi, variants: one(() => <ReferenceFrame screen={screen} />) })),

  /* ===== overlays ===== */
  {
    id: 'add-entry',
    group: 'overlays',
    title: 'Bottom Sheet — Add entry',
    vi: 'Thêm ghi chép',
    variants: [
      v('write', 'Write', ({ open, close }) => (<><Today />{open && <AddEntrySheet visible onClose={close} initialMode="write" />}</>)),
      v('speak', 'Record voice', ({ open, close }) => (<><Today />{open && <AddEntrySheet visible onClose={close} initialMode="speak" initialMic="recording" />}</>)),
      v('type', 'Pick entry type', ({ open, close }) => (<><Today />{open && <AddEntrySheet visible onClose={close} initialMode="type" />}</>)),
    ],
  },
  {
    id: 'edit-entry',
    group: 'overlays',
    title: 'Bottom Sheet — Edit entry',
    vi: 'Sửa ghi chép',
    variants: [editVariant('meal', 'e1', 'Meal'), editVariant('expense', 'e4', 'Expense'), editVariant('income', 'e5', 'Income'), editVariant('activity', 'e7', 'Activity'), editVariant('sleep', 'e3', 'Sleep')],
  },
  {
    id: 'filter',
    group: 'overlays',
    title: 'Bottom Sheet — Filter',
    vi: 'Bộ lọc',
    variants: [
      v('none', 'No filters', ({ open, close }) => (<><EntriesScreen />{open && <FilterSheet visible onClose={close} />}</>)),
      v('active', 'Filters on', ({ open, close }) => (<><EntriesScreen />{open && <FilterSheet visible onClose={close} initial={{ kinds: ['meal', 'expense'], preset: '7d' }} />}</>)),
      v('empty', 'Nothing matches', ({ open, close }) => (
        <>
          <EntriesScreen state="filterNoResults" />
          {open && <FilterSheet visible onClose={close} initial={{ kinds: ['sleep'], preset: 'custom', range: { start: { y: 2026, m: 11, d: 1 }, end: { y: 2026, m: 11, d: 5 } } }} />}
        </>
      )),
    ],
  },
  {
    id: 'entry-detail',
    group: 'overlays',
    title: 'Bottom Sheet — Entry detail',
    vi: 'Chi tiết ghi chép',
    variants: (
      [
        ['e1', 'Meal'],
        ['e4', 'Expense'],
        ['e2', 'Activity'],
        ['e3', 'Sleep'],
      ] as const
    ).map(([id, label]) => v(id, label, ({ open, close }) => (<><EntriesScreen />{open && <EntryDetailSheet visible entry={entryById(id)} onClose={close} />}</>))),
  },
  {
    id: 'goal',
    group: 'overlays',
    title: 'Bottom Sheet — Add / edit goal',
    vi: 'Thêm/sửa mục tiêu',
    variants: [
      v('add', 'Add', ({ open, close }) => (<><GoalsScreen />{open && <GoalSheet visible onClose={close} />}</>)),
      v('edit', 'Edit', ({ open, close }) => (<><GoalsScreen />{open && <GoalSheet visible goal={GOALS.over} onClose={close} />}</>)),
    ],
  },
  {
    id: 'event',
    group: 'overlays',
    title: 'Bottom Sheet — Add / edit event',
    vi: 'Thêm/sửa sự kiện',
    variants: [
      v('add', 'Add', ({ open, close }) => (<><EventsScreen />{open && <EventSheet visible onClose={close} />}</>)),
      v('edit-lunar', 'Edit · lunar', ({ open, close }) => (<><EventsScreen />{open && <EventSheet visible event={EVENTS.soon} onClose={close} />}</>)),
      v('edit-solar', 'Edit · solar', ({ open, close }) => (<><EventsScreen />{open && <EventSheet visible event={EVENTS.today} onClose={close} />}</>)),
    ],
  },
  {
    id: 'reminder',
    group: 'overlays',
    title: 'Bottom Sheet — Reminder settings',
    vi: 'Cài đặt nhắc nhở',
    variants: [
      v('on', 'On', ({ open, close }) => (<><EventsScreen />{open && <ReminderSheet visible onClose={close} />}</>)),
      v('off', 'Off (no permission yet)', ({ open, close }) => (<><EventsScreen />{open && <ReminderSheet visible initialOn={false} permissionGranted={false} onClose={close} />}</>)),
    ],
  },
  {
    id: 'badge',
    group: 'overlays',
    title: 'Bottom Sheet — Badge detail',
    vi: 'Chi tiết huy hiệu',
    variants: [
      v('earned', 'Earned', ({ open, close }) => (<><GoalsScreen /><BadgeSheet visible={open} badge={BADGES.earned} onClose={close} /></>)),
      v('locked', 'Locked', ({ open, close }) => (<><GoalsScreen /><BadgeSheet visible={open} badge={BADGES.locked} onClose={close} /></>)),
    ],
  },
  {
    id: 'action-sheet',
    group: 'overlays',
    title: 'Action sheet · “…” menu',
    vi: 'Menu “…”',
    variants: [v('entry', 'For an entry', (c) => <EntryMenuDemo {...c} />), v('goal', 'For a goal', (c) => <GoalMenuDemo {...c} />)],
  },
  {
    id: 'confirm',
    group: 'overlays',
    title: 'Confirmation dialog',
    vi: 'Hộp xác nhận',
    variants: [
      v('delete-entry', 'Delete entry', (c) => <ConfirmDemo {...c} kind="entry" />),
      v('discard', 'Discard changes', (c) => <ConfirmDemo {...c} kind="discard" />),
      v('delete-goal', 'Delete goal', (c) => <ConfirmDemo {...c} kind="goal" />),
    ],
  },
  {
    id: 'date-picker',
    group: 'overlays',
    title: 'Date picker · Date range picker',
    vi: 'Chọn ngày, khoảng ngày',
    variants: [
      v('single', 'Single date', ({ open, close }) => (<><Today />{open && <DatePickerSheet visible onClose={close} allowLunar={false} />}</>)),
      v('range', 'Date range', ({ open, close }) => (<><EntriesScreen />{open && <DatePickerSheet visible mode="range" allowLunar={false} onClose={close} />}</>)),
      v('lunar', 'Lunar / solar', ({ open, close }) => (<><EventsScreen />{open && <DatePickerSheet visible initial={addDays(TODAY, 9)} initialCalendar="lunar" onClose={close} />}</>)),
    ],
  },
  {
    id: 'time-picker',
    group: 'overlays',
    title: 'Time picker',
    vi: 'Chọn giờ',
    variants: [
      v('entry', 'Entry time', ({ open, close }) => (<><Today />{open && <TimePickerSheet visible variant="entry" value={7 * 60 + 40} onClose={close} />}</>)),
      v('reminder', 'Reminder time', ({ open, close }) => (<><EventsScreen />{open && <TimePickerSheet visible variant="reminder" onClose={close} />}</>)),
      v('sleep', 'Sleep times', ({ open, close }) => (<><EntriesScreen />{open && <TimePickerSheet visible variant="sleep" onClose={close} />}</>)),
    ],
  },
  {
    id: 'selection',
    group: 'overlays',
    title: 'Selection sheet',
    vi: 'Chọn ngôn ngữ, giao diện, danh mục',
    variants: [
      v('language', 'Language', ({ open, close }) => (<><EventsScreen />{open && <SelectionSheet visible title="Language" options={LANGS} value={['en']} onClose={close} />}</>)),
      v('theme', 'Appearance', ({ open, close }) => (<><EventsScreen />{open && <SelectionSheet visible title="Appearance" options={THEMES} value={['light']} onClose={close} />}</>)),
      v('category', 'Categories', ({ open, close }) => (<><EntriesScreen />{open && <SelectionSheet visible title="Categories" subtitle="Pick any that apply" options={CATEGORIES} value={['food', 'transport']} multiple searchable onClose={close} />}</>)),
      v('category-none', 'Categories · no match', ({ open, close }) => (<><EntriesScreen />{open && <SelectionSheet visible title="Categories" subtitle="Pick any that apply" options={CATEGORIES} value={['food']} multiple searchable initialQuery="Pets" onClose={close} />}</>)),
    ],
  },
  {
    id: 'toast',
    group: 'overlays',
    title: 'Toast · Snackbar',
    vi: 'Thông báo nhanh',
    variants: [v('success', 'Saved', () => <ToastDemo {...TOASTS.success} />), v('error', 'Error', () => <ToastDemo {...TOASTS.error} />), v('undo', 'Deleted · Undo', () => <ToastDemo {...TOASTS.undo} />)],
  },
  {
    id: 'permission',
    group: 'overlays',
    title: 'Permission prompt',
    vi: 'Xin quyền',
    variants: [
      v('microphone', 'Microphone', ({ open, close }) => (<><Today /><PermissionPrompt visible={open} kind="microphone" onClose={close} /></>)),
      v('notifications', 'Notifications', ({ open, close }) => (<><EventsScreen /><PermissionPrompt visible={open} kind="notifications" onClose={close} /></>)),
      v('denied', 'Denied → Settings', ({ open, close }) => (<><Today /><PermissionPrompt visible={open} kind="denied" onClose={close} /></>)),
    ],
  },

  /* ===== shared components ===== */
  { id: 'button', group: 'components', title: 'Button', vi: 'Nút', variants: one(() => <B.ButtonsBoard />) },
  { id: 'text-field', group: 'components', title: 'Text field · Text area', vi: 'Ô nhập', variants: one(() => <B.FieldsBoard />) },
  { id: 'search-bar', group: 'components', title: 'Search bar', vi: 'Ô tìm kiếm', variants: one(() => <B.SearchBoard />) },
  { id: 'filter-chip', group: 'components', title: 'Filter chip', vi: 'Chip lọc', variants: one(() => <B.ChipsBoard />) },
  { id: 'segmented', group: 'components', title: 'Segmented control', vi: 'Bộ chọn phân đoạn', variants: one(() => <B.SegmentedBoard />) },
  { id: 'toggles', group: 'components', title: 'Switch · Checkbox · Radio', vi: 'Công tắc, ô chọn', variants: one(() => <B.TogglesBoard />) },
  { id: 'entry-card', group: 'components', title: 'Entry card · List row', vi: 'Thẻ ghi chép', variants: one(() => <B.EntryCardsBoard />) },
  { id: 'goal-card', group: 'components', title: 'Goal card · Progress bar', vi: 'Thẻ mục tiêu', variants: one(() => <B.GoalCardsBoard />) },
  { id: 'event-card', group: 'components', title: 'Event card', vi: 'Thẻ sự kiện', variants: one(() => <B.EventCardsBoard />) },
  { id: 'metric-card', group: 'components', title: 'Metric card', vi: 'Thẻ số liệu', variants: one(() => <B.MetricCardsBoard />) },
  { id: 'pills', group: 'components', title: 'Badge · Status pill', vi: 'Huy hiệu, nhãn trạng thái', variants: one(() => <B.PillsBoard />) },
  { id: 'navigation', group: 'components', title: 'Navigation bar · App bar', vi: 'Thanh điều hướng', variants: one(() => <B.NavigationBoard />) },
  { id: 'mic', group: 'components', title: 'Microphone control', vi: 'Nút micro', variants: one(() => <B.MicBoard />) },

  /* ===== cards ===== */
  ...(
    [
      ['card-entry', 'Entry Card', 'Ghi chép trong danh sách', C.EntryCardBoard],
      ['card-review', 'Review Entry Card', 'Kết quả AI, nhãn ước tính', C.ReviewCardBoard],
      ['card-metric', 'Metric Card', 'Một chỉ số nổi bật', C.MetricCardBoard],
      ['card-energy', 'Energy Summary Card', 'Calo nạp, tiêu hao, ngân sách', C.EnergyCardBoard],
      ['card-money', 'Money Summary Card', 'Tổng thu, tổng chi', C.MoneyCardBoard],
      ['card-goal', 'Goal Card', 'Mục tiêu, tiến độ, nguồn tạo', C.GoalCardBoard],
      ['card-goals-summary', 'Goals Summary Card', 'Tổng quan mục tiêu', C.GoalsSummaryBoard],
      ['card-event', 'Event Card', 'Sự kiện, âm/dương, nút nhắc', C.EventCardBoard],
      ['card-calendar', 'Calendar Summary Card', 'Hôm nay và ngày âm lịch', C.CalendarCardBoard],
      ['card-report', 'Report Card', 'Báo cáo theo kỳ', C.ReportCardBoard],
      ['card-insight', 'Insight Card', 'Nhận xét AI', C.InsightCardBoard],
      ['card-advice', 'Advice Card', 'Gợi ý hành động', C.AdviceCardBoard],
      ['card-garden', 'Garden Card', 'Cây, giai đoạn, sức khỏe', C.GardenCardBoard],
      ['card-badge', 'Badge Card', 'Huy hiệu đạt / đang khóa', C.BadgeCardBoard],
      ['card-profile', 'Profile Card', 'Ảnh đại diện, hồ sơ', C.ProfileCardBoard],
      ['card-original', 'Original Entry Card', 'Nội dung gốc để đối chiếu', C.OriginalCardBoard],
    ] as const
  ).map(([id, title, vi, Board]): Item => ({ id, group: 'cards', title, vi, variants: one(() => <Board />) })),

  /* ===== states ===== */
  {
    id: 'empty',
    group: 'states',
    title: 'Empty state',
    vi: 'Chưa có dữ liệu',
    variants: [v('entries', 'No entries', () => <EntriesScreen state="empty" />), v('goals', 'No goals', () => <GoalsScreen empty />), v('events', 'No events', () => <EventsScreen empty />)],
  },
  {
    id: 'no-results',
    group: 'states',
    title: 'No results',
    vi: 'Không có kết quả',
    variants: [v('search', 'Search', () => <EntriesScreen state="searchNoResults" />), v('filter', 'Filters', () => <EntriesScreen state="filterNoResults" />)],
  },
  {
    id: 'loading',
    group: 'states',
    title: 'Loading · Skeleton',
    vi: 'Đang tải',
    variants: [
      v('list', 'Loading list', () => <EntriesScreen state="loading" />),
      v('analyzing', 'Analyzing a note', () => <EntriesScreen state="analyzing" />),
      v('voice', 'Processing voice', ({ open, close }) => (<><Today />{open && <AddEntrySheet visible onClose={close} initialMode="speak" initialMic="processing" />}</>)),
    ],
  },
  {
    id: 'error',
    group: 'states',
    title: 'Error · Retry',
    vi: 'Lỗi, thử lại',
    variants: [
      v('offline', 'Offline banner', () => <EntriesScreen state="offline" />),
      v('load', 'Couldn’t load', () => <EntriesScreen state="loadError" />),
      v('process', 'Processing failed', () => <EntriesScreen state="processFailed" />),
      v('mic', 'Mic error', ({ open, close }) => (<><Today />{open && <AddEntrySheet visible onClose={close} initialMode="speak" initialMic="error" />}</>)),
    ],
  },
  {
    id: 'success',
    group: 'states',
    title: 'Success',
    vi: 'Thành công',
    variants: [
      v('saved', 'Saved', () => <EntriesScreen state="saved" />),
      v('goal', 'Goal reached', ({ open, close }) => (
        <>
          <GoalsScreen />
          <Celebration visible={open} onClose={close} art={<SuccessCheck />} eyebrow="Goal reached" title="Breakfast, 7 days straight" message="You logged breakfast every day this week. Keep the streak going next week?" primary="Keep it going" secondary="Set a new goal" />
        </>
      )),
      v('badge', 'Badge unlocked', ({ open, close }) => (
        <>
          <GoalsScreen />
          <Celebration visible={open} onClose={close} art={<BadgeMedal badge={BADGES.earned} size={96} />} eyebrow="New badge" title={BADGES.earned.name} message={BADGES.earned.description} primary="Nice!" secondary="See all badges" />
        </>
      )),
    ],
  },
  {
    id: 'keyboard',
    group: 'states',
    title: 'Keyboard open',
    vi: 'Bàn phím đang mở',
    variants: [
      v('add', 'Writing a note', ({ open, close }) => (<><Today />{open && <AddEntrySheet visible onClose={close} autoFocus initialText="Bún chả with the team 65k, walked back" />}</>), true),
      v('amount', 'Entering an amount', ({ open, close }) => (<><EntriesScreen />{open && <EditEntrySheet visible kind="expense" autoFocus draftAmount="45,000" onClose={close} />}</>), true),
      v('search', 'Searching', () => <EntriesScreen state="searchTyping" />, true),
    ],
  },
];

export const GROUPS: { id: Group; title: string; vi: string }[] = [
  { id: 'reference', title: 'Mockup screens', vi: 'Màn mockup gốc (rn-decor)' },
  { id: 'overlays', title: 'Sheets & overlays', vi: 'Bottom sheet, hộp thoại' },
  { id: 'components', title: 'Shared components', vi: 'Thành phần dùng chung' },
  { id: 'cards', title: 'Cards', vi: 'Thẻ (16 loại)' },
  { id: 'states', title: 'Screen states', vi: 'Trạng thái giao diện' },
];
