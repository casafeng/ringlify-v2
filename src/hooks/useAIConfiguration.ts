import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { toast } from "sonner";

export const useAIConfiguration = () => {
  const { customerId } = useCustomer();
  const queryClient = useQueryClient();

  const { data: config, isLoading } = useQuery({
    queryKey: ["ai_configuration", customerId],
    queryFn: async () => {
      if (!customerId) return null;
      // @ts-ignore
      const { data, error } = await supabase
        .from("ai_configurations")
        .select("*")
        .eq("customer_id", customerId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: !!customerId,
  });

  const updateConfig = useMutation({
    mutationFn: async (updates: Record<string, any>) => {
      if (!customerId) throw new Error("No customer ID");
      // @ts-ignore
      const { data, error } = await supabase
        .from("ai_configurations")
        .update(updates)
        .eq("customer_id", customerId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai_configuration", customerId] });
      toast.success("Settings saved successfully");
    },
    onError: (error) => {
      toast.error("Failed to save settings: " + error.message);
    },
  });

  return {
    config,
    isLoading,
    updateConfig,
  };
};
