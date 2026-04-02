import CompoundInterestCalculator from '../components/CompoundInterestCalculator';
import Hero from '../components/Hero';
import { ContentSection } from '../components/ContentSection';
import FAQSection from '../components/FAQSection';
import { useLanguage } from '../context/LanguageContext';

function HomePage() {
  const { t } = useLanguage();

  return (
    <>
      <Hero
        title={
          <>
            {t('hero.homeTitle')} <span>{t('hero.homeAccent')}</span>
          </>
        }
        desc={t('hero.homeDesc')}
      />
      <CompoundInterestCalculator />
      <ContentSection
        title={t('features.homeTitle')}
        accent={t('features.homeAccent')}
        desc={t('features.homeDesc')}
        cards={[
          { title: t('features.f1t'), desc: t('features.f1d') },
          { title: t('features.f2t'), desc: t('features.f2d') },
          { title: t('features.f3t'), desc: t('features.f3d') },
          { title: t('features.f4t'), desc: t('features.f4d') }
        ]}
      />
      <FAQSection />
    </>
  );
}

export default HomePage;
