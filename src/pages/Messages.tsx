import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Mail, Phone } from "lucide-react";

interface Message {
  id: string;
  channel: "SMS" | "WhatsApp" | "Email";
  from: string;
  content: string;
  timestamp: string;
  status: "Sent" | "Delivered" | "Read";
}

const messages: Message[] = [
  {
    id: "1",
    channel: "WhatsApp",
    from: "+1 (555) 123-4567",
    content: "Your appointment is confirmed for Jan 18 at 10:00 AM. Reply CANCEL to cancel.",
    timestamp: "2 hours ago",
    status: "Read",
  },
  {
    id: "2",
    channel: "SMS",
    from: "+1 (555) 234-5678",
    content: "Thank you for calling! Your haircut appointment has been rescheduled.",
    timestamp: "5 hours ago",
    status: "Delivered",
  },
  {
    id: "3",
    channel: "Email",
    from: "sarah.j@email.com",
    content: "Hi, we received your message and will get back to you soon.",
    timestamp: "1 day ago",
    status: "Sent",
  },
  {
    id: "4",
    channel: "WhatsApp",
    from: "+1 (555) 345-6789",
    content: "Your booking has been cancelled as requested. Hope to see you soon!",
    timestamp: "1 day ago",
    status: "Read",
  },
  {
    id: "5",
    channel: "SMS",
    from: "+1 (555) 456-7890",
    content: "Reminder: Your appointment is tomorrow at 9:00 AM.",
    timestamp: "2 days ago",
    status: "Delivered",
  },
];

const getChannelIcon = (channel: string) => {
  switch (channel) {
    case "SMS":
      return Phone;
    case "WhatsApp":
      return MessageSquare;
    case "Email":
      return Mail;
    default:
      return MessageSquare;
  }
};

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "read":
      return "default";
    case "delivered":
      return "secondary";
    case "sent":
      return "outline";
    default:
      return "secondary";
  }
};

const Messages = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Messages</h1>
            <p className="text-muted-foreground">
              View all communication history across channels
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">WhatsApp</span>
              </div>
              <div className="text-2xl font-bold">1,234</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-chart-2" />
                <span className="text-xs text-muted-foreground">SMS</span>
              </div>
              <div className="text-2xl font-bold">856</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Mail className="h-4 w-4 text-chart-4" />
                <span className="text-xs text-muted-foreground">Email</span>
              </div>
              <div className="text-2xl font-bold">432</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="destructive">5</Badge>
                <span className="text-xs text-muted-foreground">Unread</span>
              </div>
              <div className="text-2xl font-bold">2,522</div>
              <p className="text-xs text-muted-foreground">Total Messages</p>
            </CardContent>
          </Card>
        </div>

        {/* Messages List */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Message History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all">All Messages</TabsTrigger>
                <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>
              <TabsContent value="all" className="space-y-4">
                {messages.map((message) => {
                  const Icon = getChannelIcon(message.channel);
                  return (
                    <div
                      key={message.id}
                      className="flex items-start gap-4 p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                    >
                      <div className="p-2 rounded-lg bg-muted">
                        <Icon className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">{message.from}</span>
                            <Badge variant="outline" className="text-xs">
                              {message.channel}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {message.timestamp}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {message.content}
                        </p>
                        <Badge variant={getStatusVariant(message.status)} className="text-xs">
                          {message.status}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Messages;
