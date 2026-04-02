import { Link } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function AccountPage({ user }) {
  const { t, locale } = useLanguage();

  const createdAt = user?.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleString(locale)
    : '—';

  const lastSignIn = user?.metadata?.lastSignInTime
    ? new Date(user.metadata.lastSignInTime).toLocaleString(locale)
    : '—';

  const providerLabel =
    user?.providerData?.[0]?.providerId === 'google.com' ? t('account.google') : t('account.emailPass');

  return (
    <div className="dashboard-wrap">
      <section className="dashboard-section">
        <h1 className="dashboard-heading">{t('account.title')}</h1>
        <p className="dashboard-lead">{t('account.subtitle')}</p>

        <div className="account-grid account-grid--single">
          <article className="account-card">
            <h2>{t('account.section')}</h2>
            <dl className="account-dl">
              <div>
                <dt>{t('account.primaryEmail')}</dt>
                <dd>{user?.email ?? '—'}</dd>
              </div>
              <div>
                <dt>{t('account.provider')}</dt>
                <dd>{providerLabel}</dd>
              </div>
              <div>
                <dt>{t('account.lastSignIn')}</dt>
                <dd>{lastSignIn}</dd>
              </div>
              <div>
                <dt>{t('account.created')}</dt>
                <dd>{createdAt}</dd>
              </div>
            </dl>
            <p className="account-hint">{t('account.hint')}</p>
          </article>
        </div>

        <p className="account-back">
          <Link to="/dashboard">{t('account.back')}</Link>
        </p>
      </section>
    </div>
  );
}

export default AccountPage;
