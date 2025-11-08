import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, FileText, Brain, ListChecks } from "lucide-react";
import { api } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

const steps = [
  { icon: FileText, label: "Processing document", duration: 1000 },
  { icon: Brain, label: "Generating summary", duration: 3000 },
  { icon: ListChecks, label: "Creating quiz questions", duration: 3000 },
];

export default function Processing() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const processDocument = async () => {
      try {
        const extractedText = sessionStorage.getItem("extractedText");
        if (!extractedText) {
          toast({
            title: "Error",
            description: "No document found. Please upload a file.",
            variant: "destructive",
          });
          navigate("/");
          return;
        }

        // Step 1: Start processing
        setProgress(10);
        setCurrentStep(0);
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Step 2: Generate summary
        setCurrentStep(1);
        setProgress(30);
        const summaryResult = await api.generateSummary(extractedText);
        sessionStorage.setItem("generatedSummary", JSON.stringify(summaryResult));
        setProgress(60);

        // Step 3: Generate quiz
        setCurrentStep(2);
        const quizResult = await api.generateQuiz(extractedText);
        sessionStorage.setItem("generatedQuiz", JSON.stringify(quizResult));
        setProgress(100);

        // Navigate to summary
        setTimeout(() => navigate("/summary"), 500);
      } catch (error) {
        toast({
          title: "Processing failed",
          description: error instanceof Error ? error.message : "Please try again",
          variant: "destructive",
        });
        setTimeout(() => navigate("/"), 2000);
      }
    };

    processDocument();
  }, [navigate, toast]);

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
