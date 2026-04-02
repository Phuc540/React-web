import Hero from '../components/Hero';
import { ContentSection } from '../components/ContentSection';
import FAQSection from '../components/FAQSection';
import { useLanguage } from '../context/LanguageContext';

function CareersPage() {
  const { t } = useLanguage();
  return (
    <>
      <Hero
        title={
          <>
            {t('hero.careersTitle')} <span>{t('hero.careersAccent')}</span>
          </>
        }
        desc={t('hero.careersDesc')}
      />
      <ContentSection
        title={t('features.careersTitle')}
        accent={t('features.careersAccent')}
        desc={t('features.careersDesc')}
        cards={[
          { title: t('features.cv1t'), desc: t('features.cv1d') },
          { title: t('features.cv2t'), desc: t('features.cv2d') },
          { title: t('features.cv3t'), desc: t('features.cv3d') },
          { title: t('features.cv4t'), desc: t('features.cv4d') }
        ]}
      />
      <FAQSection />
    </>
  );
}

export default CareersPage;
