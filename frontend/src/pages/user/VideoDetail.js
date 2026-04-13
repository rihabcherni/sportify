import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { getFullImageUrl } from '../../utils/imageUtils';
import { getEmbedUrl, isDirectVideo } from '../../utils/videoUtils';
import './VideoDetail.css';

const VideoDetail = () => {
  const { id } = useParams();
  const location = useLocation();
  const [video, setVideo] = useState(null);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    axios.get(`/api/videos/${id}`).then(r => {
      setVideo(r.data);
      const viewKey = `video_viewed_${id}`;
      if (!localStorage.getItem(viewKey)) {
        localStorage.setItem(viewKey, '1');
        axios.post(`/api/videos/${id}/view`)
          .then(res => {
            if (res.data && typeof res.data.views === 'number') {
              setVideo(prev => prev ? { ...prev, views: res.data.views } : prev);
            }
          })
          .catch(() => {});
      }
      axios.get(`/api/videos?category=${r.data.category}&limit=5`).then(res =>
        setRelated(res.data.videos.filter(v => v._id !== id))
      );
    });
  }, [id]);

  if (!video) return <div className="video-detail-loading">⏳ جار التحميل...</div>;

  const embedUrl = getEmbedUrl(video.url);

  return (
    <div className="container video-detail">
      <Link to={`/videos${location.search || ''}`} className="video-detail-back">العودة للفيديوهات ←</Link>
      <div className="video-detail-grid">
        <div>
          <div className="video-detail-player">
            {embedUrl ? (
              <iframe src={embedUrl} className="video-detail-iframe" frameBorder="0" allowFullScreen title={video.titleAr} />
            ) : isDirectVideo(video.url) ? (
              <video controls className="video-detail-iframe">
                <source src={video.url} type={`video/${video.url.split('.').pop()}`} />
                Your browser does not support the video tag.
              </video>
            ) : (
              <a href={video.url} target="_blank" rel="noopener noreferrer" className="btn-red">فتح الفيديو</a>
            )}
          </div>
          <span className="badge badge-red video-detail-badge">{video.category}</span>
          <h1 className="video-detail-title">{video.titleAr}</h1>
          <p className="video-detail-meta">👁 {video.views} مشاهدة • ✍ {video.author?.name}</p>
          {video.descriptionAr && <p className="video-detail-desc">{video.descriptionAr}</p>}
        </div>
        <aside>
          <h3 className="video-detail-aside-title">فيديوهات ذات صلة</h3>
          {related.slice(0, 4).map(v => (
            <Link key={v._id} to={`/videos/${v._id}`} className="video-detail-related-link">
              <div className="video-detail-related-card">
                <div className="video-detail-related-thumb">
                  {v.thumbnail && <img src={getFullImageUrl(v.thumbnail)} alt="" className="video-detail-related-img" />}
                  <div className="video-detail-related-play">
                    <div className="video-detail-related-play-icon">▶</div>
                  </div>
                </div>
                <div>
                  <p className="video-detail-related-title">{v.titleAr}</p>
                  <p className="video-detail-related-views">👁 {v.views}</p>
                </div>
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default VideoDetail;
