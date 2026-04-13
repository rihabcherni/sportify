import { useEffect, useState } from 'react';
import './AdminShared.css';
import { getFullImageUrl } from '../../utils/imageUtils';
import { getFullVideoUrl, getYouTubeEmbedUrl } from '../../utils/videoUtils';

const AdminMediaInput = ({
  label,
  type = 'image',
  file,
  setFile,
  value,
  onValueChange,
  placeholder = 'https://...',
  required = false,
  hint,
}) => {
  const [preview, setPreview] = useState('');
  const isVideo = type === 'video';
  const accept = isVideo ? 'video/*' : 'image/*';
  const icon = isVideo ? 'Video' : 'Image';
  const uploadText = isVideo ? 'Upload video' : 'Upload image';
  const linkLabel = isVideo ? 'Video URL' : 'Image URL';

  useEffect(() => {
    if (!file) {
      setPreview('');
      return undefined;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleRemove = () => {
    if (setFile) setFile(null);
    if (onValueChange) onValueChange('');
  };

  return (
    <div>
      <label className="admin-media-label">{label} (Upload file)</label>
      <label className="admin-image-upload-box">
        <input
          type="file"
          className="admin-image-file-input"
          onChange={(e) => {
            if (setFile) setFile(e.target.files[0]);
            if (onValueChange) onValueChange('');
          }}
          accept={accept}
        />
        <span className="admin-image-upload-icon">{icon}</span>
        <span className="admin-image-upload-text">{uploadText}</span>
        {hint && <span className="admin-image-upload-hint">{hint}</span>}
      </label>

      <>
        <label className="admin-media-label" style={{ marginTop: '8px' }}>{linkLabel}</label>
        <input
          className="admin-media-input"
          value={value}
          onChange={(e) => {
            if (onValueChange) onValueChange(e.target.value);
            if (setFile) setFile(null);
          }}
          placeholder={placeholder}
          required={required && !file}
        />
      </>

      {(preview || value) && (
        <div className={isVideo ? 'admin-video-preview' : 'admin-image-preview'} style={{ marginTop: '8px' }}>
          {isVideo ? (
            preview ? (
              <video src={preview} controls />
            ) : getYouTubeEmbedUrl(value) ? (
              <iframe
                src={getYouTubeEmbedUrl(value)}
                title="Video preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <video src={getFullVideoUrl(value)} controls />
            )
          ) : (
            <img src={preview || getFullImageUrl(value)} alt="" />
          )}
          <button
            type="button"
            className="admin-image-remove"
            aria-label="Remove"
            onClick={handleRemove}
          >
            ×
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminMediaInput;
