import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

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

interface BusinessInfoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  businessName: string;
  serviceType: string;
  onSave: (data: { businessName: string; serviceType: string }) => void;
}

export const BusinessInfoDialog = ({
  open,
  onOpenChange,
  businessName: initialBusinessName,
  serviceType: initialServiceType,
  onSave,
}: BusinessInfoDialogProps) => {
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [serviceType, setServiceType] = useState(initialServiceType);

  const handleSave = () => {
    onSave({ businessName, serviceType });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Business Information</DialogTitle>
          <DialogDescription>
            Update your business name and service type
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="dialog-business-name">Business Name</Label>
            <Input
              id="dialog-business-name"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              placeholder="e.g., Sunrise Dental"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dialog-service-type">What do you do?</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger id="dialog-service-type">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
