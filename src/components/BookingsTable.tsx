import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface Booking {
  id: string;
  date: string;
  time: string;
  customer: string;
  service: string;
  status: string;
}

const bookings: Booking[] = [
  {
    id: "1",
    date: "2025-01-18",
    time: "10:00 AM",
    customer: "Sarah Johnson",
    service: "Haircut & Styling",
    status: "Confirmed",
  },
  {
    id: "2",
    date: "2025-01-18",
    time: "11:30 AM",
    customer: "Michael Chen",
    service: "Color Treatment",
    status: "Confirmed",
  },
  {
    id: "3",
    date: "2025-01-18",
    time: "2:00 PM",
    customer: "Emma Wilson",
    service: "Manicure",
    status: "Pending",
  },
  {
    id: "4",
    date: "2025-01-19",
    time: "9:00 AM",
    customer: "David Martinez",
    service: "Haircut",
    status: "Confirmed",
  },
  {
    id: "5",
    date: "2025-01-19",
    time: "3:30 PM",
    customer: "Lisa Anderson",
    service: "Full Service",
    status: "Rescheduled",
  },
];

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "confirmed":
      return "default";
    case "pending":
      return "secondary";
    case "rescheduled":
      return "outline";
    case "cancelled":
      return "destructive";
    default:
      return "secondary";
  }
};

export function BookingsTable() {
  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Upcoming Bookings</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Service</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {bookings.map((booking) => (
              <TableRow key={booking.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="font-medium">{booking.date}</TableCell>
                <TableCell>{booking.time}</TableCell>
                <TableCell>{booking.customer}</TableCell>
                <TableCell>{booking.service}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(booking.status)}>
                    {booking.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
