/** Date / number helpers on plain {y,m,d} values — no time zones involved. */

export type YMD = { y: number; m: number; d: number };

/** The mockup's "today". */
export const TODAY: YMD = { y: 2026, m: 11, d: 11 };

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_LONG = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const toUTC = ({ y, m, d }: YMD) => Date.UTC(y, m - 1, d);
const fromUTC = (t: number): YMD => {
  const dt = new Date(t);
  return { y: dt.getUTCFullYear(), m: dt.getUTCMonth() + 1, d: dt.getUTCDate() };
};

export const addDays = (a: YMD, n: number) => fromUTC(toUTC(a) + n * 86400000);
export const diffDays = (a: YMD, b: YMD) => Math.round((toUTC(b) - toUTC(a)) / 86400000);
export const sameDay = (a: YMD, b: YMD) => a.y === b.y && a.m === b.m && a.d === b.d;
export const compare = (a: YMD, b: YMD) => toUTC(a) - toUTC(b);
/** 0 = Sunday. */
export const weekday = (a: YMD) => new Date(toUTC(a)).getUTCDay();
export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();

export const monthShort = (m: number) => MONTHS[m - 1];
export const monthLong = (m: number) => MONTHS_LONG[m - 1];
export const weekdayShort = (a: YMD) => WEEKDAYS[weekday(a)];

/** "Wed, Nov 11" (year added when it isn't the current one). */
export function dateLabel(a: YMD, opts: { year?: boolean; relative?: boolean } = {}) {
  if (opts.relative) {
    const n = diffDays(TODAY, a);
    if (n === 0) return 'Today';
    if (n === -1) return 'Yesterday';
    if (n === 1) return 'Tomorrow';
  }
  const base = `${weekdayShort(a)}, ${monthShort(a.m)} ${a.d}`;
  return opts.year || a.y !== TODAY.y ? `${base}, ${a.y}` : base;
}

export function rangeLabel(a: YMD, b: YMD) {
  if (a.y === b.y && a.m === b.m) return `${monthShort(a.m)} ${a.d} – ${b.d}`;
  return `${monthShort(a.m)} ${a.d} – ${monthShort(b.m)} ${b.d}`;
}

/** Minutes since midnight → "7:30 AM". */
export function timeLabel(min: number) {
  const h24 = Math.floor(min / 60) % 24;
  const mm = String(min % 60).padStart(2, '0');
  const h = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h}:${mm} ${h24 < 12 ? 'AM' : 'PM'}`;
}

/** 450 → "7 h 30 min". */
export function durationLabel(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (!h) return `${m} min`;
  return m ? `${h} h ${m} min` : `${h} h`;
}

/** Sleep length across midnight. */
export const sleepMinutes = (bed: number, wake: number) => (wake - bed + 1440) % 1440;

/** 50000 → "50,000 ₫". */
export const money = (n: number) => `${Math.round(n).toLocaleString('en-US')} ₫`;

/** Digits only → grouped, for amount fields. */
export const groupDigits = (s: string) => {
  const digits = s.replace(/\D/g, '').replace(/^0+(?=\d)/, '');
  return digits ? Number(digits).toLocaleString('en-US') : '';
};
export const parseAmount = (s: string) => Number(s.replace(/\D/g, '')) || 0;
