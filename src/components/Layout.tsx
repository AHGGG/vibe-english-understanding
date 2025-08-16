import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { CustomProgress } from './CustomProgress';

interface LayoutProps {
  children: React.ReactNode;
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
  onReset: () => void;
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick,
  onReset,
}) => {
  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Fixed Header */}
      <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-600 px-4 sm:px-6 py-4 flex justify-between items-center text-white shadow-lg flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold">📚</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold">英语理解力提升训练</h1>
        </div>
        <Button 
          onClick={onReset} 
          variant="outline"
          size="sm"
          className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 backdrop-blur-sm"
        >
          重置进度
        </Button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="container mx-auto px-4 sm:px-6 py-6 h-full">
          <div className="max-w-4xl mx-auto h-full flex items-center justify-center">
            {children}
          </div>
        </div>
      </main>

      {/* Fixed Footer with Progress */}
      <footer className="bg-white/80 backdrop-blur-sm px-4 sm:px-8 py-4 sm:py-6 border-t border-slate-200 flex-shrink-0">
        <div className="max-w-2xl mx-auto">
          <CustomProgress
            currentStep={currentStep}
            totalSteps={totalSteps}
            completedSteps={completedSteps}
            onStepClick={onStepClick}
          />
        </div>
        
        <Separator className="my-4" />
        
        <div className="flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-slate-600">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">版本</Badge>
            <span>v1.0.0</span>
          </div>
          <div>
            <a 
              href="https://github.com/ahggg/vibe-english-understanding" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600 transition-colors"
              title="查看源代码"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="hidden sm:inline">源代码</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};