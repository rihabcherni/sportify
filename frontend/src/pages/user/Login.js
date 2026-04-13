import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const user = await login(email, password);
      navigate(user.role === 'admin' ? '/admin' : '/');
    } catch (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src="/images/logo.jpg" alt="Logo" className="login-logo" />
          <h1 className="login-title">تسجيل الدخول</h1>
          <p className="login-subtitle">مرحباً بك في Sportif.tn</p>
        </div>
        {error && <div className="login-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="login-field">
            <label className="login-label">البريد الإلكتروني</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
              autoComplete="email"
              className="login-input" />
          </div>
          <div className="login-field login-field-last">
            <label className="login-label">كلمة المرور</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
              autoComplete="current-password"
              className="login-input" />
          </div>
          <button type="submit" disabled={loading} className="login-submit">
            {loading ? 'جار الدخول...' : 'دخول'}
          </button>
        </form>
        <p className="login-footer">
          ليس لديك حساب؟ <Link to="/register" className="login-link">إنشاء حساب</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
