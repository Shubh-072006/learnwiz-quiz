import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Download, RotateCcw } from "lucide-react";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { answers, questions } = location.state || { answers: [], questions: [] };

  if (!answers || !questions) {
    navigate("/");
    return null;
  }

  const correctCount = answers.filter(
    (answer: number, index: number) => answer === questions[index].correctAnswer
  ).length;

  const percentage = Math.round((correctCount / questions.length) * 100);
  const passed = percentage >= 60;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return { text: "Outstanding!", color: "text-success" };
    if (percentage >= 70) return { text: "Great Job!", color: "text-success" };
    if (percentage >= 60) return { text: "Good Effort!", color: "text-warning" };
    return { text: "Keep Practicing!", color: "text-destructive" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card className="border-2">
          <CardContent className="p-8">
            <div className="text-center space-y-6">
              <div className={`text-6xl font-bold ${performance.color}`}>
                {percentage}%
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-2">
                  {performance.text}
                </h2>
                <p className="text-muted-foreground">
                  You got {correctCount} out of {questions.length} questions correct
                </p>
              </div>

              <div className="flex items-center justify-center gap-8 pt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-success mb-1">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-2xl font-bold">{correctCount}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Correct</p>
                </div>
                <div className="h-12 w-px bg-border" />
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-destructive mb-1">
                    <XCircle className="h-5 w-5" />
                    <span className="text-2xl font-bold">
                      {questions.length - correctCount}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">Incorrect</p>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={() => navigate("/summary")}
                  variant="outline"
                  className="flex-1"
                >
                  Review Summary
                </Button>
                <Button
                  onClick={() => navigate("/quiz")}
                  className="flex-1"
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Retake Quiz
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Question Review</h3>
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" />
              Export Results
            </Button>
          </div>

          {questions.map((question: any, index: number) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            return (
              <Card
                key={question.id}
                className={`border-l-4 ${
                  isCorrect ? "border-l-success" : "border-l-destructive"
                }`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-base leading-relaxed flex-1">
                      {index + 1}. {question.question}
                    </CardTitle>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Badge variant={question.difficulty}>
                        {question.difficulty}
                      </Badge>
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-success" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    {question.options.map((option: string, optIndex: number) => {
                      const isUserAnswer = userAnswer === optIndex;
                      const isCorrectOption = optIndex === question.correctAnswer;

                      return (
                        <div
                          key={optIndex}
                          className={`
                            p-3 rounded-lg border
                            ${isCorrectOption && "bg-success/10 border-success"}
                            ${isUserAnswer && !isCorrect && "bg-destructive/10 border-destructive"}
                            ${!isUserAnswer && !isCorrectOption && "bg-muted/50"}
                          `}
                        >
                          <div className="flex items-center gap-2">
                            {isCorrectOption && (
                              <CheckCircle2 className="h-4 w-4 text-success flex-shrink-0" />
                            )}
                            {isUserAnswer && !isCorrect && (
                              <XCircle className="h-4 w-4 text-destructive flex-shrink-0" />
                            )}
                            <span className="text-sm">{option}</span>
                            {isCorrectOption && (
                              <Badge variant="success" className="ml-auto">
                                Correct
                              </Badge>
                            )}
                            {isUserAnswer && !isCorrect && (
                              <Badge variant="destructive" className="ml-auto">
                                Your answer
                              </Badge>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {!isCorrect && (
                    <div className="p-4 bg-muted rounded-lg">
                      <p className="text-sm font-medium mb-1">Explanation:</p>
                      <p className="text-sm text-muted-foreground">
                        {question.explanation}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
