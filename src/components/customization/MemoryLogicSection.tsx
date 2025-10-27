import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Brain, Clock, CalendarCheck } from "lucide-react";
import { useState } from "react";

const memoryOptions = [
  {
    id: "remember_callers",
    label: "Remember caller details between calls",
    description: "Store customer info, preferences, and history",
    icon: Brain,
  },
  {
    id: "auto_schedule",
    label: "Handle scheduling automatically",
    description: "Book appointments without asking for confirmation",
    icon: CalendarCheck,
  },
  {
    id: "track_history",
    label: "Track interaction history",
    description: "Remember past conversations and bookings",
    icon: Clock,
  },
];

interface MemoryLogicSectionProps {
  defaultSettings?: Record<string, boolean>;
  onSave: (settings: Record<string, boolean>) => void;
}

export const MemoryLogicSection = ({
  defaultSettings = {},
  onSave,
}: MemoryLogicSectionProps) => {
  const [settings, setSettings] = useState<Record<string, boolean>>(
    defaultSettings
  );

  const handleToggle = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    onSave(settings);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Memory & Logic</CardTitle>
        <CardDescription>
          Configure how your assistant remembers and decides
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {memoryOptions.map((option) => {
            const Icon = option.icon;
            return (
              <div
                key={option.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="w-5 h-5 mt-0.5 text-primary" />
                  <div className="space-y-1">
                    <Label
                      htmlFor={option.id}
                      className="text-base font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {option.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={option.id}
                  checked={settings[option.id] || false}
                  onCheckedChange={() => handleToggle(option.id)}
                />
              </div>
            );
          })}
        </div>

        <div className="p-4 bg-muted/50 rounded-lg border">
          <p className="text-sm text-muted-foreground">
            <strong className="text-foreground">Privacy Note:</strong> Customer data is stored securely and only used to improve their experience. You can always clear history from the Settings page.
          </p>
        </div>

        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
