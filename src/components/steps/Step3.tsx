import React, { useState, useEffect } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { pathASentences, pathBSentences, pathCSentences } from '../../data/sentences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

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

  const handleTimeUp = React.useCallback(() => {
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
  }, [cycleCount, onComplete, understoodSentences, currentSentence, sentences, start, timeLimit]);

  useEffect(() => {
    if (isStarted && timer.timeLeft === 0 && !timer.isRunning) {
      // 时间到了，没理解，进行下一句或循环
      handleTimeUp();
    }
  }, [timer.timeLeft, timer.isRunning, isStarted, handleTimeUp]);

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
      <div className="w-full max-w-6xl">
        <Card className="w-full mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Step 3: 倒计时循环训练</CardTitle>
            <CardDescription className="text-lg">{getPathDescription()}</CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">训练规则</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2"
                >
                <Badge variant="secondary">规则1</Badge>
                <span>倒计时时间：<Badge className="bg-primary">{timeLimit}秒</Badge> (X标记数 ÷ 2)</span>
              </div>
              <div className="flex items-start gap-2"
                >
                <Badge variant="secondary">规则2</Badge>
                <span>倒计时内没理解，直接下一句，倒计时重新开始</span>
              </div>
              <div className="flex items-start gap-2"
                >
                <Badge variant="secondary">规则3</Badge>
                <span>理解一句后，只操作剩余未理解的句子</span>
              </div>
              <div className="flex items-start gap-2"
                >
                <Badge variant="secondary">规则4</Badge>
                <span>循环次数不可超过<Badge className="bg-destructive">25次</Badge></span>
              </div>
              <div className="flex items-start gap-2"
                >
                <Badge variant="secondary">要求</Badge>
                <span>彻底理解每句话的含义和关系</span>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">你要训练的句子：</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sentences.map((sentence) => (
                  <Card key={sentence.id} className="p-4 hover:shadow-md transition-shadow">
                    <CardContent className="p-0">
                      <p className="text-muted-foreground">{sentence.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </CardContent>
          
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={handleStart}>
              开始倒计时训练
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const cycleProgress = (cycleCount / 25) * 100;
  const understoodProgress = (understoodSentences.size / sentences.length) * 100;

  return (
    <div className="w-full max-w-6xl">
      <Card className="w-full max-w-6xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Step 3: 倒计时循环训练</CardTitle>          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-2"
              >
              循环次数: {cycleCount}/25
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2"
              >
              已理解: {understoodSentences.size}/{sentences.length}
            </Badge>
          </div>        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">循环进度</label>
              <Progress value={cycleProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">{cycleCount}/25 次</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">理解进度</label>
              <Progress value={understoodProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">{understoodSentences.size}/{sentences.length} 句</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="w-full max-w-6xl">
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Timer timer={timer} />
          </div>
          
          <SentenceDisplay
            sentence={sentences[currentSentence]}
            isActive={true}
            className={understoodSentences.has(currentSentence) ? 'opacity-50' : ''}
          />
          
          <div className="flex justify-center">
            <Button 
              onClick={handleUnderstood}
              disabled={understoodSentences.has(currentSentence)}
              size="lg"
              className={understoodSentences.has(currentSentence) 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'}
            >
              {understoodSentences.has(currentSentence) ? '已理解' : '我已完全理解这句话'}
            </Button>
          </div>
          
          {understoodSentences.size > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">已理解的句子</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Array.from(understoodSentences).map(index => (
                    <Badge key={index} variant="outline" className="bg-green-100 text-green-800 border-green-300 justify-center py-2"
                      >
                      ✓ 第{sentences[index].id}句
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};