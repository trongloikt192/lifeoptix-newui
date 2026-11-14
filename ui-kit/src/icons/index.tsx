/**
 * Icons — vector paths taken 1:1 from the design.
 * Only react-native-svg-compatible elements and camelCase props are used.
 */
import { Ellipse, G, Path, Rect, Svg } from '../primitives';

type IconProps = { size?: number; color?: string };

export function CloseIcon({ size = 19.2, color = '#411B0E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.8} strokeLinecap="round">
      <Path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

/** Calendar with a filled header band; `check` adds the tick used for "Today". */
export function CalendarIcon({ size = 19.2, color = '#3F1A10', check = false }: IconProps & { check?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={3.5} y={5} width={17} height={15.5} rx={3} />
      <Path d="M3.5 7.8a2.8 2.8 0 0 1 2.8-2.8h11.4a2.8 2.8 0 0 1 2.8 2.8v2.2h-17z" fill={color} />
      <Path d={check ? 'M8 2.6v3.6M16 2.6v3.6M8.8 15.2l2.2 2.2 4.3-4.4' : 'M8 2.6v3.6M16 2.6v3.6'} />
    </Svg>
  );
}

export function ChevronDownIcon({ size = 16.8, color = '#3F1A10' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function ChevronRightIcon({ size = 15.8, color = '#842A0E' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function MicIcon({ size = 45, color = '#FBF7ED' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round">
      <Rect x={9} y={2.5} width={6} height={12} rx={3} />
      <Path d="M5 11.5a7 7 0 0 0 14 0M12 18.5v3" />
    </Svg>
  );
}

/** Three short rays beside the talk button. */
export function SparkRays({ side, color = '#DBA149' }: { side: 'left' | 'right'; color?: string }) {
  return (
    <Svg width={14} height={28.5} viewBox="0 0 14 28.5" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round">
      <Path d={side === 'left' ? 'M6.8 2l5.4 4.4M2 14.1h8.6M6.8 27l5.4-4.4' : 'M7.2 2l-5.4 4.4M12 14.1H3.4M7.2 27l-5.4-4.4'} />
    </Svg>
  );
}

export function BulbIcon({ size = 22, color = '#B4421B' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
    </Svg>
  );
}

/** Drawn slightly taller than wide, as in the design (23.2 × 23.1 over a 24 × 22 box). */
export function SparklesIcon({ color = '#FFFFFF' }: { color?: string }) {
  return (
    <Svg width={23.2} height={23.1} viewBox="0 0 24 22" preserveAspectRatio="none" fill={color} opacity={0.92}>
      <Path d="M8.5 2C9.3 7.4 10.6 9.9 15.5 11 10.6 12.1 9.3 14.6 8.5 20 7.7 14.6 6.4 12.1 1.5 11 6.4 9.9 7.7 7.4 8.5 2z" />
      <Path d="M18.5.6c.3 1.8.8 2.4 2.8 2.8-2 .4-2.5 1-2.8 2.8-.3-1.8-.8-2.4-2.8-2.8 2-.4 2.5-1 2.8-2.8z" />
      <Path d="M18.8 15.1c.25 1.5.7 2 2.3 2.3-1.6.3-2.05.8-2.3 2.3-.25-1.5-.7-2-2.3-2.3 1.6-.3 2.05-.8 2.3-2.3z" />
    </Svg>
  );
}

export function PlusIcon({ size = 31, color = '#FBF7ED' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round">
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

/** Sprout. `cutout` must match the surface behind it (it carves the gap between the leaves). */
export function GardenIcon({ size = 23, color = '#462417', cutout = '#FDF7EC' }: IconProps & { cutout?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <Ellipse cx={7.1} cy={14.6} rx={3.5} ry={6.5} transform="rotate(-38 7.1 14.6)" />
      <Ellipse cx={16.9} cy={14.6} rx={3.5} ry={6.5} transform="rotate(38 16.9 14.6)" />
      <Path d="M12 9.4V19.6" stroke={cutout} strokeWidth={2.8} strokeLinecap="round" />
      <Ellipse cx={12} cy={6.4} rx={3.3} ry={4.3} />
      <Rect x={11.3} y={9} width={1.4} height={12.6} rx={0.7} />
      <Path d="M10.6 20.2 12 22.7l1.4-2.5z" />
    </Svg>
  );
}

export function LessonsIcon({ size = 25 }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d="M11.3 6.6C9.4 5.3 6.4 4.8 2.6 5.1v13.4c3.7-.3 6.7.2 8.7 1.6z" fill="#8C6A57" stroke="#4A2A1E" strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M12.7 6.6c1.9-1.3 4.9-1.8 8.7-1.5v13.4c-3.7-.3-6.7.2-8.7 1.6z" fill="#FFF9F0" stroke="#4A2A1E" strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M15 9.3h4.2M15 12h4.2M15 14.7h4.2" stroke="#4A2A1E" strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

export function MenuIcon({ size = 22.5, color = '#482215' }: IconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2}>
      <Rect x={3.5} y={3.5} width={7} height={7} rx={1.6} />
      <Rect x={13.5} y={3.5} width={7} height={7} rx={1.6} />
      <Rect x={3.5} y={13.5} width={7} height={7} rx={1.6} />
      <Rect x={13.5} y={13.5} width={7} height={7} rx={1.6} />
    </Svg>
  );
}

/* ---------- device chrome (mockup only — not part of the RN app) ---------- */

export function StatusGlyphs({ ink = '#30130A', dim = '#B9AEA4', rim = '#A89A90' }) {
  return (
    <>
      <Svg width={19} height={3.4} viewBox="0 0 19 3.4" style={{ position: 'absolute', left: 279.1, top: 33.6 }}>
        {[0, 5.13, 10.26, 15.4].map((x) => (
          <Rect key={x} x={x} y={0} width={3.4} height={3.4} rx={1} fill={dim} />
        ))}
      </Svg>
      <Svg width={17} height={12.8} viewBox="0 0 17 12.8" style={{ position: 'absolute', left: 305.1, top: 24.8 }}>
        <G fill={ink} stroke={ink} strokeWidth={0.6} strokeLinejoin="round">
          <Path d="M.04 3.99A11.9 11.9 0 0 1 16.86 3.99L15.03 5.82A9.3 9.3 0 0 0 1.87 5.82Z" />
          <Path d="M3.15 7.1A7.5 7.5 0 0 1 13.75 7.1L11.92 8.94A4.9 4.9 0 0 0 4.99 8.94Z" />
          <Path d="M8.45 12.4 6.26 10.21A3.1 3.1 0 0 1 10.64 10.21Z" />
        </G>
      </Svg>
      <Svg width={27} height={11} viewBox="0 0 27 11" style={{ position: 'absolute', left: 329.1, top: 24.8 }}>
        <Rect x={0.5} y={0.5} width={23} height={10} rx={3.4} fill="none" stroke={rim} strokeWidth={1} />
        <Rect x={2.2} y={2.1} width={19.6} height={6.8} rx={2} fill={ink} />
        <Rect x={24.6} y={3.6} width={1.6} height={3.8} rx={0.8} fill={rim} />
      </Svg>
    </>
  );
}
