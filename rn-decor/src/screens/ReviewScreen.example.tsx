/**
 * "Review entry" screen (React Native 0.82): what the AI understood from a voice/text note, before saving.
 * Layout numbers are pt measured on the 390pt-wide mockup.
 * Needs: react-native-svg, react-native-safe-area-context, Nunito fonts registered under their PostScript names.
 */
import React, { useRef } from 'react';
import { Animated, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomNav, useNavHeight } from '../components/BottomNav';
import {
  CheckIcon,
  ChevronLeft,
  DumbbellIcon,
  ForkKnifeIcon,
  PencilIcon,
  SparkleIcon,
  WalletIcon,
} from '../components/icons';
import { Decor } from '../decor/Decor';
import {
  ENTRY_SPRIGS,
  REVIEW_ANCHORS,
  REVIEW_DECOR,
  REVIEW_PAPER,
  ReviewBottomDecor,
  ReviewHeaderDecor,
} from '../decor/reviewDecor';

export type EntryKind = 'meal' | 'expense' | 'income' | 'exercise';

export type ReviewEntry = {
  id: string;
  kind: EntryKind;
  title: string;
  /** Third line: "~500 kcal · AI estimate, tap to edit", "−50,000đ", "+2,000,000đ", "30 min". */
  detail: string;
};

export type ReviewData = {
  /** What the user said or typed. */
  transcript: string;
  /** Seconds the AI took, shown in the pill. */
  seconds: number;
  entries: ReviewEntry[];
};

export const SAMPLE_REVIEW: ReviewData = {
  transcript: '“Beef pho for breakfast 50k, ran 30 minutes, got a 2M bonus tonight”',
  seconds: 2.6,
  entries: [
    { id: 'm1', kind: 'meal', title: 'Beef pho', detail: '~500 kcal · AI estimate, tap to edit' },
    { id: 'e1', kind: 'expense', title: 'Beef pho', detail: '−50,000đ' },
    { id: 'i1', kind: 'income', title: 'bonus', detail: '+2,000,000đ' },
    { id: 'x1', kind: 'exercise', title: 'ran', detail: '30 min' },
  ],
};

const KINDS: Record<EntryKind, {
  label: string; tile: string; border: string; labelColor: string; amount?: string;
}> = {
  meal: { label: 'MEALS', tile: '#E2F1B8', border: '#C3C78C', labelColor: '#275600' },
  expense: { label: 'EXPENSES', tile: '#FEE7B1', border: '#F4C96F', labelColor: '#882B00', amount: '#6C1200' },
  income: { label: 'INCOME', tile: '#FEEBB4', border: '#E9D08F', labelColor: '#8E5700', amount: '#182F00' },
  exercise: { label: 'EXERCISE', tile: '#CBEBF2', border: '#AADBE2', labelColor: '#003148' },
};

function KindIcon({ kind, tile }: { kind: EntryKind; tile: string }) {
  switch (kind) {
    case 'meal':
      return <ForkKnifeIcon />;
    case 'expense':
      return (
        <View style={styles.coin}>
          <Text style={styles.coinText}>$</Text>
        </View>
      );
    case 'income':
      return <WalletIcon bg={tile} />;
    case 'exercise':
      return <DumbbellIcon />;
  }
}

type Props = {
  data?: ReviewData;
  onBack?: () => void;
  onEdit?: (id: string) => void;
  onDiscard?: () => void;
  onSaveAll?: () => void;
};

export default function ReviewScreen({ data = SAMPLE_REVIEW, onBack, onEdit, onDiscard, onSaveAll }: Props) {
  const insets = useSafeAreaInsets();
  const navH = useNavHeight();
  const headerH = insets.top + 63.4; // title block, down to the transcript bubble
  const scrollY = useRef(new Animated.Value(0)).current;
  const statusOpacity = scrollY.interpolate({ inputRange: [0, 24], outputRange: [0, 1], extrapolate: 'clamp' });
  const n = data.entries.length;

  return (
    <View style={[styles.root, { paddingBottom: navH }]}>
      {/* cat scene + leaves by the buttons and on the tab bar: fixed, behind the list */}
      <ReviewBottomDecor navHeight={navH} />

      <Animated.ScrollView
        style={{ flex: 1 }}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View style={{ height: headerH }}>
          <ReviewHeaderDecor headerHeight={headerH} />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Back"
            onPress={onBack}
            hitSlop={8}
            style={[styles.back, { top: insets.top + 15.2 }]}
          >
            <ChevronLeft size={17} />
          </Pressable>
          <Text accessibilityRole="header" style={[styles.title, { top: insets.top + 19.3 }]}>Review entry</Text>
        </View>

        {/* what the user said */}
        <View>
          <Decor asset={REVIEW_DECOR.leavesQuoteRight} style={REVIEW_ANCHORS.leavesQuoteRight} />
          <View style={styles.quote}>
            <Decor asset={REVIEW_DECOR.quoteLeaves} style={REVIEW_ANCHORS.quoteLeaves} />
            <Text style={styles.quoteText}>{data.transcript}</Text>
          </View>
        </View>

        <View style={styles.pill}>
          <Decor asset={REVIEW_DECOR.pillLeaf} style={REVIEW_ANCHORS.pillLeaf} />
          <SparkleIcon size={13.7} color="#1F3308" />
          <Text style={styles.pillText}>{`AI found ${n} ${n === 1 ? 'entry' : 'entries'} · ${data.seconds}s`}</Text>
        </View>

        {data.entries.map((e, i) => (
          <View key={e.id} style={{ marginTop: i === 0 ? 11.4 : 10 }}>
            {i === 0 ? <Decor asset={REVIEW_DECOR.leavesCard1Left} style={REVIEW_ANCHORS.leavesCard1Left} /> : null}
            {i === 2 ? <Decor asset={REVIEW_DECOR.leavesCard3Left} style={REVIEW_ANCHORS.leavesCard3Left} /> : null}
            <EntryCard entry={e} index={i} onEdit={() => onEdit?.(e.id)} />
          </View>
        ))}
      </Animated.ScrollView>

      {/* actions stay above the tab bar; the list ends at their top edge */}
      <View style={styles.actions}>
        <Pressable accessibilityRole="button" onPress={onDiscard} style={styles.discard}>
          <Text style={styles.discardText}>Discard</Text>
        </Pressable>
        <Pressable accessibilityRole="button" onPress={onSaveAll} style={styles.save}>
          <Decor asset={REVIEW_DECOR.saveLeavesLeft} style={REVIEW_ANCHORS.saveLeavesLeft} />
          <Decor asset={REVIEW_DECOR.saveLeavesRight} style={REVIEW_ANCHORS.saveLeavesRight} />
          <CheckIcon size={18} />
          <Text style={styles.saveText}>{`Save all ${n}`}</Text>
        </Pressable>
      </View>

      <Animated.View pointerEvents="none" style={[styles.statusBar, { height: insets.top, opacity: statusOpacity }]} />
      <BottomNav active={null} />
    </View>
  );
}

function EntryCard({ entry: e, index, onEdit }: { entry: ReviewEntry; index: number; onEdit: () => void }) {
  const k = KINDS[e.kind];
  const sprigs = ENTRY_SPRIGS[index % ENTRY_SPRIGS.length];
  return (
    <View style={[styles.card, { borderColor: k.border }]}>
      <Decor asset={sprigs.left} style={sprigs.leftAt} />
      {sprigs.right && sprigs.rightAt ? <Decor asset={sprigs.right} style={sprigs.rightAt} /> : null}
      <View style={[styles.tile, { backgroundColor: k.tile }]}>
        <KindIcon kind={e.kind} tile={k.tile} />
      </View>
      <View style={styles.cardText}>
        <Text style={[styles.label, { color: k.labelColor }]}>{k.label}</Text>
        <Text style={styles.entryTitle} numberOfLines={1}>{e.title}</Text>
        <Text style={k.amount ? [styles.amount, { color: k.amount }] : styles.detail} numberOfLines={2}>{e.detail}</Text>
      </View>
      <Pressable accessibilityRole="button" accessibilityLabel={`Edit ${e.title}`} onPress={onEdit} style={styles.edit}>
        <PencilIcon size={21} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: REVIEW_PAPER },
  statusBar: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: REVIEW_PAPER },

  back: {
    position: 'absolute', left: 17.9, width: 34, height: 37.5, borderRadius: 10, backgroundColor: '#6B7836',
    borderWidth: 1, borderColor: '#859352', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 3px 6px rgba(110,80,30,0.22)',
  },
  title: {
    position: 'absolute', left: 65.5, fontFamily: 'Nunito-Black', fontSize: 24.8, lineHeight: 30, letterSpacing: -0.7,
    color: '#2B0300',
  },

  quote: {
    marginLeft: 65.1, marginRight: 12.8, borderRadius: 14, backgroundColor: '#3A4822', paddingTop: 10.9,
    paddingLeft: 14.6, paddingRight: 17.5, paddingBottom: 9.8, boxShadow: '0 3px 8px rgba(60,70,30,0.25)',
  },
  quoteText: { fontFamily: 'Nunito-Medium', fontSize: 13.5, lineHeight: 18.8, color: '#FFF8E6' },

  pill: {
    marginTop: 16, marginLeft: 17.9, alignSelf: 'flex-start', height: 27.5, borderRadius: 13.75, borderWidth: 1.2,
    borderColor: '#C2CA95', backgroundColor: '#EEF0CD', flexDirection: 'row', alignItems: 'center',
    paddingLeft: 9.8, paddingRight: 58,
  },
  pillText: { marginLeft: 7, fontFamily: 'Nunito-ExtraBold', fontSize: 12.2, lineHeight: 15, color: '#1F2A0A' },

  card: {
    flexDirection: 'row', marginLeft: 17.9, marginRight: 18.3, borderRadius: 10, borderWidth: 1.2,
    backgroundColor: '#FEF7E6', paddingTop: 11.8, paddingBottom: 11.4, boxShadow: '0 2px 6px rgba(150,120,60,0.10)',
  },
  tile: {
    position: 'absolute', left: 12.5, top: 12.2, width: 42.2, height: 42.2, borderRadius: 9,
    alignItems: 'center', justifyContent: 'center',
  },
  coin: { width: 21, height: 21, borderRadius: 10.5, backgroundColor: '#5A1A04', alignItems: 'center', justifyContent: 'center' },
  coinText: { fontFamily: 'Nunito-ExtraBold', fontSize: 14, lineHeight: 17, color: '#FFF4DE' },
  cardText: { flex: 1, marginLeft: 67.5, marginRight: 56 },
  label: { fontFamily: 'Nunito-ExtraBold', fontSize: 10.4, lineHeight: 13, letterSpacing: 0.5 },
  entryTitle: { marginTop: 1.2, fontFamily: 'Nunito-ExtraBold', fontSize: 16, lineHeight: 20, letterSpacing: -0.5, color: '#150000' },
  detail: { marginTop: 2.7, fontFamily: 'Nunito-Regular', fontSize: 12.5, lineHeight: 16, color: '#6F4D35' },
  amount: { marginTop: 2.7, fontFamily: 'Nunito-ExtraBold', fontSize: 15.2, lineHeight: 17.5 },
  edit: {
    position: 'absolute', top: 12.6, right: 12.6, width: 38.9, height: 38.9, borderRadius: 10, borderWidth: 1.2,
    borderColor: '#BDB88A', backgroundColor: '#FEF7E3', alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 2px 4px rgba(150,120,60,0.15)',
  },

  /** flexGrow = measured width minus borders/padding (they sit outside the flex share) */
  actions: { flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 17.4, paddingRight: 17.8, marginBottom: 29.2 },
  discard: {
    flexGrow: 113.4, flexBasis: 0, height: 47.2, borderRadius: 12, borderWidth: 1.5, borderColor: '#E3B565',
    backgroundColor: '#FEF7E7', alignItems: 'center', justifyContent: 'center', boxShadow: '0 3px 6px rgba(160,120,60,0.18)',
  },
  discardText: { fontFamily: 'Nunito-ExtraBold', fontSize: 14.9, lineHeight: 19, letterSpacing: -0.3, color: '#360200' },
  save: {
    flexGrow: 213.6, flexBasis: 0, marginLeft: 9.2, height: 50, borderRadius: 12, borderWidth: 1.2, borderColor: '#86944D',
    borderBottomWidth: 5.5, borderBottomColor: '#304827', backgroundColor: '#4B6A32', flexDirection: 'row',
    alignItems: 'center', justifyContent: 'center', paddingLeft: 13.2, boxShadow: '0 4px 10px rgba(70,80,30,0.25)',
  },
  saveText: { marginLeft: 9.5, fontFamily: 'Nunito-ExtraBold', fontSize: 17, lineHeight: 21, letterSpacing: -0.3, color: '#FFFBE8' },
});
