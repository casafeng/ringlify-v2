import { useNavigate } from "react-router-dom";
import { OnboardingWizard } from "@/components/onboarding/OnboardingWizard";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { toast } from "sonner";

const Onboarding = () => {
  const navigate = useNavigate();
  const { customerId } = useCustomer();

  const handleComplete = async () => {
    try {
      const { error } = await supabase
        .from('onboarding_progress')
        .upsert({
          customer_id: customerId,
          is_completed: true,
          current_step: 99
        }, {
          onConflict: 'customer_id'
        });

      if (error) throw error;

      toast.success("🎉 Setup complete! Your AI assistant is live");
      navigate('/');
    } catch (error) {
      console.error('Error completing onboarding:', error);
      toast.error("Failed to complete setup");
    }
  };

  return <OnboardingWizard onComplete={handleComplete} />;
};

export default Onboarding;
