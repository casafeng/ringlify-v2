import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { BusinessInfoSection } from "@/components/customization/BusinessInfoSection";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { toast } from "sonner";

interface BusinessInfoStepProps {
  onNext: () => void;
}

export const BusinessInfoStep = ({ onNext }: BusinessInfoStepProps) => {
  const { customerId } = useCustomer();
  const [businessName, setBusinessName] = useState("");
  const [serviceType, setServiceType] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return;
      
      const { data } = await supabase
        .from('customers')
        .select('business_name, settings')
        .eq('id', customerId)
        .single();

      if (data) {
        setBusinessName(data.business_name || "");
        setServiceType((data.settings as any)?.serviceType || "");
      }
    };

    fetchData();
  }, [customerId]);

  const handleChange = async (data: { businessName?: string; serviceType?: string }) => {
    if (!customerId) return;

    const updates: any = {};
    
    if (data.businessName !== undefined) {
      updates.business_name = data.businessName;
      setBusinessName(data.businessName);
    }
    
    if (data.serviceType !== undefined) {
      const { data: current } = await supabase
        .from('customers')
        .select('settings')
        .eq('id', customerId)
        .single();
      
      updates.settings = {
        ...(current?.settings as any || {}),
        serviceType: data.serviceType
      };
      setServiceType(data.serviceType);
    }

    const { error } = await supabase
      .from('customers')
      .update(updates)
      .eq('id', customerId);

    if (error) {
      console.error('Error updating:', error);
      toast.error("Failed to save");
    } else {
      toast.success("Saved");
    }
  };

  return (
    <div className="space-y-6">
      <BusinessInfoSection 
        businessName={businessName}
        serviceType={serviceType}
        onChange={handleChange}
      />
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
};
