import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  return (
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

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
          <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          Customize greeting
        </CollapsibleTrigger>
        <CollapsibleContent className="pt-3">
          <Textarea
            value={greeting}
            onChange={(e) => onChange({ greeting: e.target.value })}
            placeholder="e.g., Hi! Thanks for calling. How can I help you today?"
            rows={2}
            className="resize-none"
          />
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};
