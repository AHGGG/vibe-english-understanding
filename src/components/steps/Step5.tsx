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
  }, [readTimer.timer.timeLeft, readTimer.timer.isRunning, currentSentence, isReading, progress.marks, onComplete, readTimer]);

  const handleStartRest = () => {
    setIsResting(true);
    setRestStarted(true);
    restTimer.start(600);
  };

  const handleStartReading = () => {
    setIsReading(true);
    readTimer.start(2);
  };

  const handleMarkUpdate = (sentenceId: number, mark: { isNotUnderstood: boolean; isStuck: boolean; isUnderstood: boolean }) => {
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
      <Card className="w-full max-w-6xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Step 5: 休息与验证</CardTitle>
          <CardDescription className="text-lg">
            恭喜完成Step4！现在需要休息10分钟，然后进行最终验证。
          </CardDescription>
        </CardHeader>

        <CardHeader>
          <CardTitle className="text-lg">为什么要休息？</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-start gap-2">
              <Badge variant="secondary">原因1</Badge>
              <span>如果不休息，大脑会宕机，会出现已经开始不工作的情况，影响训练效果。</span>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary">原因2</Badge>
              <span>休息后，你将以2秒每句的速度重新读一遍16句话，没有理解的打叉X。</span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button size="lg" onClick={handleStartRest}>
            开始10分钟休息
          </Button>
        </CardFooter>
      </Card>
    );
  }

  if (isResting) {
    return (
      <Card className="w-full max-w-6xl">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Step 5: 休息中...</CardTitle>
          <CardDescription className="text-lg">
            请放松大脑，休息{Math.ceil(restTimer.timer.timeLeft / 60)}分钟后继续训练。
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Timer timer={restTimer.timer} />
          </div>

          <div className="text-center space-y-4">
            <CardTitle className="text-2xl">🧠 大脑休息时间</CardTitle>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="space-y-4 pt-6"
              >
                <p className="text-blue-800 text-lg">请不要思考训练内容，让大脑充分休息。</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left"
                >
                  <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                      <CardTitle className="text-green-800 text-base">可以做的事：</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-green-700 space-y-1"
                      >
                        <li>• 喝水</li>
                        <li>• 聊天</li>
                        <li>• 看风景</li>
                        <li>• 听音乐</li>
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-50 border-red-200">
                    <CardHeader>
                      <CardTitle className="text-red-800 text-base">不要做的事：</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-red-700 space-y-1"
                      >
                        <li>• 继续思考句子</li>
                        <li>• 阅读相关内容</li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </div>

          {restTimer.timer.timeLeft === 0 && (
            <div className="flex justify-center">
              <Button size="lg" onClick={() => setIsResting(false)}
              >
                休息完成，开始验证
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (!isReading) {
    return (
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Step 5: 最终验证</CardTitle>
            <CardDescription className="text-lg">
              休息完了！现在以2秒每句的速度读一遍16句话。
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="w-full">
          <CardContent className="space-y-6">
            <div className="text-center"
            >
              <p className="text-muted-foreground text-lg">没有理解的话请打叉X，我们将在Step6中继续处理。</p>
            </div>

            <CardFooter className="flex justify-center"
            >
              <Button size="lg" onClick={handleStartReading}
              >
                开始最终验证
              </Button>
            </CardFooter>
          </CardContent>
        </Card>
      </div>
    );
  }

  const readingProgress = ((currentSentence + 1) / baseSentences.length) * 100;

  return (
    <div className="w-full max-w-6xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Step 5: 最终验证</CardTitle>
          <div className="flex justify-center items-center gap-4 mt-2">
            <Badge variant="secondary">
              进度: {currentSentence + 1} / {baseSentences.length}
            </Badge>
          </div>
          <Progress value={readingProgress} className="mt-4" />
        </CardHeader>
      </Card>

      <Card>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            <Timer timer={readTimer.timer} />
          </div>

          <SentenceDisplay
            sentence={baseSentences[currentSentence]}
            mark={getCurrentMark()}
            showMarkButtons={true}
            onMarkUpdate={(mark) => handleMarkUpdate(baseSentences[currentSentence].id, mark)}
            isActive={true}
          />

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-blue-800 font-medium">未理解句子数量: {getUnunderstoodCount()}</p>
              {getUnunderstoodCount() === 0 && currentSentence === baseSentences.length - 1 && (
                <div className="mt-4 p-4 bg-green-50 rounded-lg text-green-800 font-semibold">
                  🎉 恭喜！所有句子都已理解，可以进入下一步！
                </div>
              )}
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};