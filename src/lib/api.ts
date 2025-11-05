import { UploadResponse, ProcessingStatus, GeneratedContent } from "@/types";

// TODO: Replace these with your actual backend API endpoints
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

export const api = {
  /**
   * Upload a PDF file for processing
   */
  uploadDocument: async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_BASE_URL}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  },

  /**
   * Check the processing status of a document
   */
  getProcessingStatus: async (documentId: string): Promise<ProcessingStatus> => {
    const response = await fetch(`${API_BASE_URL}/status/${documentId}`);

    if (!response.ok) {
      throw new Error("Failed to get processing status");
    }

    return response.json();
  },

  /**
   * Get the generated summary and questions for a document
   */
  getGeneratedContent: async (documentId: string): Promise<GeneratedContent> => {
    const response = await fetch(`${API_BASE_URL}/content/${documentId}`);

    if (!response.ok) {
      throw new Error("Failed to get generated content");
    }

    return response.json();
  },

  /**
   * Export results as PDF
   */
  exportResults: async (documentId: string, format: "pdf" | "json" = "pdf"): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/export/${documentId}?format=${format}`);

    if (!response.ok) {
      throw new Error("Failed to export results");
    }

    return response.blob();
  },
};
