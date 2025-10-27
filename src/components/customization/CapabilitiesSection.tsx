import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Phone, Calendar, MessageSquare, Brain, Clock } from "lucide-react";

const capabilities = [
  {
    id: "handle_calls",
    label: "Answer calls professionally",
    description: "Handle incoming calls with your custom greeting",
    icon: Phone,
  },
  {
    id: "book_appointments",
    label: "Book appointments automatically",
    description: "Schedule appointments based on availability",
    icon: Calendar,
  },
  {
    id: "answer_faqs",
    label: "Answer common questions",
    description: "Respond to frequently asked questions",
    icon: MessageSquare,
  },
  {
    id: "remember_callers",
    label: "Remember caller details",
    description: "Recall information from previous conversations",
    icon: Brain,
  },
  {
    id: "send_reminders",
    label: "Send reminders",
    description: "Automatically remind customers of appointments",
    icon: Clock,
  },
];

interface CapabilitiesSectionProps {
  enabledCapabilities: Record<string, boolean>;
  onChange: (capabilities: Record<string, boolean>) => void;
}

export const CapabilitiesSection = ({
  enabledCapabilities,
  onChange,
}: CapabilitiesSectionProps) => {
  const handleToggle = (id: string) => {
    onChange({
      ...enabledCapabilities,
      [id]: !enabledCapabilities[id],
    });
  };

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {capabilities.map((capability) => {
        const Icon = capability.icon;
        const isEnabled = enabledCapabilities[capability.id] || false;
        return (
          <div
            key={capability.id}
            className={`group relative rounded-lg border-2 p-5 transition-all ${
              isEnabled
                ? "border-primary bg-primary/5"
                : "border-border bg-card hover:border-muted-foreground/20"
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex gap-4 flex-1">
                <div className={`rounded-lg p-2 ${isEnabled ? "bg-primary/10" : "bg-muted"}`}>
                  <Icon className={`h-5 w-5 ${isEnabled ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="space-y-1.5 flex-1">
                  <Label
                    htmlFor={capability.id}
                    className="cursor-pointer font-semibold text-base leading-tight"
                  >
                    {capability.label}
                  </Label>
                  <p className="text-sm text-muted-foreground leading-snug">
                    {capability.description}
                  </p>
                </div>
              </div>
              <Switch
                id={capability.id}
                checked={isEnabled}
                onCheckedChange={() => handleToggle(capability.id)}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
