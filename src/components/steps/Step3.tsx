import React, { useState, useEffect } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { pathASentences, pathBSentences, pathCSentences } from '../../data/sentences';

interface Step3Props {
  userPath: 'A' | 'B' | 'C';
  crossCount: number; // X标记的数量
  onComplete: () => void;
}

export const Step3: React.FC<Step3Props> = ({ userPath, crossCount, onComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [understoodSentences, setUnderstoodSentences] = useState<Set<number>>(new Set());
  
  const timeLimit = Math.floor(crossCount / 2) || 1; // X数量除以2作为倒计时秒数
  const { timer, start } = useTimer(timeLimit);

  const getSentencesForPath = () => {
    switch (userPath) {
      case 'A': return pathASentences;
      case 'B': return pathBSentences;
      case 'C': return pathCSentences;
      default: return pathASentences;
    }
  };

  const sentences = getSentencesForPath();

  useEffect(() => {
    if (isStarted && timer.timeLeft === 0) {
      // 时间到了，没理解，进行下一句或循环
      handleTimeUp();
    }
  }, [timer.timeLeft, isStarted]);

  const handleTimeUp = () => {
    if (cycleCount >= 25) {
      // 超过25次循环，停止
      onComplete();
      return;
    }

    // 检查当前句子是否已理解
    if (!understoodSentences.has(currentSentence)) {
      // 没理解，增加循环次数
      setCycleCount(prev => prev + 1);
      
      // 如果还有其他句子未理解，切换到下一句
      const remainingSentences = sentences.filter((_, index) => !understoodSentences.has(index));
      if (remainingSentences.length > 1) {
        let nextIndex = (currentSentence + 1) % sentences.length;
        while (understoodSentences.has(nextIndex) && nextIndex !== currentSentence) {
          nextIndex = (nextIndex + 1) % sentences.length;
        }
        setCurrentSentence(nextIndex);
      }
      
      // 重新开始计时
      start(timeLimit);
    }
  };

  const handleUnderstood = () => {
    const newUnderstood = new Set(understoodSentences);
    newUnderstood.add(currentSentence);
    setUnderstoodSentences(newUnderstood);

    // 检查是否都理解了
    if (newUnderstood.size === sentences.length) {
      onComplete();
      return;
    }

    // 切换到下一个未理解的句子
    const nextUnunderstoodIndex = sentences.findIndex((_, index) => !newUnderstood.has(index));
    if (nextUnunderstoodIndex !== -1) {
      setCurrentSentence(nextUnunderstoodIndex);
      start(timeLimit);
    }
  };

  const handleStart = () => {
    setIsStarted(true);
    start(timeLimit);
  };

  const getPathDescription = () => {
    switch (userPath) {
      case 'A': return '路径A：星号在第1-7句内';
      case 'B': return '路径B：星号在7句外且没有⭕';
      case 'C': return '路径C：星号在7句外且有⭕';
    }
  };

  if (!isStarted) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 3: 倒计时循环训练</h2>
          <p>{getPathDescription()}</p>
        </div>
        
        <div className="step-content">
          <div className="instruction">
            <p><strong>训练规则：</strong></p>
            <ul>
              <li>倒计时时间：{timeLimit}秒 (X标记数 ÷ 2)</li>
              <li>倒计时内没理解，直接下一句，倒计时重新开始</li>
              <li>理解一句后，只操作剩余未理解的句子</li>
              <li>循环次数不可超过25次</li>
              <li>要求：彻底理解每句话的含义和关系</li>
            </ul>
            
            <div className="sentences-preview">
              <h4>你要训练的句子：</h4>
              {sentences.map((sentence) => (
                <div key={sentence.id} className="sentence-preview">
                  {sentence.text}
                </div>
              ))}
            </div>
          </div>
          
          <button className="start-btn" onClick={handleStart}>
            开始倒计时训练
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Step 3: 倒计时循环训练</h2>
        <div className="progress-info">
          <span>循环次数: {cycleCount}/25</span>
          <span>已理解: {understoodSentences.size}/{sentences.length}</span>
        </div>
      </div>
      
      <div className="step-content">
        <Timer timer={timer} showProgress />
        
        <SentenceDisplay
          sentence={sentences[currentSentence]}
          isActive={true}
          className={understoodSentences.has(currentSentence) ? 'understood' : ''}
        />
        
        <div className="controls">
          <button 
            onClick={handleUnderstood}
            disabled={understoodSentences.has(currentSentence)}
            className="understand-btn"
          >
            我已完全理解这句话
          </button>
        </div>
        
        <div className="training-status">
          <div className="understood-list">
            <h4>已理解的句子：</h4>
            {Array.from(understoodSentences).map(index => (
              <div key={index} className="understood-item">
                ✓ 第{sentences[index].id}句
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};