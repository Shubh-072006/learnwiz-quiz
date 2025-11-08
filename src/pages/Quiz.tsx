import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Question } from "@/types";

export default function Quiz() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const quizData = sessionStorage.getItem("generatedQuiz");
    
    if (!quizData) {
      toast({
        title: "No quiz found",
        description: "Please process a document first.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    try {
      const parsedQuiz = JSON.parse(quizData);
      const quizArray = parsedQuiz.quiz || parsedQuiz;
      
      if (!Array.isArray(quizArray) || quizArray.length === 0) {
        throw new Error("Invalid quiz format");
      }
      
      const formattedQuestions = quizArray.map((q: any, index: number) => ({
        id: index + 1,
        question: q.question || q.text,
        options: q.options || q.choices || [],
        correctAnswer: typeof q.correctAnswer === 'number' ? q.correctAnswer : (q.correct || 0),
        difficulty: q.difficulty || "medium",
        explanation: q.explanation || "No explanation available.",
        topic: q.topic || "General"
      }));
      
      setQuestions(formattedQuestions);
      setAnswers(Array(formattedQuestions.length).fill(null));
    } catch (error) {
      toast({
        title: "Error loading quiz",
        description: "Failed to parse quiz data.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading quiz...</p>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];
  const isAnswered = selectedAnswer !== null;
  const isCorrect = selectedAnswer === question.correctAnswer;
  const progress = ((currentQuestion + 1) / questions.length) * 100;

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
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1);
      setSelectedAnswer(answers[currentQuestion + 1]);
      setShowExplanation(answers[currentQuestion + 1] !== null);
    } else {
      navigate("/results", { state: { answers, questions } });
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
              Question {currentQuestion + 1} of {questions.length}
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
            {currentQuestion === questions.length - 1
              ? "View Results"
              : "Next Question"}
          </Button>
        </div>
      </div>
    </div>
  );
}
