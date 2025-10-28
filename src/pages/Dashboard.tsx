import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, TrendingUp, Clock, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { customerId } = useCustomer();
  const navigate = useNavigate();
  const [calls, setCalls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (customerId) {
      fetchCalls();
      
      // Set up real-time subscription
      const channel = supabase
        .channel('calls-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'calls'
          },
          (payload) => {
            console.log('Real-time call update:', payload);
            fetchCalls();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [customerId]);

  const fetchCalls = async () => {
    if (!customerId) return;
    
    // @ts-ignore
    const { data, error } = await supabase
      .from('calls')
      .select('*')
      .eq('customer_id', customerId)
      .order('started_at', { ascending: false });

    if (!error && data) {
      setCalls(data);
    }
    setLoading(false);
  };

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
