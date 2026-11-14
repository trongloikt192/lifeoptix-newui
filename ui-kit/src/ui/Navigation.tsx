import type { ReactNode } from 'react';
import { Icon } from '../icons/Icon';
import { ActivityIndicator, Pressable, PulseView, StyleSheet, Text, View } from '../primitives';
import { useAccent } from '../theme/accent';
import { accentSheen, colors, font, shadows, ui } from '../theme/tokens';
import { IconButton } from './Button';

/* ---------- App bar ---------- */

type AppBarProps = {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  /** Right-side icon buttons. */
  actions?: ReactNode;
  /** Root screens use a large left-aligned title; pushed screens a centered one. */
  large?: boolean;
};

export function AppBar({ title, subtitle, onBack, actions, large = !onBack }: AppBarProps) {
  return (
    <View style={[styles.bar, large ? styles.barLarge : styles.barSmall]}>
      {onBack && <IconButton icon="chevronLeft" label="Back" variant="accent" size={35} onPress={onBack} />}
      <View style={[styles.titles, large && { paddingLeft: 10 }]}>
        <Text accessibilityRole="header" numberOfLines={1} style={large ? styles.titleLarge : styles.title}>
          {title}
        </Text>
        {subtitle && (
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        )}
      </View>
      <View style={styles.actions}>{actions}</View>
    </View>
  );
}

/* ---------- Microphone control ---------- */

export type MicState = 'idle' | 'recording' | 'processing' | 'error';

type MicControlProps = {
  state: MicState;
  seconds?: number;
  onPress?: () => void;
  onRetry?: () => void;
  errorMessage?: string;
};

const BARS = [6, 14, 22, 12, 26, 18, 9, 20, 28, 15, 8, 18, 24, 11, 6];

/** Tap to start, tap to stop. (The Today screen also supports press-and-hold.) */
export function MicControl({ state, seconds = 0, onPress, onRetry, errorMessage = 'Couldn’t catch that. Check your connection and try again.' }: MicControlProps) {
  const accent = useAccent();
  const rec = state === 'recording';
  const busy = state === 'processing';
  const err = state === 'error';
  const label = rec ? 'Stop recording' : busy ? 'Processing' : err ? 'Try recording again' : 'Start recording';
  const time = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  return (
    <View style={styles.mic}>
      <View style={styles.micStage}>
        {rec && (
          <PulseView style={[styles.halo, { borderColor: accent, backgroundColor: ui.accentSoft }]} />
        )}
        <Pressable
          accessibilityLabel={label}
          accessibilityState={{ busy }}
          disabled={busy}
          onPress={err ? (onRetry ?? onPress) : onPress}
          style={({ pressed }) => [
            styles.micButton,
            err
              ? { backgroundColor: ui.dangerSoft, borderColor: ui.dangerBorder, boxShadow: `0 0 0 1px ${ui.danger}` }
              : busy
                ? { backgroundColor: '#C9CFB8', borderColor: '#B7BFA2', boxShadow: 'none' }
                : { backgroundColor: accent },
            pressed && { transform: [{ scale: 0.95 }] },
          ]}
        >
          {busy ? (
            <ActivityIndicator size={40} color={colors.white} />
          ) : (
            <Icon name={rec ? 'stop' : err ? 'micOff' : 'mic'} size={rec ? 40 : 44} color={err ? ui.danger : colors.onAccent} strokeWidth={1.9} />
          )}
        </Pressable>
      </View>

      {rec ? (
        <View style={styles.micInfo}>
          <View style={styles.recRow}>
            <PulseView speed="fast" style={styles.recDot} />
            <Text style={styles.recTime} accessibilityElementsHidden>
              {time}
            </Text>
            <Text style={styles.micLabel}>Listening — tap to stop</Text>
          </View>
          <View style={styles.wave} accessibilityElementsHidden>
            {BARS.map((h, i) => (
              <PulseView key={i} speed={i % 2 ? 'fast' : 'normal'} style={[styles.waveBar, { height: h, backgroundColor: accent }]} />
            ))}
          </View>
        </View>
      ) : busy ? (
        <View style={styles.micInfo}>
          <Text style={styles.micLabel}>Turning your words into entries…</Text>
          <Text style={styles.micSub}>This takes a few seconds.</Text>
        </View>
      ) : err ? (
        <View style={styles.micInfo} accessibilityLiveRegion="polite">
          <Text style={[styles.micLabel, { color: ui.dangerInk }]}>Recording failed</Text>
          <Text style={[styles.micSub, { textAlign: 'center' }]}>{errorMessage}</Text>
          <Pressable onPress={onRetry} style={styles.retry}>
            <Icon name="refresh" size={17} color={colors.accentRingDark} />
            <Text style={styles.retryLabel}>Try again</Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.micInfo}>
          <Text style={styles.micLabel}>Tap to talk</Text>
          <Text style={styles.micSub}>Say it the way you’d tell a friend.</Text>
        </View>
      )}
    </View>
  );
}

/** Small round "+" used in app bars. */
export function AddButton({ onPress, label = 'Add' }: { onPress?: () => void; label?: string }) {
  const accent = useAccent();
  return (
    <Pressable accessibilityLabel={label} onPress={onPress} style={styles.addHit}>
      {({ pressed }) => (
        <View style={[styles.add, { backgroundColor: accent }, pressed && { transform: [{ scale: 0.94 }] }]}>
          <Icon name="plus" size={22} color={colors.onAccent} strokeWidth={2.6} />
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, gap: 2 },
  barLarge: { minHeight: 72, paddingVertical: 4 },
  barSmall: { height: 60 },
  titles: { flex: 1, gap: 1 },
  titlesCenter: { alignItems: 'center' },
  titleLarge: { ...font('900', 33, 40), letterSpacing: -1.5, color: colors.text },
  title: { ...font('900', 24, 30), letterSpacing: -1, color: '#270100' },
  subtitle: { ...font('400', 14, 18), color: colors.textSoft },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' },

  mic: { alignItems: 'center', gap: 14 },
  micStage: { width: 150, height: 120, alignItems: 'center', justifyContent: 'center' },
  halo: { position: 'absolute', width: 136, height: 118, borderRadius: 40, borderWidth: 2 },
  micButton: {
    width: 96,
    height: 92,
    borderRadius: 27,
    borderWidth: 2.5,
    borderColor: colors.accentBorderSoft,
    experimental_backgroundImage: accentSheen,
    boxShadow: shadows.talk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  micInfo: { alignItems: 'center', gap: 6, minHeight: 74, maxWidth: 300 },
  micLabel: { ...font('800', 15.5, 20), color: colors.text, textAlign: 'center' },
  micSub: { ...font('500', 13.5, 19), color: colors.textSoft },
  recRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  recDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#C2412A' },
  recTime: { ...font('800', 15.5, 20), color: colors.text, fontVariant: 'tabular-nums' as never },
  wave: { flexDirection: 'row', alignItems: 'center', gap: 4, height: 32 },
  waveBar: { width: 4, borderRadius: 2 },
  retry: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 44, paddingHorizontal: 12 },
  retryLabel: { ...font('800', 14.5, 20), color: colors.accentRingDark },

  addHit: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center' },
  add: { width: 40, height: 40, borderRadius: 13, borderWidth: 1.5, borderColor: colors.accentBorder, boxShadow: shadows.fab, alignItems: 'center', justifyContent: 'center' },
});
