/** Cards around the AI step: what the person said, what we extracted, what we noticed, what we suggest. */
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import { colors, font, kinds, radii, ui } from '../theme/tokens';
import type { EntryKind } from '../theme/tokens';
import { kindOrder } from '../theme/tokens';
import { timeLabel } from '../data/format';
import type { Entry } from '../data/models';
import { Button, IconButton } from './Button';
import { CardHeader, CardShell, DataState, EstimateTag, IconTile, TILE, cardText } from './CardShell';
import type { LoadStatus } from './CardShell';
import { KindTile, StatusPill, entryMeta, entryValue } from './Cards';
import { Decor } from './Decor';
import { ENTRY_SPRIGS, REVIEW_ANCHORS, REVIEW_DECOR } from '../../reference/src/decor/reviewDecor';

/* =====================  Review entry (AI result)  ===================== */

export type ReviewState = 'estimated' | 'check' | 'edited';

type ReviewEntryProps = {
  entry: Entry;
  state: ReviewState;
  /** Extra extracted fields, e.g. calories. `estimated` marks values we guessed. */
  fields: { label: string; value: string; estimated?: boolean; doubtful?: boolean }[];
  question?: string;
  onEdit?: () => void;
  onConfirm?: () => void;
  /** Position in the list: picks the leaf pair (i % 4) painted inside the card, as in Review entry. */
  sprigIndex?: number;
};

const REVIEW_LABEL: Record<EntryKind, string> = { meal: 'MEALS', expense: 'EXPENSES', income: 'INCOME', activity: 'EXERCISE', sleep: 'SLEEP' };

export function ReviewEntryCard({ entry, state, fields, question, onEdit, onConfirm, sprigIndex }: ReviewEntryProps) {
  const v = entryValue(entry);
  const k = kinds[entry.kind];
  const sprigs = sprigIndex == null ? null : ENTRY_SPRIGS[sprigIndex % ENTRY_SPRIGS.length];
  return (
    <CardShell tone={state === 'check' ? 'warn' : 'default'} style={state === 'check' ? undefined : { borderColor: k.border, backgroundColor: '#FEF7E6', borderRadius: 10 }}>
      {sprigs?.left && <Decor asset={sprigs.left} style={sprigs.leftAt} />}
      {sprigs?.right && <Decor asset={sprigs.right} style={sprigs.rightAt} />}
      <View style={styles.reviewHead}>
        <KindTile kind={entry.kind} size={40} />
        <View style={{ flex: 1, gap: 1 }}>
          <Text style={[styles.kindLabel, { color: k.tag }]}>{REVIEW_LABEL[entry.kind]}</Text>
          <Text numberOfLines={1} style={cardText.strong}>
            {entry.title}
          </Text>
          <Text numberOfLines={1} style={cardText.meta}>
            {entryMeta(entry)}
          </Text>
        </View>
        <IconButton icon="edit" label={`Edit ${entry.title}`} onPress={onEdit} />
      </View>

      <View style={styles.fields}>
        {v.text !== '' && <Field label={entry.kind === 'sleep' || entry.kind === 'activity' ? 'Duration' : 'Amount'} value={v.text} color={v.color} doubtful={state === 'check'} />}
        {fields.map((f) => (
          <Field key={f.label} {...f} />
        ))}
      </View>

      {state === 'estimated' && (
        <View style={styles.note}>
          <Icon name="info" size={16} color={ui.gold} />
          <Text style={[cardText.meta, { flex: 1, color: colors.textSoft }]}>Values marked ≈ are our best guess from a typical serving. Tap edit if yours was different.</Text>
        </View>
      )}
      {state === 'check' && (
        <View style={styles.check} accessibilityRole="alert">
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Icon name="alert" size={17} color={ui.warn} />
            <Text style={[styles.checkText, { flex: 1 }]}>{question}</Text>
          </View>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Button label="Looks right" size="sm" variant="secondary" grow onPress={onConfirm} />
            <Button label="Fix it" size="sm" icon="edit" grow onPress={onEdit} />
          </View>
        </View>
      )}
      {state === 'edited' && (
        <View style={styles.note}>
          <Icon name="pen" size={16} color={ui.accentInk} />
          <Text style={[cardText.meta, { flex: 1, color: colors.textSoft }]}>You changed the amount · {timeLabel(entry.time + 4)}</Text>
          <StatusPill tone="accent" label="Edited" icon="check" />
        </View>
      )}
    </CardShell>
  );
}

function Field({ label, value, color, estimated, doubtful }: { label: string; value: string; color?: string; estimated?: boolean; doubtful?: boolean }) {
  return (
    <View style={[styles.field, doubtful && { borderColor: ui.warnBorder, backgroundColor: ui.warnSoft, borderStyle: 'dashed' }]}>
      <Text style={cardText.label}>{label}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
        <Text style={[styles.fieldValue, color ? { color } : null, doubtful && { color: ui.warn }]}>
          {estimated ? '≈ ' : ''}
          {value}
          {doubtful ? ' ?' : ''}
        </Text>
        {estimated && <EstimateTag />}
      </View>
    </View>
  );
}

/* =====================  Original entry (what the person typed or said)  ===================== */

type OriginalEntryProps = {
  mode: 'typed' | 'spoken';
  text: string;
  time: number;
  /** Seconds of audio, spoken mode only. */
  duration?: number;
  /** Phrases to colour by the entry kind they became. */
  highlights?: { phrase: string; kind: EntryKind }[];
  /** Clamp long notes with a "Show all" control. */
  collapsed?: boolean;
  onToggle?: () => void;
};

const WAVE = [5, 9, 14, 8, 18, 12, 6, 15, 20, 11, 7, 13, 17, 9, 5, 12, 16, 8, 6, 10];

export function OriginalEntryCard({ mode, text, time, duration = 12, highlights = [], collapsed, onToggle }: OriginalEntryProps) {
  // Split the note into plain runs and highlighted phrases, in order.
  const parts: { t: string; kind?: EntryKind }[] = [];
  let rest = text;
  for (const h of highlights) {
    const i = rest.toLowerCase().indexOf(h.phrase.toLowerCase());
    if (i < 0) continue;
    if (i > 0) parts.push({ t: rest.slice(0, i) });
    parts.push({ t: rest.slice(i, i + h.phrase.length), kind: h.kind });
    rest = rest.slice(i + h.phrase.length);
  }
  if (rest) parts.push({ t: rest });
  const found = kindOrder.filter((k) => highlights.some((h) => h.kind === k));

  return (
    <View style={{ gap: 12 }}>
      <View style={styles.bubble}>
        <Decor asset={REVIEW_DECOR.quoteLeaves} style={REVIEW_ANCHORS.quoteLeaves} />
        <View style={styles.bubbleHead}>
          <Icon name={mode === 'spoken' ? 'mic' : 'pen'} size={14} color="#D9E2BE" />
          <Text style={styles.bubbleMeta}>
            {mode === 'spoken' ? 'You said' : 'You wrote'} · Today, {timeLabel(time)}
          </Text>
        </View>
        {mode === 'spoken' && (
          <View style={styles.audio}>
            <Pressable accessibilityLabel="Play voice note" style={styles.play}>
              <Icon name="play" size={15} color="#3A4822" />
            </Pressable>
            <View style={styles.wave} accessibilityElementsHidden>
              {WAVE.map((h, i) => (
                <View key={i} style={[styles.waveBar, { height: h, backgroundColor: i < 7 ? '#F8E7A8' : 'rgba(255,248,230,0.4)' }]} />
              ))}
            </View>
            <Text style={styles.bubbleMeta}>0:{String(duration).padStart(2, '0')}</Text>
          </View>
        )}
        <Text numberOfLines={collapsed ? 3 : undefined} style={styles.quote}>
          “
          {parts.map((p, i) =>
            p.kind ? (
              <Text key={i} style={{ backgroundColor: kinds[p.kind].bg, color: kinds[p.kind].fg, fontWeight: '800', borderRadius: 4 }}>
                {p.t}
              </Text>
            ) : (
              <Text key={i}>{p.t}</Text>
            ),
          )}
          ”
        </Text>
        {collapsed != null && (
          <Pressable onPress={onToggle} style={styles.more}>
            <Text style={styles.moreText}>{collapsed ? 'Show all' : 'Show less'}</Text>
            <Icon name={collapsed ? 'chevronDown' : 'chevronUp'} size={16} color="#F8E7A8" />
          </Pressable>
        )}
      </View>
      {found.length > 0 && <AiFoundPill count={highlights.length} seconds={2.6} kinds={found} />}
    </View>
  );
}

/** "AI found N entries · 2.6s" — the small pill under the quote, with its leaf. */
export function AiFoundPill({ count, seconds, kinds: found = [] }: { count: number; seconds: number; kinds?: EntryKind[] }) {
  return (
    <View style={styles.pill}>
      <Icon name="sparkles" size={14} color="#1F2A0A" />
      <Text style={styles.pillText}>
        AI found {count} {count === 1 ? 'entry' : 'entries'} · {seconds}s
      </Text>
      {found.map((k) => (
        <View key={k} style={[styles.legend, { backgroundColor: kinds[k].bg, borderColor: kinds[k].border }]}>
          <Text style={[styles.legendText, { color: kinds[k].fg }]}>{kinds[k].label}</Text>
        </View>
      ))}
      <Decor asset={REVIEW_DECOR.pillLeaf} style={REVIEW_ANCHORS.pillLeaf} />
    </View>
  );
}

/* =====================  Insight  ===================== */

export type InsightType = 'positive' | 'attention' | 'connection';

const INSIGHT: Record<InsightType, { label: string; icon: IconName; tone: keyof typeof TILE; card: 'accent' | 'warn' | 'lunar' }> = {
  positive: { label: 'Going well', icon: 'trendUp', tone: 'accent', card: 'accent' },
  attention: { label: 'Worth a look', icon: 'alert', tone: 'warn', card: 'warn' },
  connection: { label: 'Connection', icon: 'link', tone: 'lunar', card: 'lunar' },
};

type InsightProps = {
  type: InsightType;
  title: string;
  body: string;
  basis: string;
  /** For connections: the two things that move together. */
  link?: { from: EntryKind; to: EntryKind; effect: string };
  status?: LoadStatus;
  onWhy?: () => void;
};

export function InsightCard({ type, title, body, basis, link, status = 'ready', onWhy }: InsightProps) {
  const t = INSIGHT[type];
  return (
    <CardShell tone={status === 'ready' ? t.card : 'default'}>
      <View style={styles.insightHead}>
        <IconTile icon={status === 'ready' ? t.icon : 'sparkles'} tone={TILE[status === 'ready' ? t.tone : 'neutral']} size={30} />
        <Text style={[styles.eyebrow, { color: status === 'ready' ? TILE[t.tone].fg : colors.textSoft }]}>{status === 'ready' ? t.label : 'Insight'}</Text>
      </View>
      {status !== 'ready' ? (
        <DataState
          status={status}
          loadingLabel="Looking for patterns"
          emptyIcon="sparkles"
          emptyTitle="Still getting to know you"
          emptyText="Insights appear after about a week of entries."
        />
      ) : (
        <>
          <Text style={styles.insightTitle}>{title}</Text>
          {link && (
            <View style={styles.link}>
              <KindTile kind={link.from} size={32} />
              <View style={styles.linkLine}>
                <Icon name="link" size={15} color={ui.lunar} />
              </View>
              <KindTile kind={link.to} size={32} />
              <Text style={styles.linkEffect}>{link.effect}</Text>
            </View>
          )}
          <Text style={cardText.body}>{body}</Text>
          <View style={styles.insightFoot}>
            <Text style={[cardText.meta, { flex: 1 }]}>{basis}</Text>
            <Pressable onPress={onWhy} style={styles.why}>
              <Text style={styles.whyText}>Why?</Text>
              <Icon name="chevronRight" size={15} color={colors.accentRingDark} />
            </Pressable>
          </View>
        </>
      )}
    </CardShell>
  );
}

/* =====================  Advice  ===================== */

type Advice = { title: string; why: string; icon: IconName; added?: boolean };

type AdviceProps = { items: Advice[]; status?: LoadStatus; onAdd?: (i: number) => void; onDismiss?: () => void };

export function AdviceCard({ items, status = 'ready', onAdd, onDismiss }: AdviceProps) {
  const single = items.length === 1;
  return (
    <CardShell>
      <CardHeader icon="bulb" tone={TILE.gold} title={single || status !== 'ready' ? 'Try this' : `${items.length} ideas for this week`} subtitle="Based on your last 2 weeks" />
      {status !== 'ready' ? (
        <DataState status={status} skeleton="list" loadingLabel="Finding ideas" emptyIcon="checkCircle" emptyTitle="Nothing to suggest right now" emptyText="You’re on track. We’ll share ideas when we spot one." />
      ) : single ? (
        <View style={{ gap: 10 }}>
          <Text style={styles.adviceTitle}>{items[0].title}</Text>
          <Text style={cardText.body}>{items[0].why}</Text>
          {items[0].added ? (
            <View style={styles.added}>
              <Icon name="checkCircle" size={18} color="#355F25" />
              <Text style={styles.addedText}>Added to your goals</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <Button label="Not now" size="sm" variant="secondary" onPress={onDismiss} />
              <Button label="Make it a goal" size="sm" icon="target" grow onPress={() => onAdd?.(0)} />
            </View>
          )}
        </View>
      ) : (
        <View style={styles.adviceList}>
          {items.map((a, i) => (
            <View key={a.title} style={[styles.adviceRow, i < items.length - 1 && styles.divider]}>
              <IconTile icon={a.icon} tone={TILE.neutral} size={32} />
              <View style={{ flex: 1, gap: 1 }}>
                <Text style={[styles.adviceItem, a.added && { color: colors.textSoft }]}>{a.title}</Text>
                <Text numberOfLines={2} style={cardText.meta}>
                  {a.why}
                </Text>
              </View>
              {a.added ? (
                <View style={styles.addedDot} accessibilityLabel="Added">
                  <Icon name="check" size={16} color={colors.white} strokeWidth={3} />
                </View>
              ) : (
                <IconButton icon="plus" label={`Add “${a.title}” as a goal`} onPress={() => onAdd?.(i)} />
              )}
            </View>
          ))}
        </View>
      )}
    </CardShell>
  );
}

const styles = StyleSheet.create({
  reviewHead: { flexDirection: 'row', alignItems: 'center', gap: 11, marginRight: -8 },
  kindLabel: { ...font('800', 10.4, 13), letterSpacing: 0.5 },
  fields: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  field: { flexGrow: 1, flexBasis: '40%', gap: 2, padding: 10, borderRadius: radii.md, borderWidth: 1, borderColor: ui.line, backgroundColor: '#FBF5EC' },
  fieldValue: { ...font('900', 16, 22), color: colors.text },
  note: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  check: { gap: 10, padding: 11, borderRadius: radii.md, backgroundColor: '#FFF1D9', borderWidth: 1, borderColor: ui.warnBorder },
  checkText: { ...font('700', 13.5, 19), color: '#6E420C' },

  bubble: { borderRadius: 14, backgroundColor: '#3A4822', paddingTop: 10.9, paddingLeft: 14.6, paddingRight: 17.5, paddingBottom: 12, gap: 8, boxShadow: '0 3px 8px rgba(60,70,30,0.25)', overflow: 'hidden' },
  bubbleHead: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  bubbleMeta: { ...font('600', 11.5, 15), color: '#D9E2BE' },
  pill: { alignSelf: 'flex-start', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 6, minHeight: 27.5, borderRadius: 13.75, borderWidth: 1.2, borderColor: '#C2CA95', backgroundColor: '#EEF0CD', paddingLeft: 9.8, paddingRight: 34, paddingVertical: 3, overflow: 'hidden' },
  pillText: { ...font('800', 12.2, 15), color: '#1F2A0A' },
  audio: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 6, paddingRight: 12, borderRadius: radii.pill, backgroundColor: 'rgba(255,248,230,0.12)' },
  play: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#F8E7A8', alignItems: 'center', justifyContent: 'center' },
  wave: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 3, height: 24 },
  waveBar: { width: 3, borderRadius: 2 },
  quote: { ...font('500', 14.5, 21), color: '#FFF8E6' },
  more: { flexDirection: 'row', alignItems: 'center', gap: 3, alignSelf: 'flex-start', height: 36, marginTop: -6 },
  moreText: { ...font('800', 13.5, 18), color: '#F8E7A8' },
  whyText: { ...font('800', 13.5, 18), color: ui.accentInk },
  found: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6, borderTopWidth: 1, borderTopColor: ui.line, paddingTop: 10 },
  legend: { height: 22, paddingHorizontal: 7, borderRadius: 6, borderWidth: 1, justifyContent: 'center' },
  legendText: font('800', 11.5, 15),

  insightHead: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  eyebrow: { ...font('900', 12, 16), letterSpacing: 0.9, textTransform: 'uppercase' },
  insightTitle: { ...font('900', 17, 23), color: colors.text, letterSpacing: -0.2 },
  link: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  linkLine: { width: 34, height: 2, backgroundColor: '#CFC5EA', alignItems: 'center', justifyContent: 'center' },
  linkEffect: { ...font('800', 13.5, 18), color: ui.lunar, flex: 1, marginLeft: 6 },
  insightFoot: { flexDirection: 'row', alignItems: 'center', gap: 8, borderTopWidth: 1, borderTopColor: 'rgba(120,90,60,0.14)', paddingTop: 9 },
  why: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 36, paddingLeft: 8 },

  adviceTitle: { ...font('900', 17, 23), color: colors.text },
  added: { flexDirection: 'row', alignItems: 'center', gap: 7, height: 40, paddingHorizontal: 12, borderRadius: radii.md, backgroundColor: '#E2EDD6', borderWidth: 1, borderColor: '#BED3A8', alignSelf: 'flex-start' },
  addedText: { ...font('800', 13.5, 18), color: '#355F25' },
  adviceList: { borderTopWidth: 1, borderTopColor: ui.line, marginRight: -6 },
  adviceRow: { flexDirection: 'row', alignItems: 'center', gap: 11, paddingVertical: 9 },
  divider: { borderBottomWidth: 1, borderBottomColor: ui.line },
  adviceItem: { ...font('800', 14.5, 19), color: colors.text },
  addedDot: { width: 28, height: 28, borderRadius: 14, marginHorizontal: 8, backgroundColor: '#586B3D', alignItems: 'center', justifyContent: 'center' },
});
