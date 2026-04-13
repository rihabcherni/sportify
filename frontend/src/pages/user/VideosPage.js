import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './VideosPage.css';

const VideosPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialCategory = searchParams.get('category') || '';
  const initialPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const initialPageSize = parseInt(searchParams.get('limit') || '3', 10);
  const [videos, setVideos] = useState([]);
  const [category, setCategory] = useState(initialCategory);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState([3, 6, 9, 12].includes(initialPageSize) ? initialPageSize : 3);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  const cats = [{ val: '', label: 'الكل' }, { val: 'highlights', label: 'ملخصات' }, { val: 'interviews', label: 'مقابلات' }, { val: 'analysis', label: 'تحليلات' }];
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

  useEffect(() => {
    setLoading(true);
    axios.get(`/api/videos?page=${page}&limit=${pageSize}${category ? `&category=${category}` : ''}`)
      .then(r => { setVideos(r.data.videos); setTotalPages(r.data.pages || 1); hasLoaded.current = true; })
      .finally(() => setLoading(false));
  }, [page, category, pageSize]);

  useEffect(() => {
    if (hasLoaded.current && page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    const params = { page: String(page), limit: String(pageSize) };
    if (category) params.category = category;
    setSearchParams(params, { replace: true });
  }, [page, pageSize, category, setSearchParams]);

  return (
    <div className="container videos-page">
      <h1 className="section-title">فيديوهات</h1>
      <div className="videos-filters">
        {cats.map(c => (
          <button key={c.val} onClick={() => { setCategory(c.val); setPage(1); }}
            className={`videos-filter-btn${category === c.val ? ' is-active' : ''}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="videos-page-controls">
        <span className="videos-page-info">عدد العناصر:</span>
        <select
          className="videos-page-select"
          value={pageSize}
          onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
        >
          {pageSizes.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="videos-page-info">صفحة {page} من {totalPages}</span>
      </div>
      {loading ? (
        <div className="videos-loading">⏳ جار التحميل...</div>
      ) : (
        <>
          <div className="grid-3 videos-grid">
            {videos.map(v => (
              <Link key={v._id} to={`/videos/${v._id}${location.search}`} className="videos-card-link">
                <div className="card">
                  <div className="videos-thumb">
                    <img src={v.thumbnail ? getFullImageUrl(v.thumbnail) : '/images/placeholder.png'} alt="" className="videos-thumb-img" />
                    <div className="videos-thumb-overlay">
                      <div className="videos-play">▶</div>
                    </div>
                    <span className="videos-category">{v.category}</span>
                  </div>
                  <div className="videos-card-body">
                    <h3 className="videos-card-title">{v.titleAr}</h3>
                    <p className="videos-card-views">👁 {v.views} مشاهدة</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="videos-pagination">
            <button
              className="videos-page-btn"
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
                  className={`videos-page-btn${page === p ? ' is-active' : ''}`}>
                  {p}
                </button>
              ) : (
                <span key={`dots-${idx}`} className="videos-page-ellipsis">{p}</span>
              )
            ))}
            <button
              className="videos-page-btn"
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
            >
              التالي
              <svg className="pagination-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideosPage;
