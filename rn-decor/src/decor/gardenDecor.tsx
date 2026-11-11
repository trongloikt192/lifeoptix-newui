import React from 'react';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { DESIGN_WIDTH, Decor, useArtScale, type DecorAsset } from './Decor';

/** Paper colour of the Garden mockup. Use it as the screen background. */
export const GARDEN_PAPER = '#FDF2DE';

const req = {
  heroTop: require('../../assets/decor/garden/heroTop.png'),
  treeMature: require('../../assets/decor/garden/treeMature.png'),
  sprigStat1: require('../../assets/decor/garden/sprigStat1.png'),
  sprigStat2: require('../../assets/decor/garden/sprigStat2.png'),
  sprigStat3: require('../../assets/decor/garden/sprigStat3.png'),
  leavesLeftMid: require('../../assets/decor/garden/leavesLeftMid.png'),
  leavesRightMid: require('../../assets/decor/garden/leavesRightMid.png'),
  badge7Day: require('../../assets/decor/garden/badge7Day.png'),
  badge30Day: require('../../assets/decor/garden/badge30Day.png'),
  badge100DayLocked: require('../../assets/decor/garden/badge100DayLocked.png'),
  badgeDisciplineLocked: require('../../assets/decor/garden/badgeDisciplineLocked.png'),
  badgeGreenLifeLocked: require('../../assets/decor/garden/badgeGreenLifeLocked.png'),
  wiltFlower: require('../../assets/decor/garden/wiltFlower.png'),
  garlandEndLeft: require('../../assets/decor/garden/garlandEndLeft.png'),
  garlandEndRight: require('../../assets/decor/garden/garlandEndRight.png'),
};

export const GARDEN_DECOR = {
  /**
   * Full-width top: leaves, sky, and the garden picture WITHOUT the tree (wall, fence, grass, sleeping cat) that fills
   * the plant card. Scales with the screen width; the plant card is laid out on top of it with GARDEN_CARD × scale.
   */
  heroTop: { source: req.heroTop, width: 390, height: 319 },
  /** Sprigs inside the stat cards, bottom-right. */
  sprigStat1: { source: req.sprigStat1, width: 42, height: 47 },
  sprigStat2: { source: req.sprigStat2, width: 32, height: 55 },
  sprigStat3: { source: req.sprigStat3, width: 29, height: 52 },
  /** Leaves on the screen edges beside the stat cards. */
  leavesLeftMid: { source: req.leavesLeftMid, width: 24, height: 45 },
  leavesRightMid: { source: req.leavesRightMid, width: 31, height: 44 },
  /** Badge pictures (circle background included). The mockup only shows the locked look of the last three. */
  badge7Day: { source: req.badge7Day, width: 60, height: 60 },
  badge30Day: { source: req.badge30Day, width: 60, height: 60 },
  badge100DayLocked: { source: req.badge100DayLocked, width: 60, height: 60 },
  badgeDisciplineLocked: { source: req.badgeDisciplineLocked, width: 60, height: 60 },
  badgeGreenLifeLocked: { source: req.badgeGreenLifeLocked, width: 60, height: 60 },
  /** Small wilting rose after "Miss 3 days…". */
  wiltFlower: { source: req.wiltFlower, width: 22, height: 25 },
  /** Flowers at the end of the page, resting on the tab bar. */
  garlandEndLeft: { source: req.garlandEndLeft, width: 164, height: 65 },
  garlandEndRight: { source: req.garlandEndRight, width: 132, height: 137 },
} satisfies Record<string, DecorAsset>;

/** Plant card in heroTop (pt at 390): outer frame and where its info panel starts. */
export const GARDEN_CARD = { left: 14.7, top: 115.7, width: 361.6, panelTop: 298.8 };

/**
 * A tree picture for one growth stage: transparent PNG (@1x/@2x/@3x) drawn at the 390pt scale, ground shadow included.
 * `base` = where the trunk meets the ground, in pt from the image's top-left corner.
 */
export type TreeArt = DecorAsset & { base: { x: number; y: number } };

/** Trees by stage. The mockup only has "mature"; add the other stages here as the designer delivers them. */
export const GARDEN_TREES = {
  mature: { source: req.treeMature, width: 211, height: 190, base: { x: 104.5, y: 180.1 } },
} satisfies Record<string, TreeArt>;
export type TreeStage = keyof typeof GARDEN_TREES;

/** Ground point in heroTop (pt at 390) where every tree's `base` is placed. */
export const GARDEN_GROUND = { x: 202.1, y: 279.6 };

/** Status-bar height the mockup was drawn with. */
const MOCK_TOP = 47;

/** Geometry shared by the hero and the plant card, so the card frame sits exactly on the picture. */
export function useGardenGeometry(insetTop: number) {
  const { width } = useWindowDimensions();
  const s = useArtScale();
  const top = Math.min(0, insetTop - MOCK_TOP); // short status bar: art and card slide up together
  const offsetX = (width - DESIGN_WIDTH * s) / 2; // art is centred on tablets
  return {
    s,
    top,
    cardLeft: offsetX + GARDEN_CARD.left * s,
    cardTop: top + GARDEN_CARD.top * s,
    cardWidth: GARDEN_CARD.width * s,
    /** Height of the picture part of the card (inside its 1.4pt border). */
    pictureHeight: (GARDEN_CARD.panelTop - GARDEN_CARD.top) * s - 1.4,
    artLeft: offsetX,
  };
}

/** Stat-card sprigs, from each card's bottom-right corner (card i uses i % 3). Render BEFORE the card's text. */
export const STAT_SPRIGS: { asset: DecorAsset; at: { right: number; bottom: number } }[] = [
  { asset: GARDEN_DECOR.sprigStat1, at: { right: -1.6, bottom: -0.5 } },
  { asset: GARDEN_DECOR.sprigStat2, at: { right: -2.2, bottom: 1.8 } },
  { asset: GARDEN_DECOR.sprigStat3, at: { right: -2.4, bottom: -1 } },
];

export const GARDEN_ANCHORS = {
  /** From the top of the stat row's full-width wrapper; rendered AFTER the cards. */
  leavesLeftMid: { left: 0, top: 34.4 },
  leavesRightMid: { right: 0, top: 50.5 },
} as const;

/** The top art. First child of the scroll content; everything else is drawn over it. */
export function GardenHero({ top }: { top: number }) {
  const s = useArtScale();
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center' }]}>
      <Decor asset={GARDEN_DECOR.heroTop} scale={s} style={{ top }} />
    </View>
  );
}

/**
 * The tree of the current stage, standing on GARDEN_GROUND. Render it AFTER the plant card (its crown covers the
 * card's top border) and BEFORE the card's labels. It is clipped at the info panel and at the top of the art.
 */
export function GardenTree({ tree, top, left }: { tree: TreeArt; top: number; left: number }) {
  const s = useArtScale();
  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', top, left, width: DESIGN_WIDTH * s, height: GARDEN_CARD.panelTop * s, overflow: 'hidden' }}
    >
      <Decor
        asset={tree}
        scale={s}
        style={{ left: (GARDEN_GROUND.x - tree.base.x) * s, top: (GARDEN_GROUND.y - tree.base.y) * s }}
      />
    </View>
  );
}

/** Flowers at the end of the page. LAST child of the scroll content (content style `flexGrow: 1`). */
export function GardenEndGarlands({ navHeight }: { navHeight: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Decor asset={GARDEN_DECOR.garlandEndLeft} style={{ left: 0, bottom: navHeight + 2.7 }} />
      <Decor asset={GARDEN_DECOR.garlandEndRight} style={{ right: 0, bottom: navHeight + 2.7 }} />
    </View>
  );
}
