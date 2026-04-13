import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './AdminFeedback.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPagination from '../../components/admin/AdminPagination';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

const AdminFeedback = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  const fetch = () => {
    setLoading(true);
    axios.get(`/api/feedback?page=${page}&limit=${pageSize}`).then(r => {
      setFeedbacks(r.data.feedbacks || []);
      setPages(r.data.pages || 1);
      setTotal(r.data.total || 0);
      hasLoaded.current = true;
    }).finally(() => setLoading(false));
  };

  const deleteFeedback = (id) => {
    if (window.confirm('هل أنت متأكد من حذف هذا الرأي؟')) {
      axios.delete(`/api/feedback/${id}`).then(() => {
        fetch(); // Refresh the list
      }).catch(err => {
        alert('فشل في حذف الرأي: ' + (err.response?.data?.message || err.message));
      });
    }
  };

  useEffect(() => { fetch(); }, [page, pageSize]);
  useEffect(() => {
    if (hasLoaded.current && page > pages) setPage(pages);
  }, [pages, page]);

  return (
    <div className="admin-feedback">
      <AdminPageHeader
        title="آراء المستخدمين"
        subtitle={`إجمالي: ${total} رأي`}
      />

      <div className="admin-feedback-table-card">
        <table className="admin-feedback-table">
          <thead>
            <tr className="admin-feedback-table-head">
              {['التقييم', 'الاسم', 'البريد', 'التعليق', 'التاريخ', 'الإجراءات'].map(h => (
                <th key={h} className="admin-feedback-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" className="admin-feedback-empty">⏳ جار التحميل...</td></tr>
            ) : feedbacks.length === 0 ? (
              <tr><td colSpan="6" className="admin-feedback-empty">لا توجد آراء حالياً</td></tr>
            ) : (
              feedbacks.map(f => (
                <tr key={f._id} className="admin-feedback-tr">
                  <td className="admin-feedback-td">
                    <span className="admin-feedback-stars">
                      {[1, 2, 3, 4, 5].map(i => (
                        <span key={i} className={`admin-feedback-star${i <= f.rating ? ' is-active' : ''}`}>★</span>
                      ))}
                    </span>
                  </td>
                  <td className="admin-feedback-td">{f.anonymous ? 'مجهول' : (f.name || '—')}</td>
                  <td className="admin-feedback-td">{f.anonymous ? '—' : (f.email || '—')}</td>
                  <td className="admin-feedback-td admin-feedback-comment">{f.comment}</td>
                  <td className="admin-feedback-td">{formatDate(f.createdAt)}</td>
                  <td className="admin-feedback-td">
                    <button className="admin-feedback-delete-btn" onClick={() => deleteFeedback(f._id)}>حذف</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-feedback-cards">
        {loading ? (
          <div className="admin-feedback-card admin-feedback-empty">⏳ جار التحميل...</div>
        ) : feedbacks.length === 0 ? (
          <div className="admin-feedback-card admin-feedback-empty">لا توجد آراء حالياً</div>
        ) : (
          feedbacks.map(f => (
            <div key={f._id} className="admin-feedback-card">
              <div className="admin-feedback-card-head">
                <span className="admin-feedback-stars">
                  {[1, 2, 3, 4, 5].map(i => (
                    <span key={i} className={`admin-feedback-star${i <= f.rating ? ' is-active' : ''}`}>★</span>
                  ))}
                </span>
                <span className="admin-feedback-date">{formatDate(f.createdAt)}</span>
                <button className="admin-feedback-delete-btn" onClick={() => deleteFeedback(f._id)}>حذف</button>
              </div>
              <div className="admin-feedback-card-row">
                <span className="admin-feedback-card-label">الاسم</span>
                <span className="admin-feedback-card-value">{f.anonymous ? 'مجهول' : (f.name || '—')}</span>
              </div>
              <div className="admin-feedback-card-row">
                <span className="admin-feedback-card-label">البريد</span>
                <span className="admin-feedback-card-value">{f.anonymous ? '—' : (f.email || '—')}</span>
              </div>
              <div className="admin-feedback-card-row">
                <span className="admin-feedback-card-label">التعليق</span>
                <span className="admin-feedback-card-value admin-feedback-card-comment">{f.comment}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <AdminPagination
        page={page}
        pages={pages}
        pageSize={pageSize}
        onPageChange={setPage}
        onPageSizeChange={(n) => { setPage(1); setPageSize(n); }}
      />
    </div>
  );
};

export default AdminFeedback;
