import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  getEmbedUrl,
  getFullVideoUrl,
  getYouTubeThumbnailUrl,
  getYouTubeWatchUrl,
  isDirectVideo,
} from '../../utils/videoUtils';
import { getFullImageUrl } from '../../utils/imageUtils';
import './StarDetail.css';

const sportLabels = {
  Football: 'كرة القدم',
  Tennis: 'التنس',
  Basketball: 'كرة السلة',
  Athletics: 'ألعاب القوى',
  Swimming: 'السباحة',
  Other: 'أخرى',
};

const statLabels = {
  goals: 'الأهداف',
  assists: 'التمريرات الحاسمة',
  matches: 'المباريات',
  rating: 'التقييم',
  caps: 'المشاركات',
  cleanSheets: 'شباك نظيفة',
  saves: 'التصديات',
  tackles: 'الافتكاكات',
  interceptions: 'الاعتراضات',
  ranking: 'الترتيب',
  titles: 'الألقاب',
  medals: 'الميداليات',
  golds: 'ميداليات ذهبية',
  events: 'السباقات',
  bestTime: 'أفضل توقيت',
};

const defaultSectionTitle = (index) => `المحور ${index + 1}`;

const splitParagraphs = (text = '') =>
  String(text)
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

const renderVideo = (videoUrl, index) => {
  const embedUrl = getEmbedUrl(videoUrl);
  const youtubeWatchUrl = getYouTubeWatchUrl(videoUrl);
  const youtubeThumbnailUrl = getYouTubeThumbnailUrl(videoUrl);

  if (youtubeWatchUrl) {
    return (
      <a
        href={youtubeWatchUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="star-detail-youtube-link"
      >
        <div className="star-detail-youtube-thumb">
          {youtubeThumbnailUrl ? (
            <img
              src={youtubeThumbnailUrl}
              alt={`Video ${index + 1}`}
              className="star-detail-youtube-image"
            />
          ) : (
            <div className="star-detail-youtube-fallback">YouTube</div>
          )}
          <div className="star-detail-youtube-play">▶</div>
        </div>
        <span className="star-detail-youtube-cta">فتح الفيديو على YouTube</span>
      </a>
    );
  }

  if (embedUrl) {
    return (
      <div className="video-responsive">
        <iframe
          src={embedUrl}
          title={`Video ${index + 1}`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    );
  }

  if (isDirectVideo(videoUrl)) {
    return (
      <video controls className="star-detail-direct-video">
        <source src={getFullVideoUrl(videoUrl)} type={`video/${videoUrl.split('.').pop()}`} />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <div className="star-detail-video-link">
      <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="btn-red">
        مشاهدة الفيديو {index + 1}
      </a>
    </div>
  );
};

const StarDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [star, setStar] = useState(null);

  useEffect(() => {
    axios.get(`/api/stars/${id}`).then((r) => setStar(r.data));
  }, [id]);

  if (!star) return <div className="star-detail-loading">⏳ جار التحميل...</div>;

  const customSections = Array.isArray(star.customSections)
    ? star.customSections.filter((section) => section?.title || section?.body)
    : [];
  const legacyBio = star.bioAr ? [{ title: 'السيرة الذاتية', body: star.bioAr }] : [];
  const sections = customSections.length ? customSections : legacyBio;
  const videoUrls = Array.isArray(star.videoUrls) && star.videoUrls.length
    ? star.videoUrls
    : (star.videoUrl ? [star.videoUrl] : []);

  const metaItems = [
    { label: 'الرياضة', value: sportLabels[star.sport] || 'أخرى' },
    { label: 'العمر', value: star.age ? String(star.age) : '' },
    { label: 'الجنسية', value: `${star.nationalityFlag ? `${star.nationalityFlag} ` : ''}${star.nationalityAr || ''}`.trim() },
    { label: 'النادي', value: star.clubAr || '' },
    { label: 'المركز', value: star.position || '' },
  ].filter((item) => item.value);

  return (
    <div className="container star-detail">
      <Link to={`/stars${location.search || ''}`} className="star-detail-back">العودة للنجوم ←</Link>

      <section className="star-detail-hero">
        <div className="star-detail-hero-copy">
          <span className="star-detail-kicker">{sportLabels[star.sport] || 'بورتريه رياضي'}</span>
          <h1 className="star-detail-title">{star.nameAr}</h1>
          <p className="star-detail-lead">
            {sections[0]?.body
              ? splitParagraphs(sections[0].body)[0]
              : 'بورتريه رياضي يجمع أبرز التفاصيل، المحطات، والمواد المصورة في صفحة واحدة.'}
          </p>

          {metaItems.length > 0 && (
            <div className="star-detail-meta-grid">
              {metaItems.map((item) => (
                <div key={item.label} className="star-detail-meta-card">
                  <span className="star-detail-meta-label">{item.label}</span>
                  <span className="star-detail-meta-value">{item.value}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="star-detail-hero-media">
          {star.image ? (
            <img src={getFullImageUrl(star.image)} alt={star.nameAr} className="star-detail-hero-image" />
          ) : (
            <div className="star-detail-hero-placeholder">صورة النجم</div>
          )}
        </div>
      </section>

      <div className="star-detail-layout">
        <article className="star-detail-article">
          {sections.map((section, index) => (
            <section key={`${section.title || 'section'}-${index}`} className="star-detail-section">
              <div className="star-detail-section-head">
                <span className="star-detail-section-count">{String(index + 1).padStart(2, '0')}</span>
                <h2
                  className="star-detail-section-title star-detail-section-title-custom"
                  style={{
                    color: section.titleColor || '#111111',
                    fontSize: `${Number(section.titleFontSize) || 28}px`,
                    fontFamily: section.titleFontFamily || 'Cairo, sans-serif',
                  }}
                >
                  {section.title || defaultSectionTitle(index)}
                </h2>
              </div>

              <div className="star-detail-section-body">
                {splitParagraphs(section.body).map((paragraph, paragraphIndex) => (
                  <p key={`${index}-${paragraphIndex}`} className="star-detail-paragraph">{paragraph}</p>
                ))}
              </div>
            </section>
          ))}

          {star.stats && Object.keys(star.stats).length > 0 && (
            <section className="star-detail-section">
              <div className="star-detail-section-head">
                <span className="star-detail-section-count">ST</span>
                <h2 className="star-detail-section-title">الإحصائيات</h2>
              </div>
              <div className="star-detail-stats">
                {Object.entries(star.stats).map(([key, val]) => (
                  <div key={key} className="star-detail-stat">
                    <div className="star-detail-stat-value">{val}</div>
                    <div className="star-detail-stat-key">{statLabels[key] || 'إحصائية'}</div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </article>

        <aside className="star-detail-sidebar">
          {videoUrls.length > 0 && (
            <section className="star-detail-side-card">
              <h3 className="star-detail-side-title">الفيديوهات</h3>
              <div className="star-detail-video-list">
                {videoUrls.map((videoUrl, index) => (
                  <div key={`${videoUrl}-${index}`} className="star-detail-video-wrapper">
                    {renderVideo(videoUrl, index)}
                  </div>
                ))}
              </div>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default StarDetail;

