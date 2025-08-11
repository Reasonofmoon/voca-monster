/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/
import React from 'react';

interface LoadingSkeletonProps {
  showText?: boolean;
  text?: string;
  type?: 'default' | 'vocabulary' | 'worksheet' | 'definition';
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  showText = false, 
  text = "Loading...", 
  type = 'default' 
}) => {
  const renderSkeletonBars = () => {
    switch (type) {
      case 'vocabulary':
        return (
          <>
            <div className="skeleton-bar" style={{ width: '100%', animationDelay: '0s' }}></div>
            <div className="skeleton-bar" style={{ width: '90%', animationDelay: '0.1s' }}></div>
            <div className="skeleton-bar" style={{ width: '85%', animationDelay: '0.2s' }}></div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', marginTop: '2rem' }}>
              {Array.from({ length: 6 }, (_, i) => (
                <div key={i} style={{ padding: '1rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)' }}>
                  <div className="skeleton-bar" style={{ width: '60%', height: '1.2rem', animationDelay: `${0.3 + i * 0.1}s` }}></div>
                  <div className="skeleton-bar" style={{ width: '40%', height: '0.8rem', animationDelay: `${0.4 + i * 0.1}s` }}></div>
                </div>
              ))}
            </div>
          </>
        );
      case 'worksheet':
        return (
          <>
            <div className="skeleton-bar" style={{ width: '70%', height: '2rem', animationDelay: '0s', margin: '0 auto 2rem' }}></div>
            <div className="skeleton-bar" style={{ width: '100%', animationDelay: '0.1s' }}></div>
            <div className="skeleton-bar" style={{ width: '95%', animationDelay: '0.2s' }}></div>
            <div className="skeleton-bar" style={{ width: '88%', animationDelay: '0.3s' }}></div>
            <div style={{ marginTop: '2rem' }}>
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} style={{ marginBottom: '1.5rem' }}>
                  <div className="skeleton-bar" style={{ width: '40%', height: '1.2rem', animationDelay: `${0.4 + i * 0.1}s` }}></div>
                  <div className="skeleton-bar" style={{ width: '100%', animationDelay: `${0.5 + i * 0.1}s` }}></div>
                  <div className="skeleton-bar" style={{ width: '85%', animationDelay: `${0.6 + i * 0.1}s` }}></div>
                </div>
              ))}
            </div>
          </>
        );
      case 'definition':
        return (
          <>
            <div className="skeleton-bar" style={{ width: '50%', height: '2rem', animationDelay: '0s', margin: '0 auto 2rem' }}></div>
            <div style={{ background: 'var(--bg-dark)', padding: '2rem', borderRadius: 'var(--radius-lg)', margin: '2rem 0' }}>
              <div className="skeleton-bar" style={{ width: '80%', backgroundColor: '#333', animationDelay: '0.2s' }}></div>
              <div className="skeleton-bar" style={{ width: '60%', backgroundColor: '#333', animationDelay: '0.4s' }}></div>
              <div className="skeleton-bar" style={{ width: '75%', backgroundColor: '#333', animationDelay: '0.6s' }}></div>
            </div>
            <div className="skeleton-bar" style={{ width: '100%', animationDelay: '0.8s' }}></div>
            <div className="skeleton-bar" style={{ width: '95%', animationDelay: '1.0s' }}></div>
            <div className="skeleton-bar" style={{ width: '88%', animationDelay: '1.2s' }}></div>
          </>
        );
      default:
        return (
          <>
            <div className="skeleton-bar" style={{ width: '100%', animationDelay: '0s' }}></div>
            <div className="skeleton-bar" style={{ width: '83.33%', animationDelay: '0.2s' }}></div>
            <div className="skeleton-bar" style={{ width: '100%', animationDelay: '0.4s' }}></div>
            <div className="skeleton-bar" style={{ width: '75%', animationDelay: '0.6s' }}></div>
            <div className="skeleton-bar" style={{ width: '66.66%', animationDelay: '0.8s' }}></div>
          </>
        );
    }
  };

  const getLoadingIcon = () => {
    switch (type) {
      case 'vocabulary': return '📚';
      case 'worksheet': return '📝';
      case 'definition': return '🔍';
      default: return '⚡';
    }
  };

  return (
    <div className="loading-container" aria-label="Loading content..." role="progressbar">
      {showText && (
        <div className="loading-text">
          <span style={{ fontSize: '1.5em', animation: 'pulse 2s infinite' }}>{getLoadingIcon()}</span>
          {text}
        </div>
      )}
      {renderSkeletonBars()}
    </div>
  );
};

export default LoadingSkeleton;
