import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

function Hero({ title, desc }) {
  const { t } = useLanguage();
  return (
    <section className="hero">
      <div className="heroCard">
        <p className="heroEyebrow">{t('hero.eyebrow')}</p>
        <h1 className="heroTitle">{title}</h1>
        <p className="heroDesc">{desc}</p>
        <NavLink to="/signup" className="primaryButton heroCta">
          {t('hero.cta')}
        </NavLink>
      </div>
      <div className="heroVisual" />
    </section>
  );
}

export default Hero;
