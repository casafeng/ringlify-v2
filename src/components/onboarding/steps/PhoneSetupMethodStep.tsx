import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone, Forward } from "lucide-react";
import { SetupMethod } from "../OnboardingWizard";

interface PhoneSetupMethodStepProps {
  onNext: () => void;
  setupMethod: SetupMethod;
  setSetupMethod: (method: SetupMethod) => void;
}

export const PhoneSetupMethodStep = ({ 
  onNext, 
  setupMethod, 
  setSetupMethod 
}: PhoneSetupMethodStepProps) => {
  const handleSelect = (method: 'forwarding' | 'purchased') => {
    setSetupMethod(method);
    onNext();
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">How do you want to set up your phone number?</h3>
        <p className="text-muted-foreground">
          Choose the option that works best for your business
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 py-4">
        {/* Forwarding Option - Recommended */}
        <Card className="relative p-6 cursor-pointer hover:border-primary transition-all border-2" onClick={() => handleSelect('forwarding')}>
          <div className="absolute top-4 right-4">
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-2 py-1 rounded">
              Recommended
            </span>
          </div>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Forward className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Use My Existing Number</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Keep your current business number. We'll give you a forwarding number to route calls to our AI.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Keep your existing business number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>No need to update marketing materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Easy to turn on/off forwarding</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Free setup</span>
                </li>
              </ul>
            </div>
            <Button className="w-full" onClick={() => handleSelect('forwarding')}>
              Use Forwarding
            </Button>
          </div>
        </Card>

        {/* Purchase Option */}
        <Card className="p-6 cursor-pointer hover:border-primary transition-all border-2" onClick={() => handleSelect('purchased')}>
          <div className="space-y-4">
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2">Get a New Number</h4>
              <p className="text-sm text-muted-foreground mb-4">
                Purchase a dedicated phone number for your AI assistant.
              </p>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Dedicated AI assistant number</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Choose your area code</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">✓</span>
                  <span>Instant setup</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">~$1/month per number</span>
                </li>
              </ul>
            </div>
            <Button variant="outline" className="w-full" onClick={() => handleSelect('purchased')}>
              Purchase Number
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
