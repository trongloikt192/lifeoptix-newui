import type { EntryKind } from '../theme/tokens';
import { TODAY, addDays } from './format';
import type { YMD } from './format';
import { lunarToSolar } from './lunar';

export type MealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Snack';

export type Entry = {
  id: string;
  kind: EntryKind;
  date: YMD;
  /** Minutes since midnight. */
  time: number;
  title: string;
  /** What the person typed or said; entries are extracted from it. */
  source?: string;
  note?: string;
  amount?: number;
  category?: string;
  mealType?: MealType;
  minutes?: number;
  distanceKm?: number;
  bedtime?: number;
  wake?: number;
  /** 1 – 5 */
  quality?: number;
};

export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Shopping', 'Bills', 'Health', 'Family', 'Other'];
export const INCOME_SOURCES = ['Salary', 'Freelance', 'Sales', 'Gift', 'Other'];
export const ACTIVITIES = ['Gym', 'Walk', 'Run', 'Cycling', 'Yoga', 'Swim'];
export const MEAL_TYPES: MealType[] = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];
export const SLEEP_QUALITY = ['Poor', 'Restless', 'Okay', 'Good', 'Great'];

const y1 = addDays(TODAY, -1);
const y2 = addDays(TODAY, -2);

export const ENTRIES: Entry[] = [
  { id: 'e1', kind: 'meal', date: TODAY, time: 7 * 60 + 40, title: 'Phở bò', mealType: 'Breakfast', amount: 50000, source: 'Pho 50k, gym 45 min' },
  { id: 'e2', kind: 'activity', date: TODAY, time: 6 * 60 + 15, title: 'Gym', category: 'Gym', minutes: 45, source: 'Pho 50k, gym 45 min' },
  { id: 'e3', kind: 'sleep', date: TODAY, time: 6 * 60 + 30, title: 'Sleep', bedtime: 23 * 60, wake: 6 * 60 + 30, quality: 4, source: 'Slept 11pm to 6:30, felt good' },
  { id: 'e4', kind: 'expense', date: TODAY, time: 12 * 60 + 20, title: 'Grab to office', category: 'Transport', amount: 38000, source: 'grab 38k' },
  { id: 'e5', kind: 'income', date: y1, time: 9 * 60, title: 'Logo project', category: 'Freelance', amount: 3500000, source: 'got paid 3.5M for the logo' },
  { id: 'e6', kind: 'meal', date: y1, time: 12 * 60 + 10, title: 'Bún chả', mealType: 'Lunch', amount: 65000, source: 'yesterday I had bun cha 65k' },
  { id: 'e7', kind: 'activity', date: y2, time: 18 * 60, title: 'Evening walk', category: 'Walk', minutes: 30, distanceKm: 2.4 },
];

export const entryById = (id: string) => ENTRIES.find((e) => e.id === id)!;

/* ---------- goals ---------- */

export type GoalType = 'spend' | 'move' | 'sleep' | 'save' | 'meals';
export type Period = 'day' | 'week' | 'month';

export type Goal = {
  id: string;
  type: GoalType;
  title: string;
  target: number;
  current: number;
  period: Period;
  start: YMD;
  end?: YMD;
};

export const GOAL_TYPES: Record<GoalType, { label: string; hint: string; icon: EntryKind; unit: string; limit: boolean; verb: string }> = {
  spend: { label: 'Spending limit', hint: 'Stay under a budget', icon: 'expense', unit: '₫', limit: true, verb: 'Spend at most' },
  move: { label: 'Move more', hint: 'Workouts or walks', icon: 'activity', unit: 'sessions', limit: false, verb: 'Work out' },
  sleep: { label: 'Sleep well', hint: 'Nights with 7 h+', icon: 'sleep', unit: 'nights', limit: false, verb: 'Sleep 7 h+ on' },
  save: { label: 'Save money', hint: 'Put money aside', icon: 'income', unit: '₫', limit: false, verb: 'Save' },
  meals: { label: 'Eat regularly', hint: 'Log your meals', icon: 'meal', unit: 'meals', limit: false, verb: 'Log' },
};

export type GoalStatus = 'notStarted' | 'progress' | 'achieved' | 'over';

export function goalStatus(g: Goal): GoalStatus {
  const t = GOAL_TYPES[g.type];
  if (t.limit) return g.current > g.target ? 'over' : g.current === 0 ? 'notStarted' : 'progress';
  if (g.current === 0) return 'notStarted';
  return g.current >= g.target ? 'achieved' : 'progress';
}

export const GOALS: Record<GoalStatus, Goal> = {
  notStarted: { id: 'g1', type: 'sleep', title: 'Sleep 7 h+', target: 5, current: 0, period: 'week', start: addDays(TODAY, -2) },
  progress: { id: 'g2', type: 'move', title: 'Gym 3× a week', target: 3, current: 2, period: 'week', start: { y: 2026, m: 10, d: 1 } },
  achieved: { id: 'g3', type: 'meals', title: 'Eat breakfast', target: 7, current: 7, period: 'week', start: { y: 2026, m: 9, d: 14 } },
  over: { id: 'g4', type: 'spend', title: 'Eating out budget', target: 1500000, current: 1735000, period: 'week', start: { y: 2026, m: 10, d: 5 } },
};

/* ---------- events ---------- */

export type Repeat = 'none' | 'monthly' | 'yearly';

export type CalendarEvent = {
  id: string;
  name: string;
  calendar: 'solar' | 'lunar';
  /** Next occurrence in the solar calendar. */
  date: YMD;
  lunar?: { d: number; m: number };
  repeat: Repeat;
  remindDays: number;
};

export const EVENTS: Record<'today' | 'soon' | 'later', CalendarEvent> = {
  today: { id: 'v1', name: 'Mom’s birthday', calendar: 'solar', date: TODAY, repeat: 'yearly', remindDays: 3 },
  soon: {
    id: 'v2',
    name: 'Grandpa’s memorial day',
    calendar: 'lunar',
    lunar: { d: 12, m: 10 },
    date: lunarToSolar({ d: 12, m: 10, y: 2026, leap: false })!,
    repeat: 'yearly',
    remindDays: 3,
  },
  later: {
    id: 'v3',
    name: 'Tết Nguyên Đán',
    calendar: 'lunar',
    lunar: { d: 1, m: 1 },
    date: lunarToSolar({ d: 1, m: 1, y: 2027, leap: false })!,
    repeat: 'yearly',
    remindDays: 7,
  },
};

/* ---------- badges ---------- */

export type Badge = {
  id: string;
  name: string;
  description: string;
  icon: 'flame' | 'leaf' | 'sun' | 'expense';
  earnedOn?: YMD;
  progress: { current: number; target: number; unit: string };
  conditions: { label: string; done: boolean }[];
};

export const BADGES: Record<'earned' | 'locked', Badge> = {
  earned: {
    id: 'b1',
    name: 'Seven-day sprout',
    description: 'You wrote something every day for a week.',
    icon: 'flame',
    earnedOn: { y: 2026, m: 11, d: 3 },
    progress: { current: 7, target: 7, unit: 'days' },
    conditions: [{ label: 'Log at least once a day, 7 days in a row', done: true }],
  },
  locked: {
    id: 'b2',
    name: 'Early bird',
    description: 'Wake up before 6:30 AM on 5 days in a row.',
    icon: 'sun',
    progress: { current: 3, target: 5, unit: 'days' },
    conditions: [
      { label: 'Log your sleep with a wake-up time', done: true },
      { label: 'Wake before 6:30 AM', done: true },
      { label: 'Do it 5 days in a row (3 of 5 so far)', done: false },
    ],
  },
};
