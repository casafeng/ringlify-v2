import { Button } from "@/components/ui/button";
import { KnowledgeBaseManager } from "@/components/KnowledgeBaseManager";

interface KnowledgeBaseStepProps {
  onNext: () => void;
}

export const KnowledgeBaseStep = ({ onNext }: KnowledgeBaseStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-sm text-muted-foreground">
        Add information your AI assistant should know about your business, products, or services.
        You can add more later from the Knowledge Base page.
      </div>
      <KnowledgeBaseManager />
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
};
