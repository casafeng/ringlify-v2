import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, TrendingUp, Clock, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

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

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header with gradient */}
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-purple-500/10 to-primary/10 rounded-3xl blur-3xl" />
          <div className="relative bg-gradient-to-br from-primary/5 to-purple-500/5 rounded-3xl p-8 border border-primary/10">
            <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              Welcome back
            </h1>
            <p className="text-muted-foreground text-lg">
              Monitor your AI assistant's performance and recent activity
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-3xl shadow-lg border-primary/10 bg-gradient-to-br from-background to-primary/5 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {calls.length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {todayCalls.length} today
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg border-purple-500/10 bg-gradient-to-br from-background to-purple-500/5 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <div className="h-10 w-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-purple-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-primary bg-clip-text text-transparent">
                {Math.floor(avgDuration / 60)}m {avgDuration % 60}s
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Per call
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg border-success/10 bg-gradient-to-br from-background to-success/5 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-success to-primary bg-clip-text text-transparent">
                {calls.length > 0 ? Math.round((completedCalls / calls.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {completedCalls} completed
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-3xl shadow-lg border-primary/10 bg-gradient-to-br from-background to-primary/5 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                {calls.filter(c => c.status === 'in-progress').length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Live calls
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls */}
        <Card className="rounded-3xl shadow-lg border-primary/10 overflow-hidden">
          <div className="bg-gradient-to-br from-primary/5 to-purple-500/5 p-6 border-b border-primary/10">
            <div className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold">Recent Calls</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Latest incoming calls
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => navigate('/history')}
                className="rounded-full border-primary/20 hover:bg-primary/10"
              >
                View All
              </Button>
            </div>
          </div>
          <CardContent className="p-6">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">
                <div className="animate-pulse">Loading calls...</div>
              </div>
            ) : calls.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground">
                  No calls yet. Your AI is ready to receive calls!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {calls.slice(0, 5).map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-5 border border-primary/10 rounded-2xl hover:bg-gradient-to-r hover:from-primary/5 hover:to-purple-500/5 transition-all duration-300 hover:shadow-md group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Phone className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{call.phone_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(call.started_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant={call.status === 'completed' ? 'default' : 'secondary'}
                        className="rounded-full px-3 py-1"
                      >
                        {call.status}
                      </Badge>
                      {call.duration_sec && (
                        <span className="text-sm text-muted-foreground font-medium bg-muted/50 px-3 py-1 rounded-full">
                          {Math.floor(call.duration_sec / 60)}m {call.duration_sec % 60}s
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
