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
    if (isReading && readTimer.timer.timeLeft === 0 && !readTimer.timer.isRunning) {
      // 2秒时间到，确保进度条显示100%后进入下一句
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
  }, [readTimer.timer.timeLeft, readTimer.timer.isRunning, currentSentence, isReading, progress.marks, onComplete]);

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
      <div className="max-w-3xl">
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 5: 休息与验证</h2>
          <p className="text-lg text-blue-600 font-medium">恭喜完成Step4！现在需要休息10分钟，然后进行最终验证。</p>
        </div>
        
        <div className="bg-white rounded-2xl p-6 shadow-xl w-full mx-auto border border-slate-200 hover:shadow-[0_25px_50px_rgba(0,0,0,0.12),0_12px_24px_rgba(0,0,0,0.08),0_0_0_1px_rgba(0,0,0,0.06)] hover:-translate-y-1 transition-all duration-200">
          <div className="space-y-6">
            <div>
              <p className="text-lg font-semibold text-gray-800 mb-3">为什么要休息？</p>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>如果不休息，大脑会宕机，会出现已经开始不工作的情况，影响训练效果。</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span>休息后，你将以2秒每句的速度重新读一遍16句话，没有理解的打叉X。</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 flex justify-center">
            <button 
              onClick={handleStartRest}
              className="px-8 py-3 bg-purple-600 text-white font-semibold rounded-xl hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl"
            >
              开始10分钟休息
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isResting) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 5: 休息中...</h2>
          <p className="text-lg text-blue-600 font-medium">请放松大脑，休息{Math.ceil(restTimer.timer.timeLeft / 60)}分钟后继续训练。</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-8">
            <Timer timer={restTimer.timer} />
          </div>
          
          <div className="text-center space-y-4 mb-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-4">🧠 大脑休息时间</h3>
            <div className="bg-blue-50 rounded-xl p-6 space-y-3">
              <p className="text-blue-800 text-lg">请不要思考训练内容，让大脑充分休息。</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="font-semibold text-green-800 mb-2">可以做的事：</p>
                  <ul className="text-green-700 space-y-1">
                    <li>• 喝水</li>
                    <li>• 聊天</li>
                    <li>• 看风景</li>
                    <li>• 听音乐</li>
                  </ul>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <p className="font-semibold text-red-800 mb-2">不要做的事：</p>
                  <ul className="text-red-700 space-y-1">
                    <li>• 继续思考句子</li>
                    <li>• 阅读相关内容</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {restTimer.timer.timeLeft === 0 && (
            <div className="flex justify-center">
              <button 
                onClick={() => setIsResting(false)}
                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
              >
                休息完成，开始验证
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!isReading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 5: 最终验证</h2>
          <p className="text-lg text-blue-600 font-medium">休息完了！现在以2秒每句的速度读一遍16句话。</p>
        </div>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="mb-6">
            <p className="text-gray-700 text-lg">没有理解的话请打叉X，我们将在Step6中继续处理。</p>
          </div>
          
          <div className="flex justify-center">
            <button 
              onClick={handleStartReading}
              className="px-8 py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              开始最终验证
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Step 5: 最终验证</h2>
        <div className="text-sm text-blue-600 font-medium">
          进度: {currentSentence + 1} / {baseSentences.length}
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-6">
          <Timer timer={readTimer.timer} />
        </div>
        
        <SentenceDisplay
          sentence={baseSentences[currentSentence]}
          mark={getCurrentMark()}
          showMarkButtons={true}
          onMarkUpdate={(mark) => handleMarkUpdate(baseSentences[currentSentence].id, mark)}
          isActive={true}
        />
        
        <div className="mt-6 p-4 bg-blue-50 rounded-xl">
          <p className="text-blue-800 font-medium">未理解句子数量: {getUnunderstoodCount()}</p>
          {getUnunderstoodCount() === 0 && currentSentence === baseSentences.length - 1 && (
            <div className="mt-4 p-4 bg-green-50 rounded-lg text-green-800 font-semibold">
              🎉 恭喜！所有句子都已理解，可以进入下一步！
            </div>
          )}
        </div>
      </div>
    </div>
  );
};