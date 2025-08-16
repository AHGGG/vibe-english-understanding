import { useState, useEffect } from 'react';
import { useProgress } from './hooks/useProgress';
import { Step1 } from './components/steps/Step1';
import { Step2 } from './components/steps/Step2';
import { Step3 } from './components/steps/Step3';
import { Step4 } from './components/steps/Step4';
import { Step5 } from './components/steps/Step5';
import { Step6 } from './components/steps/Step6';
import { Step7 } from './components/steps/Step7';
import './App.css';

function App() {
  const { progress, saveProgress, resetProgress } = useProgress();
  const [userPath, setUserPath] = useState<'A' | 'B' | 'C' | null>(progress.userPath);

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
    }
  };

  const renderCurrentStep = () => {
    switch (progress.currentStep) {
      case 1:
        return <Step1 onComplete={() => handleStepComplete(2)} />;
      case 2:
        return <Step2 onComplete={handleStep2Complete} />;
      case 3:
        return (
          <Step3 
            userPath={userPath || 'A'} 
            crossCount={getCrossCount()}
            onComplete={() => handleStepComplete(4)} 
          />
        );
      case 4:
        return (
          <Step4 
            userPath={userPath || 'A'}
            onComplete={() => handleStepComplete(5)} 
          />
        );
      case 5:
        return <Step5 onComplete={() => handleStepComplete(6)} />;
      case 6:
        return <Step6 onComplete={() => handleStepComplete(7)} />;
      case 7:
        return <Step7 onComplete={() => handleStepComplete(8)} />;
      default:
        return (
          <div className="completion-screen">
            <div className="completion-content">
              <h1>🎉 训练完成！</h1>
              <p>恭喜你完成了完整的英语理解能力训练！</p>
              <div className="training-summary">
                <h3>训练成果：</h3>
                <ul>
                  <li>✅ 基础2秒阅读训练</li>
                  <li>✅ 理解标记和路径分析</li>
                  <li>✅ 倒计时循环强化训练</li>
                  <li>✅ 深度理解验证</li>
                  <li>✅ 休息恢复和最终验证</li>
                  <li>✅ 无默念阅读挑战</li>
                  <li>✅ 乱码理解终极训练</li>
                </ul>
                <p>你的英语阅读理解能力应该有了显著提升！</p>
              </div>
              <button onClick={handleReset} className="reset-btn">
                重新开始训练
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>英语理解力提升训练</h1>
        <div className="progress-indicator">
          <span>当前步骤: Step {progress.currentStep}</span>
          {userPath && <span>训练路径: {userPath}</span>}
        </div>
        <button onClick={handleReset} className="reset-button">
          重置进度
        </button>
      </header>

      <main className="app-main">
        {renderCurrentStep()}
      </main>

      <footer className="app-footer">
        <div className="step-progress">
          {[1, 2, 3, 4, 5, 6, 7].map(step => (
            <div 
              key={step}
              className={`step-indicator ${
                progress.completedSteps.includes(step) 
                  ? 'completed' 
                  : step === progress.currentStep 
                    ? 'current' 
                    : 'pending'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </footer>
    </div>
  );
}

export default App;
