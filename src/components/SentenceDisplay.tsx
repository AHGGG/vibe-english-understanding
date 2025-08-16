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
    <div className={`sentence-display ${isActive ? 'active' : ''} ${className}`}>
      <div className="sentence-content">
        <span className="sentence-number">第{sentence.id}句话：</span>
        <span className="sentence-text">{sentence.text}</span>
      </div>
      
      {mark && (
        <div className="sentence-marks">
          {mark.isStuck && <span className="mark stuck">✨</span>}
          {mark.isUnderstood && <span className="mark understood">⭕</span>}
          {mark.isNotUnderstood && <span className="mark not-understood">❌</span>}
        </div>
      )}
      
      {showMarkButtons && (
        <div className="mark-buttons">
          <button
            className={`mark-btn stuck ${mark?.isStuck ? 'active' : ''}`}
            onClick={() => handleMarkClick('stuck')}
            title="理解卡顿"
          >
            ✨
          </button>
          <button
            className={`mark-btn understood ${mark?.isUnderstood ? 'active' : ''}`}
            onClick={() => handleMarkClick('understood')}
            title="理解了"
          >
            ⭕
          </button>
          <button
            className={`mark-btn not-understood ${mark?.isNotUnderstood ? 'active' : ''}`}
            onClick={() => handleMarkClick('notUnderstood')}
            title="没读懂"
          >
            ❌
          </button>
        </div>
      )}
    </div>
  );
};