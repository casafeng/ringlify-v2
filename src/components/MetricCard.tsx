import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string;
  change: number;
  changeLabel: string;
  sparklineData?: number[];
}

export function MetricCard({ title, value, change, changeLabel, sparklineData }: MetricCardProps) {
  const isPositive = change >= 0;

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div>
            <div className="text-3xl font-bold">{value}</div>
            <div className="flex items-center gap-1 text-sm mt-1">
              {isPositive ? (
                <TrendingUp className="h-4 w-4 text-success" />
              ) : (
                <TrendingDown className="h-4 w-4 text-destructive" />
              )}
              <span className={isPositive ? "text-success" : "text-destructive"}>
                {Math.abs(change)}%
              </span>
              <span className="text-muted-foreground">{changeLabel}</span>
            </div>
          </div>
          {sparklineData && (
            <div className="h-12 w-24">
              <svg viewBox="0 0 100 50" className="w-full h-full">
                <polyline
                  points={sparklineData
                    .map((val, i) => `${(i / (sparklineData.length - 1)) * 100},${50 - val}`)
                    .join(" ")}
                  fill="none"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  className="opacity-50"
                />
              </svg>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
