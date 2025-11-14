import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { TonePersonalitySection } from "@/components/customization/TonePersonalitySection";
import { CapabilitiesSection } from "@/components/customization/CapabilitiesSection";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { toast } from "sonner";

interface PersonalityStepProps {
  onNext: () => void;
}

export const PersonalityStep = ({ onNext }: PersonalityStepProps) => {
  const { customerId } = useCustomer();
  const [tone, setTone] = useState("");
  const [greeting, setGreeting] = useState("");
  const [capabilities, setCapabilities] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchData = async () => {
      if (!customerId) return;
      
      const { data } = await supabase
        .from('ai_configurations')
        .select('tone, greeting')
        .eq('customer_id', customerId)
        .single();

      if (data) {
        setTone(data.tone || "warm");
        setGreeting(data.greeting || "");
      }
    };

    fetchData();
  }, [customerId]);

  const handleToneChange = async (data: { tone?: string; greeting?: string }) => {
    if (!customerId) return;

    const updates: any = {};
    if (data.tone !== undefined) {
      updates.tone = data.tone;
      setTone(data.tone);
    }
    if (data.greeting !== undefined) {
      updates.greeting = data.greeting;
      setGreeting(data.greeting);
    }

    const { error } = await supabase
      .from('ai_configurations')
      .update(updates)
      .eq('customer_id', customerId);

    if (error) {
      console.error('Error updating:', error);
      toast.error("Failed to save");
    } else {
      toast.success("Saved");
    }
  };

  const handleCapabilitiesChange = (newCapabilities: Record<string, boolean>) => {
    setCapabilities(newCapabilities);
  };

  return (
    <div className="space-y-6">
      <TonePersonalitySection 
        tone={tone}
        greeting={greeting}
        onChange={handleToneChange}
      />
      <CapabilitiesSection 
        enabledCapabilities={capabilities}
        onChange={handleCapabilitiesChange}
      />
      <div className="flex justify-end">
        <Button onClick={onNext}>Continue</Button>
      </div>
    </div>
  );
};
