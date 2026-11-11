/**
 * "AI Coach" weekly report screen (React Native 0.82). Layout numbers are pt measured on the 390pt-wide mockup.
 * Needs: react-native-svg, react-native-safe-area-context, Nunito fonts registered under their PostScript names.
 */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BulbFilledIcon, CheckCircleIcon, ChevronLeft, LinkIcon, SparkleIcon, WarningIcon } from '../components/icons';
import { Decor, useArtScale } from '../decor/Decor';
import {
  COACH_ANCHORS,
  COACH_DECOR,
  COACH_PAPER,
  CoachBottomDecor,
  CoachHeaderDecor,
  ReportCardArt,
} from '../decor/coachDecor';

export type WatchItem = { title: string; detail: string };

export type CoachReport = {
  week: number;
  headline: string;
  /** e.g. "Week 12/10 – 18/10" */
  periodLabel: string;
  entries: number;
  readMinutes: number;
  /** "Things to watch": the screen shows the first two, one card each. */
  watch: WatchItem[];
  /** "Correlation found"; leave empty to hide the section. */
  correlation?: string;
  advice: string[];
};

export const SAMPLE_COACH: CoachReport = {
  week: 42,
  headline: 'A strong week — Lack of sleep deserves your attention.',
  periodLabel: 'Week 12/10 – 18/10',
  entries: 26,
  readMinutes: 2,
  watch: [
    { title: 'Lack of sleep', detail: '3 nights under 6 hours — you averaged just 6h10 a night, below the recommended 7 hours.' },
    { title: 'Eating out more', detail: 'Food spending hit 612,000đ, up 28% from last week — mostly breakfasts and lunches out.' },
  ],
  correlation:
    'Every day you rated "Tired" came after under 5.5 hours of sleep, with spending 35% above average — short sleep seems to drive impulse buys.',
  advice: [
    'Set a 10:30 PM bedtime reminder on weeknights',
    'Make breakfast at home 3 days a week to eat out less',
    'Keep food spending under 200,000đ a day',
  ],
};

const C = {
  ink: '#2B0F05',
  text: '#1E0A05',
  body: '#5A2E1E',
  meta: '#6E4C38',
  /** Mockup amber is #A86A00–#BF8403; darkened so small text reaches 4.5:1 on the cards. Icons keep the light tone. */
  amber: '#946000',
  olive: '#3F4A10',
  teal: '#00607F',
};

export default function CoachScreen({ data = SAMPLE_COACH, onBack }: { data?: CoachReport; onBack?: () => void }) {
  const insets = useSafeAreaInsets();
  const s = useArtScale();
  const t = Math.min(1, s); // text inside the report card shrinks with the art on narrow phones
  const headerH = insets.top + 59.5;
  const [reportInnerH, setReportInnerH] = useState(0);
  const artScale = reportInnerH > 0 ? reportInnerH / COACH_DECOR.reportArt.height : s;
  const [watch1, watch2] = data.watch;

  return (
    <View style={styles.root}>
      {/* corner art at the bottom stays put and sits BEHIND the list */}
      <CoachBottomDecor />

      <ScrollView contentContainerStyle={{ paddingTop: headerH, paddingBottom: Math.max(66, insets.bottom + 24) }}>
        {/* weekly report: the left sprig goes behind the card, the illustration lives inside it */}
        <View style={{ marginTop: 8.3 }}>
          <Decor asset={COACH_DECOR.leavesReportLeft} style={COACH_ANCHORS.leavesReportLeft} />
          <View style={styles.report} onLayout={(e) => setReportInnerH(e.nativeEvent.layout.height - 2.4)}>
            <ReportCardArt scale={artScale} />
            <View style={styles.row}>
              <SparkleIcon size={14} />
              <Text style={[styles.reportLabel, { fontSize: 9.5 * t, lineHeight: 12 * t }]}>
                {`WEEKLY REPORT · WEEK ${data.week}`}
              </Text>
            </View>
            <Text accessibilityRole="header" style={[styles.headline, { fontSize: 21 * t, lineHeight: 25.2 * t }]}>
              {data.headline}
            </Text>
            <Text style={[styles.meta, { fontSize: 11.5 * t, lineHeight: 15 * t }]}>
              {`${data.periodLabel} · ${data.entries} entries · ${data.readMinutes} min read`}
            </Text>
          </View>
        </View>

        {/* things to watch */}
        <View style={[styles.row, { marginTop: 14, marginLeft: 17.9 }]}>
          <WarningIcon />
          <Text style={[styles.section, { color: C.amber, marginLeft: 6, marginTop: 1.65 }]}>THINGS TO WATCH</Text>
        </View>
        {watch1 ? (
          <View style={{ marginTop: 7.4 }}>
            <WatchCard item={watch1} />
            <Decor asset={COACH_DECOR.leavesSleepRight} style={COACH_ANCHORS.leavesSleepRight} />
          </View>
        ) : null}
        {watch2 ? (
          <View style={{ marginTop: 6.4 }}>
            <WatchCard item={watch2} />
            <Decor asset={COACH_DECOR.flowersEatingRight} style={COACH_ANCHORS.flowersEatingRight} />
          </View>
        ) : null}

        {/* correlation */}
        {data.correlation ? (
          <>
            <View style={[styles.row, { marginTop: 20.8, marginLeft: 18.3 }]}>
              <LinkIcon style={{ marginTop: 1 }} />
              <Text style={[styles.section, { color: C.teal, fontSize: 10.9, marginLeft: 7.3 }]}>CORRELATION FOUND</Text>
            </View>
            <View style={{ marginTop: 7.4 }}>
              <View style={[styles.card, styles.corr]}>
                <Text style={styles.corrText}>{data.correlation}</Text>
              </View>
              <Decor asset={COACH_DECOR.flowersCorrRight} style={COACH_ANCHORS.flowersCorrRight} />
            </View>
          </>
        ) : null}

        {/* advice */}
        <View style={[styles.row, { marginTop: 14.2, marginLeft: 19.2 }]}>
          <BulbFilledIcon />
          <Text style={[styles.section, { color: C.amber, fontSize: 10.6, marginLeft: 9, marginTop: 1.6 }]}>ADVICE</Text>
        </View>
        <View style={[styles.card, styles.advice]}>
          {data.advice.map((a, i) => (
            <View key={a}>
              {i > 0 ? <View style={styles.divider} /> : null}
              <View style={[styles.adviceRow, i === data.advice.length - 1 ? styles.adviceRowLast : null]}>
                <View style={styles.row}>
                  <CheckCircleIcon style={{ marginTop: 0.5 }} />
                  <Text style={styles.adviceText}>{a}</Text>
                </View>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* fixed header, drawn last so the list scrolls under it */}
      <View style={[styles.header, { height: headerH }]}>
        <View style={styles.headerLine} />
        <CoachHeaderDecor headerHeight={headerH} />
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Back"
          onPress={onBack}
          hitSlop={8}
          style={[styles.back, { top: insets.top + 16.2 }]}
        >
          <ChevronLeft size={17} />
        </Pressable>
        <Text accessibilityRole="header" style={[styles.title, { top: insets.top + 21.7 }]}>AI Coach</Text>
      </View>
    </View>
  );
}

function WatchCard({ item }: { item: WatchItem }) {
  return (
    <View style={[styles.card, styles.watch]}>
      <Text style={styles.watchTitle}>{item.title}</Text>
      <Text style={styles.watchDetail}>{item.detail}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COACH_PAPER },
  row: { flexDirection: 'row', alignItems: 'flex-start' },

  header: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: COACH_PAPER },
  headerLine: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 1, backgroundColor: '#E3CBB0' },
  back: {
    position: 'absolute', left: 17.9, width: 32.1, height: 33, borderRadius: 9, backgroundColor: '#6B7836',
    borderWidth: 1, borderColor: '#859352', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 6px rgba(110,80,30,0.22)',
  },
  title: {
    position: 'absolute', left: 62.9, fontFamily: 'Nunito-ExtraBold', fontSize: 17, lineHeight: 22, letterSpacing: -0.3,
    color: C.ink,
  },

  report: {
    marginLeft: 17.2, marginRight: 16.7, borderRadius: 10, borderWidth: 1.2, borderColor: '#C0C59E',
    backgroundColor: '#FCF4DE', overflow: 'hidden', paddingTop: 14.8, paddingLeft: 16.2, paddingRight: 16,
    paddingBottom: 47.7, boxShadow: '0 2px 6px rgba(150,120,60,0.10)',
  },
  reportLabel: { marginLeft: 7.3, marginTop: 1.1, fontFamily: 'Nunito-ExtraBold', letterSpacing: 0.8, color: C.olive },
  headline: { marginTop: 6.3, marginLeft: 0.9, fontFamily: 'Nunito-ExtraBold', letterSpacing: -0.5, color: C.ink },
  meta: { marginTop: 7, marginLeft: 0.9, fontFamily: 'Nunito-Regular', color: C.meta },

  section: { fontFamily: 'Nunito-ExtraBold', fontSize: 10.5, lineHeight: 13, letterSpacing: 0.5 },

  card: { marginLeft: 17.2, marginRight: 16.7, borderRadius: 9, borderWidth: 1.2 },
  watch: {
    borderColor: '#F9D07A', backgroundColor: '#FEF4DA', paddingTop: 10.9, paddingLeft: 14.4, paddingRight: 12,
    paddingBottom: 12.7,
  },
  watchTitle: { fontFamily: 'Nunito-ExtraBold', fontSize: 14.2, lineHeight: 18, letterSpacing: -0.2, color: C.amber },
  watchDetail: { marginTop: 2, fontFamily: 'Nunito-Regular', fontSize: 12.6, lineHeight: 17.9, color: C.body },

  corr: { borderColor: '#8AC5D6', backgroundColor: '#EDF3F0', paddingTop: 11.9, paddingLeft: 15.4, paddingRight: 13, paddingBottom: 15.1 },
  corrText: { fontFamily: 'Nunito-Medium', fontSize: 12.6, lineHeight: 17.8, color: C.text },

  advice: {
    marginTop: 8.3, marginLeft: 17.6, marginRight: 17.6, borderRadius: 12, borderColor: '#F5E1C8', backgroundColor: '#FEF9F0',
    boxShadow: '0 3px 8px rgba(170,120,60,0.10)',
  },
  adviceRow: {
    minHeight: 44.2, justifyContent: 'center', paddingVertical: 9.7,
    paddingLeft: 13.3, paddingRight: 14,
  },
  adviceText: {
    flex: 1, marginLeft: 11.6, fontFamily: 'Nunito-Medium', fontSize: 12.7, lineHeight: 17.5,
    color: C.text,
  },
  /** the mockup's last row sits a little higher in a shorter row */
  adviceRowLast: { minHeight: 41.9, paddingBottom: 13.2 },
  divider: { height: 1, marginHorizontal: 1.4, backgroundColor: '#F3E3CF' },
});
