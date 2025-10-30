import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Clock, User, Phone, Plus } from "lucide-react";

const Calendar = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Calendar & Bookings</h1>
            <p className="text-muted-foreground">
              Manage appointments created by your AI assistant
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Booking
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Date</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <CalendarComponent
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md"
              />
            </CardContent>
          </Card>

          {/* Bookings List */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">
                    {date?.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {bookings.length} appointments scheduled
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <span className="font-semibold">{booking.customer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Phone className="h-3.5 w-3.5" />
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
                      <span className="text-muted-foreground">{booking.service}</span>
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
