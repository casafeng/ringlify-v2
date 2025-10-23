import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { SalesFunnel } from "@/components/SalesFunnel";
import { DeviceChart } from "@/components/DeviceChart";
import { AudienceChart } from "@/components/AudienceChart";
import { BookingsTable } from "@/components/BookingsTable";

const Dashboard = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back! Here's your business overview.
          </p>
        </div>

        {/* Top Metrics */}
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            title="Available to payout"
            value="$12,453"
            change={12.5}
            changeLabel="from last period"
            sparklineData={[20, 25, 22, 30, 28, 35, 32, 38]}
          />
          <MetricCard
            title="Today revenue"
            value="$8,234"
            change={8.3}
            changeLabel="from yesterday"
            sparklineData={[15, 18, 22, 20, 25, 28, 26, 30]}
          />
          <MetricCard
            title="Today sessions"
            value="3,421"
            change={-2.4}
            changeLabel="from yesterday"
            sparklineData={[30, 28, 32, 29, 27, 25, 28, 26]}
          />
        </div>

        {/* Sales Funnel */}
        <SalesFunnel />

        {/* Charts Row */}
        <div className="grid gap-4 md:grid-cols-2">
          <DeviceChart />
          <AudienceChart />
        </div>

        {/* Tables */}
        <BookingsTable />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
