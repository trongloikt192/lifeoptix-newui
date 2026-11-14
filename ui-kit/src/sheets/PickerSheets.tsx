import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, font, radii, ui } from '../theme/tokens';
import { TODAY, addDays, compare, dateLabel, diffDays, durationLabel, rangeLabel, sleepMinutes, timeLabel } from '../data/format';
import type { YMD } from '../data/format';
import { canChi, lunarShort, solarToLunar } from '../data/lunar';
import { Button } from '../ui/Button';
import { Chip, ChipRow, ControlMark, Segmented } from '../ui/Controls';
import { SearchBar } from '../ui/Field';
import { Calendar, Wheel, WheelGroup } from '../ui/Pickers';
import type { Range } from '../ui/Pickers';
import { FooterRow, Sheet } from '../ui/Sheet';
import { StatusPill } from '../ui/Cards';
import { StateView } from '../ui/States';

/* =====================  Date / range picker  ===================== */

type DatePickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  mode?: 'single' | 'range';
  title?: string;
  initial?: YMD;
  initialRange?: Range;
  /** Shows the Solar / Lunar switch. */
  allowLunar?: boolean;
  initialCalendar?: 'solar' | 'lunar';
  onConfirm?: (v: { date?: YMD; range?: Required<Range>; calendar: 'solar' | 'lunar' }) => void;
};

export function DatePickerSheet({
  visible,
  onClose,
  mode = 'single',
  title,
  initial = TODAY,
  initialRange,
  allowLunar = true,
  initialCalendar = 'solar',
  onConfirm,
}: DatePickerSheetProps) {
  const start = mode === 'range' ? (initialRange?.start ?? TODAY) : initial;
  const [month, setMonth] = useState({ y: start.y, m: start.m });
  const [date, setDate] = useState<YMD>(initial);
  const [range, setRange] = useState<Range>(initialRange ?? { start: addDays(TODAY, -6), end: TODAY });
  const [cal, setCal] = useState<'solar' | 'lunar'>(initialCalendar);

  const select = (d: YMD) => {
    if (mode === 'single') return setDate(d);
    if (!range.start || range.end) return setRange({ start: d });
    if (compare(d, range.start) < 0) return setRange({ start: d });
    setRange({ start: range.start, end: d });
  };

  const preset = (r: Required<Range>) => {
    setRange(r);
    setMonth({ y: r.end.y, m: r.end.m });
  };

  const presets: { label: string; r: Required<Range> }[] = [
    { label: 'Last 7 days', r: { start: addDays(TODAY, -6), end: TODAY } },
    { label: 'Last 30 days', r: { start: addDays(TODAY, -29), end: TODAY } },
    { label: 'This month', r: { start: { ...TODAY, d: 1 }, end: TODAY } },
  ];
  const isPreset = (r: Required<Range>) => range.end && compare(r.start, range.start) === 0 && compare(r.end, range.end) === 0;

  const l = solarToLunar(date);
  const ready = mode === 'single' || !!range.end;

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={title ?? (mode === 'range' ? 'Choose dates' : cal === 'lunar' ? 'Choose a lunar date' : 'Choose a date')}
      footer={
        <FooterRow>
          <Button label="Cancel" variant="secondary" grow onPress={onClose} />
          <Button
            label={mode === 'range' && range.end ? `Select ${diffDays(range.start, range.end) + 1} days` : 'Done'}
            grow
            disabled={!ready}
            onPress={() => {
              onConfirm?.(mode === 'range' ? { range: range as Required<Range>, calendar: cal } : { date, calendar: cal });
              onClose();
            }}
          />
        </FooterRow>
      }
    >
      {allowLunar && (
        <Segmented
          label="Calendar"
          value={cal}
          onChange={setCal}
          options={[
            { value: 'solar', label: 'Solar', icon: 'sun' },
            { value: 'lunar', label: 'Lunar', icon: 'moon' },
          ]}
        />
      )}
      {mode === 'range' && (
        <ChipRow wrap={false}>
          {presets.map((p) => (
            <Chip key={p.label} role="radio" label={p.label} selected={!!isPreset(p.r)} onPress={() => preset(p.r)} />
          ))}
        </ChipRow>
      )}
      <Calendar
        month={month}
        onMonthChange={setMonth}
        value={mode === 'single' ? date : undefined}
        range={mode === 'range' ? range : undefined}
        onSelect={select}
        primary={cal}
      />
      <View style={styles.readout} accessibilityLiveRegion="polite">
        <Icon name={cal === 'lunar' ? 'moon' : 'calendar'} size={20} color={cal === 'lunar' ? ui.lunar : colors.textSoft} />
        {mode === 'single' ? (
          <View style={{ flex: 1 }}>
            <Text style={styles.readoutMain}>{cal === 'lunar' ? `Lunar ${lunarShort(l)}, ${canChi(l.y)} year` : dateLabel(date, { year: true })}</Text>
            <Text style={styles.readoutSub}>{cal === 'lunar' ? `Solar: ${dateLabel(date, { year: true })}` : `Lunar ${lunarShort(l)} · ${canChi(l.y)} year`}</Text>
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <Text style={styles.readoutMain}>{range.end ? `${rangeLabel(range.start, range.end)}, ${range.end.y}` : `From ${dateLabel(range.start)}`}</Text>
            <Text style={styles.readoutSub}>{range.end ? `${diffDays(range.start, range.end) + 1} days` : 'Now tap an end date'}</Text>
          </View>
        )}
      </View>
    </Sheet>
  );
}

/* =====================  Time picker  ===================== */

const HOURS = Array.from({ length: 12 }, (_, i) => String(i + 1));
const AMPM = ['AM', 'PM'];

function TimeWheels({ value, onChange, minuteStep }: { value: number; onChange: (m: number) => void; minuteStep: number }) {
  const minutes = useMemo(() => Array.from({ length: 60 / minuteStep }, (_, i) => String(i * minuteStep).padStart(2, '0')), [minuteStep]);
  const h24 = Math.floor(value / 60) % 24;
  const pm = h24 >= 12 ? 1 : 0;
  const h12 = h24 % 12 || 12;
  const mi = Math.round((value % 60) / minuteStep) % minutes.length;
  const set = (h: number, m: number, p: number) => onChange(((h % 12) + p * 12) * 60 + m * minuteStep);
  return (
    <WheelGroup>
      <Wheel label="Hour" width={78} items={HOURS} index={h12 - 1} onChange={(i) => set(i + 1, mi, pm)} />
      <Text style={styles.colon}>:</Text>
      <Wheel label="Minute" width={78} items={minutes} index={mi} onChange={(i) => set(h12, i, pm)} />
      <Wheel label="AM or PM" width={70} items={AMPM} index={pm} onChange={(i) => set(h12, mi, i)} />
    </WheelGroup>
  );
}

type TimePickerSheetProps = {
  visible: boolean;
  onClose: () => void;
  variant: 'entry' | 'reminder' | 'sleep';
  value?: number;
  sleep?: { bed: number; wake: number };
  onConfirm?: (v: number | { bed: number; wake: number }) => void;
};

export function TimePickerSheet({ visible, onClose, variant, value = 10 * 60 + 42, sleep: sleep0 = { bed: 23 * 60, wake: 6 * 60 + 30 }, onConfirm }: TimePickerSheetProps) {
  const [time, setTime] = useState(variant === 'reminder' ? 21 * 60 : value);
  const [sleep, setSleep] = useState(sleep0);
  const [edge, setEdge] = useState<'bed' | 'wake'>('bed');
  const step = variant === 'entry' ? 1 : 5;

  const quick =
    variant === 'entry'
      ? [
          { label: 'Now', v: 10 * 60 + 42 },
          { label: '7:00 AM', v: 7 * 60 },
          { label: '12:00 PM', v: 12 * 60 },
          { label: '7:00 PM', v: 19 * 60 },
        ]
      : [
          { label: '8:00 AM', v: 8 * 60 },
          { label: '12:30 PM', v: 12 * 60 + 30 },
          { label: '9:00 PM', v: 21 * 60 },
        ];

  const dur = sleepMinutes(sleep.bed, sleep.wake);
  const shown = variant === 'sleep' ? sleep[edge] : time;

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={variant === 'entry' ? 'Time of entry' : variant === 'reminder' ? 'Reminder time' : 'Sleep times'}
      subtitle={variant === 'entry' ? 'Today, Wed Nov 11' : variant === 'reminder' ? 'We’ll nudge you once a day at this time.' : 'Last night'}
      footer={
        <FooterRow>
          <Button label="Cancel" variant="secondary" grow onPress={onClose} />
          <Button
            label="Done"
            grow
            onPress={() => {
              onConfirm?.(variant === 'sleep' ? sleep : time);
              onClose();
            }}
          />
        </FooterRow>
      }
    >
      {variant === 'sleep' && (
        <Segmented
          label="Which time"
          value={edge}
          onChange={setEdge}
          options={[
            { value: 'bed', label: `Bedtime · ${timeLabel(sleep.bed)}`, icon: 'moon' },
            { value: 'wake', label: `Wake · ${timeLabel(sleep.wake)}`, icon: 'sun' },
          ]}
        />
      )}
      <Text style={styles.bigTime} accessibilityElementsHidden>
        {timeLabel(shown)}
      </Text>
      <TimeWheels
        key={variant === 'sleep' ? edge : 'one'}
        value={shown}
        minuteStep={step}
        onChange={(m) => (variant === 'sleep' ? setSleep((s) => ({ ...s, [edge]: m })) : setTime(m))}
      />
      {variant === 'sleep' ? (
        <View style={styles.sleepCard}>
          <Icon name="sleep" size={22} color="#53448A" />
          <View style={{ flex: 1 }}>
            <Text style={styles.readoutMain}>{durationLabel(dur)} of sleep</Text>
            <Text style={styles.readoutSub}>
              {timeLabel(sleep.bed)} → {timeLabel(sleep.wake)}
            </Text>
          </View>
          {dur >= 7 * 60 ? <StatusPill tone="healthy" label="Healthy" /> : <StatusPill tone="warn" icon="alert" label="Under 7 h" />}
        </View>
      ) : (
        <ChipRow>
          {quick.map((q) => (
            <Chip key={q.label} role="radio" label={q.label} selected={time === q.v} onPress={() => setTime(q.v)} icon={q.label === 'Now' ? 'clock' : undefined} />
          ))}
        </ChipRow>
      )}
    </Sheet>
  );
}

/* =====================  Selection sheet  ===================== */

export type SelectOption = {
  value: string;
  label: string;
  description?: string;
  icon?: IconName;
  /** Small preview chip for theme options. */
  swatch?: 'system' | 'light' | 'dark';
};

type SelectionSheetProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  options: SelectOption[];
  value: string[];
  multiple?: boolean;
  searchable?: boolean;
  initialQuery?: string;
  onConfirm?: (v: string[]) => void;
};

function Swatch({ kind }: { kind: 'system' | 'light' | 'dark' }) {
  const half = (c: string, side: 'l' | 'r') => <View style={{ position: 'absolute', top: 0, bottom: 0, width: '50%', [side === 'l' ? 'left' : 'right']: 0, backgroundColor: c }} />;
  return (
    <View style={styles.swatch} accessibilityElementsHidden>
      {kind === 'system' ? (
        <>
          {half('#FCF5EA', 'l')}
          {half('#2B261F', 'r')}
        </>
      ) : (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: kind === 'light' ? '#FCF5EA' : '#2B261F' }]} />
      )}
      <View style={[styles.swatchBar, { backgroundColor: kind === 'dark' ? '#8FA36B' : '#586B3D' }]} />
    </View>
  );
}

export function SelectionSheet({ visible, onClose, title, subtitle, options, value, multiple, searchable, initialQuery = '', onConfirm }: SelectionSheetProps) {
  const accent = useAccent();
  const [sel, setSel] = useState<string[]>(value);
  const [q, setQ] = useState(initialQuery);
  const closeTimer = useRef(0);
  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  const shown = options.filter((o) => o.label.toLowerCase().includes(q.trim().toLowerCase()));

  const pick = (v: string) => {
    if (multiple) return setSel((s) => (s.includes(v) ? s.filter((x) => x !== v) : [...s, v]));
    setSel([v]);
    onConfirm?.([v]);
    // A beat so the new choice is seen before the sheet closes.
    closeTimer.current = window.setTimeout(onClose, 280);
  };

  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      tall={searchable}
      footer={
        multiple ? (
          <FooterRow>
            <Button label="Clear" variant="secondary" disabled={!sel.length} onPress={() => setSel([])} />
            <Button
              label={sel.length ? `Done · ${sel.length} selected` : 'Done'}
              grow
              onPress={() => {
                onConfirm?.(sel);
                onClose();
              }}
            />
          </FooterRow>
        ) : undefined
      }
    >
      {searchable && <SearchBar value={q} onChangeText={setQ} placeholder="Search categories" />}
      {shown.length === 0 ? (
        <StateView
          art="search"
          title={`No category called “${q}”`}
          message="Check the spelling, or add it as a new category."
          primary={{ label: `Add “${q}”`, icon: 'plus' }}
          style={{ paddingVertical: 4 }}
        />
      ) : (
        <View accessibilityRole={multiple ? 'list' : 'radiogroup'} style={styles.options}>
          {shown.map((o, i) => {
            const on = sel.includes(o.value);
            return (
              <Pressable
                key={o.value}
                accessibilityRole={multiple ? 'checkbox' : 'radio'}
                accessibilityState={{ checked: on }}
                onPress={() => pick(o.value)}
                style={({ pressed }) => [styles.option, i < shown.length - 1 && styles.optionDivider, on && { backgroundColor: '#F4F5EA' }, pressed && { backgroundColor: '#F7EEE1' }]}
              >
                {o.swatch ? (
                  <Swatch kind={o.swatch} />
                ) : (
                  o.icon && (
                    <View style={[styles.optIcon, on && { backgroundColor: ui.accentSoft, borderColor: '#C3CEA7' }]}>
                      <Icon name={o.icon} size={19} color={on ? ui.accentInk : colors.textSoft} />
                    </View>
                  )
                )}
                <View style={{ flex: 1, gap: 1 }}>
                  <Text style={[styles.optLabel, on && { fontWeight: '800' }]}>{o.label}</Text>
                  {o.description && <Text style={styles.optDesc}>{o.description}</Text>}
                </View>
                {multiple ? (
                  <ControlMark type="checkbox" on={on} />
                ) : on ? (
                  <View style={[styles.tick, { backgroundColor: accent }]}>
                    <Icon name="check" size={15} color={colors.white} strokeWidth={3} />
                  </View>
                ) : (
                  <ControlMark type="radio" on={false} />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  readout: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, borderRadius: radii.md, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card },
  readoutMain: { ...font('800', 15, 20), color: colors.text },
  readoutSub: { ...font('500', 12.5, 17), color: colors.textSoft },

  bigTime: { ...font('900', 34, 40), color: colors.text, textAlign: 'center', letterSpacing: -0.8, marginBottom: -8 },
  colon: { ...font('900', 22, 200), color: colors.text, width: 10, textAlign: 'center' },
  sleepCard: { flexDirection: 'row', alignItems: 'center', gap: 11, padding: 13, borderRadius: radii.md, borderWidth: 1.2, borderColor: '#D9D1EE', backgroundColor: '#F6F3FB' },

  options: { borderRadius: radii.lg, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card, overflow: 'hidden' },
  option: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 58, paddingVertical: 9, paddingHorizontal: 14 },
  optionDivider: { borderBottomWidth: 1, borderBottomColor: ui.line },
  optIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: ui.line, backgroundColor: colors.tabBg, alignItems: 'center', justifyContent: 'center' },
  optLabel: { ...font('600', 15.5, 20), color: colors.text },
  optDesc: { ...font('500', 12.5, 17), color: colors.textMuted },
  tick: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  swatch: { width: 30, height: 40, borderRadius: 7, borderWidth: 1.4, borderColor: ui.lineStrong, overflow: 'hidden' },
  swatchBar: { position: 'absolute', left: 5, right: 5, bottom: 5, height: 6, borderRadius: 3 },
});
