import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { GreetingDialog } from "./GreetingDialog";

const tonePresets = [
  { id: "professional", label: "Professional" },
  { id: "friendly", label: "Friendly" },
  { id: "warm", label: "Warm" },
  { id: "efficient", label: "Efficient" },
  { id: "empathetic", label: "Empathetic" },
];

interface TonePersonalitySectionProps {
  tone: string;
  greeting: string;
  onChange: (data: { tone?: string; greeting?: string }) => void;
}

export const TonePersonalitySection = ({
  tone,
  greeting,
  onChange,
}: TonePersonalitySectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleSaveGreeting = (newGreeting: string) => {
    onChange({ greeting: newGreeting });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-3">
          <Label>How should your assistant sound?</Label>
          <div className="flex flex-wrap gap-2">
            {tonePresets.map((preset) => (
              <Badge
                key={preset.id}
                variant={tone === preset.id ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => onChange({ tone: preset.id })}
              >
                {preset.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Greeting Message</Label>
          <div className="flex items-start gap-3">
            <div className="flex-1 rounded-md border bg-muted/50 px-3 py-2 text-sm">
              {greeting || "Hi! Thanks for calling. How can I help you today?"}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDialogOpen(true)}
            >
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Button>
          </div>
        </div>
      </div>

      <GreetingDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        greeting={greeting}
        onSave={handleSaveGreeting}
      />
    </>
  );
};
