import { useEffect, useState } from 'react';
import { Link, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';
import { getEmbedUrl, isDirectVideo, getFullVideoUrl } from '../../utils/videoUtils';
import { formatDateTimeAr } from '../../utils/timeUtils';
import { getFullImageUrl } from '../../utils/imageUtils';
import './MatchDetail.css';

const TeamLogo = ({ logo, teamName }) => {
  const [imgError, setImgError] = useState(false);
  const src = logo ? getFullImageUrl(logo) : '';
  if (!src || imgError) return <span className="match-detail-fallback">⚽</span>;
  return (
    <img
      src={src}
      alt={`${teamName || ''} logo`}
      className="match-detail-logo"
      onError={() => setImgError(true)}
    />
  );
};

const MatchDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [match, setMatch] = useState(null);
  const [isImageOpen, setIsImageOpen] = useState(false);

  useEffect(() => {
    axios.get(`/api/matches/${id}`).then(r => setMatch(r.data)).catch(() => setMatch(null));
  }, [id]);

  if (!match) return <div className="match-detail-loading">⏳ جار التحميل...</div>;

  return (
    <div className="container match-detail">
      <Link to={`/matches${location.search || ''}`} className="match-detail-back">العودة للمباريات ←</Link>
      {match.type === 'announcement' ? (
        <div className="match-detail-announcement">
          <article>
            <div className="match-detail-announcement-head">
              <span className="badge badge-announcement">إعلان</span>
              <h1 className="match-detail-announcement-title">{match.title}</h1>
            </div>
            {match.announcementImage && (
              <div className="match-detail-announcement-img-wrap">
                <img
                  src={getFullImageUrl(match.announcementImage)}
                  alt={match.title}
                  className="match-detail-announcement-img match-detail-clickable-img"
                  onClick={() => setIsImageOpen(true)}
                />
              </div>
            )}
            {isImageOpen && match.announcementImage && (
              <div className="image-modal" onClick={() => setIsImageOpen(false)}>
                <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
                  <img src={getFullImageUrl(match.announcementImage)} alt={match.title} className="image-modal-img" />
                </div>
              </div>
            )}
          </article>
        </div>
      ) : (
        <div className="match-detail-grid">
          <article>
            <div className="card match-detail-card">
              <div className="match-detail-top">
                <span className="match-detail-competition">{match.competition}</span>
                {match.status === 'live' && <span className="badge badge-live">🔴 مباشر</span>}
                {match.status === 'finished' && <span className="match-detail-status">انتهت</span>}
                {match.status === 'upcoming' && <span className="match-detail-status">قادمة</span>}
              </div>

              <div className="match-detail-row">
                <div className="match-detail-team">
                  <TeamLogo logo={match.homeTeamLogo} teamName={match.homeTeam} />
                  <div className="match-detail-name">{match.homeTeam}</div>
                </div>
                <div className="match-detail-score">
                  {match.homeScore !== null && match.awayScore !== null ? (
                    <div className="match-detail-score-value">{match.homeScore} - {match.awayScore}</div>
                  ) : (
                    <div className="match-detail-vs">VS</div>
                  )}
                </div>
                <div className="match-detail-team">
                  <TeamLogo logo={match.awayTeamLogo} teamName={match.awayTeam} />
                  <div className="match-detail-name">{match.awayTeam}</div>
                </div>
              </div>

              <div className="match-detail-meta">
                <span>📅 {formatDateTimeAr(match.date)}</span>
                {match.venue && <span>📍 {match.venue}</span>}
              </div>
            </div>

            {match.videoUrl && (
              <div className="card match-detail-video">
                <h3 className="match-detail-section-title">فيديو المباراة</h3>
                {getEmbedUrl(match.videoUrl) ? (
                  <div className="video-responsive">
                    <iframe
                      src={getEmbedUrl(match.videoUrl)}
                      title="Match video"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : isDirectVideo(match.videoUrl) ? (
                  <video controls className="match-detail-direct-video">
                    <source src={getFullVideoUrl(match.videoUrl)} type={`video/${match.videoUrl.split('.').pop()}`} />
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <a href={match.videoUrl} target="_blank" rel="noopener noreferrer" className="btn-red">
                    مشاهدة فيديو المباراة
                  </a>
                )}
              </div>
            )}
          </article>

          <aside>
            <h3 className="match-detail-aside-title">تفاصيل المباراة</h3>
            <div className="card match-detail-aside-card">
              <div className="match-detail-aside-row">
                <span className="match-detail-aside-label">المسابقة</span>
                <span className="match-detail-aside-value">{match.competition}</span>
              </div>
              <div className="match-detail-aside-row">
                <span className="match-detail-aside-label">الحالة</span>
                <span className="match-detail-aside-value">
                  {match.status === 'live' ? 'مباشر' : match.status === 'finished' ? 'انتهت' : 'قادمة'}
                </span>
              </div>
              <div className="match-detail-aside-row">
                <span className="match-detail-aside-label">الوقت</span>
                <span className="match-detail-aside-value">{formatDateTimeAr(match.date)}</span>
              </div>
              {match.venue && (
                <div className="match-detail-aside-row">
                  <span className="match-detail-aside-label">الملعب</span>
                  <span className="match-detail-aside-value">{match.venue}</span>
                </div>
              )}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
};

export default MatchDetail;
