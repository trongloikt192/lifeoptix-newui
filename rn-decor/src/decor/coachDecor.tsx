import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Decor, type DecorAsset } from './Decor';

/** Paper colour of the AI Coach mockup. Use it as the screen background. */
export const COACH_PAPER = '#FDF5E3';

export const COACH_DECOR = {
  /** Leaves in the top-left corner (under the status bar, partly behind the back button). */
  leavesTopLeft: { source: require('../../assets/decor/coach/leavesTopLeft.png'), width: 126, height: 64 },
  /** Leaves and flowers in the top-right corner; a leaf tip hangs a little below the header line, in the right margin. */
  flowersTopRight: { source: require('../../assets/decor/coach/flowersTopRight.png'), width: 171, height: 125 },
  /** Thin sprig along the left edge, beside the weekly report card (sits behind the card). */
  leavesReportLeft: { source: require('../../assets/decor/coach/leavesReportLeft.png'), width: 18, height: 119 },
  /** Leaves over the right edge of the first "Things to watch" card. */
  leavesSleepRight: { source: require('../../assets/decor/coach/leavesSleepRight.png'), width: 49, height: 61 },
  /** Flowers over the bottom-right corner of the second "Things to watch" card. */
  flowersEatingRight: { source: require('../../assets/decor/coach/flowersEatingRight.png'), width: 74, height: 76 },
  /** Flower over the bottom-right corner of the "Correlation found" card. */
  flowersCorrRight: { source: require('../../assets/decor/coach/flowersCorrRight.png'), width: 66, height: 71 },
  /** Garland rising from the bottom-left corner of the screen. */
  garlandBottomLeft: { source: require('../../assets/decor/coach/garlandBottomLeft.png'), width: 159, height: 232 },
  /** Flowers in the bottom-right corner of the screen. */
  flowersBottomRight: { source: require('../../assets/decor/coach/flowersBottomRight.png'), width: 75, height: 68 },
  /** Window, plants and sleeping cat inside the weekly report card (right side). No text in it. */
  reportArt: { source: require('../../assets/decor/coach/reportArt.png'), width: 220, height: 154 },
  /** Small leaf in the report card's bottom-left corner. */
  reportLeaf: { source: require('../../assets/decor/coach/reportLeaf.png'), width: 30, height: 27 },
} satisfies Record<string, DecorAsset>;

/** Header height in the mockup (status bar 47pt + 59.5pt), down to the bottom of the divider line. */
export const COACH_HEADER_HEIGHT = 106.5;

/**
 * Offsets (pt) of decorations that belong to a card. Each card sits in a full-width wrapper (cards keep a
 * 17.2pt left / 16.7pt right margin), so `right: 0` / `left: 0` is the screen edge on every width.
 * `top` is measured from the top of that card.
 */
export const COACH_ANCHORS = {
  /** Rendered BEFORE the report card: the card hides the sprig's right edge. */
  leavesReportLeft: { left: 0, top: 106.1 },
  /** Rendered AFTER the card it belongs to, so it paints over that card like the mockup. */
  leavesSleepRight: { right: 0, top: 45.8 },
  flowersEatingRight: { right: 0, top: 34.9 },
  flowersCorrRight: { right: 5, top: 41.7 },
} as const;

/**
 * Corner art of the fixed header. It stays at design size and keeps its distance to the header line:
 * on phones with a short status bar (iPhone SE) it slides up and the screen edge cuts its top, like the mockup.
 */
export function CoachHeaderDecor({ headerHeight }: { headerHeight: number }) {
  const top = Math.min(0, headerHeight - COACH_HEADER_HEIGHT);
  return (
    <>
      <Decor asset={COACH_DECOR.leavesTopLeft} style={{ left: 0, top }} />
      <Decor asset={COACH_DECOR.flowersTopRight} style={{ right: 0, top }} />
    </>
  );
}

/**
 * Corner art at the bottom of the screen. Render it BEFORE the scrolling list: it stays put, the cards scroll
 * over it, and it never covers text.
 */
export function CoachBottomDecor() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Decor asset={COACH_DECOR.garlandBottomLeft} style={{ left: 0, bottom: 0 }} />
      <Decor asset={COACH_DECOR.flowersBottomRight} style={{ right: 0, bottom: 0 }} />
    </View>
  );
}

/**
 * Illustration of the weekly report card. Put it as the first child of the card (the card needs
 * `overflow: 'hidden'` and its border radius). `scale` = card inner height / 154, so the window always runs from the
 * card's top edge to its bottom edge, whatever the text height is.
 */
export function ReportCardArt({ scale }: { scale: number }) {
  return (
    <>
      <Decor asset={COACH_DECOR.reportArt} scale={scale} style={{ right: 0, bottom: 0 }} />
      <Decor asset={COACH_DECOR.reportLeaf} scale={scale} style={{ left: 0, bottom: 0 }} />
    </>
  );
}
