/**
 * Exchange rates: units of each currency per 1 USD (e.g. VND ≈ 25_000 means 1 USD = 25_000 VND).
 * Used to convert a single USD-equivalent principal across currencies for display and input.
 */

export const CALC_CURRENCIES = [
  'USD',
  'EUR',
  'GBP',
  'JPY',
  'CNY',
  'CHF',
  'AUD',
  'CAD',
  'SGD',
  'HKD',
  'NZD',
  'SEK',
  'NOK',
  'DKK',
  'PLN',
  'CZK',
  'HUF',
  'TRY',
  'INR',
  'KRW',
  'THB',
  'MYR',
  'IDR',
  'PHP',
  'VND',
  'BRL',
  'MXN',
  'ZAR',
  'AED',
  'SAR',
  'ILS',
  'CLP',
  'COP',
  'ARS',
  'EGP',
  'NGN',
  'PKR',
  'BDT',
  'TWD'
];

/** Approximate fallback when the network API is unavailable (USD = 1). */
export const STATIC_USD_RATES = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 155,
  CNY: 7.25,
  CHF: 0.88,
  AUD: 1.55,
  CAD: 1.42,
  SGD: 1.35,
  HKD: 7.8,
  NZD: 1.68,
  SEK: 10.5,
  NOK: 10.8,
  DKK: 6.9,
  PLN: 4.0,
  CZK: 23.5,
  HUF: 365,
  TRY: 34,
  INR: 84,
  KRW: 1380,
  THB: 33.5,
  MYR: 4.45,
  IDR: 15800,
  PHP: 58,
  VND: 25500,
  BRL: 5.6,
  MXN: 20.5,
  ZAR: 18.2,
  AED: 3.67,
  SAR: 3.75,
  ILS: 3.65,
  CLP: 950,
  COP: 4100,
  ARS: 950,
  EGP: 49,
  NGN: 1550,
  PKR: 278,
  BDT: 122,
  TWD: 32.5
};

/**
 * @returns {{ rates: Record<string, number>, date: string | null, fromApi: boolean }}
 */
export async function fetchUsdRates() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!res.ok) throw new Error('rates http');
    const data = await res.json();
    const raw = data.rates || data.conversion_rates;
    if (data.result !== 'success' || !raw || typeof raw !== 'object') {
      throw new Error('rates shape');
    }
    const merged = { USD: 1, ...raw };
    for (const code of CALC_CURRENCIES) {
      if (merged[code] == null && STATIC_USD_RATES[code] != null) {
        merged[code] = STATIC_USD_RATES[code];
      }
    }
    return {
      rates: merged,
      date: data.time_last_update_utc || null,
      fromApi: true
    };
  } catch {
    try {
      const res = await fetch('https://api.frankfurter.app/latest?from=USD');
      if (!res.ok) throw new Error('frankfurter http');
      const data = await res.json();
      if (!data.rates) throw new Error('frankfurter shape');
      const merged = { USD: 1, ...data.rates };
      for (const code of CALC_CURRENCIES) {
        if (merged[code] == null && STATIC_USD_RATES[code] != null) {
          merged[code] = STATIC_USD_RATES[code];
        }
      }
      return {
        rates: merged,
        date: data.date || null,
        fromApi: true
      };
    } catch {
      return {
        rates: { ...STATIC_USD_RATES, USD: 1 },
        date: null,
        fromApi: false
      };
    }
  }
}

export function getCurrencyFractionDigits(currency) {
  try {
    const nf = new Intl.NumberFormat('en', { style: 'currency', currency });
    const fd = nf.resolvedOptions().maximumFractionDigits;
    return typeof fd === 'number' ? fd : 2;
  } catch {
    return 2;
  }
}

/** Units of `currency` per 1 USD. */
export function unitsPerUsd(rates, currency) {
  const u = rates?.[currency];
  if (u != null && u > 0) return u;
  const fb = STATIC_USD_RATES[currency];
  if (fb != null && fb > 0) return fb;
  return currency === 'USD' ? 1 : 1;
}

/** Convert amount in `currency` to USD equivalent. */
export function amountInCurrencyToUsd(amount, rates, currency) {
  if (!Number.isFinite(amount) || amount < 0) return 0;
  const u = unitsPerUsd(rates, currency);
  return amount / u;
}

/** Convert USD equivalent to amount in `currency`. */
export function usdToAmountInCurrency(usd, rates, currency) {
  if (!Number.isFinite(usd) || usd < 0) return 0;
  return usd * unitsPerUsd(rates, currency);
}

export function formatPrincipalForInput(amount, currency, locale) {
  const fd = getCurrencyFractionDigits(currency);
  const n =
    fd === 0 ? Math.round(amount) : Math.round(amount * 10 ** fd) / 10 ** fd;
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: fd,
    minimumFractionDigits: 0,
    useGrouping: true
  }).format(n);
}

/**
 * Chuỗi số thuần khi focus (để lưu state): không dấu phân nhóm.
 * Với tiền có phần thập phân, giữ dạng gõ tay đơn giản.
 */
export function formatPrincipalPlain(amount, currency) {
  const fd = getCurrencyFractionDigits(currency);
  if (!Number.isFinite(amount) || amount === 0) return '';
  const n =
    fd === 0 ? Math.round(amount) : Math.round(amount * 10 ** fd) / 10 ** fd;
  if (fd === 0) return String(n);
  return String(parseFloat(n.toFixed(fd)));
}

/**
 * Hiển thị ô nhập khi đang gõ: tiền không phần lẻ (VND, JPY…) có dấu phân nhóm theo locale (vd. vi-VN: 111.111).
 * @param {string} digitOnlyOrRaw — với fd===0 chỉ cần chuỗi chữ số nội bộ (vd. "111111")
 */
export function formatPrincipalTypingDisplay(draft, currency, locale) {
  const fd = getCurrencyFractionDigits(currency);
  if (fd === 0) {
    const digits = String(draft ?? '').replace(/\D/g, '');
    if (!digits) return '';
    const n = parseInt(digits, 10);
    if (!Number.isFinite(n)) return '';
    return new Intl.NumberFormat(locale, {
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
      useGrouping: true
    }).format(n);
  }
  return String(draft ?? '');
}

/** Parse typed principal in the selected currency (handles grouping and common decimal styles). */
export function parsePrincipalInput(raw, currency) {
  const fd = getCurrencyFractionDigits(currency);
  const s = String(raw).trim();
  if (!s) return 0;
  if (fd === 0) {
    const digits = s.replace(/\D/g, '');
    return digits ? parseFloat(digits) : 0;
  }
  let t = s.replace(/\s/g, '');
  const lastComma = t.lastIndexOf(',');
  const lastDot = t.lastIndexOf('.');
  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      t = t.replace(/\./g, '').replace(',', '.');
    } else {
      t = t.replace(/,/g, '');
    }
  } else {
    t = t.replace(/,/g, '');
  }
  const n = parseFloat(t);
  return Number.isFinite(n) ? n : 0;
}
