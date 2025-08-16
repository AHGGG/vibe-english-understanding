import React from 'react';
import type { TimerState } from '../types';

interface TimerProps {
  timer: TimerState;
  showProgress?: boolean;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ 
  timer, 
  showProgress = false, 
  className = '' 
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = timer.duration > 0 
    ? ((timer.duration - timer.timeLeft) / timer.duration) * 100 
    : 0;

  return (
    <div className={`timer ${className}`}>
      <div className="timer-display">
        <span className={`time ${timer.isRunning ? 'running' : ''} ${timer.timeLeft === 0 ? 'expired' : ''}`}>
          {formatTime(timer.timeLeft)}
        </span>
        {timer.isRunning && (
          <span className="status">运行中</span>
        )}
      </div>
      
      {showProgress && timer.duration > 0 && (
        <div className="timer-progress">
          <div 
            className="progress-bar"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}
    </div>
  );
};