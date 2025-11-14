import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";

export const useOnboardingProgress = () => {
  const { customerId } = useCustomer();
  const [isChecking, setIsChecking] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!customerId) {
        setIsChecking(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('onboarding_progress')
          .select('is_completed')
          .eq('customer_id', customerId)
          .maybeSingle();

        if (error) throw error;

        const completed = data?.is_completed ?? false;
        setIsComplete(completed);
      } catch (error) {
        console.error('Error checking onboarding:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkOnboarding();
  }, [customerId]);

  return { isChecking, isComplete };
};
