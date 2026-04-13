import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import { formatDateAr, formatTimeAr } from '../../utils/timeUtils';
import './AdminMatches.css';
import AdminPageHeader from '../../components/admin/AdminPageHeader';
import AdminPagination from '../../components/admin/AdminPagination';
import AdminMediaInput from '../../components/admin/AdminMediaInput';

const AdminMatches = () => {
  const [matches, setMatches] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [total, setTotal] = useState(0);
  const [formType, setFormType] = useState('match');
  const [showTypeChoice, setShowTypeChoice] = useState(false);
  const emptyForm = { homeTeam: '', awayTeam: '', homeTeamLogo: '', awayTeamLogo: '', date: '', competition: '', status: 'upcoming', homeScore: '', awayScore: '', venue: '', videoUrl: '', title: '', announcementImage: '' };
  const [form, setForm] = useState(emptyForm);
  const [homeFile, setHomeFile] = useState(null);
  const [awayFile, setAwayFile] = useState(null);
  const [selectedVideoFile, setSelectedVideoFile] = useState(null);
  const [announcementImageFile, setAnnouncementImageFile] = useState(null);

  const fetchMatches = async () => {
    const [matchResponse, announcementResponse] = await Promise.all([
      axios.get(`/api/matches?limit=${pageSize}&page=${page}`),
      axios.get('/api/matches/announcements')
    ]);

    const matchData = matchResponse.data.matches || [];
    const announcementData = announcementResponse.data || [];

    setAnnouncements(announcementData);
    setMatches([...announcementData, ...matchData]);
    setPages(matchResponse.data.pages || 1);
    setTotal((matchResponse.data.total || 0) + announcementData.length);
  };
  useEffect(() => { fetchMatches(); }, [page, pageSize]);

  useEffect(() => {
    if (page > pages) setPage(1);
  }, [pages, page]);

  const resetForm = () => { 
    setForm(emptyForm);
    setFormType('match');
    setHomeFile(null);
    setAwayFile(null);
    setSelectedVideoFile(null);
    setAnnouncementImageFile(null);
    setEditing(null); 
    setShowForm(false);
    setShowTypeChoice(false);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    
    // Pour les annonces, ajouter les champs requis avec des valeurs par défaut
    if (formType === 'announcement') {
      formData.append('type', 'announcement');
      formData.append('title', form.title);
      formData.append('homeTeam', '');
      formData.append('awayTeam', '');
      formData.append('competition', '');
      formData.append('date', '');
      if (announcementImageFile) formData.append('announcementImage', announcementImageFile);
      else formData.append('announcementImage', form.announcementImage);
    } else {
      // Pour les matches, envoyer tous les champs
      Object.keys(form).forEach(key => {
        formData.append(key, form[key]);
      });
      formData.append('type', 'match');
      if (homeFile) formData.append('homeTeamLogo', homeFile);
      if (awayFile) formData.append('awayTeamLogo', awayFile);
      if (selectedVideoFile) formData.append('video', selectedVideoFile);
    }

    if (editing) await axios.put(`/api/matches/${editing}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    else await axios.post('/api/matches', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
    
    resetForm(); fetchMatches();
  };
  const handleEdit = (m) => {
    setForm({
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      homeTeamLogo: m.homeTeamLogo || '',
      awayTeamLogo: m.awayTeamLogo || '',
      date: m.date ? m.date.slice(0, 16) : '',
      competition: m.competition,
      status: m.status,
      homeScore: m.homeScore ?? '',
      awayScore: m.awayScore ?? '',
      venue: m.venue || '',
      videoUrl: m.videoUrl || '',
      title: m.title || '',
      announcementImage: m.announcementImage || ''
    });
    setFormType(m.type || 'match');
    setHomeFile(null);
    setAwayFile(null);
    setSelectedVideoFile(null);
    setAnnouncementImageFile(null);
    setEditing(m._id);
    setShowTypeChoice(false);
    setShowForm(true);
  };
  const handleDelete = async (id) => { if (window.confirm('حذف المباراة؟')) { await axios.delete(`/api/matches/${id}`); fetchMatches(); } };

  return (
    <div className="admin-matches">
      <AdminPageHeader
        title="إدارة المباريات"
        subtitle={`إجمالي: ${total} مباراة`}
        action={<button onClick={() => { resetForm(); setShowTypeChoice(true); }} className="btn-red">+ إضافة مباراة</button>}
      />
      {showTypeChoice && (
        <div className="admin-matches-form-card">
          <h3 className="admin-matches-form-title">اختر النوع</h3>
          <div style={{display: 'flex', gap: '20px', justifyContent: 'center', paddingTop: '20px'}}>
            <button onClick={() => { setFormType('match'); setShowTypeChoice(false); setShowForm(true); }} className="btn-red" style={{flex: 1, padding: '12px 20px', fontSize: '16px'}}>مباراة</button>
            <button onClick={() => { setFormType('announcement'); setShowTypeChoice(false); setShowForm(true); }} className="btn-red" style={{flex: 1, padding: '12px 20px', fontSize: '16px'}}>إعلان</button>
            <button onClick={resetForm} className="btn-outline" style={{flex: 1, padding: '12px 20px', fontSize: '16px'}}>إلغاء</button>
          </div>
        </div>
      )}
      {showForm && (
        <div className="admin-matches-form-card">
          <h3 className="admin-matches-form-title">{editing ? 'تعديل مباراة' : 'إضافة مباراة'}</h3>
          <form onSubmit={handleSubmit}>
            <div className="admin-matches-form-grid">
              {formType === 'announcement' ? (
                <>
                  <div>
                    <label className="admin-matches-label">العنوان *</label>
                    <input className="admin-matches-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
                  </div>
                  <div>
                    <AdminMediaInput
                      label="الصورة"
                      type="image"
                      file={announcementImageFile}
                      setFile={setAnnouncementImageFile}
                      value={form.announcementImage}
                      onValueChange={(val) => setForm({ ...form, announcementImage: val })}
                      hint="PNG, JPG, WebP"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="admin-matches-label">الفريق المضيف *</label>
                    <input className="admin-matches-input" value={form.homeTeam} onChange={e => setForm({...form, homeTeam: e.target.value})} required />
                  </div>
                  <div>
                    <label className="admin-matches-label">الفريق الضيف *</label>
                    <input className="admin-matches-input" value={form.awayTeam} onChange={e => setForm({...form, awayTeam: e.target.value})} required />
                  </div>
                  <div>
                    <AdminMediaInput
                      label="شعار المضيف"
                      type="image"
                      file={homeFile}
                      setFile={setHomeFile}
                      value={form.homeTeamLogo}
                      onValueChange={(val) => setForm({ ...form, homeTeamLogo: val })}
                      hint="PNG, JPG, WebP"
                    />
                  </div>
                  <div>
                    <AdminMediaInput
                      label="شعار الضيف"
                      type="image"
                      file={awayFile}
                      setFile={setAwayFile}
                      value={form.awayTeamLogo}
                      onValueChange={(val) => setForm({ ...form, awayTeamLogo: val })}
                      hint="PNG, JPG, WebP"
                    />
                  </div>
                  <div>
                    <label className="admin-matches-label">المسابقة *</label>
                    <input className="admin-matches-input" value={form.competition} onChange={e => setForm({...form, competition: e.target.value})} required />
                  </div>
                  <div>
                    <label className="admin-matches-label">التاريخ والوقت *</label>
                    <input type="datetime-local" className="admin-matches-input" value={form.date} onChange={e => setForm({...form, date: e.target.value})} required />
                  </div>
                  <div>
                    <label className="admin-matches-label">الحالة</label>
                    <select className="admin-matches-input" value={form.status} onChange={e => setForm({...form, status: e.target.value})}>
                      <option value="upcoming">قادمة</option><option value="live">مباشر</option><option value="finished">انتهت</option>
                    </select>
                  </div>
                  <div>
                    <label className="admin-matches-label">الملعب</label>
                    <input className="admin-matches-input" value={form.venue} onChange={e => setForm({...form, venue: e.target.value})} />
                  </div>
                  <div>
                    <label className="admin-matches-label">نتيجة المضيف</label>
                    <input type="number" min="0" className="admin-matches-input" value={form.homeScore} onChange={e => setForm({...form, homeScore: e.target.value})} />
                  </div>
                  <div>
                    <label className="admin-matches-label">نتيجة الضيف</label>
                    <input type="number" min="0" className="admin-matches-input" value={form.awayScore} onChange={e => setForm({...form, awayScore: e.target.value})} />
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
                </>
              )}
            </div>
            <div className="admin-matches-form-actions">
              <button type="submit" className="btn-red">{editing ? 'حفظ' : 'إضافة'}</button>
              <button type="button" onClick={resetForm} className="btn-outline">إلغاء</button>
            </div>
          </form>
        </div>
      )}
      <div className="admin-matches-table-card">
        <table className="admin-matches-table">
          <thead>
            <tr className="admin-matches-table-head">
              {['النوع', 'المحتوى', 'التاريخ', 'الحالة', 'النتيجة', 'فيديو', 'الإجراءات'].map(h => (
                <th key={h} className="admin-matches-th">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {matches.map(m => (
              <tr key={m._id} className="admin-matches-tr">
                <td className="admin-matches-td">
                  <span className="badge" style={{ background: m.type === 'announcement' ? '#0099ff' : '#CC0000', padding: '4px 8px', borderRadius: '4px', color: 'white', fontSize: '12px' }}>
                    {m.type === 'announcement' ? 'إعلان' : 'مباراة'}
                  </span>
                </td>
                <td className="admin-matches-td admin-matches-strong">
                  {m.type === 'announcement' ? (
                    <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexDirection: m.announcementImage ? 'row' : 'column'}}>
                      {m.announcementImage && <img src={getFullImageUrl(m.announcementImage)} alt="" style={{width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover'}} />}
                      <span>{m.title}</span>
                    </div>
                  ) : (
                    `${m.homeTeam} vs ${m.awayTeam}`
                  )}
                </td>
                <td className="admin-matches-td admin-matches-date">
                  {m.date && (
                    <>
                      <div>{formatDateAr(m.date)}</div>
                      <div>{formatTimeAr(m.date)}</div>
                    </>
                  )}
                </td>
                <td className="admin-matches-td">
                  {m.type === 'match' && (
                    <span className="badge admin-matches-badge" style={{ background: m.status === 'live' ? '#00aa44' : m.status === 'finished' ? '#555' : '#CC0000' }}>
                      {m.status === 'live' ? 'مباشر' : m.status === 'finished' ? 'انتهت' : 'قادمة'}
                    </span>
                  )}
                </td>
                <td className="admin-matches-td admin-matches-score">
                  {m.type === 'match' && m.homeScore !== null && m.awayScore !== null ? `${m.homeScore} - ${m.awayScore}` : '—'}
                </td>
                <td className="admin-matches-td">{m.type === 'match' && m.videoUrl ? '📹' : '—'}</td>
                <td className="admin-matches-td">
                  <div className="admin-matches-actions">
                    <button onClick={() => handleEdit(m)} className="admin-matches-btn admin-matches-btn-edit">تعديل</button>
                    <button onClick={() => handleDelete(m._id)} className="admin-matches-btn admin-matches-btn-delete">حذف</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-matches-cards">
        {matches.map(m => (
          <div key={m._id} className="admin-matches-card">
            {m.type === 'announcement' ? (
              <>
                <div className="admin-matches-card-head">
                  <div className="admin-matches-card-title" style={{fontSize: '18px', fontWeight: 'bold'}}>
                    {m.title}
                  </div>
                </div>
                {m.announcementImage && (
                  <div style={{padding: '10px 0'}}>
                    <img src={getFullImageUrl(m.announcementImage)} alt="" style={{width: '100%', borderRadius: '4px', objectFit: 'cover', maxHeight: '300px'}} />
                  </div>
                )}
                <div className="admin-matches-card-actions">
                  <button onClick={() => handleEdit(m)} className="admin-matches-btn admin-matches-btn-edit">تعديل</button>
                  <button onClick={() => handleDelete(m._id)} className="admin-matches-btn admin-matches-btn-delete">حذف</button>
                </div>
              </>
            ) : (
              <>
                <div className="admin-matches-card-head">
                  <div className="admin-matches-card-title">
                    {m.homeTeamLogo && <img src={getFullImageUrl(m.homeTeamLogo)} alt="" style={{width: '20px', marginRight: '5px'}} />}
                    {m.homeTeam} vs {m.awayTeam}
                    {m.awayTeamLogo && <img src={getFullImageUrl(m.awayTeamLogo)} alt="" style={{width: '20px', marginLeft: '5px'}} />}
                  </div>
                  <span className="badge admin-matches-badge" style={{ background: m.status === 'live' ? '#00aa44' : m.status === 'finished' ? '#555' : '#CC0000' }}>
                    {m.status === 'live' ? 'مباشر' : m.status === 'finished' ? 'انتهت' : 'قادمة'}
                  </span>
                </div>
                <div className="admin-matches-card-meta">
                  <span className="admin-matches-muted">{m.competition}</span>
                  {m.date && <span className="admin-matches-date">{formatDateAr(m.date)} — {formatTimeAr(m.date)}</span>}
                  {m.videoUrl && <span className="admin-matches-video-badge">📹 فيديو</span>}
                  {m.homeScore !== null && m.awayScore !== null && <span className="admin-matches-score">{m.homeScore} - {m.awayScore}</span>}
                </div>
                <div className="admin-matches-card-actions">
                  <button onClick={() => handleEdit(m)} className="admin-matches-btn admin-matches-btn-edit">تعديل</button>
                  <button onClick={() => handleDelete(m._id)} className="admin-matches-btn admin-matches-btn-delete">حذف</button>
                </div>
              </>
            )}
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

export default AdminMatches;
