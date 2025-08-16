import React, { useState, useEffect } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { baseSentences } from '../../data/sentences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface Step1Props {
  onComplete: () => void;
}

export const Step1: React.FC<Step1Props> = ({ onComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const { timer, start } = useTimer(2);

  useEffect(() => {
    if (isStarted && timer.timeLeft === 0 && !timer.isRunning) {
      if (currentSentence < baseSentences.length - 1) {
        setCurrentSentence(prev => prev + 1);
        start(2);
      } else {
        onComplete();
      }
    }
  }, [timer.timeLeft, timer.isRunning, currentSentence, isStarted, start, onComplete]);

  const handleStart = () => {
    setIsStarted(true);
    start(2);
  };

  if (!isStarted) {
    return (
      <Card className="w-full max-w-6xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl md:text-3xl">Step 1: 基础阅读训练</CardTitle>
          <CardDescription className="text-lg">
            每句2秒左右，读完就读下一句，2秒没读完直接下一句，不要停留。
          </CardDescription>
        </CardHeader>
        
        <CardContent className="text-center space-y-4">
          <div>
            <p className="text-muted-foreground mb-2">准备好了吗？点击开始按钮开始训练。</p>
            <p className="text-sm text-muted-foreground">共16句话，每句话2秒时间限制。</p>
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-center">
          <Button size="lg" onClick={handleStart}>
            开始训练
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const progressValue = ((currentSentence + 1) / baseSentences.length) * 100;

  return (
    <Card className="w-full max-w-7xl">
      <CardHeader>
        <CardTitle className="text-3xl text-center">Step 1: 基础阅读训练</CardTitle>
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
        
        <SentenceDisplay
          sentence={baseSentences[currentSentence]}
          isActive={true}
        />
      </CardContent>
    </Card>
  );
};