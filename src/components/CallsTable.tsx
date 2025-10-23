import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { CallDetailsDrawer } from "./CallDetailsDrawer";

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

const calls: Call[] = [
  {
    id: "1",
    timestamp: "2025-01-15 14:32",
    caller: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    duration: "3m 45s",
    intent: "Schedule",
    outcome: "Booked",
    sentiment: "Positive",
  },
  {
    id: "2",
    timestamp: "2025-01-15 13:15",
    caller: "Michael Chen",
    phone: "+1 (555) 234-5678",
    duration: "2m 18s",
    intent: "Reschedule",
    outcome: "Modified",
    sentiment: "Neutral",
  },
  {
    id: "3",
    timestamp: "2025-01-15 11:47",
    caller: "Emma Wilson",
    phone: "+1 (555) 345-6789",
    duration: "1m 52s",
    intent: "Cancel",
    outcome: "Cancelled",
    sentiment: "Negative",
  },
  {
    id: "4",
    timestamp: "2025-01-15 10:23",
    caller: "David Martinez",
    phone: "+1 (555) 456-7890",
    duration: "4m 12s",
    intent: "FAQ",
    outcome: "Resolved",
    sentiment: "Positive",
  },
  {
    id: "5",
    timestamp: "2025-01-15 09:05",
    caller: "Lisa Anderson",
    phone: "+1 (555) 567-8901",
    duration: "5m 33s",
    intent: "Handoff",
    outcome: "Transferred",
    sentiment: "Neutral",
  },
];

const getOutcomeBadgeVariant = (outcome: string) => {
  switch (outcome.toLowerCase()) {
    case "booked":
    case "resolved":
      return "default";
    case "modified":
      return "secondary";
    case "cancelled":
      return "destructive";
    case "transferred":
      return "outline";
    default:
      return "secondary";
  }
};

export function CallsTable() {
  const [selectedCall, setSelectedCall] = useState<Call | null>(null);

  return (
    <>
      <Card className="rounded-2xl shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Recent Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Timestamp</TableHead>
                <TableHead>Caller</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Intent</TableHead>
                <TableHead>Outcome</TableHead>
                <TableHead>Sentiment</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {calls.map((call) => (
                <TableRow key={call.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell className="font-medium">{call.timestamp}</TableCell>
                  <TableCell>{call.caller}</TableCell>
                  <TableCell className="text-muted-foreground">{call.phone}</TableCell>
                  <TableCell>{call.duration}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{call.intent}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getOutcomeBadgeVariant(call.outcome)}>
                      {call.outcome}
                    </Badge>
                  </TableCell>
                  <TableCell>{call.sentiment}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCall(call)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {selectedCall && (
        <CallDetailsDrawer
          call={selectedCall}
          open={!!selectedCall}
          onClose={() => setSelectedCall(null)}
        />
      )}
    </>
  );
}
