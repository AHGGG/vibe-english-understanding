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
    <div className={`flex flex-col items-center ${className}`}>
      <div className="flex items-center gap-3 bg-white p-4 rounded-xl shadow-lg border border-slate-200">
        <span className={`text-3xl font-mono font-bold ${
          timer.isRunning 
            ? 'text-blue-600' 
            : timer.timeLeft === 0 && !timer.isRunning 
              ? 'text-red-600' 
              : 'text-slate-700'
        }`}>
          {formatTime(timer.timeLeft)}
        </span>
        {timer.isRunning && (
          <span className="text-sm text-blue-600 font-medium animate-pulse">
            计时中...
          </span>
        )}
      </div>
      
    </div>
  );
};