import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="business-name">Business Name</Label>
        <Input
          id="business-name"
          value={businessName}
          onChange={(e) => onChange({ businessName: e.target.value })}
          placeholder="e.g., Sunrise Dental"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="service-type">What do you do?</Label>
        <Select value={serviceType} onValueChange={(value) => onChange({ serviceType: value })}>
          <SelectTrigger id="service-type">
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
  );
};
