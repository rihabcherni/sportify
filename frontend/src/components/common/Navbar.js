import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => { logout(); navigate('/'); };
  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar-header">
      <div className="container navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          <img src="/images/logo.jpg" alt="Logo" className="navbar-logo-img" />
        </Link>

        <button
          className="navbar-burger"
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          aria-controls="navbar-mobile-menu"
          type="button"
        >
          <span className="navbar-burger-line" />
          <span className="navbar-burger-line" />
          <span className="navbar-burger-line" />
        </button>

        {/* Nav Links */}
        <nav className="navbar-nav">
          {[
            { to: '/news', label: 'آخر الأخبار' },
            { to: '/matches', label: 'مباريات اليوم' },
            { to: '/videos', label: 'فيديوهات' },
            { to: '/stars', label: 'نجوم' },
            { to: '/articles', label: 'مقالات و تحليلات' },
            { to: '/feedback', label: 'آراؤكم' },
          ].map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `navbar-link${isActive ? ' is-active' : ''}`}
              onMouseEnter={e => { e.target.style.background = '#CC0000'; e.target.style.color = 'white'; }}
              onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#333'; }}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Auth */}
        <div className="navbar-auth">
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="navbar-btn navbar-admin" onClick={closeMenu}>لوحة التحكم</Link>}
              <Link to="/profile" className="navbar-btn navbar-btn-outline" onClick={closeMenu}>الملف الشخصي</Link>
              <span className="navbar-user">مرحباً، {user.name}</span>
              <button onClick={handleLogout} className="navbar-btn navbar-btn-outline">خروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-btn navbar-btn-outline" onClick={closeMenu}>دخول</Link>
              <Link to="/register" className="navbar-btn navbar-register" onClick={closeMenu}>تسجيل</Link>
            </>
          )}
        </div>
      </div>

      <div id="navbar-mobile-menu" className={`navbar-mobile ${menuOpen ? 'is-open' : ''}`}>
        <nav className="navbar-mobile-nav">
          {[
            { to: '/news', label: 'آخر الأخبار' },
            { to: '/matches', label: 'مباريات اليوم' },
            { to: '/videos', label: 'فيديوهات' },
            { to: '/stars', label: 'نجوم' },
            { to: '/articles', label: 'مقالات و تحليلات' },
            { to: '/feedback', label: 'آراؤكم' },
          ].map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `navbar-mobile-link${isActive ? ' is-active' : ''}`}
              onClick={closeMenu}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-mobile-auth">
          {user ? (
            <>
              {user.role === 'admin' && <Link to="/admin" className="navbar-mobile-btn primary" onClick={closeMenu}>لوحة التحكم</Link>}
              <Link to="/profile" className="navbar-mobile-btn outline" onClick={closeMenu}>الملف الشخصي</Link>
              <span className="navbar-mobile-user">مرحباً، {user.name}</span>
              <button onClick={() => { handleLogout(); closeMenu(); }} className="navbar-mobile-btn outline">خروج</button>
            </>
          ) : (
            <>
              <Link to="/login" className="navbar-mobile-btn outline" onClick={closeMenu}>دخول</Link>
              <Link to="/register" className="navbar-mobile-btn primary" onClick={closeMenu}>تسجيل</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
