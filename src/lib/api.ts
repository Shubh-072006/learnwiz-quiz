import { UploadResponse, ProcessingStatus, GeneratedContent } from "@/types";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const api = {
  /**
   * Generate a summary from text
   */
  generateSummary: async (text: string): Promise<{ summary: string }> => {
    const response = await fetch(`${API_BASE_URL}/api/summarize`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate summary");
    }

    return response.json();
  },

  /**
   * Generate a quiz from text
   */
  generateQuiz: async (text: string): Promise<{ quiz: any }> => {
    const response = await fetch(`${API_BASE_URL}/api/quiz`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate quiz");
    }

    return response.json();
  },

  /**
   * Test backend connection
   */
  testConnection: async (): Promise<{ message: string }> => {
    const response = await fetch(`${API_BASE_URL}/`);

    if (!response.ok) {
      throw new Error("Backend connection failed");
    }

    return response.json();
  },
};
