/** Helpers locale / Intl (không React). */

export function baseLanguageCode(lng) {
  if (!lng || typeof lng !== 'string') return 'en';
  const i = lng.indexOf('-');
  return (i >= 0 ? lng.slice(0, i) : lng).toLowerCase();
}

export function displayNamesLocales(language) {
  const b = baseLanguageCode(language);
  try {
    const mapped =
      b === 'zh' ? 'zh-CN' : b === 'es' ? 'es-ES' : b === 'pt' ? 'pt-BR' : b === 'ja' ? 'ja-JP' : b;
    const [canon] = Intl.getCanonicalLocales(mapped);
    return [canon || mapped];
  } catch {
    return [b];
  }
}

export function intlLocaleForLanguage(language) {
  const b = baseLanguageCode(language);
  if (b === 'vi') return 'vi-VN';
  if (b === 'zh') return 'zh-CN';
  if (b === 'es') return 'es-ES';
  if (b === 'pt') return 'pt-BR';
  if (b === 'en') return 'en-US';
  if (b === 'ja') return 'ja-JP';
  try {
    const [c] = Intl.getCanonicalLocales(b);
    return c || 'en-US';
  } catch {
    return 'en-US';
  }
}
