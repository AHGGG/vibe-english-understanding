import React from 'react';
import { Progress } from './ui/progress';
import { Badge } from './ui/badge';
import { Card, CardContent } from './ui/card';

interface CustomProgressProps {
  currentStep: number;
  totalSteps: number;
  completedSteps: number[];
  onStepClick: (step: number) => void;
}

export const CustomProgress: React.FC<CustomProgressProps> = ({
  currentStep,
  totalSteps,
  completedSteps,
  onStepClick,
}) => {
  const progressPercentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-slate-700">训练进度</h3>
        <Badge variant="outline" className="text-xs">
          {currentStep} / {totalSteps}
        </Badge>
      </div>
      
      <Progress value={progressPercentage} className="h-2" />
      
      <Card className="border-0 shadow-none bg-transparent">
        <CardContent className="p-4">
          <div className="relative flex items-center">
            {Array.from({ length: totalSteps }, (_, i) => {
              const step = i + 1;
              const isCompleted = completedSteps.includes(step);
              const isCurrent = step === currentStep;
              
              return (
                <React.Fragment key={step}>
                  <div className="flex flex-col items-center">
                    <button
                      onClick={() => onStepClick(step)}
                      className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all
                        ${isCompleted 
                          ? 'bg-green-500 text-white hover:bg-green-600' 
                          : isCurrent 
                            ? 'bg-blue-600 text-white scale-110 ring-2 ring-blue-200' 
                            : 'bg-slate-200 text-slate-600 hover:bg-slate-300'
                        }
                      `}
                      title={`Step ${step}`}
                    >
                      {step}
                    </button>
                  </div>
                  
                  {step < totalSteps && (
                    <div 
                      className={`
                        flex-1 h-1 mx-1
                        ${step <= Math.max(...completedSteps, currentStep) 
                          ? 'bg-green-400' 
                          : 'bg-slate-300'
                        }
                      `}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};