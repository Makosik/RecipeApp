// SkeletonLoading.js
import React from 'react';
import '../style/LoadingIndicator.css';

const SkeletonLoading = ({ count }) => {
  return (
    <div className="skeleton-loading-container">
      {Array.from({ length: count }).map((_, index) => (
        <div className="skeleton-loading" key={index}></div>
      ))}
    </div>
  );
};

export default SkeletonLoading;
