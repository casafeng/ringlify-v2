import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useCustomer } from "@/contexts/CustomerContext";
import { toast } from "sonner";

export interface KBDocument {
  id: string;
  title: string;
  content: string;
  category: string | null;
  is_active: boolean;
  customer_id: string;
  created_at: string;
  updated_at: string;
  version: number;
  source_type?: 'text' | 'website' | 'document';
  source_url?: string;
  file_path?: string;
}

export const useKnowledgeBase = () => {
  const { customerId } = useCustomer();
  const queryClient = useQueryClient();

  const { data: documents = [], isLoading } = useQuery({
    queryKey: ["kb_documents", customerId],
    queryFn: async () => {
      if (!customerId) {
        console.log('[KB] No customerId available');
        return [];
      }
      
      console.log('[KB] Fetching documents for customerId:', customerId);
      
      const { data, error } = await supabase
        .from("kb_documents")
        .select("*")
        .eq("customer_id", customerId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error('[KB] Error fetching documents:', error);
        throw error;
      }
      
      console.log('[KB] Fetched documents:', data?.length || 0);
      return data as KBDocument[];
    },
    enabled: !!customerId,
  });

  const createDocument = useMutation({
    mutationFn: async (doc: { 
      title: string; 
      content: string; 
      category?: string;
      source_type?: 'text' | 'website' | 'document';
      source_url?: string;
      file_path?: string;
    }) => {
      if (!customerId) {
        console.error('[KB] Cannot create document: No customerId');
        throw new Error("No customer ID");
      }
      
      console.log('[KB] Creating document with customerId:', customerId);
      
      const { data, error } = await supabase
        .from("kb_documents")
        .insert({
          ...doc,
          customer_id: customerId,
          is_active: true,
        })
        .select()
        .single();

      if (error) {
        console.error('[KB] Error creating document:', error);
        throw error;
      }
      
      console.log('[KB] Document created successfully:', data?.id);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kb_documents", customerId] });
      toast.success("Document created successfully");
    },
    onError: (error) => {
      toast.error("Failed to create document: " + error.message);
    },
  });

  const updateDocument = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<KBDocument> & { id: string }) => {
      const { data, error } = await supabase
        .from("kb_documents")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kb_documents", customerId] });
      toast.success("Document updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update document: " + error.message);
    },
  });

  const deleteDocument = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("kb_documents")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kb_documents", customerId] });
      toast.success("Document deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete document: " + error.message);
    },
  });

  return {
    documents,
    isLoading,
    createDocument,
    updateDocument,
    deleteDocument,
  };
};
