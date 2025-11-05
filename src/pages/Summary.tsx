import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChevronDown, ChevronUp, PlayCircle, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Mock data - replace with actual API data
const mockSummary = {
  title: "Introduction to Machine Learning",
  sections: [
    {
      id: 1,
      title: "Supervised Learning",
      content:
        "Supervised learning is a type of machine learning where the model learns from labeled data. The algorithm learns to map inputs to outputs based on example input-output pairs. Common applications include classification and regression tasks.",
      keywords: ["Classification", "Regression", "Labeled Data"],
    },
    {
      id: 2,
      title: "Neural Networks",
      content:
        "Neural networks are computing systems inspired by biological neural networks. They consist of interconnected nodes (neurons) organized in layers. Deep learning uses neural networks with multiple hidden layers to learn complex patterns.",
      keywords: ["Deep Learning", "Neurons", "Layers"],
    },
    {
      id: 3,
      title: "Model Evaluation",
      content:
        "Model evaluation involves assessing the performance of machine learning models using metrics like accuracy, precision, recall, and F1-score. Cross-validation helps ensure the model generalizes well to unseen data.",
      keywords: ["Accuracy", "Precision", "Cross-validation"],
    },
  ],
  totalQuestions: 15,
};

export default function Summary() {
  const [expandedSections, setExpandedSections] = useState<number[]>([1]);
  const navigate = useNavigate();

  const toggleSection = (id: number) => {
    setExpandedSections((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{mockSummary.title}</h1>
            <p className="text-muted-foreground">
              {mockSummary.sections.length} sections •{" "}
              {mockSummary.totalQuestions} questions generated
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>

        <Card className="bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">Ready to test your knowledge?</p>
                <p className="text-2xl font-bold">
                  {mockSummary.totalQuestions} Questions Available
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
          {mockSummary.sections.map((section) => {
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
                    <p className="text-muted-foreground leading-relaxed">
                      {section.content}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {section.keywords.map((keyword) => (
                        <Badge key={keyword} variant="secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
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
