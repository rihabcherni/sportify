import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './AdminNews.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminMediaInput from '../../components/admin/AdminMediaInput';

const AdminNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState({ titleAr: '', title: '', contentAr: '', content: '', category: 'football', image: '', videoUrl: '', featured: false });
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const fetchNews = () => {
    setLoading(true);
    axios.get(`/api/news?limit=${pageSize}&page=${page}`)
      .then(r => {
        setNews(r.data.news);
        setPages(r.data.pages || 1);
        setTotal(r.data.total || 0);
      })
      .finally(() => setLoading(false));
  };
  useEffect(() => { fetchNews(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const resetForm = () => {
    setForm({ titleAr: '', title: '', contentAr: '', content: '', category: 'football', image: '', videoUrl: '', featured: false });
    setSelectedFile(null);
    setSelectedVideoFile(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    Object.keys(form).forEach(key => {
      formData.append(key, form[key]);
    });
    if (selectedFile) {
      formData.append('image', selectedFile);
    }
    if (selectedVideoFile) {
      formData.append('video', selectedVideoFile);
    }

    if (editing) await axios.put(`/api/news/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    else await axios.post('/api/news', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

    resetForm(); fetchNews();
  };

  const handleEdit = (n) => {
    setForm({ titleAr: n.titleAr, title: n.title, contentAr: n.contentAr, content: n.content, category: n.category, image: n.image || '', videoUrl: n.videoUrl || '', featured: n.featured });
    setSelectedFile(null);
    setSelectedVideoFile(null);
    setEditing(n._id);
    setShowForm(true);
  };
  const handleDelete = async (id) => { if (window.confirm('هل تريد حذف هذا الخبر؟')) { await axios.delete(`/api/news/${id}`); fetchNews(); } };

  const categoryLabels = {
    football: 'كرة القدم',
    basketball: 'كرة السلة',
    tennis: 'التنس',
    local: 'محلي',
    international: 'دولي',
    other: 'أخرى',
  };
  return (
    <div className="admin-news">
      <AdminPageHeader
        title="إدارة الأخبار"
        subtitle={`إجمالي: ${total} خبر`}
        action={<button onClick={() => { resetForm(); setShowForm(true); }} className="btn-red">+ إضافة خبر</button>}
      />

      {showForm && (
        <div className="admin-news-form-card">
          <h3 className="admin-news-form-title">{editing ? 'تعديل الخبر' : 'إضافة خبر جديد'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-news-form-grid">
              <div>
                <label className="admin-news-label">العنوان بالعربية *</label>
                <input className="admin-news-input" value={form.titleAr} onChange={e => setForm({ ...form, titleAr: e.target.value })} required />
              </div>
              <div>
                <label className="admin-news-label">العنوان بالفرنسية/الإنجليزية</label>
                <input className="admin-news-input" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="admin-news-span">
                <label className="admin-news-label">المحتوى بالعربية *</label>
                <textarea className="admin-news-input admin-news-textarea-lg" value={form.contentAr} onChange={e => setForm({ ...form, contentAr: e.target.value })} required />
              </div>
              <div className="admin-news-span">
                <label className="admin-news-label">المحتوى بالفرنسية/الإنجليزية</label>
                <textarea className="admin-news-input admin-news-textarea-md" value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
              </div>
              <div>
                <label className="admin-news-label">التصنيف</label>
                <select className="admin-news-input" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                  {['football', 'basketball', 'tennis', 'local', 'international', 'other'].map(c => (
                    <option key={c} value={c}>{categoryLabels[c] || c}</option>
                  ))}
                </select>
              </div>
              <div className="admin-news-check">
                <input type="checkbox" id="featured" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                <label htmlFor="featured" className="admin-news-check-label">خبر مميز</label>
              </div>
              <div>
                <AdminMediaInput
                  label="الصورة"
                  type="image"
                  file={selectedFile}
                  setFile={setSelectedFile}
                  value={form.image}
                  onValueChange={(val) => setForm({ ...form, image: val })}
                  hint="JPG, PNG, WebP"
                />
              </div>
              <div>
                <AdminMediaInput
                  label="الفيديو"
                  type="video"
                  file={selectedVideoFile}
                  setFile={setSelectedVideoFile}
                  value={form.videoUrl}
                  onValueChange={(val) => setForm({ ...form, videoUrl: val })}
                  hint="MP4, WebM, Ogg"
                />
              </div>

            </div>
            <div className="admin-news-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ التعديلات' : 'نشر الخبر'}</button>
              <button type="button" onClick={resetForm} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      {loading ? <div className="admin-news-loading">⏳ جار التحميل...</div> : (
        <div className="admin-news-table-card">
          <table className="admin-news-table">
            <thead>
              <tr className="admin-news-table-head">
                {['الصورة', 'العنوان', 'التصنيف', 'المشاهدات', 'مميز', 'فيديو', 'الإجراءات'].map(h => (
                  <th key={h} className="admin-news-th">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {news.map(n => (
                <tr key={n._id} className="admin-news-tr">
                  <td className="admin-news-td">
                    <img src={getFullImageUrl(n.image) || `https://picsum.photos/seed/${n._id}/60/40`} alt="" className="admin-news-thumb" />
                  </td>
                  <td className="admin-news-td admin-news-title-cell">
                    <div className="admin-news-ellipsis">{n.titleAr}</div>
                  </td>
                  <td className="admin-news-td">
                    <span className="badge badge-red admin-news-badge">{categoryLabels[n.category] || n.category}</span>
                  </td>
                  <td className="admin-news-td admin-news-muted">👁 {n.views}</td>
                  <td className="admin-news-td">{n.featured ? '⭐' : '—'}</td>
                  <td className="admin-news-td">{n.videoUrl ? '📹' : '—'}</td>
                  <td className="admin-news-td">
                    <div className="admin-news-actions">
                      <button onClick={() => handleEdit(n)} className="admin-news-btn admin-news-btn-edit">تعديل</button>
                      <button onClick={() => handleDelete(n._id)} className="admin-news-btn admin-news-btn-delete">حذف</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-news-cards">
        {news.map(n => (
          <div key={n._id} className="admin-news-card">
            <div className="admin-news-card-head">
              <img src={getFullImageUrl(n.image) || `https://picsum.photos/seed/${n._id}/120/80`} alt="" className="admin-news-card-thumb" />
              <div className="admin-news-card-info">
                <div className="admin-news-card-title">{n.titleAr}</div>
                <div className="admin-news-card-meta">
                  <span className="badge badge-red admin-news-badge">{categoryLabels[n.category] || n.category}</span>
                  <span className="admin-news-muted">👁 {n.views}</span>
                  <span>{n.featured ? '⭐' : '—'}</span>
                </div>
              </div>
            </div>
            <div className="admin-news-card-actions">
              <button onClick={() => handleEdit(n)} className="admin-news-btn admin-news-btn-edit">تعديل</button>
              <button onClick={() => handleDelete(n._id)} className="admin-news-btn admin-news-btn-delete">حذف</button>
            </div>
          </div>
        ))}
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

export default AdminNews;
