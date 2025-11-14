import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle, Phone, Brain, BarChart } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompletionStepProps {
  onNext: () => void;
}

export const CompletionStep = ({ onNext }: CompletionStepProps) => {
  const navigate = useNavigate();

  const handleGoToDashboard = () => {
    onNext();
    navigate('/');
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
          <CheckCircle className="w-12 h-12 text-green-500" />
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold mb-2">You're All Set! 🎉</h2>
        <p className="text-muted-foreground text-lg">
          Your AI phone assistant is now live and ready to handle calls
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 py-6">
        <Card className="p-6 text-center space-y-3">
          <Phone className="w-8 h-8 mx-auto text-primary" />
          <h3 className="font-semibold">Answer Calls 24/7</h3>
          <p className="text-sm text-muted-foreground">
            Your AI never sleeps and handles unlimited calls
          </p>
        </Card>

        <Card className="p-6 text-center space-y-3">
          <Brain className="w-8 h-8 mx-auto text-primary" />
          <h3 className="font-semibold">Keep Learning</h3>
          <p className="text-sm text-muted-foreground">
            Add more knowledge and refine responses over time
          </p>
        </Card>

        <Card className="p-6 text-center space-y-3">
          <BarChart className="w-8 h-8 mx-auto text-primary" />
          <h3 className="font-semibold">Track Performance</h3>
          <p className="text-sm text-muted-foreground">
            Monitor calls, analytics, and customer interactions
          </p>
        </Card>
      </div>

      <div className="space-y-3 pt-4">
        <Button size="lg" onClick={handleGoToDashboard} className="w-full md:w-auto">
          Go to Dashboard
        </Button>
        <p className="text-sm text-muted-foreground">
          You can always update your settings and knowledge base later
        </p>
      </div>
    </div>
  );
};
