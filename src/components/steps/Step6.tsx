import React, { useState, useEffect } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { useProgress } from '../../hooks/useProgress';
import { baseSentences } from '../../data/sentences';

interface Step6Props {
  onComplete: () => void;
}

export const Step6: React.FC<Step6Props> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'preparation' | 'unlimited' | 'verification' | 'no-voice' | 'completed'>('preparation');
  const [currentSentence, setCurrentSentence] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const readTimer = useTimer(2);
  const finalTimer = useTimer(4);
  const { progress, updateMark } = useProgress();

  useEffect(() => {
    if (phase === 'verification' && readTimer.timer.timeLeft === 0) {
      // 2秒验证时间到
      if (currentSentence < baseSentences.length - 1) {
        setCurrentSentence(prev => prev + 1);
        readTimer.start(2);
      } else {
        // 验证完成，检查是否可以进入无默念阅读
        const ununderstoodMarks = progress.marks.filter(m => m.isNotUnderstood);
        if (ununderstoodMarks.length === 0) {
          setPhase('no-voice');
          setCurrentSentence(0);
        } else {
          alert('还有句子未理解，请继续练习');
          setPhase('unlimited');
        }
      }
    }
  }, [readTimer.timer.timeLeft, currentSentence, phase, progress.marks]);

  useEffect(() => {
    if (phase === 'no-voice' && finalTimer.timer.timeLeft === 0) {
      // 第16句4秒时间到
      setPhase('completed');
    }
  }, [finalTimer.timer.timeLeft, phase]);

  const handleStartUnlimited = () => {
    setPhase('unlimited');
  };

  const handleStartVerification = () => {
    setPhase('verification');
    setCurrentSentence(0);
    readTimer.start(2);
  };


  const handleNoVoiceNext = () => {
    if (currentSentence < 14) { // 1-15句不限时
      setCurrentSentence(prev => prev + 1);
    } else if (currentSentence === 14) { // 第15句，准备第16句4秒限时
      setCurrentSentence(15);
      finalTimer.start(4);
    }
  };

  const handleNoVoiceFailed = () => {
    // 默念了，从第一句重来
    setFailedAttempts(prev => prev + 1);
    setCurrentSentence(0);
    alert('检测到默念，从第一句重新开始');
  };

  const handleMarkUpdate = (sentenceId: number, mark: any) => {
    updateMark(sentenceId, mark);
  };

  const getCurrentMark = () => {
    return progress.marks.find(m => m.sentenceId === baseSentences[currentSentence].id);
  };

  if (phase === 'preparation') {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 6: 无默念阅读训练</h2>
          <p>最终挑战：以心中无默念的形式进行阅览</p>
        </div>
        
        <div className="step-content">
          <div className="instruction">
            <p><strong>训练规则：</strong></p>
            <ul>
              <li>首先确保所有句子都能在2秒内理解</li>
              <li>然后进行无默念阅读：第1-15句不限时，第16句限制4秒</li>
              <li>⚠️ 任何一句有默念，必须从第一句重来</li>
              <li>只有阅览但未理解的句子可以重读，默念的必须重来</li>
              <li>这是最痛苦的阶段，需要高度集中控制大脑</li>
            </ul>
          </div>
          
          <div className="phase-selection">
            <button className="phase-btn" onClick={handleStartUnlimited}>
              先无限时练习理解
            </button>
            <button className="phase-btn" onClick={handleStartVerification}>
              开始2秒验证测试
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'unlimited') {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 6: 无限时练习</h2>
          <p>可以使用思维导图等任何方式，确保完全理解所有句子</p>
        </div>
        
        <div className="step-content">
          <SentenceDisplay
            sentence={baseSentences[currentSentence]}
            mark={getCurrentMark()}
            showMarkButtons={true}
            onMarkUpdate={(mark) => handleMarkUpdate(baseSentences[currentSentence].id, mark)}
            isActive={true}
          />
          
          <div className="controls">
            <button onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}>
              上一句
            </button>
            <button onClick={() => setCurrentSentence(Math.min(baseSentences.length - 1, currentSentence + 1))}>
              下一句
            </button>
            <button onClick={handleStartVerification} className="verify-btn">
              开始2秒验证
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'verification') {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 6: 2秒验证测试</h2>
          <div className="progress-info">
            进度: {currentSentence + 1} / {baseSentences.length}
          </div>
        </div>
        
        <div className="step-content">
          <Timer timer={readTimer.timer} showProgress />
          
          <SentenceDisplay
            sentence={baseSentences[currentSentence]}
            mark={getCurrentMark()}
            showMarkButtons={true}
            onMarkUpdate={(mark) => handleMarkUpdate(baseSentences[currentSentence].id, mark)}
            isActive={true}
          />
          
          <div className="verification-note">
            <p>所有句子必须在2秒内完全理解才能进入无默念训练</p>
          </div>
        </div>
      </div>
    );
  }

  if (phase === 'no-voice') {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 6: 无默念阅读训练</h2>
          <div className="progress-info">
            <span>进度: {currentSentence + 1} / {baseSentences.length}</span>
            <span>失败次数: {failedAttempts}</span>
          </div>
        </div>
        
        <div className="step-content">
          {currentSentence === 15 && <Timer timer={finalTimer.timer} showProgress />}
          
          <SentenceDisplay
            sentence={baseSentences[currentSentence]}
            isActive={true}
          />
          
          <div className="no-voice-controls">
            <button onClick={handleNoVoiceNext} disabled={currentSentence >= 15}>
              {currentSentence < 14 ? '下一句（无默念）' : currentSentence === 14 ? '进入第16句（4秒限时）' : ''}
            </button>
            <button onClick={handleNoVoiceFailed} className="failed-btn">
              我默念了（重新开始）
            </button>
          </div>
          
          <div className="no-voice-warning">
            <p>⚠️ 严格监控：不能有任何默念！一旦默念必须从第一句重来</p>
            <p>当前句子：{currentSentence < 15 ? '不限时' : '4秒限时'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Step 6: 完成！</h2>
        <p>恭喜完成无默念阅读训练！</p>
      </div>
      
      <div className="step-content">
        <div className="completion-message">
          <h3>🎉 训练成果</h3>
          <p>你已经成功完成了第16句话的无默念阅读训练！</p>
          <p>失败尝试次数: {failedAttempts}</p>
          <p>现在可以进入最终的乱码训练阶段。</p>
        </div>
        
        <button onClick={onComplete} className="continue-btn">
          继续到Step 7
        </button>
      </div>
    </div>
  );
};