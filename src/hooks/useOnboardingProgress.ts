import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { useNavigate, useLocation } from "react-router-dom";

export const useOnboardingProgress = () => {
  const { customerId } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();
  const [isChecking, setIsChecking] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const checkOnboarding = async () => {
      if (!customerId) {
        setIsChecking(false);
        return;
      }

      // Don't redirect if already on onboarding page
      if (location.pathname === '/onboarding') {
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

        // Redirect to onboarding if not completed
        if (!completed && location.pathname !== '/onboarding') {
          navigate('/onboarding', { replace: true });
        }
      } catch (error) {
        console.error('Error checking onboarding:', error);
      } finally {
        setIsChecking(false);
      }
    };

    checkOnboarding();
  }, [customerId, navigate, location.pathname]);

  return { isChecking, isComplete };
};
