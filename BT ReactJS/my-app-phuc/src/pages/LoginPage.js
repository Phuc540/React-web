import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import '../styles/AuthPages.css';

function LoginPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e) {
      setError(t('auth.errLogin'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (e) {
      setError(t('auth.errGoogle'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <div className="auth-title-block">
        <h1>{t('auth.loginTitle')}</h1>
        <p className="auth-subtitle">{t('auth.loginSubtitle')}</p>
      </div>
      <form onSubmit={handleSubmit} className="auth-form">
        <input
          type="email"
          placeholder={t('auth.email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="auth-input-field"
        />
        <input
          type="password"
          placeholder={t('auth.password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="auth-input-field"
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading} className="auth-primary-btn">
          {loading ? t('auth.wait') : t('auth.loginBtn')}
        </button>
        <div className="auth-divider">{t('auth.or')}</div>
        <button type="button" onClick={handleGoogleLogin} disabled={loading} className="auth-google-btn">
          {loading ? t('auth.wait') : t('auth.google')}
        </button>
      </form>
      <p className="auth-switch">
        {t('auth.noAccount')} <Link to="/signup">{t('auth.linkSignup')}</Link>
      </p>
    </section>
  );
}

export default LoginPage;
