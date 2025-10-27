import { Check, Loader2 } from "lucide-react";

interface SaveIndicatorProps {
  isSaving: boolean;
  lastSaved: Date | null;
}

export const SaveIndicator = ({ isSaving, lastSaved }: SaveIndicatorProps) => {
  if (isSaving) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        <span>Saving...</span>
      </div>
    );
  }

  if (lastSaved) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Check className="h-4 w-4 text-green-600" />
        <span>Saved</span>
      </div>
    );
  }

  return null;
};
