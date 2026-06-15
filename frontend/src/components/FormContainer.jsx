import React from 'react';

const FormContainer = ({ children }) => {
  return (
    <div className="flex justify-center">
      <div className="w-full max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;