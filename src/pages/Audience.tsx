import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, UserPlus, Download } from "lucide-react";

interface Contact {
  id: string;
  name: string;
  phone: string;
  email: string;
  totalCalls: number;
  lastContact: string;
  status: string;
}

const contacts: Contact[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    phone: "+1 (555) 123-4567",
    email: "sarah.j@email.com",
    totalCalls: 5,
    lastContact: "2 hours ago",
    status: "Active",
  },
  {
    id: "2",
    name: "Michael Chen",
    phone: "+1 (555) 234-5678",
    email: "mchen@email.com",
    totalCalls: 3,
    lastContact: "1 day ago",
    status: "Active",
  },
  {
    id: "3",
    name: "Emma Wilson",
    phone: "+1 (555) 345-6789",
    email: "emma.w@email.com",
    totalCalls: 8,
    lastContact: "3 days ago",
    status: "Regular",
  },
  {
    id: "4",
    name: "David Martinez",
    phone: "+1 (555) 456-7890",
    email: "d.martinez@email.com",
    totalCalls: 2,
    lastContact: "1 week ago",
    status: "New",
  },
  {
    id: "5",
    name: "Lisa Anderson",
    phone: "+1 (555) 567-8901",
    email: "lisa.a@email.com",
    totalCalls: 12,
    lastContact: "4 hours ago",
    status: "VIP",
  },
];

const getStatusVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "vip":
      return "default";
    case "regular":
      return "secondary";
    case "active":
      return "outline";
    case "new":
      return "outline";
    default:
      return "secondary";
  }
};

const Audience = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Audience</h1>
            <p className="text-muted-foreground">
              Manage your customer contacts and relationships
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">1,234</div>
              <p className="text-xs text-muted-foreground">Total Contacts</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground">Active Contacts</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">VIP Customers</p>
            </CardContent>
          </Card>
          <Card className="rounded-2xl shadow-sm">
            <CardContent className="pt-6">
              <div className="text-2xl font-bold">3.2</div>
              <p className="text-xs text-muted-foreground">Avg Calls/Contact</p>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contacts..."
              className="pl-10 rounded-xl"
            />
          </div>
        </div>

        {/* Contacts Table */}
        <Card className="rounded-2xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">All Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Total Calls</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contacts.map((contact) => (
                  <TableRow key={contact.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-medium">{contact.name}</TableCell>
                    <TableCell>{contact.phone}</TableCell>
                    <TableCell className="text-muted-foreground">{contact.email}</TableCell>
                    <TableCell>{contact.totalCalls}</TableCell>
                    <TableCell className="text-muted-foreground">{contact.lastContact}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(contact.status)}>
                        {contact.status}
                      </Badge>
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

export default Audience;
