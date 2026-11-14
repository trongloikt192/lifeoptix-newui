/**
 * Design tokens — plain data, copy as-is to React Native.
 * All numbers are dp (the design frame is 390 × 844).
 */
export const colors = {
  ground: '#FCF2E0', // TODAY_PAPER / MENU_PAPER
  surface: '#FEF7EA',
  surfaceRaised: '#FEF8EC',

  text: '#33110A',
  textStrong: '#2C0806',
  textSoft: '#5C3F2E',
  textMuted: '#6E4E3D',
  textHint: '#6E4E3D',
  textHintTitle: '#664838',
  time: '#715648',

  accent: '#59743A', // green buttons (Add a goal, Save all, Add event)
  onAccent: '#FEFEE7',
  accentRing: '#86944D',
  accentBorderSoft: '#B4BE8B',
  accentBorder: '#86944D',
  accentRingDark: '#304827', // bottom ledge of green buttons
  leaf: '#253709',

  closeIcon: '#253709',
  closeBorder: '#B4B68A',

  chipBorder: '#6C3824',
  chipBg: '#FEF8EE',
  chipText: '#3F1A10',

  spark: '#DBA149',

  noteBorder: '#A8B394',
  noteRule: '#E4DBCF',
  caret: '#517BFA',

  exampleBorder: '#EBA987',
  exampleBg: '#FEEBDC',
  exampleText: '#842A0E',
  exampleIcon: '#B4421B',

  disabledBg: '#E6E2CB',
  disabledBorder: '#CFCAA8',
  disabledText: '#6B6A4C',
  white: '#FFFFFF',

  tabActiveBg: '#ECECDB',
  tabActiveBorder: '#E0E3CF',
  tabActiveText: '#204313',
  tabActiveIcon: '#4A6133',
  tabBg: '#FEF8EC',
  tabBorder: '#F4EADB',
  tabText: '#2C0806',
  tabIcon: '#462417',
} as const;

export const accentOptions = ['#59743A', '#2F5D62', '#8A4B2D', '#5B4B8A'] as const;

export type FontWeight = '400' | '500' | '600' | '700' | '800' | '900';

/**
 * Typography helper.
 * Web: one family + numeric weight.
 * RN bare: Android does not pick a weight from a custom family by fontWeight
 * alone, so swap the body for the per-file family, e.g.
 *   ({ fontFamily: NUNITO[weight], fontSize, lineHeight })
 * with NUNITO = { '400': 'Nunito-Regular', '500': 'Nunito-Medium', ... }.
 */
export const font = (weight: FontWeight, fontSize: number, lineHeight: number) => ({
  fontFamily: 'Nunito',
  fontWeight: weight,
  fontSize,
  lineHeight,
});

export const shadows = {
  close: '0 2px 7px rgba(170,115,60,0.22)',
  note: '0 1px 1px rgba(120,135,100,0.18)',
  example: '0 2px 5px rgba(220,140,100,0.14)',
  tabBar: '0 -3px 10px rgba(160,120,80,0.12)',
  talk: `0 0 0 1px ${colors.accentRing}, inset 3px 2px 6px rgba(255,255,255,0.12)`,
  fab: `0 0 0 1px ${colors.accentRingDark}, 0 5px 12px rgba(190,120,60,0.30)`,
} as const;

/** Soft top-light sheen laid over accent-filled buttons. */
export const accentSheen = 'linear-gradient(180deg, rgba(255,255,255,0.09), rgba(0,0,0,0.05))';

export const MAX_NOTE_LENGTH = 500;

/* ---------- component kit ---------- */

export const ui = {
  line: '#E4DCC0', // dividers inside cards
  lineStrong: '#BAB995', // card / input / chip borders (All entries)
  field: '#FEF9ED',
  card: '#FEF7EA',
  cardBorder: '#CFC9A2',
  sheet: '#FDF4E2',
  sheetBorder: '#D9D2AE',
  scrim: 'rgba(44,26,8,0.42)',
  track: '#EBDEC6',
  skeleton: '#EFE5CC',

  accentSoft: '#E3EEC5',
  accentInk: '#253709',
  chipOn: '#405A27', // selected chip / segment (All entries "All", Reports "Week")
  chipOnBorder: '#2F4319',
  chipOnText: '#FFF8E6',
  barGreen: '#6A952F',
  barAmber: '#FDBC38',
  barBlue: '#71D0EE',
  greenCard: '#3F5A24', // "today" card, quote bubble
  greenCardBorder: '#B5B469',

  danger: '#9A2A08',
  dangerSoft: '#FCE4D4',
  dangerInk: '#7E1A00',
  dangerBorder: '#EDB49B',

  /** Amber text is darkened from the mockup's #B87701 to reach 4.5:1 (as the reference does). */
  warn: '#946000',
  warnSoft: '#FEF3D2',
  warnBorder: '#F2D58A',

  gold: '#946000',
  goldSoft: '#FEF1C5',
  goldBorder: '#F6D58A',

  /** LUNAR tag: amber on cream. SOLAR tag: teal on pale blue. */
  lunar: '#946000',
  lunarSoft: '#FFFDF7',
  solar: '#005C7C',
  solarSoft: '#E4F6FB',

  locked: '#6B6457',
  lockedSoft: '#F1ECE1',

  toastBg: '#2F4319',
  toastErrorBg: '#5A2517',
  toastText: '#FFF8E6',
  toastAction: '#F8D57A',
} as const;

export const radii = { sm: 9, md: 12, lg: 13, xl: 18, sheet: 22, pill: 999 } as const;

export const elevation = {
  card: '0 1px 3px rgba(120,100,60,0.12)',
  raised: '0 2px 4px rgba(150,120,60,0.15)',
  sheet: '0 -6px 22px rgba(90,60,20,0.16)',
  dialog: '0 16px 36px rgba(60,40,10,0.24)',
  toast: '0 8px 20px rgba(40,30,10,0.28)',
  selected: '0 2px 4px rgba(50,70,20,0.25)',
  button: '0 4px 10px rgba(70,80,30,0.25)',
} as const;

export type EntryKind = 'meal' | 'expense' | 'income' | 'activity' | 'sleep';

/**
 * Per-kind tile colours from the mockup (All entries / Review entry):
 * meals + income green, expenses amber, exercise + sleep blue. `fg` is the value colour.
 */
export const kinds: Record<EntryKind, { label: string; fg: string; bg: string; border: string; tag: string }> = {
  meal: { label: 'Meal', fg: '#24500A', bg: '#E1EEBE', border: '#C3C78C', tag: '#275600' },
  expense: { label: 'Expense', fg: '#9A2A08', bg: '#FDE6B1', border: '#F4C96F', tag: '#882B00' },
  income: { label: 'Income', fg: '#24500A', bg: '#E1EEBE', border: '#C9D59A', tag: '#8E5700' },
  activity: { label: 'Activity', fg: '#073445', bg: '#C6EAF7', border: '#AADBE2', tag: '#003148' },
  sleep: { label: 'Sleep', fg: '#073445', bg: '#C6EAF7', border: '#AADBE2', tag: '#003148' },
};

export const kindOrder: EntryKind[] = ['meal', 'expense', 'income', 'activity', 'sleep'];
