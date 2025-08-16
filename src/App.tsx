import { useState, useEffect } from 'react';
import { useProgress } from './hooks/useProgress';
import { Step1 } from './components/steps/Step1';
import { Step2 } from './components/steps/Step2';
import { Step3 } from './components/steps/Step3';
import { Step4 } from './components/steps/Step4';
import { Step5 } from './components/steps/Step5';
import { Step6 } from './components/steps/Step6';
import { Step7 } from './components/steps/Step7';
import { Button } from './components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { CustomProgress } from './components/CustomProgress';
import './index.css';

function App() {
  const { progress, saveProgress, resetProgress } = useProgress();
  const [userPath, setUserPath] = useState<'A' | 'B' | 'C' | null>(progress.userPath);
  const [resetKey, setResetKey] = useState(0);

  useEffect(() => {
    setUserPath(progress.userPath);
  }, [progress.userPath]);

  const handleStepComplete = (newStep: number) => {
    const newProgress = {
      ...progress,
      currentStep: newStep,
      currentSentence: 0,
      completedSteps: [...progress.completedSteps, progress.currentStep]
    };
    saveProgress(newProgress);
  };

  const handleStep2Complete = (path: 'A' | 'B' | 'C') => {
    setUserPath(path);
    const newProgress = {
      ...progress,
      currentStep: 3,
      currentSentence: 0,
      userPath: path,
      completedSteps: [...progress.completedSteps, 2]
    };
    saveProgress(newProgress);
  };

  const getCrossCount = () => {
    return progress.marks.filter(m => m.isNotUnderstood).length;
  };

  const handleReset = () => {
    if (window.confirm('确定要重置所有训练进度吗？')) {
      resetProgress();
      setUserPath(null);
      setResetKey(prev => prev + 1); // Force remount of step components
    }
  };

  const jumpToStep = (stepNumber: number) => {
    if (stepNumber === progress.currentStep) return;
    
    // Allow jumping to any step that's not the current step
    // This gives users flexibility to navigate training
    const newProgress = {
      ...progress,
      currentStep: stepNumber,
      currentSentence: 0,
      // Mark all previous steps as completed when jumping forward
      completedSteps: stepNumber > progress.currentStep 
        ? [...progress.completedSteps, progress.currentStep] 
        : progress.completedSteps.filter(s => s < stepNumber)
    };
    saveProgress(newProgress);
  };

  const renderCurrentStep = () => {
    switch (progress.currentStep) {
      case 1:
        return <Step1 key={`step1-${resetKey}`} onComplete={() => handleStepComplete(2)} />;
      case 2:
        return <Step2 key={`step2-${resetKey}`} onComplete={handleStep2Complete} />;
      case 3:
        return (
          <Step3 
            key={`step3-${resetKey}`}
            userPath={userPath || 'A'} 
            crossCount={getCrossCount()}
            onComplete={() => handleStepComplete(4)} 
          />
        );
      case 4:
        return (
          <Step4 
            key={`step4-${resetKey}`}
            userPath={userPath || 'A'}
            onComplete={() => handleStepComplete(5)} 
          />
        );
      case 5:
        return <Step5 key={`step5-${resetKey}`} onComplete={() => handleStepComplete(6)} />;
      case 6:
        return <Step6 key={`step6-${resetKey}`} onComplete={() => handleStepComplete(7)} />;
      case 7:
        return <Step7 key={`step7-${resetKey}`} onComplete={() => handleStepComplete(8)} />;
      default:
        return (
          <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-2xl w-full mx-auto">
              <CardHeader className="text-center">
                <CardTitle className="text-4xl font-bold text-slate-900 mb-2">🎉 训练完成！</CardTitle>
                <p className="text-lg text-slate-700">恭喜你完成了完整的英语理解能力训练！</p>
              </CardHeader>
              <CardContent>
                <div className="mb-8">
                  <h3 className="text-xl font-semibold text-slate-800 mb-4">训练成果：</h3>
                  <div className="space-y-2">
                    <Badge variant="outline" className="w-full justify-start text-left py-2 px-3">✅ 基础2秒阅读训练</Badge>
                    <Badge variant="outline" className="w-full justify-start text-left py-2 px-3">✅ 理解标记和路径分析</Badge>
                    <Badge variant="outline" className="w-full justify-start text-left py-2 px-3">✅ 倒计时循环强化训练</Badge>
                    <Badge variant="outline" className="w-full justify-start text-left py-2 px-3">✅ 深度理解验证</Badge>
                    <Badge variant="outline" className="w-full justify-start text-left py-2 px-3">✅ 休息恢复和最终验证</Badge>
                    <Badge variant="outline" className="w-full justify-start text-left py-2 px-3">✅ 无默念阅读挑战</Badge>
                    <Badge variant="outline" className="w-full justify-start text-left py-2 px-3">✅ 乱码理解终极训练</Badge>
                  </div>
                  <p className="text-slate-700 mt-4">你的英语阅读理解能力应该有了显著提升！</p>
                </div>
                <div className="flex justify-center">
                  <Button 
                    onClick={handleReset}
                    variant="default"
                    size="lg"
                  >
                    重新开始训练
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl shadow-2xl max-w-6xl mx-auto my-8 overflow-hidden">
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 px-6 py-4 flex justify-between items-center text-white shadow-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold">📚</span>
          </div>
          <h1 className="text-2xl font-bold">英语理解力提升训练</h1>
        </div>
        <div className="flex gap-4">
          <Button 
            onClick={handleReset} 
            variant="outline"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 backdrop-blur-sm"
          >
            重置进度
          </Button>
        </div>
      </header>

      <main className="flex-1 p-6 flex justify-center items-start overflow-auto">{renderCurrentStep()}</main>

      <footer className="bg-white/50 backdrop-blur-sm px-8 py-6 border-t border-slate-200">
        <div className="max-w-2xl mx-auto">
          <CustomProgress
            currentStep={progress.currentStep}
            totalSteps={7}
            completedSteps={progress.completedSteps}
            onStepClick={jumpToStep}
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex justify-between items-center text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">版本</Badge>
            <span>v1.0.0</span>
          </div>
          <div>
            <a 
              href="https://github.com/your-username/vibe-english-understanding" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              title="查看源代码"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span>源代码</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
