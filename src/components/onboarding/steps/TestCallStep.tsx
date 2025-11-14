import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";

interface TestCallStepProps {
  onNext: () => void;
  phoneNumberConfigured: boolean;
}

export const TestCallStep = ({ onNext, phoneNumberConfigured }: TestCallStepProps) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [callStatus, setCallStatus] = useState<'waiting' | 'ringing' | 'success' | 'error'>('waiting');
  const { customerId } = useCustomer();

  useEffect(() => {
    const fetchPhoneNumber = async () => {
      if (!customerId) return;

      const { data } = await supabase
        .from('phone_numbers')
        .select('phone_number, business_phone_number, setup_method')
        .eq('customer_id', customerId)
        .maybeSingle();

      if (data) {
        // Show the number they should call (business number for forwarding, twilio number for purchased)
        setPhoneNumber(data.setup_method === 'forwarding' ? data.business_phone_number : data.phone_number);
      }
    };

    fetchPhoneNumber();
  }, [customerId]);

  // Real-time listener for test call
  useEffect(() => {
    if (!customerId) return;

    const channel = supabase
      .channel('test-call')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'calls',
          filter: `customer_id=eq.${customerId}`
        },
        (payload) => {
          console.log('Test call detected:', payload);
          setCallStatus('ringing');
          
          // Wait a moment and mark as success
          setTimeout(() => {
            setCallStatus('success');
          }, 2000);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [customerId]);

  const getStatusContent = () => {
    switch (callStatus) {
      case 'waiting':
        return {
          icon: <Phone className="w-12 h-12 text-primary animate-pulse" />,
          title: "Ready for Test Call",
          description: "Call the number below to test your AI assistant"
        };
      case 'ringing':
        return {
          icon: <Loader2 className="w-12 h-12 text-primary animate-spin" />,
          title: "Call Detected!",
          description: "Your AI is answering the call..."
        };
      case 'success':
        return {
          icon: <CheckCircle className="w-12 h-12 text-green-500" />,
          title: "Success! ✨",
          description: "Your AI assistant answered correctly"
        };
      case 'error':
        return {
          icon: <AlertCircle className="w-12 h-12 text-destructive" />,
          title: "Test Failed",
          description: "Please check your configuration and try again"
        };
    }
  };

  const status = getStatusContent();

  if (!phoneNumberConfigured) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <p className="text-muted-foreground">
          Please configure a phone number first before testing
        </p>
        <Button className="mt-4" onClick={onNext}>
          Skip Test
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-8 text-center space-y-6">
        {status.icon}
        <div>
          <h3 className="text-xl font-semibold mb-2">{status.title}</h3>
          <p className="text-muted-foreground">{status.description}</p>
        </div>

        {phoneNumber && (
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 space-y-2">
            <p className="text-sm text-muted-foreground">Call this number now:</p>
            <a 
              href={`tel:${phoneNumber}`}
              className="text-3xl font-bold text-primary hover:underline"
            >
              {phoneNumber}
            </a>
          </div>
        )}

        {callStatus === 'waiting' && (
          <p className="text-sm text-muted-foreground">
            Waiting for your test call... The AI will automatically answer and greet you.
          </p>
        )}
      </Card>

      {callStatus === 'success' && (
        <div className="flex justify-end">
          <Button size="lg" onClick={onNext}>
            Complete Setup
          </Button>
        </div>
      )}

      {callStatus === 'waiting' && (
        <div className="flex justify-center">
          <Button variant="ghost" onClick={onNext}>
            Skip test for now
          </Button>
        </div>
      )}
    </div>
  );
};
