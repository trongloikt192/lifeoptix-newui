/**
 * Renders one screen of the reference package (reference/src/screens) through react-native-web.
 * Loaded inside a 390 × 844 iframe by the gallery, so useWindowDimensions() sees the phone width.
 * ?screen=goals&top=47&bottom=34
 */
import { createRoot } from 'react-dom/client';
import { View } from 'react-native';
import { SafeAreaFrameContext, SafeAreaInsetsContext } from 'react-native-safe-area-context';
import './reference-fonts.css';
import CoachScreen from '../reference/src/screens/CoachScreen.example';
import EntriesScreen from '../reference/src/screens/EntriesScreen.example';
import EventsScreen from '../reference/src/screens/EventsScreen.example';
import GardenScreen from '../reference/src/screens/GardenScreen.example';
import GoalsScreen from '../reference/src/screens/GoalsScreen.example';
import LogDayScreen from '../reference/src/screens/LogDayScreen.example';
import MenuScreen from '../reference/src/screens/MenuScreen.example';
import ReportsScreen from '../reference/src/screens/ReportsScreen.example';
import ReviewScreen from '../reference/src/screens/ReviewScreen.example';
import TodayScreen from '../reference/src/screens/TodayScreen.example';

const SCREENS = {
  today: TodayScreen,
  logday: LogDayScreen,
  review: ReviewScreen,
  entries: EntriesScreen,
  goals: GoalsScreen,
  events: EventsScreen,
  garden: GardenScreen,
  reports: ReportsScreen,
  coach: CoachScreen,
  menu: MenuScreen,
} as const;

const q = new URLSearchParams(location.search);
const Screen = SCREENS[(q.get('screen') ?? 'today') as keyof typeof SCREENS] ?? TodayScreen;
const insets = { top: Number(q.get('top') ?? 47), bottom: Number(q.get('bottom') ?? 34), left: 0, right: 0 };
const frame = { x: 0, y: 0, width: window.innerWidth, height: window.innerHeight };

createRoot(document.getElementById('root')!).render(
  <SafeAreaFrameContext.Provider value={frame}>
    <SafeAreaInsetsContext.Provider value={insets}>
      <View style={{ flex: 1 }}>
        <Screen />
      </View>
    </SafeAreaInsetsContext.Provider>
  </SafeAreaFrameContext.Provider>,
);
