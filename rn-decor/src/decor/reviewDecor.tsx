import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Decor, type DecorAsset } from './Decor';

/** Paper colour of the Review entry mockup. Use it as the screen background. */
export const REVIEW_PAPER = '#FEF5E0';

const req = {
  leavesTopLeft: require('../../assets/decor/review/leavesTopLeft.png'),
  flowersTopRight: require('../../assets/decor/review/flowersTopRight.png'),
  leavesQuoteRight: require('../../assets/decor/review/leavesQuoteRight.png'),
  leavesCard1Left: require('../../assets/decor/review/leavesCard1Left.png'),
  leavesCard3Left: require('../../assets/decor/review/leavesCard3Left.png'),
  sprigEntry1Left: require('../../assets/decor/review/sprigEntry1Left.png'),
  sprigEntry1Right: require('../../assets/decor/review/sprigEntry1Right.png'),
  sprigEntry2Left: require('../../assets/decor/review/sprigEntry2Left.png'),
  sprigEntry2Right: require('../../assets/decor/review/sprigEntry2Right.png'),
  sprigEntry3Left: require('../../assets/decor/review/sprigEntry3Left.png'),
  sprigEntry3Right: require('../../assets/decor/review/sprigEntry3Right.png'),
  sprigEntry4Left: require('../../assets/decor/review/sprigEntry4Left.png'),
  catScene: require('../../assets/decor/review/catScene.png'),
  leavesActionsLeft: require('../../assets/decor/review/leavesActionsLeft.png'),
  leavesNavLeft: require('../../assets/decor/review/leavesNavLeft.png'),
  leavesNavRight: require('../../assets/decor/review/leavesNavRight.png'),
  quoteLeaves: require('../../assets/decor/review/quoteLeaves.png'),
  saveLeavesLeft: require('../../assets/decor/review/saveLeavesLeft.png'),
  saveLeavesRight: require('../../assets/decor/review/saveLeavesRight.png'),
  pillLeaf: require('../../assets/decor/review/pillLeaf.png'),
};

export const REVIEW_DECOR = {
  /** Leaves in the top-left corner, running down the left edge beside the title. */
  leavesTopLeft: { source: req.leavesTopLeft, width: 163, height: 175 },
  /** Leaves and flowers in the top-right corner. */
  flowersTopRight: { source: req.flowersTopRight, width: 131, height: 122 },
  /** Sprig on the right edge between the transcript bubble and the first card (sits behind both). */
  leavesQuoteRight: { source: req.leavesQuoteRight, width: 77, height: 70 },
  /** Sprigs on the left edge, behind the first and third cards. */
  leavesCard1Left: { source: req.leavesCard1Left, width: 20, height: 66 },
  leavesCard3Left: { source: req.leavesCard3Left, width: 20, height: 77 },
  /** Small sprigs INSIDE the entry cards, bottom corners. */
  sprigEntry1Left: { source: req.sprigEntry1Left, width: 29, height: 24 },
  sprigEntry1Right: { source: req.sprigEntry1Right, width: 32, height: 25 },
  sprigEntry2Left: { source: req.sprigEntry2Left, width: 34, height: 29 },
  sprigEntry2Right: { source: req.sprigEntry2Right, width: 26, height: 25 },
  sprigEntry3Left: { source: req.sprigEntry3Left, width: 33, height: 24 },
  sprigEntry3Right: { source: req.sprigEntry3Right, width: 25, height: 23 },
  sprigEntry4Left: { source: req.sprigEntry4Left, width: 34, height: 24 },
  /** Window, plants, flowers and the sleeping cat above the Save button (right side). */
  catScene: { source: req.catScene, width: 280, height: 217 },
  /** Leaves on the left edge beside the Discard button. */
  leavesActionsLeft: { source: req.leavesActionsLeft, width: 62, height: 105 },
  /** Leaves resting on the tab bar, both corners. */
  leavesNavLeft: { source: req.leavesNavLeft, width: 82, height: 39 },
  leavesNavRight: { source: req.leavesNavRight, width: 70, height: 34 },
  /** Light leaves INSIDE the dark transcript bubble, the Save button and the "AI found" pill. */
  quoteLeaves: { source: req.quoteLeaves, width: 31, height: 25 },
  saveLeavesLeft: { source: req.saveLeavesLeft, width: 33, height: 29 },
  saveLeavesRight: { source: req.saveLeavesRight, width: 29, height: 23 },
  pillLeaf: { source: req.pillLeaf, width: 25, height: 20 },
} satisfies Record<string, DecorAsset>;

/** Title block in the mockup: status bar 47pt + 63.4pt, down to the top of the transcript bubble. */
export const REVIEW_HEADER_HEIGHT = 110.4;

type Offset = { left?: number; right?: number; bottom: number };
type SprigPair = { left: DecorAsset; leftAt: Offset; right?: DecorAsset; rightAt?: Offset };

/** Sprigs inside each entry card, from the card's inner bottom corners. Entry i uses pair i % 4. */
export const ENTRY_SPRIGS: SprigPair[] = [
  { left: REVIEW_DECOR.sprigEntry1Left, leftAt: { left: -2.6, bottom: -3.4 }, right: REVIEW_DECOR.sprigEntry1Right, rightAt: { right: -0.7, bottom: -3.4 } },
  { left: REVIEW_DECOR.sprigEntry2Left, leftAt: { left: -0.8, bottom: -3.5 }, right: REVIEW_DECOR.sprigEntry2Right, rightAt: { right: -3.5, bottom: -3.5 } },
  { left: REVIEW_DECOR.sprigEntry3Left, leftAt: { left: -0.3, bottom: -3.5 }, right: REVIEW_DECOR.sprigEntry3Right, rightAt: { right: -2.1, bottom: -4 } },
  // the 4th card's right corner holds the flowers of the cat scene in the mockup
  { left: REVIEW_DECOR.sprigEntry4Left, leftAt: { left: 0.6, bottom: -3.5 } },
];

export const REVIEW_ANCHORS = {
  /** From the top of the transcript bubble's full-width wrapper; rendered BEFORE the bubble. */
  leavesQuoteRight: { right: 0, top: 51.4 },
  /** From the top of the card's full-width wrapper; rendered BEFORE the card. */
  leavesCard1Left: { left: 0, top: -3.6 },
  leavesCard3Left: { left: 0, top: 9.7 },
  /** Inside the bubble / pill / Save button, from their inner edges. */
  quoteLeaves: { right: 1.4, bottom: 1 },
  pillLeaf: { right: -0.3, bottom: -1.2 },
  saveLeavesLeft: { left: 0.6, bottom: -1.8 },
  saveLeavesRight: { right: 0.7, bottom: -1.8 },
} as const;

/** Corner art around the title. Scrolls with the page; on short status bars it slides up with the title. */
export function ReviewHeaderDecor({ headerHeight }: { headerHeight: number }) {
  const top = Math.min(0, headerHeight - REVIEW_HEADER_HEIGHT);
  return (
    <>
      <Decor asset={REVIEW_DECOR.leavesTopLeft} style={{ left: 0, top }} />
      <Decor asset={REVIEW_DECOR.flowersTopRight} style={{ right: 0, top }} />
    </>
  );
}

/**
 * Art that stays put at the bottom: the cat scene above the Save button, leaves beside the buttons and on the tab bar.
 * Render it FIRST in the screen root: the list scrolls over it, the buttons and the tab bar cover its lower edge.
 * `navHeight` = tab bar height (useNavHeight()).
 */
export function ReviewBottomDecor({ navHeight }: { navHeight: number }) {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Decor asset={REVIEW_DECOR.catScene} style={{ right: 0, bottom: navHeight + 43 }} />
      <Decor asset={REVIEW_DECOR.leavesActionsLeft} style={{ left: 0, bottom: navHeight + 52.2 }} />
      <Decor asset={REVIEW_DECOR.leavesNavLeft} style={{ left: 0, bottom: navHeight + 2.7 }} />
      <Decor asset={REVIEW_DECOR.leavesNavRight} style={{ right: 0, bottom: navHeight + 2.7 }} />
    </View>
  );
}
