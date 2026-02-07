import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { ParlayLeg } from './types';

interface ParlayContextValue {
  legs: ParlayLeg[];
  addLeg: (leg: ParlayLeg) => void;
  removeLeg: (propId: string) => void;
  clearAll: () => void;
  isAtMaxLegs: boolean;
}

const ParlayContext = createContext<ParlayContextValue | undefined>(undefined);

const MAX_PARLAY_LEGS = 6;

export function ParlayProvider({ children }: { children: ReactNode }) {
  const [legs, setLegs] = useState<ParlayLeg[]>([]);

  const isAtMaxLegs = legs.length >= MAX_PARLAY_LEGS;

  const addLeg = useCallback((leg: ParlayLeg) => {
    setLegs((prev) => {
      // Prevent duplicates
      if (prev.some((l) => l.propId === leg.propId)) {
        return prev;
      }
      // Prevent adding more than max legs
      if (prev.length >= MAX_PARLAY_LEGS) {
        return prev;
      }
      return [...prev, leg];
    });
  }, []);

  const removeLeg = useCallback((propId: string) => {
    setLegs((prev) => prev.filter((leg) => leg.propId !== propId));
  }, []);

  const clearAll = useCallback(() => {
    setLegs([]);
  }, []);

  return (
    <ParlayContext.Provider value={{ legs, addLeg, removeLeg, clearAll, isAtMaxLegs }}>
      {children}
    </ParlayContext.Provider>
  );
}

export function useParlay() {
  const context = useContext(ParlayContext);
  if (!context) {
    throw new Error('useParlay must be used within ParlayProvider');
  }
  return context;
}
