import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useLanguage } from '../context/LanguageContext';
import '../styles/AuthPages.css';

function RegisterPage() {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (password.length < 6) {
      setError(t('auth.errPassLen'));
      return;
    }

    if (password !== confirmPassword) {
      setError(t('auth.errPassMatch'));
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e) {
      setError(t('auth.errSignup'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-card">
      <div className="auth-title-block">
        <h1>{t('auth.signupTitle')}</h1>
        <p className="auth-subtitle">{t('auth.signupSubtitle')}</p>
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
        <input
          type="password"
          placeholder={t('auth.confirmPassword')}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="auth-input-field"
        />
        {error && <p className="auth-error">{error}</p>}
        <button type="submit" disabled={loading} className="auth-primary-btn">
          {loading ? t('auth.wait') : t('auth.signupBtn')}
        </button>
      </form>
      <p className="auth-switch">
        {t('auth.hasAccount')} <Link to="/login">{t('auth.linkLogin')}</Link>
      </p>
    </section>
  );
}

export default RegisterPage;
