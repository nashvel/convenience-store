import React from 'react';

const Loading = () => {
  return (
    <div className="flex justify-center items-center w-full h-full p-10">
      <div className="w-9 h-9 border-4 border-gray-200 border-l-primary rounded-full animate-spin"></div>
    </div>
  );
};

export default Loading;
