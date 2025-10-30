import { useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Phone, Search, Filter } from "lucide-react";
import { CallDetailsDrawer } from "@/components/CallDetailsDrawer";
import { Input } from "@/components/ui/input";

interface Call {
  id: string;
  twilio_call_sid: string | null;
  phone_number: string;
  transcript: string | null;
  status: string;
  sentiment: string | null;
  intent: string | null;
  started_at: string;
  ended_at: string | null;
  duration_sec: number | null;
}

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};

const History = () => {
  const [selectedCall, setSelectedCall] = useState<any | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const calls: Call[] = [
    {
      id: '1',
      twilio_call_sid: 'CA1234567890abcdef',
      phone_number: '+1 (555) 123-4567',
      transcript: 'Hi, I would like to schedule an appointment for next Tuesday at 2 PM for a haircut.',
      status: 'completed',
      sentiment: 'positive',
      intent: 'book_appointment',
      started_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      ended_at: new Date(Date.now() - 1000 * 60 * 26).toISOString(),
      duration_sec: 245,
    },
    {
      id: '2',
      twilio_call_sid: 'CA2234567890abcdef',
      phone_number: '+1 (555) 234-5678',
      transcript: 'Hello, I need to reschedule my appointment from Friday to Monday. Is that possible?',
      status: 'completed',
      sentiment: 'neutral',
      intent: 'reschedule',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      ended_at: new Date(Date.now() - 1000 * 60 * 60 * 2 + 180000).toISOString(),
      duration_sec: 180,
    },
    {
      id: '3',
      twilio_call_sid: 'CA3234567890abcdef',
      phone_number: '+1 (555) 345-6789',
      transcript: 'What are your business hours? Do you work on weekends?',
      status: 'completed',
      sentiment: 'positive',
      intent: 'inquiry',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      ended_at: new Date(Date.now() - 1000 * 60 * 60 * 5 + 312000).toISOString(),
      duration_sec: 312,
    },
    {
      id: '4',
      twilio_call_sid: 'CA4234567890abcdef',
      phone_number: '+1 (555) 456-7890',
      transcript: 'I need to cancel my appointment for tomorrow. Something came up.',
      status: 'completed',
      sentiment: 'neutral',
      intent: 'cancel',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      ended_at: new Date(Date.now() - 1000 * 60 * 60 * 24 + 198000).toISOString(),
      duration_sec: 198,
    },
    {
      id: '5',
      twilio_call_sid: 'CA5234567890abcdef',
      phone_number: '+1 (555) 567-8901',
      transcript: 'Hi, can you tell me about your pricing for color treatments?',
      status: 'completed',
      sentiment: 'positive',
      intent: 'pricing_inquiry',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      ended_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2 + 267000).toISOString(),
      duration_sec: 267,
    },
  ];

  const handleViewDetails = (call: Call) => {
    setSelectedCall({
      id: call.id,
      timestamp: formatTimestamp(call.started_at),
      caller: call.phone_number,
      phone: call.phone_number,
      duration: formatDuration(call.duration_sec),
      intent: call.intent || "Unknown",
      outcome: call.status,
      sentiment: call.sentiment || "Unknown",
      transcript: call.transcript,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Call History</h1>
          <p className="text-muted-foreground">
            Complete record of all interactions with your AI assistant
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by phone number, intent, or transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {/* Calls List */}
        <div className="space-y-3">
          {calls.map((call) => (
            <Card key={call.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1">
                        <p className="font-semibold">{call.phone_number}</p>
                        <Badge variant="outline" className="text-xs">
                          {call.intent || "Unknown"}
                        </Badge>
                        {call.sentiment && (
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {call.sentiment}
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {formatTimestamp(call.started_at)} • {formatDuration(call.duration_sec)}
                      </p>
                      <p className="text-sm text-foreground/80 line-clamp-2">
                        {call.transcript || "No transcript available"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleViewDetails(call)}
                    className="gap-2 flex-shrink-0"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {selectedCall && (
        <CallDetailsDrawer
          call={selectedCall}
          open={!!selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </DashboardLayout>
  );
};

export default History;
