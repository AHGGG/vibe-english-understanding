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
      // 2秒时间到，如果用户还没有标记，默认为❌没读懂
      if (currentSentence >= baseSentences.length) {
        determineUserPath();
        return;
      }
      
      const currentMark = progress.marks.find(m => m.sentenceId === baseSentences[currentSentence].id);
      if (!currentMark) {
        // 用户没有点击任何按钮，自动标记为❌没读懂
        updateMark(baseSentences[currentSentence].id, {
          isNotUnderstood: true,
          isStuck: false,
          isUnderstood: false
        });
      }
    }
  }, [timer.timeLeft, timer.isRunning, currentSentence, isStarted, progress.marks, updateMark]);

  // 单独处理自动跳转到下一句的逻辑
  useEffect(() => {
    if (isStarted && !timer.isRunning && timer.timeLeft === 0) {
      const timer = setTimeout(() => {
        if (currentSentence < baseSentences.length - 1) {
          setCurrentSentence(prev => prev + 1);
          start(2);
        } else if (currentSentence === baseSentences.length - 1) {
          // 所有句子标记完成，确定用户路径
          determineUserPath();
        }
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [timer.isRunning, timer.timeLeft, currentSentence, isStarted, start]);

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
    if (currentSentence >= baseSentences.length || currentSentence < 0) {
      return undefined;
    }
    return progress.marks.find(m => m.sentenceId === baseSentences[currentSentence].id);
  };

  if (!isStarted) {
    return (
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200">
          <div className="text-center mb-6 pb-6 border-b border-slate-200">
            <h2 className="text-3xl font-bold text-[#3e1a78] mb-3">Step 2: 标记阅读训练</h2>
            <p className="text-[#7c3aed] leading-relaxed">重新读一遍，阅读速度要2秒内。标注从哪句开始理解卡顿。</p>
          </div>
          
          <div className="flex flex-col items-center gap-6">
            <div className="text-center max-w-md">
              <p className="font-semibold text-slate-800 mb-3">标记说明：</p>
              <ul className="text-left space-y-1 text-slate-600 mb-4">
                <li>✨ - 理解突然卡顿的句子</li>
                <li>❌ - 没读懂的句子</li>
                <li>⭕ - ✨号后面读懂的句子</li>
              </ul>
              <p className="text-slate-700">读完后会根据你的标记确定训练路径。</p>
            </div>
            
            <button 
              className="bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-medium py-3 px-8 rounded-lg transition-colors shadow-lg hover:shadow-xl"
              onClick={handleStart}
            >
              开始Step 2
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200">
      <div className="text-center mb-6 pb-6 border-b border-slate-200">
        <h2 className="text-3xl font-bold text-[#3e1a78] mb-3">Step 2: 标记阅读训练</h2>
        <div className="text-sm text-[#7c3aed] font-medium">
          进度: {currentSentence + 1} / {baseSentences.length}
        </div>
      </div>
      
      <div className="flex flex-col items-center gap-6">
        <Timer timer={timer} />
        
        {currentSentence < baseSentences.length && (
          <SentenceDisplay
            sentence={baseSentences[currentSentence]}
            mark={getCurrentMark()}
            showMarkButtons={true}
            onMarkUpdate={(mark) => handleMarkUpdate(baseSentences[currentSentence].id, mark)}
            isActive={true}
          />
        )}
        
        {/* <div className="controls">
          <button onClick={handleNext} disabled={timer.isRunning}>
            下一句 (或等待自动跳转)
          </button>
        </div> */}
        
        <div className="mt-8 p-4 bg-slate-50 rounded-xl">
          <h3 className="text-lg font-semibold text-slate-800 mb-3">当前标记：</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {progress.marks.map(mark => (
              <div key={mark.sentenceId} className="text-sm text-slate-600">
                第{mark.sentenceId}句：
                {mark.isStuck && <span className="text-yellow-500 font-bold">✨</span>}
                {mark.isUnderstood && <span className="text-green-500 font-bold">⭕</span>}
                {mark.isNotUnderstood && <span className="text-red-500 font-bold">❌</span>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};