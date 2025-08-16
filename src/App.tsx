import { useState, useEffect } from 'react';
import { useProgress } from './hooks/useProgress';
import { Step1 } from './components/steps/Step1';
import { Step2 } from './components/steps/Step2';
import { Step3 } from './components/steps/Step3';
import { Step4 } from './components/steps/Step4';
import { Step5 } from './components/steps/Step5';
import { Step6 } from './components/steps/Step6';
import { Step7 } from './components/steps/Step7';
import './styles/index.css';

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
        {/* <div className="progress-indicator">
          <span>当前步骤: Step {progress.currentStep}</span>
          {userPath && <span>训练路径: {userPath}</span>}
        </div> */}
        <div className="header-buttons">
          <button onClick={handleReset} className="reset-button">
            重置进度
          </button>
        </div>
      </header>

      <main className="app-main">{renderCurrentStep()}</main>

      <footer className="app-footer">
        <div className="step-progress">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={`step-${step}-${resetKey}`}
              className={`step-indicator ${
                progress.completedSteps.includes(step)
                  ? "completed"
                  : step === progress.currentStep
                  ? "current"
                  : "pending"
              }`}
              onClick={() => jumpToStep(step)}
              title={`点击跳转到 Step ${step}`}
            >
              {step}
            </div>
          ))}
        </div>
        <div className="footer-info">
          <div className="version-info">
            <span className="version-label">版本</span>
            <span className="version-number">v1.0.0</span>
          </div>
          <div className="github-link">
            <a 
              href="https://github.com/your-username/vibe-english-understanding" 
              target="_blank" 
              rel="noopener noreferrer"
              title="查看源代码"
            >
              <svg className="github-icon" viewBox="0 0 24 24" fill="currentColor">
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
