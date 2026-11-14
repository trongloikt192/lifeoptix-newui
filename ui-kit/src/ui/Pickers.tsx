import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from '../primitives';
import type { ScrollViewHandle } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, font, ui } from '../theme/tokens';
import { TODAY, compare, daysInMonth, monthLong, sameDay, weekday } from '../data/format';
import type { YMD } from '../data/format';
import { solarToLunar } from '../data/lunar';
import { Icon } from '../icons/Icon';
import { IconButton } from './Button';

/* ---------- Wheel ---------- */

export const WHEEL_ITEM = 40;
const VISIBLE = 5;

type WheelProps = { items: string[]; index: number; onChange: (i: number) => void; width: number; label: string };

/** One snapping wheel column. RN: identical ScrollView props (snapToInterval, decelerationRate). */
export function Wheel({ items, index, onChange, width, label }: WheelProps) {
  const ref = useRef<ScrollViewHandle>(null);
  const current = useRef(index);

  useEffect(() => {
    if (current.current !== index) {
      current.current = index;
      ref.current?.scrollTo({ y: index * WHEEL_ITEM, animated: true });
    }
  }, [index]);

  return (
    <ScrollView
      ref={ref}
      accessibilityLabel={label}
      style={{ width, height: WHEEL_ITEM * VISIBLE }}
      contentContainerStyle={{ paddingVertical: WHEEL_ITEM * 2 }}
      showsVerticalScrollIndicator={false}
      snapToInterval={WHEEL_ITEM}
      decelerationRate="fast"
      contentOffset={{ x: 0, y: index * WHEEL_ITEM }}
      onMomentumScrollEnd={(e) => {
        const i = Math.max(0, Math.min(items.length - 1, Math.round(e.nativeEvent.contentOffset.y / WHEEL_ITEM)));
        current.current = i;
        if (i !== index) onChange(i);
      }}
    >
      {items.map((it, i) => {
        const d = Math.abs(i - index);
        return (
          <Pressable
            key={it + i}
            accessibilityLabel={`${label} ${it}`}
            accessibilityState={{ selected: i === index }}
            onPress={() => ref.current?.scrollTo({ y: i * WHEEL_ITEM })}
            style={styles.wheelItem}
          >
            <Text style={[styles.wheelText, i === index ? styles.wheelOn : { opacity: d === 1 ? 0.75 : 0.42 }]}>{it}</Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/** Lays several wheels on one highlighted band. */
export function WheelGroup({ children }: { children: ReactNode }) {
  return (
    <View style={styles.wheelGroup}>
      <View pointerEvents="none" style={styles.band} accessibilityElementsHidden />
      {children}
    </View>
  );
}

/* ---------- Calendar ---------- */

export type Range = { start: YMD; end?: YMD };

type CalendarProps = {
  month: { y: number; m: number };
  onMonthChange: (m: { y: number; m: number }) => void;
  value?: YMD;
  range?: Range;
  onSelect: (d: YMD) => void;
  /** Lunar mode: the big number is the lunar day, the small one the solar date. */
  primary?: 'solar' | 'lunar';
};

const WEEK = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const CELL = 50;

export function Calendar({ month, onMonthChange, value, range, onSelect, primary = 'solar' }: CalendarProps) {
  const accent = useAccent();
  const first = { y: month.y, m: month.m, d: 1 };
  const lead = (weekday(first) + 6) % 7; // Monday first
  const n = daysInMonth(month.y, month.m);
  const cells: (YMD | null)[] = [...Array(lead).fill(null), ...Array.from({ length: n }, (_, i) => ({ y: month.y, m: month.m, d: i + 1 }))];
  while (cells.length % 7) cells.push(null);

  const step = (dir: number) => {
    const m0 = month.m - 1 + dir;
    onMonthChange({ y: month.y + Math.floor(m0 / 12), m: ((m0 % 12) + 12) % 12 + 1 });
  };

  const lFirst = solarToLunar(first);
  const lLast = solarToLunar({ ...first, d: n });

  const rows: (YMD | null)[][] = [];
  for (let i = 0; i < cells.length; i += 7) rows.push(cells.slice(i, i + 7));

  return (
    <View style={styles.cal}>
      <View style={styles.calHead}>
        <IconButton icon="chevronLeft" label="Previous month" variant="plain" onPress={() => step(-1)} />
        <View style={styles.calTitleWrap} accessibilityLiveRegion="polite">
          <Text style={styles.calTitle}>
            {monthLong(month.m)} {month.y}
          </Text>
          <Text style={[styles.calSub, primary === 'lunar' && { color: ui.lunar }]}>
            Lunar month {lFirst.m}
            {lFirst.m !== lLast.m ? ` – ${lLast.m}` : ''}
          </Text>
        </View>
        <IconButton icon="chevronRight" label="Next month" variant="plain" onPress={() => step(1)} />
      </View>
      <View style={styles.weekRow}>
        {WEEK.map((w, i) => (
          <Text key={w} style={[styles.weekDay, i >= 5 && { color: '#9C4318' }]}>
            {w}
          </Text>
        ))}
      </View>
      {rows.map((row, ri) => (
        <View key={ri} style={styles.weekRow}>
          {row.map((d, ci) => {
            if (!d) return <View key={ci} style={styles.cell} />;
            const l = solarToLunar(d);
            const isToday = sameDay(d, TODAY);
            const inRange = range?.end && compare(d, range.start) >= 0 && compare(d, range.end) <= 0;
            const isEdge = range && (sameDay(d, range.start) || (range.end && sameDay(d, range.end)));
            const selected = value ? sameDay(d, value) : !!isEdge;
            const big = primary === 'lunar' ? l.d : d.d;
            const small = primary === 'lunar' ? `${d.d}/${d.m}` : l.d === 1 ? `${l.d}/${l.m}` : String(l.d);
            const lunarStart = l.d === 1;
            const bandLeft = inRange && range?.end && !sameDay(d, range.start) && ci > 0;
            const bandRight = inRange && range?.end && !sameDay(d, range.end) && ci < 6;
            return (
              <Pressable
                key={ci}
                accessibilityLabel={`${monthLong(d.m)} ${d.d}, lunar ${l.d}/${l.m}${isToday ? ', today' : ''}`}
                accessibilityState={{ selected }}
                onPress={() => onSelect(d)}
                style={styles.cell}
              >
                {inRange && (
                  <View
                    style={[
                      styles.band2,
                      { backgroundColor: ui.accentSoft, left: bandLeft ? 0 : CELL / 2, right: bandRight ? 0 : CELL / 2 },
                      sameDay(d, range!.start) && sameDay(d, range!.end!) && { left: CELL / 2, right: CELL / 2 },
                    ]}
                  />
                )}
                <View
                  style={[
                    styles.dayDisc,
                    selected && { backgroundColor: accent, borderColor: colors.accentRing },
                    !selected && isToday && { borderColor: accent, borderWidth: 1.8 },
                  ]}
                >
                  <Text style={[styles.dayNum, ci >= 5 && !selected && { color: '#9C4318' }, selected && { color: colors.white }]}>{big}</Text>
                  <Text
                    style={[
                      styles.lunarNum,
                      lunarStart && primary === 'solar' && { color: ui.lunar, fontWeight: '800' },
                      selected && { color: '#E9EEDC' },
                    ]}
                  >
                    {small}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      ))}
      <View style={styles.legend}>
        <View style={[styles.legendDot, { borderColor: accent }]} />
        <Text style={styles.legendText}>Today</Text>
        <Icon name="moon" size={13} color={ui.lunar} />
        <Text style={styles.legendText}>{primary === 'lunar' ? 'Big: lunar day · small: solar date' : 'Small number: lunar day'}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wheelGroup: { flexDirection: 'row', justifyContent: 'center', gap: 4, height: WHEEL_ITEM * VISIBLE, overflow: 'hidden' },
  band: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: WHEEL_ITEM * 2,
    height: WHEEL_ITEM,
    borderRadius: 11,
    backgroundColor: ui.accentSoft,
    borderWidth: 1.2,
    borderColor: '#C7D1AE',
  },
  wheelItem: { height: WHEEL_ITEM, alignItems: 'center', justifyContent: 'center' },
  wheelText: { ...font('600', 19, 24), color: colors.text, fontVariant: 'tabular-nums' as never },
  wheelOn: { ...font('900', 21, 26), color: ui.accentInk },

  cal: { gap: 2 },
  calHead: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  calTitleWrap: { flex: 1, alignItems: 'center' },
  calTitle: { ...font('800', 16.5, 22), color: colors.text },
  calSub: { ...font('600', 12, 16), color: colors.textMuted },
  weekRow: { flexDirection: 'row' },
  weekDay: { ...font('700', 12, 16), width: CELL, textAlign: 'center', color: colors.textMuted, paddingBottom: 4 },
  cell: { width: CELL, height: 48, alignItems: 'center', justifyContent: 'center' },
  band2: { position: 'absolute', top: 4, bottom: 4 },
  dayDisc: { width: 44, height: 44, borderRadius: 22, borderWidth: 1, borderColor: 'transparent', alignItems: 'center', justifyContent: 'center' },
  dayNum: { ...font('700', 15.5, 18), color: colors.text },
  lunarNum: { ...font('600', 9.5, 11), color: colors.textMuted },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 8, paddingLeft: 4 },
  legendDot: { width: 12, height: 12, borderRadius: 6, borderWidth: 1.8 },
  legendText: { ...font('500', 12, 16), color: colors.textMuted, marginRight: 8 },
});
