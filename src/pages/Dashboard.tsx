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
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your AI assistant's performance and recent activity
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{calls.length}</div>
              <p className="text-xs text-muted-foreground">
                {todayCalls.length} today
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Math.floor(avgDuration / 60)}m {avgDuration % 60}s</div>
              <p className="text-xs text-muted-foreground">
                Per call
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {calls.length > 0 ? Math.round((completedCalls / calls.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">
                {completedCalls} completed
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {calls.filter(c => c.status === 'in-progress').length}
              </div>
              <p className="text-xs text-muted-foreground">
                Live calls
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calls */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Calls</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Latest incoming calls
              </p>
            </div>
            <Button 
              variant="outline" 
              onClick={() => navigate('/history')}
            >
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading calls...
              </div>
            ) : calls.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No calls yet. Your AI is ready to receive calls!
              </div>
            ) : (
              <div className="space-y-4">
                {calls.slice(0, 5).map((call) => (
                  <div
                    key={call.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <Phone className="h-5 w-5 text-primary" />
                      <div>
                        <p className="font-medium">{call.phone_number}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(call.started_at).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={call.status === 'completed' ? 'default' : 'secondary'}>
                        {call.status}
                      </Badge>
                      {call.duration_sec && (
                        <span className="text-sm text-muted-foreground">
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
