import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import { formatTimeAr } from '../../utils/timeUtils';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });
const categoryLabels = {
  football: 'كرة القدم',
  basketball: 'كرة السلة',
  tennis: 'التنس',
  local: 'محلي',
  international: 'دولي',
  other: 'أخرى'
};
const sportLabels = {
  Football: 'كرة القدم',
  Tennis: 'التنس',
  Basketball: 'كرة السلة',
  Athletics: 'ألعاب القوى',
  Swimming: 'السباحة',
  Other: 'أخرى'
};
const positionLabels = {
  'Attacking Midfielder': 'صانع ألعاب',
  'Defensive Midfielder': 'وسط دفاعي',
  'Central Midfielder': 'وسط مركزي',
  'Midfielder': 'وسط ميدان',
  'Center Back': 'قلب دفاع',
  'Right Back': 'ظهير أيمن',
  'Left Back': 'ظهير أيسر',
  'Striker': 'مهاجم',
  'Forward': 'مهاجم',
  'Goalkeeper': 'حارس مرمى',
  'Tennis Player': 'لاعب تنس',
  'Swimmer': 'سبّاح'
};

const TeamLogo = ({ logo, teamName }) => {
  const [imgError, setImgError] = useState(false);
  const src = logo ? getFullImageUrl(logo) : '';

  if (!src || imgError) return <span aria-label="logo">⚽</span>;

  return (
    <img
      src={src}
      alt={`${teamName || ''} logo`}
      className="home-match-logo-img"
      onError={() => setImgError(true)}
    />
  );
};

const Home = () => {
  const [news, setNews] = useState([]);
  const [matches, setMatches] = useState([]);
  const [videos, setVideos] = useState([]);
  const [stars, setStars] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    axios.get('/api/news?limit=6').then(r => setNews(r.data.news)).catch(() => { });
    axios.get('/api/matches/today').then(r => setMatches(r.data)).catch(() => { });
    axios.get('/api/videos?limit=4').then(r => setVideos(r.data.videos)).catch(() => { });
    axios.get('/api/stars?featured=true').then(r => setStars(r.data)).catch(() => { });
    axios.get('/api/matches/announcements').then(r => setAnnouncements(r.data)).catch(() => { });
  }, []);

  const featured = news.filter(n => n.featured).slice(0, 3);
  const restNews = news.filter(n => !n.featured).slice(0, 4);

  return (
    <div className='home-page'>
      {/* Hero Banner */}
      <div className="home-hero">
        <div className="container">
          <div className="home-hero-center">
            <div className="home-hero-logo-wrap">
              <img src="/images/logo.jpg" alt="Logo" className="home-hero-logo" />
            </div>
            <p className="home-hero-text">
              مصدرك الرئيسي لأحدث الأخبار والتغطيات الرياضية، مع متابعة مستمرة وتحليلات دقيقة
            </p>
          </div>
        </div>
      </div>

      <div className="container">
        {/* Featured News */}
        {featured.length > 0 && (
          <section className="home-section">
            <h2 className="section-title">أبرز الأخبار</h2>
            <div className={`featured-grid ${featured.length > 1 ? 'featured-grid-split' : 'featured-grid-single'}`}>
              {featured[0] && (
                <Link to={`/news/${featured[0]._id}`} className="featured-main">
                  <div className="card featured-main-card">
                    <img src={featured[0].image ? getFullImageUrl(featured[0].image) : '/images/placeholder.png'} alt="" className="featured-main-img" />
                    <div className="featured-main-overlay">
                      <span className="badge badge-red featured-main-badge">{categoryLabels[featured[0].category] || featured[0].category}</span>
                      <h3 className="featured-main-title">{featured[0].titleAr}</h3>
                      <p className="featured-main-meta">👁 {featured[0].views} • {formatDate(featured[0].createdAt)}</p>
                    </div>
                  </div>
                </Link>
              )}
              {featured.length > 1 && (
                <div className="featured-side">
                  {featured.slice(1, 3).map(n => (
                    <Link key={n._id} to={`/news/${n._id}`} className="featured-side-link">
                      <div className="card featured-side-card">
                        <img src={n.image ? getFullImageUrl(n.image) : '/images/placeholder.png'} alt="" className="featured-side-img" />
                        <div className="featured-side-overlay">
                          <h4 className="featured-side-title">{n.titleAr}</h4>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        {/* Today's Matches */}
        <section className="home-section">
          <div className="home-section-header">
            <h2 className="section-title home-section-title">مباريات اليوم</h2>
            <Link to="/matches" className="home-section-link" >عرض الكل ←</Link>
          </div>
          {matches.length + announcements.length === 0 ? (
            <div className="home-matches-empty">لا توجد مباريات اليوم</div>
          ) : (
            <div className="home-matches-grid">
              {announcements.map(a => (
                <Link key={a._id} to={`/matches/${a._id}`} className="home-match-link">
                  <div className="card home-match-card announcement-card">
                    <div className="home-match-announcement-body">
                      <h4 className="home-match-announcement-title">{a.title}</h4>
                    </div>
                    {a.announcementImage ? (
                      <div className="home-match-announcement-img-wrap">
                        <img src={getFullImageUrl(a.announcementImage)} alt={a.title} className="home-match-announcement-img" />
                      </div>
                    ) : null}
                  </div>
                </Link>
              ))}
              {matches.map(m => (
                <Link key={m._id} to={`/matches/${m._id}`} className="home-match-link">
                  <div className="card home-match-card">
                  <div className="home-match-top">
                    <span className="home-match-competition">{m.competition}</span>
                    {m.status === 'live' ? <span className="badge badge-live">🔴 مباشر</span> :
                      m.status === 'finished' ? <span className="badge home-match-finished">انتهت</span> :
                        <span className="home-match-time">{formatTimeAr(m.date)}</span>}
                  </div>
                  <div className="home-match-row">
                    <div className="home-match-team">
                      <div className="home-match-logo">
                        <TeamLogo logo={m.homeTeamLogo} teamName={m.homeTeam} />
                      </div>
                      <div className="home-match-name">{m.homeTeam}</div>
                    </div>
                    <div className="home-match-score">
                      {m.homeScore !== null && m.awayScore !== null ? (
                        <div className="home-match-score-value">{m.homeScore} - {m.awayScore}</div>
                      ) : <div className="home-match-vs">vs</div>}
                    </div>
                    <div className="home-match-team">
                      <div className="home-match-logo">
                        <TeamLogo logo={m.awayTeamLogo} teamName={m.awayTeam} />
                      </div>
                      <div className="home-match-name">{m.awayTeam}</div>
                    </div>
                  </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

        {/* Latest News Grid */}
        {restNews.length > 0 && (
          <section className="home-section">
            <div className="home-section-header">
              <h2 className="section-title home-section-title">آخر الأخبار</h2>
              <Link to="/news" className="home-section-link" >عرض الكل ←</Link>
            </div>
            <div className="grid-4">
              {restNews.map(n => (
                <Link key={n._id} to={`/news/${n._id}`} className="home-card-link">
                  <div className="card">
                    <img src={typeof n.image === 'string' && n.image.length > 5 ? getFullImageUrl(n.image) : '/images/placeholder.png'} alt="" className="home-card-img" />
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
          </section>
        )}

        {/* Videos Section */}
        {videos.length > 0 && (
          <section className="home-section">
            <div className="home-section-header">
              <h2 className="section-title home-section-title">فيديوهات</h2>
              <Link to="/videos" className="home-section-link" >عرض الكل ←</Link>
            </div>
            <div className="grid-4">
              {videos.map(v => (
                <Link key={v._id} to={`/videos/${v._id}`} className="home-card-link">
                  <div className="card">
                    <div className="home-video-thumb">
                      {v.thumbnail && <img src={getFullImageUrl(v.thumbnail)} alt="" className="home-video-img" />}
                      <div className="home-video-overlay">
                        <div className="home-video-play">▶</div>
                      </div>
                    </div>
                    <div className="home-video-body">
                      <h4 className="home-video-title">{v.titleAr}</h4>
                      <p className="home-video-views">👁 {v.views}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Stars */}
        {stars.length > 0 && (
          <section className="home-section">
            <div className="home-section-header">
              <h2 className="section-title home-section-title">نجوم</h2>
              <Link to="/stars" className="home-section-link" >عرض الكل ←</Link>
            </div>
            <div className="grid-4">
              {stars.map(s => (
                <Link key={s._id} to={`/stars/${s._id}`} className="home-card-link">
                  <div className="card home-star-card">
                    <img src={s.image ? getFullImageUrl(s.image) : '/images/placeholder.png'} alt="" className="home-star-img" />
                    <h4 className="home-star-name">{s.nameAr}</h4>
                    <p className="home-star-sport">{sportLabels[s.sport] || 'أخرى'}</p>
                    {s.position && <p className="home-star-position">{positionLabels[s.position] || s.position}</p>}
                    {s.age ? <p className="home-star-age">العمر: {s.age}</p> : null}
                    <p className="home-star-nationality">{`${s.nationalityFlag ? `${s.nationalityFlag} ` : ''}${s.nationalityAr || ''}`}</p>
                    {s.clubAr && <p className="home-star-club">{s.clubAr}</p>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;
