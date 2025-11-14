import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { WelcomeStep } from "./steps/WelcomeStep";
import { PhoneSetupMethodStep } from "./steps/PhoneSetupMethodStep";
import { ForwardingSetupStep } from "./steps/ForwardingSetupStep";
import { PurchaseNumberStep } from "./steps/PurchaseNumberStep";
import { BusinessInfoStep } from "./steps/BusinessInfoStep";
import { KnowledgeBaseStep } from "./steps/KnowledgeBaseStep";
import { PersonalityStep } from "./steps/PersonalityStep";
import { TestCallStep } from "./steps/TestCallStep";
import { CompletionStep } from "./steps/CompletionStep";

interface OnboardingWizardProps {
  onComplete: () => void;
}

export type SetupMethod = 'forwarding' | 'purchased' | null;

export const OnboardingWizard = ({ onComplete }: OnboardingWizardProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [setupMethod, setSetupMethod] = useState<SetupMethod>(null);
  const [phoneNumberConfigured, setPhoneNumberConfigured] = useState(false);

  // Dynamic steps based on setup method
  const getSteps = () => {
    const baseSteps = [
      { id: 'welcome', title: 'Welcome', component: WelcomeStep },
      { id: 'phone-method', title: 'Phone Setup', component: PhoneSetupMethodStep },
    ];

    if (setupMethod === 'forwarding') {
      baseSteps.push({ id: 'forwarding', title: 'Call Forwarding', component: ForwardingSetupStep });
    } else if (setupMethod === 'purchased') {
      baseSteps.push({ id: 'purchase', title: 'Purchase Number', component: PurchaseNumberStep });
    }

    return [
      ...baseSteps,
      { id: 'business', title: 'Business Info', component: BusinessInfoStep },
      { id: 'knowledge', title: 'Knowledge Base', component: KnowledgeBaseStep },
      { id: 'personality', title: 'AI Personality', component: PersonalityStep },
      { id: 'test', title: 'Test Call', component: TestCallStep },
      { id: 'complete', title: 'Complete', component: CompletionStep },
    ];
  };

  const steps = getSteps();
  const CurrentStepComponent = steps[currentStep].component;
  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleNext();
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Step {currentStep + 1} of {steps.length}</span>
            <span>{steps[currentStep].title}</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Content */}
        <Card>
          <CardHeader>
            <CardTitle>{steps[currentStep].title}</CardTitle>
            <CardDescription>
              {currentStep === 0 && "Let's get your AI phone assistant set up in just a few steps"}
              {currentStep === 1 && "Choose how you'd like to set up your phone number"}
              {currentStep > 1 && currentStep < steps.length - 1 && "Configure your AI assistant"}
              {currentStep === steps.length - 1 && "You're all set!"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CurrentStepComponent
              {...(steps[currentStep].id === 'welcome' && { onNext: handleNext })}
              {...(steps[currentStep].id === 'phone-method' && { 
                onNext: handleNext, 
                setupMethod, 
                setSetupMethod 
              })}
              {...((steps[currentStep].id === 'forwarding' || steps[currentStep].id === 'purchase') && { 
                onNext: handleNext,
                setPhoneNumberConfigured 
              })}
              {...((steps[currentStep].id === 'business' || steps[currentStep].id === 'knowledge' || steps[currentStep].id === 'personality') && { 
                onNext: handleNext 
              })}
              {...(steps[currentStep].id === 'test' && { 
                onNext: handleNext,
                phoneNumberConfigured 
              })}
              {...(steps[currentStep].id === 'complete' && { onNext: handleNext })}
            />
          </CardContent>
        </Card>

        {/* Navigation (for steps that don't have custom navigation) */}
        {![0, steps.length - 1].includes(currentStep) && (
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="flex gap-2">
              {currentStep < steps.length - 2 && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip for now
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
