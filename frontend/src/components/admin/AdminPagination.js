import './AdminShared.css';

const AdminPagination = ({
  page,
  pages,
  pageSize,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 30]
}) => {
  const numbers = Array.from({ length: pages }, (_, i) => i + 1).slice(0, 7);

  return (
    <div className="admin-pagination">
      <div className="admin-pagination-size">
        <span>عدد الأسطر:</span>
        <select
          className="admin-page-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          {pageSizeOptions.map(n => (
            <option key={n} value={n}>{n}</option>
          ))}
        </select>
      </div>

      <span className="admin-page-info">صفحة {page} من {pages}</span>

      <button
        className="admin-page-btn"
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
      >
        <svg className="pagination-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 6l6 6-6 6" />
        </svg>
        السابق
      </button>

      <div className="admin-page-list">
        {numbers.map(n => (
          <button
            key={n}
            className={`admin-page-number${n === page ? ' is-active' : ''}`}
            onClick={() => onPageChange(n)}
          >
            {n}
          </button>
        ))}
        {pages > 7 && <span className="admin-page-ellipsis">…</span>}
      </div>

      <button
        className="admin-page-btn"
        onClick={() => onPageChange(Math.min(pages, page + 1))}
        disabled={page === pages}
      >
        التالي
        <svg className="pagination-icon" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
    </div>
  );
};

export default AdminPagination;
