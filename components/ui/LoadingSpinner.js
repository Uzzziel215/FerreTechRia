import React from 'react';

const LoadingSpinner = ({ size = 'medium', text = 'Cargando...' }) => {
  const sizeClasses = {
    small: 'w-6 h-6 border-2',
    medium: 'w-12 h-12 border-4',
    large: 'w-24 h-24 border-8',
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className={`animate-spin rounded-full border-t-blue-500 border-r-blue-500 border-b-blue-500 border-l-white ${sizeClasses[size]}`}
      ></div>
      {text && <p className="mt-4 text-lg">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;