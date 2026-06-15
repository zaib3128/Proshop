import React from 'react';

const Loader = () => {
  return (
    // Flex container to center the loader
    <div className="flex justify-center items-center py-8">
      <div
        className="
          w-24 h-24 
          border-4 border-solid border-gray-200 
          border-t-gray-800 
          rounded-full 
          animate-spin"
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Loader;