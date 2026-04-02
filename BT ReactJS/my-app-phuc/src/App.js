import { useEffect, useState } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from './firebase';
import { GuestOnly, ProtectedRoute } from './components/ProtectedRoute';
import SiteHeader from './components/SiteHeader';
import SiteFooter from './components/SiteFooter';
import SiteSidebar from './components/SiteSidebar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import AccountPage from './pages/AccountPage';
import SettingsPage from './pages/SettingsPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import HomePage from './pages/HomePage';
import CareersPage from './pages/CareersPage';
import AboutPage from './pages/AboutPage';
import SecurityPage from './pages/SecurityPage';
import { useLanguage } from './context/LanguageContext';
import './App.css';
function Layout({ children, user, onLogout }) {
  return (
    <div className="page appShell">
      <SiteSidebar />
      <div className="appShellMain">
        <SiteHeader user={user} onLogout={onLogout} />
        {children}
        <SiteFooter />
      </div>
    </div>
  );
}
function AppRoutes({ user, onLogout, checking }) {
  const { t } = useLanguage();
  if (checking) {
    return (
      <div className="page">
        <div className="auth-checking">{t('auth.checking')}</div>
      </div>
    );
  }
  return (
    <Routes>
      <Route
        path="/login"
        element={
          <GuestOnly user={user}>
            <Layout user={user} onLogout={onLogout}>
              <LoginPage />
            </Layout>
          </GuestOnly>
        }
      />
      <Route
        path="/signup"
        element={
          <GuestOnly user={user}>
            <Layout user={user} onLogout={onLogout}>
              <RegisterPage />
            </Layout>
          </GuestOnly>
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={onLogout}>
              <DashboardPage user={user} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/account"
        element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={onLogout}>
              <AccountPage user={user} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/settings"
        element={
          <ProtectedRoute user={user}>
            <Layout user={user} onLogout={onLogout}>
              <SettingsPage user={user} />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/"
        element={
          <Layout user={user} onLogout={onLogout}>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/careers"
        element={
          <Layout user={user} onLogout={onLogout}>
            <CareersPage />
          </Layout>
        }
      />
      <Route
        path="/about"
        element={
          <Layout user={user} onLogout={onLogout}>
            <AboutPage />
          </Layout>
        }
      />
      <Route
        path="/security"
        element={
          <Layout user={user} onLogout={onLogout}>
            <SecurityPage />
          </Layout>
        }
      />
      <Route
        path="/privacy"
        element={
          <Layout user={user} onLogout={onLogout}>
            <PrivacyPage />
          </Layout>
        }
      />
      <Route
        path="/terms"
        element={
          <Layout user={user} onLogout={onLogout}>
            <TermsPage />
          </Layout>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
function App() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });
    return () => unsubscribe();
  }, []);
  const handleLogout = async () => {
    await signOut(auth);
  };
  return (
    <BrowserRouter>
      <AppRoutes user={user} onLogout={handleLogout} checking={checking} />
    </BrowserRouter>
  );
}
export default App;