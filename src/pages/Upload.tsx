import { useState, useCallback } from "react";
import { Upload as UploadIcon, FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

export default function Upload() {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile?.type === "application/pdf") {
      setFile(droppedFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF file",
        variant: "destructive",
      });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      // TODO: Replace with actual API endpoint
      const formData = new FormData();
      formData.append("file", file);

      // Simulating API call - replace with actual endpoint
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast({
        title: "Upload successful!",
        description: "Processing your document...",
      });
      
      navigate("/processing");
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Study Material Analyzer
          </h1>
          <p className="text-muted-foreground text-lg">
            Upload your lecture notes, slides, or textbooks to generate summaries and MCQs
          </p>
        </div>

        <Card className="border-2 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-8">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-300
                ${isDragging ? "border-primary bg-primary/5 scale-[1.02]" : "border-border hover:border-primary/50"}
              `}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={uploading}
              />

              <div className="space-y-4">
                {file ? (
                  <div className="flex items-center justify-center gap-3 text-primary animate-in fade-in slide-in-from-bottom-2">
                    <FileText className="h-12 w-12" />
                    <div className="text-left">
                      <p className="font-medium">{file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {(file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <UploadIcon className="h-16 w-16 mx-auto text-muted-foreground" />
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        Drag and drop your PDF here
                      </p>
                      <p className="text-sm text-muted-foreground">
                        or click to browse files
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {file && (
              <div className="mt-6 flex gap-3">
                <Button
                  onClick={() => setFile(null)}
                  variant="outline"
                  className="flex-1"
                  disabled={uploading}
                >
                  Change File
                </Button>
                <Button
                  onClick={handleUpload}
                  className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90"
                  disabled={uploading}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    "Process Document"
                  )}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div className="p-4 rounded-lg bg-card border">
            <div className="text-2xl font-bold text-primary mb-1">📄</div>
            <p className="text-sm font-medium">PDF Upload</p>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <div className="text-2xl font-bold text-primary mb-1">📝</div>
            <p className="text-sm font-medium">Smart Summaries</p>
          </div>
          <div className="p-4 rounded-lg bg-card border">
            <div className="text-2xl font-bold text-primary mb-1">✅</div>
            <p className="text-sm font-medium">MCQ Generation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
