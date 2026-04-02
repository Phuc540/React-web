import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import { buildI18nResources } from './translations';

export const STORAGE_KEY = 'yourbank-lang';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: buildI18nResources(),
    fallbackLng: 'en',
    supportedLngs: ['en', 'vi', 'zh', 'es', 'pt', 'ja'],
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    react: {
      useSuspense: false,
      bindI18n: 'languageChanged loaded',
      bindI18nStore: 'added removed'
    },
    detection: {
      order: ['localStorage', 'navigator'],
      lookupLocalStorage: STORAGE_KEY,
      caches: ['localStorage']
    }
  });

i18n.on('languageChanged', (lng) => {
  try {
    document.documentElement.lang = lng;
  } catch {
    /* ignore */
  }
});

try {
  document.documentElement.lang = i18n.language;
} catch {
  /* ignore */
}

export default i18n;
