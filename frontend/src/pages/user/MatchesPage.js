import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import { formatTimeAr } from '../../utils/timeUtils';
import './MatchesPage.css';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

const TeamLogo = ({ logo, teamName }) => {
  const [imgError, setImgError] = useState(false);
  const src = logo ? getFullImageUrl(logo) : '';

  if (!src || imgError) return <span aria-label="logo">⚽</span>;

  return (
    <img
      src={src}
      alt={`${teamName || ''} logo`}
      style={{ width: '32px', height: '32px', objectFit: 'cover', borderRadius: '50%' }}
      onError={() => setImgError(true)}
    />
  );
};

const MatchesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialStatus = searchParams.get('status') || '';
  const initialPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const initialPageSize = parseInt(searchParams.get('limit') || '3', 10);
  const [matches, setMatches] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [status, setStatus] = useState(initialStatus);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState([3, 6, 9, 12].includes(initialPageSize) ? initialPageSize : 3);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/matches?page=${page}&limit=${pageSize}${status ? `&status=${status}` : ''}`)
      .then(r => { setMatches(r.data.matches || []); setTotalPages(r.data.pages || 1); hasLoaded.current = true; })
      .finally(() => setLoading(false));
  }, [status, page, pageSize]);

  useEffect(() => {
    axios.get('/api/matches/announcements')
      .then(r => setAnnouncements(r.data || []))
      .catch(() => setAnnouncements([]));
  }, []);

  useEffect(() => {
    if (hasLoaded.current && page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    const params = { page: String(page), limit: String(pageSize) };
    if (status) params.status = status;
    setSearchParams(params, { replace: true });
  }, [page, pageSize, status, setSearchParams]);

  const statuses = [{ val: '', label: 'الكل' }, { val: 'live', label: '🔴 مباشر' }, { val: 'upcoming', label: '🕐 قادمة' }, { val: 'finished', label: '✅ منتهية' }];
  const pageSizes = [3, 6, 9, 12];

  const getPageItems = (current, total) => {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
    const delta = 2;
    const left = Math.max(1, current - delta);
    const right = Math.min(total, current + delta);
    const items = [];
    if (left > 1) {
      items.push(1);
      if (left > 2) items.push('…');
    }
    for (let i = left; i <= right; i += 1) items.push(i);
    if (right < total) {
      if (right < total - 1) items.push('…');
      items.push(total);
    }
    return items;
  };

  return (
    <div className="container matches-page">
      <h1 className="section-title">مباريات اليوم</h1>
      <div className="matches-filters">
        {statuses.map(s => (
          <button key={s.val} onClick={() => { setStatus(s.val); setPage(1); }}
            className={`matches-filter-btn${status === s.val ? ' is-active' : ''}`}>
            {s.label}
          </button>
        ))}
      </div>
      <div className="matches-page-controls">
        <span className="matches-page-info">عدد العناصر:</span>
        <select
          className="matches-page-select"
          value={pageSize}
          onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
        >
          {pageSizes.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="matches-page-info">صفحة {page} من {totalPages}</span>
      </div>
      {announcements.length > 0 && (
        <div className="matches-announcements-section">
          <div className="matches-list">
            {announcements.map(a => (
              <Link key={a._id} to={`/matches/${a._id}${location.search}`} className="matches-card-link">
                <div className="card matches-card announcement-card">
                  <div className="announcement-card-body">
                    <h4 className="announcement-card-title">{a.title}</h4>
                  </div>
                  {a.announcementImage && (
                    <div className="announcement-card-img-wrap">
                      <img src={getFullImageUrl(a.announcementImage)} alt={a.title} className="announcement-card-img" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
      {loading ? (
        <div className="matches-loading">⏳ جار التحميل...</div>
      ) : matches.length === 0 ? (
        <div className="matches-empty">
          <div className="matches-empty-icon">⚽</div>
          <p className="matches-empty-text">لا توجد مباريات</p>
        </div>
      ) : (
        <div className="matches-list">
          {matches.map(m => (
            <Link key={m._id} to={`/matches/${m._id}${location.search}`} className="matches-card-link">
              <div className="card matches-card">
              <div className="matches-card-top">
                <span className="matches-competition">{m.competition}</span>
                {m.status === 'live' && <span className="badge badge-live">🔴 مباشر الآن</span>}
                {m.status === 'finished' && <span className="matches-status-finished">انتهت المباراة</span>}
                {m.status === 'upcoming' && <span className="matches-status-upcoming">📅 {formatDate(m.date)} — {formatTimeAr(m.date)}</span>}
                {m.venue && <span className="matches-venue">📍 {m.venue}</span>}
              </div>
              <div className="matches-score-row">
                <div className="matches-team">
                  <div className="matches-team-logo">
                    <TeamLogo logo={m.homeTeamLogo} teamName={m.homeTeam} />
                  </div>
                  <div className="matches-team-name">{m.homeTeam}</div>
                </div>
                <div className="matches-score">
                  {m.homeScore !== null && m.awayScore !== null ? (
                    <div className="matches-score-value">{m.homeScore} - {m.awayScore}</div>
                  ) : (
                    <div className="matches-vs">VS</div>
                  )}
                  {m.status === 'upcoming' && <div className="matches-time">{formatTimeAr(m.date)}</div>}
                </div>
                <div className="matches-team">
                  <div className="matches-team-logo">
                    <TeamLogo logo={m.awayTeamLogo} teamName={m.awayTeam} />
                  </div>
                  <div className="matches-team-name">{m.awayTeam}</div>
                </div>
              </div>
              </div>
            </Link>
          ))}
        </div>
      )}
      <div className="matches-pagination">
        <button
          className="matches-page-btn"
          onClick={() => setPage(Math.max(1, page - 1))}
          disabled={page === 1}
        >
          <svg className="pagination-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M9 6l6 6-6 6" />
          </svg>
          السابق
        </button>
        {getPageItems(page, totalPages).map((p, idx) => (
          typeof p === 'number' ? (
            <button key={p} onClick={() => setPage(p)}
              className={`matches-page-btn${page === p ? ' is-active' : ''}`}>
              {p}
            </button>
          ) : (
            <span key={`dots-${idx}`} className="matches-page-ellipsis">{p}</span>
          )
        ))}
        <button
          className="matches-page-btn"
          onClick={() => setPage(Math.min(totalPages, page + 1))}
          disabled={page === totalPages}
        >
          التالي
          <svg className="pagination-icon" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default MatchesPage;
