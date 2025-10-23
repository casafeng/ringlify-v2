import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Clock, User, Phone } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  // Mock bookings data
  const bookings = [
    {
      id: 1,
      customer: "John Smith",
      phone: "+1 234-567-8900",
      time: "10:00 AM",
      service: "Consultation",
      status: "confirmed"
    },
    {
      id: 2,
      customer: "Sarah Johnson",
      phone: "+1 234-567-8901",
      time: "11:30 AM",
      service: "Follow-up",
      status: "confirmed"
    },
    {
      id: 3,
      customer: "Mike Wilson",
      phone: "+1 234-567-8902",
      time: "2:00 PM",
      service: "Initial Appointment",
      status: "pending"
    },
    {
      id: 4,
      customer: "Emily Brown",
      phone: "+1 234-567-8903",
      time: "3:30 PM",
      service: "Consultation",
      status: "confirmed"
    },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Calendar</h1>
          <p className="text-muted-foreground">
            View and manage all your bookings
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-[350px_1fr]">
          {/* Calendar */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>

          {/* Bookings List */}
          <Card>
            <CardHeader>
              <CardTitle>
                Bookings for {date?.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  month: 'long', 
                  day: 'numeric',
                  year: 'numeric'
                })}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{booking.customer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{booking.phone}</span>
                        </div>
                      </div>
                      <Badge variant={booking.status === "confirmed" ? "default" : "secondary"}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.time}</span>
                      </div>
                      <span className="text-muted-foreground">•</span>
                      <span>{booking.service}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Calendar;
