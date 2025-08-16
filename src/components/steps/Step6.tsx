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

interface Step6Props {
  onComplete: () => void;
}

export const Step6: React.FC<Step6Props> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'preparation' | 'unlimited' | 'verification' | 'no-voice' | 'completed'>('preparation');
  const [currentSentence, setCurrentSentence] = useState(0);
  const [failedAttempts, setFailedAttempts] = useState(0);
  
  const readTimer = useTimer(2);
  const finalTimer = useTimer(4);
  const { progress, updateMark } = useProgress();

  useEffect(() => {
    if (phase === 'verification' && readTimer.timer.timeLeft === 0 && !readTimer.timer.isRunning) {
      // 2秒验证时间到，确保进度条显示100%后进入下一句
      if (currentSentence < baseSentences.length - 1) {
        setCurrentSentence(prev => prev + 1);
        readTimer.start(2);
      } else {
        // 验证完成，检查是否可以进入无默念阅读
        const ununderstoodMarks = progress.marks.filter(m => m.isNotUnderstood);
        if (ununderstoodMarks.length === 0) {
          setPhase('no-voice');
          setCurrentSentence(0);
        } else {
          alert('还有句子未理解，请继续练习');
          setPhase('unlimited');
        }
      }
    }
  }, [readTimer.timer.timeLeft, readTimer.timer.isRunning, currentSentence, phase, progress.marks, readTimer]);

  useEffect(() => {
    if (phase === 'no-voice' && finalTimer.timer.timeLeft === 0) {
      // 第16句4秒时间到
      setPhase('completed');
    }
  }, [finalTimer.timer.timeLeft, phase, finalTimer]);

  const handleStartUnlimited = () => {
    setPhase('unlimited');
  };

  const handleStartVerification = () => {
    setPhase('verification');
    setCurrentSentence(0);
    readTimer.start(2);
  };


  const handleNoVoiceNext = () => {
    if (currentSentence < 14) { // 1-15句不限时
      setCurrentSentence(prev => prev + 1);
    } else if (currentSentence === 14) { // 第15句，准备第16句4秒限时
      setCurrentSentence(15);
      finalTimer.start(4);
    }
  };

  const handleNoVoiceFailed = () => {
    // 默念了，从第一句重来
    setFailedAttempts(prev => prev + 1);
    setCurrentSentence(0);
    alert('检测到默念，从第一句重新开始');
  };

  const handleMarkUpdate = (sentenceId: number, mark: { isNotUnderstood: boolean; isStuck: boolean; isUnderstood: boolean }) => {
    updateMark(sentenceId, mark);
  };

  const getCurrentMark = () => {
    return progress.marks.find(m => m.sentenceId === baseSentences[currentSentence].id);
  };

  if (phase === 'preparation') {
    return (
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Step 6: 无默念阅读训练</CardTitle>
            <CardDescription className="text-lg">
              最终挑战：以心中无默念的形式进行阅览
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">训练规则</CardTitle>
          </CardHeader>          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Badge variant="secondary">步骤1</Badge>
                <span>首先确保所有句子都能在2秒内理解</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">步骤2</Badge>
                <span>进行无默念阅读：第1-15句不限时，第16句限制4秒</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-red-500 hover:bg-red-600">⚠️</Badge>
                <span>任何一句有默念，必须从第一句重来</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">重读</Badge>
                <span>只有阅览但未理解的句子可以重读，默念的必须重来</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">难点</Badge>
                <span>这是最痛苦的阶段，需要高度集中控制大脑</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button size="lg" onClick={handleStartUnlimited} variant="secondary"
              >
              先无限时练习理解
            </Button>
            <Button size="lg" onClick={handleStartVerification}
              >
              开始2秒验证测试
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (phase === 'unlimited') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Step 6: 无限时练习</CardTitle>
            <CardDescription className="text-lg">
              可以使用思维导图等任何方式，确保完全理解所有句子
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardContent className="space-y-6">
            <SentenceDisplay
              sentence={baseSentences[currentSentence]}
              mark={getCurrentMark()}
              showMarkButtons={true}
              onMarkUpdate={(mark) => handleMarkUpdate(baseSentences[currentSentence].id, mark)}
              isActive={true}
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center"
              >
              <Button 
                onClick={() => setCurrentSentence(Math.max(0, currentSentence - 1))}
                variant="outline"
                size="lg"
              >
                上一句
              </Button>
              <Button 
                onClick={() => setCurrentSentence(Math.min(baseSentences.length - 1, currentSentence + 1))}
                variant="outline"
                size="lg"
              >
                下一句
              </Button>
              <Button 
                onClick={handleStartVerification} 
                size="lg"
              >
                开始2秒验证
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'verification') {
    const verificationProgress = ((currentSentence + 1) / baseSentences.length) * 100;
    
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Step 6: 2秒验证测试</CardTitle>
            <div className="flex justify-center items-center gap-4 mt-2">
              <Badge variant="secondary">
                进度: {currentSentence + 1} / {baseSentences.length}
              </Badge>
            </div>
            <Progress value={verificationProgress} className="mt-4" />
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
                <p className="text-blue-800 font-medium text-center">
                  所有句子必须在2秒内完全理解才能进入无默念训练
                </p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (phase === 'no-voice') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl text-center">Step 6: 无默念阅读训练</CardTitle>
            <div className="flex justify-between items-center text-sm text-blue-600 font-medium mt-2">
              <Badge variant="secondary">
                进度: {currentSentence + 1} / {baseSentences.length}
              </Badge>
              <Badge variant="destructive">
                失败次数: {failedAttempts}
              </Badge>
            </div>
          </CardHeader>
        </Card>
        
        <Card>
          <CardContent className="space-y-6">
            {currentSentence === 15 && (
              <div className="flex justify-center">
                <Timer timer={finalTimer.timer} />
              </div>
            )}
            
            <SentenceDisplay
              sentence={baseSentences[currentSentence]}
              isActive={true}
            />
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleNoVoiceNext} 
                disabled={currentSentence >= 15}
                size="lg"
              >
                {currentSentence < 14 ? '下一句（无默念）' : currentSentence === 14 ? '进入第16句（4秒限时）' : ''}
              </Button>
              <Button 
                onClick={handleNoVoiceFailed} 
                variant="destructive"
                size="lg"
              >
                我默念了（重新开始）
              </Button>
            </div>
            
            <Card className="bg-red-50 border-red-200">
              <CardContent className="pt-6 text-center">
                <p className="text-red-800 font-medium mb-2">⚠️ 严格监控：不能有任何默念！一旦默念必须从第一句重来</p>
                <p className="text-red-700">当前句子：{currentSentence < 15 ? '不限时' : '4秒限时'}</p>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Step 6: 完成！</CardTitle>
          <CardDescription className="text-green-600 text-lg font-medium">
            恭喜完成无默念阅读训练！
          </CardDescription>
        </CardHeader>
      </Card>
      
      <Card>
        <CardContent className="text-center space-y-6">
          <div className="space-y-4">
            <CardTitle className="text-2xl text-green-800">🎉 训练成果</CardTitle>
            <div className="space-y-2 text-muted-foreground">
              <p>你已经成功完成了第16句话的无默念阅读训练！</p>
              <p className="font-semibold text-blue-600">失败尝试次数: {failedAttempts}</p>
              <p>现在可以进入最终的乱码训练阶段。</p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <Button 
              onClick={onComplete} 
              size="lg"
              className="px-8 bg-purple-600 hover:bg-purple-700 text-white"
            >
              继续到Step 7
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};