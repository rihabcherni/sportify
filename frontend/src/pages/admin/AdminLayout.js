import { Link, Outlet, useLocation, Navigate, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminLayout.css';

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (loading) return <div className="admin-loading">⏳ جار التحميل...</div>;
  if (!user || user.role !== 'admin') return <Navigate to="/login" />;

  const navItems = [
    { to: '/admin', icon: '📊', label: 'لوحة التحكم', exact: true },
    { to: '/admin/news', icon: '📰', label: 'الأخبار' },
    { to: '/admin/matches', icon: '⚽', label: 'المباريات' },
    { to: '/admin/videos', icon: '🎥', label: 'الفيديوهات' },
    { to: '/admin/stars', icon: '⭐', label: 'النجوم' },
    { to: '/admin/articles', icon: '✍', label: 'المقالات' },
    { to: '/admin/users', icon: '👥', label: 'المستخدمون' },
    { to: '/admin/feedback', icon: '💬', label: 'آراء المستخدمين' },
    { to: '/admin/profile', icon: '👤', label: 'الملف الشخصي' },
  ];

  return (
    <div className={`admin-layout${sidebarOpen ? ' is-open' : ''}`}>
      <button
        className="admin-sidebar-toggle"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        <span />
        <span />
        <span />
      </button>
      {sidebarOpen && (
        <button
          className="admin-sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close sidebar"
        />
      )}
      {/* Sidebar */}
      <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}>
        <div className="admin-sidebar-header">
          <Link to="/" className="admin-sidebar-brand">
            <img src="/images/logo.jpg" alt="Logo" className="admin-sidebar-logo" />
            <span className="admin-sidebar-title">لوحة الإدارة</span>
          </Link>
        </div>
        <nav className="admin-sidebar-nav">
          {navItems.map(item => {
            const isActive = item.exact ? pathname === item.to : pathname.startsWith(item.to) && item.to !== '/admin';
            const exactActive = item.exact && pathname === '/admin';
            const active = isActive || exactActive;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`admin-sidebar-link${active ? ' is-active' : ''}`}
                onClick={() => setSidebarOpen(false)}
              >
                <span className="admin-sidebar-icon">{item.icon}</span>
                <span className="admin-sidebar-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="admin-sidebar-footer">
          <Link to="/" className="admin-sidebar-back" onClick={() => setSidebarOpen(false)}>العودة للموقع ←</Link>
          <button
            type="button"
            className="admin-sidebar-logout"
            onClick={() => { logout(); setSidebarOpen(false); navigate('/login'); }}
          >
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
