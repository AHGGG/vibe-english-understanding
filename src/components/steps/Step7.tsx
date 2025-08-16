import React, { useState } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { chaosTrainingSentences } from '../../data/sentences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

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
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Step 7: 乱码训练</CardTitle>
            <CardDescription className="text-lg">
              最终挑战：理解用乱码替换的句子
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">训练说明</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-start gap-2">
                <Badge variant="secondary">1</Badge>
                <span>按顺序阅读给定的文段，慢慢读</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">2</Badge>
                <span>该段心中可以默念，但必须做到理解才可进入下一句</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-red-500 hover:bg-red-600">⚠️</Badge>
                <span>绝不可手写思维导图</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge className="bg-orange-500 hover:bg-orange-600">🔑</Badge>
                <span className="font-semibold">不要把法院、联邦、委员会、社区这些词与乱码脑补替换</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">3</Badge>
                <span>每句都独立，强制自己在理解时剔除乱码和原词的关联性</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">4</Badge>
                <span>只客观理解该句乱码之间的相互联系</span>
              </div>
            </div>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-800 text-base">乱码符号说明：</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-blue-700">৩、₹、Ћ、ঋ、ħ 等符号代表不同的实体，你需要理解它们之间的关系</p>
              </CardContent>
            </Card>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button size="lg" onClick={handleStart}>
              开始乱码训练
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const progressValue = ((currentSentence + 1) / chaosTrainingSentences.length) * 100;
  const understoodProgress = (understoodSentences.size / chaosTrainingSentences.length) * 100;

  return (
    <div className="w-full max-w-6xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Step 7: 乱码训练</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              进度: {currentSentence + 1} / {chaosTrainingSentences.length}
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2">
              已理解: {understoodSentences.size} / {chaosTrainingSentences.length}
            </Badge>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">阅读进度</label>
              <Progress value={progressValue} className="h-2" />
              <p className="text-sm text-muted-foreground">{currentSentence + 1}/{chaosTrainingSentences.length} 句</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">理解进度</label>
              <Progress value={understoodProgress} className="h-2" />
              <p className="text-sm text-muted-foreground">{understoodSentences.size}/{chaosTrainingSentences.length} 句</p>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      <Card>
        <CardContent className="space-y-6">
          <Card className={understoodSentences.has(currentSentence) ? 'bg-green-50 border-green-200' : 'bg-blue-50 border-blue-200'}>
            <CardContent>
              <SentenceDisplay
                sentence={chaosTrainingSentences[currentSentence]}
                isActive={true}
              />
            </CardContent>
          </Card>
          
          {chaosTrainingSentences[currentSentence].original && (
            <Card className="bg-gray-50 border-gray-200">
              <CardContent>
                <details className="text-sm">
                  <summary className="cursor-pointer text-gray-700 hover:text-gray-900 font-medium">原始句子参考（仅供对比，不要依赖）</summary>
                  <p className="mt-2 text-gray-600">{chaosTrainingSentences[currentSentence].original}</p>
                </details>
              </CardContent>
            </Card>
          )}
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={handlePrevious} 
              disabled={currentSentence === 0}
              variant="outline"
              size="lg"
            >
              上一句
            </Button>
            <Button 
              onClick={handleUnderstood}
              disabled={understoodSentences.has(currentSentence)}
              size="lg"
              className={understoodSentences.has(currentSentence) 
                ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                : 'bg-green-600 hover:bg-green-700 text-white'}
            >
              {understoodSentences.has(currentSentence) ? '已理解' : '我已理解这句乱码的含义'}
            </Button>
            <Button 
              onClick={handleNext} 
              disabled={currentSentence >= chaosTrainingSentences.length - 1}
              variant="outline"
              size="lg"
            >
              下一句
            </Button>
          </div>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent>
              <p className="font-semibold text-red-800 mb-2">⚠️ 重要提醒：</p>
              <ul className="space-y-1 text-red-700">
                <li>不要将乱码符号与原词进行关联</li>
                <li>独立理解每个乱码符号之间的逻辑关系</li>
                <li>这种训练模拟考场上的绝望感觉，克服它！</li>
              </ul>
            </CardContent>
          </Card>
          
          {understoodSentences.size > 0 && (
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">已理解的句子：</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {Array.from(understoodSentences).map(index => (
                    <Badge key={index} variant="outline" className="bg-green-100 text-green-800 border-green-300 justify-center py-2">
                      ✓ 第{index + 1}句乱码
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
          
          {understoodSentences.size === chaosTrainingSentences.length && (
            <Card className="bg-green-50 border-green-200">
              <CardContent className="text-center space-y-6 pt-6">
                <CardTitle className="text-2xl text-green-800">🎉 恭喜完成所有训练！</CardTitle>
                <p className="text-muted-foreground">你已经完成了完整的英语理解能力训练！</p>
                <div className="flex justify-center">
                  <Button 
                    onClick={onComplete} 
                    size="lg"
                    className="px-8 bg-green-600 hover:bg-green-700 text-white"
                  >
                    完成训练
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};