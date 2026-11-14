import { MicIcon, SparkRays } from '../icons';
import { Pressable, StyleSheet, Text, View } from '../primitives';
import { accentSheen, colors, font, shadows } from '../theme/tokens';

type TalkButtonProps = {
  accent: string;
  listening: boolean;
  onHoldStart: () => void;
  onHoldEnd: () => void;
};

/** Press-and-hold mic. Wire onHoldStart/onHoldEnd to the recorder in the app. */
export function TalkButton({ accent, listening, onHoldStart, onHoldEnd }: TalkButtonProps) {
  return (
    <View>
      <View style={styles.row}>
        <View style={styles.raysLeft}>
          <SparkRays side="left" />
        </View>
        <Pressable
          accessibilityLabel="Hold to talk"
          onPressIn={onHoldStart}
          onPressOut={onHoldEnd}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: accent },
            pressed && styles.buttonPressed,
          ]}
        >
          <MicIcon />
        </Pressable>
        <View style={styles.raysRight}>
          <SparkRays side="right" />
        </View>
      </View>
      <Text style={styles.label}>{listening ? 'Listening…' : 'Hold to talk'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', paddingLeft: 125.1 },
  raysLeft: { marginTop: 28.5, marginRight: 11.9 },
  raysRight: { marginTop: 28.5, marginLeft: 11.2 },
  button: {
    width: 87,
    height: 83,
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: colors.accentBorderSoft,
    experimental_backgroundImage: accentSheen,
    boxShadow: shadows.talk,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPressed: { transform: [{ scale: 0.95 }], opacity: 0.92 },
  label: { ...font('700', 13.75, 18), marginTop: 4.6, textAlign: 'center', color: colors.textStrong },
});
