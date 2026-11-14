import { Icon } from '../icons/Icon';
import type { IconName } from '../icons/Icon';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import { useAccent } from '../theme/accent';
import { colors, font, radii, ui } from '../theme/tokens';
import { Button } from '../ui/Button';
import { Sheet } from '../ui/Sheet';

/* =====================  Action sheet ("…" menu)  ===================== */

export type SheetAction = { label: string; icon: IconName; hint?: string; destructive?: boolean; onPress?: () => void };

type ActionSheetProps = { visible: boolean; onClose: () => void; title: string; subtitle?: string; actions: SheetAction[] };

export function ActionSheet({ visible, onClose, title, subtitle, actions }: ActionSheetProps) {
  const safe = actions.filter((a) => !a.destructive);
  const danger = actions.filter((a) => a.destructive);
  const list = (items: SheetAction[]) => (
    <View style={styles.group}>
      {items.map((a, i) => (
        <Pressable
          key={a.label}
          accessibilityRole="menuitem"
          onPress={() => {
            onClose();
            a.onPress?.();
          }}
          style={({ pressed }) => [styles.item, i < items.length - 1 && styles.divider, pressed && { backgroundColor: a.destructive ? ui.dangerSoft : '#F7EEE1' }]}
        >
          <View style={[styles.itemIcon, a.destructive && { backgroundColor: ui.dangerSoft, borderColor: ui.dangerBorder }]}>
            <Icon name={a.icon} size={19} color={a.destructive ? ui.danger : colors.textSoft} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.itemLabel, a.destructive && { color: ui.danger }]}>{a.label}</Text>
            {a.hint && <Text style={styles.itemHint}>{a.hint}</Text>}
          </View>
        </Pressable>
      ))}
    </View>
  );
  return (
    <Sheet visible={visible} onClose={onClose} title={title} subtitle={subtitle} hideClose footer={<Button label="Cancel" variant="secondary" onPress={onClose} />}>
      {list(safe)}
      {danger.length > 0 && list(danger)}
    </Sheet>
  );
}

/* =====================  Permission prompt  ===================== */

export type PermissionKind = 'microphone' | 'notifications' | 'denied';

const COPY: Record<PermissionKind, { icon: IconName; title: string; body: string; points: { icon: IconName; text: string }[]; allow: string; later: string }> = {
  microphone: {
    icon: 'mic',
    title: 'Speak instead of typing?',
    body: 'Daily Log needs your microphone to turn what you say into entries.',
    points: [
      { icon: 'mic', text: 'Listens only while the mic button is on' },
      { icon: 'note', text: 'You see the text before anything is saved' },
      { icon: 'pen', text: 'You can always type instead' },
    ],
    allow: 'Allow microphone',
    later: 'Not now',
  },
  notifications: {
    icon: 'bell',
    title: 'Want a gentle nudge?',
    body: 'Allow notifications so we can remind you — at most once a day, plus events you add.',
    points: [
      { icon: 'clock', text: 'One reminder a day, at a time you pick' },
      { icon: 'calendar', text: 'A heads-up before birthdays and memorial days' },
      { icon: 'bell', text: 'Change or turn off anytime in Reminders' },
    ],
    allow: 'Allow notifications',
    later: 'Not now',
  },
  denied: {
    icon: 'micOff',
    title: 'Microphone is turned off',
    body: 'To speak your notes, turn on Microphone for Daily Log in your phone’s Settings.',
    points: [
      { icon: 'external', text: 'Open Settings' },
      { icon: 'grid', text: 'Tap Daily Log' },
      { icon: 'mic', text: 'Turn on Microphone' },
    ],
    allow: 'Open Settings',
    later: 'Type instead',
  },
};

type PermissionPromptProps = { visible: boolean; onClose: () => void; kind: PermissionKind; onAllow?: () => void };

/**
 * Shown BEFORE the system dialog, so the one-shot OS prompt is asked with context.
 * RN: on "Allow" call react-native-permissions request(); on "Open Settings" Linking.openSettings().
 */
export function PermissionPrompt({ visible, onClose, kind, onAllow }: PermissionPromptProps) {
  const accent = useAccent();
  const c = COPY[kind];
  const denied = kind === 'denied';
  return (
    <Sheet
      visible={visible}
      onClose={onClose}
      title={c.title}
      bare
      footerStacked
      footer={
        <>
          <Button label={c.allow} icon={denied ? 'external' : undefined} onPress={onAllow ?? onClose} />
          <Button label={c.later} variant="ghost" onPress={onClose} />
        </>
      }
    >
      <View style={styles.hero}>
        <View style={[styles.art, denied ? { backgroundColor: ui.dangerSoft, borderColor: ui.dangerBorder } : { backgroundColor: ui.accentSoft, borderColor: '#C7D1AE' }]}>
          <Icon name={c.icon} size={40} color={denied ? ui.danger : accent} strokeWidth={1.9} />
          {!denied && (
            <View style={styles.leaf}>
              <Icon name="leaf" size={20} color="#7E9460" />
            </View>
          )}
        </View>
        <Text accessibilityRole="header" style={styles.title}>
          {c.title}
        </Text>
        <Text style={styles.body}>{c.body}</Text>
      </View>
      <View style={styles.points}>
        {c.points.map((p, i) => (
          <View key={p.text} style={[styles.point, i < c.points.length - 1 && styles.divider]}>
            {denied ? (
              <View style={styles.stepNum}>
                <Text style={styles.stepNumText}>{i + 1}</Text>
              </View>
            ) : (
              <Icon name={p.icon} size={20} color={colors.textSoft} />
            )}
            <Text style={styles.pointText}>{p.text}</Text>
          </View>
        ))}
      </View>
      {!denied && <Text style={styles.foot}>Your phone will ask you to confirm next.</Text>}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  group: { borderRadius: radii.lg, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 56, paddingVertical: 8, paddingHorizontal: 14 },
  divider: { borderBottomWidth: 1, borderBottomColor: ui.line },
  itemIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: ui.line, backgroundColor: colors.tabBg, alignItems: 'center', justifyContent: 'center' },
  itemLabel: { ...font('700', 15.5, 20), color: colors.text },
  itemHint: { ...font('500', 12.5, 16), color: colors.textMuted },

  hero: { alignItems: 'center', gap: 8, paddingTop: 22 },
  art: { width: 92, height: 92, borderRadius: 30, borderWidth: 1.4, alignItems: 'center', justifyContent: 'center', marginBottom: 6 },
  leaf: { position: 'absolute', right: -6, top: -6, width: 30, height: 30, borderRadius: 15, backgroundColor: ui.sheet, borderWidth: 1, borderColor: ui.line, alignItems: 'center', justifyContent: 'center' },
  title: { ...font('900', 22, 28), color: colors.text, textAlign: 'center', letterSpacing: -0.4 },
  body: { ...font('500', 14.5, 21), color: colors.textSoft, textAlign: 'center', maxWidth: 310 },
  points: { borderRadius: radii.lg, borderWidth: 1.2, borderColor: ui.cardBorder, backgroundColor: ui.card },
  point: { flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 50, paddingVertical: 8, paddingHorizontal: 14 },
  pointText: { ...font('600', 14.5, 20), color: colors.text, flex: 1 },
  stepNum: { width: 24, height: 24, borderRadius: 12, backgroundColor: ui.accentSoft, borderWidth: 1, borderColor: '#C7D1AE', alignItems: 'center', justifyContent: 'center' },
  stepNumText: { ...font('900', 12.5, 16), color: ui.accentInk },
  foot: { ...font('500', 12.5, 17), color: colors.textMuted, textAlign: 'center', marginTop: -8 },
});
