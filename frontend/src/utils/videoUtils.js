import { getFullImageUrl } from './imageUtils';

export const getFullVideoUrl = (videoPath) => getFullImageUrl(videoPath);

export const getYouTubeVideoId = (url = '') => {
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace('www.', '');

    if (host === 'youtu.be') {
      return parsed.pathname.replace('/', '').trim();
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v') || '';
      }
      if (parsed.pathname.startsWith('/embed/')) {
        return parsed.pathname.split('/embed/')[1].split('/')[0].trim();
      }
      if (parsed.pathname.startsWith('/shorts/')) {
        return parsed.pathname.split('/shorts/')[1].split('/')[0].trim();
      }
      if (parsed.pathname.startsWith('/live/')) {
        return parsed.pathname.split('/live/')[1].split('/')[0].trim();
      }
    }
  } catch (err) {
    return '';
  }

  return '';
};

export const getYouTubeEmbedUrl = (url = '') => {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1` : '';
};

export const getEmbedUrl = (url = '') => getYouTubeEmbedUrl(url);

export const getYouTubeWatchUrl = (url = '') => {
  const id = getYouTubeVideoId(url);
  return id ? `https://www.youtube.com/watch?v=${id}` : '';
};

export const getYouTubeThumbnailUrl = (url = '') => {
  const id = getYouTubeVideoId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
};

export const isDirectVideo = (url = '') => {
  if (!url) return false;
  if (url.startsWith('data:') || url.startsWith('blob:')) return true;
  if (url.startsWith('/uploads/') || url.startsWith('uploads/')) return true;
  const lower = url.toLowerCase();
  return ['.mp4', '.webm', '.ogg', '.mov', '.m4v'].some(ext => lower.includes(ext));
};
