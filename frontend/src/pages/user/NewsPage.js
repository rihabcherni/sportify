import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './NewsPage.css';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

const NewsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialCategory = searchParams.get('category') || '';
  const initialPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const initialPageSize = parseInt(searchParams.get('limit') || '3', 10);
  const [news, setNews] = useState([]);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState([3, 6, 9, 12].includes(initialPageSize) ? initialPageSize : 3);
  const [category, setCategory] = useState(initialCategory);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  const cats = [{ val: '', label: 'الكل' }, { val: 'football', label: 'كرة القدم' }, { val: 'basketball', label: 'كرة السلة' }, { val: 'tennis', label: 'التنس' }, { val: 'local', label: 'محلي' }, { val: 'international', label: 'دولي' }];
  const categoryLabels = cats.reduce((acc, c) => {
    if (c.val) acc[c.val] = c.label;
    return acc;
  }, {});
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
    axios.get(`/api/news?page=${page}&limit=${pageSize}${category ? `&category=${category}` : ''}`)
      .then(r => { setNews(r.data.news); setTotalPages(r.data.pages || 1); hasLoaded.current = true; })
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
    <div className="container news-page">
      <h1 className="section-title">آخر الأخبار</h1>
      <div className="news-filters">
        {cats.map(c => (
          <button key={c.val} onClick={() => { setCategory(c.val); setPage(1); }}
            className={`news-filter-btn${category === c.val ? ' is-active' : ''}`}>
            {c.label}
          </button>
        ))}
      </div>
      <div className="news-page-controls">
        <span className="news-page-info">عدد العناصر:</span>
        <select
          className="news-page-select"
          value={pageSize}
          onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
        >
          {pageSizes.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="news-page-info">صفحة {page} من {totalPages}</span>
      </div>
      {loading ? <div className="news-loading">⏳ جار التحميل...</div> : news.length === 0 ? (
        <div className="news-empty">
          لا توجد أخبار حالياً
        </div>
      ) : (
        <>
          <div className="grid-3 news-grid">
            {news.map(n => (
              <Link key={n._id} to={`/news/${n._id}${location.search}`} className="news-card-link">
                <div className="card">
                  <img src={n.image && n.image.length > 5 ? getFullImageUrl(n.image) : '/images/placeholder.png'} alt="" className="news-card-img" />
                  <div className="news-card-body">
                    <div className="news-card-meta">
                      <span className="badge badge-red news-card-badge">{categoryLabels[n.category] || n.category}</span>
                      <span className="news-card-date">{formatDate(n.createdAt)}</span>
                    </div>
                    <h3 className="news-card-title">{n.titleAr}</h3>
                    <p className="news-card-views">👁 {n.views} مشاهدة</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="news-pagination">
            <button
              className="news-page-btn"
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
                  className={`news-page-btn${page === p ? ' is-active' : ''}`}>
                  {p}
                </button>
              ) : (
                <span key={`dots-${idx}`} className="news-page-ellipsis">{p}</span>
              )
            ))}
            <button
              className="news-page-btn"
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

export default NewsPage;
