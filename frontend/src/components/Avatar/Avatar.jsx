import React from 'react';

const Avatar = ({ user, className, textSize = 'text-base' }) => {
  const getInitials = (user) => {
    const name = user?.name || `${user?.first_name || ''} ${user?.last_name || ''}`.trim();
    if (!name) return '?';
    const words = name.split(' ').filter(Boolean);
    if (words.length === 0) return '?';
    // Take first char of first word, and first char of last word.
    if (words.length > 1) {
        return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }
    // If only one word, take first two chars.
    return words[0].substring(0, 2).toUpperCase();
  };

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  const avatarUrl = user?.avatar_url
    ? (user.avatar_url.startsWith('http') || user.avatar_url.startsWith('/'))
      ? user.avatar_url
      : `${API_URL}/${user.avatar_url}`
    : null;

  const stringToColor = (str) => {
    if (!str) return '#cccccc';
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
      hash = hash & hash; // Ensure 32bit integer
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xFF;
      color += ('00' + value.toString(16)).substr(-2);
    }
    return color;
  };
  
  const name = user?.name || `${user?.first_name} ${user?.last_name}`.trim();
  const bgColor = stringToColor(name);

  return (
    <>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className={className}
        />
      ) : (
        <div
          className={`${className} flex items-center justify-center text-white`}
          style={{ backgroundColor: bgColor }}
        >
          <span className={`font-bold ${textSize}`}>
            {getInitials(user)}
          </span>
        </div>
      )}
    </>
  );
};

export default Avatar;
