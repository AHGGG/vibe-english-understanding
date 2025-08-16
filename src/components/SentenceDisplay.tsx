import React from 'react';
import type { Sentence, SentenceMark } from '../types/index';

interface SentenceDisplayProps {
  sentence: Sentence;
  mark?: SentenceMark;
  showMarkButtons?: boolean;
  onMarkUpdate?: (mark: Partial<SentenceMark>) => void;
  isActive?: boolean;
  className?: string;
}

export const SentenceDisplay: React.FC<SentenceDisplayProps> = ({
  sentence,
  mark,
  showMarkButtons = false,
  onMarkUpdate,
  isActive = false,
  className = ''
}) => {
  const handleMarkClick = (markType: 'stuck' | 'understood' | 'notUnderstood') => {
    if (!onMarkUpdate) return;
    
    const newMark = {
      isStuck: markType === 'stuck',
      isUnderstood: markType === 'understood', 
      isNotUnderstood: markType === 'notUnderstood'
    };
    
    onMarkUpdate(newMark);
  };

  return (
    <div className={`p-6 rounded-xl border-2 transition-all duration-300 ${
      isActive 
        ? 'border-blue-400 bg-blue-50 shadow-lg' 
        : 'border-slate-200 bg-white hover:border-slate-300'
    } ${className}`}>
      <div className="flex flex-col gap-4">
        <div className="flex items-start gap-3">
          <span className="text-sm font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded">
            第{sentence.id}句话：
          </span>
          <span className="text-lg text-slate-800 leading-relaxed">
            {sentence.text}
          </span>
        </div>
        
        {mark && (
          <div className="flex gap-2 items-center">
            <span className="text-sm text-slate-500">当前标记：</span>
            {mark.isStuck && <span className="text-emerald-500 text-xl font-bold">✨</span>}
            {mark.isUnderstood && <span className="text-zinc-500 text-xl font-bold">⭕</span>}
            {mark.isNotUnderstood && <span className="text-blue-500 text-xl font-bold">❌</span>}
          </div>
        )}
        
        {showMarkButtons && (
          <div className="flex gap-3 mt-2">
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                mark?.isStuck 
                  ? 'bg-yellow-100 text-yellow-700 border-2 border-yellow-300' 
                  : 'bg-slate-100 hover:bg-yellow-50 text-slate-600 border border-slate-300 hover:border-yellow-300'
              }`}
              onClick={() => handleMarkClick('stuck')}
              title="理解卡顿"
            >
              ✨ 理解卡顿
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                mark?.isUnderstood 
                  ? 'bg-green-100 text-green-700 border-2 border-green-300' 
                  : 'bg-slate-100 hover:bg-green-50 text-slate-600 border border-slate-300 hover:border-green-300'
              }`}
              onClick={() => handleMarkClick('understood')}
              title="理解了"
            >
              ⭕ 理解了
            </button>
            <button
              className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                mark?.isNotUnderstood 
                  ? 'bg-red-100 text-red-700 border-2 border-red-300' 
                  : 'bg-slate-100 hover:bg-red-50 text-slate-600 border border-slate-300 hover:border-red-300'
              }`}
              onClick={() => handleMarkClick('notUnderstood')}
              title="没读懂"
            >
              ❌ 没读懂
            </button>
          </div>
        )}
      </div>
    </div>
  );
};