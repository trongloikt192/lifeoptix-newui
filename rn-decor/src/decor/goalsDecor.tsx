import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Decor, type DecorAsset } from './Decor';

/** Paper colour of the Weekly goals mockup. Use it as the screen background. */
export const GOALS_PAPER = '#FEF3DB';

const req = {
  leavesTopLeft: require('../../assets/decor/goals/leavesTopLeft.png'),
  catTopRight: require('../../assets/decor/goals/catTopRight.png'),
  leavesHeaderLeft: require('../../assets/decor/goals/leavesHeaderLeft.png'),
  sprigWeekLeft: require('../../assets/decor/goals/sprigWeekLeft.png'),
  sprigWeekRight: require('../../assets/decor/goals/sprigWeekRight.png'),
  sprigGoal1Left: require('../../assets/decor/goals/sprigGoal1Left.png'),
  sprigGoal1Right: require('../../assets/decor/goals/sprigGoal1Right.png'),
  sprigGoal2Left: require('../../assets/decor/goals/sprigGoal2Left.png'),
  sprigGoal2Right: require('../../assets/decor/goals/sprigGoal2Right.png'),
  sprigGoal3Left: require('../../assets/decor/goals/sprigGoal3Left.png'),
  sprigGoal3Right: require('../../assets/decor/goals/sprigGoal3Right.png'),
  sprigGoal4Left: require('../../assets/decor/goals/sprigGoal4Left.png'),
  sprigGoal4Right: require('../../assets/decor/goals/sprigGoal4Right.png'),
  garlandBottomLeft: require('../../assets/decor/goals/garlandBottomLeft.png'),
  garlandBottomRight: require('../../assets/decor/goals/garlandBottomRight.png'),
  btnLeavesLeft: require('../../assets/decor/goals/btnLeavesLeft.png'),
  btnLeavesRight: require('../../assets/decor/goals/btnLeavesRight.png'),
};

export const GOALS_DECOR = {
  /** Leaves in the top-left corner, under the status bar. */
  leavesTopLeft: { source: req.leavesTopLeft, width: 125, height: 66 },
  /** Window, sleeping cat on the sill and flowers in the top-right corner; leaves continue down the right edge. */
  catTopRight: { source: req.catTopRight, width: 197, height: 218 },
  /** Sprig on the left edge between the back button and the week card. */
  leavesHeaderLeft: { source: req.leavesHeaderLeft, width: 25, height: 75 },
  /** Sprigs inside the week card, next to the ‹ and › buttons. */
  sprigWeekLeft: { source: req.sprigWeekLeft, width: 47, height: 33 },
  sprigWeekRight: { source: req.sprigWeekRight, width: 47, height: 42 },
  sprigGoal1Left: { source: req.sprigGoal1Left, width: 41, height: 52 },
  sprigGoal1Right: { source: req.sprigGoal1Right, width: 31, height: 53 },
  sprigGoal2Left: { source: req.sprigGoal2Left, width: 35, height: 72 },
  sprigGoal2Right: { source: req.sprigGoal2Right, width: 27, height: 66 },
  sprigGoal3Left: { source: req.sprigGoal3Left, width: 44, height: 61 },
  sprigGoal3Right: { source: req.sprigGoal3Right, width: 27, height: 55 },
  sprigGoal4Left: { source: req.sprigGoal4Left, width: 43, height: 87 },
  sprigGoal4Right: { source: req.sprigGoal4Right, width: 41, height: 88 },
  /** Corner art at the bottom of the screen. */
  garlandBottomLeft: { source: req.garlandBottomLeft, width: 120, height: 148 },
  garlandBottomRight: { source: req.garlandBottomRight, width: 109, height: 99 },
  /** Light leaves painted inside the green "Add a goal" button. */
  btnLeavesLeft: { source: req.btnLeavesLeft, width: 44, height: 33 },
  btnLeavesRight: { source: req.btnLeavesRight, width: 32, height: 34 },
} satisfies Record<string, DecorAsset>;

/** Height of the title block in the mockup: status bar 47pt + 76.3pt, down to the top of the week card. */
export const GOALS_HEADER_HEIGHT = 123.3;

type Offset = { left?: number; right?: number; top: number };
type SprigPair = { left: DecorAsset; leftAt: Offset; right: DecorAsset; rightAt: Offset };

/**
 * Sprigs painted over the left and right edges of each goal card, measured from the card's top.
 * Goal i uses pair i % 4, so lists longer than the mockup keep the same rhythm.
 * Render them inside the card's full-width wrapper, AFTER the card.
 */
export const GOAL_SPRIGS: SprigPair[] = [
  { left: GOALS_DECOR.sprigGoal1Left, leftAt: { left: 0, top: 48.6 }, right: GOALS_DECOR.sprigGoal1Right, rightAt: { right: 0, top: 27.0 } },
  { left: GOALS_DECOR.sprigGoal2Left, leftAt: { left: 0, top: 45.4 }, right: GOALS_DECOR.sprigGoal2Right, rightAt: { right: 0, top: 41.2 } },
  { left: GOALS_DECOR.sprigGoal3Left, leftAt: { left: 0, top: 47.6 }, right: GOALS_DECOR.sprigGoal3Right, rightAt: { right: 0, top: 43.5 } },
  { left: GOALS_DECOR.sprigGoal4Left, leftAt: { left: 0, top: 27.1 }, right: GOALS_DECOR.sprigGoal4Right, rightAt: { right: 0, top: 52.7 } },
];

/** Offsets inside the week card (from its inner edges) and inside the Add button. */
export const GOALS_ANCHORS = {
  sprigWeekLeft: { left: 53.8, top: 24.0 },
  sprigWeekRight: { right: 49.2, top: 16.2 },
  btnLeavesLeft: { left: 2.0, bottom: 0 },
  btnLeavesRight: { right: 3.9, bottom: 0 },
} as const;

/**
 * Art around the title. It scrolls with the page and is rendered BEFORE the week card (the card hides the cat's
 * shadow line). On phones with a short status bar (iPhone SE) it slides up with the title.
 */
export function GoalsHeaderDecor({ headerHeight }: { headerHeight: number }) {
  const top = Math.min(0, headerHeight - GOALS_HEADER_HEIGHT);
  return (
    <>
      <Decor asset={GOALS_DECOR.leavesTopLeft} style={{ left: 0, top }} />
      <Decor asset={GOALS_DECOR.catTopRight} style={{ right: 0, top }} />
      <Decor asset={GOALS_DECOR.leavesHeaderLeft} style={{ left: 0, top: top + 92.1 }} />
    </>
  );
}

/**
 * Corner art at the end of the page. Make it the FIRST child of the ScrollView content and give the content
 * `flexGrow: 1`: on tall phones it sits at the screen bottom, on short phones it appears when you scroll to the end,
 * so it never sits behind the footnote text.
 */
export function GoalsBottomDecor() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Decor asset={GOALS_DECOR.garlandBottomLeft} style={{ left: 0, bottom: 0 }} />
      <Decor asset={GOALS_DECOR.garlandBottomRight} style={{ right: 0, bottom: 0 }} />
    </View>
  );
}
