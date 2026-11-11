import React from 'react';
import { StyleSheet, Text, View, type StyleProp, type TextStyle, type ViewStyle } from 'react-native';
import { Decor, useArtScale, type DecorAsset } from './Decor';

/** Paper colour of the "How was your day?" mockup. Use it as the screen background. */
export const LOG_DAY_PAPER = '#FCF5E9';

export const LOG_DAY_DECOR = {
  /** Window, flowers, mug, sleeping cat and the vine on the right. Speech bubble is empty: its text is drawn in code. */
  heroScene: { source: require('../../assets/decor/logDay/heroScene.png'), width: 390, height: 248 },
  /** Leaves in the top-left corner of the screen (sits under the status bar). */
  leavesTopLeft: { source: require('../../assets/decor/logDay/leavesTopLeft.png'), width: 49, height: 68 },
  /** Lavender sprig on the right edge. Part of it is hidden behind the text box, so anchor it to that box. */
  lavenderRight: { source: require('../../assets/decor/logDay/lavenderRight.png'), width: 75, height: 198 },
  /** Small leaf sprig on the left edge, above the "Organize my notes" button. */
  leavesBottomLeft: { source: require('../../assets/decor/logDay/leavesBottomLeft.png'), width: 43, height: 53 },
} satisfies Record<string, DecorAsset>;

/** Spots on the hero art, as fractions of the art's width (x) and height (y). */
export const LOG_DAY_SPOTS = {
  /** Text area inside the empty speech bubble. */
  bubbleText: { cx: 0.7271, cy: 0.481, w: 0.154, h: 0.0806 },
  /** Top edge of the date pill (it overlaps the torn top edge of the art). */
  pillTop: 0.1212,
  /** Top edge of the mic button (it overlaps the torn bottom edge of the art). */
  micTop: 0.8087,
} as const;

/**
 * Offsets (pt) for decorations anchored to a piece of UI. A decoration partly hidden behind an element is
 * anchored to that element's corner and rendered BEFORE it, so the hidden part stays hidden on every device.
 */
export const LOG_DAY_ANCHORS = {
  /** Inside the text box wrapper: hidden part ends exactly at the text box's right and bottom edges. */
  lavenderRight: { right: -19.3, bottom: -153.1 },
  /** Inside the "Organize my notes" wrapper (wrapper starts 20pt from the screen's left edge). */
  leavesBottomLeft: { left: -20, top: -45.2 },
} as const;

/** Decorations anchored to the screen corners. First child of the screen root. */
export function LogDayScreenDecor() {
  return (
    <View pointerEvents="none" style={StyleSheet.absoluteFill}>
      <Decor asset={LOG_DAY_DECOR.leavesTopLeft} style={{ left: 0, top: 0 }} />
    </View>
  );
}

type LogDayHeroProps = {
  /** Text inside the cat's speech bubble. Translate it like any other string. */
  bubbleText?: string;
  bubbleTextStyle?: StyleProp<TextStyle>;
  style?: StyleProp<ViewStyle>;
  /** UI placed over the art (date pill, mic…). Position it with LOG_DAY_SPOTS × art height. */
  children?: React.ReactNode;
};

/** Full-width hero illustration plus the speech-bubble text, drawn in code so it can be translated. */
export function LogDayHero({ bubbleText = "I'm listening.", bubbleTextStyle, style, children }: LogDayHeroProps) {
  const s = useArtScale();
  const w = LOG_DAY_DECOR.heroScene.width * s;
  const h = LOG_DAY_DECOR.heroScene.height * s;
  const b = LOG_DAY_SPOTS.bubbleText;
  return (
    <View style={[{ width: w, height: h, alignSelf: 'center' }, style]}>
      <Decor asset={LOG_DAY_DECOR.heroScene} scale={s} style={{ left: 0, top: 0 }} />
      <View
        style={{
          position: 'absolute',
          left: (b.cx - b.w / 2) * w,
          top: (b.cy - b.h / 2) * h,
          width: b.w * w,
          height: b.h * h,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.7}
          style={[styles.bubbleText, { fontSize: 9.6 * s, lineHeight: 12 * s }, bubbleTextStyle]}
        >
          {bubbleText}
        </Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  bubbleText: { color: '#4A2A1E', fontFamily: 'Nunito-Medium', textAlign: 'center' },
});
