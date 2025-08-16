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
    if (isStarted && timer.timeLeft === 0 && !timer.isRunning) {
      // 时间到了，没理解，进行下一句或循环
      handleTimeUp();
    }
  }, [timer.timeLeft, timer.isRunning, isStarted]);

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
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200 mb-6">
          <h2 className="text-3xl font-bold text-[#3e1a78] mb-2">Step 3: 倒计时循环训练</h2>
          <p className="text-lg text-[#7c3aed] font-medium">{getPathDescription()}</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200">
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold text-slate-800 mb-3">训练规则：</p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <span className="text-[#7c3aed] mr-2">•</span>
                  <span>倒计时时间：<span className="font-semibold text-[#7c3aed]">{timeLimit}秒</span> (X标记数 ÷ 2)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7c3aed] mr-2">•</span>
                  <span>倒计时内没理解，直接下一句，倒计时重新开始</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7c3aed] mr-2">•</span>
                  <span>理解一句后，只操作剩余未理解的句子</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7c3aed] mr-2">•</span>
                  <span>循环次数不可超过<span className="font-semibold text-[#dc2626]">25次</span></span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7c3aed] mr-2">•</span>
                  <span>要求：彻底理解每句话的含义和关系</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">你要训练的句子：</h4>
              <div className="space-y-3">
                {sentences.map((sentence) => (
                  <div key={sentence.id} className="p-4 bg-white rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors">
                    {sentence.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleStart}
              className="px-8 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              开始倒计时训练
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200 mb-6">
        <h2 className="text-3xl font-bold text-[#3e1a78] mb-2">Step 3: 倒计时循环训练</h2>
        <div className="flex flex-col sm:flex-row gap-4 text-lg">
          <span className="text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
            循环次数: <span className="font-semibold text-[#7c3aed]">{cycleCount}/25</span>
          </span>
          <span className="text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
            已理解: <span className="font-semibold text-[#22c55e]">{understoodSentences.size}/{sentences.length}</span>
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200">
        <div className="mb-6 flex justify-center">
          <Timer timer={timer} />
        </div>
        
        <div className="mb-8">
          <SentenceDisplay
            sentence={sentences[currentSentence]}
            isActive={true}
            className={understoodSentences.has(currentSentence) ? 'opacity-50' : ''}
          />
        </div>
        
        <div className="flex justify-center mb-8">
          <button 
            onClick={handleUnderstood}
            disabled={understoodSentences.has(currentSentence)}
            className={`px-8 py-3 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl ${
              understoodSentences.has(currentSentence)
                ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                : 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
            }`}
          >
            我已完全理解这句话
          </button>
        </div>
        
        {understoodSentences.size > 0 && (
          <div className="bg-[#f0fdf4] rounded-xl p-6 border border-[#bbf7d0]">
            <h4 className="text-lg font-semibold text-[#14532d] mb-3">已理解的句子：</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Array.from(understoodSentences).map(index => (
                <div key={index} className="bg-[#dcfce7] text-[#14532d] px-3 py-2 rounded-lg text-sm font-medium border border-[#86efac]">
                  ✓ 第{sentences[index].id}句
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};