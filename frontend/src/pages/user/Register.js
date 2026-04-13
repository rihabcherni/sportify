import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Register.css';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'حدث خطأ في التسجيل');
    } finally { setLoading(false); }
  };

  return (
    <div className="register-page">
      <div className="register-card">
        <div className="register-header">
          <img src="/images/logo.jpg" alt="Logo" className="register-logo" />
          <h1 className="register-title">إنشاء حساب</h1>
        </div>
        {error && <div className="register-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          {[{ key: 'name', label: 'الاسم الكامل', type: 'text' }, { key: 'email', label: 'البريد الإلكتروني', type: 'email' }, { key: 'password', label: 'كلمة المرور', type: 'password' }].map(f => (
            <div key={f.key} className="register-field">
              <label className="register-label">{f.label}</label>
              <input
                type={f.type}
                value={form[f.key]}
                onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                required
                autoComplete={f.key === 'password' ? 'new-password' : f.key === 'email' ? 'email' : 'name'}
                className="register-input" />
            </div>
          ))}
          <button type="submit" disabled={loading} className="register-submit">
            {loading ? 'جار التسجيل...' : 'إنشاء حساب'}
          </button>
        </form>
        <p className="register-footer">
          لديك حساب؟ <Link to="/login" className="register-link">تسجيل الدخول</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
