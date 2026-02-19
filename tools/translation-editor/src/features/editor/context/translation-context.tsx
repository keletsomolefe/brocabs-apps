"use client";

import {
  createContext,
  useContext,
  useState,
  useMemo,
  type ReactNode,
} from "react";

interface TranslationContextValue {
  sections: string[];
  sectionMissingCounts: Record<string, number>;
  activeSection: string | null;
  setActiveSection: (section: string | null) => void;
  setSections: (sections: string[]) => void;
  setSectionMissingCounts: (counts: Record<string, number>) => void;
}

const TranslationContext = createContext<TranslationContextValue | null>(null);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [sections, setSections] = useState<string[]>([]);
  const [sectionMissingCounts, setSectionMissingCounts] = useState<
    Record<string, number>
  >({});
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const value = useMemo(
    () => ({
      sections,
      sectionMissingCounts,
      activeSection,
      setActiveSection,
      setSections,
      setSectionMissingCounts,
    }),
    [sections, sectionMissingCounts, activeSection]
  );

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslationContext() {
  return useContext(TranslationContext);
}
