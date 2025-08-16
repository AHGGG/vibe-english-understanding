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
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200 mb-6">
          <h2 className="text-3xl font-bold text-[#3e1a78] mb-2">Step 4: 深度理解验证</h2>
          <p className="text-lg text-[#7c3aed] font-medium">如果Step3没有完全理解所有句子，现在给你无限时间深度理解。</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200">
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold text-slate-800 mb-3">训练说明：</p>
              <ul className="space-y-2 text-slate-700">
                <li className="flex items-start">
                  <span className="text-[#7c3aed] mr-2">•</span>
                  <span>可以画思维导图、逻辑图等任何方式帮助理解</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7c3aed] mr-2">•</span>
                  <span>要求：<span className="font-semibold text-[#7c3aed]">4秒内</span>能清晰透彻地理解句子含义</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7c3aed] mr-2">•</span>
                  <span>理解后需要验证：4秒内阅读是否能完成理解</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#7c3aed] mr-2">•</span>
                  <span>如果4秒内不能理解，继续深度学习</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-slate-50 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-slate-800 mb-4">需要深度理解的句子：</h4>
              <div className="space-y-3">
                {sentences.map((sentence) => (
                  <div key={sentence.id} className="p-4 bg-white rounded-lg border border-slate-200 text-slate-700 hover:border-slate-300 transition-colors">
                    {sentence.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            <button 
              onClick={handleStartUnlimited} 
              className="px-6 py-4 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              开始无限时理解模式
            </button>
            <button 
              onClick={handleStartVerification} 
              className="px-6 py-4 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
            >
              开始4秒验证模式
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200 mb-6">
        <h2 className="text-3xl font-bold text-[#3e1a78] mb-2">Step 4: 深度理解验证</h2>
        
        <div className="flex flex-col sm:flex-row gap-4 text-lg">
          <span className={`px-4 py-2 rounded-lg font-medium ${
            isUnlimitedMode 
              ? 'bg-[#f0f4ff] text-[#7c3aed]' 
              : 'bg-[#eff6ff] text-[#3b82f6]'
          }`}>
            {isUnlimitedMode ? '无限时理解模式' : '4秒验证模式'}
          </span>
          <span className="text-slate-600 bg-slate-100 px-4 py-2 rounded-lg">
            已验证: <span className="font-semibold text-[#22c55e]">{verifiedSentences.size}/{sentences.length}</span>
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200">
        <div className="mb-6 flex justify-center">
          {!isUnlimitedMode && <Timer timer={timer} />}
        </div>
        
        <div className="mb-8">
          <SentenceDisplay
            sentence={sentences[currentSentence]}
            isActive={true}
            className={verifiedSentences.has(currentSentence) ? 'opacity-50' : ''}
          />
        </div>
        
        <div className="mb-8">
          {isUnlimitedMode ? (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsUnlimitedMode(false)}
                className="px-6 py-3 bg-[#3b82f6] hover:bg-[#2563eb] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                切换到4秒验证模式
              </button>
              <button 
                onClick={handleNextSentence}
                className="px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                下一句
              </button>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => setIsUnlimitedMode(true)}
                className="px-6 py-3 bg-[#7c3aed] hover:bg-[#6d28d9] text-white font-semibold rounded-lg transition-colors shadow-lg hover:shadow-xl"
              >
                需要更多时间理解
              </button>
              <button 
                onClick={handleSentenceVerified}
                disabled={verifiedSentences.has(currentSentence)}
                className={`px-6 py-3 font-semibold rounded-lg transition-all shadow-lg hover:shadow-xl ${
                  verifiedSentences.has(currentSentence)
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-[#22c55e] text-white hover:bg-[#16a34a]'
                }`}
              >
                我已在4秒内完全理解
              </button>
            </div>
          )}
        </div>
        
        <div className="bg-[#eff6ff] rounded-xl p-6 mb-8 border border-[#bfdbfe]">
          <h4 className="text-lg font-semibold text-[#1e40af] mb-3">理解要求：</h4>
          <p className="text-[#1e40af] leading-relaxed">
            能够立刻回答：联邦、法院、委员会、社区之间的任何关系，谁支持法案？谁反对法案？谁赞同谁？谁反对谁？等等关系都要立刻反应出来。
          </p>
        </div>

        {verifiedSentences.size > 0 && (
          <div className="bg-[#f0fdf4] rounded-xl p-6 border border-[#bbf7d0]">
            <h4 className="text-lg font-semibold text-[#14532d] mb-3">已验证理解的句子：</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Array.from(verifiedSentences).map(index => (
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