import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './AdminVideos.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminMediaInput from '../../components/admin/AdminMediaInput';

const AdminVideos = () => {
  const [videos, setVideos] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const empty = { titleAr: '', title: '', descriptionAr: '', description: '', url: '', thumbnail: '', category: 'highlights' };
  const [form, setForm] = useState(empty);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const fetch = () => axios.get(`/api/videos?limit=${pageSize}&page=${page}`).then(r => {
    setVideos(r.data.videos);
    setPages(r.data.pages || 1);
    setTotal(r.data.total || 0);
  });
  useEffect(() => { fetch(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const reset = () => { 
    setForm(empty); 
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
      formData.append('thumbnail', selectedFile);
    }
    if (selectedVideoFile) {
      formData.append('video', selectedVideoFile);
    }

    if (editing) await axios.put(`/api/videos/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    else await axios.post('/api/videos', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    
    reset(); fetch();
  };
  const handleEdit = (v) => { 
    setForm({ titleAr: v.titleAr, title: v.title || '', descriptionAr: v.descriptionAr || '', description: v.description || '', url: v.url, thumbnail: v.thumbnail || '', category: v.category });
    setSelectedFile(null);
    setSelectedVideoFile(null);
    setEditing(v._id); 
    setShowForm(true); 
  };
  const handleDelete = async (id) => { if (window.confirm('حذف الفيديو؟')) { await axios.delete(`/api/videos/${id}`); fetch(); } };

  const categoryLabels = {
    highlights: 'ملخصات',
    interviews: 'حوارات',
    analysis: 'تحليل',
    other: 'أخرى',
  };
  return (
    <div className="admin-videos">
      <AdminPageHeader
        title="إدارة الفيديوهات"
        subtitle={`إجمالي: ${total} فيديو`}
        action={<button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة فيديو</button>}
      />
      {showForm && (
        <div className="admin-videos-form-card">
          <h3 className="admin-videos-form-title">{editing ? 'تعديل فيديو' : 'إضافة فيديو'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-videos-form-grid">
              <div>
                <label className="admin-videos-label">العنوان بالعربية *</label>
                <input className="admin-videos-input" value={form.titleAr} onChange={e => setForm({...form, titleAr: e.target.value})} required />
              </div>
              <div>
                <label className="admin-videos-label">العنوان</label>
                <input className="admin-videos-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <div>
                <label className="admin-videos-label">التصنيف</label>
                <select className="admin-videos-input" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {Object.entries(categoryLabels).map(([value, label]) => (
                    <option key={value} value={value}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="admin-videos-span">
                <label className="admin-videos-label">الوصف بالعربية</label>
                <textarea className="admin-videos-input admin-videos-textarea" value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} />
              </div>
              <div className="admin-videos-media">
                <AdminMediaInput
                  label="الفيديو"
                  type="video"
                  file={selectedVideoFile}
                  setFile={setSelectedVideoFile}
                  value={form.url}
                  onValueChange={(val) => setForm({ ...form, url: val })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  required
                  hint="MP4, WebM, Ogg"
                />
              </div>
              <div className="admin-videos-media">
                <AdminMediaInput
                  label="الصورة المصغرة"
                  type="image"
                  file={selectedFile}
                  setFile={setSelectedFile}
                  value={form.thumbnail}
                  onValueChange={(val) => setForm({ ...form, thumbnail: val })}
                  hint="JPG, PNG, WebP"
                />
              </div>
            </div>
            <div className="admin-videos-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'إضافة'}</button>
              <button type="button" onClick={reset} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div className="admin-videos-table-card">
        <table className="admin-videos-table">
          <thead>
            <tr className="admin-videos-table-head">
            {['الصورة', 'العنوان', 'التصنيف', 'المشاهدات', 'الإجراءات'].map(h => (
              <th key={h} className="admin-videos-th">{h}</th>
            ))}
            </tr>
          </thead>
          <tbody>
            {videos.map(v => (
              <tr key={v._id} className="admin-videos-tr">
                <td className="admin-videos-td">
                  <img src={getFullImageUrl(v.thumbnail) || `https://picsum.photos/seed/${v._id}/80/50`} alt="" className="admin-videos-thumb" />
                </td>
                <td className="admin-videos-td admin-videos-title-cell">
                  <div className="admin-videos-ellipsis">{v.titleAr}</div>
                </td>
                <td className="admin-videos-td">
                  <span className="badge admin-videos-badge">{categoryLabels[v.category] || v.category}</span>
                </td>
                <td className="admin-videos-td admin-videos-muted">👁 {v.views}</td>
                <td className="admin-videos-td">
                  <div className="admin-videos-actions">
                    <button onClick={() => handleEdit(v)} className="admin-videos-btn admin-videos-btn-edit">تعديل</button>
                    <button onClick={() => handleDelete(v._id)} className="admin-videos-btn admin-videos-btn-delete">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-videos-cards">
        {videos.map(v => (
          <div key={v._id} className="admin-videos-card">
            <div className="admin-videos-card-head">
              <img src={getFullImageUrl(v.thumbnail) || `https://picsum.photos/seed/${v._id}/120/80`} alt="" className="admin-videos-card-thumb" />
              <div className="admin-videos-card-info">
                <div className="admin-videos-card-title">{v.titleAr}</div>
                <div className="admin-videos-card-meta">
                  <span className="badge admin-videos-badge">{categoryLabels[v.category] || v.category}</span>
                  <span className="admin-videos-muted">👁 {v.views}</span>
                </div>
              </div>
            </div>
            <div className="admin-videos-card-actions">
              <button onClick={() => handleEdit(v)} className="admin-videos-btn admin-videos-btn-edit">تعديل</button>
              <button onClick={() => handleDelete(v._id)} className="admin-videos-btn admin-videos-btn-delete">حذف</button>
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

export default AdminVideos;
