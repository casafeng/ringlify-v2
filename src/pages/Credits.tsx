import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Phone, MessageSquare, Clock, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Credits = () => {
  const creditUsage = [
    { label: "Voice Calls", used: 234, total: 500, icon: Phone, color: "text-chart-1" },
    { label: "Messages", used: 456, total: 1000, icon: MessageSquare, color: "text-chart-2" },
    { label: "Minutes Used", used: 1240, total: 2000, icon: Clock, color: "text-chart-3" },
  ];

  const recentUsage = [
    { date: "Today", calls: 12, minutes: 45, cost: "$4.50" },
    { date: "Yesterday", calls: 18, minutes: 67, cost: "$6.70" },
    { date: "Jan 20", calls: 15, minutes: 52, cost: "$5.20" },
    { date: "Jan 19", calls: 21, minutes: 78, cost: "$7.80" },
    { date: "Jan 18", calls: 19, minutes: 64, cost: "$6.40" },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Credits Usage</h1>
            <p className="text-muted-foreground">
              Monitor your usage and manage credits
            </p>
          </div>
          <Button size="lg">
            Purchase Credits
          </Button>
        </div>

        {/* Current Balance */}
        <Card className="bg-gradient-to-br from-primary/10 via-primary/5 to-background border-primary/20">
          <CardHeader>
            <CardTitle className="text-2xl">Current Balance</CardTitle>
            <CardDescription>Available credits in your account</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-5xl font-bold text-primary">1,234</div>
              <div className="flex items-center gap-2 text-sm">
                <Badge variant="outline" className="border-success text-success">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Active
                </Badge>
                <span className="text-muted-foreground">Renews on Feb 1, 2025</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Usage Breakdown */}
        <div className="grid gap-4 md:grid-cols-3">
          {creditUsage.map((item) => {
            const percentage = (item.used / item.total) * 100;
            return (
              <Card key={item.label}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
                    <item.icon className={`h-4 w-4 ${item.color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold">{item.used}</span>
                      <span className="text-sm text-muted-foreground">/ {item.total}</span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-muted-foreground">
                      {percentage.toFixed(0)}% used
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Usage */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Usage</CardTitle>
            <CardDescription>Daily breakdown of your credit consumption</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsage.map((day) => (
                <div
                  key={day.date}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{day.date}</p>
                    <p className="text-sm text-muted-foreground">
                      {day.calls} calls • {day.minutes} minutes
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{day.cost}</p>
                    <p className="text-sm text-muted-foreground">Cost</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Purchase Options */}
        <Card>
          <CardHeader>
            <CardTitle>Credit Packages</CardTitle>
            <CardDescription>Choose a package that fits your needs</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                { name: "Starter", credits: 500, price: "$49", popular: false },
                { name: "Professional", credits: 2000, price: "$149", popular: true },
                { name: "Enterprise", credits: 5000, price: "$299", popular: false },
              ].map((pkg) => (
                <Card key={pkg.name} className={pkg.popular ? "border-primary" : ""}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{pkg.name}</CardTitle>
                      {pkg.popular && (
                        <Badge variant="default">Popular</Badge>
                      )}
                    </div>
                    <CardDescription>{pkg.credits} credits</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-3xl font-bold">{pkg.price}</div>
                    <Button className="w-full" variant={pkg.popular ? "default" : "outline"}>
                      Purchase
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Credits;
