import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Tag, Calendar, Users } from "lucide-react";

interface Discount {
  id: string;
  code: string;
  description: string;
  type: "Percentage" | "Fixed";
  value: string;
  used: number;
  limit: number;
  expires: string;
  status: "Active" | "Expired" | "Scheduled";
}

const discounts: Discount[] = [
  {
    id: "1",
    code: "NEWYEAR25",
    description: "New Year Special - 25% off all services",
    type: "Percentage",
    value: "25%",
    used: 42,
    limit: 100,
    expires: "Jan 31, 2025",
    status: "Active",
  },
  {
    id: "2",
    code: "FIRST10",
    description: "First-time customer discount",
    type: "Fixed",
    value: "$10",
    used: 128,
    limit: 500,
    expires: "Dec 31, 2025",
    status: "Active",
  },
  {
    id: "3",
    code: "REFERRAL",
    description: "Referral bonus for both parties",
    type: "Percentage",
    value: "15%",
    used: 67,
    limit: 200,
    expires: "Jun 30, 2025",
    status: "Active",
  },
  {
    id: "4",
    code: "HOLIDAY24",
    description: "Holiday season special",
    type: "Percentage",
    value: "20%",
    used: 234,
    limit: 250,
    expires: "Dec 31, 2024",
    status: "Expired",
  },
];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "default";
    case "scheduled":
      return "secondary";
    case "expired":
      return "outline";
    default:
      return "secondary";
  }
};

const Discounts = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Discounts</h1>
            <p className="text-muted-foreground">
              Create and manage promotional codes
            </p>
          </div>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Discount
          </Button>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Active Codes</span>
              </div>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Times Used</span>
              </div>
              <div className="text-2xl font-bold">471</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Total Savings</span>
              </div>
              <div className="text-2xl font-bold">$8,234</div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Avg Discount</span>
              </div>
              <div className="text-2xl font-bold">17.5%</div>
            </CardContent>
          </Card>
        </div>

        {/* Discounts List */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">All Discount Codes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {discounts.map((discount) => (
                <div
                  key={discount.id}
                  className="flex items-start justify-between p-4 border rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <div className="px-3 py-1 bg-primary/10 rounded-lg">
                        <span className="font-mono font-bold text-primary">
                          {discount.code}
                        </span>
                      </div>
                      <Badge variant={getStatusVariant(discount.status)}>
                        {discount.status}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium">{discount.description}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Value: {discount.value}</span>
                      <span>•</span>
                      <span>
                        Used: {discount.used}/{discount.limit}
                      </span>
                      <span>•</span>
                      <span>Expires: {discount.expires}</span>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-3xl font-bold text-primary">
                      {discount.value}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {((discount.used / discount.limit) * 100).toFixed(0)}% used
                    </div>
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

export default Discounts;
