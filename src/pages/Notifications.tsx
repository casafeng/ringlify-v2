import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, CheckCheck, Phone, Calendar, AlertCircle } from "lucide-react";

interface Notification {
  id: string;
  type: "call" | "booking" | "alert";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const notifications: Notification[] = [
  {
    id: "1",
    type: "call",
    title: "Missed Call",
    message: "Incoming call from +1 (555) 987-6543 at 3:45 PM",
    timestamp: "5 minutes ago",
    read: false,
  },
  {
    id: "2",
    type: "booking",
    title: "New Booking",
    message: "Sarah Johnson scheduled a haircut for Jan 18 at 10:00 AM",
    timestamp: "1 hour ago",
    read: false,
  },
  {
    id: "3",
    type: "alert",
    title: "System Alert",
    message: "High call volume detected. Consider adding more staff.",
    timestamp: "2 hours ago",
    read: false,
  },
  {
    id: "4",
    type: "booking",
    title: "Booking Cancelled",
    message: "Emma Wilson cancelled appointment for Jan 18",
    timestamp: "3 hours ago",
    read: true,
  },
  {
    id: "5",
    type: "call",
    title: "Call Completed",
    message: "Successfully handled inquiry from Michael Chen",
    timestamp: "4 hours ago",
    read: true,
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "call":
      return Phone;
    case "booking":
      return Calendar;
    case "alert":
      return AlertCircle;
    default:
      return Bell;
  }
};

const Notifications = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Notifications</h1>
            <p className="text-muted-foreground">
              Stay updated with your business activity
            </p>
          </div>
          <Button variant="outline" size="sm">
            <CheckCheck className="h-4 w-4 mr-2" />
            Mark all as read
          </Button>
        </div>

        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Recent Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.map((notification) => {
                const Icon = getIcon(notification.type);
                return (
                  <div
                    key={notification.id}
                    className={`flex items-start gap-4 p-4 rounded-xl border transition-colors ${
                      !notification.read
                        ? "bg-primary/5 border-primary/20"
                        : "bg-muted/30 border-border"
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        !notification.read ? "bg-primary/10" : "bg-muted"
                      }`}
                    >
                      <Icon
                        className={`h-5 w-5 ${
                          !notification.read ? "text-primary" : "text-muted-foreground"
                        }`}
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{notification.title}</h4>
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {notification.message}
                      </p>
                    </div>
                    {!notification.read && (
                      <Badge variant="default" className="ml-2">
                        New
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Notifications;
