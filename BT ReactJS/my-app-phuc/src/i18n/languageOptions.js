import { SUPPORTED_LANGUAGES } from './translations';

export const LANGUAGE_OPTIONS = SUPPORTED_LANGUAGES.map((code) => {
  const labels = {
    en: 'English',
    vi: 'Tiếng Việt',
    zh: '中文',
    es: 'Español',
    pt: 'Português',
    ja: '日本語'
  };
  return { code, label: labels[code] ?? code };
});

export function resolveLanguageSelectValue(i18nLanguage) {
  const raw = typeof i18nLanguage === 'string' ? i18nLanguage : 'en';
  const base = raw.split('-')[0].toLowerCase();
  return SUPPORTED_LANGUAGES.includes(base) ? base : 'en';
}
