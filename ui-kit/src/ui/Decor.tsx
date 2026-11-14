/**
 * The reference package's <Decor>, built on this kit's primitives so it sits in the same tree.
 * Assets and anchors come straight from reference/src/decor/* — one source of truth for sizes and offsets.
 * RN: use reference/src/decor/Decor.tsx as is.
 */
import type { DecorAsset } from '../../reference/src/decor/Decor';
import { Image, StyleSheet, View } from '../primitives';
import type { StyleProp } from '../primitives';

export type { DecorAsset };

type DecorProps = {
  asset: DecorAsset;
  /** Absolute offsets inside the parent. */
  style?: StyleProp;
  /** Edge decorations stay at design size; full-bleed art may scale. */
  scale?: number;
};

/** One decorative image: absolutely positioned, ignores touches, hidden from screen readers. */
export function Decor({ asset, style, scale = 1 }: DecorProps) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      style={[{ position: 'absolute', width: asset.width * scale, height: asset.height * scale }, style]}
    >
      <Image source={asset.source as { uri: string }} resizeMode="stretch" style={StyleSheet.absoluteFill} />
    </View>
  );
}
