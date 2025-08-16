import { useState, useEffect } from 'react';
import type { UserProgress, SentenceMark } from '../types/index';

const STORAGE_KEY = 'vibe-english-progress';

const defaultProgress: UserProgress = {
  currentStep: 1,
  currentSentence: 0,
  marks: [],
  userPath: null,
  completedSteps: []
};

export const useProgress = () => {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);

  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        setProgress(JSON.parse(savedProgress));
      } catch (error) {
        console.error('Failed to parse saved progress:', error);
      }
    }
  }, []);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProgress));
  };

  const updateMark = (sentenceId: number, mark: Partial<SentenceMark>) => {
    const newProgress = { ...progress };
    const existingMarkIndex = newProgress.marks.findIndex(m => m.sentenceId === sentenceId);
    
    if (existingMarkIndex >= 0) {
      newProgress.marks[existingMarkIndex] = { 
        ...newProgress.marks[existingMarkIndex], 
        ...mark 
      };
    } else {
      newProgress.marks.push({
        sentenceId,
        isStuck: false,
        isUnderstood: false,
        isNotUnderstood: false,
        ...mark
      });
    }
    
    saveProgress(newProgress);
  };

  const nextStep = () => {
    const newProgress = {
      ...progress,
      currentStep: progress.currentStep + 1,
      currentSentence: 0,
      completedSteps: [...progress.completedSteps, progress.currentStep]
    };
    saveProgress(newProgress);
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(defaultProgress);
  };

  const getUserPath = (): 'A' | 'B' | 'C' => {
    if (progress.userPath) return progress.userPath;
    
    // 根据Step2的标记确定路径
    const stuckMarks = progress.marks.filter(m => m.isStuck);
    const understoodMarks = progress.marks.filter(m => m.isUnderstood);
    
    if (stuckMarks.length > 0 && stuckMarks[0].sentenceId <= 7) {
      return 'A'; // 星号在第1-7句内
    } else if (stuckMarks.length > 0 && stuckMarks[0].sentenceId > 7 && understoodMarks.length === 0) {
      return 'B'; // 星号在7句外且没有⭕
    } else {
      return 'C'; // 星号在7句外且有⭕
    }
  };

  const setUserPath = (path: 'A' | 'B' | 'C') => {
    saveProgress({ ...progress, userPath: path });
  };

  return {
    progress,
    saveProgress,
    updateMark,
    nextStep,
    resetProgress,
    getUserPath,
    setUserPath
  };
};