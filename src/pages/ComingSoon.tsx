import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Phone } from "lucide-react";

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center space-y-8 animate-fade-in">
        {/* Logo/Icon */}
        <div className="flex justify-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center">
            <Phone className="h-10 w-10 text-primary" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Coming Soon
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-xl mx-auto">
            We're building something amazing. An AI-powered assistant that never misses a call.
          </p>
        </div>

        {/* CTA Button */}
        <div className="pt-4">
          <Button 
            size="lg" 
            onClick={() => navigate('/demo')}
            className="gap-2 text-lg px-8 py-6 shadow-lg hover:shadow-xl transition-all"
          >
            See Demo
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Additional Info */}
        <p className="text-sm text-muted-foreground pt-8">
          Be the first to know when we launch
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
