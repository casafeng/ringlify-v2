import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, Phone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { CallDetailsDrawer } from "@/components/CallDetailsDrawer";
import { useToast } from "@/hooks/use-toast";

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

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "completed":
      return "default";
    case "in-progress":
      return "secondary";
    case "failed":
      return "destructive";
    default:
      return "outline";
  }
};

const formatDuration = (seconds: number | null) => {
  if (!seconds) return "N/A";
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const formatTimestamp = (timestamp: string) => {
  return new Date(timestamp).toLocaleString();
};

const Calls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [selectedCall, setSelectedCall] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCalls();
    
    // Set up real-time subscription
    const channel = supabase
      .channel('calls-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'calls'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            setCalls(prev => [payload.new as Call, ...prev]);
            toast({
              title: "New call received",
              description: `Call from ${(payload.new as Call).phone_number}`,
            });
          } else if (payload.eventType === 'UPDATE') {
            setCalls(prev => prev.map(call => 
              call.id === payload.new.id ? payload.new as Call : call
            ));
          } else if (payload.eventType === 'DELETE') {
            setCalls(prev => prev.filter(call => call.id !== payload.old.id));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCalls = async () => {
    try {
      const { data, error } = await supabase
        .from('calls')
        .select('*')
        .order('started_at', { ascending: false });

      if (error) throw error;
      setCalls(data || []);
    } catch (error) {
      console.error('Error fetching calls:', error);
      toast({
        title: "Error",
        description: "Failed to fetch calls",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (call: Call) => {
    // Transform to match CallDetailsDrawer interface
    setSelectedCall({
      id: call.id,
      timestamp: formatTimestamp(call.started_at),
      caller: call.phone_number,
      phone: call.phone_number,
      duration: formatDuration(call.duration_sec),
      intent: call.intent || "Unknown",
      outcome: call.status,
      sentiment: call.sentiment || "Unknown",
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Call History</h1>
            <p className="text-muted-foreground">
              View all incoming calls with transcripts and details
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5 text-primary" />
            <Badge variant="secondary">{calls.length} Total Calls</Badge>
          </div>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">All Calls</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading calls...
              </div>
            ) : calls.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No calls yet. Calls will appear here in real-time.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Caller ID</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Intent</TableHead>
                    <TableHead>Sentiment</TableHead>
                    <TableHead>Transcript</TableHead>
                    <TableHead className="w-[80px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {calls.map((call) => (
                    <TableRow key={call.id} className="cursor-pointer hover:bg-muted/50">
                      <TableCell className="font-medium">
                        {formatTimestamp(call.started_at)}
                      </TableCell>
                      <TableCell>{call.phone_number}</TableCell>
                      <TableCell>{formatDuration(call.duration_sec)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(call.status)}>
                          {call.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{call.intent || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>{call.sentiment || "N/A"}</TableCell>
                      <TableCell className="max-w-xs truncate">
                        {call.transcript || "No transcript available"}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(call)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
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

export default Calls;
