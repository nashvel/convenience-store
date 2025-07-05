const getAvatarUrl = (user) => {
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
  if (!user || !user.avatar) {
    const name = user ? user.name || `${user.first_name} ${user.last_name}` : 'U';
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
  }
  return `${API_URL}/${user.avatar}`.replace(/\\/g, '/');
};

export default getAvatarUrl;
