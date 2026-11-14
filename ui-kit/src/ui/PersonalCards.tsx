/** Garden, badge and profile cards. */
import { Icon } from '../icons/Icon';
import { Circle, Path, StyleSheet, Svg, Text, View } from '../primitives';
import { Decor } from './Decor';
import { GARDEN_DECOR, GARDEN_TREES } from '../../reference/src/decor/gardenDecor';
import { useAccent } from '../theme/accent';
import { colors, font, radii, ui } from '../theme/tokens';
import { dateLabel } from '../data/format';
import type { Badge } from '../data/models';
import { CardShell, DataState, cardText } from './CardShell';
import type { LoadStatus } from './CardShell';
import { BadgeMedal, ProgressBar, StatusPill } from './Cards';

/* =====================  Garden  ===================== */

export type PlantHealth = 'healthy' | 'thirsty' | 'wilting';

export type Plant = {
  name: string;
  species: string;
  /** 1 seed · 2 sprout · 3 young plant · 4 bushy · 5 blooming */
  stage: number;
  health: PlantHealth;
  points: number;
  nextAt: number;
  today: number;
};

const STAGE = ['Seed', 'Sprout', 'Young plant', 'Bushy', 'Blooming'];

/**
 * The Garden mockup's tree, scaled down by stage. The mockup only ships the "mature" tree; until the designer
 * exports a picture per stage (see reference/README.md › "Thêm hình cây"), smaller stages reuse it smaller.
 * Wilting fades the tree and adds the wilted rose from the Garden screen.
 */
export function PlantArt({ stage, health, size = 96 }: { stage: number; health: PlantHealth; size?: number }) {
  const tree = GARDEN_TREES.mature;
  const k = ([0.17, 0.25, 0.33, 0.4, 0.44][Math.max(0, Math.min(4, stage - 1))] * size) / 96;
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'flex-end' }} accessibilityElementsHidden>
      <View style={{ width: tree.width * k, height: tree.height * k, opacity: health === 'wilting' ? 0.45 : health === 'thirsty' ? 0.8 : 1 }}>
        <Decor asset={tree} scale={k} style={{ left: 0, top: 0 }} />
      </View>
      {health === 'wilting' && <Decor asset={GARDEN_DECOR.wiltFlower} style={{ right: 8, bottom: 4 }} />}
    </View>
  );
}

const HEALTH: Record<PlantHealth, { tone: 'healthy' | 'warn' | 'danger'; label: string; icon: 'heart' | 'drop' | 'alert'; hint: string }> = {
  healthy: { tone: 'healthy', label: 'Healthy', icon: 'heart', hint: 'Watered by today’s 4 entries' },
  thirsty: { tone: 'warn', label: 'Needs care', icon: 'drop', hint: 'Log anything today to water it' },
  wilting: { tone: 'danger', label: 'Wilting', icon: 'alert', hint: 'No entries for 4 days — one note revives it' },
};

export function GardenCard({ plant, status = 'ready', onPress, pressedPreview }: { plant: Plant; status?: LoadStatus; onPress?: () => void; pressedPreview?: boolean }) {
  const h = HEALTH[plant.health];
  if (status !== 'ready') {
    return (
      <CardShell>
        <Text style={cardText.strong}>Your garden</Text>
        <DataState status={status} skeleton="lines" loadingLabel="Loading your garden" emptyIcon="leaf" emptyTitle="Plant your first seed" emptyText="Every entry helps it grow." />
      </CardShell>
    );
  }
  return (
    <CardShell
      onPress={onPress}
      pressedPreview={pressedPreview}
      accessibilityLabel={`${plant.name}, ${STAGE[plant.stage - 1]}, ${h.label}, ${plant.points} of ${plant.nextAt} growth points`}
      tone={plant.health === 'wilting' ? 'danger' : plant.health === 'thirsty' ? 'warn' : 'default'}
    >
      <View style={styles.garden}>
        <View style={[styles.plantBox, plant.health !== 'healthy' && { backgroundColor: '#F6EEDD' }]}>
          <PlantArt stage={plant.stage} health={plant.health} />
        </View>
        <View style={{ flex: 1, gap: 4 }}>
          <Text numberOfLines={1} style={cardText.strong}>
            {plant.name}
          </Text>
          <Text style={cardText.meta}>
            {plant.species} · Stage {plant.stage} of 5, {STAGE[plant.stage - 1].toLowerCase()}
          </Text>
          <StatusPill tone={h.tone} label={h.label} icon={h.icon} />
          <Text style={[cardText.meta, { color: colors.textSoft }]}>{h.hint}</Text>
        </View>
        <Icon name="chevronRight" size={20} color={colors.textMuted} />
      </View>
      <View style={{ gap: 6 }}>
        <View style={styles.between}>
          <Text style={cardText.label}>Growth</Text>
          <Text style={styles.points}>
            {plant.points} / {plant.nextAt} pts{plant.today > 0 ? <Text style={styles.today}>  +{plant.today} today</Text> : null}
          </Text>
        </View>
        <ProgressBar value={plant.points} max={plant.nextAt} label="Growth to next stage" tone={plant.health === 'wilting' ? 'muted' : 'accent'} />
      </View>
    </CardShell>
  );
}

/* =====================  Badge  ===================== */

export function BadgeCard({ badge, onPress, pressedPreview }: { badge: Badge; onPress?: () => void; pressedPreview?: boolean }) {
  const earned = !!badge.earnedOn;
  const p = badge.progress;
  const next = badge.conditions.find((c) => !c.done);
  return (
    <CardShell onPress={onPress} pressedPreview={pressedPreview} tone={earned ? 'gold' : 'default'} accessibilityLabel={`${badge.name}, ${earned ? 'earned' : 'locked'}`}>
      <View style={styles.badgeRow}>
        <BadgeMedal badge={badge} size={60} />
        <View style={{ flex: 1, gap: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Text numberOfLines={1} style={[cardText.strong, { flexShrink: 1 }]}>
              {badge.name}
            </Text>
            <StatusPill tone={earned ? 'earned' : 'locked'} label={earned ? 'Earned' : 'Locked'} />
          </View>
          {earned ? (
            <>
              <Text style={cardText.meta}>{badge.description}</Text>
              <Text style={styles.earnedOn}>Earned {dateLabel(badge.earnedOn!, { year: true })}</Text>
            </>
          ) : (
            <>
              <Text style={[cardText.meta, { color: colors.textSoft }]}>To unlock: {next?.label ?? badge.description}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ flex: 1 }}>
                  <ProgressBar value={p.current} max={p.target} label={`${badge.name} progress`} />
                </View>
                <Text style={styles.prog}>
                  {p.current}/{p.target}
                </Text>
              </View>
            </>
          )}
        </View>
        <Icon name="chevronRight" size={20} color={colors.textMuted} />
      </View>
    </CardShell>
  );
}

/* =====================  Profile  ===================== */

export type Profile = { name: string; since: string; streak: number; entries: number; badges: number; photo?: boolean };

function Avatar({ name, photo, size = 60 }: { name: string; photo?: boolean; size?: number }) {
  const accent = useAccent();
  const initials = name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
  return (
    <View style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }, !photo && { backgroundColor: accent }]}>
      {photo ? (
        // Illustrated stand-in for the person's photo (RN: <Image source={{ uri }} />).
        <Svg width={size} height={size} viewBox="0 0 60 60" aria-hidden="true">
          <Circle cx={30} cy={30} r={30} fill="#E9DCC6" />
          <Path d="M10 60c2-12 10-18 20-18s18 6 20 18z" fill="#7E9460" />
          <Circle cx={30} cy={27} r={11} fill="#E3B48F" />
          <Path d="M18 26c0-9 6-14 12-14s13 4 12 15c-3-5-9-7-14-7-4 0-7 2-10 6z" fill="#4A2F22" />
        </Svg>
      ) : (
        <Text style={[styles.initials, { fontSize: size * 0.36, lineHeight: size * 0.44 }]}>{initials}</Text>
      )}
    </View>
  );
}

export function ProfileCard({ profile, status = 'ready', onPress, pressedPreview }: { profile: Profile; status?: LoadStatus; onPress?: () => void; pressedPreview?: boolean }) {
  if (status !== 'ready') {
    return (
      <CardShell>
        <View style={styles.profileTop}>
          <View style={[styles.avatar, { width: 60, height: 60, borderRadius: 30, backgroundColor: ui.skeleton, borderColor: ui.line }]}>
            <Icon name="user" size={26} color={colors.textMuted} />
          </View>
          <View style={{ flex: 1 }}>
            <DataState status={status} skeleton="lines" loadingLabel="Loading profile" errorText="We couldn’t load your profile." />
          </View>
        </View>
      </CardShell>
    );
  }
  const stats = [
    { label: 'Day streak', value: profile.streak, icon: 'flame' as const },
    { label: 'Entries', value: profile.entries, icon: 'note' as const },
    { label: 'Badges', value: profile.badges, icon: 'award' as const },
  ];
  return (
    <CardShell onPress={onPress} pressedPreview={pressedPreview} accessibilityLabel={`${profile.name}, open profile`}>
      <View style={styles.profileTop}>
        <Avatar name={profile.name} photo={profile.photo} />
        <View style={{ flex: 1, gap: 2 }}>
          <Text numberOfLines={1} style={styles.name}>
            {profile.name}
          </Text>
          <Text style={cardText.meta}>Logging since {profile.since}</Text>
        </View>
        <View style={styles.openPill}>
          <Text style={styles.openText}>Profile</Text>
          <Icon name="chevronRight" size={16} color={colors.accentRingDark} />
        </View>
      </View>
      <View style={styles.stats}>
        {stats.map((s, i) => (
          <View key={s.label} style={[styles.stat, i > 0 && { borderLeftWidth: 1, borderLeftColor: ui.line }]}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Icon name={s.icon} size={15} color={s.icon === 'flame' ? ui.gold : colors.textSoft} />
              <Text style={styles.statValue}>{s.value}</Text>
            </View>
            <Text style={cardText.meta}>{s.label}</Text>
          </View>
        ))}
      </View>
    </CardShell>
  );
}

const styles = StyleSheet.create({
  garden: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  plantBox: { width: 96, height: 104, borderRadius: 12, backgroundColor: '#EAF0D4', borderWidth: 1, borderColor: '#D3DCB1', alignItems: 'center', justifyContent: 'flex-end', paddingBottom: 4 },
  between: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  points: { ...font('800', 13, 17), color: colors.text },
  today: { ...font('800', 12.5, 17), color: '#355F25' },

  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  earnedOn: { ...font('800', 12.5, 17), color: ui.gold },
  prog: { ...font('800', 12.5, 17), color: colors.textSoft },

  avatar: { borderWidth: 2, borderColor: '#FFFCF6', boxShadow: '0 0 0 1.2px #D4C1A8', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  initials: { fontFamily: 'Nunito', fontWeight: '900', color: colors.white },
  profileTop: { flexDirection: 'row', alignItems: 'center', gap: 13 },
  name: { ...font('900', 18, 24), color: colors.text, letterSpacing: -0.3 },
  openPill: { flexDirection: 'row', alignItems: 'center', gap: 2, height: 32, paddingLeft: 11, paddingRight: 6, borderRadius: radii.pill, backgroundColor: ui.accentSoft, borderWidth: 1, borderColor: '#C9D3B0' },
  openText: { ...font('800', 12.5, 16), color: colors.accentRingDark },
  stats: { flexDirection: 'row', borderRadius: radii.md, borderWidth: 1, borderColor: ui.line, backgroundColor: '#FBF5EC', paddingVertical: 10 },
  stat: { flex: 1, flexBasis: 0, alignItems: 'center', gap: 1 },
  statValue: { ...font('900', 17, 22), color: colors.text },
});
