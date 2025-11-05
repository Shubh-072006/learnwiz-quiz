import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, FileText, Brain, ListChecks } from "lucide-react";

const steps = [
  { icon: FileText, label: "Extracting text", duration: 2000 },
  { icon: Brain, label: "Generating summaries", duration: 3000 },
  { icon: ListChecks, label: "Creating MCQs", duration: 2500 },
];

export default function Processing() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const startNextStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        setTimeout(() => navigate("/summary"), 500);
        return;
      }

      const step = steps[stepIndex];
      const progressIncrement = 100 / (step.duration / 50);

      progressTimer = setInterval(() => {
        setProgress((prev) => {
          const next = prev + progressIncrement;
          if (next >= (stepIndex + 1) * (100 / steps.length)) {
            clearInterval(progressTimer);
            return (stepIndex + 1) * (100 / steps.length);
          }
          return next;
        });
      }, 50);

      stepTimer = setTimeout(() => {
        setCurrentStep(stepIndex + 1);
        startNextStep(stepIndex + 1);
      }, step.duration);
    };

    startNextStep(0);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardContent className="p-8 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-bold">Processing Your Document</h2>
            <p className="text-muted-foreground">
              This will only take a moment...
            </p>
          </div>

          <Progress value={progress} className="h-2" />

          <div className="space-y-4">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isComplete = index < currentStep;
              const isCurrent = index === currentStep;

              return (
                <div
                  key={index}
                  className={`
                    flex items-center gap-4 p-4 rounded-lg border transition-all duration-300
                    ${isCurrent ? "bg-primary/5 border-primary scale-[1.02]" : ""}
                    ${isComplete ? "bg-success/5 border-success/20" : "border-border"}
                  `}
                >
                  <div
                    className={`
                      flex items-center justify-center h-12 w-12 rounded-full transition-all duration-300
                      ${isComplete ? "bg-success text-success-foreground" : ""}
                      ${isCurrent ? "bg-primary text-primary-foreground animate-pulse" : ""}
                      ${!isComplete && !isCurrent ? "bg-muted text-muted-foreground" : ""}
                    `}
                  >
                    {isComplete ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`
                        font-medium transition-colors
                        ${isCurrent || isComplete ? "text-foreground" : "text-muted-foreground"}
                      `}
                    >
                      {step.label}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
