import { useLanguage } from '../context/LanguageContext';

function TermsPage() {
  const { t } = useLanguage();
  return (
    <div className="dashboard-wrap legal-page">
      <h1 className="dashboard-heading">{t('legal.termsTitle')}</h1>
      <p className="dashboard-lead">{t('legal.termsUpdated')}</p>
      <div className="legal-body">
        <p>{t('legal.termsP1')}</p>
        <p>{t('legal.termsP2')}</p>
        <p>
          {t('legal.termsP3')}{' '}
          <a href="mailto:legal@yourbank.demo">legal@yourbank.demo</a>
        </p>
      </div>
    </div>
  );
}

export default TermsPage;
