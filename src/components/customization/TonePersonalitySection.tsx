import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";

const tonePresets = [
  { id: "professional", label: "Professional", description: "Formal and business-like" },
  { id: "friendly", label: "Friendly", description: "Warm and approachable" },
  { id: "empathetic", label: "Empathetic", description: "Understanding and caring" },
  { id: "efficient", label: "Efficient", description: "Quick and to-the-point" },
  { id: "playful", label: "Playful", description: "Fun and energetic" },
];

interface TonePersonalitySectionProps {
  defaultTone?: string;
  defaultPersonality?: string;
  defaultGreeting?: string;
  onSave: (data: { tone: string; personality: string; greeting: string }) => void;
}

export const TonePersonalitySection = ({
  defaultTone = "professional",
  defaultPersonality = "",
  defaultGreeting = "",
  onSave,
}: TonePersonalitySectionProps) => {
  const [selectedTone, setSelectedTone] = useState(defaultTone);
  const [customTone, setCustomTone] = useState("");
  const [personality, setPersonality] = useState(defaultPersonality);
  const [greeting, setGreeting] = useState(defaultGreeting);

  const handleSave = () => {
    onSave({
      tone: customTone || selectedTone,
      personality,
      greeting,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tone & Personality</CardTitle>
        <CardDescription>
          Make your assistant act, speak, and think the way you want
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Choose a Tone</Label>
          <div className="flex flex-wrap gap-2">
            {tonePresets.map((preset) => (
              <Badge
                key={preset.id}
                variant={selectedTone === preset.id ? "default" : "outline"}
                className="cursor-pointer px-4 py-2 text-sm"
                onClick={() => setSelectedTone(preset.id)}
              >
                {preset.label}
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="custom-tone">Or Describe Your Own Tone (Optional)</Label>
          <Textarea
            id="custom-tone"
            placeholder="Describe how your assistant should sound..."
            value={customTone}
            onChange={(e) => setCustomTone(e.target.value)}
            rows={2}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="greeting">Welcome Message</Label>
          <Textarea
            id="greeting"
            placeholder="How should your assistant greet callers?"
            value={greeting}
            onChange={(e) => setGreeting(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Example: "Hi! Thanks for calling [Business Name]. How can I help you today?"
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="personality">Personality Traits</Label>
          <Textarea
            id="personality"
            placeholder="Describe your assistant's personality..."
            value={personality}
            onChange={(e) => setPersonality(e.target.value)}
            rows={3}
          />
          <p className="text-xs text-muted-foreground">
            Example: "Patient, helpful, never pushy. Always asks clarifying questions before booking."
          </p>
        </div>

        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
