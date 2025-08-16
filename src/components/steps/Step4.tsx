import React, { useState } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { pathASentences, pathBSentences, pathCSentences } from '../../data/sentences';

interface Step4Props {
  userPath: 'A' | 'B' | 'C';
  onComplete: () => void;
}

export const Step4: React.FC<Step4Props> = ({ userPath, onComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isUnlimitedMode, setIsUnlimitedMode] = useState(false);
  const [verifiedSentences, setVerifiedSentences] = useState<Set<number>>(new Set());
  
  const { timer, start } = useTimer(4);

  const getSentencesForPath = () => {
    switch (userPath) {
      case 'A': return pathASentences;
      case 'B': return pathBSentences;
      case 'C': return pathCSentences;
      default: return pathASentences;
    }
  };

  const sentences = getSentencesForPath();

  const handleStartUnlimited = () => {
    setIsUnlimitedMode(true);
    setIsStarted(true);
  };

  const handleStartVerification = () => {
    setIsUnlimitedMode(false);
    setIsStarted(true);
    start(4);
  };

  const handleSentenceVerified = () => {
    const newVerified = new Set(verifiedSentences);
    newVerified.add(currentSentence);
    setVerifiedSentences(newVerified);

    if (newVerified.size === sentences.length) {
      onComplete();
    } else {
      // 切换到下一个未验证的句子
      const nextIndex = sentences.findIndex((_, index) => !newVerified.has(index));
      if (nextIndex !== -1) {
        setCurrentSentence(nextIndex);
        if (!isUnlimitedMode) {
          start(4);
        }
      }
    }
  };

  const handleNextSentence = () => {
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
      if (!isUnlimitedMode) {
        start(4);
      }
    }
  };

  if (!isStarted) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 4: 深度理解验证</h2>
          <p>如果Step3没有完全理解所有句子，现在给你无限时间深度理解。</p>
        </div>
        
        <div className="step-content">
          <div className="instruction">
            <p><strong>训练说明：</strong></p>
            <ul>
              <li>可以画思维导图、逻辑图等任何方式帮助理解</li>
              <li>要求：4秒内能清晰透彻地理解句子含义</li>
              <li>理解后需要验证：4秒内阅读是否能完成理解</li>
              <li>如果4秒内不能理解，继续深度学习</li>
            </ul>
            
            <div className="sentences-preview">
              <h4>需要深度理解的句子：</h4>
              {sentences.map((sentence) => (
                <div key={sentence.id} className="sentence-preview">
                  {sentence.text}
                </div>
              ))}
            </div>
          </div>
          
          <div className="mode-selection">
            <button className="mode-btn unlimited" onClick={handleStartUnlimited}>
              开始无限时理解模式
            </button>
            <button className="mode-btn verification" onClick={handleStartVerification}>
              开始4秒验证模式
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Step 4: 深度理解验证</h2>
        <div className="mode-indicator">
          {isUnlimitedMode ? '无限时理解模式' : '4秒验证模式'}
        </div>
        <div className="progress-info">
          已验证: {verifiedSentences.size}/{sentences.length}
        </div>
      </div>
      
      <div className="step-content">
        {!isUnlimitedMode && <Timer timer={timer} showProgress />}
        
        <SentenceDisplay
          sentence={sentences[currentSentence]}
          isActive={true}
          className={verifiedSentences.has(currentSentence) ? 'verified' : ''}
        />
        
        <div className="controls">
          {isUnlimitedMode ? (
            <div className="unlimited-controls">
              <button onClick={() => setIsUnlimitedMode(false)}>
                切换到4秒验证模式
              </button>
              <button onClick={handleNextSentence}>
                下一句
              </button>
            </div>
          ) : (
            <div className="verification-controls">
              <button onClick={() => setIsUnlimitedMode(true)}>
                需要更多时间理解
              </button>
              <button 
                onClick={handleSentenceVerified}
                disabled={verifiedSentences.has(currentSentence)}
                className="verify-btn"
              >
                我已在4秒内完全理解
              </button>
            </div>
          )}
        </div>
        
        <div className="understanding-tips">
          <h4>理解要求：</h4>
          <p>能够立刻回答：联邦、法院、委员会、社区之间的任何关系，谁支持法案？谁反对法案？谁赞同谁？谁反对谁？等等关系都要立刻反应出来。</p>
        </div>

        <div className="verified-list">
          <h4>已验证理解的句子：</h4>
          {Array.from(verifiedSentences).map(index => (
            <div key={index} className="verified-item">
              ✓ 第{sentences[index].id}句
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};