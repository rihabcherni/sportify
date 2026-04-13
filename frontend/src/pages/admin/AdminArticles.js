import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './AdminArticles.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminMediaInput from '../../components/admin/AdminMediaInput';

const createSection = () => ({
  title: '',
  body: '',
  titleColor: '#CC0000',
  titleFontSize: 28,
  titleFontFamily: 'Arial, sans-serif',
});

const createVideo = () => ({ url: '' });

const empty = {
  titleAr: '',
  type: 'analysis',
  image: '',
  videoUrls: [createVideo()],
  customSections: [createSection()],
};

const fontOptions = [
  { value: 'Arial, sans-serif', label: 'Arial' },
  { value: '"Times New Roman", serif', label: 'Times New Roman' },
  { value: 'Georgia, serif', label: 'Georgia' },
  { value: 'Tahoma, sans-serif', label: 'Tahoma' },
  { value: 'Verdana, sans-serif', label: 'Verdana' },
  { value: '"Trebuchet MS", sans-serif', label: 'Trebuchet MS' },
  { value: '"Courier New", monospace', label: 'Courier New' },
];

const normalizeVideosForForm = (article) => {
  const urls = Array.isArray(article.videoUrls) && article.videoUrls.length
    ? article.videoUrls
    : (article.videoUrl ? [article.videoUrl] : []);

  return urls.length ? urls.map((url) => ({ url: url || '' })) : [createVideo()];
};

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(empty);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const fetch = () => axios.get(`/api/articles?limit=${pageSize}&page=${page}`).then((r) => {
    setArticles(r.data.articles || []);
    setPages(r.data.pages || 1);
    setTotal(r.data.total || 0);
  });

  useEffect(() => {
    fetch();
  }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const reset = () => {
    setForm({
      ...empty,
      videoUrls: [createVideo()],
      customSections: [createSection()],
    });
    setSelectedFile(null);
    setSelectedVideoFile(null);
    setEditing(null);
    setShowForm(false);
  };

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const updateVideo = (index, value) => {
    setForm((prev) => ({
      ...prev,
      videoUrls: prev.videoUrls.map((video, videoIndex) => (
        videoIndex === index ? { ...video, url: value } : video
      )),
    }));
  };

  const addVideo = () => {
    setForm((prev) => ({ ...prev, videoUrls: [...prev.videoUrls, createVideo()] }));
  };

  const removeVideo = (index) => {
    setForm((prev) => {
      const nextVideos = prev.videoUrls.filter((_, videoIndex) => videoIndex !== index);
      return { ...prev, videoUrls: nextVideos.length ? nextVideos : [createVideo()] };
    });
  };

  const updateSection = (index, key, value) => {
    setForm((prev) => ({
      ...prev,
      customSections: prev.customSections.map((section, sectionIndex) => (
        sectionIndex === index ? { ...section, [key]: value } : section
      )),
    }));
  };

  const addSection = () => {
    setForm((prev) => ({ ...prev, customSections: [...prev.customSections, createSection()] }));
  };

  const removeSection = (index) => {
    setForm((prev) => {
      const nextSections = prev.customSections.filter((_, sectionIndex) => sectionIndex !== index);
      return { ...prev, customSections: nextSections.length ? nextSections : [createSection()] };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedVideoUrls = form.videoUrls.map((item) => String(item.url || '').trim()).filter(Boolean);
    const formData = new FormData();
    formData.append('titleAr', form.titleAr);
    formData.append('type', form.type);
    formData.append('image', form.image);
    formData.append('videoUrls', JSON.stringify(cleanedVideoUrls));
    formData.append('customSections', JSON.stringify(form.customSections));
    formData.append('contentAr', form.customSections.map((section) => [section.title, section.body].filter(Boolean).join('\n')).filter(Boolean).join('\n\n'));

    if (selectedFile) formData.append('image', selectedFile);
    if (selectedVideoFile) formData.append('video', selectedVideoFile);

    if (editing) {
      await axios.put(`/api/articles/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    } else {
      await axios.post('/api/articles', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    }

    reset();
    fetch();
  };

  const handleEdit = (article) => {
    setForm({
      titleAr: article.titleAr || '',
      type: article.type || 'analysis',
      image: article.image || '',
      videoUrls: normalizeVideosForForm(article),
      customSections: article.customSections?.length
        ? article.customSections.map((section) => ({
          title: section.title || '',
          body: section.body || '',
          titleColor: section.titleColor || '#CC0000',
          titleFontSize: Number(section.titleFontSize) || 28,
          titleFontFamily: section.titleFontFamily || 'Arial, sans-serif',
        }))
        : [createSection()],
    });
    setSelectedFile(null);
    setSelectedVideoFile(null);
    setEditing(article._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('حذف المقال؟')) {
      await axios.delete(`/api/articles/${id}`);
      fetch();
    }
  };

  const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN');

  return (
    <div className="admin-articles">
      <AdminPageHeader
        title="إدارة المقالات"
        subtitle={`إجمالي: ${total} مقال`}
        action={<button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة مقال</button>}
      />

      {showForm && (
        <div className="admin-articles-form-card">
          <h3 className="admin-articles-form-title">{editing ? 'تعديل مقال' : 'إضافة مقال'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-articles-form-grid">
              <div className="admin-articles-span">
                <label className="admin-articles-label">العنوان الرئيسي *</label>
                <input className="admin-articles-input" value={form.titleAr} onChange={(e) => updateField('titleAr', e.target.value)} required />
              </div>

              <div>
                <label className="admin-articles-label">النوع</label>
                <select className="admin-articles-input" value={form.type} onChange={(e) => updateField('type', e.target.value)}>
                  <option value="analysis">تحليل</option>
                  <option value="opinion">رأي</option>
                  <option value="report">تقرير</option>
                </select>
              </div>

              <div className="admin-articles-span">
                <AdminMediaInput
                  label="الصورة"
                  type="image"
                  file={selectedFile}
                  setFile={setSelectedFile}
                  value={form.image}
                  onValueChange={(val) => updateField('image', val)}
                  hint="JPG, PNG, WebP"
                />
              </div>

              <div className="admin-articles-span admin-articles-dynamic-card">
                <div className="admin-articles-section-header">
                  <label className="admin-articles-label">الفيديوهات</label>
                  <button type="button" className="btn-outline" onClick={addVideo}>+ إضافة فيديو</button>
                </div>
                <div className="admin-articles-stack">
                  {form.videoUrls.map((video, index) => (
                    <div key={`video-${index}`} className="admin-articles-inline-row">
                      <input
                        className="admin-articles-input"
                        value={video.url}
                        onChange={(e) => updateVideo(index, e.target.value)}
                        placeholder="https://youtube.com/... أو رابط فيديو مباشر"
                      />
                      <button type="button" className="admin-articles-btn admin-articles-btn-delete" onClick={() => removeVideo(index)}>حذف</button>
                    </div>
                  ))}
                </div>
                <div className="admin-articles-upload-block">
                  <AdminMediaInput
                    label="تحميل فيديو رئيسي"
                    type="video"
                    file={selectedVideoFile}
                    setFile={setSelectedVideoFile}
                    value=""
                    onValueChange={() => {}}
                    hint="MP4, WebM, Ogg"
                  />
                </div>
              </div>

              <div className="admin-articles-span admin-articles-dynamic-card">
                <div className="admin-articles-section-header">
                  <label className="admin-articles-label">الأقسام القابلة للإضافة</label>
                  <button type="button" className="btn-outline" onClick={addSection}>+ إضافة قسم</button>
                </div>

                {form.customSections.map((section, index) => (
                  <div key={`section-${index}`} className="admin-articles-section-card">
                    <div className="admin-articles-dynamic-top">
                      <strong className="admin-articles-dynamic-index">قسم {index + 1}</strong>
                      <button type="button" className="admin-articles-btn admin-articles-btn-delete" onClick={() => removeSection(index)}>حذف القسم</button>
                    </div>

                    <div className="admin-articles-form-grid">
                      <div className="admin-articles-span">
                        <label className="admin-articles-label">عنوان القسم</label>
                        <input className="admin-articles-input" value={section.title} onChange={(e) => updateSection(index, 'title', e.target.value)} />
                      </div>

                      <div>
                        <label className="admin-articles-label">لون العنوان</label>
                        <div className="admin-articles-color-row">
                          <input className="admin-articles-color-input" type="color" value={section.titleColor} onChange={(e) => updateSection(index, 'titleColor', e.target.value)} />
                          <input className="admin-articles-input" value={section.titleColor} onChange={(e) => updateSection(index, 'titleColor', e.target.value)} />
                        </div>
                      </div>

                      <div>
                        <label className="admin-articles-label">حجم الخط</label>
                        <input className="admin-articles-input" type="number" min="16" max="72" value={section.titleFontSize} onChange={(e) => updateSection(index, 'titleFontSize', e.target.value)} />
                      </div>

                      <div className="admin-articles-span">
                        <label className="admin-articles-label">نوع الخط</label>
                        <select className="admin-articles-input" value={section.titleFontFamily} onChange={(e) => updateSection(index, 'titleFontFamily', e.target.value)}>
                          {fontOptions.map((font) => (
                            <option key={font.value} value={font.value}>{font.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-articles-span admin-articles-preview-title-wrap">
                        <label className="admin-articles-label">معاينة العنوان</label>
                        <div className="admin-articles-preview-title" style={{ color: section.titleColor || '#CC0000', fontSize: `${Number(section.titleFontSize) || 28}px`, fontFamily: section.titleFontFamily || 'Arial, sans-serif' }}>
                          {section.title || 'عنوان القسم'}
                        </div>
                      </div>

                      <div className="admin-articles-span">
                        <label className="admin-articles-label">محتوى القسم</label>
                        <textarea className="admin-articles-input admin-articles-textarea" value={section.body} onChange={(e) => updateSection(index, 'body', e.target.value)} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-articles-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'نشر'}</button>
              <button type="button" onClick={reset} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-articles-table-card">
        <table className="admin-articles-table">
          <thead>
            <tr className="admin-articles-table-head">
              {['الصورة', 'العنوان', 'النوع', 'القراءات', 'الفيديوهات', 'الأقسام', 'التاريخ', 'الإجراءات'].map((h) => (
                <th key={h} className="admin-articles-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a._id} className="admin-articles-tr">
                <td className="admin-articles-td"><img src={getFullImageUrl(a.image) || `https://picsum.photos/seed/${a._id}/70/44`} alt="" className="admin-articles-thumb" /></td>
                <td className="admin-articles-td admin-articles-title-cell"><div className="admin-articles-ellipsis">{a.titleAr}</div></td>
                <td className="admin-articles-td"><span className="badge admin-articles-badge" style={{ background: a.type === 'analysis' ? '#1a73e8' : a.type === 'opinion' ? '#e8a01a' : '#1aae6f' }}>{a.type === 'analysis' ? 'تحليل' : a.type === 'opinion' ? 'رأي' : 'تقرير'}</span></td>
                <td className="admin-articles-td admin-articles-muted">👁 {a.views}</td>
                <td className="admin-articles-td">{(a.videoUrls?.length || (a.videoUrl ? 1 : 0))}</td>
                <td className="admin-articles-td">{a.customSections?.length || 0}</td>
                <td className="admin-articles-td admin-articles-date">{formatDate(a.createdAt)}</td>
                <td className="admin-articles-td">
                  <div className="admin-articles-actions">
                    <button onClick={() => handleEdit(a)} className="admin-articles-btn admin-articles-btn-edit">تعديل</button>
                    <button onClick={() => handleDelete(a._id)} className="admin-articles-btn admin-articles-btn-delete">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-articles-cards">
        {articles.map((a) => (
          <div key={a._id} className="admin-articles-card">
            <div className="admin-articles-card-head">
              <img src={getFullImageUrl(a.image) || `https://picsum.photos/seed/${a._id}/120/80`} alt="" className="admin-articles-card-thumb" />
              <div className="admin-articles-card-info">
                <div className="admin-articles-card-title">{a.titleAr}</div>
                <div className="admin-articles-card-meta">
                  <span className="badge admin-articles-badge" style={{ background: a.type === 'analysis' ? '#1a73e8' : a.type === 'opinion' ? '#e8a01a' : '#1aae6f' }}>{a.type === 'analysis' ? 'تحليل' : a.type === 'opinion' ? 'رأي' : 'تقرير'}</span>
                  <span className="admin-articles-muted">👁 {a.views}</span>
                  <span className="admin-articles-date">{formatDate(a.createdAt)}</span>
                </div>
              </div>
            </div>
            <div className="admin-articles-card-actions">
              <button onClick={() => handleEdit(a)} className="admin-articles-btn admin-articles-btn-edit">تعديل</button>
              <button onClick={() => handleDelete(a._id)} className="admin-articles-btn admin-articles-btn-delete">حذف</button>
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

export default AdminArticles;
