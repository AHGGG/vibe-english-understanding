import React, { useState, useEffect } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { baseSentences } from '../../data/sentences';

interface Step1Props {
  onComplete: () => void;
}

export const Step1: React.FC<Step1Props> = ({ onComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const { timer, start, reset } = useTimer(2);

  useEffect(() => {
    if (isStarted && timer.timeLeft === 0 && !timer.isRunning) {
      // 2秒时间到，确保进度条显示100%后进入下一句
      if (currentSentence < baseSentences.length - 1) {
        setCurrentSentence(prev => prev + 1);
        start(2); // 重新开始2秒计时
      } else {
        // 所有句子读完
        onComplete();
      }
    }
  }, [timer.timeLeft, timer.isRunning, currentSentence, isStarted, start, onComplete]);

  const handleStart = () => {
    setIsStarted(true);
    start(2);
  };

  const handleNext = () => {
    if (currentSentence < baseSentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
      reset(2);
      start(2);
    } else {
      onComplete();
    }
  };

  if (!isStarted) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 1: 基础阅读训练</h2>
          <p>每句2秒左右，读完就读下一句，2秒没读完直接下一句，不要停留。</p>
        </div>
        
        <div className="step-content">
          <div className="instruction">
            <p>准备好了吗？点击开始按钮开始训练。</p>
            <p>共16句话，每句话2秒时间限制。</p>
          </div>
          
          <button className="start-btn" onClick={handleStart}>
            开始训练
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Step 1: 基础阅读训练</h2>
        <div className="progress-info">
          进度: {currentSentence + 1} / {baseSentences.length}
        </div>
      </div>
      
      <div className="step-content">
        <Timer timer={timer} />
        
        <SentenceDisplay
          sentence={baseSentences[currentSentence]}
          isActive={true}
        />
        
        <div className="controls">
          <button onClick={handleNext} disabled={timer.isRunning}>
            下一句 (或等待自动跳转)
          </button>
        </div>
      </div>
    </div>
  );
};