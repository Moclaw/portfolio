import React, { useState, useEffect } from 'react';
import { BallCanvas } from './';
import TechBallFallback from './TechBallFallback';
import BallErrorBoundary from './BallErrorBoundary';

const TechBallWrapper = ({ technology, index }) => {
  const [use3D, setUse3D] = useState(true);
  const [hasError, setHasError] = useState(false);

  // Reset error state when technology changes
  useEffect(() => {
    setHasError(false);
    setUse3D(true);
  }, [technology.id]);

  const handleError = () => {
    console.log(`3D ball failed for ${technology.name}, using fallback`);
    setHasError(true);
    setUse3D(false);
  };

  // If we've had an error or want to use fallback, show 2D version
  if (!use3D || hasError) {
    return (
      <TechBallFallback 
        name={technology.name} 
        icon={technology.icon}
        className="w-24 h-24"
      />
    );
  }

  // Try 3D version with error boundary
  return (
    <BallErrorBoundary 
      fallbackText={technology.name?.substring(0, 4)}
      onError={handleError}
    >
      <div className="w-24 h-24 relative">
        <BallCanvas icon={technology.icon} />
      </div>
    </BallErrorBoundary>
  );
};

export default TechBallWrapper;
