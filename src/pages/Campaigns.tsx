import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Send, Calendar, Users } from "lucide-react";

interface Campaign {
  id: string;
  name: string;
  type: "SMS" | "WhatsApp" | "Email";
  status: "Active" | "Scheduled" | "Completed";
  sent: number;
  delivered: number;
  scheduled: string;
}

const campaigns: Campaign[] = [
  {
    id: "1",
    name: "January Promotion",
    type: "WhatsApp",
    status: "Active",
    sent: 1250,
    delivered: 1198,
    scheduled: "Jan 15, 2025",
  },
  {
    id: "2",
    name: "Appointment Reminders",
    type: "SMS",
    status: "Active",
    sent: 456,
    delivered: 445,
    scheduled: "Ongoing",
  },
  {
    id: "3",
    name: "New Year Special",
    type: "Email",
    status: "Completed",
    sent: 3420,
    delivered: 3281,
    scheduled: "Jan 1, 2025",
  },
  {
    id: "4",
    name: "Weekend Availability",
    type: "SMS",
    status: "Scheduled",
    sent: 0,
    delivered: 0,
    scheduled: "Jan 20, 2025",
  },
];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "default";
    case "scheduled":
      return "secondary";
    case "completed":
      return "outline";
    default:
      return "secondary";
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case "SMS":
      return "bg-chart-2/10 text-chart-2";
    case "WhatsApp":
      return "bg-success/10 text-success";
    case "Email":
      return "bg-chart-4/10 text-chart-4";
    default:
      return "bg-muted text-muted-foreground";
  }
};

const Campaigns = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Campaigns</h1>
            <p className="text-muted-foreground">
              Create and manage messaging campaigns
            </p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Campaign
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Send className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Sent</span>
              </div>
              <div className="text-2xl font-bold">5,126</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Delivered</span>
              </div>
              <div className="text-2xl font-bold">4,924</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Active Campaigns</span>
              </div>
              <div className="text-2xl font-bold">2</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Delivery Rate</span>
              </div>
              <div className="text-2xl font-bold">96.1%</div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns List */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">All Campaigns</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`px-3 py-1 rounded-lg text-sm font-medium ${getTypeColor(
                        campaign.type
                      )}`}
                    >
                      {campaign.type}
                    </div>
                    <div>
                      <h4 className="font-semibold">{campaign.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        Scheduled: {campaign.scheduled}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-sm font-semibold">{campaign.sent}</div>
                      <div className="text-xs text-muted-foreground">Sent</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold">{campaign.delivered}</div>
                      <div className="text-xs text-muted-foreground">Delivered</div>
                    </div>
                    <Badge variant={getStatusVariant(campaign.status)}>
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;
