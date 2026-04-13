import { useState } from 'react';
import axios from 'axios';
import './Feedback.css';

const Feedback = () => {
  const [form, setForm] = useState({ name: '', email: '', comment: '', rating: 0, anonymous: false });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const setRating = (value) => setForm({ ...form, rating: value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.rating) {
      setError('يرجى اختيار التقييم.');
      return;
    }
    if (!form.comment.trim()) {
      setError('يرجى كتابة تعليقك.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        rating: form.rating,
        comment: form.comment,
        anonymous: form.anonymous
      };
      if (!form.anonymous) {
        payload.name = form.name;
        payload.email = form.email;
      }
      await axios.post('/api/feedback', payload);
      setSuccess('شكرًا! تم إرسال ملاحظتك بنجاح.');
      setForm({ name: '', email: '', comment: '', rating: 0, anonymous: false });
    } catch (err) {
      setError(err?.response?.data?.message || 'حدث خطأ أثناء الإرسال.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container feedback-page">
      <div className="feedback-hero">
        <h1 className="feedback-title">قيّم تجربتك معنا</h1>
        <p className="feedback-subtitle">ملاحظاتك تساعدنا على تحسين التطبيق وتقديم تجربة أفضل.</p>
      </div>

      <form className="feedback-card" onSubmit={onSubmit}>
        <div className="feedback-rating">
          <span className="feedback-label">التقييم</span>
          <div className="feedback-stars" role="radiogroup" aria-label="Rating">
            {[1, 2, 3, 4, 5].map(v => (
              <button
                key={v}
                type="button"
                className={`feedback-star${form.rating >= v ? ' is-active' : ''}`}
                onClick={() => setRating(v)}
                aria-label={`${v} نجوم`}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="feedback-grid">
          <div>
            <label className="feedback-label">الاسم</label>
            <input
              className="feedback-input"
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              disabled={form.anonymous}
              placeholder="اختياري"
            />
          </div>
          <div>
            <label className="feedback-label">البريد الإلكتروني</label>
            <input
              className="feedback-input"
              type="email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              disabled={form.anonymous}
              placeholder="اختياري"
            />
          </div>
        </div>

        <div className="feedback-anon">
          <input
            id="anonymous"
            type="checkbox"
            checked={form.anonymous}
            onChange={e => setForm({ ...form, anonymous: e.target.checked })}
          />
          <label htmlFor="anonymous">إرسال الملاحظة بشكل مجهول</label>
        </div>

        <div>
          <label className="feedback-label">تعليقك</label>
          <textarea
            className="feedback-input feedback-textarea"
            value={form.comment}
            onChange={e => setForm({ ...form, comment: e.target.value })}
            placeholder="اكتب اقتراحك أو ملاحظتك هنا..."
            required
          />
        </div>

        {error && <div className="feedback-alert feedback-alert-error">{error}</div>}
        {success && <div className="feedback-alert feedback-alert-success">{success}</div>}

        <div className="feedback-actions">
          <button type="submit" className="btn-red" disabled={saving}>
            {saving ? 'جار الإرسال...' : 'إرسال الملاحظة'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Feedback;
