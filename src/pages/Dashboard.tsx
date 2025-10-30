import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, TrendingUp, Clock, MessageSquare, Play, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ConversationalWidget } from "@/components/ConversationalWidget";

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading] = useState(false);

  // Mock data for demonstration
  const calls = [
    {
      id: '1',
      phone_number: '+1 (555) 123-4567',
      started_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      status: 'completed',
      duration_sec: 245,
    },
    {
      id: '2',
      phone_number: '+1 (555) 234-5678',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      status: 'completed',
      duration_sec: 180,
    },
    {
      id: '3',
      phone_number: '+1 (555) 345-6789',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      status: 'completed',
      duration_sec: 312,
    },
    {
      id: '4',
      phone_number: '+1 (555) 456-7890',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      status: 'completed',
      duration_sec: 198,
    },
    {
      id: '5',
      phone_number: '+1 (555) 567-8901',
      started_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: 'completed',
      duration_sec: 267,
    },
  ];

  // Calculate metrics
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const todayCalls = calls.filter(call => {
    const callDate = new Date(call.started_at);
    callDate.setHours(0, 0, 0, 0);
    return callDate.getTime() === today.getTime();
  });

  const avgDuration = calls.length > 0
    ? Math.round(calls.reduce((sum, call) => sum + (call.duration_sec || 0), 0) / calls.length)
    : 0;

  const completedCalls = calls.filter(call => call.status === 'completed').length;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Personalized Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2">{getGreeting()}</h1>
          <p className="text-muted-foreground">
            Here's what's happening with your AI assistant today
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Calls</CardTitle>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">{calls.length}</div>
              <p className="text-xs text-muted-foreground mt-2">
                +{todayCalls.length} today
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Avg Duration</CardTitle>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {Math.floor(avgDuration / 60)}m {avgDuration % 60}s
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Per call
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {calls.length > 0 ? Math.round((completedCalls / calls.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {completedCalls} completed
              </p>
            </CardContent>
          </Card>

          <Card className="border-border/40 shadow-sm hover:shadow-md transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Now</CardTitle>
              <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-semibold">
                {calls.filter(c => c.status === 'in-progress').length}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Live calls
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Calls - Takes 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-border/40 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Recent Calls</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    Latest activity from your AI assistant
                  </p>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => navigate('/history')}
                  className="gap-1.5 text-primary hover:text-primary/80"
                >
                  View all
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-12 text-muted-foreground">
                    Loading calls...
                  </div>
                ) : calls.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                      <Phone className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      No calls yet. Your AI is ready!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {calls.slice(0, 5).map((call) => (
                      <div
                        key={call.id}
                        className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all cursor-pointer group"
                        onClick={() => navigate('/history')}
                      >
                        <div className="flex items-center gap-3.5">
                          <div className="h-11 w-11 rounded-full bg-card border border-border/50 flex items-center justify-center">
                            <Phone className="h-4.5 w-4.5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium text-sm">{call.phone_number}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {new Date(call.started_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge variant="secondary" className="text-xs font-normal rounded-full px-3">
                            {call.status}
                          </Badge>
                          {call.duration_sec && (
                            <span className="text-xs text-muted-foreground font-medium">
                              {Math.floor(call.duration_sec / 60)}m {call.duration_sec % 60}s
                            </span>
                          )}
                          <Play className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Conversational Widget - Takes 1 column */}
          <div>
            <ConversationalWidget />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
