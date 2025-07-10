import React from 'react';
import Home from '../../../pages/Navbar/Home';

const AppPreview = () => {
  return (
    <div className="border-y-4 border-dashed border-gray-300 overflow-hidden">
      <div className="p-4 bg-gray-100 text-center font-semibold text-gray-600">
        PREVIEW: HOMEPAGE CONTENT
      </div>
      <div className="pointer-events-none select-none opacity-75">
        <Home />
      </div>
    </div>
  );
};

export default AppPreview;
