import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, PlayCircle, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

export default function Summary() {
  const [expandedSections, setExpandedSections] = useState<number[]>([0]);
  const [summary, setSummary] = useState<any>(null);
  const [quizQuestions, setQuizQuestions] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const summaryData = sessionStorage.getItem("generatedSummary");
    const quizData = sessionStorage.getItem("generatedQuiz");
    const docTitle = sessionStorage.getItem("documentTitle");

    if (!summaryData || !quizData) {
      toast({
        title: "No data found",
        description: "Please upload a document first.",
        variant: "destructive",
      });
      navigate("/");
      return;
    }

    try {
      const parsedSummary = JSON.parse(summaryData);
      const parsedQuiz = JSON.parse(quizData);
      
      setSummary({
        title: docTitle || "Document Summary",
        content: parsedSummary.summary || parsedSummary,
        sections: typeof parsedSummary.summary === 'string' 
          ? [{ id: 0, title: "Summary", content: parsedSummary.summary, keywords: [] }]
          : parsedSummary.sections || [{ id: 0, title: "Summary", content: JSON.stringify(parsedSummary), keywords: [] }]
      });
      
      setQuizQuestions(parsedQuiz.quiz || parsedQuiz);
    } catch (error) {
      toast({
        title: "Error loading data",
        description: "Failed to parse generated content.",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [navigate, toast]);

  const toggleSection = (id: number) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  if (!summary) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading summary...</p>
        </div>
      </div>
    );
  }

  const totalQuestions = Array.isArray(quizQuestions) ? quizQuestions.length : 0;

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{summary.title}</h1>
            <p className="text-muted-foreground">
              {summary.sections?.length || 1} section{summary.sections?.length !== 1 ? 's' : ''} •{" "}
              {totalQuestions} questions generated
            </p>
          </div>
        </div>

        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Ready to test your knowledge?</p>
                <p className="text-2xl font-bold">
                  {totalQuestions} Questions Available
                </p>
              </div>
              <Button
                onClick={() => navigate("/quiz")}
                size="lg"
                variant="secondary"
                className="bg-white text-primary hover:bg-white/90"
              >
                <PlayCircle className="mr-2 h-5 w-5" />
                Start Quiz
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Content Summary</h2>
          {summary.sections.map((section: any) => {
            const isExpanded = expandedSections.includes(section.id);
            return (
              <Card
                key={section.id}
                className="transition-all duration-300 hover:shadow-md"
              >
                <CardHeader
                  className="cursor-pointer select-none"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{section.title}</CardTitle>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </CardHeader>
                {isExpanded && (
                  <CardContent className="space-y-4 animate-in slide-in-from-top-2">
                    <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                      {section.content}
                    </p>
                    {section.keywords && section.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {section.keywords.map((keyword: string) => (
                          <Badge key={keyword} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                )}
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
