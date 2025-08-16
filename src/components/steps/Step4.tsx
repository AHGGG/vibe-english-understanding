import React, { useState } from 'react';
import { SentenceDisplay } from '../SentenceDisplay';
import { Timer } from '../Timer';
import { useTimer } from '../../hooks/useTimer';
import { pathASentences, pathBSentences, pathCSentences } from '../../data/sentences';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface Step4Props {
  userPath: 'A' | 'B' | 'C';
  onComplete: () => void;
}

export const Step4: React.FC<Step4Props> = ({ userPath, onComplete }) => {
  const [currentSentence, setCurrentSentence] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [isUnlimitedMode, setIsUnlimitedMode] = useState(false);
  const [verifiedSentences, setVerifiedSentences] = useState<Set<number>>(new Set());
  
  const { timer, start } = useTimer(4);

  const getSentencesForPath = () => {
    switch (userPath) {
      case 'A': return pathASentences;
      case 'B': return pathBSentences;
      case 'C': return pathCSentences;
      default: return pathASentences;
    }
  };

  const sentences = getSentencesForPath();

  const handleStartUnlimited = () => {
    setIsUnlimitedMode(true);
    setIsStarted(true);
  };

  const handleStartVerification = () => {
    setIsUnlimitedMode(false);
    setIsStarted(true);
    start(4);
  };

  const handleSentenceVerified = () => {
    const newVerified = new Set(verifiedSentences);
    newVerified.add(currentSentence);
    setVerifiedSentences(newVerified);

    if (newVerified.size === sentences.length) {
      onComplete();
    } else {
      // 切换到下一个未验证的句子
      const nextIndex = sentences.findIndex((_, index) => !newVerified.has(index));
      if (nextIndex !== -1) {
        setCurrentSentence(nextIndex);
        if (!isUnlimitedMode) {
          start(4);
        }
      }
    }
  };

  const handleNextSentence = () => {
    if (currentSentence < sentences.length - 1) {
      setCurrentSentence(prev => prev + 1);
      if (!isUnlimitedMode) {
        start(4);
      }
    }
  };

  if (!isStarted) {
    return (
      <div className="w-full max-w-6xl">
        <Card className="w-full">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">Step 4: 深度理解验证</CardTitle>
            <CardDescription className="text-lg">
              如果Step3没有完全理解所有句子，现在给你无限时间深度理解。
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-lg">训练说明</CardTitle>
          </CardHeader>          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Badge variant="secondary">方法</Badge>
                <span>可以画思维导图、逻辑图等任何方式帮助理解</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">要求</Badge>
                <span><Badge className="bg-primary">4秒内</Badge>能清晰透彻地理解句子含义</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">验证</Badge>
                <span>理解后需要验证：4秒内阅读是否能完成理解</span>
              </div>
              <div className="flex items-start gap-2">
                <Badge variant="secondary">继续</Badge>
                <span>如果4秒内不能理解，继续深度学习</span>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-base">需要深度理解的句子：</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {sentences.map((sentence) => (
                  <Card key={sentence.id} className="p-4 hover:shadow-md transition-shadow"
                    >
                    <CardContent className="p-0"
                      >
                      <p className="text-muted-foreground">{sentence.text}</p>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          </CardContent>
          
          <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button size="lg" onClick={handleStartUnlimited} variant="secondary"
              >
              开始无限时理解模式
            </Button>
            <Button size="lg" onClick={handleStartVerification}
              >
              开始4秒验证模式
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  const verifiedProgress = (verifiedSentences.size / sentences.length) * 100;

  return (
    <div className="w-full max-w-6xl">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl">Step 4: 深度理解验证</CardTitle>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-4">
            <Badge 
              variant={isUnlimitedMode ? "default" : "secondary"} 
              className="text-lg px-4 py-2"
            >
              {isUnlimitedMode ? '无限时理解模式' : '4秒验证模式'}
            </Badge>
            <Badge variant="secondary" className="text-lg px-4 py-2"
              >
              已验证: {verifiedSentences.size}/{sentences.length}
            </Badge>
          </div>
          <Progress value={verifiedProgress} className="mt-4" />
        </CardHeader>
      </Card>
      
      <Card>
        <CardContent className="space-y-6">
          <div className="flex justify-center">
            {!isUnlimitedMode && <Timer timer={timer} />}
          </div>
          
          <SentenceDisplay
            sentence={sentences[currentSentence]}
            isActive={true}
            className={verifiedSentences.has(currentSentence) ? 'opacity-50' : ''}
          />
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {isUnlimitedMode ? (
              <>
                <Button 
                  onClick={() => setIsUnlimitedMode(false)}
                  variant="outline"
                  size="lg"
                >
                  切换到4秒验证模式
                </Button>
                <Button 
                  onClick={handleNextSentence}
                  variant="secondary"
                  size="lg"
                >
                  下一句
                </Button>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => setIsUnlimitedMode(true)}
                  variant="outline"
                  size="lg"
                >
                  需要更多时间理解
                </Button>
                <Button 
                  onClick={handleSentenceVerified}
                  disabled={verifiedSentences.has(currentSentence)}
                  size="lg"
                  className={verifiedSentences.has(currentSentence) 
                    ? 'bg-muted text-muted-foreground cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 text-white'}
                >
                  {verifiedSentences.has(currentSentence) ? '已验证' : '我已在4秒内完全理解'}
                </Button>
              </>
            )}
          </div>
          
          <Card className="w-full bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800">理解要求</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-blue-800 leading-relaxed">
                能够立刻回答：联邦、法院、委员会、社区之间的任何关系，谁支持法案？谁反对法案？谁赞同谁？谁反对谁？等等关系都要立刻反应出来。
              </p>
            </CardContent>
          </Card>

          {verifiedSentences.size > 0 && (
            <Card className="w-full bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-green-800">已验证理解的句子</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {Array.from(verifiedSentences).map(index => (
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