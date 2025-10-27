import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface GreetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  greeting: string;
  onSave: (greeting: string) => void;
}

export const GreetingDialog = ({
  open,
  onOpenChange,
  greeting: initialGreeting,
  onSave,
}: GreetingDialogProps) => {
  const [greeting, setGreeting] = useState(initialGreeting);

  const handleSave = () => {
    onSave(greeting);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Customize Greeting</DialogTitle>
          <DialogDescription>
            Set the greeting message your assistant will use when answering calls
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dialog-greeting">Greeting Message</Label>
            <Textarea
              id="dialog-greeting"
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              placeholder="e.g., Hi! Thanks for calling. How can I help you today?"
              rows={4}
              className="resize-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
