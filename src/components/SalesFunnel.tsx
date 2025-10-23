import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface FunnelStep {
  label: string;
  count: number;
  highlight?: boolean;
}

const steps: FunnelStep[] = [
  { label: "Sessions", count: 12453 },
  { label: "Product View", count: 8234 },
  { label: "Add to Cart", count: 3421, highlight: true },
  { label: "Initiate Checkout", count: 2187 },
  { label: "Purchase", count: 1543 },
];

export function SalesFunnel() {
  const maxCount = Math.max(...steps.map(s => s.count));

  return (
    <Card className="rounded-2xl shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Sales Funnel</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-2">
          {steps.map((step, index) => {
            const percentage = (step.count / maxCount) * 100;
            return (
              <div key={step.label} className="flex-1 text-center">
                <div
                  className={`mx-auto mb-2 rounded-lg transition-all ${
                    step.highlight
                      ? "bg-primary"
                      : "bg-muted"
                  }`}
                  style={{
                    height: `${Math.max(percentage * 0.8, 20)}px`,
                    width: "100%",
                  }}
                />
                <div className="text-xs font-medium mb-1">{step.label}</div>
                <div className="text-sm text-muted-foreground">
                  {step.count.toLocaleString()}
                </div>
                {index < steps.length - 1 && (
                  <div className="mt-2 text-xs text-muted-foreground">
                    →
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
