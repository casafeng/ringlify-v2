import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import { KBDocument } from "@/hooks/useKnowledgeBase";

interface EditKnowledgeDialogProps {
  document: KBDocument;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: string, title: string, content: string, category?: string) => void;
  isSaving: boolean;
}

export const EditKnowledgeDialog = ({
  document,
  open,
  onOpenChange,
  onSave,
  isSaving,
}: EditKnowledgeDialogProps) => {
  const [title, setTitle] = useState(document.title);
  const [content, setContent] = useState(document.content);
  const [category, setCategory] = useState(document.category || "");

  const handleSave = () => {
    if (!title.trim() || !content.trim()) return;
    onSave(document.id, title.trim(), content.trim(), category.trim() || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Knowledge Base Entry</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter title"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-category">Category (optional)</Label>
            <Input
              id="edit-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="e.g., FAQ, Policies, Products"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-content">Content</Label>
            <Textarea
              id="edit-content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter content"
              className="min-h-[300px] resize-none"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!title.trim() || !content.trim() || isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
