import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_OPTIONS, resolveLanguageSelectValue } from '../i18n/languageOptions';

const TOPICS = [
  { value: 'language', labelKey: 'settings.topicLanguage' },
  { value: 'account', labelKey: 'settings.topicAccount' },
  { value: 'app', labelKey: 'settings.topicApp' }
];

function SettingsPage({ user }) {
  const { t, setLanguage, i18n } = useLanguage();
  const [topic, setTopic] = useState('language');

  const selectValue = useMemo(
    () => resolveLanguageSelectValue(i18n.language),
    [i18n.language]
  );

  return (
    <div className="dashboard-wrap settings-page">
      <section className="dashboard-section">
        <h1 className="dashboard-heading">{t('settings.title')}</h1>
        <p className="dashboard-lead">{t('settings.intro')}</p>

        <div className="settings-listbox-row">
          <label className="settings-listbox-label" htmlFor="settings-topic">
            {t('settings.topicLabel')}
          </label>
          <select
            id="settings-topic"
            className="settings-listbox"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {TOPICS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {t(opt.labelKey)}
              </option>
            ))}
          </select>
        </div>

        {topic === 'language' && (
          <div className="settings-panel">
            <h2 className="dashboard-subheading">{t('settings.languageTitle')}</h2>
            <p className="settings-panel-hint">{t('settings.languageHelp')}</p>
            <label className="settings-inline-label" htmlFor="settings-lang">
              {t('settings.languageTitle')}
            </label>
            <select
              id="settings-lang"
              className="settings-listbox settings-listbox--wide settings-lang-listbox"
              size={10}
              value={selectValue}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label={t('settings.languageTitle')}
            >
              {LANGUAGE_OPTIONS.map((opt) => (
                <option key={opt.code} value={opt.code}>
                  {opt.label} ({opt.code})
                </option>
              ))}
            </select>
          </div>
        )}

        {topic === 'account' && user && (
          <div className="settings-panel">
            <h2 className="dashboard-subheading">{t('settings.accountTitle')}</h2>
            <p className="settings-panel-hint">{t('settings.accountHelp')}</p>
            <dl className="account-dl settings-account-dl">
              <div>
                <dt>{t('dashboard.email')}</dt>
                <dd>{user.email ?? '—'}</dd>
              </div>
              <div>
                <dt>{t('dashboard.verified')}</dt>
                <dd>{user.emailVerified ? t('dashboard.yes') : t('dashboard.no')}</dd>
              </div>
              <div>
                <dt>{t('dashboard.userId')}</dt>
                <dd className="account-uid">{user.uid}</dd>
              </div>
            </dl>
            <p className="account-back">
              <Link to="/account">{t('account.title')} →</Link>
            </p>
          </div>
        )}

        {topic === 'app' && (
          <div className="settings-panel">
            <h2 className="dashboard-subheading">{t('settings.appTitle')}</h2>
            <p className="settings-panel-hint">{t('settings.appHelp')}</p>
            <ul className="settings-app-meta">
              <li>
                <strong>{t('settings.version')}:</strong> 1.0.0
              </li>
              <li>
                <strong>{t('settings.build')}:</strong> CRA + Firebase Auth
              </li>
            </ul>
          </div>
        )}
      </section>
    </div>
  );
}

export default SettingsPage;
