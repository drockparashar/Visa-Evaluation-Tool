'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { Country, VisaType } from '@/lib/types/country';

interface EvaluationContextType {
  selectedCountry: Country | null;
  selectedVisaType: VisaType | null;
  setSelectedCountry: (country: Country | null) => void;
  setSelectedVisaType: (visa: VisaType | null) => void;
  resetSelection: () => void;
}

const EvaluationContext = createContext<EvaluationContextType | undefined>(
  undefined
);

export function EvaluationProvider({ children }: { children: ReactNode }) {
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [selectedVisaType, setSelectedVisaType] = useState<VisaType | null>(
    null
  );

  const resetSelection = () => {
    setSelectedCountry(null);
    setSelectedVisaType(null);
  };

  return (
    <EvaluationContext.Provider
      value={{
        selectedCountry,
        selectedVisaType,
        setSelectedCountry,
        setSelectedVisaType,
        resetSelection,
      }}
    >
      {children}
    </EvaluationContext.Provider>
  );
}

export const useEvaluation = () => {
  const context = useContext(EvaluationContext);
  if (!context) {
    throw new Error('useEvaluation must be used within EvaluationProvider');
  }
  return context;
};
