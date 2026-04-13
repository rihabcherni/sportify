import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './AdminStars.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminMediaInput from '../../components/admin/AdminMediaInput';

const createSection = () => ({
  title: '',
  body: '',
  titleColor: '#CC0000',
  titleFontSize: 28,
  titleFontFamily: 'Cairo, sans-serif',
});

const createVideo = () => ({ url: '' });

const defaultForm = {
  nameAr: '',
  sport: 'Football',
  image: '',
  videoUrls: [createVideo()],
  customSections: [createSection()],
  featured: false,
};

const sportOptions = [
  { value: 'Football', label: 'كرة القدم' },
  { value: 'Tennis', label: 'التنس' },
  { value: 'Basketball', label: 'كرة السلة' },
  { value: 'Athletics', label: 'ألعاب القوى' },
  { value: 'Swimming', label: 'السباحة' },
  { value: 'Other', label: 'أخرى' },
];

const sportLabels = {
  Football: 'كرة القدم',
  Tennis: 'التنس',
  Basketball: 'كرة السلة',
  Athletics: 'ألعاب القوى',
  Swimming: 'السباحة',
  Other: 'أخرى',
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

const normalizeVideosForForm = (star) => {
  const urls = Array.isArray(star.videoUrls) && star.videoUrls.length
    ? star.videoUrls
    : (star.videoUrl ? [star.videoUrl] : []);

  return urls.length ? urls.map((url) => ({ url: url || '' })) : [createVideo()];
};

const AdminStars = () => {
  const [stars, setStars] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(4);
  const [total, setTotal] = useState(0);
  const [form, setForm] = useState(defaultForm);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);

  const fetch = () => axios.get(`/api/stars?limit=${pageSize}&page=${page}`).then((r) => {
    setStars(r.data.stars || []);
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
      ...defaultForm,
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
    setForm((prev) => ({
      ...prev,
      videoUrls: [...prev.videoUrls, createVideo()],
    }));
  };

  const removeVideo = (index) => {
    setForm((prev) => {
      const nextVideos = prev.videoUrls.filter((_, videoIndex) => videoIndex !== index);
      return {
        ...prev,
        videoUrls: nextVideos.length ? nextVideos : [createVideo()],
      };
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
    setForm((prev) => ({
      ...prev,
      customSections: [...prev.customSections, createSection()],
    }));
  };

  const removeSection = (index) => {
    setForm((prev) => {
      const nextSections = prev.customSections.filter((_, sectionIndex) => sectionIndex !== index);
      return {
        ...prev,
        customSections: nextSections.length ? nextSections : [createSection()],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const cleanedVideoUrls = form.videoUrls
      .map((item) => String(item.url || '').trim())
      .filter(Boolean);

    const formData = new FormData();
    formData.append('nameAr', form.nameAr);
    formData.append('sport', form.sport);
    formData.append('image', form.image);
    formData.append('featured', form.featured);
    formData.append('videoUrls', JSON.stringify(cleanedVideoUrls));
    formData.append('customSections', JSON.stringify(form.customSections));

    if (selectedFile) {
      formData.append('image', selectedFile);
    }

    if (selectedVideoFile) {
      formData.append('video', selectedVideoFile);
    }

    if (editing) {
      await axios.put(`/api/stars/${editing}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    } else {
      await axios.post('/api/stars', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    }

    reset();
    fetch();
  };

  const handleEdit = (star) => {
    setForm({
      nameAr: star.nameAr || '',
      sport: star.sport || 'Football',
      image: star.image || '',
      videoUrls: normalizeVideosForForm(star),
      customSections: star.customSections?.length
        ? star.customSections.map((section) => ({
          title: section.title || '',
          body: section.body || '',
          titleColor: section.titleColor || '#CC0000',
          titleFontSize: Number(section.titleFontSize) || 28,
          titleFontFamily: section.titleFontFamily || 'Cairo, sans-serif',
        }))
        : [createSection()],
      featured: Boolean(star.featured),
    });
    setSelectedFile(null);
    setSelectedVideoFile(null);
    setEditing(star._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('حذف النجم؟')) {
      await axios.delete(`/api/stars/${id}`);
      fetch();
    }
  };

  return (
    <div className="admin-stars">
      <AdminPageHeader
        title="إدارة النجوم"
        subtitle={`إجمالي: ${total} نجم`}
        action={<button onClick={() => { reset(); setShowForm(true); }} className="btn-red">+ إضافة نجم</button>}
      />

      {showForm && (
        <div className="admin-stars-form-card">
          <h3 className="admin-stars-form-title">{editing ? 'تعديل النجم' : 'إضافة نجم'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-stars-form-grid">
              <div className="admin-stars-span">
                <label className="admin-stars-label">العنوان الرئيسي *</label>
                <input
                  className="admin-stars-input"
                  value={form.nameAr}
                  onChange={(e) => updateField('nameAr', e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="admin-stars-label">الرياضة *</label>
                <select
                  className="admin-stars-input"
                  value={form.sport}
                  onChange={(e) => updateField('sport', e.target.value)}
                >
                  {sportOptions.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="admin-stars-check">
                <input
                  type="checkbox"
                  id="featured"
                  checked={form.featured}
                  onChange={(e) => updateField('featured', e.target.checked)}
                />
                <label htmlFor="featured" className="admin-stars-check-label">نجم مميز</label>
              </div>

              <div className="admin-stars-span">
                <AdminMediaInput
                  label="الصورة"
                  type="image"
                  file={selectedFile}
                  setFile={setSelectedFile}
                  value={form.image}
                  onValueChange={(value) => updateField('image', value)}
                  hint="JPG, PNG, WebP"
                />
              </div>

              <div className="admin-stars-span admin-stars-dynamic-card">
                <div className="admin-stars-section-header">
                  <label className="admin-stars-label">الفيديوهات</label>
                  <button type="button" className="btn-outline" onClick={addVideo}>+ إضافة فيديو</button>
                </div>

                <div className="admin-stars-stack">
                  {form.videoUrls.map((video, index) => (
                    <div key={`video-${index}`} className="admin-stars-inline-row">
                      <input
                        className="admin-stars-input"
                        value={video.url}
                        onChange={(e) => updateVideo(index, e.target.value)}
                        placeholder="https://youtube.com/... أو رابط فيديو مباشر"
                      />
                      <button
                        type="button"
                        className="admin-stars-btn admin-stars-btn-delete"
                        onClick={() => removeVideo(index)}
                      >
                        حذف
                      </button>
                    </div>
                  ))}
                </div>

                <div className="admin-stars-upload-block">
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

              <div className="admin-stars-span admin-stars-dynamic-card">
                <div className="admin-stars-section-header">
                  <label className="admin-stars-label">الأقسام القابلة للإضافة</label>
                  <button type="button" className="btn-outline" onClick={addSection}>+ إضافة قسم</button>
                </div>

                {form.customSections.map((section, index) => (
                  <div key={`section-${index}`} className="admin-stars-section-card">
                    <div className="admin-stars-dynamic-top">
                      <strong className="admin-stars-dynamic-index">قسم {index + 1}</strong>
                      <button
                        type="button"
                        className="admin-stars-btn admin-stars-btn-delete"
                        onClick={() => removeSection(index)}
                      >
                        حذف القسم
                      </button>
                    </div>

                    <div className="admin-stars-form-grid">
                      <div className="admin-stars-span">
                        <label className="admin-stars-label">عنوان القسم</label>
                        <input
                          className="admin-stars-input"
                          value={section.title}
                          onChange={(e) => updateSection(index, 'title', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="admin-stars-label">لون العنوان</label>
                        <div className="admin-stars-color-row">
                          <input
                            className="admin-stars-color-input"
                            type="color"
                            value={section.titleColor}
                            onChange={(e) => updateSection(index, 'titleColor', e.target.value)}
                          />
                          <input
                            className="admin-stars-input"
                            value={section.titleColor}
                            onChange={(e) => updateSection(index, 'titleColor', e.target.value)}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="admin-stars-label">حجم الخط</label>
                        <input
                          className="admin-stars-input"
                          type="number"
                          min="16"
                          max="72"
                          value={section.titleFontSize}
                          onChange={(e) => updateSection(index, 'titleFontSize', e.target.value)}
                        />
                      </div>

                      <div className="admin-stars-span">
                        <label className="admin-stars-label">نوع الخط</label>
                        <select
                          className="admin-stars-input"
                          value={section.titleFontFamily}
                          onChange={(e) => updateSection(index, 'titleFontFamily', e.target.value)}
                        >
                          {fontOptions.map((font) => (
                            <option key={font.value} value={font.value}>{font.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="admin-stars-span admin-stars-preview-title-wrap">
                        <label className="admin-stars-label">معاينة العنوان</label>
                        <div
                          className="admin-stars-preview-title"
                          style={{
                            color: section.titleColor || '#CC0000',
                            fontSize: `${Number(section.titleFontSize) || 28}px`,
                            fontFamily: section.titleFontFamily || 'Cairo, sans-serif',
                          }}
                        >
                          {section.title || 'عنوان القسم'}
                        </div>
                      </div>

                      <div className="admin-stars-span">
                        <label className="admin-stars-label">محتوى القسم</label>
                        <textarea
                          className="admin-stars-input admin-stars-textarea admin-stars-textarea-lg"
                          value={section.body}
                          onChange={(e) => updateSection(index, 'body', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="admin-stars-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'إضافة'}</button>
              <button type="button" onClick={reset} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}

      <div className="admin-stars-grid">
        {stars.map((star) => {
          const videoCount = Array.isArray(star.videoUrls) && star.videoUrls.length
            ? star.videoUrls.length
            : (star.videoUrl ? 1 : 0);

          return (
            <div key={star._id} className="admin-stars-card">
              <img
                src={getFullImageUrl(star.image) || `https://picsum.photos/seed/${star._id}/100/100`}
                alt=""
                className="admin-stars-avatar"
              />
              <h4 className="admin-stars-name">{star.nameAr}</h4>
              <p className="admin-stars-sport">{sportLabels[star.sport] || star.sport}</p>
              <p className="admin-stars-meta">الفيديوهات: {videoCount}</p>
              <p className="admin-stars-meta">الأقسام: {star.customSections?.length || 0}</p>
              <div className="admin-stars-actions">
                <button onClick={() => handleEdit(star)} className="admin-stars-btn admin-stars-btn-edit">تعديل</button>
                <button onClick={() => handleDelete(star._id)} className="admin-stars-btn admin-stars-btn-delete">حذف</button>
              </div>
            </div>
          );
        })}
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

export default AdminStars;
