const replaceMeridiem = (value) => {
  if (!value) return value;
  // Handle Arabic meridiem with possible RTL marks / non-breaking spaces.
  const spacer = '[\\s\\u00a0\\u200f\\u200e\\u202f\\u061c]*';
  const digit = '(?:\\d|\\p{N})';
  const tail = '(?=$|[\\s\\u00a0\\u200f\\u200e\\u202f\\u061c])';
  const amRegex = new RegExp(`(${digit})${spacer}ص${tail}`, 'gu');
  const pmRegex = new RegExp(`(${digit})${spacer}م${tail}`, 'gu');
  return value
    .replace(amRegex, '$1 صباحًا')
    .replace(pmRegex, '$1 مساءً')
    .replace(/\bAM\b/i, ' صباحًا')
    .replace(/\bPM\b/i, ' مساءً');
};

export const formatTimeAr = (d) => {
  const value = new Date(d).toLocaleTimeString('ar-TN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return replaceMeridiem(value);
};

export const formatDateTimeAr = (d) => {
  const value = new Date(d).toLocaleString('ar-TN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return replaceMeridiem(value);
};

export const formatDateAr = (d) =>
  new Date(d).toLocaleDateString('ar-TN', { year: 'numeric', month: 'long', day: 'numeric' });
