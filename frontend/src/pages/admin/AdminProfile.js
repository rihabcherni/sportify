import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../user/Profile.css';

const formatDate = (d) => {
  if (!d) return '';
  return new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const AdminProfile = () => {
  const { user, loading, updateProfile } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (user) {
      setForm(f => ({ ...f, name: user.name || '', email: user.email || '' }));
    }
  }, [user]);

  if (loading) return <div className="profile-loading">⏳ جار التحميل...</div>;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (form.newPassword && form.newPassword !== form.confirmPassword) {
      setError('كلمة المرور الجديدة غير متطابقة.');
      return;
    }
    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      await updateProfile(payload);
      setSuccess('تم تحديث الملف الشخصي بنجاح.');
      setForm(f => ({ ...f, currentPassword: '', newPassword: '', confirmPassword: '' }));
    } catch (err) {
      setError(err?.response?.data?.message || 'حدث خطأ أثناء الحفظ.');
    } finally {
      setSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="profile-header">
          <div className="profile-avatar">{user.name?.charAt(0) || '👤'}</div>
          <div>
            <h1 className="profile-title">{user.name}</h1>
            <div className="profile-role">مسؤول</div>
          </div>
        </div>
      </div>

      <div className="profile-card">
        <div className="profile-meta">
          <div className="profile-item">
            <span className="profile-label">البريد الإلكتروني</span>
            <span className="profile-value">{user.email}</span>
          </div>
          {user.createdAt && (
            <div className="profile-item">
              <span className="profile-label">تاريخ التسجيل</span>
              <span className="profile-value">{formatDate(user.createdAt)}</span>
            </div>
          )}
        </div>

        <form className="profile-form" onSubmit={onSubmit}>
          <h2 className="profile-section-title">تعديل بيانات المسؤول</h2>
          <div className="profile-form-grid">
            <div>
              <label className="profile-label">الاسم</label>
              <input
                className="profile-input"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="profile-label">البريد الإلكتروني</label>
              <input
                className="profile-input"
                type="email"
                value={form.email}
                autoComplete="email"
                onChange={e => setForm({ ...form, email: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="profile-label">كلمة المرور الحالية</label>
              <input
                className="profile-input"
                type="password"
                value={form.currentPassword}
                autoComplete="current-password"
                onChange={e => setForm({ ...form, currentPassword: e.target.value })}
                placeholder="اختياري"
              />
            </div>
            <div>
              <label className="profile-label">كلمة مرور جديدة</label>
              <input
                className="profile-input"
                type="password"
                value={form.newPassword}
                autoComplete="new-password"
                onChange={e => setForm({ ...form, newPassword: e.target.value })}
                placeholder="اختياري"
              />
            </div>
            <div>
              <label className="profile-label">تأكيد كلمة المرور الجديدة</label>
              <input
                className="profile-input"
                type="password"
                value={form.confirmPassword}
                autoComplete="new-password"
                onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
                placeholder="اختياري"
              />
            </div>
          </div>

          {error && <div className="profile-alert profile-alert-error">{error}</div>}
          {success && <div className="profile-alert profile-alert-success">{success}</div>}

          <div className="profile-actions">
            <button type="submit" className="btn-red" disabled={saving}>
              {saving ? 'جار الحفظ...' : 'حفظ التغييرات'}
            </button>
            <button
              type="button"
              className="btn-outline"
              onClick={() => setForm(f => ({ ...f, name: user.name || '', email: user.email || '', currentPassword: '', newPassword: '', confirmPassword: '' }))}
            >
              إعادة ضبط
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfile;
