/**
 * "How was your day?" log screen (React Native 0.82, New Architecture).
 * Needs: react-native-svg (icons) and react-native-safe-area-context (insets), plus the Nunito font files
 * registered under the PostScript names used in F below.
 */
import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';
import { ACCENT, BottomNav, useNavHeight } from '../components/BottomNav';
import { BulbIcon, CalendarIcon, ChevronDown, ChevronRight, CloseIcon, MicIcon } from '../components/icons';
import { Decor, useArtScale } from '../decor/Decor';
import { LOG_DAY_ANCHORS, LOG_DAY_DECOR, LOG_DAY_PAPER, LOG_DAY_SPOTS, LogDayHero, LogDayScreenDecor } from '../decor/logDayDecor';
const F = {
  regular: 'Nunito-Regular',
  medium: 'Nunito-Medium',
  semibold: 'Nunito-SemiBold',
  bold: 'Nunito-Bold',
  extrabold: 'Nunito-ExtraBold',
  black: 'Nunito-Black',
};

const PILL_H = 32.5;
const MIC_H = 83;
const LABEL_GAP = 4.6;
const LABEL_H = 18;

export default function LogDayScreen() {
  const insets = useSafeAreaInsets();
  const s = useArtScale();
  const [text, setText] = useState('');
  const [focused, setFocused] = useState(false);
  const has = text.trim().length > 0;

  const navH = useNavHeight();
  const artH = LOG_DAY_DECOR.heroScene.height * s;
  const pillTop = LOG_DAY_SPOTS.pillTop * artH;
  const micTop = LOG_DAY_SPOTS.micTop * artH;
  const stageH = micTop + MIC_H + LABEL_GAP + LABEL_H;
  const narrow = Math.min(1, s); // shrink the big title a little on screens narrower than the design

  return (
    <View style={styles.root}>
      {/* 1. decorations anchored to the screen */}
      <LogDayScreenDecor />

      <ScrollView
        contentContainerStyle={{ paddingTop: insets.top + 12, paddingBottom: navH + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        {/* header */}
        <View style={styles.header}>
          <Pressable accessibilityRole="button" accessibilityLabel="Close" style={styles.closeHit}>
            <View style={styles.closeCircle}>
              <CloseIcon size={19.2} />
            </View>
          </Pressable>
          <View style={styles.titleBlock}>
            <Text
              style={[styles.title, { fontSize: 27 * narrow, lineHeight: 30 * narrow, letterSpacing: -0.8 * narrow }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              accessibilityRole="header"
            >
              How was your day?
            </Text>
            <Text style={styles.subtitle}>Little moments count, too.</Text>
          </View>
          <Text style={styles.time}>10:42 AM</Text>
        </View>

        {/* 2. hero art + the UI that overlaps it, positioned with LOG_DAY_SPOTS so it lines up at any width */}
        <View style={{ height: stageH, marginTop: -19.6 }}>
          <View style={styles.heroWrap}>
            <LogDayHero />
          </View>
          <View style={[styles.centerRow, { top: pillTop }]}>
            <Pressable accessibilityRole="button" accessibilityLabel="Choose date: Today" hitSlop={6} style={styles.pill}>
              <CalendarIcon size={19.2} color="#3F1A10" />
              <Text style={styles.pillText}>Today</Text>
              <ChevronDown size={16.8} color="#3F1A10" style={{ marginLeft: 6.7 }} />
            </Pressable>
          </View>
          <View style={[styles.centerRow, { top: micTop, alignItems: 'flex-start' }]}>
            <Rays side="left" />
            <Pressable accessibilityRole="button" accessibilityLabel="Hold to talk" style={styles.mic}>
              <MicIcon size={45} />
            </Pressable>
            <Rays side="right" />
          </View>
          <Text style={[styles.holdLabel, { top: micTop + MIC_H + LABEL_GAP }]}>Hold to talk</Text>
        </View>

        {/* 3. text box; the lavender is anchored to its bottom-right corner and drawn first (behind it) */}
        <View style={styles.inputWrap}>
          <Decor asset={LOG_DAY_DECOR.lavenderRight} style={LOG_DAY_ANCHORS.lavenderRight} />
          <View style={styles.inputBox}>
            {[0, 1, 2, 3].map(i => (
              <View key={i} style={[styles.rule, { top: 42.4 + i * 22.9 }]} />
            ))}
            <TextInput
              style={styles.input}
              multiline
              maxLength={500}
              value={text}
              onChangeText={setText}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="A meal, a walk, a little win..."
              placeholderTextColor="#7F6C65"
              textAlignVertical="top"
              accessibilityLabel="What happened today"
            />
            {!has && !focused && <View pointerEvents="none" style={styles.caret} />}
            <Text style={styles.counter}>{text.length}/500</Text>
          </View>
        </View>

        <Pressable onPress={() => setText('Pho 50k, gym 45 min')} hitSlop={5} style={styles.chip}>
          <BulbIcon size={22} />
          <Text style={styles.chipText}>Try: Pho 50k, gym 45 min</Text>
          <ChevronRight size={15.8} color="#842A0E" style={{ marginLeft: 5.1 }} />
        </Pressable>

        <View style={styles.tip}>
          <CalendarIcon size={20.5} color="#53663C" check />
          <View style={styles.tipText}>
            <Text style={styles.tipTitle}>Logging yesterday? Just mention it.</Text>
            <Text style={styles.tipBody}>For example, “yesterday I had bun cha 65k” and it lands on the right date.</Text>
          </View>
        </View>

        {/* 4. the left sprig is anchored to the button below it */}
        <View style={styles.organizeWrap}>
          <Decor asset={LOG_DAY_DECOR.leavesBottomLeft} style={LOG_DAY_ANCHORS.leavesBottomLeft} />
          <Pressable
            disabled={!has}
            accessibilityRole="button"
            style={[styles.organize, has ? { backgroundColor: ACCENT, borderColor: '#97A873' } : null]}
          >
            <Svg width={23.2} height={23.1} viewBox="0 0 24 22" preserveAspectRatio="none" fill={has ? '#FFFFFF' : '#6F806C'} style={{ marginTop: 2.5, opacity: 0.92 }}>
              <Path d="M8.5 2C9.3 7.4 10.6 9.9 15.5 11 10.6 12.1 9.3 14.6 8.5 20 7.7 14.6 6.4 12.1 1.5 11 6.4 9.9 7.7 7.4 8.5 2z" />
              <Path d="M18.5.6c.3 1.8.8 2.4 2.8 2.8-2 .4-2.5 1-2.8 2.8-.3-1.8-.8-2.4-2.8-2.8 2-.4 2.5-1 2.8-2.8z" />
              <Path d="M18.8 15.1c.25 1.5.7 2 2.3 2.3-1.6.3-2.05.8-2.3 2.3-.25-1.5-.7-2-2.3-2.3 1.6-.3 2.05-.8 2.3-2.3z" />
            </Svg>
            <Text style={[styles.organizeText, { color: has ? '#FFFFFF' : '#6F806C' }]}>Organize my notes</Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* shared tab bar (this mockup still showed Lessons as the fourth tab) */}
      <BottomNav tabs={['today', 'garden', 'lessons', 'menu']} active="today" />
    </View>
  );
}

function Rays({ side }: { side: 'left' | 'right' }) {
  const d = side === 'left' ? 'M6.8 2l5.4 4.4M2 14.1h8.6M6.8 27l5.4-4.4' : 'M7.2 2l-5.4 4.4M12 14.1H3.4M7.2 27l-5.4-4.4';
  return (
    <Svg width={14} height={28.5} viewBox="0 0 14 28.5" fill="none" stroke="#DBA149" strokeWidth={2} strokeLinecap="round"
      style={{ marginTop: 28.5, marginLeft: side === 'right' ? 11.2 : 0, marginRight: side === 'left' ? 11.9 : 0 }}>
      <Path d={d} />
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: LOG_DAY_PAPER },
  header: { height: 56, flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 10, paddingRight: 16 },
  closeHit: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center' },
  closeCircle: {
    width: 34.4, height: 34.4, borderRadius: 17.2, backgroundColor: '#FFF9F0', borderWidth: 1, borderColor: '#F2E2CF',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 7px rgba(170,115,60,0.22)',
  },
  titleBlock: { flex: 1, minWidth: 0, marginTop: 8.2, marginLeft: 9.7 },
  title: { fontFamily: F.black, fontSize: 27, lineHeight: 30, letterSpacing: -0.8, color: '#3A1B11' },
  subtitle: { fontFamily: F.medium, fontSize: 14.7, lineHeight: 18, color: '#705345', marginTop: 1.5, marginLeft: 2 },
  time: { fontFamily: F.medium, fontSize: 12, lineHeight: 16, letterSpacing: -0.3, color: '#715648', marginTop: 13 },
  heroWrap: { position: 'absolute', top: 0, left: 0, right: 0, alignItems: 'center' },
  centerRow: { position: 'absolute', left: 0, right: 0, flexDirection: 'row', justifyContent: 'center' },
  pill: {
    height: PILL_H, flexDirection: 'row', alignItems: 'center', paddingLeft: 17.3, paddingRight: 14.7, borderRadius: 999,
    borderWidth: 1.4, borderColor: '#6C3824', backgroundColor: '#FEF8EE', boxShadow: '0 3px 8px rgba(150,95,50,0.16)',
  },
  pillText: { marginLeft: 8.7, fontFamily: F.bold, fontSize: 14, lineHeight: 18, color: '#3F1A10' },
  mic: {
    width: 87, height: MIC_H, borderRadius: 24, borderWidth: 2.5, borderColor: '#B4BE8B', backgroundColor: ACCENT,
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 0 0 1px #46602F, 0 6px 16px rgba(190,125,55,0.28)',
  },
  holdLabel: {
    position: 'absolute', left: 0, right: 0, textAlign: 'center',
    fontFamily: F.bold, fontSize: 13.75, lineHeight: LABEL_H, color: '#3A170E',
  },
  inputWrap: { marginTop: 12.4, marginLeft: 18.5, marginRight: 19.5 },
  inputBox: {
    height: 142, borderRadius: 10, borderWidth: 1.5, borderColor: '#A8B394', backgroundColor: '#FEF9F1',
    boxShadow: '0 1px 1px rgba(120,135,100,0.18)',
  },
  rule: { position: 'absolute', left: 14.4, right: 13.4, height: 1, backgroundColor: '#E4DBCF' },
  input: {
    ...StyleSheet.absoluteFillObject, paddingTop: 15.2, paddingLeft: 25, paddingRight: 14, paddingBottom: 26,
    fontFamily: F.regular, fontSize: 14.5, lineHeight: 22.9, color: '#3A1B11',
  },
  caret: { position: 'absolute', left: 15.8, top: 14, width: 2, height: 22.9, borderRadius: 1, backgroundColor: '#517BFA' },
  counter: { position: 'absolute', right: 13.5, top: 123.5, fontFamily: F.medium, fontSize: 10.5, lineHeight: 12, color: '#7F6C65' },
  chip: {
    alignSelf: 'flex-start', marginTop: 10.1, marginLeft: 18.8, height: 35.4, flexDirection: 'row', alignItems: 'center',
    paddingLeft: 12, paddingRight: 7.9, borderRadius: 999, borderWidth: 1.2, borderColor: '#EBA987', backgroundColor: '#FEEBDC',
    boxShadow: '0 2px 5px rgba(220,140,100,0.14)',
  },
  chipText: { marginLeft: 9.3, fontFamily: F.semibold, fontSize: 12.45, lineHeight: 16, color: '#842A0E' },
  // paddingRight keeps the text clear of the lavender on narrow screens
  tip: { flexDirection: 'row', alignItems: 'flex-start', gap: 11.04, marginTop: 17.3, paddingLeft: 25.86, paddingRight: 75 },
  tipText: { flexShrink: 1, maxWidth: 252 },
  tipTitle: { fontFamily: F.bold, fontSize: 12.45, lineHeight: 16, color: '#442118' },
  tipBody: { marginTop: 1.4, fontFamily: F.regular, fontSize: 12.5, lineHeight: 15.6, color: '#7D6C63' },
  organizeWrap: { marginTop: 29.8, marginLeft: 20, marginRight: 20.4 },
  organize: {
    height: 44.5, borderRadius: 9, borderWidth: 1, borderColor: '#D0D3C5', backgroundColor: '#DEDFD2',
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4.3, paddingLeft: 4.1,
  },
  organizeText: { marginTop: 4, fontFamily: F.semibold, fontSize: 13.8, lineHeight: 18 },
});
