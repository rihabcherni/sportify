import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="footer-container">
      <div className="footer-grid">
        <div>
          <div className="footer-logo">
            <img src="/images/logo.jpg" alt="Logo" className="footer-logo-img" />
          </div>
          <p className="footer-desc">
            مصدرك الرئيسي لأحدث الأخبار والتغطيات الرياضية، مع متابعة مستمرة وتحليلات دقيقة لأهم الأحداث المحلية والعالمية.
          </p>
        </div>
        <div className="footer-sections">
          <h4 className="footer-title">الأقسام</h4>
          <div className="footer-links">
            {[['آخر الأخبار', '/news'], ['مباريات اليوم', '/matches'], ['فيديوهات', '/videos'], ['نجوم', '/stars'], ['مقالات و تحليلات', '/articles']].map(([label, to]) => (
              <div key={to} className="footer-link-item">
                <Link to={to} className="footer-link">
                  {label}
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="footer-title">تواصل معنا</h4>
          <div className="footer-contact">
            <div className="footer-contact-item">
              <i className="fas fa-envelope footer-contact-icon"></i>
              <span>contact@sportify.tn</span>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-phone-alt footer-contact-icon"></i>
              <span dir="ltr" className="footer-ltr">+216 27601059</span>
            </div>
            <div className="footer-contact-item">
              <i className="fas fa-map-marker-alt footer-contact-icon"></i>
              <span>تونس العاصمة، تونس</span>
            </div>
          </div>
          <div className="footer-social">
            <span className="footer-social-item">
              <i className="fab fa-facebook footer-social-icon footer-social-facebook"></i> sportify.tn
            </span>
            <span className="footer-social-item">
              <i className="fab fa-instagram footer-social-icon footer-social-instagram"></i> sportify.tn
            </span>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        © 2026 Sportify.tn - جميع الحقوق محفوظة
      </div>
    </div>
  </footer>
);

export default Footer;
