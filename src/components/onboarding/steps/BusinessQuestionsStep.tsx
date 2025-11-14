import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { toast } from "sonner";

interface BusinessQuestionsStepProps {
  onNext: () => void;
}

const questions = [
  {
    id: 'business_description',
    label: 'What does your business do?',
    placeholder: 'We provide dental care services including cleanings, fillings, and cosmetic dentistry...',
    type: 'textarea' as const,
  },
  {
    id: 'services_offered',
    label: 'What services do you offer?',
    placeholder: 'List your main services or products',
    type: 'textarea' as const,
  },
  {
    id: 'business_hours',
    label: 'What are your business hours?',
    placeholder: 'Monday-Friday 9am-5pm, Saturday 10am-2pm',
    type: 'input' as const,
  },
  {
    id: 'location',
    label: 'Where are you located?',
    placeholder: '123 Main St, San Francisco, CA 94102',
    type: 'input' as const,
  },
  {
    id: 'pricing_info',
    label: 'What is your pricing structure?',
    placeholder: 'Starting at $50, consultation is free, insurance accepted...',
    type: 'textarea' as const,
  },
  {
    id: 'unique_value',
    label: 'What makes your business unique?',
    placeholder: 'We offer same-day appointments, 20+ years experience...',
    type: 'textarea' as const,
  },
];

export const BusinessQuestionsStep = ({ onNext }: BusinessQuestionsStepProps) => {
  const { customerId } = useCustomer();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    // Check if at least 3 questions are answered
    const answeredCount = Object.values(answers).filter(a => a.trim()).length;
    if (answeredCount < 3) {
      toast.error("Please answer at least 3 questions to continue");
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare content for KB
      const kbContent = questions
        .filter(q => answers[q.id]?.trim())
        .map(q => `**${q.label}**\n${answers[q.id]}`)
        .join('\n\n');

      // Call edge function to optimize with AI and save to KB
      const { data, error } = await supabase.functions.invoke('optimize-kb-content', {
        body: {
          content: kbContent,
          customerId
        }
      });

      if (error) throw error;

      toast.success("Business information saved and optimized!");
      onNext();
    } catch (error) {
      console.error('Error saving business info:', error);
      toast.error("Failed to save information");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h3 className="text-xl font-semibold">Tell us about your business</h3>
        <p className="text-muted-foreground">
          Answer a few questions so your AI can provide accurate information to callers.
          <br />
          <span className="text-sm">(Answer at least 3 questions)</span>
        </p>
      </div>

      <Card className="p-6 space-y-6">
        {questions.map((question) => (
          <div key={question.id} className="space-y-2">
            <Label htmlFor={question.id}>{question.label}</Label>
            {question.type === 'textarea' ? (
              <Textarea
                id={question.id}
                placeholder={question.placeholder}
                value={answers[question.id] || ''}
                onChange={(e) => handleChange(question.id, e.target.value)}
                rows={3}
              />
            ) : (
              <Input
                id={question.id}
                placeholder={question.placeholder}
                value={answers[question.id] || ''}
                onChange={(e) => handleChange(question.id, e.target.value)}
              />
            )}
          </div>
        ))}
      </Card>

      <div className="flex justify-end gap-2">
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Optimizing with AI...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>
    </div>
  );
};
