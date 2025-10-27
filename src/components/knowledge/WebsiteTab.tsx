import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useKnowledgeBase } from "@/hooks/useKnowledgeBase";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

interface WebsiteTabProps {
  onSuccess: () => void;
}

export const WebsiteTab = ({ onSuccess }: WebsiteTabProps) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { createDocument } = useKnowledgeBase();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Call edge function to scrape website
      const { data, error } = await supabase.functions.invoke("scrape-website", {
        body: { url },
      });

      if (error) throw error;

      if (!data.content) {
        throw new Error("Failed to scrape website content");
      }

      // Create document with scraped content
      await createDocument.mutateAsync({
        title: data.title,
        content: data.content,
        category: "Website",
        source_type: "website",
        source_url: url,
      });

      onSuccess();
      setUrl("");
    } catch (error) {
      console.error("Error scraping website:", error);
      toast.error("Failed to scrape website. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="website-url">Website URL</Label>
        <Input
          id="website-url"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          disabled={isLoading}
        />
        <p className="text-sm text-muted-foreground">
          Enter a website URL to scrape and add its content to your knowledge base
        </p>
      </div>
      
      <div className="flex justify-end gap-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Scrape & Add
        </Button>
      </div>
    </form>
  );
};
