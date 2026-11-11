import React from 'react';
import { View } from 'react-native';
import { Decor, DESIGN_WIDTH, useArtScale, type DecorAsset } from './Decor';

/** Paper colour of the Today mockup. Use it as the screen background. */
export const TODAY_PAPER = '#FCF2E0';

export const TODAY_DECOR = {
  /** Top band: hanging leaves, window, sleeping cat, vines. Full width, sits under the status bar. */
  hero: { source: require('../../assets/decor/today/todayHero.png'), width: 390, height: 164 },
  /** Small sprig left of the Energy card's top-left corner. */
  leafEnergyLeft: { source: require('../../assets/decor/today/leafEnergyLeft.png'), width: 19, height: 58 },
  /** Leaves + flower over the Energy card's right edge. */
  leafEnergyRight: { source: require('../../assets/decor/today/leafEnergyRight.png'), width: 42, height: 115 },
  /** Flower and bluebells over the Money card's bottom-right corner. */
  flowerMoneyRight: { source: require('../../assets/decor/today/flowerMoneyRight.png'), width: 62, height: 76 },
  /** Leaves between the Money and Weekly goals cards, left edge. */
  leafMoneyLeft: { source: require('../../assets/decor/today/leafMoneyLeft.png'), width: 35, height: 44 },
  /** Leaves at the Weekly goals card's bottom-right; partly hidden behind the "See all" button. */
  leafGoalsRight: { source: require('../../assets/decor/today/leafGoalsRight.png'), width: 31, height: 30 },
  /** Flower garland rising from the bottom-left corner, resting on the tab bar. */
  garlandBottomLeft: { source: require('../../assets/decor/today/garlandBottomLeft.png'), width: 75, height: 163 },
  /** Flower garland along the bottom-right corner, resting on the tab bar. */
  garlandBottomRight: { source: require('../../assets/decor/today/garlandBottomRight.png'), width: 97, height: 96 },
} satisfies Record<string, DecorAsset>;

/** Spots on the hero art as fractions of its height (they scale with the art). */
export const TODAY_SPOTS = {
  /** Top of the date line: just under the hanging leaves. */
  headerTop: 76.8 / 164,
  /** Top of the streak badge (it sits on the window sill). */
  badgeTop: 77.9 / 164,
  /** Badge's distance from the right edge, as a fraction of the art width. */
  badgeRight: 16.5 / 390,
  /** Top of the reminder card: the art is cut along this line, the card covers the cut. */
  cardTop: 136.6 / 164,
} as const;

/**
 * Offsets (pt) of each decoration from the card it belongs to. Each one is rendered inside that card's
 * wrapper AFTER the card, so it paints on top of the card like in the mockup. Cards keep a 17.2pt left
 * and 16.3pt right margin, so -17.2 / -16.3 put the art flush with the screen edge on every width.
 */
export const TODAY_ANCHORS = {
  energy: {
    leafEnergyLeft: { left: -17.2, top: -9.6 },
    leafEnergyRight: { right: -16.3, bottom: -7.8 },
  },
  goals: {
    flowerMoneyRight: { right: -16.3, top: -60.5 },
    leafMoneyLeft: { left: -17.2, top: -22.0 },
    leafGoalsRight: { right: -15.8, bottom: -16.4 },
  },
} as const;

/** Full-width art at the top of the screen. Children (badge…) are positioned against the art's size. */
export function TodayHero({ children }: { children?: React.ReactNode }) {
  const s = useArtScale();
  const w = DESIGN_WIDTH * s;
  const h = TODAY_DECOR.hero.height * s;
  return (
    <View pointerEvents="box-none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: h, alignItems: 'center' }}>
      <View pointerEvents="box-none" style={{ width: w, height: h }}>
        <Decor asset={TODAY_DECOR.hero} scale={s} style={{ left: 0, top: 0 }} />
        {children}
      </View>
    </View>
  );
}

/**
 * Garlands that rest on the tab bar. Render them BEFORE the scrolling list: they stay put, the list scrolls over
 * them (cards hide them, the paper between cards shows them) and the tab bar, drawn last, hides their cut bottom
 * edge. `barHeight` = height of the tab bar including the home-indicator area.
 */
export function BottomGarlands({ barHeight }: { barHeight: number }) {
  return (
    <>
      <Decor asset={TODAY_DECOR.garlandBottomLeft} style={{ left: 0, bottom: barHeight - 1 }} />
      <Decor asset={TODAY_DECOR.garlandBottomRight} style={{ right: 0, bottom: barHeight - 1 }} />
    </>
  );
}
