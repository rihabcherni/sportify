import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getEmbedUrl, isDirectVideo } from '../../utils/videoUtils';
import { getFullImageUrl } from '../../utils/imageUtils';
import './ArticleDetail.css';

const formatDate = (d) => new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });

const splitParagraphs = (text = '') =>
  String(text)
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

const renderVideo = (videoUrl, index) => {
  if (getEmbedUrl(videoUrl)) {
    return (
      <div className="video-responsive">
        <iframe
          src={getEmbedUrl(videoUrl)}
          title={`Article Video ${index + 1}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  if (isDirectVideo(videoUrl)) {
    return (
      <video controls className="article-detail-direct-video">
        <source src={videoUrl} type={`video/${videoUrl.split('.').pop()}`} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div className="article-detail-video-link">
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="btn-red">
        مشاهدة الفيديو {index + 1}
      </a>
    </div>
  );
};

const ArticleDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    axios.get(`/api/articles/${id}`).then((r) => {
      setArticle(r.data);
      const viewKey = `article_viewed_${id}`;
      if (!localStorage.getItem(viewKey)) {
        localStorage.setItem(viewKey, '1');
        axios.post(`/api/articles/${id}/view`)
          .then((res) => {
            if (res.data && typeof res.data.views === 'number') {
              setArticle((prev) => (prev ? { ...prev, views: res.data.views } : prev));
            }
          })
          .catch(() => {});
      }
      axios.get(`/api/articles?type=${r.data.type}&limit=4`).then((res) =>
        setRelated((res.data.articles || []).filter((a) => a._id !== id)));
    });
  }, [id]);

  if (!article) return <div className="article-detail-loading">⏳ جار التحميل...</div>;

  const typeLabel = { analysis: 'تحليل', opinion: 'رأي', report: 'تقرير' };
  const customSections = Array.isArray(article.customSections)
    ? article.customSections.filter((section) => section?.title || section?.body)
    : [];
  const fallbackSections = article.contentAr ? [{ title: article.titleAr, body: article.contentAr }] : [];
  const sections = customSections.length ? customSections : fallbackSections;
  const videoUrls = Array.isArray(article.videoUrls) && article.videoUrls.length
    ? article.videoUrls
    : (article.videoUrl ? [article.videoUrl] : []);

  return (
    <div className="container article-detail">
      <Link to={`/articles${location.search || ''}`} className="article-detail-back">العودة للمقالات ←</Link>
      <div className="article-detail-grid">
        <article>
          <span className={`badge article-detail-badge article-detail-badge-${article.type}`}>{typeLabel[article.type]}</span>
          <h1 className="article-detail-title">{article.titleAr}</h1>
          <div className="article-detail-meta">
            <span>✍ {article.author?.name}</span>
            <span>📅 {formatDate(article.createdAt)}</span>
            <span>👁 {article.views} قراءة</span>
          </div>

          {article.image && <img src={getFullImageUrl(article.image)} alt={article.titleAr} className="article-detail-image" />}

          {sections.map((section, index) => (
            <section key={`${section.title || 'section'}-${index}`} className="article-detail-section">
              <h2
                className="article-detail-section-title"
                style={{
                  color: section.titleColor || '#111111',
                  fontSize: `${Number(section.titleFontSize) || 28}px`,
                  fontFamily: section.titleFontFamily || 'Arial, sans-serif',
                }}
              >
                {section.title || `القسم ${index + 1}`}
              </h2>
              <div className="article-detail-content">
                {splitParagraphs(section.body).map((paragraph, paragraphIndex) => (
                  <p key={`${index}-${paragraphIndex}`}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          {videoUrls.length > 0 && (
            <section className="article-detail-video-section">
              <h3 className="article-detail-aside-title">الفيديوهات</h3>
              <div className="article-detail-video-list">
                {videoUrls.map((videoUrl, index) => (
                  <div key={`${videoUrl}-${index}`} className="article-detail-video-wrapper">
                    {renderVideo(videoUrl, index)}
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside>
          <h3 className="article-detail-aside-title">مقالات ذات صلة</h3>
          {related.slice(0, 4).map((a) => (
            <Link key={a._id} to={`/articles/${a._id}`} className="article-detail-related-link">
              <div className="article-detail-related-card">
                <img src={getFullImageUrl(a.image) || `https://picsum.photos/seed/${a._id}/80/50`} alt="" className="article-detail-related-img" />
                <div>
                  <p className="article-detail-related-title">{a.titleAr}</p>
                  <p className="article-detail-related-date">{formatDate(a.createdAt)}</p>
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default ArticleDetail;
