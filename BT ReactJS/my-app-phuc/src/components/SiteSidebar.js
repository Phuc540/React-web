import { NavLink } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SIDEBAR_ROUTES = [
  { to: '/', key: 'home' },
  { to: '/careers', key: 'careers' },
  { to: '/about', key: 'about' },
  { to: '/security', key: 'security' }
];

function SiteSidebar() {
  const { t } = useLanguage();

  return (
    <aside className="sidebar" aria-label="Sidebar">
      <div className="sidebarInner">
        {SIDEBAR_ROUTES.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `sidebarLink ${isActive ? 'isActive' : ''}`}
          >
            {t(`nav.${item.key}`)}
          </NavLink>
        ))}
      </div>
    </aside>
  );
}

export default SiteSidebar;

