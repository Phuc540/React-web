import en from './locales/en.json';
import vi from './locales/vi.json';
import zh from './locales/zh.json';
import es from './locales/es.json';
import pt from './locales/pt.json';
import ja from './locales/ja.json';

export const SUPPORTED_LANGUAGES = ['en', 'vi', 'zh', 'es', 'pt', 'ja'];

const bundles = {
  en,
  vi,
  zh,
  es,
  pt,
  ja,
};

export function buildI18nResources() {
  /** @type {Record<string, { translation: typeof en }>} */
  const out = {};
  for (const code of SUPPORTED_LANGUAGES) {
    out[code] = { translation: bundles[code] };
  }
  return out;
}
