import './AdminShared.css';

const AdminPageHeader = ({ title, subtitle, action }) => (
  <div className="admin-page-header">
    <div className="admin-page-header-text">
      <h1 className="admin-page-title">{title}</h1>
      {subtitle && <p className="admin-page-subtitle">{subtitle}</p>}
    </div>
    {action ? <div className="admin-page-header-action">{action}</div> : null}
  </div>
);

export default AdminPageHeader;
