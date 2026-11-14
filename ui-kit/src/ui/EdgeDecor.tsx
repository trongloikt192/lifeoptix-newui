/**
 * Leaves painted over the left/right edges of a card in a list — a screen-layout concern in the mockup,
 * so it wraps the card instead of living inside it. The wrapper spans the full screen width
 * (it cancels the page gutter), offsets are measured from the screen edges, and card i uses pair i % n.
 */
import type { ReactNode } from 'react';
import { GOAL_SPRIGS } from '../../reference/src/decor/goalsDecor';
import { View } from '../primitives';
import type { StyleProp } from '../primitives';
import { Decor } from './Decor';
import type { DecorAsset } from './Decor';

export type SprigPair = { left?: DecorAsset; leftAt?: object; right?: DecorAsset; rightAt?: object };

type CardSprigsProps = {
  index: number;
  children: ReactNode;
  /** Defaults to the Weekly goals rhythm (4 pairs). */
  pairs?: SprigPair[];
  /** Horizontal padding of the page the card sits in. */
  gutter?: number;
  style?: StyleProp;
};

export function CardSprigs({ index, children, pairs = GOAL_SPRIGS, gutter = 17.5, style }: CardSprigsProps) {
  const pair = pairs[index % pairs.length];
  return (
    <View style={[{ marginHorizontal: -gutter }, style]}>
      <View style={{ marginHorizontal: gutter }}>{children}</View>
      {pair.left && <Decor asset={pair.left} style={pair.leftAt as StyleProp} />}
      {pair.right && <Decor asset={pair.right} style={pair.rightAt as StyleProp} />}
    </View>
  );
}
