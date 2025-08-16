import { useState, useEffect, useCallback } from 'react';
import type { TimerState } from '../types';

export const useTimer = (initialDuration: number = 0) => {
  const [timer, setTimer] = useState<TimerState>({
    timeLeft: initialDuration,
    isRunning: false,
    duration: initialDuration
  });

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (timer.isRunning && timer.timeLeft > 0) {
      intervalId = setInterval(() => {
        setTimer(prev => ({
          ...prev,
          timeLeft: Math.max(0, prev.timeLeft - 1)
        }));
      }, 1000);
    } else if (timer.timeLeft === 0 && timer.isRunning) {
      // Only set isRunning to false when timer actually expires
      setTimer(prev => ({ ...prev, isRunning: false }));
    }

    return () => clearInterval(intervalId);
  }, [timer.isRunning, timer.timeLeft]);

  const start = useCallback((duration?: number) => {
    const newDuration = duration || timer.duration;
    setTimer({
      timeLeft: newDuration,
      isRunning: true,
      duration: newDuration
    });
  }, [timer.duration]);

  const pause = useCallback(() => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  }, []);

  const reset = useCallback((newDuration?: number) => {
    const duration = newDuration || timer.duration;
    setTimer({
      timeLeft: duration,
      isRunning: false,
      duration
    });
  }, [timer.duration]);

  const stop = useCallback(() => {
    setTimer(prev => ({
      ...prev,
      timeLeft: 0,
      isRunning: false
    }));
  }, []);

  return {
    timer,
    start,
    pause,
    reset,
    stop,
    isExpired: timer.timeLeft === 0
  };
};