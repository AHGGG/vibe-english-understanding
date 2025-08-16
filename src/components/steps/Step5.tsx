import React, { useState, useEffect } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { useProgress } from '../../hooks/useProgress';
import { baseSentences } from '../../data/sentences';

interface Step5Props {
  onComplete: () => void;
}

export const Step5: React.FC<Step5Props> = ({ onComplete }) => {
  const [isResting, setIsResting] = useState(false);
  const [restStarted, setRestStarted] = useState(false);
  const [isReading, setIsReading] = useState(false);
  const [currentSentence, setCurrentSentence] = useState(0);
  
  const restTimer = useTimer(600); // 10分钟 = 600秒
  const readTimer = useTimer(2); // 2秒阅读
  const { progress, updateMark } = useProgress();

  useEffect(() => {
    if (restStarted && restTimer.timer.timeLeft === 0) {
      // 休息时间结束
      setIsResting(false);
      setRestStarted(false);
    }
  }, [restTimer.timer.timeLeft, restStarted]);

  useEffect(() => {
    if (isReading && readTimer.timer.timeLeft === 0) {
      // 2秒时间到，自动进入下一句
      if (currentSentence < baseSentences.length - 1) {
        setCurrentSentence(prev => prev + 1);
        readTimer.start(2);
      } else {
        // 所有句子读完，检查是否有未理解的
        const ununderstoodMarks = progress.marks.filter(m => m.isNotUnderstood);
        if (ununderstoodMarks.length === 0) {
          onComplete();
        }
      }
    }
  }, [readTimer.timer.timeLeft, currentSentence, isReading, progress.marks, onComplete]);

  const handleStartRest = () => {
    setIsResting(true);
    setRestStarted(true);
    restTimer.start(600);
  };

  const handleStartReading = () => {
    setIsReading(true);
    readTimer.start(2);
  };

  const handleMarkUpdate = (sentenceId: number, mark: any) => {
    updateMark(sentenceId, mark);
  };

  const getCurrentMark = () => {
    return progress.marks.find(m => m.sentenceId === baseSentences[currentSentence].id);
  };

  const getUnunderstoodCount = () => {
    return progress.marks.filter(m => m.isNotUnderstood).length;
  };

  if (!restStarted && !isResting && !isReading) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 5: 休息与验证</h2>
          <p>恭喜完成Step4！现在需要休息10分钟，然后进行最终验证。</p>
        </div>
        
        <div className="step-content">
          <div className="instruction">
            <p><strong>为什么要休息？</strong></p>
            <p>如果不休息，大脑会宕机，会出现已经开始不工作的情况，影响训练效果。</p>
            <p>休息后，你将以2秒每句的速度重新读一遍16句话，没有理解的打叉X。</p>
          </div>
          
          <button className="start-btn" onClick={handleStartRest}>
            开始10分钟休息
          </button>
        </div>
      </div>
    );
  }

  if (isResting) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 5: 休息中...</h2>
          <p>请放松大脑，休息{Math.ceil(restTimer.timer.timeLeft / 60)}分钟后继续训练。</p>
        </div>
        
        <div className="step-content">
          <Timer timer={restTimer.timer} showProgress />
          
          <div className="rest-content">
            <h3>🧠 大脑休息时间</h3>
            <p>请不要思考训练内容，让大脑充分休息。</p>
            <p>可以：喝水、聊天、看风景、听音乐</p>
            <p>不要：继续思考句子、阅读相关内容</p>
          </div>

          {restTimer.timer.timeLeft === 0 && (
            <button className="start-btn" onClick={() => setIsResting(false)}>
              休息完成，开始验证
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!isReading) {
    return (
      <div className="step-container">
        <div className="step-header">
          <h2>Step 5: 最终验证</h2>
          <p>休息完了！现在以2秒每句的速度读一遍16句话。</p>
        </div>
        
        <div className="step-content">
          <div className="instruction">
            <p>没有理解的话请打叉X，我们将在Step6中继续处理。</p>
          </div>
          
          <button className="start-btn" onClick={handleStartReading}>
            开始最终验证
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Step 5: 最终验证</h2>
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
        
        <div className="verification-status">
          <p>未理解句子数量: {getUnunderstoodCount()}</p>
          {getUnunderstoodCount() === 0 && currentSentence === baseSentences.length - 1 && (
            <div className="success-message">
              🎉 恭喜！所有句子都已理解，可以进入下一步！
            </div>
          )}
        </div>
      </div>
    </div>
  );
};