import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface DocumentTabProps {
  onSuccess: () => void;
}

export const DocumentTab = ({ onSuccess }: DocumentTabProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { createDocument } = useKnowledgeBase();
  const { customerId } = useCustomer();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !customerId) return;

    setIsLoading(true);

    try {
      // Upload file to storage
      const fileExt = file.name.split(".").pop();
      const fileName = `${customerId}/${Date.now()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from("kb-documents")
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Call edge function to parse and chunk the document
      const { data, error: parseError } = await supabase.functions.invoke('parse-document', {
        body: {
          filePath: fileName,
          title: file.name,
          customerId: customerId,
        }
      });

      if (parseError) throw parseError;

      const chunksCreated = data?.chunksCreated || 1;
      toast.success(`Document processed successfully! ${chunksCreated > 1 ? `Split into ${chunksCreated} parts.` : ''}`);
      
      onSuccess();
      setFile(null);
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="document-file">Upload Document</Label>
        <Input
          id="document-file"
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          required
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          Supported formats: PDF, Word, Text files
        </p>
      </div>

      {file && (
        <div className="text-sm text-muted-foreground">
          Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
        </div>
      )}
      
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading || !file}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload & Add
        </Button>
      </div>
    </form>
  );
};
