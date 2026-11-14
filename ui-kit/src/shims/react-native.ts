// `react-native` for the web build: react-native-web plus the few native-only names
// third-party packages import at module load (react-native-svg asks TurboModuleRegistry for its sound module).
export * from 'react-native-web';
export const TurboModuleRegistry = { get: () => null, getEnforcing: () => null };
