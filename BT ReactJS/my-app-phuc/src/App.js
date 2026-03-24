import './App.css';
import { useEffect, useMemo, useState } from 'react';
import { BrowserRouter, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from 'firebase/auth';
import { auth } from './firebase';

function LoginPage() {
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
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại email/mật khẩu.');
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
      setError('Đăng nhập Google thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="titleBlock">
        <h1>Đăng nhập</h1>
        <p className="subtitle">Đăng nhập để sử dụng công cụ tính lãi suất kép</p>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Đăng nhập'}
        </button>
        <div className="divider">hoặc</div>
        <button type="button" onClick={handleGoogleLogin} disabled={loading} className="googleButton">
          {loading ? 'Đang xử lý...' : 'Đăng nhập với Google'}
        </button>
      </form>
      <p className="authSwitch">
        Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
      </p>
    </div>
  );
}

function RegisterPage() {
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
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp.');
      return;
    }

    setLoading(true);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (e) {
      setError('Đăng ký thất bại. Có thể email đã được sử dụng.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <div className="titleBlock">
        <h1>Đăng ký</h1>
        <p className="subtitle">Tạo tài khoản mới để bắt đầu quản lý kế hoạch tài chính</p>
      </div>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        <button type="submit" disabled={loading}>
          {loading ? 'Đang xử lý...' : 'Tạo tài khoản'}
        </button>
      </form>
      <p className="authSwitch">
        Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}

function HomePage({ user }) {
  const [principal, setPrincipal] = useState(10000000);
  const [annualRate, setAnnualRate] = useState(8);
  const [years, setYears] = useState(5);
  const [compoundPerYear, setCompoundPerYear] = useState(12);

  const result = useMemo(() => {
    const p = Number(principal);
    const r = Number(annualRate) / 100;
    const t = Number(years);
    const n = Number(compoundPerYear);

    if (p <= 0 || r < 0 || t <= 0 || n <= 0) {
      return { amount: 0, interest: 0 };
    }

    const amount = p * Math.pow(1 + r / n, n * t);
    return {
      amount,
      interest: amount - p
    };
  }, [principal, annualRate, years, compoundPerYear]);

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <div className="card">
      <div className="homeHeader">
        <h1>Tính lãi suất kép</h1>
        <button type="button" onClick={handleLogout} className="secondary">
          Đăng xuất
        </button>
      </div>
      <p className="muted">Xin chào: {user?.email}</p>

      <div className="form">
        <label>
          Số tiền gốc (VND)
          <input
            type="number"
            min="0"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
          />
        </label>
        <label>
          Lãi suất năm (%)
          <input
            type="number"
            step="0.1"
            min="0"
            value={annualRate}
            onChange={(e) => setAnnualRate(e.target.value)}
          />
        </label>
        <label>
          Số năm
          <input
            type="number"
            min="1"
            value={years}
            onChange={(e) => setYears(e.target.value)}
          />
        </label>
        <label>
          Số lần nhập lãi/năm
          <input
            type="number"
            min="1"
            value={compoundPerYear}
            onChange={(e) => setCompoundPerYear(e.target.value)}
          />
        </label>
      </div>

      <div className="result">
        <p className="resultLabel">Số tiền sau kỳ hạn</p>
        <p className="resultValue">{Math.round(result.amount).toLocaleString('vi-VN')} VND</p>
        <p className="resultLabel">Tổng tiền lãi</p>
        <p className="resultValue">{Math.round(result.interest).toLocaleString('vi-VN')} VND</p>
      </div>
    </div>
  );
}

function ProtectedRoute({ user, children }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setChecking(false);
    });

    return () => unsubscribe();
  }, []);

  if (checking) {
    return (
      <div className="centerText">
        <p>Dang kiem tra phien dang nhap...</p>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute user={user}>
            <HomePage user={user} />
          </ProtectedRoute>
        }
      />
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to="/" replace /> : <RegisterPage />} />
      <Route path="*" element={<Navigate to={user ? '/' : '/login'} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <div className="appContainer">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  );
}

export default App;
