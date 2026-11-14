/**
 * Shared frame for every card in the kit:
 *  - CardShell: border, radius, tone; becomes a Pressable with a pressed state when given onPress.
 *  - CardHeader: icon tile · title · subtitle · right accessory.
 *  - DataState: what a data card shows while loading, when empty, and when loading failed.
 */
import type { ReactNode } from 'react';
import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { Pressable, PulseView, StyleSheet, Text, View } from '../primitives';
import type { StyleProp } from '../primitives';
import { colors, elevation, font, radii, ui } from '../theme/tokens';
import { Button } from './Button';
import { Bone } from './States';

export type CardTone = 'default' | 'accent' | 'warn' | 'danger' | 'gold' | 'lunar' | 'muted';
export type LoadStatus = 'ready' | 'loading' | 'empty' | 'error';

const TONE: Record<CardTone, { bg: string; border: string }> = {
  default: { bg: ui.card, border: ui.cardBorder },
  accent: { bg: '#F4F6E4', border: '#BFCB98' },
  warn: { bg: '#FEF6E0', border: ui.warnBorder },
  danger: { bg: '#FFF6F2', border: ui.dangerBorder },
  gold: { bg: '#FFFAEC', border: ui.goldBorder },
  lunar: { bg: '#EEF8FB', border: '#A9D9E6' },
  muted: { bg: '#F7F1E8', border: ui.line },
};

type CardShellProps = {
  children: ReactNode;
  onPress?: () => void;
  accessibilityLabel?: string;
  tone?: CardTone;
  /** Draws the pressed look without a press — for static mockup boards. */
  pressedPreview?: boolean;
  padding?: number;
  style?: StyleProp;
};

export function CardShell({ children, onPress, accessibilityLabel, tone = 'default', pressedPreview, padding = 14, style }: CardShellProps) {
  const t = TONE[tone];
  const base = [styles.card, { backgroundColor: t.bg, borderColor: t.border, padding }, style];
  const pressedStyle = { borderColor: ui.lineStrong, boxShadow: 'none', transform: [{ scale: 0.985 }] };
  const overlay = <View pointerEvents="none" style={styles.pressOverlay} />;
  if (!onPress) {
    return (
      <View style={[base, pressedPreview && pressedStyle]}>
        {children}
        {pressedPreview && overlay}
      </View>
    );
  }
  return (
    <Pressable onPress={onPress} accessibilityLabel={accessibilityLabel} style={({ pressed }) => [base, (pressed || pressedPreview) && pressedStyle]}>
      {({ pressed }) => (
        <>
          {children}
          {(pressed || pressedPreview) && overlay}
        </>
      )}
    </Pressable>
  );
}

type TileTone = { fg: string; bg: string; border: string };

export const TILE: Record<'accent' | 'warn' | 'danger' | 'gold' | 'lunar' | 'neutral' | 'sky', TileTone> = {
  accent: { fg: ui.accentInk, bg: '#E1EEBE', border: '#E1EEBE' },
  warn: { fg: '#946000', bg: '#FDE6B1', border: '#FDE6B1' },
  danger: { fg: ui.danger, bg: ui.dangerSoft, border: ui.dangerBorder },
  gold: { fg: ui.gold, bg: ui.goldSoft, border: ui.goldBorder },
  lunar: { fg: '#005C7C', bg: '#C6EAF7', border: '#A9D9E6' },
  neutral: { fg: colors.textSoft, bg: colors.tabBg, border: ui.line },
  sky: { fg: '#073445', bg: '#C6EAF7', border: '#C6EAF7' },
};

export function IconTile({ icon, tone = TILE.neutral, size = 34 }: { icon: IconName; tone?: TileTone; size?: number }) {
  return (
    <View style={[styles.tile, { width: size, height: size, borderRadius: size * 0.3, backgroundColor: tone.bg, borderColor: tone.border }]}>
      <Icon name={icon} size={Math.round(size * 0.55)} color={tone.fg} />
    </View>
  );
}

type CardHeaderProps = { icon?: IconName; tone?: TileTone; title: string; subtitle?: string; right?: ReactNode };

export function CardHeader({ icon, tone, title, subtitle, right }: CardHeaderProps) {
  return (
    <View style={styles.header}>
      {icon && <IconTile icon={icon} tone={tone} />}
      <View style={styles.headerText}>
        <Text numberOfLines={1} style={styles.title}>
          {title}
        </Text>
        {subtitle && (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      {right}
    </View>
  );
}

type DataStateProps = {
  status: Exclude<LoadStatus, 'ready'>;
  /** Shape of the skeleton. */
  skeleton?: 'lines' | 'metric' | 'columns' | 'list';
  loadingLabel?: string;
  emptyIcon?: IconName;
  emptyTitle?: string;
  emptyText?: string;
  emptyAction?: { label: string; onPress?: () => void };
  errorText?: string;
  onRetry?: () => void;
};

export function DataState({
  status,
  skeleton = 'lines',
  loadingLabel = 'Loading',
  emptyIcon = 'note',
  emptyTitle = 'Nothing here yet',
  emptyText,
  emptyAction,
  errorText = 'Check your connection and try again.',
  onRetry,
}: DataStateProps) {
  if (status === 'loading') {
    return (
      <View accessibilityRole="progressbar" accessibilityLabel={loadingLabel} style={{ gap: 10 }}>
        <PulseView style={{ gap: 10 }}>
          {skeleton === 'metric' && (
            <>
              <Bone w={120} h={24} r={7} />
              <Bone w={90} h={11} />
            </>
          )}
          {skeleton === 'columns' && (
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {[0, 1, 2].map((i) => (
                <View key={i} style={{ flex: 1, gap: 7 }}>
                  <Bone w="60%" h={10} />
                  <Bone w="85%" h={18} r={6} />
                </View>
              ))}
            </View>
          )}
          {skeleton === 'list' &&
            [0, 1, 2].map((i) => (
              <View key={i} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Bone w={28} h={28} r={9} />
                <Bone w="58%" h={11} />
              </View>
            ))}
          {(skeleton === 'lines' || skeleton === 'columns') && (
            <>
              <Bone w="92%" h={11} />
              <Bone w="70%" h={11} />
            </>
          )}
        </PulseView>
      </View>
    );
  }
  if (status === 'empty') {
    return (
      <View style={styles.state}>
        <View style={styles.stateIcon}>
          <Icon name={emptyIcon} size={20} color={colors.textMuted} />
        </View>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={styles.stateTitle}>{emptyTitle}</Text>
          {emptyText && <Text style={styles.stateText}>{emptyText}</Text>}
          {emptyAction && (
            <View style={{ flexDirection: 'row', marginTop: 8 }}>
              <Button label={emptyAction.label} size="sm" icon="plus" variant="secondary" onPress={emptyAction.onPress} />
            </View>
          )}
        </View>
      </View>
    );
  }
  return (
    <View style={styles.state} accessibilityRole="alert">
      <View style={[styles.stateIcon, { backgroundColor: ui.dangerSoft, borderColor: ui.dangerBorder }]}>
        <Icon name="alert" size={19} color={ui.danger} />
      </View>
      <View style={{ flex: 1, gap: 2 }}>
        <Text style={[styles.stateTitle, { color: ui.dangerInk }]}>Couldn’t load this</Text>
        <Text style={styles.stateText}>{errorText}</Text>
        <View style={{ flexDirection: 'row', marginTop: 8 }}>
          <Button label="Try again" icon="refresh" size="sm" variant="secondary" onPress={onRetry} />
        </View>
      </View>
    </View>
  );
}

/** Small label for AI-estimated values. Dashed outline = "not measured". */
export function EstimateTag({ label = 'Estimated' }: { label?: string }) {
  return (
    <View style={styles.estimate}>
      <Text style={styles.estimateText}>≈ {label}</Text>
    </View>
  );
}

export const cardText = StyleSheet.create({
  big: { ...font('900', 24, 30), letterSpacing: -0.5, color: colors.text },
  label: { ...font('700', 12.5, 16), color: colors.textSoft },
  body: { ...font('500', 14, 20), color: colors.textSoft },
  meta: { ...font('500', 12.5, 17), color: colors.textMuted },
  strong: { ...font('800', 15, 20), color: colors.text },
  unit: { ...font('700', 13, 16), color: colors.textSoft },
});

const styles = StyleSheet.create({
  card: { borderWidth: 1.2, borderRadius: radii.lg, boxShadow: elevation.card, gap: 12, overflow: 'hidden' },
  pressOverlay: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(120,80,40,0.07)' },
  tile: { borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  headerText: { flex: 1, gap: 1 },
  title: { ...font('800', 15, 20), color: colors.text },
  subtitle: { ...font('500', 12.5, 17), color: colors.textSoft },
  state: { flexDirection: 'row', alignItems: 'flex-start', gap: 11, paddingVertical: 2 },
  stateIcon: { width: 38, height: 38, borderRadius: 12, borderWidth: 1, borderColor: ui.line, backgroundColor: colors.tabBg, alignItems: 'center', justifyContent: 'center' },
  stateTitle: { ...font('800', 14, 19), color: colors.text },
  stateText: { ...font('500', 13, 18), color: colors.textSoft },
  estimate: { height: 22, paddingHorizontal: 8, borderRadius: radii.pill, borderWidth: 1.2, borderStyle: 'dashed', borderColor: '#C9A75A', backgroundColor: '#FFF8E6', justifyContent: 'center', alignSelf: 'flex-start' },
  estimateText: { ...font('800', 11.5, 15), color: ui.gold },
});
