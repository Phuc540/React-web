import { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES } from '../i18n/translations';
import { intlLocaleForLanguage } from '../i18n/localeUi';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  useEffect(() => {
    const base = (i18n.language || 'en').split('-')[0].toLowerCase();
    if (!SUPPORTED_LANGUAGES.includes(base)) void i18n.changeLanguage('en');
  }, [i18n, i18n.language]);

  const applyLanguage = useCallback(
    async (raw) => {
      if (typeof raw !== 'string' || !raw.trim()) return;
      await i18n.changeLanguage(raw.trim().split('-')[0].toLowerCase());
    },
    [i18n]
  );

  const setLanguage = useCallback(
    (raw) => {
      void applyLanguage(raw);
    },
    [applyLanguage]
  );

  const value = useMemo(
    () => ({
      setLanguage,
      applyLanguage,
      languageLoading: false
    }),
    [setLanguage, applyLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  const { t, i18n } = useTranslation();

  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }

  const language = (i18n.language || 'en').split('-')[0].toLowerCase();
  const locale = intlLocaleForLanguage(language);
  const currency = language === 'vi' ? 'VND' : 'USD';

  return {
    ...ctx,
    t,
    i18n,
    language,
    locale,
    currency
  };
}
