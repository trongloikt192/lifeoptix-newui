import { useState } from 'react';
import background from '../assets/today-bg@2x.webp';
import { DateChip, Header } from '../components/Header';
import { ExampleChip, HintRow, NoteInput } from '../components/NoteInput';
import { OrganizeButton } from '../components/OrganizeButton';
import { TabBar } from '../components/TabBar';
import { TalkButton } from '../components/TalkButton';
import { Image, StyleSheet, View } from '../primitives';
import { colors } from '../theme/tokens';

const EXAMPLE = 'Pho 50k, gym 45 min';

type TodayScreenProps = {
  accent?: string;
  /** Safe-area insets (useSafeAreaInsets() in the app). */
  insets?: { top: number; bottom: number };
  time?: string;
  onOrganize?: (note: string) => void;
};

export function TodayScreen({
  accent = colors.accent,
  insets = { top: 47, bottom: 34 },
  time = '10:42 AM',
  onOrganize,
}: TodayScreenProps) {
  const [note, setNote] = useState('');
  const [listening, setListening] = useState(false);
  const hasNote = note.trim().length > 0;

  return (
    <View style={styles.screen}>
      <Image source={background} resizeMode="cover" style={StyleSheet.absoluteFill} />

      <View style={{ paddingTop: insets.top + 12 }}>
        <Header title="How was your day?" subtitle="Little moments count, too." time={time} />
        <DateChip label="Today" />

        {/* The gap is the window for the illustration in the background. */}
        <View style={styles.illustrationGap} />

        <TalkButton
          accent={accent}
          listening={listening}
          onHoldStart={() => setListening(true)}
          onHoldEnd={() => setListening(false)}
        />
        <NoteInput value={note} onChangeText={setNote} placeholder="A meal, a walk, a little win..." />
        <ExampleChip label={`Try: ${EXAMPLE}`} onPress={() => setNote(EXAMPLE)} />
        <HintRow
          title="Logging yesterday? Just mention it."
          body="For example, “yesterday I had bun cha 65k” and it lands on the right date."
        />
        <OrganizeButton
          label="Organize my notes"
          accent={accent}
          disabled={!hasNote}
          onPress={() => onOrganize?.(note)}
        />
      </View>

      <TabBar active="today" accent={accent} bottomInset={insets.bottom} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, overflow: 'hidden', backgroundColor: colors.ground },
  illustrationGap: { height: 131.95 },
});
