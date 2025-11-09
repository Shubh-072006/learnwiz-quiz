import { supabase } from "@/integrations/supabase/client";

export const api = {
  /**
   * Generate a summary from text
   */
  generateSummary: async (text: string): Promise<{ summary: string }> => {
    const { data, error } = await supabase.functions.invoke('summarize', {
      body: { text }
    });

    if (error) {
      throw new Error(error.message || "Failed to generate summary");
    }

    return data;
  },

  /**
   * Generate a quiz from text
   */
  generateQuiz: async (text: string): Promise<{ quiz: any }> => {
    const { data, error } = await supabase.functions.invoke('quiz', {
      body: { text }
    });

    if (error) {
      throw new Error(error.message || "Failed to generate quiz");
    }

    return data;
  },
};
