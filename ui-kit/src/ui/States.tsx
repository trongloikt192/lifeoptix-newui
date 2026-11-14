import type { ReactNode } from 'react';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { Circle, EnteringView, Modal, Path, PulseView, Rect, StyleSheet, Svg, Text, View } from '../primitives';
import type { StyleProp } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, elevation, font, radii, ui } from '../theme/tokens';
import { Button } from './Button';
import { Decor } from './Decor';
import { REVIEW_DECOR } from '../../reference/src/decor/reviewDecor';
import { COACH_DECOR } from '../../reference/src/decor/coachDecor';
import { EVENTS_DECOR } from '../../reference/src/decor/eventsDecor';

/* ---------- illustrations (line art, one leaf of colour — kept quiet on purpose) ---------- */

const INK = '#8A6A58';
const LEAF = '#7E9460';

export type Illustration = 'entries' | 'goals' | 'events' | 'search' | 'offline' | 'failed';

/** Empty states reuse the mockup's watercolour scenes; search / offline / failure keep quiet line art. */
const SCENES = {
  entries: { asset: REVIEW_DECOR.catScene, width: 230 },
  goals: { asset: COACH_DECOR.reportArt, width: 220 },
  events: { asset: EVENTS_DECOR.bottomScene, width: 250 },
} as const;

export function Art({ name, size = 132 }: { name: Illustration; size?: number }) {
  if (name === 'entries' || name === 'goals' || name === 'events') {
    const sc = SCENES[name];
    const k = sc.width / sc.asset.width;
    return (
      <View style={{ width: sc.width, height: sc.asset.height * k }} accessibilityElementsHidden>
        <Decor asset={sc.asset} scale={k} style={{ left: 0, top: 0 }} />
      </View>
    );
  }
  const common = { fill: 'none', stroke: INK, strokeWidth: 2.4, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const };
  return (
    <Svg width={size} height={size} viewBox="0 0 132 132" aria-hidden="true">
      <Circle cx={66} cy={70} r={56} fill="#F6ECDD" />
      {name === 'search' && (
        <>
          <Circle cx={60} cy={62} r={24} {...common} fill="#FFFCF6" />
          <Path d="M78 80l18 18" {...common} strokeWidth={5} />
          <Path d="M51 58c2-4 6-6 10-6" {...common} />
          <Path d="M52 70h16" {...common} strokeDasharray="2 5" />
        </>
      )}
      {name === 'offline' && (
        <>
          <Path d="M42 88h48a16 16 0 0 0 0-32 22 22 0 0 0-42-6 14 14 0 0 0-6 38z" {...common} fill="#FFFCF6" />
          <Path d="M36 40l60 60" {...common} stroke="#A23A22" />
        </>
      )}
      {name === 'failed' && (
        <>
          <Rect x={40} y={34} width={52} height={66} rx={8} {...common} fill="#FFFCF6" />
          <Path d="M50 52h30M50 63h22" {...common} />
          <Circle cx={86} cy={88} r={16} fill={ui.dangerSoft} stroke="#A23A22" strokeWidth={2.4} />
          <Path d="M86 80v9" stroke="#A23A22" strokeWidth={2.6} strokeLinecap="round" />
          <Circle cx={86} cy={95} r={1.8} fill="#A23A22" />
        </>
      )}
    </Svg>
  );
}

/* ---------- Empty / no results / error ---------- */

type StateViewProps = {
  art: Illustration;
  title: string;
  message: string;
  primary?: { label: string; icon?: IconName; onPress?: () => void; loading?: boolean };
  secondary?: { label: string; onPress?: () => void };
  children?: ReactNode;
  style?: StyleProp;
};

export function StateView({ art, title, message, primary, secondary, children, style }: StateViewProps) {
  return (
    <View style={[styles.state, style]} accessibilityLiveRegion="polite">
      <Art name={art} />
      <Text accessibilityRole="header" style={styles.stateTitle}>
        {title}
      </Text>
      <Text style={styles.stateMsg}>{message}</Text>
      {children}
      {(primary || secondary) && (
        <View style={styles.stateActions}>
          {primary && <Button label={primary.label} icon={primary.icon} onPress={primary.onPress} loading={primary.loading} />}
          {secondary && <Button label={secondary.label} variant="ghost" onPress={secondary.onPress} />}
        </View>
      )}
    </View>
  );
}

/** Thin banner for a problem that doesn't replace the content (e.g. offline). */
export function Banner({ tone, icon, title, message, action }: { tone: 'warn' | 'danger' | 'info'; icon: IconName; title: string; message?: string; action?: { label: string; onPress?: () => void } }) {
  const c = tone === 'danger' ? { bg: ui.dangerSoft, border: ui.dangerBorder, ink: ui.dangerInk } : tone === 'warn' ? { bg: ui.warnSoft, border: ui.warnBorder, ink: ui.warn } : { bg: ui.accentSoft, border: '#C3CEA7', ink: ui.accentInk };
  return (
    <View accessibilityRole="alert" style={[styles.banner, { backgroundColor: c.bg, borderColor: c.border }]}>
      <Icon name={icon} size={20} color={c.ink} />
      <View style={{ flex: 1, gap: 1 }}>
        <Text style={[styles.bannerTitle, { color: c.ink }]}>{title}</Text>
        {message && <Text style={styles.bannerMsg}>{message}</Text>}
      </View>
      {action && <Button label={action.label} size="sm" variant="secondary" onPress={action.onPress} />}
    </View>
  );
}

/* ---------- Skeleton ---------- */

export function Bone({ w, h = 12, r = 6, style }: { w: number | string; h?: number; r?: number; style?: StyleProp }) {
  return <View style={[{ width: w as number, height: h, borderRadius: r, backgroundColor: ui.skeleton }, style]} />;
}

export function SkeletonCard({ lines = 2 }: { lines?: number }) {
  return (
    <View style={styles.skCard}>
      <Bone w={40} h={40} r={12} />
      <View style={{ flex: 1, gap: 8 }}>
        <Bone w="62%" h={13} />
        {lines > 1 && <Bone w="40%" h={11} />}
      </View>
      <Bone w={56} h={13} />
    </View>
  );
}

/** Pulsing placeholder list; announces itself once to screen readers. */
export function SkeletonList({ count = 4, label = 'Loading entries' }: { count?: number; label?: string }) {
  return (
    <View accessibilityLabel={label} accessibilityRole="progressbar" style={{ gap: 10 }}>
      <PulseView style={{ gap: 10 }}>
        {Array.from({ length: count }, (_, i) => (
          <SkeletonCard key={i} />
        ))}
      </PulseView>
    </View>
  );
}

/* ---------- Celebration (success moments) ---------- */

type CelebrationProps = {
  visible: boolean;
  onClose: () => void;
  art: ReactNode;
  eyebrow: string;
  title: string;
  message: string;
  primary: string;
  secondary?: string;
  onSecondary?: () => void;
};

export function Celebration({ visible, onClose, art, eyebrow, title, message, primary, secondary, onSecondary }: CelebrationProps) {
  const accent = useAccent();
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={[StyleSheet.absoluteFill, styles.center, { backgroundColor: ui.scrim }]}>
        <EnteringView entering="ZoomIn">
          <View accessibilityViewIsModal accessibilityLabel={title} style={styles.celebrate}>
            <Svg width={300} height={70} viewBox="0 0 300 70" style={{ position: 'absolute', top: 10, left: 13 }} aria-hidden="true">
              {[
                [40, 30, 'M0 0l4 9 9 4-9 4-4 9-4-9-9-4 9-4z', '#E2B65A'],
                [262, 22, 'M0 0l3 7 7 3-7 3-3 7-3-7-7-3 7-3z', '#E2B65A'],
                [232, 54, 'M0 0l2 5 5 2-5 2-2 5-2-5-5-2 5-2z', LEAF],
                [70, 58, 'M0 0l2 5 5 2-5 2-2 5-2-5-5-2 5-2z', LEAF],
              ].map(([x, y, d, c]) => (
                <Path key={`${x}`} d={d as string} transform={`translate(${x} ${y})`} fill={c as string} />
              ))}
            </Svg>
            <View style={styles.celebrateArt}>{art}</View>
            <Text style={[styles.eyebrow, { color: accent }]}>{eyebrow}</Text>
            <Text accessibilityRole="header" style={styles.celebrateTitle}>
              {title}
            </Text>
            <Text style={styles.stateMsg}>{message}</Text>
            <View style={{ alignSelf: 'stretch', gap: 4, marginTop: 18 }}>
              <Button label={primary} onPress={onClose} />
              {secondary && <Button label={secondary} variant="ghost" onPress={onSecondary ?? onClose} />}
            </View>
          </View>
        </EnteringView>
      </View>
    </Modal>
  );
}

export function SuccessCheck({ size = 84 }: { size?: number }) {
  const accent = useAccent();
  return (
    <View style={{ width: size, height: size, borderRadius: size / 2, backgroundColor: accent, borderWidth: 4, borderColor: '#DCE5C8', alignItems: 'center', justifyContent: 'center', boxShadow: elevation.raised }}>
      <Icon name="check" size={size * 0.5} color={colors.white} strokeWidth={3} />
    </View>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: 'center', paddingHorizontal: 28, paddingVertical: 20, gap: 8 },
  stateTitle: { ...font('900', 20, 26), color: colors.text, textAlign: 'center', marginTop: 6, letterSpacing: -0.3 },
  stateMsg: { ...font('500', 14.5, 21), color: colors.textSoft, textAlign: 'center' },
  stateActions: { alignSelf: 'stretch', gap: 4, marginTop: 14 },

  banner: { flexDirection: 'row', alignItems: 'center', gap: 10, padding: 12, borderRadius: radii.md, borderWidth: 1.2 },
  bannerTitle: font('800', 14, 19),
  bannerMsg: { ...font('500', 12.5, 17), color: colors.textSoft },

  skCard: { flexDirection: 'row', alignItems: 'center', gap: 12, height: 66, paddingHorizontal: 12, borderRadius: radii.lg, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card },

  center: { alignItems: 'center', justifyContent: 'center', padding: 24 },
  celebrate: {
    width: 326,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: 22,
    paddingBottom: 16,
    borderRadius: radii.xl,
    borderWidth: 1.2,
    borderColor: ui.sheetBorder,
    backgroundColor: ui.sheet,
    boxShadow: elevation.dialog,
  },
  celebrateArt: { marginBottom: 14, alignItems: 'center' },
  eyebrow: { ...font('900', 12, 16), letterSpacing: 1.2, textTransform: 'uppercase' },
  celebrateTitle: { ...font('900', 22, 28), color: colors.text, textAlign: 'center', marginTop: 4, marginBottom: 4, letterSpacing: -0.4 },
});
