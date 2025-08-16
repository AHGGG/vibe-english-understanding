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
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200">
          <div className="text-center mb-6 pb-6 border-b border-slate-200">
            <h2 className="text-3xl font-bold text-[#3e1a78] mb-3">Step 1: 基础阅读训练</h2>
            <p className="text-[#7c3aed] leading-relaxed">每句2秒左右，读完就读下一句，2秒没读完直接下一句，不要停留。</p>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <p className="text-slate-700 mb-2">准备好了吗？点击开始按钮开始训练。</p>
              <p className="text-slate-500 text-sm">共16句话，每句话2秒时间限制。</p>
            </div>
            
            <button 
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              onClick={handleStart}
            >
              开始训练
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200">
      <div className="text-center mb-6 pb-6 border-b border-slate-200">
        <h2 className="text-3xl font-bold text-[#3e1a78] mb-3">Step 1: 基础阅读训练</h2>
        <div className="flex justify-center text-sm text-[#7c3aed] font-medium">
          进度: {currentSentence + 1} / {baseSentences.length}
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <Timer timer={timer} />
        
        <SentenceDisplay
          sentence={baseSentences[currentSentence]}
          isActive={true}
        />
        
        {/* <div className="controls">
          <button onClick={handleNext} disabled={timer.isRunning}>
            下一句 (或等待自动跳转)
          </button>
        </div> */}
      </div>
    </div>
  );
};