import Hero from '../components/Hero';
import { ContentSection } from '../components/ContentSection';
import FAQSection from '../components/FAQSection';
import { useLanguage } from '../context/LanguageContext';

function SecurityPage() {
  const { t } = useLanguage();
  return (
    <>
      <Hero
        title={
          <>
            {t('hero.securityTitle')} <span>{t('hero.securityAccent')}</span>
          </>
        }
        desc={t('hero.securityDesc')}
      />
      <ContentSection
        title={t('features.securityTitle')}
        accent={t('features.securityAccent')}
        desc={t('features.securityDesc')}
        cards={[
          { title: t('features.s1t'), desc: t('features.s1d') },
          { title: t('features.s2t'), desc: t('features.s2d') },
          { title: t('features.s3t'), desc: t('features.s3d') },
          { title: t('features.s4t'), desc: t('features.s4d') }
        ]}
      />
      <FAQSection />
    </>
  );
}

export default SecurityPage;
