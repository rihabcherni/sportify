import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import './ArticlesPage.css';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

const ArticlesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();
  const initialType = searchParams.get('type') || '';
  const initialPage = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const initialPageSize = parseInt(searchParams.get('limit') || '3', 10);
  const [articles, setArticles] = useState([]);
  const [type, setType] = useState(initialType);
  const [page, setPage] = useState(initialPage);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState([3, 6, 9, 12].includes(initialPageSize) ? initialPageSize : 3);
  const [loading, setLoading] = useState(true);
  const hasLoaded = useRef(false);

  const types = [{ val: '', label: 'الكل' }, { val: 'analysis', label: 'تحليلات' }, { val: 'opinion', label: 'آراء' }, { val: 'report', label: 'تقارير' }];
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
    axios.get(`/api/articles?page=${page}&limit=${pageSize}${type ? `&type=${type}` : ''}`)
      .then(r => { setArticles(r.data.articles); setTotalPages(r.data.pages || 1); hasLoaded.current = true; })
      .finally(() => setLoading(false));
  }, [page, type, pageSize]);

  useEffect(() => {
    if (hasLoaded.current && page > totalPages) setPage(totalPages);
  }, [totalPages, page]);

  useEffect(() => {
    const params = { page: String(page), limit: String(pageSize) };
    if (type) params.type = type;
    setSearchParams(params, { replace: true });
  }, [page, pageSize, type, setSearchParams]);

  return (
    <div className="container articles-page">
      <h1 className="section-title">مقالات و تحليلات</h1>
      <div className="articles-filters">
        {types.map(t => (
          <button key={t.val} onClick={() => { setType(t.val); setPage(1); }}
            className={`articles-filter-btn${type === t.val ? ' is-active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="articles-page-controls">
        <span className="articles-page-info">عدد العناصر:</span>
        <select
          className="articles-page-select"
          value={pageSize}
          onChange={(e) => { setPage(1); setPageSize(Number(e.target.value)); }}
        >
          {pageSizes.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
        <span className="articles-page-info">صفحة {page} من {totalPages}</span>
      </div>
      {loading ? <div className="articles-loading">⏳ جار التحميل...</div> : (
        <>
          <div className="grid-3 articles-grid">
            {articles.map(a => (
              <Link key={a._id} to={`/articles/${a._id}${location.search}`} className="articles-card-link">
                <div className="card">
                  <img src={a.image && a.image.length > 5 ? getFullImageUrl(a.image) : '/images/placeholder.png'} alt="" className="articles-card-img" />
                  <div className="articles-card-body">
                    <div className="articles-card-meta">
                      <span className={`badge articles-card-badge articles-card-badge-${a.type}`}>
                        {a.type === 'analysis' ? 'تحليل' : a.type === 'opinion' ? 'رأي' : 'تقرير'}
                      </span>
                      <span className="articles-card-date">{formatDate(a.createdAt)}</span>
                    </div>
                    <h3 className="articles-card-title">{a.titleAr}</h3>
                    <p className="articles-card-sub">✍ {a.author?.name} • 👁 {a.views}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          <div className="articles-pagination">
            <button
              className="articles-page-btn"
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
                  className={`articles-page-btn${page === p ? ' is-active' : ''}`}>
                  {p}
                </button>
              ) : (
                <span key={`dots-${idx}`} className="articles-page-ellipsis">{p}</span>
              )
            ))}
            <button
              className="articles-page-btn"
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

export default ArticlesPage;
