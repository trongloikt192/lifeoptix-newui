import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Decor, useArtScale, type DecorAsset } from './Decor';

/** Paper colour of the All entries mockup. Use it as the screen background. */
export const ENTRIES_PAPER = '#FDF4E2';

const req = {
  heroTop: require('../../assets/decor/entries/heroTop.png'),
  flowersChipsLeft: require('../../assets/decor/entries/flowersChipsLeft.png'),
  flowersFiltersRight: require('../../assets/decor/entries/flowersFiltersRight.png'),
  garlandEndLeft: require('../../assets/decor/entries/garlandEndLeft.png'),
  garlandEndRight: require('../../assets/decor/entries/garlandEndRight.png'),
};

export const ENTRIES_DECOR = {
  /** Full-width top: leaves top-left (partly behind the back button), window, sleeping cat, flowers down the right edge. */
  heroTop: { source: req.heroTop, width: 390, height: 202 },
  /** Flowers on the left edge, behind the "All" chip. */
  flowersChipsLeft: { source: req.flowersChipsLeft, width: 32, height: 62 },
  /** Flowers over the bottom-right corner of the Filters button. */
  flowersFiltersRight: { source: req.flowersFiltersRight, width: 51, height: 60 },
  /** Flowers at the end of the list, over the last cards' edges and resting on the tab bar. */
  garlandEndLeft: { source: req.garlandEndLeft, width: 75, height: 78 },
  garlandEndRight: { source: req.garlandEndRight, width: 85, height: 135 },
} satisfies Record<string, DecorAsset>;

/** Title block in the mockup: status bar 47pt + 140pt, down to the search box. */
export const ENTRIES_HEADER_HEIGHT = 187;

export const ENTRIES_ANCHORS = {
  /** From the top of the chip row's full-width wrapper; rendered BEFORE the chips (the "All" chip hides part of it). */
  flowersChipsLeft: { left: 0, top: 1 },
  /** From the top of the date/filter row's full-width wrapper; rendered AFTER the buttons. */
  flowersFiltersRight: { right: 0, top: 18.8 },
} as const;

/** Full-width art behind the title. Scrolls with the page; on short status bars it slides up with the title. */
export function EntriesHero({ headerHeight }: { headerHeight: number }) {
  const s = useArtScale();
  const top = Math.min(0, headerHeight - ENTRIES_HEADER_HEIGHT);
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center' }]}>
      <Decor asset={ENTRIES_DECOR.heroTop} scale={s} style={{ top }} />
    </View>
  );
}

/**
 * Flowers at the end of the list. Render as the LAST child of the scroll content (content style `flexGrow: 1`):
 * they sit over the last cards' edges, and on a short list they rest on the tab bar.
 */
export function EntriesEndGarlands({ navHeight }: { navHeight: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Decor asset={ENTRIES_DECOR.garlandEndLeft} style={{ left: 0, bottom: navHeight + 2.7 }} />
      <Decor asset={ENTRIES_DECOR.garlandEndRight} style={{ right: 0, bottom: navHeight + 2.7 }} />
    </View>
  );
}
