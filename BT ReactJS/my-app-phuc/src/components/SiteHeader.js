import { useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { LANGUAGE_OPTIONS, resolveLanguageSelectValue } from '../i18n/languageOptions';

const USER_MENU_ROUTES = [
  { to: '/dashboard', key: 'dashboard' },
  { to: '/account', key: 'account' },
  { to: '/settings', key: 'settings' }
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

function LanguageSwitcher() {
  const { setLanguage, t, i18n } = useLanguage();

  const selectValue = useMemo(
    () => resolveLanguageSelectValue(i18n.language),
    [i18n.language]
  );

  return (
    <label className="lang-switcher">
      <span className="visually-hidden">{t('lang.switch')}</span>
      <select
        className="lang-select"
        value={selectValue}
        onChange={(e) => setLanguage(e.target.value)}
        aria-label={t('lang.switch')}
      >
        {LANGUAGE_OPTIONS.map((opt) => (
          <option key={opt.code} value={opt.code}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

function UserMenuUnderEmail({ user }) {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onDoc = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, []);

  return (
    <div className="userMenu" ref={wrapRef}>
      <button
        type="button"
        className={`userMenuTrigger ${open ? 'isOpen' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-label={t('nav.accountMenu')}
      >
        <span className="headerUserEmail">{user.email}</span>
        <span className="userMenuChevron" aria-hidden>
          ▾
        </span>
      </button>
      {open && (
        <div className="userMenuDropdown" role="menu">
          {USER_MENU_ROUTES.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              role="menuitem"
              className={({ isActive }) => `userMenuLink ${isActive ? 'isActive' : ''}`}
              onClick={() => setOpen(false)}
            >
              {t(`nav.${item.key}`)}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function SiteHeader({ user, onLogout }) {
  const { t } = useLanguage();

  return (
    <header className="header">
      <Logo />
      <div className="headerActions">
        <LanguageSwitcher />
        {user ? (
          <>
            <UserMenuUnderEmail user={user} />
            <button type="button" className="secondaryButton" onClick={onLogout}>
              {t('nav.logout')}
            </button>
          </>
        ) : (
          <>
            <NavLink className="textButton" to="/signup">
              {t('nav.signup')}
            </NavLink>
            <NavLink className="primaryButton" to="/login">
              {t('nav.login')}
            </NavLink>
          </>
        )}
      </div>
    </header>
  );
}

export default SiteHeader;
