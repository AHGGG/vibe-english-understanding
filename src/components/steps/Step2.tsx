import React, { useState, useEffect } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { useProgress } from '../../hooks/useProgress';
import { baseSentences } from '../../data/sentences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface Step2Props {
  onComplete: (userPath: 'A' | 'B' | 'C') => void;
}

export const Step2: React.FC<Step2Props> = ({ onComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const { timer, start } = useTimer(2);
  const { progress, updateMark } = useProgress();

  const determineUserPath = React.useCallback(() => {
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
  }, [progress.marks, onComplete]);

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
  }, [timer.timeLeft, timer.isRunning, currentSentence, isStarted, progress.marks, updateMark, determineUserPath]);

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
  }, [timer.isRunning, timer.timeLeft, currentSentence, isStarted, start, determineUserPath]);

  const handleStart = () => {
    setIsStarted(true);
    start(2);
  };

  const handleMarkUpdate = (sentenceId: number, mark: { isNotUnderstood: boolean; isStuck: boolean; isUnderstood: boolean }) => {
    updateMark(sentenceId, mark);
  };


  const getCurrentMark = () => {
    if (currentSentence >= baseSentences.length || currentSentence < 0) {
      return undefined;
    }
    return progress.marks.find(m => m.sentenceId === baseSentences[currentSentence].id);
  };

  if (!isStarted) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Step 2: 标记阅读训练</CardTitle>
            <CardDescription className="text-lg">
              重新读一遍，阅读速度要2秒内。标注从哪句开始理解卡顿。
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">标记说明</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500 hover:bg-yellow-600">✨</Badge>
                  <span>理解突然卡顿的句子</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500 hover:bg-red-600">❌</Badge>
                  <span>没读懂的句子</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500 hover:bg-green-600">⭕</Badge>
                  <span>✨号后面读懂的句子</span>
                </div>
                <p className="text-muted-foreground">读完后会根据你的标记确定训练路径。</p>
              </CardContent>
            </Card>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={handleStart}>
              开始Step 2
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const progressValue = ((currentSentence + 1) / baseSentences.length) * 100;

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Step 2: 标记阅读训练</CardTitle>
        <div className="flex justify-center items-center gap-4 mt-2">
          <Badge variant="secondary">
            进度: {currentSentence + 1} / {baseSentences.length}
          </Badge>
        </div>
        <Progress value={progressValue} className="mt-4" />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="flex justify-center">
          <Timer timer={timer} />
        </div>
        
        {currentSentence < baseSentences.length && (
          <SentenceDisplay
            sentence={baseSentences[currentSentence]}
            mark={getCurrentMark()}
            showMarkButtons={true}
            onMarkUpdate={(mark) => handleMarkUpdate(baseSentences[currentSentence].id, mark)}
            isActive={true}
          />
        )}
        
        <Separator />
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">当前标记</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {progress.marks.map(mark => (
                <div key={mark.sentenceId} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">第{mark.sentenceId}句：</span>
                  {mark.isStuck && <Badge className="bg-yellow-500 hover:bg-yellow-600">✨</Badge>}
                  {mark.isUnderstood && <Badge className="bg-green-500 hover:bg-green-600">⭕</Badge>}
                  {mark.isNotUnderstood && <Badge className="bg-red-500 hover:bg-red-600">❌</Badge>}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
};