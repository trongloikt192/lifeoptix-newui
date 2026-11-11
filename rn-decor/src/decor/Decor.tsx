import React from 'react';
import { Image, StyleSheet, View, useWindowDimensions, type ImageSourcePropType, type StyleProp, type ViewStyle } from 'react-native';

/** Width (pt) of the frame the mockups were drawn for. Every measured number in the decor files uses this frame. */
export const DESIGN_WIDTH = 390;

export type DecorAsset = {
  source: ImageSourcePropType;
  /** Size in pt at the design width. Metro picks the @2x / @3x file automatically. */
  width: number;
  height: number;
};

/**
 * Scale for full-bleed art: the art keeps the design's proportions on any width.
 * Capped so tablets don't get a giant illustration.
 */
export function useArtScale(maxWidth = 600) {
  const { width } = useWindowDimensions();
  return Math.min(width, maxWidth) / DESIGN_WIDTH;
}

type DecorProps = {
  asset: DecorAsset;
  /** Absolute offsets (left/top/right/bottom) inside the parent. */
  style?: StyleProp<ViewStyle>;
  /** Edge decorations stay at design size (scale 1); full-bleed art uses useArtScale(). */
  scale?: number;
};

/**
 * One decorative image, absolutely positioned. Ignores touches and is hidden from screen readers.
 * Paint order decides what covers what: render it BEFORE the UI it should sit behind,
 * AFTER the UI it should sit on top of.
 */
export function Decor({ asset, style, scale = 1 }: DecorProps) {
  return (
    <View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[{ position: 'absolute', width: asset.width * scale, height: asset.height * scale }, style]}
    >
      <Image source={asset.source} style={StyleSheet.absoluteFill} resizeMode="stretch" />
    </View>
  );
}
