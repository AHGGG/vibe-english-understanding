import React from 'react';
import type { TimerState } from '../types';

interface TimerProps {
  timer: TimerState;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({ 
  timer, 
  className = '' 
}) => {
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };


  return (
    <div className={`timer ${className}`}>
      <div className="timer-display">
        <span className={`time ${timer.isRunning ? 'running' : ''} ${timer.timeLeft === 0 && !timer.isRunning ? 'expired' : ''}`}>
          {formatTime(timer.timeLeft)}
        </span>
        {timer.isRunning && (
          <span className="status">运行中</span>
        )}
      </div>
      
    </div>
  );
};