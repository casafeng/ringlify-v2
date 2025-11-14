import { Button } from "@/components/ui/button";
import { Phone, Brain, Zap } from "lucide-react";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Welcome to Ringlify AI! 🎉</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Set up your AI-powered phone assistant in minutes. Answer calls 24/7, book appointments, 
          and provide customer support automatically.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 py-6">
        <div className="text-center space-y-2 p-4">
          <Phone className="w-12 h-12 mx-auto text-primary" />
          <h3 className="font-semibold">Connect Your Number</h3>
          <p className="text-sm text-muted-foreground">
            Use your existing business number or get a new one
          </p>
        </div>
        <div className="text-center space-y-2 p-4">
          <Brain className="w-12 h-12 mx-auto text-primary" />
          <h3 className="font-semibold">Train Your AI</h3>
          <p className="text-sm text-muted-foreground">
            Add knowledge and customize personality
          </p>
        </div>
        <div className="text-center space-y-2 p-4">
          <Zap className="w-12 h-12 mx-auto text-primary" />
          <h3 className="font-semibold">Go Live</h3>
          <p className="text-sm text-muted-foreground">
            Test it out and start handling calls instantly
          </p>
        </div>
      </div>

      <div className="flex justify-center pt-4">
        <Button size="lg" onClick={onNext}>
          Get Started
        </Button>
      </div>
    </div>
  );
};
