import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Decor, useArtScale, type DecorAsset } from './Decor';

/** Paper colour of the Reports mockup. Use it as the screen background. */
export const REPORTS_PAPER = '#FBF0DB';

const req = {
  heroTop: require('../../assets/decor/reports/heroTop.png'),
  leavesWeekLeft: require('../../assets/decor/reports/leavesWeekLeft.png'),
  leavesWeekRight: require('../../assets/decor/reports/leavesWeekRight.png'),
  sprigStat1: require('../../assets/decor/reports/sprigStat1.png'),
  sprigStat2: require('../../assets/decor/reports/sprigStat2.png'),
  sprigStat3: require('../../assets/decor/reports/sprigStat3.png'),
  sprigStat4: require('../../assets/decor/reports/sprigStat4.png'),
  flowersPattern: require('../../assets/decor/reports/flowersPattern.png'),
  leavesReviewLeft: require('../../assets/decor/reports/leavesReviewLeft.png'),
  reviewArt: require('../../assets/decor/reports/reviewArt.png'),
  reviewArtLeft: require('../../assets/decor/reports/reviewArtLeft.png'),
  reviewLeavesRight: require('../../assets/decor/reports/reviewLeavesRight.png'),
  garlandNavLeft: require('../../assets/decor/reports/garlandNavLeft.png'),
  garlandNavRight: require('../../assets/decor/reports/garlandNavRight.png'),
};

export const REPORTS_DECOR = {
  /** Full-width top: leaves top-left, window, sleeping cat and flowers top-right. Scales with the screen width. */
  heroTop: { source: req.heroTop, width: 390, height: 163 },
  /** Sprigs at the left edge (behind) and over the right edge of the week switcher. */
  leavesWeekLeft: { source: req.leavesWeekLeft, width: 19, height: 63 },
  leavesWeekRight: { source: req.leavesWeekRight, width: 44, height: 83 },
  /** Sprigs over the bottom-right corner of each stat card. */
  sprigStat1: { source: req.sprigStat1, width: 27, height: 38 },
  sprigStat2: { source: req.sprigStat2, width: 33, height: 34 },
  sprigStat3: { source: req.sprigStat3, width: 35, height: 37 },
  sprigStat4: { source: req.sprigStat4, width: 41, height: 42 },
  /** Flowers over the bottom-right corner of the "pattern to explore" card. */
  flowersPattern: { source: req.flowersPattern, width: 69, height: 58 },
  /** Sprig on the left edge beside the weekly review card (behind it). */
  leavesReviewLeft: { source: req.leavesReviewLeft, width: 22, height: 59 },
  /** INSIDE the weekly review card: window and foliage on the right, flowers in the bottom-left corner. */
  reviewArt: { source: req.reviewArt, width: 112, height: 165 },
  reviewArtLeft: { source: req.reviewArtLeft, width: 64, height: 77 },
  /** Leaves just outside the review card's right edge. */
  reviewLeavesRight: { source: req.reviewLeavesRight, width: 19, height: 158 },
  /** Flowers resting on the tab bar, both corners. */
  garlandNavLeft: { source: req.garlandNavLeft, width: 80, height: 95 },
  garlandNavRight: { source: req.garlandNavRight, width: 70, height: 33 },
} satisfies Record<string, DecorAsset>;

/** Title block in the mockup: status bar 47pt + 94.6pt, down to the Week/Month switch. */
export const REPORTS_HEADER_HEIGHT = 141.6;

type Off = { left?: number; right?: number; top?: number; bottom?: number };

/** Sprigs over the stat cards, from each card's bottom-right corner (card i uses i % 4). Render AFTER the card. */
export const STAT_SPRIGS: { asset: DecorAsset; at: Off }[] = [
  { asset: REPORTS_DECOR.sprigStat1, at: { right: -2.2, bottom: -2.8 } },
  { asset: REPORTS_DECOR.sprigStat2, at: { right: -1.4, bottom: -3.2 } },
  { asset: REPORTS_DECOR.sprigStat3, at: { right: -1.8, bottom: -3.2 } },
  { asset: REPORTS_DECOR.sprigStat4, at: { right: -16.1, bottom: -15.6 } },
];

export const REPORTS_ANCHORS = {
  /** From the top of each card's full-width wrapper (screen edges left/right). */
  leavesWeekLeft: { left: 0, top: -9.1 },
  leavesWeekRight: { right: 0, top: -0.4 },
  flowersPattern: { right: 0, top: 30 },
  leavesReviewLeft: { left: 0, top: -26.2 },
  reviewLeavesRight: { right: 0, top: -0.1 },
  /** Inside the review card (overflow hidden), from its inner edges. */
  reviewArt: { right: 0, top: -0.3 },
  reviewArtLeft: { left: -0.3, bottom: -0.3 },
} as const;

/** Full-width art behind the title. Scrolls with the page; on short status bars it slides up with the title. */
export function ReportsHero({ headerHeight }: { headerHeight: number }) {
  const s = useArtScale();
  const top = Math.min(0, headerHeight - REPORTS_HEADER_HEIGHT);
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center' }]}>
      <Decor asset={REPORTS_DECOR.heroTop} scale={s} style={{ top }} />
    </View>
  );
}

/** Flowers resting on the tab bar. Render FIRST in the screen root: the list scrolls over them. */
export function ReportsNavGarlands({ navHeight }: { navHeight: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Decor asset={REPORTS_DECOR.garlandNavLeft} style={{ left: 0, bottom: navHeight + 2.7 }} />
      <Decor asset={REPORTS_DECOR.garlandNavRight} style={{ right: 0, bottom: navHeight + 2.7 }} />
    </View>
  );
}
