/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';

interface ProgressStep {
  id: string;
  label: string;
  completed: boolean;
  active: boolean;
  icon?: string;
}

interface ProgressTrackerProps {
  steps: ProgressStep[];
  currentStep: string;
  estimatedTime?: number; // in seconds
  onCancel?: () => void;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ 
  steps, 
  currentStep, 
  estimatedTime = 30,
  onCancel 
}) => {
  const [elapsedTime, setElapsedTime] = useState(0);
  const [estimatedRemaining, setEstimatedRemaining] = useState(estimatedTime);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsedTime(prev => prev + 1);
      setEstimatedRemaining(prev => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  const formatTime = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div style={{
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-light)',
      borderRadius: 'var(--radius-lg)',
      padding: '2rem',
      margin: '2rem 0',
      boxShadow: 'var(--shadow-md)'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h3 style={{
          margin: 0,
          color: 'var(--text-primary)',
          fontSize: 'var(--font-size-lg)',
          fontWeight: 600
        }}>
          Processing your request...
        </h3>
        {onCancel && (
          <button
            onClick={onCancel}
            className="btn btn-sm btn-outline"
            style={{ color: 'var(--danger-color)', borderColor: 'var(--danger-color)' }}
          >
            Cancel
          </button>
        )}
      </div>

      {/* Progress Bar */}
      <div style={{
        background: 'var(--bg-tertiary)',
        borderRadius: 'var(--radius-sm)',
        height: '8px',
        marginBottom: '1.5rem',
        overflow: 'hidden'
      }}>
        <div
          style={{
            background: 'linear-gradient(90deg, var(--primary-color), var(--secondary-color))',
            height: '100%',
            borderRadius: 'var(--radius-sm)',
            transition: 'width 0.3s ease',
            width: `${progress}%`
          }}
        />
      </div>

      {/* Time Information */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)'
      }}>
        <span>⏱️ Elapsed: {formatTime(elapsedTime)}</span>
        <span>{Math.round(progress)}% Complete</span>
        <span>⏳ Est. remaining: {formatTime(estimatedRemaining)}</span>
      </div>

      {/* Steps */}
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem'
      }}>
        {steps.map((step, index) => (
          <div
            key={step.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: step.active ? 'var(--primary-color)' : step.completed ? 'var(--success-color)' : 'var(--bg-primary)',
              color: step.active || step.completed ? 'var(--text-inverse)' : 'var(--text-primary)',
              transition: 'all 0.3s ease',
              transform: step.active ? 'scale(1.02)' : 'scale(1)',
              boxShadow: step.active ? 'var(--shadow-md)' : 'var(--shadow-sm)'
            }}
          >
            {/* Step Icon */}
            <div style={{
              width: '2rem',
              height: '2rem',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: step.active || step.completed ? 'rgba(255, 255, 255, 0.2)' : 'var(--bg-tertiary)',
              fontSize: 'var(--font-size-sm)',
              fontWeight: 600
            }}>
              {step.completed ? '✅' : 
               step.active ? (step.icon || '⚡') : 
               (index + 1)}
            </div>

            {/* Step Label */}
            <span style={{
              flex: 1,
              fontWeight: step.active ? 600 : 500
            }}>
              {step.label}
            </span>

            {/* Step Status */}
            {step.active && (
              <div style={{
                width: '1rem',
                height: '1rem',
                border: '2px solid rgba(255, 255, 255, 0.3)',
                borderTop: '2px solid white',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }} />
            )}
          </div>
        ))}
      </div>

      {/* Additional Info */}
      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'var(--bg-primary)',
        borderRadius: 'var(--radius-md)',
        fontSize: 'var(--font-size-sm)',
        color: 'var(--text-secondary)',
        textAlign: 'center'
      }}>
        💡 <strong>Tip:</strong> Our AI is carefully analyzing your content to provide the best vocabulary insights. 
        This process ensures high-quality results tailored to your text.
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProgressTracker;
