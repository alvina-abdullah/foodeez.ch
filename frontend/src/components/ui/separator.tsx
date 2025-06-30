import React from 'react';

const Separator = () => {
  return (
    <div className="relative my-12 w-full">
      <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-yellow-500 rounded-full shadow-lg blur-[1px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-6 text-xl font-bold text-gray-800 dark:bg-background dark:text-white">
        • • •
      </div>
    </div>
  );
};

export default Separator;
