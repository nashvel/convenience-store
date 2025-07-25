const slugify = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       
    .replace(/&/g, '-and-')     
    .replace(/[^฀-๿\w-]+/g, '')
    .replace(/--+/g, '-');     
};

export default slugify;
