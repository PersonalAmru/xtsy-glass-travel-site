/**
 * ConversionSignalsProvider - Wraps useConversionSignals to auto-fire
 * engagement/intent GTM events based on session behavior.
 */

import { createContext, useContext, type ReactNode } from 'react';
import { useConversionSignals } from '@/hooks/useConversionSignals';

type ConversionSignalsContextType = ReturnType<typeof useConversionSignals>;

const ConversionSignalsContext = createContext<ConversionSignalsContextType | null>(null);

export const ConversionSignalsProvider = ({ children }: { children: ReactNode }) => {
  const signals = useConversionSignals();
  return (
    <ConversionSignalsContext.Provider value={signals}>
      {children}
    </ConversionSignalsContext.Provider>
  );
};

export const useConversionSignalsContext = () => {
  const ctx = useContext(ConversionSignalsContext);
  if (!ctx) throw new Error('useConversionSignalsContext must be used within ConversionSignalsProvider');
  return ctx;
};
