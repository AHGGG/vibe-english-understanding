import React, { useState, useEffect } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { useProgress } from '../../hooks/useProgress';
import { baseSentences } from '../../data/sentences';

interface Step2Props {
  onComplete: (userPath: 'A' | 'B' | 'C') => void;
}

export const Step2: React.FC<Step2Props> = ({ onComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const { timer, start, reset } = useTimer(2);
  const { progress, updateMark } = useProgress();

  useEffect(() => {
    if (isStarted && timer.timeLeft === 0 && !timer.isRunning) {
      // 2秒时间到，确保进度条显示100%后进入下一句
      if (currentSentence < baseSentences.length - 1) {
        setCurrentSentence(prev => prev + 1);
        start(2);
      } else {
        // 所有句子标记完成，确定用户路径
        determineUserPath();
      }
    }
  }, [timer.timeLeft, timer.isRunning, currentSentence, isStarted, start]);

  const determineUserPath = () => {
    const stuckMarks = progress.marks.filter(m => m.isStuck);
    const understoodMarks = progress.marks.filter(m => m.isUnderstood);
    
    let userPath: 'A' | 'B' | 'C';
    
    if (stuckMarks.length > 0 && stuckMarks[0].sentenceId <= 7) {
      userPath = 'A'; // 星号在第1-7句内
    } else if (stuckMarks.length > 0 && stuckMarks[0].sentenceId > 7 && understoodMarks.length === 0) {
      userPath = 'B'; // 星号在7句外且没有⭕
    } else {
      userPath = 'C'; // 星号在7句外且有⭕
    }
    
    onComplete(userPath);
  };

  const handleStart = () => {
    setIsStarted(true);
    start(2);
  };

  const handleMarkUpdate = (sentenceId: number, mark: any) => {
    updateMark(sentenceId, mark);
  };

  const handleNext = () => {
    if (currentSentence < baseSentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
      reset(2);
      start(2);
    } else {
      determineUserPath();
    }
  };

  const getCurrentMark = () => {
    return progress.marks.find(m => m.sentenceId === baseSentences[currentSentence].id);
  };

  if (!isStarted) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 2: 标记阅读训练</h2>
          <p>重新读一遍，阅读速度要2秒内。标注从哪句开始理解卡顿。</p>
        </div>
        
        <div className="step-content">
          <div className="instruction">
            <p><strong>标记说明：</strong></p>
            <ul>
              <li>✨ - 理解突然卡顿的句子</li>
              <li>❌ - 没读懂的句子</li>
              <li>⭕ - ✨号后面读懂的句子</li>
            </ul>
            <p>读完后会根据你的标记确定训练路径。</p>
          </div>
          
          <button className="start-btn" onClick={handleStart}>
            开始Step 2
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Step 2: 标记阅读训练</h2>
        <div className="progress-info">
          进度: {currentSentence + 1} / {baseSentences.length}
        </div>
      </div>
      
      <div className="step-content">
        <Timer timer={timer} />
        
        <SentenceDisplay
          sentence={baseSentences[currentSentence]}
          mark={getCurrentMark()}
          showMarkButtons={true}
          onMarkUpdate={(mark) => handleMarkUpdate(baseSentences[currentSentence].id, mark)}
          isActive={true}
        />
        
        <div className="controls">
          <button onClick={handleNext} disabled={timer.isRunning}>
            下一句 (或等待自动跳转)
          </button>
        </div>
        
        <div className="marks-summary">
          <h3>当前标记：</h3>
          <div className="marks-list">
            {progress.marks.map(mark => (
              <div key={mark.sentenceId} className="mark-item">
                第{mark.sentenceId}句：
                {mark.isStuck && <span className="mark stuck">✨</span>}
                {mark.isUnderstood && <span className="mark understood">⭕</span>}
                {mark.isNotUnderstood && <span className="mark not-understood">❌</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};