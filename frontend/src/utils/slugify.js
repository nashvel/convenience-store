const slugify = (text) => {
  if (typeof text !== 'string') {
    return '';
  }
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')       // Replace spaces with -
    .replace(/&/g, '-and-')   // Replace & with 'and'
    .replace(/[^฀-๿\w-]+/g, '') // Remove all non-word chars except Thai characters
    .replace(/--+/g, '-');      // Replace multiple - with single -
};

export default slugify;
