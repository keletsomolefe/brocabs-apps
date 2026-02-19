import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  i18n,
  PathValue,
  SupportedLocale,
  supportedLocales,
  TranslationKey,
  TranslationSchema,
} from "./index";

const LOCALE_STORAGE_KEY = "@brocabs/locale";

interface LocaleContextType {
  locale: SupportedLocale;
  setLocale: (locale: SupportedLocale) => void;
  t: <K extends TranslationKey>(key: K, options?: any) => PathValue<TranslationSchema, K>;
  supportedLocales: typeof supportedLocales;
}

const LocaleContext = createContext<LocaleContextType | null>(null);

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [locale, setLocaleState] = useState<SupportedLocale>(i18n.locale as SupportedLocale);

  // Load saved locale on mount
  useEffect(() => {
    const loadSavedLocale = async () => {
      try {
        const savedLocale = await AsyncStorage.getItem(LOCALE_STORAGE_KEY);
        if (savedLocale && supportedLocales.some((l) => l.code === savedLocale)) {
          i18n.locale = savedLocale as SupportedLocale;
          setLocaleState(savedLocale as SupportedLocale);
        }
      } catch (error) {
        console.error("Failed to load saved locale:", error);
      }
    };
    loadSavedLocale();
  }, []);

  const setLocale = useCallback(async (newLocale: SupportedLocale) => {
    try {
      i18n.locale = newLocale;
      setLocaleState(newLocale);
      await AsyncStorage.setItem(LOCALE_STORAGE_KEY, newLocale);
    } catch (error) {
      console.error("Failed to save locale:", error);
    }
  }, []);

  const t = useCallback(
    <K extends TranslationKey>(key: K, options?: any): PathValue<TranslationSchema, K> => {
      return i18n.t(key, options) as unknown as PathValue<TranslationSchema, K>;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [locale]
  );

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t, supportedLocales }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

// Convenience hook that just returns the translation function
export function useTranslation() {
  const { t } = useLocale();
  return { t };
}
