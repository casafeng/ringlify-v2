import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Phone, Clock, MessageSquare, TrendingUp, User } from "lucide-react";

interface Call {
  id: string;
  timestamp: string;
  caller: string;
  phone: string;
  duration: string;
  intent: string;
  outcome: string;
  sentiment: string;
  transcript?: string;
}

interface CallDetailsDrawerProps {
  call: Call | null;
  open: boolean;
  onClose: () => void;
}

export function CallDetailsDrawer({ call, open, onClose }: CallDetailsDrawerProps) {
  if (!call) return null;

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Call Details</SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Caller Information */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Caller Information
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Name</span>
                <span className="text-sm font-medium">{call.caller}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Phone</span>
                <span className="text-sm font-medium">{call.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Time</span>
                <span className="text-sm font-medium">{call.timestamp}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Call Metrics */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Call Metrics
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Duration</span>
                <Badge variant="outline" className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {call.duration}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Intent</span>
                <Badge variant="outline">{call.intent}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Outcome</span>
                <Badge>{call.outcome}</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Sentiment</span>
                <Badge
                  variant={
                    call.sentiment === "Positive"
                      ? "default"
                      : call.sentiment === "Negative"
                      ? "destructive"
                      : "secondary"
                  }
                >
                  {call.sentiment}
                </Badge>
              </div>
            </div>
          </div>

          <Separator />

          {/* Transcript */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Transcript
            </h3>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm whitespace-pre-wrap leading-relaxed">
                {call.transcript || "No transcript available for this call."}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
