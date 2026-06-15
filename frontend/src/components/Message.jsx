import React from 'react';

const Message = ({ variant = 'info', children }) => {
  // A mapping of variants to their corresponding Tailwind CSS classes
  const variantClasses = {
    danger: 'bg-red-100 border-red-400 text-red-700',
    success: 'bg-green-100 border-green-400 text-green-700',
    info: 'bg-blue-100 border-blue-400 text-blue-700',
    warning: 'bg-yellow-100 border-yellow-400 text-yellow-700',
  };

  // Base classes that apply to all message types
  const baseClasses = 'p-4 rounded-lg border';

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant] || variantClasses.info}`} 
      role="alert"
    >
      {children}
    </div>
  );
};

export default Message;