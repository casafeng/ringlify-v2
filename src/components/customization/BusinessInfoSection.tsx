import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface BusinessInfoSectionProps {
  defaultBusinessName?: string;
  defaultServiceType?: string;
  defaultContext?: string;
  onSave: (data: { businessName: string; serviceType: string; context: string }) => void;
}

export const BusinessInfoSection = ({
  defaultBusinessName = "",
  defaultServiceType = "",
  defaultContext = "",
  onSave,
}: BusinessInfoSectionProps) => {
  const [businessName, setBusinessName] = useState(defaultBusinessName);
  const [serviceType, setServiceType] = useState(defaultServiceType);
  const [context, setContext] = useState(defaultContext);

  const handleSave = () => {
    onSave({
      businessName,
      serviceType,
      context,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Business Info</CardTitle>
        <CardDescription>
          Help your assistant understand your business
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="business-name">Business Name</Label>
          <Input
            id="business-name"
            placeholder="e.g., Sunrise Dental Clinic"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="service-type">What Do You Do?</Label>
          <Input
            id="service-type"
            placeholder="e.g., Dental services, Hair salon, Law firm"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="context">Key Business Information</Label>
          <Textarea
            id="context"
            placeholder="Tell your assistant about your business: services offered, pricing, location, special policies..."
            value={context}
            onChange={(e) => setContext(e.target.value)}
            rows={6}
          />
          <p className="text-xs text-muted-foreground">
            Include anything your assistant should know when talking to customers
          </p>
        </div>

        <Button onClick={handleSave} size="lg">
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
};
