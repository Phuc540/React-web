import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { displayNamesLocales } from '../i18n/localeUi';
import {
  CALC_CURRENCIES,
  STATIC_USD_RATES,
  amountInCurrencyToUsd,
  fetchUsdRates,
  formatPrincipalForInput,
  formatPrincipalPlain,
  formatPrincipalTypingDisplay,
  getCurrencyFractionDigits,
  parsePrincipalInput,
  usdToAmountInCurrency
} from '../utils/exchangeRates';

function CompoundInterestCalculator() {
  const { t, locale, currency: defaultCurrency, language } = useLanguage();
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [rates, setRates] = useState(STATIC_USD_RATES);
  const [ratesMeta, setRatesMeta] = useState({ date: null, fromApi: false });
  const [ratesLoading, setRatesLoading] = useState(true);

  /** Canonical principal: USD equivalent so switching currency preserves real-world value. */
  const [principalUsd, setPrincipalUsd] = useState(0);
  const [principalDraft, setPrincipalDraft] = useState(null);
  const [principalFocused, setPrincipalFocused] = useState(false);

  const [annualRate, setAnnualRate] = useState('');
  const [months, setMonths] = useState('');
  const [compoundPerYear, setCompoundPerYear] = useState('');

  useEffect(() => {
    setSelectedCurrency(defaultCurrency);
  }, [defaultCurrency]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setRatesLoading(true);
      const { rates: next, date, fromApi } = await fetchUsdRates();
      if (!cancelled) {
        setRates(next);
        setRatesMeta({ date, fromApi });
        setRatesLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const amountInSelectedCurrency = useMemo(
    () => usdToAmountInCurrency(principalUsd, rates, selectedCurrency),
    [principalUsd, rates, selectedCurrency]
  );

  const principalForFormula = amountInSelectedCurrency;

  const result = useMemo(() => {
    const r = Number(annualRate) / 100;
    const tMonths = Number(months);
    const n = Number(compoundPerYear);

    if (principalForFormula <= 0 || r < 0 || tMonths <= 0 || n <= 0) {
      return { amount: 0, interest: 0 };
    }

    const periods = (n * tMonths) / 12;
    const amount = principalForFormula * (1 + r / n) ** periods;
    return {
      amount,
      interest: amount - principalForFormula
    };
  }, [principalForFormula, annualRate, months, compoundPerYear]);

  const formatMoney = (n) => {
    const fd = getCurrencyFractionDigits(selectedCurrency);
    const v = fd === 0 ? Math.round(n) : Math.round(n * 10 ** fd) / 10 ** fd;
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: selectedCurrency,
      maximumFractionDigits: fd
    }).format(v);
  };

  const currencyOptions = useMemo(() => {
    const set = new Set(Object.keys(rates));
    return CALC_CURRENCIES.filter((c) => set.has(c));
  }, [rates]);

  const currencyDisplayNames = useMemo(() => {
    try {
      if (typeof Intl.DisplayNames !== 'function') return null;
      return new Intl.DisplayNames(displayNamesLocales(language), { type: 'currency' });
    } catch {
      return null;
    }
  }, [language]);

  const principalInputValue = useMemo(() => {
    if (principalFocused && principalDraft !== null) {
      return formatPrincipalTypingDisplay(principalDraft, selectedCurrency, locale);
    }
    if (!Number.isFinite(amountInSelectedCurrency) || amountInSelectedCurrency === 0) {
      return '';
    }
    return formatPrincipalForInput(amountInSelectedCurrency, selectedCurrency, locale);
  }, [
    principalFocused,
    principalDraft,
    amountInSelectedCurrency,
    selectedCurrency,
    locale
  ]);

  const handlePrincipalChange = (raw) => {
    const fd = getCurrencyFractionDigits(selectedCurrency);
    if (fd === 0) {
      const digitsOnly = raw.replace(/\D/g, '');
      if (!digitsOnly) {
        setPrincipalDraft('');
        setPrincipalUsd(0);
        return;
      }
      const n = parseInt(digitsOnly, 10);
      if (!Number.isFinite(n) || n < 0) {
        setPrincipalDraft('');
        setPrincipalUsd(0);
        return;
      }
      setPrincipalDraft(String(n));
      setPrincipalUsd(amountInCurrencyToUsd(n, rates, selectedCurrency));
      return;
    }
    setPrincipalDraft(raw);
    const parsed = parsePrincipalInput(raw, selectedCurrency);
    setPrincipalUsd(amountInCurrencyToUsd(parsed, rates, selectedCurrency));
  };

  const handlePrincipalFocus = () => {
    setPrincipalFocused(true);
    setPrincipalDraft(formatPrincipalPlain(amountInSelectedCurrency, selectedCurrency));
  };

  const handlePrincipalBlur = () => {
    setPrincipalFocused(false);
    setPrincipalDraft(null);
  };

  return (
    <section className="section calc-on-home">
      <div className="sectionTitle">
        <h2>{t('calc.title')}</h2>
        <p>{t('calc.subtitle')}</p>
        <p className="calc-currency-hint">{t('calc.currencyHint')}</p>
        <p className="calc-rates-line">
          {ratesLoading
            ? t('calc.ratesLoading')
            : ratesMeta.fromApi
              ? t('calc.ratesLive', { date: ratesMeta.date || '—' })
              : t('calc.ratesFallback')}
        </p>
      </div>

      <div className="calc-currency-row" aria-label={t('calc.currencyLabel')}>
        <label className="visually-hidden" htmlFor="currency-select">
          {t('calc.currencyLabel')}
        </label>
        <select
          id="currency-select"
          className="calc-currency-select"
          value={selectedCurrency}
          onChange={(e) => {
            const next = e.target.value;
            setSelectedCurrency(next);
            setPrincipalDraft(null);
            setPrincipalFocused(false);
          }}
        >
          {currencyOptions.map((code) => (
            <option key={code} value={code}>
              {currencyDisplayNames ? currencyDisplayNames.of(code) : code} ({code})
            </option>
          ))}
        </select>
      </div>

      <div className="calc-layout">
        <div className="calc-form">
          <label className="calc-label">
            {t('calc.principal')}
            <input
              type="text"
              inputMode={
                getCurrencyFractionDigits(selectedCurrency) > 0 ? 'decimal' : 'numeric'
              }
              value={principalInputValue}
              onChange={(e) => handlePrincipalChange(e.target.value)}
              onFocus={handlePrincipalFocus}
              onBlur={handlePrincipalBlur}
              className="calc-input"
              aria-busy={ratesLoading}
            />
          </label>
          <label className="calc-label">
            {t('calc.rate')}
            <input
              type="number"
              step="0.1"
              min="0"
              value={annualRate}
              onChange={(e) => setAnnualRate(e.target.value)}
              className="calc-input"
            />
          </label>
          <label className="calc-label">
            {t('calc.months')}
            <input
              type="number"
              min="1"
              value={months}
              onChange={(e) => setMonths(e.target.value)}
              className="calc-input"
            />
          </label>
          <label className="calc-label">
            {t('calc.periods')}
            <input
              type="number"
              min="1"
              value={compoundPerYear}
              onChange={(e) => setCompoundPerYear(e.target.value)}
              className="calc-input"
            />
          </label>
        </div>

        <div className="calc-result">
          <p className="calc-result-label">{t('calc.balance')}</p>
          <p className="calc-result-value">{formatMoney(result.amount)}</p>
          <p className="calc-result-label">{t('calc.interest')}</p>
          <p className="calc-result-value">{formatMoney(result.interest)}</p>
        </div>
      </div>
    </section>
  );
}

export default CompoundInterestCalculator;
