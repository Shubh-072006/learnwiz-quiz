export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  difficulty: Difficulty;
  explanation: string;
  topic: string;
}

export interface Section {
  id: number;
  title: string;
  content: string;
  keywords: string[];
}

export interface Summary {
  title: string;
  sections: Section[];
  totalQuestions: number;
}

export interface ProcessingStep {
  icon: any;
  label: string;
  duration: number;
}

export interface QuizResult {
  answers: (number | null)[];
  questions: Question[];
  score: number;
  percentage: number;
}

// API Response types (adjust these based on your actual backend)
export interface UploadResponse {
  success: boolean;
  documentId: string;
  message?: string;
}

export interface ProcessingStatus {
  status: "processing" | "completed" | "failed";
  progress: number;
  currentStep: string;
}

export interface GeneratedContent {
  summary: Summary;
  questions: Question[];
}
