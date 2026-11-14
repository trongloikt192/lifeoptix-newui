/**
 * Web stand-ins for the React Native primitives this mockup uses.
 *
 * Screens and components import ONLY from here, with RN's prop names and
 * RN's style vocabulary. To move to React Native 0.83, replace this file with
 * re-exports (see README → "Primitives"):
 *
 *   react-native ................. View, Text, Pressable, TextInput, Image, ScrollView,
 *                                  Modal, ActivityIndicator, StyleSheet, useWindowDimensions
 *   react-native-svg ............. Svg, Path, Rect, Ellipse, Circle, G
 *   react-native-safe-area-context useSafeAreaInsets
 *   react-native-reanimated ...... EnteringView → Animated.View entering={…}, PulseView
 *   (own hook) ................... useKeyboardHeight → Keyboard listeners / keyboard-controller
 */
import {
  createContext,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { CSSProperties, ReactNode, Ref } from 'react';
import { createPortal } from 'react-dom';

/* ---------- style ---------- */

type Transform = { scale?: number; translateX?: number; translateY?: number; rotate?: string };

export type RNStyle = Omit<CSSProperties, 'transform'> & {
  paddingHorizontal?: number;
  paddingVertical?: number;
  marginHorizontal?: number;
  marginVertical?: number;
  transform?: Transform[];
  /** Android TextInput only; ignored on web. */
  textAlignVertical?: 'top' | 'center' | 'bottom';
  /** RN 0.83 (New Architecture) name for CSS background-image gradients. */
  experimental_backgroundImage?: string;
};

export type StyleProp = RNStyle | false | null | undefined | StyleProp[];

export const StyleSheet = {
  create: <T extends Record<string, RNStyle>>(styles: T): T => styles,
  absoluteFill: { position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 } as RNStyle,
  hairlineWidth: 1,
};

function flatten(style: StyleProp, out: RNStyle = {}): RNStyle {
  if (!style) return out;
  if (Array.isArray(style)) {
    style.forEach((s) => flatten(s, out));
    return out;
  }
  return Object.assign(out, style);
}

function toWeb(style: StyleProp): CSSProperties {
  const {
    paddingHorizontal,
    paddingVertical,
    marginHorizontal,
    marginVertical,
    transform,
    experimental_backgroundImage,
    lineHeight,
    textAlignVertical: _textAlignVertical,
    ...rest
  } = flatten(style);
  const css: CSSProperties = { ...rest };
  if (paddingHorizontal != null) css.paddingLeft = css.paddingRight = paddingHorizontal;
  if (paddingVertical != null) css.paddingTop = css.paddingBottom = paddingVertical;
  if (marginHorizontal != null) css.marginLeft = css.marginRight = marginHorizontal;
  if (marginVertical != null) css.marginTop = css.marginBottom = marginVertical;
  if (experimental_backgroundImage) css.backgroundImage = experimental_backgroundImage;
  // RN lineHeight is in dp; a bare number in CSS would be a multiplier.
  if (lineHeight != null) css.lineHeight = typeof lineHeight === 'number' ? `${lineHeight}px` : lineHeight;
  if (transform) {
    css.transform = transform
      .map((t) =>
        Object.entries(t)
          .map(([k, v]) => `${k}(${typeof v === 'number' && k !== 'scale' ? `${v}px` : v})`)
          .join(' '),
      )
      .join(' ');
  }
  return css;
}

/** RN's layout defaults: every box is a border-box flex column that does not shrink. */
const viewBase: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'stretch',
  position: 'relative',
  boxSizing: 'border-box',
  flexShrink: 0,
  minWidth: 0,
  minHeight: 0,
  margin: 0,
  padding: 0,
  borderStyle: 'solid',
  borderWidth: 0,
};

/* ---------- accessibility ---------- */

type A11y = {
  accessibilityLabel?: string;
  accessibilityHint?: string;
  /** Decorative: hidden from assistive tech (RN: accessibilityElementsHidden / importantForAccessibility). */
  accessibilityElementsHidden?: boolean;
};

type A11yValue = { min?: number; max?: number; now?: number; text?: string };

/* ---------- View / Text / Image ---------- */

type ViewRole = 'tablist' | 'header' | 'none' | 'radiogroup' | 'list' | 'progressbar' | 'alert' | 'search' | 'summary';

type ViewProps = A11y & {
  style?: StyleProp;
  children?: ReactNode;
  pointerEvents?: 'none' | 'auto' | 'box-none';
  accessibilityRole?: ViewRole;
  accessibilityValue?: A11yValue;
  /** iOS: marks the view as a modal container (web: role=dialog, aria-modal). */
  accessibilityViewIsModal?: boolean;
  accessibilityLiveRegion?: 'polite' | 'assertive' | 'none';
  /** Groups children into one accessible element. */
  accessible?: boolean;
};

const webRole: Partial<Record<ViewRole, string>> = {
  radiogroup: 'radiogroup',
  list: 'list',
  progressbar: 'progressbar',
  alert: 'alert',
  search: 'search',
};

export function View({
  style,
  children,
  pointerEvents,
  accessibilityLabel,
  accessibilityElementsHidden,
  accessibilityRole,
  accessibilityValue,
  accessibilityViewIsModal,
  accessibilityLiveRegion,
}: ViewProps) {
  const Tag = accessibilityRole === 'tablist' ? 'nav' : 'div';
  const pe = pointerEvents === 'box-none' ? 'none' : pointerEvents;
  return (
    <Tag
      role={accessibilityViewIsModal ? 'dialog' : accessibilityRole ? webRole[accessibilityRole] : undefined}
      aria-modal={accessibilityViewIsModal || undefined}
      aria-label={accessibilityLabel}
      aria-hidden={accessibilityElementsHidden || undefined}
      aria-live={accessibilityLiveRegion && accessibilityLiveRegion !== 'none' ? accessibilityLiveRegion : undefined}
      aria-valuemin={accessibilityValue?.min}
      aria-valuemax={accessibilityValue?.max}
      aria-valuenow={accessibilityValue?.now}
      aria-valuetext={accessibilityValue?.text}
      className={pointerEvents === 'box-none' ? 'rn-box-none' : undefined}
      style={{ ...viewBase, pointerEvents: pe, ...toWeb(style) }}
    >
      {children}
    </Tag>
  );
}

type TextProps = {
  style?: StyleProp;
  children?: ReactNode;
  numberOfLines?: number;
  accessibilityRole?: 'header';
  accessibilityElementsHidden?: boolean;
};

const InText = createContext(false);

export function Text({ style, children, numberOfLines, accessibilityRole, accessibilityElementsHidden }: TextProps) {
  const nested = useContext(InText);
  if (nested) {
    // RN lays nested <Text> out inline; mirror that with a span.
    return <span style={{ ...toWeb(style), display: 'inline' }}>{children}</span>;
  }
  const Tag = accessibilityRole === 'header' ? 'h2' : 'div';
  const clamp: CSSProperties =
    numberOfLines === 1
      ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
      : numberOfLines
        ? { display: '-webkit-box', WebkitLineClamp: numberOfLines, WebkitBoxOrient: 'vertical', overflow: 'hidden' }
        : { whiteSpace: 'pre-wrap' };
  return (
    <Tag
      aria-hidden={accessibilityElementsHidden || undefined}
      style={{
        boxSizing: 'border-box',
        position: 'relative',
        flexShrink: 0,
        minWidth: 0,
        margin: 0,
        padding: 0,
        fontWeight: 400,
        textAlign: 'left', // RN Text default; web would inherit centring from <button>
        ...clamp,
        ...toWeb(style),
      }}
    >
      <InText.Provider value>{children}</InText.Provider>
    </Tag>
  );
}

type ImageProps = A11y & {
  /** Web: imported asset URL or { uri }. RN: require('...'). */
  source: string | { uri: string } | number;
  style?: StyleProp;
  resizeMode?: 'cover' | 'contain' | 'stretch';
};

export function Image({ source, style, resizeMode = 'cover', accessibilityLabel }: ImageProps) {
  const css = toWeb(style);
  // An <img> ignores left+right / top+bottom for sizing; RN's Image does not.
  if (css.position === 'absolute') {
    if (css.left != null && css.right != null) css.width ??= '100%';
    if (css.top != null && css.bottom != null) css.height ??= '100%';
  }
  return (
    <img
      src={typeof source === 'object' ? source.uri : String(source)}
      alt={accessibilityLabel ?? ''}
      aria-hidden={accessibilityLabel ? undefined : true}
      draggable={false}
      style={{ display: 'block', objectFit: resizeMode === 'stretch' ? 'fill' : resizeMode, ...css }}
    />
  );
}

/* ---------- Pressable ---------- */

type PressState = { pressed: boolean };

type PressableProps = A11y & {
  style?: StyleProp | ((s: PressState) => StyleProp);
  children?: ReactNode | ((s: PressState) => ReactNode);
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  onLongPress?: () => void;
  disabled?: boolean;
  hitSlop?: number;
  accessibilityRole?: 'button' | 'tab' | 'switch' | 'radio' | 'checkbox' | 'link' | 'menuitem';
  accessibilityState?: { selected?: boolean; disabled?: boolean; checked?: boolean; busy?: boolean };
};

export function Pressable({
  style,
  children,
  onPress,
  onPressIn,
  onPressOut,
  disabled,
  accessibilityLabel,
  accessibilityHint,
  accessibilityRole,
  accessibilityState,
}: PressableProps) {
  const [pressed, setPressed] = useState(false);
  const down = () => {
    if (disabled) return;
    setPressed(true);
    onPressIn?.();
  };
  const up = () => {
    if (!pressed) return;
    setPressed(false);
    onPressOut?.();
  };
  const state = { pressed };
  const checkable = accessibilityRole === 'switch' || accessibilityRole === 'radio' || accessibilityRole === 'checkbox';
  return (
    <button
      type="button"
      className="rn-pressable"
      disabled={disabled}
      role={checkable || accessibilityRole === 'menuitem' ? accessibilityRole : undefined}
      aria-checked={checkable ? !!accessibilityState?.checked : undefined}
      aria-busy={accessibilityState?.busy || undefined}
      aria-label={accessibilityLabel}
      aria-description={accessibilityHint}
      aria-current={accessibilityRole === 'tab' && accessibilityState?.selected ? 'page' : undefined}
      aria-pressed={
        !checkable && accessibilityRole !== 'tab' && accessibilityState?.selected != null
          ? accessibilityState.selected
          : undefined
      }
      onClick={onPress}
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && !e.repeat && down()}
      onKeyUp={up}
      onBlur={up}
      style={{
        ...viewBase,
        background: 'transparent',
        color: 'inherit',
        font: 'inherit',
        textAlign: 'inherit',
        cursor: disabled ? 'default' : 'pointer',
        touchAction: 'manipulation',
        userSelect: 'none',
        ...toWeb(typeof style === 'function' ? style(state) : style),
      }}
    >
      {typeof children === 'function' ? children(state) : children}
    </button>
  );
}

/* ---------- TextInput ---------- */

type TextInputProps = A11y & {
  value: string;
  onChangeText: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  onSubmitEditing?: () => void;
  placeholder?: string;
  placeholderTextColor?: string;
  selectionColor?: string;
  maxLength?: number;
  multiline?: boolean;
  autoFocus?: boolean;
  editable?: boolean;
  keyboardType?: 'default' | 'numeric' | 'decimal-pad' | 'number-pad' | 'web-search';
  returnKeyType?: 'done' | 'search' | 'next';
  style?: StyleProp;
};

const inputMode = { default: 'text', numeric: 'numeric', 'decimal-pad': 'decimal', 'number-pad': 'numeric', 'web-search': 'search' } as const;

export function TextInput({
  value,
  onChangeText,
  onFocus,
  onBlur,
  onSubmitEditing,
  placeholder,
  placeholderTextColor,
  selectionColor,
  maxLength,
  multiline,
  autoFocus,
  editable = true,
  keyboardType = 'default',
  returnKeyType,
  accessibilityLabel,
  style,
}: TextInputProps) {
  const css: CSSProperties = {
    boxSizing: 'border-box',
    margin: 0,
    padding: 0,
    border: 'none',
    background: 'transparent',
    resize: 'none',
    minWidth: 0,
    caretColor: selectionColor,
    ['--placeholder' as string]: placeholderTextColor,
    ...toWeb(style),
  };
  const common = {
    className: 'rn-input',
    value,
    placeholder,
    maxLength,
    autoFocus,
    readOnly: !editable,
    inputMode: inputMode[keyboardType],
    enterKeyHint: returnKeyType,
    'aria-label': accessibilityLabel,
    onFocus,
    onBlur,
    style: css,
  };
  return multiline ? (
    <textarea {...common} onChange={(e) => onChangeText(e.target.value)} />
  ) : (
    <input
      {...common}
      type={keyboardType === 'web-search' ? 'search' : 'text'}
      onChange={(e) => onChangeText(e.target.value)}
      onKeyDown={(e) => e.key === 'Enter' && onSubmitEditing?.()}
    />
  );
}

/* ---------- ScrollView ---------- */

export type ScrollViewHandle = { scrollTo: (o: { x?: number; y?: number; animated?: boolean }) => void };
type ScrollEvent = { nativeEvent: { contentOffset: { x: number; y: number } } };

type ScrollViewProps = {
  ref?: Ref<ScrollViewHandle>;
  style?: StyleProp;
  contentContainerStyle?: StyleProp;
  children?: ReactNode;
  horizontal?: boolean;
  showsVerticalScrollIndicator?: boolean;
  showsHorizontalScrollIndicator?: boolean;
  keyboardShouldPersistTaps?: 'handled' | 'always' | 'never';
  /** RN snaps natively; the web shim snaps once scrolling settles. */
  snapToInterval?: number;
  decelerationRate?: 'fast' | 'normal';
  contentOffset?: { x: number; y: number };
  onScroll?: (e: ScrollEvent) => void;
  onMomentumScrollEnd?: (e: ScrollEvent) => void;
  accessibilityLabel?: string;
};

export function ScrollView({
  ref,
  style,
  contentContainerStyle,
  children,
  horizontal,
  showsVerticalScrollIndicator = true,
  showsHorizontalScrollIndicator = true,
  snapToInterval,
  contentOffset,
  onScroll,
  onMomentumScrollEnd,
  accessibilityLabel,
}: ScrollViewProps) {
  const el = useRef<HTMLDivElement>(null);
  const timer = useRef<number>(0);
  const reported = useRef<number | null>(null);

  useImperativeHandle(ref, () => ({
    scrollTo: ({ x = 0, y = 0, animated = true }) =>
      el.current?.scrollTo({ left: x, top: y, behavior: animated ? 'smooth' : 'instant' }),
  }));

  useLayoutEffect(() => {
    if (el.current && contentOffset) {
      el.current.scrollLeft = contentOffset.x;
      el.current.scrollTop = contentOffset.y;
    }
    // initial offset only, like RN
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const event = (): ScrollEvent => ({
    nativeEvent: { contentOffset: { x: el.current?.scrollLeft ?? 0, y: el.current?.scrollTop ?? 0 } },
  });

  const handleScroll = () => {
    onScroll?.(event());
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      const node = el.current;
      if (!node) return;
      const pos = horizontal ? node.scrollLeft : node.scrollTop;
      if (snapToInterval) {
        const target = Math.round(pos / snapToInterval) * snapToInterval;
        if (Math.abs(target - pos) > 1) {
          node.scrollTo({ [horizontal ? 'left' : 'top']: target, behavior: 'smooth' });
          return; // the snap scroll ends in another settle
        }
      }
      if (reported.current !== Math.round(pos)) {
        reported.current = Math.round(pos);
        onMomentumScrollEnd?.(event());
      }
    }, 110);
  };

  const hide = horizontal ? !showsHorizontalScrollIndicator : !showsVerticalScrollIndicator;
  return (
    <div
      ref={el}
      aria-label={accessibilityLabel}
      className={hide ? 'rn-noscroll' : undefined}
      onScroll={handleScroll}
      style={{
        ...viewBase,
        overflowX: horizontal ? 'auto' : 'hidden',
        overflowY: horizontal ? 'hidden' : 'auto',
        overscrollBehavior: 'contain',
        ...toWeb(style),
      }}
    >
      <div
        style={{
          ...viewBase,
          flexDirection: horizontal ? 'row' : 'column',
          ...(horizontal ? { alignSelf: 'flex-start' } : {}),
          ...toWeb(contentContainerStyle),
        }}
      >
        {children}
      </div>
    </div>
  );
}

/* ---------- Modal ---------- */

const modalStack: string[] = [];

type ModalProps = {
  visible: boolean;
  transparent?: boolean;
  animationType?: 'none' | 'fade' | 'slide';
  onRequestClose?: () => void;
  statusBarTranslucent?: boolean;
  children?: ReactNode;
};

/**
 * Web: portals into #rn-modal-host (inside the device frame) so overlays stay
 * in the phone. RN: the real Modal covers the window natively.
 */
export function Modal({ visible, animationType = 'none', onRequestClose, children }: ModalProps) {
  const [host, setHost] = useState<HTMLElement | null>(null);
  const id = useId();
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => setHost(document.getElementById('rn-modal-host') ?? document.body), []);

  useEffect(() => {
    if (!visible) return;
    modalStack.push(id);
    const prev = document.activeElement as HTMLElement | null;
    root.current?.focus({ preventScroll: true });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && modalStack[modalStack.length - 1] === id) onRequestClose?.();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      modalStack.splice(modalStack.indexOf(id), 1);
      prev?.focus?.({ preventScroll: true });
    };
  }, [visible, id, onRequestClose]);

  if (!visible || !host) return null;
  return createPortal(
    <div
      ref={root}
      tabIndex={-1}
      className={animationType === 'fade' ? 'rn-enter-FadeIn' : undefined}
      style={{ ...viewBase, position: 'absolute', inset: 0, outline: 'none', pointerEvents: 'auto' }}
    >
      {children}
    </div>,
    host,
  );
}

/* ---------- motion (Reanimated in the app) ---------- */

export type Entering = 'SlideInDown' | 'SlideInUp' | 'FadeIn' | 'ZoomIn';

/** RN: <Animated.View entering={SlideInDown.duration(260)} /> from react-native-reanimated. */
export function EnteringView({ entering, style, children, pointerEvents }: { entering: Entering; style?: StyleProp; children?: ReactNode; pointerEvents?: 'box-none' | 'auto' }) {
  return (
    <div
      className={`rn-enter-${entering}${pointerEvents === 'box-none' ? ' rn-box-none' : ''}`}
      style={{ ...viewBase, ...(pointerEvents === 'box-none' ? { pointerEvents: 'none' } : {}), ...toWeb(style) }}
    >
      {children}
    </div>
  );
}

/** Looping opacity pulse for skeletons and live indicators. RN: withRepeat(withTiming(...)). */
export function PulseView({ style, children, speed = 'normal' }: { style?: StyleProp; children?: ReactNode; speed?: 'normal' | 'fast' }) {
  return (
    <div className={speed === 'fast' ? 'rn-pulse-fast' : 'rn-pulse'} aria-hidden="true" style={{ ...viewBase, ...toWeb(style) }}>
      {children}
    </div>
  );
}

export function ActivityIndicator({ size = 'small', color = '#586B3D' }: { size?: 'small' | 'large' | number; color?: string }) {
  const px = size === 'small' ? 20 : size === 'large' ? 36 : size;
  return (
    <svg className="rn-spin" width={px} height={px} viewBox="0 0 24 24" fill="none" role="progressbar" aria-label="Loading">
      <circle cx="12" cy="12" r="9" stroke={color} strokeOpacity="0.2" strokeWidth="2.6" />
      <path d="M12 3a9 9 0 0 1 9 9" stroke={color} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/* ---------- environment hooks ---------- */

const SAFE_AREA = { top: 47, bottom: 34, left: 0, right: 0 };
/** RN: export { useSafeAreaInsets } from 'react-native-safe-area-context'. */
export function useSafeAreaInsets() {
  return SAFE_AREA;
}

/** RN: export { useWindowDimensions } from 'react-native'. The web preview is a 390 × 844 phone. */
export function useWindowDimensions() {
  return { width: 390, height: 844 };
}

const KeyboardContext = createContext(0);
/** Web preview only: the gallery draws a keyboard and announces its height here. */
export const KeyboardSimProvider = KeyboardContext.Provider;
/**
 * Height of the on-screen keyboard (0 when hidden).
 * RN: useReanimatedKeyboardAnimation / useKeyboardState from react-native-keyboard-controller,
 * or Keyboard.addListener('keyboardWillShow' | 'keyboardDidShow').
 */
export function useKeyboardHeight() {
  return useContext(KeyboardContext);
}

/* ---------- SVG (react-native-svg shares these prop names) ---------- */

export const Svg = 'svg';
export const Path = 'path';
export const Rect = 'rect';
export const Ellipse = 'ellipse';
export const Circle = 'circle';
export const G = 'g';
