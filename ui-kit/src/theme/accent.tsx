import { createContext, useContext } from 'react';
import { colors } from './tokens';

/** Current accent (moss by default). Plain React context — works unchanged in RN. */
const AccentContext = createContext<string>(colors.accent);

export const AccentProvider = AccentContext.Provider;

export function useAccent() {
  return useContext(AccentContext);
}
