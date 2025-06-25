import { useEffect, useState } from 'react';

const PageMeta = ({
  title,
  description,
}) => {
  useEffect(() => {
    document.title = title;
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', description);
    } else {
      const newMeta = document.createElement('meta');
      newMeta.setAttribute('name', 'description');
      newMeta.setAttribute('content', description);
      document.head.appendChild(newMeta);
    }
  }, [title, description]);

  return null;
};

export default PageMeta;
