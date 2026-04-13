/**
 * Resolves an image path to a full URL.
 * Handles both legacy external URLs and new local uploads.
 */
export const getFullImageUrl = (imagePath) => {
  if (!imagePath) return '';

  // Base64/data URLs or blob URLs should be used as-is
  if (imagePath.startsWith('data:') || imagePath.startsWith('blob:')) {
    return imagePath;
  }

  // If it's already an external URL (http/https), return it
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  const backendUrl = process.env.REACT_APP_API_URL || '';

  // If it's an absolute path (e.g., /uploads/filename.jpg), prepend the backend URL
  if (imagePath.startsWith('/')) {
    return `${backendUrl}${imagePath}`;
  }

  // If it's a bare uploads path, normalize it
  if (imagePath.startsWith('uploads/')) {
    return `${backendUrl}/${imagePath}`;
  }

  // Any other value (emoji, label, etc.) is not a valid image URL
  return '';
};
