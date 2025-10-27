import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { BusinessInfoDialog } from "./BusinessInfoDialog";

const serviceTypes = [
  { value: "dental", label: "Dental Services" },
  { value: "medical", label: "Medical Practice" },
  { value: "legal", label: "Legal Services" },
  { value: "salon", label: "Salon & Beauty" },
  { value: "consulting", label: "Consulting" },
  { value: "restaurant", label: "Restaurant" },
  { value: "retail", label: "Retail Store" },
  { value: "other", label: "Other" },
];

interface BusinessInfoSectionProps {
  businessName: string;
  serviceType: string;
  onChange: (data: { businessName?: string; serviceType?: string }) => void;
}

export const BusinessInfoSection = ({
  businessName,
  serviceType,
  onChange,
}: BusinessInfoSectionProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  const serviceTypeLabel = serviceTypes.find((t) => t.value === serviceType)?.label || "Not set";

  const handleSave = (data: { businessName: string; serviceType: string }) => {
    onChange({ businessName: data.businessName, serviceType: data.serviceType });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 space-y-3">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Business Name</p>
              <p className="font-medium">{businessName || "Not set"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Service Type</p>
              <p className="font-medium">{serviceTypeLabel}</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setDialogOpen(true)}
            className="ml-4"
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>

      <BusinessInfoDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        businessName={businessName}
        serviceType={serviceType}
        onSave={handleSave}
      />
    </>
  );
};
