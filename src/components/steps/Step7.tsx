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
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 7: 乱码训练</h2>
          <p className="text-lg text-blue-600 font-medium">最终挑战：理解用乱码替换的句子</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200">
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-4">训练说明：</p>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>按顺序阅读给定的文段，慢慢读</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>该段心中可以默念，但必须做到理解才可进入下一句</span>
                </li>
                <li className="flex items-start">
                  <span className="text-red-500 mr-2">•</span>
                  <span>绝不可手写思维导图</span>
                </li>
                <li className="flex items-start">
                  <span className="text-orange-500 mr-2">🔑</span>
                  <span className="font-semibold">不要把法院、联邦、委员会、社区这些词与乱码脑补替换</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>每句都独立，强制自己在理解时剔除乱码和原词的关联性</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>只客观理解该句乱码之间的相互联系</span>
                </li>
              </ul>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <h4 className="font-semibold text-blue-800 mb-2">乱码符号说明：</h4>
              <p className="text-blue-700">৩、₹、Ћ、ঋ、ħ 等符号代表不同的实体，你需要理解它们之间的关系</p>
            </div>
          </div>
        </div>
        
        <div className="flex justify-center">
            <button 
              className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
              onClick={handleStart}
            >
              开始乱码训练
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 7: 乱码训练</h2>
        <div className="text-sm text-blue-600 font-medium">
          进度: {currentSentence + 1} / {chaosTrainingSentences.length} | 
          已理解: {understoodSentences.size} / {chaosTrainingSentences.length}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <div className={`p-6 rounded-xl ${understoodSentences.has(currentSentence) ? 'bg-green-50 border-2 border-green-200' : 'bg-blue-50'}`}>
            <SentenceDisplay
              sentence={chaosTrainingSentences[currentSentence]}
              isActive={true}
            />
          </div>
          
          {chaosTrainingSentences[currentSentence].original && (
            <div className="mt-4 p-4 bg-gray-50 rounded-xl">
              <details className="text-sm">
                <summary className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium">原始句子参考（仅供对比，不要依赖）</summary>
                <p className="mt-2 text-gray-600">{chaosTrainingSentences[currentSentence].original}</p>
              </details>
            </div>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button 
            onClick={handlePrevious} 
            disabled={currentSentence === 0}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            上一句
          </button>
          <button 
            onClick={handleUnderstood}
            disabled={understoodSentences.has(currentSentence)}
            className="px-6 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            我已理解这句乱码的含义
          </button>
          <button 
            onClick={handleNext} 
            disabled={currentSentence >= chaosTrainingSentences.length - 1}
            className="px-6 py-3 bg-gray-600 text-white font-semibold rounded-xl hover:bg-gray-700 transition-colors shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            下一句
          </button>
        </div>
        
        <div className="p-4 bg-red-50 rounded-xl mb-6">
          <p className="font-semibold text-red-800 mb-2">⚠️ 重要提醒：</p>
          <ul className="space-y-1 text-red-700">
            <li>不要将乱码符号与原词进行关联</li>
            <li>独立理解每个乱码符号之间的逻辑关系</li>
            <li>这种训练模拟考场上的绝望感觉，克服它！</li>
          </ul>
        </div>
        
        {understoodSentences.size > 0 && (
          <div className="mb-6 p-4 bg-green-50 rounded-xl">
            <h4 className="font-semibold text-green-800 mb-2">已理解的句子：</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Array.from(understoodSentences).map(index => (
                <div key={index} className="text-green-700 bg-green-100 px-3 py-1 rounded-full text-sm">
                  ✓ 第{index + 1}句乱码
                </div>
              ))}
            </div>
          </div>
        )}
        
        {understoodSentences.size === chaosTrainingSentences.length && (
          <div className="text-center p-6 bg-green-50 rounded-xl">
            <h3 className="text-2xl font-bold text-green-800 mb-4">🎉 恭喜完成所有训练！</h3>
            <p className="text-gray-700 mb-4">你已经完成了完整的英语理解能力训练！</p>
            <button 
              onClick={onComplete} 
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              完成训练
            </button>
          </div>
        )}
      </div>
    </div>
  );
};