import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, Clock, MessageSquare, TrendingUp } from "lucide-react";

interface Call {
  id: string;
  timestamp: string;
  caller: string;
  phone: string;
  duration: string;
  intent: string;
  outcome: string;
  sentiment: string;
}

interface CallDetailsDrawerProps {
  call: Call;
  open: boolean;
  onClose: () => void;
}

export function CallDetailsDrawer({ call, open, onClose }: CallDetailsDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Call Details</SheetTitle>
          <SheetDescription>
            Call ID: {call.id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Caller Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Phone className="h-4 w-4" />
              Caller Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{call.caller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Phone:</span>
                <span className="font-medium">{call.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Timestamp:</span>
                <span className="font-medium">{call.timestamp}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Call Metrics */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Call Metrics
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Duration:</span>
                <span className="font-medium">{call.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Intent:</span>
                <Badge variant="outline">{call.intent}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Outcome:</span>
                <Badge>{call.outcome}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sentiment:</span>
                <Badge variant="secondary">{call.sentiment}</Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transcript */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Transcript
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Caller:</p>
                <p className="text-sm">Hi, I'd like to schedule an appointment for a haircut next week.</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">AI Assistant:</p>
                <p className="text-sm">Of course! I'd be happy to help you schedule a haircut. What day and time works best for you?</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Caller:</p>
                <p className="text-sm">How about Thursday at 10 AM?</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">AI Assistant:</p>
                <p className="text-sm">Perfect! I've scheduled your haircut for Thursday, January 18th at 10:00 AM. You'll receive a confirmation via WhatsApp shortly.</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* AI Summary */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              AI Summary
            </h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                Customer called to schedule a haircut appointment. Successfully booked for Thursday, January 18th at 10:00 AM. Positive interaction with clear communication. Confirmation sent via WhatsApp.
              </p>
              <div className="mt-3 p-3 bg-success/10 rounded-lg border border-success/20">
                <p className="text-xs font-medium text-success mb-1">CRM Status</p>
                <p className="text-xs text-muted-foreground">Contact updated in HubSpot • Appointment synced to Google Calendar</p>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
