/**
 * "Event reminders" screen (React Native 0.82). Layout numbers are pt measured on the 390pt-wide mockup.
 * Needs: react-native-svg, react-native-safe-area-context, Nunito fonts registered under their PostScript names.
 */
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowRightIcon, BellFilledIcon, BellIcon, ChevronLeft, PlusIcon } from '../components/icons';
import { Decor } from '../decor/Decor';
import {
  EVENT_SPRIGS,
  EVENTS_ANCHORS,
  EVENTS_DECOR,
  EVENTS_PAPER,
  EventsBottomScene,
  EventsHeaderDecor,
  useSceneSpace,
} from '../decor/eventsDecor';

export type EventTone = 'amber' | 'green' | 'blue';

export type ReminderEvent = {
  id: string;
  title: string;
  /** Calendar the date was entered in. Lunar dates are converted to the next solar date by your backend. */
  calendar: 'lunar' | 'solar';
  /** Date as entered, e.g. "17/9" (+ " (leap)" is added when `leapMonth`). */
  sourceDate: string;
  leapMonth?: boolean;
  /** Next solar occurrence, e.g. day "26", month "OCT", label "Oct 26". */
  day: string;
  month: string;
  dateLabel: string;
  daysLeft: number;
  /** e.g. "Death anniversary" */
  kind: string;
  tone: EventTone;
  /** Highlight the next date and the bell in amber (event is close). */
  soon?: boolean;
};

export type TodayInfo = { solar: string; lunarLong: string; lunarShort: string };

export const SAMPLE_TODAY_INFO: TodayInfo = { solar: 'Sat, Oct 24', lunarLong: 'Lunar day 15, month 9', lunarShort: '15/9' };

export const SAMPLE_EVENTS: ReminderEvent[] = [
  { id: 'grandpa', title: "Grandpa's memorial", calendar: 'lunar', sourceDate: '17/9', day: '26', month: 'OCT', dateLabel: 'Oct 26', daysLeft: 2, kind: 'Death anniversary', tone: 'amber', soon: true },
  { id: 'wedding', title: 'Wedding anniversary', calendar: 'solar', sourceDate: '20/11', day: '20', month: 'NOV', dateLabel: 'Nov 20', daysLeft: 27, kind: 'Anniversary', tone: 'green' },
  { id: 'mom', title: "Mom's birthday", calendar: 'lunar', sourceDate: '15/7', leapMonth: true, day: '16', month: 'AUG', dateLabel: 'Aug 16', daysLeft: 296, kind: 'Birthday', tone: 'blue' },
];

const TONES: Record<EventTone, { fill: string; border: string; text: string }> = {
  amber: { fill: '#FEF1C5', border: '#F6D58A', text: '#2C0500' },
  green: { fill: '#E6F8C7', border: '#BFE09A', text: '#1A3300' },
  blue: { fill: '#C3F4FD', border: '#93D8E8', text: '#00212E' },
};

const C = {
  ink: '#2B0300',
  text: '#1D0000',
  muted: '#775038',
  kind: '#815840',
  label: '#5E331D',
  /** Mockup amber text (#AB7202, #9F6C03) darkened to reach 4.5:1; the bell icon keeps the bright tone. */
  amber: '#8F5E00',
  tagLunarBg: '#FAEBAD',
  tagLunarText: '#865A00',
  tagSolarBg: '#B3EEF9',
  tagSolarText: '#016982',
  cream: '#FDF3DA',
  green: '#3C5C2A',
};

type Props = {
  today?: TodayInfo;
  events?: ReminderEvent[];
  onBack?: () => void;
  onEventPress?: (id: string) => void;
  onBellPress?: (id: string) => void;
  onAddEvent?: () => void;
};

export default function EventsScreen({
  today = SAMPLE_TODAY_INFO,
  events = SAMPLE_EVENTS,
  onBack,
  onEventPress,
  onBellPress,
  onAddEvent,
}: Props) {
  const insets = useSafeAreaInsets();
  const headerH = insets.top + 65.7; // title block, down to the "today" card
  const sceneSpace = useSceneSpace();
  const scrollY = useRef(new Animated.Value(0)).current;
  const statusOpacity = scrollY.interpolate({ inputRange: [0, 24], outputRange: [0, 1], extrapolate: 'clamp' });

  return (
    <View style={styles.root}>
      <Animated.ScrollView
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={{ flexGrow: 1, paddingBottom: sceneSpace }}
      >
        {/* the sill scene ends the page: first child, so everything else paints over it */}
        <EventsBottomScene />

        <View style={{ height: headerH }}>
          <EventsHeaderDecor headerHeight={headerH} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={8}
            style={[styles.back, { top: insets.top + 21.6 }]}
          >
            <ChevronLeft size={17} />
          </Pressable>
          <Text accessibilityRole="header" style={[styles.title, { top: insets.top + 24.1 }]}>Event reminders</Text>
        </View>

        {/* today: solar and lunar date */}
        <View>
          <Decor asset={EVENTS_DECOR.leavesTodayLeft} style={EVENTS_ANCHORS.leavesTodayLeft} />
          <Decor asset={EVENTS_DECOR.leavesTodayRight} style={EVENTS_ANCHORS.leavesTodayRight} />
          <View style={styles.today}>
            <Decor asset={EVENTS_DECOR.todayLeavesLeft} style={EVENTS_ANCHORS.todayLeavesLeft} />
            <Decor asset={EVENTS_DECOR.todayLeavesRight} style={EVENTS_ANCHORS.todayLeavesRight} />
            <View style={styles.todayDivider} />
            <View style={styles.rowTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.todayLabel}>TODAY · SOLAR</Text>
                <Text style={styles.todayBig}>{today.solar}</Text>
              </View>
              <View style={{ alignItems: 'flex-end' }}>
                <Text style={styles.todayLabel}>LUNAR</Text>
                <Text style={styles.todayBig}>{today.lunarShort}</Text>
              </View>
            </View>
            <Text style={styles.todayLunar}>{today.lunarLong}</Text>
          </View>
        </View>

        <Text style={styles.listLabel}>YOUR EVENTS · LUNAR DATES AUTO-CONVERTED TO SOLAR</Text>

        {events.map((e, i) => (
          <EventCard
            key={e.id}
            event={e}
            sprigs={EVENT_SPRIGS[i % EVENT_SPRIGS.length]}
            first={i === 0}
            onPress={() => onEventPress?.(e.id)}
            onBell={() => onBellPress?.(e.id)}
          />
        ))}

        <View style={styles.note}>
          <BellIcon size={16} color="#6C452C" />
          <Text style={styles.noteText}>Each event uses its own reminder setting</Text>
        </View>

        <Pressable accessibilityRole="button" onPress={onAddEvent} style={styles.add}>
          <Decor asset={EVENTS_DECOR.addLeavesLeft} style={EVENTS_ANCHORS.addLeavesLeft} />
          <Decor asset={EVENTS_DECOR.addLeavesRight} style={EVENTS_ANCHORS.addLeavesRight} />
          <PlusIcon size={20.5} color="#FFFBE8" />
          <Text style={styles.addText}>Add event</Text>
        </Pressable>
      </Animated.ScrollView>

      <Animated.View pointerEvents="none" style={[styles.statusBar, { height: insets.top, opacity: statusOpacity }]} />
    </View>
  );
}

function EventCard({ event: e, sprigs, first, onPress, onBell }: {
  event: ReminderEvent;
  sprigs: (typeof EVENT_SPRIGS)[number];
  first: boolean;
  onPress: () => void;
  onBell: () => void;
}) {
  const tone = TONES[e.tone];
  const lunar = e.calendar === 'lunar';
  const days = `${e.daysLeft} ${e.daysLeft === 1 ? 'day' : 'days'} left`;
  return (
    <Pressable accessibilityRole="button" onPress={onPress} style={[styles.card, { marginTop: first ? 6.65 : 8.9 }]}>
      <View style={[styles.tile, { backgroundColor: tone.fill, borderColor: tone.border }]}>
        <Text style={[styles.tileDay, { color: tone.text }]}>{e.day}</Text>
        <Text style={[styles.tileMonth, { color: tone.text }]}>{e.month}</Text>
      </View>
      <Decor asset={sprigs.left} style={sprigs.leftAt} />
      <Decor asset={sprigs.right} style={sprigs.rightAt} />

      <View style={styles.cardText}>
        <View style={[styles.rowTop, { alignItems: 'center' }]}>
          <Text style={styles.eventTitle} numberOfLines={1}>{e.title}</Text>
          <View style={[styles.tag, { backgroundColor: lunar ? C.tagLunarBg : C.tagSolarBg }]}>
            <Text style={[styles.tagText, { color: lunar ? C.tagLunarText : C.tagSolarText }]}>{lunar ? 'LUNAR' : 'SOLAR'}</Text>
          </View>
        </View>
        {/* on narrow phones the "→ next date" part drops to its own line instead of being cut */}
        <View style={[styles.rowTop, { alignItems: 'center', flexWrap: 'wrap', marginTop: 3.45 }]}>
          <Text style={[styles.detailMuted, { marginRight: 6 }]}>{`${e.sourceDate} ${e.calendar}${e.leapMonth ? ' (leap)' : ''}`}</Text>
          <View style={[styles.rowTop, { alignItems: 'center' }]}>
            <ArrowRightIcon style={{ marginRight: 5 }} />
            <Text style={[styles.detail, e.soon ? { color: C.amber, fontFamily: 'Nunito-Bold' } : null]}>{`${e.dateLabel} · ${days}`}</Text>
          </View>
        </View>
        <Text style={styles.kind}>{e.kind}</Text>
      </View>

      <Pressable accessibilityRole="button" accessibilityLabel={`Reminder for ${e.title}`} onPress={onBell} style={styles.bell}>
        <BellFilledIcon color={e.soon ? '#B58002' : '#3C4924'} />
      </Pressable>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: EVENTS_PAPER },
  rowTop: { flexDirection: 'row', alignItems: 'flex-start' },
  statusBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: EVENTS_PAPER },

  back: {
    position: 'absolute', left: 17.2, width: 35, height: 36, borderRadius: 10, backgroundColor: '#6B7836',
    borderWidth: 1, borderColor: '#859352', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 6px rgba(110,80,30,0.22)',
  },
  title: {
    position: 'absolute', left: 65.5, fontFamily: 'Nunito-Black', fontSize: 24.3, lineHeight: 30, letterSpacing: -0.4,
    color: C.ink,
  },

  today: {
    marginLeft: 15.1, marginRight: 15.6, borderRadius: 12, borderWidth: 2.6, borderColor: '#B5B469',
    backgroundColor: C.green, paddingTop: 14.2, paddingLeft: 14.1, paddingRight: 12.9, paddingBottom: 11.5,
    boxShadow: '0 0 0 0.8px #6F8A4A, 0 3px 8px rgba(60,80,30,0.25)',
  },
  todayDivider: { position: 'absolute', top: 13, height: 37.6, left: '50%', width: 1.5, marginLeft: -0.75, backgroundColor: 'rgba(253,243,218,0.45)' },
  todayLabel: { fontFamily: 'Nunito-ExtraBold', fontSize: 10.3, lineHeight: 13, letterSpacing: 1, color: C.cream },
  todayBig: { marginTop: 3.15, fontFamily: 'Nunito-ExtraBold', fontSize: 20.6, lineHeight: 25, color: '#FFFBEF' },
  todayLunar: { marginTop: 8.1, fontFamily: 'Nunito-Regular', fontSize: 11.6, lineHeight: 15, color: C.cream },

  listLabel: {
    marginTop: 17.75, marginLeft: 16.6, marginRight: 17, fontFamily: 'Nunito-ExtraBold', fontSize: 10.5, lineHeight: 14.6,
    letterSpacing: 1, color: C.label,
  },

  card: {
    flexDirection: 'row', marginLeft: 15.1, marginRight: 16, borderRadius: 10, borderWidth: 1.2, borderColor: '#F3E2B8',
    backgroundColor: '#FEF7E5', paddingTop: 11.55, paddingBottom: 12.35, boxShadow: '0 2px 6px rgba(150,120,60,0.10)',
  },
  tile: {
    position: 'absolute', left: 10, top: 11.9, width: 46.5, height: 53, borderRadius: 9, borderWidth: 1.2,
    alignItems: 'center', paddingTop: 5.75,
  },
  tileDay: { fontFamily: 'Nunito-ExtraBold', fontSize: 17.4, lineHeight: 21 },
  tileMonth: { marginTop: 1.05, fontFamily: 'Nunito-ExtraBold', fontSize: 10.4, lineHeight: 13 },
  cardText: { flex: 1, marginLeft: 67.5, marginRight: 50 },
  eventTitle: { flexShrink: 1, fontFamily: 'Nunito-ExtraBold', fontSize: 15.3, lineHeight: 19, letterSpacing: -0.4, color: C.ink },
  tag: { marginLeft: 7.7, height: 15.5, paddingHorizontal: 4.5, borderRadius: 5, justifyContent: 'center' },
  tagText: { fontFamily: 'Nunito-ExtraBold', fontSize: 9, lineHeight: 11, letterSpacing: 0.5 },
  detailMuted: { flexShrink: 0, fontFamily: 'Nunito-Regular', fontSize: 11.75, lineHeight: 16.5, color: C.muted },
  detail: { fontFamily: 'Nunito-Regular', fontSize: 11.75, lineHeight: 16.5, color: C.text },
  kind: { marginTop: 0.85, fontFamily: 'Nunito-Regular', fontSize: 11.7, lineHeight: 15.5, color: C.kind },
  bell: {
    position: 'absolute', top: 12.5, right: 8.5, width: 38.4, height: 38.1, borderRadius: 10, borderWidth: 1.2,
    borderColor: '#CFC08A', backgroundColor: '#FEF8EA', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(150,120,60,0.15)',
  },

  note: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 15.95 },
  noteText: { marginLeft: 6.3, fontFamily: 'Nunito-Regular', fontSize: 11.3, lineHeight: 15, color: '#6C452C' },

  add: {
    height: 52.3, marginTop: 9.75, marginLeft: 15.1, marginRight: 15.6, borderRadius: 12, borderWidth: 1.2,
    borderColor: '#86944D', borderBottomWidth: 5, borderBottomColor: '#304827', backgroundColor: '#517035',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(70,80,30,0.25)',
  },
  addText: { marginLeft: 8.75, fontFamily: 'Nunito-ExtraBold', fontSize: 16.6, lineHeight: 21, letterSpacing: -0.4, color: '#FFFBE8' },
});
