import { useLanguage } from '../context/LanguageContext';

function PrivacyPage() {
  const { t } = useLanguage();
  return (
    <div className="dashboard-wrap legal-page">
      <h1 className="dashboard-heading">{t('legal.privacyTitle')}</h1>
      <p className="dashboard-lead">{t('legal.privacyUpdated')}</p>
      <div className="legal-body">
        <p>{t('legal.privacyP1')}</p>
        <p>{t('legal.privacyP2')}</p>
        <p>
          {t('legal.privacyP3')}{' '}
          <a href="mailto:privacy@yourbank.demo">privacy@yourbank.demo</a>
        </p>
      </div>
    </div>
  );
}

export default PrivacyPage;
