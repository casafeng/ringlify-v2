import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CreditCard, Download, Calendar } from "lucide-react";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: "Paid" | "Pending" | "Overdue";
  period: string;
}

const invoices: Invoice[] = [
  {
    id: "INV-2025-001",
    date: "Jan 1, 2025",
    amount: "$249.00",
    status: "Paid",
    period: "Dec 2024",
  },
  {
    id: "INV-2024-012",
    date: "Dec 1, 2024",
    amount: "$249.00",
    status: "Paid",
    period: "Nov 2024",
  },
  {
    id: "INV-2024-011",
    date: "Nov 1, 2024",
    amount: "$249.00",
    status: "Paid",
    period: "Oct 2024",
  },
  {
    id: "INV-2024-010",
    date: "Oct 1, 2024",
    amount: "$249.00",
    status: "Paid",
    period: "Sep 2024",
  },
];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "paid":
      return "default";
    case "pending":
      return "secondary";
    case "overdue":
      return "destructive";
    default:
      return "secondary";
  }
};

const Billing = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Billing</h1>
          <p className="text-muted-foreground">
            Manage your subscription and payment details
          </p>
        </div>

        {/* Current Plan */}
        <Card className="rounded-2xl shadow-sm border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div className="space-y-4 flex-1">
                <div>
                  <Badge className="mb-2">Current Plan</Badge>
                  <h3 className="text-2xl font-bold">Professional</h3>
                  <p className="text-muted-foreground mt-1">
                    Unlimited calls • Advanced analytics • Priority support
                  </p>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">$249</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
              </div>
              <Button variant="outline">Change Plan</Button>
            </div>
          </CardContent>
        </Card>

        {/* Usage Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Calls This Month</div>
              <div className="text-2xl font-bold">1,234</div>
              <div className="text-xs text-muted-foreground mt-1">
                Unlimited included
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Messages Sent</div>
              <div className="text-2xl font-bold">2,456</div>
              <div className="text-xs text-muted-foreground mt-1">
                $0.02 per message
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Storage Used</div>
              <div className="text-2xl font-bold">12.4 GB</div>
              <div className="text-xs text-muted-foreground mt-1">
                50 GB included
              </div>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-sm text-muted-foreground mb-1">Next Billing</div>
              <div className="text-2xl font-bold">Feb 1</div>
              <div className="text-xs text-muted-foreground mt-1">
                Auto-renews
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Method */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Payment Method</CardTitle>
              <Button variant="outline" size="sm">
                Update
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 p-4 border rounded-xl">
              <div className="p-3 bg-primary/10 rounded-lg">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <div className="font-semibold">Visa ending in 4242</div>
                <div className="text-sm text-muted-foreground">Expires 12/2025</div>
              </div>
              <Badge variant="outline">Default</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Invoice History</CardTitle>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Billing Period</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {invoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.id}</TableCell>
                    <TableCell>{invoice.date}</TableCell>
                    <TableCell>{invoice.period}</TableCell>
                    <TableCell className="font-semibold">{invoice.amount}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(invoice.status)}>
                        {invoice.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Billing;
