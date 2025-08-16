export interface Sentence {
  id: number;
  text: string;
  original?: string; // 用于乱码训练的原始句子
}

export interface UserProgress {
  currentStep: number;
  currentSentence: number;
  marks: SentenceMark[];
  userPath: 'A' | 'B' | 'C' | null;
  completedSteps: number[];
  restStartTime?: number;
}

export interface SentenceMark {
  sentenceId: number;
  isStuck: boolean; // ✨
  isUnderstood: boolean; // ⭕
  isNotUnderstood: boolean; // X
}

export interface TimerState {
  timeLeft: number;
  isRunning: boolean;
  duration: number;
}

export interface TrainingStep {
  id: number;
  title: string;
  description: string;
  timeLimit?: number; // 每句时间限制（秒）
  hasTimer: boolean;
  allowMarking: boolean;
  sentences: Sentence[];
}