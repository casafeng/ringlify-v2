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
    <div className="space-y-4">
      {capabilities.map((capability) => {
        const Icon = capability.icon;
        return (
          <div
            key={capability.id}
            className="flex items-start justify-between gap-4 rounded-lg border p-4"
          >
            <div className="flex gap-3 flex-1">
              <Icon className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div className="space-y-1">
                <Label htmlFor={capability.id} className="cursor-pointer font-medium">
                  {capability.label}
                </Label>
                <p className="text-sm text-muted-foreground">
                  {capability.description}
                </p>
              </div>
            </div>
            <Switch
              id={capability.id}
              checked={enabledCapabilities[capability.id] || false}
              onCheckedChange={() => handleToggle(capability.id)}
            />
          </div>
        );
      })}
    </div>
  );
};
