import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Copy, CheckCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";

interface ForwardingSetupStepProps {
  onNext: () => void;
  setPhoneNumberConfigured: (configured: boolean) => void;
}

export const ForwardingSetupStep = ({ onNext, setPhoneNumberConfigured }: ForwardingSetupStepProps) => {
  const [businessNumber, setBusinessNumber] = useState("");
  const [forwardingNumber, setForwardingNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const { customerId } = useCustomer();

  // Generate or fetch forwarding number
  useEffect(() => {
    const getForwardingNumber = async () => {
      if (!customerId) return;

      // Check if customer already has a phone number
      const { data } = await supabase
        .from('phone_numbers')
        .select('phone_number, business_phone_number')
        .eq('customer_id', customerId)
        .eq('setup_method', 'forwarding')
        .maybeSingle();

      if (data) {
        setForwardingNumber(data.phone_number);
        setBusinessNumber(data.business_phone_number || '');
        setIsSaved(!!data.business_phone_number);
      } else {
        // For demo, generate a forwarding number
        // In production, this would call provision-twilio-number to purchase
        setForwardingNumber('+1 (555) 000-0000'); // Placeholder
      }
    };

    getForwardingNumber();
  }, [customerId]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  const handleSave = async () => {
    if (!businessNumber) {
      toast.error("Please enter your business phone number");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('phone_numbers')
        .upsert({
          customer_id: customerId,
          business_phone_number: businessNumber,
          phone_number: forwardingNumber,
          setup_method: 'forwarding',
          forwarding_verified: false,
          status: 'active'
        }, {
          onConflict: 'customer_id,phone_number'
        });

      if (error) throw error;

      setIsSaved(true);
      setPhoneNumberConfigured(true);
      toast.success("Phone number saved");
    } catch (error) {
      console.error('Error saving phone number:', error);
      toast.error("Failed to save phone number");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="business-number">Your Business Phone Number</Label>
          <Input
            id="business-number"
            type="tel"
            placeholder="+1 (555) 123-4567"
            value={businessNumber}
            onChange={(e) => setBusinessNumber(e.target.value)}
            disabled={isSaved}
          />
          <p className="text-sm text-muted-foreground mt-1">
            This is the number your customers call
          </p>
        </div>

        <Card className="p-4 bg-primary/5 border-primary/20">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium">Your Forwarding Number</Label>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <span className="text-lg font-semibold">{forwardingNumber}</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Forward your business number to this number
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(forwardingNumber)}
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </Card>
      </div>

      <div className="space-y-3">
        <h4 className="font-semibold">How to Set Up Call Forwarding</h4>
        <Card className="p-4 space-y-3">
          <div className="space-y-2">
            <p className="text-sm font-medium">Option 1: Dial Code (Most Carriers)</p>
            <ol className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>1. Open your phone's dialer</li>
              <li>2. Dial: <code className="bg-muted px-2 py-0.5 rounded">*72{forwardingNumber.replace(/\D/g, '')}</code></li>
              <li>3. Press Call and wait for confirmation</li>
            </ol>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">Option 2: Carrier Settings</p>
            <ul className="text-sm text-muted-foreground space-y-1 pl-4">
              <li>• AT&T: Call 611 or use myAT&T app</li>
              <li>• Verizon: Use My Verizon app or dial *72</li>
              <li>• T-Mobile: Dial **21*{forwardingNumber.replace(/\D/g, '')}#</li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium">To Disable Forwarding Later:</p>
            <p className="text-sm text-muted-foreground pl-4">
              Dial <code className="bg-muted px-2 py-0.5 rounded">*73</code> to turn off call forwarding
            </p>
          </div>
        </Card>
      </div>

      <div className="flex gap-2">
        {!isSaved ? (
          <Button onClick={handleSave} disabled={isLoading} className="flex-1">
            {isLoading ? "Saving..." : "Save Configuration"}
          </Button>
        ) : (
          <Button onClick={onNext} className="flex-1">
            <CheckCircle className="w-4 h-4 mr-2" />
            Continue to Next Step
          </Button>
        )}
      </div>
    </div>
  );
};
