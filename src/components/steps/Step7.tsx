import React, { useState } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { chaosTrainingSentences } from '../../data/sentences';

interface Step7Props {
  onComplete: () => void;
}

export const Step7: React.FC<Step7Props> = ({ onComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [understoodSentences, setUnderstoodSentences] = useState<Set<number>>(new Set());

  const handleStart = () => {
    setIsStarted(true);
  };

  const handleUnderstood = () => {
    const newUnderstood = new Set(understoodSentences);
    newUnderstood.add(currentSentence);
    setUnderstoodSentences(newUnderstood);

    if (newUnderstood.size === chaosTrainingSentences.length) {
      onComplete();
    }
  };

  const handleNext = () => {
    if (currentSentence < chaosTrainingSentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSentence > 0) {
      setCurrentSentence(prev => prev - 1);
    }
  };

  if (!isStarted) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 7: 乱码训练</h2>
          <p>最终挑战：理解用乱码替换的句子</p>
        </div>
        
        <div className="step-content">
          <div className="instruction">
            <p><strong>训练说明：</strong></p>
            <ul>
              <li>按顺序阅读给定的文段，慢慢读</li>
              <li>该段心中可以默念，但必须做到理解才可进入下一句</li>
              <li>绝不可手写思维导图</li>
              <li><strong>关键：</strong>不要把法院、联邦、委员会、社区这些词与乱码脑补替换</li>
              <li>每句都独立，强制自己在理解时剔除乱码和原词的关联性</li>
              <li>只客观理解该句乱码之间的相互联系</li>
            </ul>
            
            <div className="chaos-preview">
              <h4>乱码符号说明：</h4>
              <p>৩、₹、Ћ、ঋ、ħ 等符号代表不同的实体，你需要理解它们之间的关系</p>
            </div>
          </div>
          
          <button className="start-btn" onClick={handleStart}>
            开始乱码训练
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Step 7: 乱码训练</h2>
        <div className="progress-info">
          进度: {currentSentence + 1} / {chaosTrainingSentences.length} | 
          已理解: {understoodSentences.size} / {chaosTrainingSentences.length}
        </div>
      </div>
      
      <div className="step-content">
        <div className="sentence-container">
          <SentenceDisplay
            sentence={chaosTrainingSentences[currentSentence]}
            isActive={true}
            className={understoodSentences.has(currentSentence) ? 'understood' : ''}
          />
          
          {chaosTrainingSentences[currentSentence].original && (
            <div className="original-reference">
              <details>
                <summary>原始句子参考（仅供对比，不要依赖）</summary>
                <p>{chaosTrainingSentences[currentSentence].original}</p>
              </details>
            </div>
          )}
        </div>
        
        <div className="controls">
          <button onClick={handlePrevious} disabled={currentSentence === 0}>
            上一句
          </button>
          <button 
            onClick={handleUnderstood}
            disabled={understoodSentences.has(currentSentence)}
            className="understand-btn"
          >
            我已理解这句乱码的含义
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentSentence >= chaosTrainingSentences.length - 1}
          >
            下一句
          </button>
        </div>
        
        <div className="chaos-warning">
          <p>⚠️ 重要提醒：</p>
          <ul>
            <li>不要将乱码符号与原词进行关联</li>
            <li>独立理解每个乱码符号之间的逻辑关系</li>
            <li>这种训练模拟考场上的绝望感觉，克服它！</li>
          </ul>
        </div>
        
        <div className="understood-list">
          <h4>已理解的句子：</h4>
          {Array.from(understoodSentences).map(index => (
            <div key={index} className="understood-item">
              ✓ 第{index + 1}句乱码
            </div>
          ))}
        </div>
        
        {understoodSentences.size === chaosTrainingSentences.length && (
          <div className="completion-message">
            <h3>🎉 恭喜完成所有训练！</h3>
            <p>你已经完成了完整的英语理解能力训练！</p>
            <button onClick={onComplete} className="final-complete-btn">
              完成训练
            </button>
          </div>
        )}
      </div>
    </div>
  );
};