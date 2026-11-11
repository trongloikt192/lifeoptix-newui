/** Icons drawn in code (react-native-svg) so they stay sharp and can be recoloured. 24×24 viewBox unless noted. */
import React from 'react';
import Svg, { Circle, Ellipse, G, Path, Rect } from 'react-native-svg';

type P = { size?: number; color?: string; strokeWidth?: number; style?: object };

export function CalendarIcon({ size = 20, color = '#3F1A10', check = false, style }: P & { check?: boolean }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Rect x={3.5} y={5} width={17} height={15.5} rx={3} />
      <Path d="M3.5 7.8a2.8 2.8 0 0 1 2.8-2.8h11.4a2.8 2.8 0 0 1 2.8 2.8v2.2h-17z" fill={color} />
      <Path d={check ? 'M8 2.6v3.6M16 2.6v3.6M8.8 15.2l2.2 2.2 4.3-4.4' : 'M8 2.6v3.6M16 2.6v3.6'} />
    </Svg>
  );
}

export function ChevronRight({ size = 16, color = '#3F1A10', strokeWidth = 2.4, style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M9 6l6 6-6 6" />
    </Svg>
  );
}

export function ChevronDown({ size = 16, color = '#3F1A10', strokeWidth = 2.4, style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M6 9l6 6 6-6" />
    </Svg>
  );
}

export function CloseIcon({ size = 19, color = '#411B0E', strokeWidth = 2.8, style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" style={style}>
      <Path d="M6 6l12 12M18 6L6 18" />
    </Svg>
  );
}

export function MicIcon({ size = 45, color = '#FBF7ED', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Rect x={9} y={2.5} width={6} height={12} rx={3} />
      <Path d="M5 11.5a7 7 0 0 0 14 0M12 18.5v3" />
    </Svg>
  );
}

export function BulbIcon({ size = 22, color = '#B4421B', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" />
    </Svg>
  );
}

export function BellIcon({ size = 20, color = '#B57A00', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.6 1.8H4.4z" />
      <Path d="M10 21a2.2 2.2 0 0 0 4 0M12 3v1.8" />
    </Svg>
  );
}

export function FlagIcon({ size = 16, color = '#3B6A04', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path d="M6 3.5v17" stroke={color} strokeWidth={2.4} strokeLinecap="round" />
      <Path d="M7 4h11.5l-2.6 4.2 2.6 4.3H7z" fill={color} stroke={color} strokeWidth={1.4} strokeLinejoin="round" />
    </Svg>
  );
}

export function ClockIcon({ size = 14, color = '#3F7502', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18z" />
      <Path d="M12 7.5V12l3 2" />
    </Svg>
  );
}

/** Arrow pointing at a ceiling: "up to a limit". */
export function LimitIcon({ size = 14, color = '#946000', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M6 3.5h12M12 21V8M7.5 12.5L12 8l4.5 4.5" />
    </Svg>
  );
}

export function MoonIcon({ size = 18, color = '#083146', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path d="M15.5 3.2A9 9 0 1 0 21 15.6 7.2 7.2 0 0 1 15.5 3.2z" fill={color} />
    </Svg>
  );
}

export function SproutIcon({ size = 23, color = '#462417', bg = '#FDF7EC', style }: P & { bg?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <Ellipse cx={7.1} cy={14.6} rx={3.5} ry={6.5} transform="rotate(-38 7.1 14.6)" />
      <Ellipse cx={16.9} cy={14.6} rx={3.5} ry={6.5} transform="rotate(38 16.9 14.6)" />
      <Path d="M12 9.4V19.6" stroke={bg} strokeWidth={2.8} strokeLinecap="round" />
      <Ellipse cx={12} cy={6.4} rx={3.3} ry={4.3} />
      <Rect x={11.3} y={9} width={1.4} height={12.6} rx={0.7} />
      <Path d="M10.6 20.2 12 22.7l1.4-2.5z" />
    </Svg>
  );
}

export function BookIcon({ size = 25, style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path d="M11.3 6.6C9.4 5.3 6.4 4.8 2.6 5.1v13.4c3.7-.3 6.7.2 8.7 1.6z" fill="#8C6A57" stroke="#4A2A1E" strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M12.7 6.6c1.9-1.3 4.9-1.8 8.7-1.5v13.4c-3.7-.3-6.7.2-8.7 1.6z" fill="#FFF9F0" stroke="#4A2A1E" strokeWidth={1.5} strokeLinejoin="round" />
      <Path d="M15 9.3h4.2M15 12h4.2M15 14.7h4.2" stroke="#4A2A1E" strokeWidth={1.4} strokeLinecap="round" />
    </Svg>
  );
}

export function GridIcon({ size = 22.5, color = '#482215', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2} style={style}>
      <Rect x={3.5} y={3.5} width={7} height={7} rx={1.6} />
      <Rect x={13.5} y={3.5} width={7} height={7} rx={1.6} />
      <Rect x={3.5} y={13.5} width={7} height={7} rx={1.6} />
      <Rect x={13.5} y={13.5} width={7} height={7} rx={1.6} />
    </Svg>
  );
}

/** One big and two small four-point stars. */
export function SparklesIcon({ size = 23, color = '#3A0F02', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <Path d="M9 4.5C9.7 9.6 10.9 11.1 16 12 10.9 12.9 9.7 14.4 9 19.5 8.3 14.4 7.1 12.9 2 12 7.1 11.1 8.3 9.6 9 4.5z" />
      <Path d="M18.4 2c.4 2.3 1 3 3.2 3.4-2.2.4-2.8 1.1-3.2 3.4-.4-2.3-1-3-3.2-3.4 2.2-.4 2.8-1.1 3.2-3.4z" />
      <Path d="M18.4 15.4c.35 2 .9 2.6 2.8 2.9-1.9.35-2.45.9-2.8 2.9-.35-2-.9-2.55-2.8-2.9 1.9-.3 2.45-.9 2.8-2.9z" />
    </Svg>
  );
}

export function PlusIcon({ size = 31, color = '#FBF7ED', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" style={style}>
      <Path d="M12 5v14M5 12h14" />
    </Svg>
  );
}

/* ---- AI Coach screen. Width/height props match the ink box measured on the mockup. ---- */

export function ChevronLeft({ size = 16, color = '#FFFDF6', strokeWidth = 2.6, style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M15 5l-7 7 7 7" />
    </Svg>
  );
}

/** One large four-point star with two small ones (ink box ≈ 13.3pt square). */
export function SparkleIcon({ size = 13.3, color = '#BE8106', style }: P) {
  const star = (cx: number, cy: number, r: number) =>
    `M${cx} ${cy - r}C${cx + r * 0.18} ${cy - r * 0.18} ${cx + r * 0.18} ${cy - r * 0.18} ${cx + r} ${cy}` +
    `C${cx + r * 0.18} ${cy + r * 0.18} ${cx + r * 0.18} ${cy + r * 0.18} ${cx} ${cy + r}` +
    `C${cx - r * 0.18} ${cy + r * 0.18} ${cx - r * 0.18} ${cy + r * 0.18} ${cx - r} ${cy}` +
    `C${cx - r * 0.18} ${cy - r * 0.18} ${cx - r * 0.18} ${cy - r * 0.18} ${cx} ${cy - r}Z`;
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={style}>
      <Path d={star(8.2, 13.2, 8.2)} />
      <Path d={star(18.6, 4.9, 4.6)} />
      <Path d={star(18.6, 19.3, 4.4)} />
    </Svg>
  );
}

/** Filled warning triangle with a white "!" (ink box ≈ 15.6 × 14.2pt). */
export function WarningIcon({ width = 15.6, height = 14.2, color = '#BF8403', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 20" style={style}>
      <Path d="M9.3 1.2a2 2 0 0 1 3.4 0l8.9 15.6A2 2 0 0 1 19.9 20H2.1a2 2 0 0 1-1.7-3.2z" fill={color} />
      <Path d="M11 6.6v6" stroke="#FFFDF6" strokeWidth={2.4} strokeLinecap="round" />
      <Circle cx={11} cy={16} r={1.35} fill="#FFFDF6" />
    </Svg>
  );
}

/** Two chain links (ink box ≈ 16.1 × 9.6pt). */
export function LinkIcon({ width = 16.1, height = 9.6, color = '#1F7FA9', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 34 20" fill="none" stroke={color} strokeWidth={4.2} strokeLinecap="round" style={style}>
      <Path d="M14 2.5H8.5a7.5 7.5 0 0 0 0 15H14" />
      <Path d="M20 2.5h5.5a7.5 7.5 0 0 1 0 15H20" />
      <Path d="M11.5 10h11" />
    </Svg>
  );
}

/** Filled light bulb (ink box ≈ 10.1 × 15.1pt). */
export function BulbFilledIcon({ width = 10.1, height = 15.1, color = '#B47D01', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 30" style={style}>
      <Path d="M10 0a10 10 0 0 1 6.2 17.8c-1.3 1-1.9 2.2-2 3.7H5.8c-.1-1.5-.7-2.7-2-3.7A10 10 0 0 1 10 0z" fill={color} />
      <Rect x={5.6} y={23.2} width={8.8} height={2.6} rx={1.3} fill={color} />
      <Path d="M7 27.4h6l-.9 1.8a1.6 1.6 0 0 1-1.4.8H9.3a1.6 1.6 0 0 1-1.4-.8z" fill={color} />
    </Svg>
  );
}

/** Green disc with a white tick (ink box ≈ 16.5pt). */
export function CheckCircleIcon({ size = 16.5, color = '#507738', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx={12} cy={12} r={12} fill={color} />
      <Path d="M6.6 12.4l3.6 3.5 7.2-7.4" fill="none" stroke="#FFFDF6" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/* ---- Weekly goals screen ---- */

/** "Up to a cap": bar on top, arrow with a solid head (ink box ≈ 16.1 × 17.9pt). */
export function GoalCapIcon({ width = 16.1, height = 17.9, color = '#C48A0C', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 18 20" style={style}>
      <Rect x={0.6} y={0.6} width={16.8} height={2.3} rx={1.1} fill={color} />
      <Path d="M9 19V8.5" stroke={color} strokeWidth={2.3} strokeLinecap="round" />
      <Path d="M4.6 10.2L9 5l4.4 5.2z" fill={color} />
    </Svg>
  );
}

/* ---- Event reminders screen ---- */

/** Solid bell (ink box ≈ 15.1 × 18.3pt). */
export function BellFilledIcon({ width = 15.1, height = 18.3, color = '#B58002', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 24" style={style}>
      <Rect x={8.6} y={0} width={2.8} height={3.4} rx={1.4} fill={color} />
      <Path d="M10 2.4a6.6 6.6 0 0 1 6.6 6.6v6.2l2.8 3.3c.4.5 0 1.2-.6 1.2H1.2c-.6 0-1-.7-.6-1.2l2.8-3.3V9A6.6 6.6 0 0 1 10 2.4z" fill={color} />
      <Path d="M6.6 21.2h6.8a3.4 2.8 0 0 1-6.8 0z" fill={color} />
    </Svg>
  );
}

/** Thin arrow pointing right, drawn instead of the "→" glyph that Nunito lacks (ink box ≈ 10 × 8.6pt). */
export function ArrowRightIcon({ width = 10, height = 8.6, color = '#775038', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 14 12" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M1 6h12M8 1l5 5-5 5" />
    </Svg>
  );
}

/* ---- Review entry screen. Sizes are the ink boxes measured on the mockup. ---- */

/** Fork and knife (≈ 17 × 19.8pt). */
export function ForkKnifeIcon({ width = 17, height = 19.8, color = '#1E3A06', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 17 20" style={style}>
      <Path d="M1.2 0.8v5.4a3.2 3.2 0 0 0 2.2 3v9.6a1.1 1.1 0 0 0 2.2 0V9.2a3.2 3.2 0 0 0 2.2-3V0.8" fill="none" stroke={color} strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M4.5 0.8v5" stroke={color} strokeWidth={1.9} strokeLinecap="round" />
      <Path d="M14.6 0.4c-2.2.4-3.6 3-3.6 6.6v3.6h2.2v8.2a1.1 1.1 0 0 0 2.2 0V1.1c0-.4-.4-.8-.8-.7z" fill={color} />
    </Svg>
  );
}

/** Wallet with a clasp (≈ 19.3 × 17.8pt). */
export function WalletIcon({ width = 19.3, height = 17.8, color = '#4A1E02', bg = '#FDEBB4', style }: { width?: number; height?: number; color?: string; bg?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 18" style={style}>
      <Rect x={0} y={0} width={20} height={18} rx={3} fill={color} />
      <Rect x={10.4} y={5} width={9.6} height={8} rx={2.2} fill={bg} />
      <Rect x={12.6} y={7.2} width={5.2} height={3.6} rx={1.2} fill={color} />
    </Svg>
  );
}

/** Dumbbell, tilted from top-left to bottom-right (≈ 21.5 × 20.6pt). */
export function DumbbellIcon({ size = 28, color = '#0E2E3B', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <G transform="rotate(45 12 12)" fill={color}>
        <Rect x={6} y={10.9} width={12} height={2.2} rx={1} />
        <Rect x={5} y={6.2} width={3} height={11.6} rx={1.2} />
        <Rect x={16} y={6.2} width={3} height={11.6} rx={1.2} />
        <Rect x={2.2} y={8.4} width={2.4} height={7.2} rx={1} />
        <Rect x={19.4} y={8.4} width={2.4} height={7.2} rx={1} />
      </G>
    </Svg>
  );
}

/** Pencil, pointing down-left (≈ 15.2 × 15.6pt). */
export function PencilIcon({ size = 18, color = '#2A4508', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Path d="M15.9 3.9a2.2 2.2 0 0 1 3.1 0l1.1 1.1a2.2 2.2 0 0 1 0 3.1L9.2 19 4 20l1-5.2z" fill={color} />
      <Path d="M14.2 5.6l4.2 4.2" stroke="#FEF7E3" strokeWidth={1.2} />
    </Svg>
  );
}

/** Tick mark (stroke). */
export function CheckIcon({ size = 20, color = '#FFFBE8', strokeWidth = 2.8, style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M4 12.5l5.2 5.2L20 6.8" />
    </Svg>
  );
}

/* ---- Reports screen ---- */

/** Crescent moon with a small clock in front: "short nights" (≈ 24.8 × 25.3pt). */
export function MoonClockIcon({ size = 25, color = '#9D4709', bg = '#FEE7C3', style }: P & { bg?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 25 25" style={style}>
      <Path d="M11.5 1.2A10.8 10.8 0 1 0 14.6 21.6 9 9 0 0 1 11.5 1.2z" fill={color} />
      <Circle cx={17.4} cy={17.4} r={6.6} fill={bg} stroke={color} strokeWidth={1.9} />
      <Path d="M17.4 14v3.6l2.3 1.5" fill="none" stroke={color} strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" />
    </Svg>
  );
}

/** Open book, filled, with the spine as a light line (≈ 19.2 × 21.6pt). */
export function BookOpenIcon({ width = 19.2, height = 21.6, color = '#2E5B05', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 22" style={style}>
      <Path d="M9.2 3.2C7 1.6 4 1.1 0.8 1.4v16.4c3.2-.2 6.1.4 8.4 1.9z" fill={color} />
      <Path d="M10.8 3.2c2.2-1.6 5.2-2.1 8.4-1.8v16.4c-3.2-.2-6.1.4-8.4 1.9z" fill={color} />
      <Path d="M10 3.4v16.4M7.6 20.6h4.8" stroke={color} strokeWidth={1.4} strokeLinecap="round" />
      <Path d="M10 4.2v14.6" stroke="#E3EEC5" strokeWidth={0.9} />
    </Svg>
  );
}

/** Curved arrow going up and to the right: "more than last week" (≈ 10 × 9.7pt). */
export function TrendUpIcon({ size = 12, color = '#A86A01', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M1.5 10.5C3.5 9.8 6 7.6 8.6 3.6" />
      <Path d="M5.6 3.2l3.3-.5.6 3.3" />
    </Svg>
  );
}

/* ---- Menu screen. Sizes are the ink boxes measured on the mockup. ---- */

/** Person silhouette for the profile avatar (≈ 22 × 26pt). */
export function PersonIcon({ width = 22, height = 26, color = '#2E560C', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 22 26" style={style}>
      <Circle cx={11} cy={6.6} r={6.2} fill={color} />
      <Path d="M0.6 24.2C0.6 18 5.2 14.6 11 14.6s10.4 3.4 10.4 9.6c0 .7-.5 1.2-1.2 1.2H1.8c-.7 0-1.2-.5-1.2-1.2z" fill={color} />
    </Svg>
  );
}

/** Wavy flag on a pole (≈ 17 × 21pt). */
export function FlagWavyIcon({ width = 17, height = 21, color = '#C18101', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 17 21" style={style}>
      <Rect x={0} y={0.5} width={2.4} height={20.5} rx={1.2} fill={color} />
      <Path d="M2.4 1.4c2.6-1 4.6.8 7 .4 2.2-.4 4-1.3 6.6-.3v10.4c-2.6-1-4.4-.1-6.6.3-2.4.4-4.4-1.4-7-.4z" fill={color} />
    </Svg>
  );
}

/** Calendar with a bell in its corner (≈ 23.4 × 26pt). */
export function CalendarBellIcon({ width = 23.4, height = 26, color = '#004968', bg = '#C9EBF4', style }: { width?: number; height?: number; color?: string; bg?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 26" style={style}>
      <Path d="M3.5 4h14a2.5 2.5 0 0 1 2.5 2.5V11M10.5 21.5h-7A2.5 2.5 0 0 1 1 19V6.5A2.5 2.5 0 0 1 3.5 4" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
      <Path d="M1 9.6h19" stroke={color} strokeWidth={2} />
      <Path d="M6 1.6v4.4M15 1.6v4.4" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
      <Circle cx={17.6} cy={18} r={7} fill={bg} />
      <Path d="M17.6 11.6a4.3 4.3 0 0 1 4.3 4.3v3.4l1.6 2.1H11.7l1.6-2.1v-3.4a4.3 4.3 0 0 1 4.3-4.3z" fill={color} />
      <Path d="M15.8 22.6a1.8 1.8 0 0 0 3.6 0z" fill={color} />
    </Svg>
  );
}

/** Globe (≈ 22.4 × 22.9pt). */
export function GlobeIcon({ size = 23, color = '#004968', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.1} style={style}>
      <Circle cx={12} cy={12} r={10.4} />
      <Path d="M1.8 12h20.4M12 1.6c-3.4 3.6-3.4 17.2 0 20.8M12 1.6c3.4 3.6 3.4 17.2 0 20.8M3.6 6.8h16.8M3.6 17.2h16.8" />
    </Svg>
  );
}

/** Sun rising over the horizon, with rays (≈ 27 × 17pt). */
export function SunriseIcon({ width = 27, height = 17, color = '#2E580B', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 27 17" style={style}>
      <Path d="M6.6 16.4a6.9 6.9 0 0 1 13.8 0z" fill={color} />
      <Path d="M13.5 1v3.2M5.6 4.3l2 2M21.4 4.3l-2 2M0.8 15.8h3M23.2 15.8h3" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </Svg>
  );
}

/** Shield with a light leaf (≈ 19.3 × 23pt). */
export function ShieldLeafIcon({ width = 19.3, height = 23, color = '#1C3E00', leaf = '#E1EBC4', style }: { width?: number; height?: number; color?: string; leaf?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 20 24" style={style}>
      <Path d="M10 0.6l8.6 3.2v6.6c0 6.2-3.8 10.6-8.6 12.8C5.2 21 1.4 16.6 1.4 10.4V3.8z" fill={color} />
      <Path d="M13.6 7.4c-4.6 0-7.4 2.6-7.4 6.6 0 .6.1 1.2.3 1.8 3.4.4 6.6-1.6 7.1-8.4z" fill={leaf} />
      <Path d="M6 17.2c1.4-3 3.4-5 5.8-6.6" stroke={color} strokeWidth={1.1} strokeLinecap="round" fill="none" />
    </Svg>
  );
}

/** Speech bubble with a question mark (≈ 23.4 × 22.4pt). */
export function HelpBubbleIcon({ width = 23.4, height = 22.4, color = '#B17200', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 23" fill="none" stroke={color} strokeWidth={2.1} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Path d="M12 1.2c6 0 10.6 3.9 10.6 8.9S18 19 12 19c-1.3 0-2.6-.2-3.7-.5L3 21.6l1.4-4.6C2.4 15.4 1.4 12.9 1.4 10.1 1.4 5.1 6 1.2 12 1.2z" />
      <Path d="M9.4 7.6a2.7 2.7 0 0 1 5.2 1c0 1.8-2.6 2.2-2.6 3.8" />
      <Circle cx={12} cy={15.2} r={0.4} fill={color} />
    </Svg>
  );
}

/** Wide open book, filled (≈ 23.5 × 18pt). */
export function BookWideIcon({ width = 24.4, height = 18.4, color = '#2D550C', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 18" style={style}>
      <Path d="M11.1 2.6C8.4 0.9 4.6 0.4 0.4 0.8v14.8c4.1-.3 7.8.2 10.7 1.9z" fill={color} />
      <Path d="M12.9 2.6c2.7-1.7 6.5-2.2 10.7-1.8v14.8c-4.1-.3-7.8.2-10.7 1.9z" fill={color} />
    </Svg>
  );
}

/* ---- All entries screen ---- */

/** Magnifier (≈ 16 × 16pt). */
export function SearchIcon({ size = 18.4, color = '#1E3F0B', style }: P) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.6} strokeLinecap="round" style={style}>
      <Circle cx={10.2} cy={10.2} r={7.6} />
      <Path d="M15.8 15.8l5.6 5.6" />
    </Svg>
  );
}

/** Calendar with a pencil stroke (≈ 17 × 18pt). */
export function CalendarPencilIcon({ width = 17, height = 18, color = '#340C06', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 17 18" fill="none" stroke={color} strokeLinecap="round" strokeLinejoin="round" style={style}>
      <Rect x={1} y={2.8} width={15} height={14.2} rx={2.4} strokeWidth={1.8} />
      <Path d="M1 7h15" strokeWidth={1.8} />
      <Path d="M4.8 0.9v3.4M12.2 0.9v3.4" strokeWidth={2} />
      <Path d="M6.4 14.2l4.6-4.6" strokeWidth={1.9} />
    </Svg>
  );
}

/** Three sliders (≈ 17 × 16.5pt). */
export function SlidersIcon({ width = 17, height = 16.5, color = '#360A07', bg = '#FEF8EC', style }: { width?: number; height?: number; color?: string; bg?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 17 16.5" style={style}>
      <Path d="M0.9 2.6h15.2M0.9 8.25h15.2M0.9 13.9h15.2" stroke={color} strokeWidth={1.7} strokeLinecap="round" />
      <Circle cx={11.2} cy={2.6} r={1.9} fill={bg} stroke={color} strokeWidth={1.5} />
      <Circle cx={5.2} cy={8.25} r={1.9} fill={bg} stroke={color} strokeWidth={1.5} />
      <Circle cx={9.6} cy={13.9} r={1.9} fill={bg} stroke={color} strokeWidth={1.5} />
    </Svg>
  );
}

/** Horizontal dumbbell (≈ 24.7 × 15pt). */
export function DumbbellFlatIcon({ width = 24.7, height = 15.1, color = '#034860', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 25 15" fill={color} style={style}>
      <Rect x={0} y={4.6} width={3.4} height={5.8} rx={1.4} />
      <Rect x={3.8} y={0.6} width={4} height={13.8} rx={1.6} />
      <Rect x={7.4} y={6.3} width={10.2} height={2.4} rx={0.6} />
      <Rect x={17.2} y={0.6} width={4} height={13.8} rx={1.6} />
      <Rect x={21.6} y={4.6} width={3.4} height={5.8} rx={1.4} />
    </Svg>
  );
}

/** Round coin with a dollar sign (≈ 23pt). */
export function CoinIcon({ size = 22.9, color = '#A75B03', fg = '#FFF3DA', style }: P & { fg?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <Circle cx={12} cy={12} r={12} fill={color} />
      <Path d="M15.4 8.6c-.5-1.3-1.8-2-3.4-2-2 0-3.3 1-3.3 2.5 0 3.4 6.9 1.8 6.9 5.3 0 1.5-1.4 2.6-3.6 2.6-1.7 0-3.1-.8-3.6-2.2M12 4.6v2M12 17v2.2" fill="none" stroke={fg} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

/* ---- Garden screen ---- */

/** Flower with two leaves: the Garden tab when it is selected (≈ 18 × 23pt). */
export function GardenFlowerIcon({ size = 24, color = '#1F5310', bg = '#EFEDD4', style }: P & { bg?: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" style={style}>
      <G fill={color}>
        <Circle cx={12} cy={3.6} r={2.6} />
        <Circle cx={15.4} cy={6.1} r={2.6} />
        <Circle cx={14.1} cy={10} r={2.6} />
        <Circle cx={9.9} cy={10} r={2.6} />
        <Circle cx={8.6} cy={6.1} r={2.6} />
        <Path d="M11.2 12.6h1.6V23h-1.6z" />
        <Path d="M11.4 22.6C10.6 18.4 7.6 15.6 3.6 15.4c.2 4 3.4 7 7.8 7.2zM12.6 22.6c.8-4.2 3.8-7 7.8-7.2-.2 4-3.4 7-7.8 7.2z" />
      </G>
      <Circle cx={12} cy={7} r={1.7} fill={bg} />
    </Svg>
  );
}

/** Water drop (≈ 12.4 × 15.6pt). */
export function DropIcon({ width = 12.4, height = 15.6, color = '#2FB2EE', style }: { width?: number; height?: number; color?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 12.4 15.6" style={style}>
      <Path d="M6.2 0.3C4.6 3 0.3 6.9 0.3 9.7a5.9 5.9 0 0 0 11.8 0C12.1 6.9 7.8 3 6.2 0.3z" fill={color} />
      <Path d="M3.4 9.9c0 1.6 1 2.9 2.4 3.2" fill="none" stroke="#FFFFFF" strokeWidth={1.1} strokeLinecap="round" />
    </Svg>
  );
}

/** Small padlock with a light halo, shown on locked badges (≈ 10 × 12.6pt). */
export function LockIcon({ width = 10.4, height = 13, color = '#958B84', halo = '#FBF4E6', style }: { width?: number; height?: number; color?: string; halo?: string; style?: object }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 10.4 13" style={style}>
      <Path d="M2.6 6V4.2a2.6 2.6 0 0 1 5.2 0V6" fill="none" stroke={halo} strokeWidth={3.4} />
      <Rect x={0.2} y={5} width={10} height={7.8} rx={1.8} fill={halo} />
      <Path d="M2.9 6V4.2a2.3 2.3 0 0 1 4.6 0V6" fill="none" stroke={color} strokeWidth={1.5} />
      <Rect x={1.1} y={5.6} width={8.2} height={6.6} rx={1.4} fill={color} />
      <Circle cx={5.2} cy={8.4} r={0.9} fill={halo} />
      <Path d="M5.2 8.6v1.8" stroke={halo} strokeWidth={0.8} strokeLinecap="round" />
    </Svg>
  );
}
