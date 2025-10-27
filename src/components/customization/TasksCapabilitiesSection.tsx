import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Phone, Calendar, MessageSquare, Bell, FileText } from "lucide-react";
import { useState } from "react";

const capabilities = [
  {
    id: "handle_calls",
    label: "Handle Calls",
    description: "Answer and manage incoming phone calls",
    icon: Phone,
  },
  {
    id: "book_appointments",
    label: "Book Appointments",
    description: "Schedule and manage bookings automatically",
    icon: Calendar,
  },
  {
    id: "answer_faqs",
    label: "Answer FAQs",
    description: "Respond to common questions from your knowledge base",
    icon: MessageSquare,
  },
  {
    id: "send_reminders",
    label: "Send Reminders",
    description: "Send appointment reminders and follow-ups",
    icon: Bell,
  },
  {
    id: "take_notes",
    label: "Take Notes",
    description: "Capture call summaries and important details",
    icon: FileText,
  },
];

interface TasksCapabilitiesSectionProps {
  defaultCapabilities?: Record<string, boolean>;
  onSave: (capabilities: Record<string, boolean>) => void;
}

export const TasksCapabilitiesSection = ({
  defaultCapabilities = {},
  onSave,
}: TasksCapabilitiesSectionProps) => {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    defaultCapabilities
  );

  const handleToggle = (id: string) => {
    setEnabled((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleSave = () => {
    onSave(enabled);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tasks & Capabilities</CardTitle>
        <CardDescription>
          Choose what your assistant can do for your business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {capabilities.map((capability) => {
            const Icon = capability.icon;
            return (
              <div
                key={capability.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-start gap-3 flex-1">
                  <Icon className="w-5 h-5 mt-0.5 text-primary" />
                  <div className="space-y-1">
                    <Label
                      htmlFor={capability.id}
                      className="text-base font-medium cursor-pointer"
                    >
                      {capability.label}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {capability.description}
                    </p>
                  </div>
                </div>
                <Switch
                  id={capability.id}
                  checked={enabled[capability.id] || false}
                  onCheckedChange={() => handleToggle(capability.id)}
                />
              </div>
            );
          })}
        </div>

        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
