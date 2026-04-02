import Hero from '../components/Hero';
import { ContentSection } from '../components/ContentSection';
import { useLanguage } from '../context/LanguageContext';

function AboutPage() {
  const { t } = useLanguage();
  return (
    <>
      <Hero
        title={
          <>
            {t('hero.aboutTitle')} <span>{t('hero.aboutAccent')}</span>
          </>
        }
        desc={t('hero.aboutDesc')}
      />
      <ContentSection
        title={t('features.aboutTitle')}
        accent={t('features.aboutAccent')}
        desc={t('features.aboutDesc')}
        cards={[
          { title: t('features.m1t'), desc: t('features.m1d') },
          { title: t('features.m2t'), desc: t('features.m2d') }
        ]}
      />
    </>
  );
}

export default AboutPage;
