import { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getEmbedUrl, isDirectVideo } from '../../utils/videoUtils';
import { getFullImageUrl } from '../../utils/imageUtils';
import './NewsDetail.css';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });
const categoryLabels = {
  football: 'كرة القدم',
  basketball: 'كرة السلة',
  tennis: 'التنس',
  local: 'محلي',
  international: 'دولي',
  other: 'أخرى'
};

const NewsDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [news, setNews] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    axios.get(`/api/news/${id}`).then(r => {
      setNews(r.data);
      const viewKey = `news_viewed_${id}`;
      if (!localStorage.getItem(viewKey)) {
        localStorage.setItem(viewKey, '1');
        axios.post(`/api/news/${id}/view`)
          .then(res => {
            if (res.data && typeof res.data.views === 'number') {
              setNews(prev => prev ? { ...prev, views: res.data.views } : prev);
            }
          })
          .catch(() => {});
      }
      axios.get(`/api/news?category=${r.data.category}&limit=4`).then(res => setRelated(res.data.news.filter(n => n._id !== id)));
    });
  }, [id]);

  if (!news) return <div className="news-detail-loading">⏳ جار التحميل...</div>;

  return (
    <div className="container news-detail">
      <div className="news-detail-grid">
        <article>
          <Link to={`/news${location.search || ''}`} className="news-detail-back">العودة للأخبار ←</Link>
          <span className="badge badge-red news-detail-badge">
            {categoryLabels[news.category] || news.category}
          </span>
          <h1 className="news-detail-title">{news.titleAr}</h1>
          <div className="news-detail-meta">
            <span>✍ {news.author?.name}</span>
            <span>📅 {formatDate(news.createdAt)}</span>
            <span>👁 {news.views} مشاهدة</span>
          </div>
          {news.image && <img src={getFullImageUrl(news.image)} alt="" className="news-detail-image" />}
          
          {news.videoUrl && (
            <div className="news-detail-video-wrapper">
              {getEmbedUrl(news.videoUrl) ? (
                <div className="video-responsive">
                  <iframe
                    src={getEmbedUrl(news.videoUrl)}
                    title="Video"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : isDirectVideo(news.videoUrl) ? (
                <video controls className="news-detail-direct-video">
                  <source src={news.videoUrl} type={`video/${news.videoUrl.split('.').pop()}`} />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <div className="news-detail-video-link">
                  <a href={news.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-red">
                    مشاهدة الفيديو المصاحب 📺
                  </a>
                </div>
              )}
            </div>
          )}

          <div className="news-detail-content">{news.contentAr}</div>
        </article>
        <aside>
          <h3 className="news-detail-aside-title">أخبار ذات صلة</h3>
          {related.slice(0, 4).map(n => (
            <Link key={n._id} to={`/news/${n._id}`} className="news-detail-related-link">
              <div className="news-detail-related-card">
                <img src={getFullImageUrl(n.image) || `https://picsum.photos/seed/${n._id}/80/50`} alt="" className="news-detail-related-img" />
                <div>
                  <p className="news-detail-related-title">{n.titleAr}</p>
                  <p className="news-detail-related-date">{formatDate(n.createdAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default NewsDetail;
