import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";

// Mock data - replace with actual API data
const mockQuestions = [
  {
    id: 1,
    question: "What is the primary characteristic of supervised learning?",
    options: [
      "It uses labeled training data",
      "It discovers hidden patterns without labels",
      "It only works with numerical data",
      "It requires no training phase",
    ],
    correctAnswer: 0,
    difficulty: "easy" as const,
    explanation:
      "Supervised learning uses labeled data where both input and output are known during training, allowing the model to learn the mapping between them.",
    topic: "Supervised Learning",
  },
  {
    id: 2,
    question: "Which component is fundamental to neural networks?",
    options: [
      "Decision trees",
      "Interconnected neurons",
      "Linear regression",
      "Rule-based systems",
    ],
    correctAnswer: 1,
    difficulty: "medium" as const,
    explanation:
      "Neural networks are built from interconnected nodes called neurons, organized in layers that process information.",
    topic: "Neural Networks",
  },
  {
    id: 3,
    question:
      "What is the purpose of cross-validation in model evaluation?",
    options: [
      "To increase model complexity",
      "To reduce training time",
      "To assess generalization to unseen data",
      "To eliminate all errors",
    ],
    correctAnswer: 2,
    difficulty: "hard" as const,
    explanation:
      "Cross-validation helps evaluate how well a model will generalize to independent datasets by testing it on different subsets of the training data.",
    topic: "Model Evaluation",
  },
];

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(mockQuestions.length).fill(null)
  );
  const navigate = useNavigate();

  const question = mockQuestions[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = ((currentQuestion + 1) / mockQuestions.length) * 100;

  const handleAnswerSelect = (index: number) => {
    if (!showExplanation) {
      setSelectedAnswer(index);
      setShowExplanation(true);
      const newAnswers = [...answers];
      newAnswers[currentQuestion] = index;
      setAnswers(newAnswers);
    }
  };

  const handleNext = () => {
    if (currentQuestion < mockQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowExplanation(answers[currentQuestion + 1] !== null);
    } else {
      navigate("/results", { state: { answers, questions: mockQuestions } });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1);
      setSelectedAnswer(answers[currentQuestion - 1]);
      setShowExplanation(answers[currentQuestion - 1] !== null);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Badge variant={question.difficulty}>
                {question.difficulty.toUpperCase()}
              </Badge>
              <Badge variant="outline">{question.topic}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {mockQuestions.length}
            </p>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl leading-relaxed">
              {question.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrectOption = index === question.correctAnswer;
              const showCorrect = showExplanation && isCorrectOption;
              const showIncorrect = showExplanation && isSelected && !isCorrect;

              return (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`
                    w-full text-left p-4 rounded-lg border-2 transition-all duration-300
                    ${!showExplanation && "hover:border-primary hover:bg-primary/5"}
                    ${isSelected && !showExplanation && "border-primary bg-primary/5"}
                    ${showCorrect && "border-success bg-success/10"}
                    ${showIncorrect && "border-destructive bg-destructive/10"}
                    ${!isSelected && showExplanation && "opacity-50"}
                    ${showExplanation ? "cursor-default" : "cursor-pointer"}
                  `}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex-1">{option}</span>
                    {showCorrect && (
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                    )}
                    {showIncorrect && (
                      <XCircle className="h-5 w-5 text-destructive flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </CardContent>
        </Card>

        {showExplanation && (
          <Card className="bg-muted/50 border-l-4 border-l-primary animate-in slide-in-from-bottom-4">
            <CardContent className="p-6">
              <div className="flex gap-3">
                <AlertCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="font-medium">Explanation</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {question.explanation}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex gap-3">
          <Button
            onClick={handlePrevious}
            variant="outline"
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            Previous
          </Button>
          <Button
            onClick={handleNext}
            disabled={!isAnswered}
            className="flex-1"
          >
            {currentQuestion === mockQuestions.length - 1
              ? "View Results"
              : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}
