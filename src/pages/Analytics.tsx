import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, Phone, Clock, CheckCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { Skeleton } from "@/components/ui/skeleton";

const Analytics = () => {
  const { customerId } = useCustomer();

  const { data: callsData = [], isLoading: callsLoading } = useQuery({
    queryKey: ["analytics-calls", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const { data, error } = await supabase.from("calls").select("*").eq("customer_id", customerId).order("started_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
    enabled: !!customerId,
  });

  const totalCalls = callsData.length;
  const completedCalls = callsData.filter(c => c.status === 'completed').length;
  const answerRate = totalCalls > 0 ? ((completedCalls / totalCalls) * 100).toFixed(1) : 0;
  const avgDuration = callsData.length > 0 ? Math.round(callsData.reduce((sum, call) => sum + (call.duration_sec || 0), 0) / callsData.length) : 0;

  const callVolumeData = callsData.reduce((acc: any[], call) => {
    const date = new Date(call.started_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const existing = acc.find(item => item.date === date);
    if (existing) { existing.calls += 1; if (call.status === 'completed') existing.answered += 1; }
    else { acc.push({ date, calls: 1, answered: call.status === 'completed' ? 1 : 0 }); }
    return acc;
  }, []);

  const responseTimeData = callsData.reduce((acc: any[], call) => {
    if (!call.duration_sec) return acc;
    const hour = new Date(call.started_at).getHours();
    const hourLabel = `${hour % 12 || 12} ${hour >= 12 ? 'PM' : 'AM'}`;
    const existing = acc.find(item => item.hour === hourLabel);
    if (existing) { existing.total += call.duration_sec; existing.count += 1; existing.avgTime = Math.round(existing.total / existing.count); }
    else { acc.push({ hour: hourLabel, avgTime: call.duration_sec, total: call.duration_sec, count: 1 }); }
    return acc;
  }, []);

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
              {callsLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Phone className="h-4 w-4 text-chart-1" />
                    <span className="text-xs text-muted-foreground">Answer Rate</span>
                  </div>
                  <div className="text-2xl font-bold">{answerRate}%</div>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <span className="text-muted-foreground">
                      {completedCalls}/{totalCalls} calls
                    </span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              {callsLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-chart-2" />
                    <span className="text-xs text-muted-foreground">Avg Handle Time</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {Math.floor(avgDuration / 60)}m {avgDuration % 60}s
                  </div>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <span className="text-muted-foreground">per call</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              {callsLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle className="h-4 w-4 text-success" />
                    <span className="text-xs text-muted-foreground">Total Calls</span>
                  </div>
                  <div className="text-2xl font-bold">{totalCalls}</div>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <span className="text-muted-foreground">all time</span>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              {callsLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs text-muted-foreground">In Progress</span>
                  </div>
                  <div className="text-2xl font-bold">
                    {callsData.filter(c => c.status === 'in-progress').length}
                  </div>
                  <div className="flex items-center gap-1 text-sm mt-1">
                    <span className="text-muted-foreground">active now</span>
                  </div>
                </>
              )}
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
