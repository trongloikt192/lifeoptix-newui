import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Decor, useArtScale, type DecorAsset } from './Decor';

/** Paper colour of the Menu mockup. Use it as the screen background. */
export const MENU_PAPER = '#FCF2E0';

const req = {
  heroTop: require('../../assets/decor/menu/heroTop.png'),
  flowersProfileLeft: require('../../assets/decor/menu/flowersProfileLeft.png'),
  flowersJournalTopRight: require('../../assets/decor/menu/flowersJournalTopRight.png'),
  flowersJournalLeft: require('../../assets/decor/menu/flowersJournalLeft.png'),
  flowersJournalRight: require('../../assets/decor/menu/flowersJournalRight.png'),
  flowersPrefsLeft: require('../../assets/decor/menu/flowersPrefsLeft.png'),
  flowersMoreTopRight: require('../../assets/decor/menu/flowersMoreTopRight.png'),
  garlandNavLeft: require('../../assets/decor/menu/garlandNavLeft.png'),
  garlandNavRight: require('../../assets/decor/menu/garlandNavRight.png'),
};

export const MENU_DECOR = {
  /** Full-width top: leaves top-left, window, sleeping cat and flowers top-right. Scales with the screen width. */
  heroTop: { source: req.heroTop, width: 390, height: 175 },
  /** Flowers over the left edge, below the profile card. */
  flowersProfileLeft: { source: req.flowersProfileLeft, width: 38, height: 55 },
  /** Flowers over the top-right corner of the "Your journal" card. */
  flowersJournalTopRight: { source: req.flowersJournalTopRight, width: 50, height: 69 },
  /** Flowers over both bottom corners of the "Your journal" card. */
  flowersJournalLeft: { source: req.flowersJournalLeft, width: 41, height: 53 },
  flowersJournalRight: { source: req.flowersJournalRight, width: 52, height: 55 },
  /** Flowers over the bottom-left corner of the "Preferences" card. */
  flowersPrefsLeft: { source: req.flowersPrefsLeft, width: 38, height: 56 },
  /** Flowers between "Preferences" and "More", right edge. */
  flowersMoreTopRight: { source: req.flowersMoreTopRight, width: 46, height: 59 },
  /** Flowers resting on the tab bar, both corners. */
  garlandNavLeft: { source: req.garlandNavLeft, width: 77, height: 63 },
  garlandNavRight: { source: req.garlandNavRight, width: 84, height: 75 },
} satisfies Record<string, DecorAsset>;

/** Title block in the mockup: status bar 47pt + 96pt, down to the profile card. */
export const MENU_HEADER_HEIGHT = 143;

/**
 * Offsets from each card's full-width wrapper (screen edges left/right). Render the decor AFTER the card:
 * it overlaps the card's border.
 */
export const MENU_ANCHORS = {
  flowersProfileLeft: { left: 0, bottom: -27.1 },
  flowersJournalTopRight: { right: 0, top: -37.6 },
  flowersJournalLeft: { left: 0, bottom: -28.4 },
  flowersJournalRight: { right: 0.5, bottom: -36.2 },
  flowersPrefsLeft: { left: 0, bottom: -32.9 },
  flowersMoreTopRight: { right: 0, top: -55.9 },
} as const;

/** Full-width art behind the title. Scrolls with the page; on short status bars it slides up with the title. */
export function MenuHero({ headerHeight }: { headerHeight: number }) {
  const s = useArtScale();
  const top = Math.min(0, headerHeight - MENU_HEADER_HEIGHT);
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center' }]}>
      <Decor asset={MENU_DECOR.heroTop} scale={s} style={{ top }} />
    </View>
  );
}

/** Flowers resting on the tab bar. Render FIRST in the screen root: the list scrolls over them. */
export function MenuNavGarlands({ navHeight }: { navHeight: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Decor asset={MENU_DECOR.garlandNavLeft} style={{ left: 0, bottom: navHeight + 2.7 }} />
      <Decor asset={MENU_DECOR.garlandNavRight} style={{ right: 0, bottom: navHeight + 2.7 }} />
    </View>
  );
}
