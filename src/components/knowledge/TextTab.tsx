import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";

interface TextTabProps {
  onSuccess: () => void;
}

export const TextTab = ({ onSuccess }: TextTabProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { createDocument } = useKnowledgeBase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createDocument.mutateAsync({
      title,
      content,
      category: "Text",
      source_type: "text",
    });

    onSuccess();
    setTitle("");
    setContent("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="text-title">Title</Label>
        <Input
          id="text-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Pricing Information"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="text-content">Content</Label>
        <Textarea
          id="text-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Enter the information the AI should know..."
          rows={10}
          required
        />
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit">Add</Button>
      </div>
    </form>
  );
};
