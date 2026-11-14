/**
 * Named line icons on a 24 grid. Filled parts use currentColor, which
 * react-native-svg resolves from the Svg's `color` prop, exactly as on web.
 */
import type { ReactNode } from 'react';
import { Circle, Path, Rect, Svg } from '../primitives';

const F = 'currentColor';

const ICONS = {
  plus: <Path d="M12 5v14M5 12h14" />,
  minus: <Path d="M5 12h14" />,
  close: <Path d="M6 6l12 12M18 6L6 18" />,
  check: <Path d="M5 12.5l4.5 4.5L19 7.5" />,
  chevronRight: <Path d="M9 6l6 6-6 6" />,
  chevronLeft: <Path d="M15 6l-6 6 6 6" />,
  chevronDown: <Path d="M6 9l6 6 6-6" />,
  chevronUp: <Path d="M6 15l6-6 6 6" />,
  arrowLeft: <Path d="M19 12H5M11 6l-6 6 6 6" />,
  mic: (
    <>
      <Rect x={9} y={2.5} width={6} height={12} rx={3} />
      <Path d="M5 11.5a7 7 0 0 0 14 0M12 18.5v3" />
    </>
  ),
  micOff: (
    <>
      <Path d="M15 9.5V5.5a3 3 0 0 0-5.6-1.5M9 9v2.5a3 3 0 0 0 4.6 2.5" />
      <Path d="M5 11.5a7 7 0 0 0 11.3 5.5M19 11.5a7 7 0 0 1-.6 2.8M12 18.5v3M3.5 3.5l17 17" />
    </>
  ),
  stop: <Rect x={6.5} y={6.5} width={11} height={11} rx={2.5} fill={F} stroke="none" />,
  trash: <Path d="M4 7h16M10 11v6M14 11v6M6 7l1 12.2A2 2 0 0 0 9 21h6a2 2 0 0 0 2-1.8L18 7M9 7V4.5h6V7" />,
  edit: <Path d="M4 20h4L19 9a2.8 2.8 0 0 0-4-4L4 16zM13.5 6.5l4 4" />,
  more: (
    <>
      <Circle cx={5} cy={12} r={1.7} fill={F} stroke="none" />
      <Circle cx={12} cy={12} r={1.7} fill={F} stroke="none" />
      <Circle cx={19} cy={12} r={1.7} fill={F} stroke="none" />
    </>
  ),
  filter: <Path d="M4 6.5h16M7 12h10M10 17.5h4" />,
  search: (
    <>
      <Circle cx={11} cy={11} r={6.5} />
      <Path d="M20 20l-4.2-4.2" />
    </>
  ),
  calendar: (
    <>
      <Rect x={3.5} y={5} width={17} height={15.5} rx={3} />
      <Path d="M3.5 10h17M8 2.6v3.6M16 2.6v3.6" />
    </>
  ),
  calendarMove: (
    <>
      <Path d="M20.5 11V8a3 3 0 0 0-3-3h-11a3 3 0 0 0-3 3v9.5a3 3 0 0 0 3 3H11M3.5 10h17M8 2.6v3.6M16 2.6v3.6" />
      <Path d="M14.5 17h6M18 14.5l2.5 2.5-2.5 2.5" />
    </>
  ),
  clock: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="M12 7.5V12l3 2" />
    </>
  ),
  bell: <Path d="M6 16v-5a6 6 0 0 1 12 0v5l1.5 2h-15zM10 20.5a2 2 0 0 0 4 0" />,
  repeat: <Path d="M17 3l3 3-3 3M4 11V9a3 3 0 0 1 3-3h13M7 21l-3-3 3-3M20 13v2a3 3 0 0 1-3 3H4" />,
  meal: <Path d="M3.5 11h17a8.5 8.5 0 0 1-17 0zM9 20.5h6M9.3 3.5c-.9 1.1.9 2.3 0 3.5M14.3 3.5c-.9 1.1.9 2.3 0 3.5" />,
  expense: (
    <>
      <Path d="M5 7.5V6.8A2.3 2.3 0 0 1 7.3 4.5H16v3" />
      <Rect x={3.5} y={7.5} width={17} height={12} rx={2.5} />
      <Path d="M15.5 13.5h2" />
    </>
  ),
  income: <Path d="M12 3v10M8 9l4 4 4-4M4 14.5v3A2.5 2.5 0 0 0 6.5 20h11a2.5 2.5 0 0 0 2.5-2.5v-3" />,
  activity: <Path d="M6.5 6.5v11M17.5 6.5v11M3.5 9.5v5M20.5 9.5v5M6.5 12h11" />,
  sleep: <Path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.5 6.5 0 0 0 10.1 10.1z" />,
  note: (
    <>
      <Rect x={4.5} y={3.5} width={15} height={17} rx={2.5} />
      <Path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4" />
    </>
  ),
  target: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Circle cx={12} cy={12} r={4.8} />
      <Circle cx={12} cy={12} r={1.4} fill={F} stroke="none" />
    </>
  ),
  award: (
    <>
      <Circle cx={12} cy={9} r={5.5} />
      <Path d="M8.6 13.4L7 21l5-2.6 5 2.6-1.6-7.6" />
    </>
  ),
  lock: (
    <>
      <Rect x={5} y={10.5} width={14} height={10} rx={2.5} />
      <Path d="M8 10.5V8a4 4 0 0 1 8 0v2.5M12 14.5v2" />
    </>
  ),
  globe: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="M3.5 12h17M12 3.5c2.6 2.6 2.6 14.4 0 17M12 3.5c-2.6 2.6-2.6 14.4 0 17" />
    </>
  ),
  theme: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="M12 3.5a8.5 8.5 0 0 0 0 17z" fill={F} />
    </>
  ),
  tag: (
    <>
      <Path d="M3.5 12.5v-8a1 1 0 0 1 1-1h8l8 8-9 9z" />
      <Circle cx={8} cy={8} r={1.3} fill={F} stroke="none" />
    </>
  ),
  undo: <Path d="M9 14L4 9l5-5M4 9h10.5a5.5 5.5 0 0 1 0 11H11" />,
  alert: (
    <>
      <Path d="M10.3 4.6a2 2 0 0 1 3.4 0l7.5 13a2 2 0 0 1-1.7 3H4.5a2 2 0 0 1-1.7-3z" />
      <Path d="M12 9.5v4.5" />
      <Circle cx={12} cy={17} r={1.1} fill={F} stroke="none" />
    </>
  ),
  info: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="M12 11v5.5" />
      <Circle cx={12} cy={7.9} r={1.1} fill={F} stroke="none" />
    </>
  ),
  wifiOff: (
    <>
      <Path d="M3.5 3.5l17 17M8.6 16.4a4.8 4.8 0 0 1 6.2-.4M5.2 12.6a9.7 9.7 0 0 1 4.4-2.4M14.8 10.3a9.7 9.7 0 0 1 4 2.3M2 9a14.5 14.5 0 0 1 4.3-2.8M10.8 5.1A14.5 14.5 0 0 1 22 9" />
      <Circle cx={12} cy={19.6} r={1.2} fill={F} stroke="none" />
    </>
  ),
  refresh: <Path d="M20 11a8 8 0 0 0-14.6-4.5L4 8M4 3.5V8h4.5M4 13a8 8 0 0 0 14.6 4.5L20 16M20 20.5V16h-4.5" />,
  copy: (
    <>
      <Rect x={8.5} y={8.5} width={12} height={12} rx={2.5} />
      <Path d="M15.5 8.5V6A2.5 2.5 0 0 0 13 3.5H6A2.5 2.5 0 0 0 3.5 6v7A2.5 2.5 0 0 0 6 15.5h2.5" />
    </>
  ),
  pause: <Path d="M9 5.5v13M15 5.5v13" />,
  sun: (
    <>
      <Circle cx={12} cy={12} r={4} />
      <Path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" />
    </>
  ),
  moon: <Path d="M19.5 14.6A8 8 0 1 1 9.4 4.5a6.5 6.5 0 0 0 10.1 10.1z" />,
  phone: (
    <>
      <Rect x={7} y={2.5} width={10} height={19} rx={2.5} />
      <Path d="M11 18.5h2" />
    </>
  ),
  share: <Path d="M12 15V3.5M8 7.5l4-4 4 4M5 12v6.5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V12" />,
  checkCircle: (
    <>
      <Circle cx={12} cy={12} r={8.5} />
      <Path d="M8 12.3l2.8 2.8 5.4-5.5" />
    </>
  ),
  flame: <Path d="M12 21a6.5 6.5 0 0 0 6.5-6.5c0-4-3.5-6-4-10.5-2.5 2-4.5 4.5-4 7.5-1.2-.5-2-1.6-2.3-3-1.9 1.9-2.7 3.9-2.7 6A6.5 6.5 0 0 0 12 21z" />,
  heart: <Path d="M12 20s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />,
  trendUp: <Path d="M4 16.5l5.5-5.5 3.5 3.5L20 7.5M14.5 7.5H20V13" />,
  trendDown: <Path d="M4 7.5l5.5 5.5 3.5-3.5 7 7M14.5 16.5H20V11" />,
  grid: (
    <>
      <Rect x={3.5} y={3.5} width={7} height={7} rx={1.6} />
      <Rect x={13.5} y={3.5} width={7} height={7} rx={1.6} />
      <Rect x={3.5} y={13.5} width={7} height={7} rx={1.6} />
      <Rect x={13.5} y={13.5} width={7} height={7} rx={1.6} />
    </>
  ),
  external: <Path d="M14 4h6v6M20 4l-8.5 8.5M18 14v4.5a2 2 0 0 1-2 2H5.5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2H10" />,
  leaf: <Path d="M5 19c0-8 5-13 14-14-1 9-6 14-14 14zM5 19l7-7" />,
  sparkles: (
    <>
      <Path d="M9.5 3.5c.8 5 2 7.3 6.5 8.3-4.5 1-5.7 3.3-6.5 8.2-.8-4.9-2-7.2-6.5-8.2 4.5-1 5.7-3.3 6.5-8.3z" fill={F} stroke="none" />
      <Path d="M18.5 2.5c.3 1.7.8 2.3 2.6 2.6-1.8.4-2.3.9-2.6 2.7-.3-1.8-.8-2.3-2.6-2.7 1.8-.3 2.3-.9 2.6-2.6z" fill={F} stroke="none" />
    </>
  ),
  keyboard: (
    <>
      <Rect x={2.5} y={6} width={19} height={12} rx={2.5} />
      <Path d="M6.5 10h1M10.5 10h1M14.5 10h1M8 14h8" />
    </>
  ),
  pen: <Path d="M4 20h16M6 16l9.5-9.5a2.1 2.1 0 0 1 3 3L9 19H6z" />,
  bellOff: <Path d="M6 16v-5a6 6 0 0 1 9.4-4.9M18 11v5l1.5 2H8M10 20.5a2 2 0 0 0 4 0M3.5 3.5l17 17" />,
  link: <Path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" />,
  play: <Path d="M8 5.5v13l10.5-6.5z" fill={F} />,
  chart: <Path d="M4 20h16M7 16.5V11M12 16.5V6.5M17 16.5v-4" />,
  user: (
    <>
      <Circle cx={12} cy={8.5} r={3.8} />
      <Path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
    </>
  ),
  drop: <Path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z" />,
  bulb: <Path d="M9.5 18h5M10.5 21h3M12 3a6 6 0 0 0-3.6 10.8c.7.5 1.1 1.3 1.1 2.2h5c0-.9.4-1.7 1.1-2.2A6 6 0 0 0 12 3z" />,
  scale: <Path d="M12 4v16M7 20h10M5 8h14M5 8l-2.5 6a2.5 2.5 0 0 0 5 0zM19 8l-2.5 6a2.5 2.5 0 0 0 5 0z" />,
} satisfies Record<string, ReactNode>;

export type IconName = keyof typeof ICONS;

type IconProps = { name: IconName; size?: number; color?: string; strokeWidth?: number };

export function Icon({ name, size = 22, color = '#3A1B11', strokeWidth = 2 }: IconProps) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      color={color}
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[name]}
    </Svg>
  );
}
