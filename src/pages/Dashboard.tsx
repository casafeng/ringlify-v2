import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Clock, TrendingUp, Smile, Meh, Frown, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Call {
  id: string;
  phone_number: string;
  status: string;
  sentiment: string | null;
  intent: string | null;
  started_at: string;
  duration_sec: number | null;
}

const Dashboard = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalls();

    // Real-time subscription
    const channel = supabase
      .channel('dashboard-calls')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calls' }, () => {
        fetchCalls();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchCalls = async () => {
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .order('started_at', { ascending: false });

    if (!error && data) {
      setCalls(data);
    }
    setLoading(false);
  };

  // Calculate metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayCalls = calls.filter(call => new Date(call.started_at) >= today);
  const completedCalls = calls.filter(call => call.status === 'completed');
  
  const avgDuration = completedCalls.length > 0
    ? Math.round(completedCalls.reduce((acc, call) => acc + (call.duration_sec || 0), 0) / completedCalls.length)
    : 0;

  const sentimentCounts = {
    positive: calls.filter(c => c.sentiment?.toLowerCase() === 'positive').length,
    neutral: calls.filter(c => c.sentiment?.toLowerCase() === 'neutral').length,
    negative: calls.filter(c => c.sentiment?.toLowerCase() === 'negative').length,
  };

  const intentCounts = calls.reduce((acc, call) => {
    if (call.intent) {
      acc[call.intent] = (acc[call.intent] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  const topIntents = Object.entries(intentCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Chart data - last 7 days
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    return date;
  });

  const chartData = last7Days.map(date => {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const dayCalls = calls.filter(call => {
      const callDate = new Date(call.started_at);
      return callDate >= dayStart && callDate <= dayEnd;
    });

    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      calls: dayCalls.length,
      completed: dayCalls.filter(c => c.status === 'completed').length,
    };
  });

  const recentCalls = calls.slice(0, 5);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "N/A";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const getSentimentIcon = (sentiment: string | null) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive':
        return <Smile className="h-4 w-4 text-success" />;
      case 'negative':
        return <Frown className="h-4 w-4 text-destructive" />;
      default:
        return <Meh className="h-4 w-4 text-muted-foreground" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Your AI receptionist performance at a glance
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Total Calls</span>
                <Phone className="h-4 w-4 text-chart-1" />
              </div>
              <div className="text-3xl font-bold">{calls.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {todayCalls.length} today
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Completed</span>
                <TrendingUp className="h-4 w-4 text-success" />
              </div>
              <div className="text-3xl font-bold">{completedCalls.length}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {calls.length > 0 ? Math.round((completedCalls.length / calls.length) * 100) : 0}% success rate
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Avg Duration</span>
                <Clock className="h-4 w-4 text-chart-2" />
              </div>
              <div className="text-3xl font-bold">{Math.floor(avgDuration / 60)}m {avgDuration % 60}s</div>
              <p className="text-xs text-muted-foreground mt-1">
                Per call
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Positive Calls</span>
                <Smile className="h-4 w-4 text-success" />
              </div>
              <div className="text-3xl font-bold">{sentimentCounts.positive}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {calls.length > 0 ? Math.round((sentimentCounts.positive / calls.length) * 100) : 0}% positive sentiment
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call Volume Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Call Volume (Last 7 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
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
                  dataKey="completed"
                  stackId="2"
                  stroke="hsl(var(--success))"
                  fill="hsl(var(--success))"
                  fillOpacity={0.6}
                  name="Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bottom Row */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Top Intents */}
          <Card>
            <CardHeader>
              <CardTitle>Top Call Intents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topIntents.length > 0 ? (
                  topIntents.map(([intent, count]) => {
                    const percentage = calls.length > 0 ? (count / calls.length) * 100 : 0;
                    return (
                      <div key={intent} className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="font-medium capitalize">{intent}</span>
                          <span className="text-muted-foreground">
                            {count} ({percentage.toFixed(0)}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No call data yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Sentiment Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Sentiment Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { label: 'Positive', count: sentimentCounts.positive, color: 'bg-success', icon: Smile },
                  { label: 'Neutral', count: sentimentCounts.neutral, color: 'bg-chart-2', icon: Meh },
                  { label: 'Negative', count: sentimentCounts.negative, color: 'bg-destructive', icon: Frown },
                ].map((item) => {
                  const percentage = calls.length > 0 ? (item.count / calls.length) * 100 : 0;
                  return (
                    <div
                      key={item.label}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                        <item.icon className="h-4 w-4" />
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{item.count}</div>
                        <div className="text-xs text-muted-foreground">{percentage.toFixed(0)}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Calls</CardTitle>
          </CardHeader>
          <CardContent>
            {recentCalls.length > 0 ? (
              <div className="space-y-4">
                {recentCalls.map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{call.phone_number}</span>
                      </div>
                      {call.intent && (
                        <Badge variant="outline" className="capitalize">
                          {call.intent}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {getSentimentIcon(call.sentiment)}
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{formatDuration(call.duration_sec)}</span>
                      </div>
                      <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                        {call.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Phone className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <p className="text-muted-foreground">No calls yet. Your dashboard will populate once calls start coming in.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
