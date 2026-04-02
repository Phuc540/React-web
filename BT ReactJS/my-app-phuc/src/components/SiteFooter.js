import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const NAV_ROUTES = [
  { to: '/', key: 'home' },
  { to: '/careers', key: 'careers' },
  { to: '/about', key: 'about' },
  { to: '/security', key: 'security' }
];

function Logo() {
  const { t } = useLanguage();
  return (
    <NavLink to="/" className="logo-link">
      <div className="logo">
        <span className="logoMark" />
        <span className="logoText">{t('brand')}</span>
      </div>
    </NavLink>
  );
}

function SiteFooter() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <Logo />
      <div className="footerLinks">
        {NAV_ROUTES.map((item) => (
          <NavLink key={item.to} to={item.to}>
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
        <NavLink to="/privacy">{t('nav.privacy')}</NavLink>
        <NavLink to="/terms">{t('nav.terms')}</NavLink>
      </div>
      <p>
        © {new Date().getFullYear()} {t('brand')}. {t('footer.rights')}
      </p>
    </footer>
  );
}

export default SiteFooter;
