import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Decor, useArtScale, type DecorAsset } from './Decor';

/** Paper colour of the Event reminders mockup. Use it as the screen background. */
export const EVENTS_PAPER = '#FDF2D8';

const req = {
  leavesTopLeft: require('../../assets/decor/events/leavesTopLeft.png'),
  flowersTopRight: require('../../assets/decor/events/flowersTopRight.png'),
  leavesTodayLeft: require('../../assets/decor/events/leavesTodayLeft.png'),
  leavesTodayRight: require('../../assets/decor/events/leavesTodayRight.png'),
  todayLeavesLeft: require('../../assets/decor/events/todayLeavesLeft.png'),
  todayLeavesRight: require('../../assets/decor/events/todayLeavesRight.png'),
  sprigEvent1Left: require('../../assets/decor/events/sprigEvent1Left.png'),
  sprigEvent1Right: require('../../assets/decor/events/sprigEvent1Right.png'),
  sprigEvent2Left: require('../../assets/decor/events/sprigEvent2Left.png'),
  sprigEvent2Right: require('../../assets/decor/events/sprigEvent2Right.png'),
  sprigEvent3Left: require('../../assets/decor/events/sprigEvent3Left.png'),
  sprigEvent3Right: require('../../assets/decor/events/sprigEvent3Right.png'),
  addLeavesLeft: require('../../assets/decor/events/addLeavesLeft.png'),
  addLeavesRight: require('../../assets/decor/events/addLeavesRight.png'),
  bottomScene: require('../../assets/decor/events/bottomScene.png'),
};

export const EVENTS_DECOR = {
  /** Leaves in the top-left corner, under the status bar. */
  leavesTopLeft: { source: req.leavesTopLeft, width: 126, height: 66 },
  /** Leaves and flowers in the top-right corner, hanging down beside the "today" card. */
  flowersTopRight: { source: req.flowersTopRight, width: 152, height: 171 },
  /** Small sprigs just outside the left / right edge of the "today" card. */
  leavesTodayLeft: { source: req.leavesTodayLeft, width: 15, height: 39 },
  leavesTodayRight: { source: req.leavesTodayRight, width: 27, height: 51 },
  /** Light leaves painted INSIDE the green "today" card, bottom corners. */
  todayLeavesLeft: { source: req.todayLeavesLeft, width: 33, height: 26 },
  todayLeavesRight: { source: req.todayLeavesRight, width: 42, height: 31 },
  /** Sprigs INSIDE each event card: one over the date tile's corner, one under the bell button. */
  sprigEvent1Left: { source: req.sprigEvent1Left, width: 33, height: 35 },
  sprigEvent1Right: { source: req.sprigEvent1Right, width: 69, height: 31 },
  sprigEvent2Left: { source: req.sprigEvent2Left, width: 36, height: 30 },
  sprigEvent2Right: { source: req.sprigEvent2Right, width: 64, height: 33 },
  sprigEvent3Left: { source: req.sprigEvent3Left, width: 32, height: 29 },
  sprigEvent3Right: { source: req.sprigEvent3Right, width: 54, height: 34 },
  /** Light leaves INSIDE the green "Add event" button. */
  addLeavesLeft: { source: req.addLeavesLeft, width: 48, height: 35 },
  addLeavesRight: { source: req.addLeavesRight, width: 41, height: 33 },
  /** Window, flowers, book and sleeping cat on the sill: the end of the page. Full width, scales with the screen. */
  bottomScene: { source: req.bottomScene, width: 390, height: 244 },
} satisfies Record<string, DecorAsset>;

/** Height of the title block in the mockup (status bar 47pt + 65.7pt), down to the top of the "today" card. */
export const EVENTS_HEADER_HEIGHT = 112.7;
/** How far the bottom scene reaches up behind the "Add event" button (pt at 390). */
export const EVENTS_SCENE_OVERLAP = 12.4;

type Offset = { left?: number; right?: number; bottom: number };
type SprigPair = { left: DecorAsset; leftAt: Offset; right: DecorAsset; rightAt: Offset };

/**
 * Sprigs inside each event card, measured from the card's inner bottom corners. Event i uses pair i % 3.
 * Render them inside the card, AFTER the date tile (the left one paints over the tile's corner) and before the text.
 */
export const EVENT_SPRIGS: SprigPair[] = [
  { left: EVENTS_DECOR.sprigEvent1Left, leftAt: { left: 0.2, bottom: -1.2 }, right: EVENTS_DECOR.sprigEvent1Right, rightAt: { right: 6.2, bottom: -1.2 } },
  { left: EVENTS_DECOR.sprigEvent2Left, leftAt: { left: 0.2, bottom: -2.1 }, right: EVENTS_DECOR.sprigEvent2Right, rightAt: { right: 6.2, bottom: -3.5 } },
  { left: EVENTS_DECOR.sprigEvent3Left, leftAt: { left: -0.7, bottom: -2.5 }, right: EVENTS_DECOR.sprigEvent3Right, rightAt: { right: 8.5, bottom: -3.4 } },
];

/** Offsets inside the green cards (from their inner edges) and around the "today" card (from its top, screen edges). */
export const EVENTS_ANCHORS = {
  todayLeavesLeft: { left: 0.4, bottom: -1.1 },
  todayLeavesRight: { right: 0.8, bottom: -1.1 },
  /** Rendered BEFORE the "today" card. */
  leavesTodayLeft: { left: 0, top: 56.4 },
  leavesTodayRight: { right: 0, top: 83.9 },
  addLeavesLeft: { left: 0, bottom: 0 },
  addLeavesRight: { right: 0, bottom: 0 },
} as const;

/** Corner art around the title. Scrolls with the page; on short status bars it slides up with the title. */
export function EventsHeaderDecor({ headerHeight }: { headerHeight: number }) {
  const top = Math.min(0, headerHeight - EVENTS_HEADER_HEIGHT);
  return (
    <>
      <Decor asset={EVENTS_DECOR.leavesTopLeft} style={{ left: 0, top }} />
      <Decor asset={EVENTS_DECOR.flowersTopRight} style={{ right: 0, top }} />
    </>
  );
}

/**
 * The sill scene that ends the page. Make it the FIRST child of the ScrollView content (content needs
 * `flexGrow: 1`) and give the content `paddingBottom = useSceneSpace()`. On tall phones it sits at the screen bottom,
 * on short phones it appears when you scroll to the end.
 */
export function EventsBottomScene() {
  const s = useArtScale();
  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, { alignItems: 'center' }]}>
      <Decor asset={EVENTS_DECOR.bottomScene} scale={s} style={{ bottom: 0 }} />
    </View>
  );
}

/** Space to leave under the last button so it sits on the scene like in the mockup. */
export function useSceneSpace() {
  const s = useArtScale();
  return (EVENTS_DECOR.bottomScene.height - EVENTS_SCENE_OVERLAP) * s;
}
