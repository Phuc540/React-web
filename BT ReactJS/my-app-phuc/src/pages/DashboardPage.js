import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function DashboardPage({ user }) {
  const { t, locale } = useLanguage();

  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(locale, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '—';

  return (
    <div className="dashboard-wrap">
      <section className="dashboard-section">
        <h1 className="dashboard-heading">{t('dashboard.title')}</h1>
        <p className="dashboard-lead">{t('dashboard.subtitle')}</p>

        <div className="account-grid">
          <article className="account-card">
            <h2>{t('dashboard.profile')}</h2>
            <dl className="account-dl">
              <div>
                <dt>{t('dashboard.email')}</dt>
                <dd>{user?.email ?? '—'}</dd>
              </div>
              <div>
                <dt>{t('dashboard.verified')}</dt>
                <dd>{user?.emailVerified ? t('dashboard.yes') : t('dashboard.no')}</dd>
              </div>
              <div>
                <dt>{t('dashboard.memberSince')}</dt>
                <dd>{createdAt}</dd>
              </div>
              <div>
                <dt>{t('dashboard.userId')}</dt>
                <dd className="account-uid">{user?.uid ?? '—'}</dd>
              </div>
            </dl>
          </article>

          <article className="account-card account-card--notice">
            <h2>{t('dashboard.notices')}</h2>
            <ul className="account-notice-list">
              <li>{t('dashboard.n1')}</li>
              <li>{t('dashboard.n2')}</li>
              <li>
                {t('dashboard.n3')}{' '}
                <a href="mailto:support@yourbank.demo">support@yourbank.demo</a>
              </li>
            </ul>
          </article>
        </div>
      </section>

      <section className="dashboard-section banking-essentials">
        <h2 className="dashboard-subheading">{t('dashboard.essentials')}</h2>
        <div className="essentials-grid">
          <article className="essential-card">
            <h3>{t('dashboard.e1t')}</h3>
            <p>{t('dashboard.e1d')}</p>
          </article>
          <article className="essential-card">
            <h3>{t('dashboard.e2t')}</h3>
            <p>{t('dashboard.e2d')}</p>
          </article>
          <article className="essential-card">
            <h3>{t('dashboard.e3t')}</h3>
            <p>
              <Link to="/privacy">{t('dashboard.privacyLink')}</Link>
              {' · '}
              <Link to="/terms">{t('dashboard.termsLink')}</Link>
            </p>
          </article>
        </div>
      </section>
    </div>
  );
}

export default DashboardPage;
