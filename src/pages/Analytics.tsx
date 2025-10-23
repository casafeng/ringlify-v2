import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Phone, Clock, CheckCircle } from "lucide-react";

const callVolumeData = [
  { date: "Jan 10", calls: 45, answered: 42 },
  { date: "Jan 11", calls: 52, answered: 48 },
  { date: "Jan 12", calls: 48, answered: 47 },
  { date: "Jan 13", calls: 61, answered: 58 },
  { date: "Jan 14", calls: 55, answered: 53 },
  { date: "Jan 15", calls: 67, answered: 64 },
  { date: "Jan 16", calls: 58, answered: 56 },
];

const responseTimeData = [
  { hour: "9 AM", avgTime: 12 },
  { hour: "10 AM", avgTime: 8 },
  { hour: "11 AM", avgTime: 10 },
  { hour: "12 PM", avgTime: 15 },
  { hour: "1 PM", avgTime: 18 },
  { hour: "2 PM", avgTime: 11 },
  { hour: "3 PM", avgTime: 9 },
  { hour: "4 PM", avgTime: 13 },
  { hour: "5 PM", avgTime: 16 },
];

const Analytics = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Analytics</h1>
          <p className="text-muted-foreground">
            Track your AI receptionist's key metrics
          </p>
        </div>

        {/* KPIs */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Phone className="h-4 w-4 text-chart-1" />
                <span className="text-xs text-muted-foreground">Answer Rate</span>
              </div>
              <div className="text-2xl font-bold">95.8%</div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success">+2.3%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-chart-2" />
                <span className="text-xs text-muted-foreground">Avg Handle Time</span>
              </div>
              <div className="text-2xl font-bold">3m 24s</div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success">-12s</span>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">Task Completion</span>
              </div>
              <div className="text-2xl font-bold">87.4%</div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <TrendingUp className="h-4 w-4 text-success" />
                <span className="text-success">+5.1%</span>
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">Customer Satisfaction</span>
              </div>
              <div className="text-2xl font-bold">4.7/5.0</div>
              <div className="flex items-center gap-1 text-sm mt-1">
                <span className="text-muted-foreground">Based on 234 ratings</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call Volume Chart */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Call Volume Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={callVolumeData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stackId="1"
                  stroke="hsl(var(--chart-1))"
                  fill="hsl(var(--chart-1))"
                  fillOpacity={0.6}
                  name="Total Calls"
                />
                <Area
                  type="monotone"
                  dataKey="answered"
                  stackId="2"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success))"
                  fillOpacity={0.6}
                  name="Answered"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response Time Chart */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Average Response Time by Hour</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="hour" />
                <YAxis label={{ value: 'Seconds', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="avgTime"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  name="Response Time (s)"
                  dot={{ fill: "hsl(var(--chart-2))", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Intent Distribution */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Intent Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { intent: "Schedule", count: 342, percentage: 45 },
                  { intent: "Reschedule", count: 156, percentage: 21 },
                  { intent: "FAQ", count: 134, percentage: 18 },
                  { intent: "Cancel", count: 89, percentage: 12 },
                  { intent: "Handoff", count: 34, percentage: 4 },
                ].map((item) => (
                  <div key={item.intent} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{item.intent}</span>
                      <span className="text-muted-foreground">
                        {item.count} ({item.percentage}%)
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Outcome Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { outcome: "Booked", count: 287, color: "bg-success" },
                  { outcome: "Resolved", count: 134, color: "bg-chart-2" },
                  { outcome: "Modified", count: 98, color: "bg-chart-4" },
                  { outcome: "Transferred", count: 45, color: "bg-chart-1" },
                  { outcome: "Cancelled", count: 34, color: "bg-destructive" },
                ].map((item) => (
                  <div
                    key={item.outcome}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-medium">{item.outcome}</span>
                    </div>
                    <span className="text-lg font-bold">{item.count}</span>
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

export default Analytics;
