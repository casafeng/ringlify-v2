import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

interface CustomerContextType {
  user: User | null;
  session: Session | null;
  customerId: string | null;
  loading: boolean;
}

const CustomerContext = createContext<CustomerContextType>({
  user: null,
  session: null,
  customerId: null,
  loading: true,
});

export const useCustomer = () => useContext(CustomerContext);

interface CustomerProviderProps {
  children: ReactNode;
}

export function CustomerProvider({ children }: CustomerProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [customerId, setCustomerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch customer_id when user logs in
        if (session?.user) {
          setTimeout(() => {
            fetchCustomerId(session.user.id);
          }, 0);
        } else {
          setCustomerId(null);
          setLoading(false);
        }
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchCustomerId(session.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchCustomerId = async (userId: string) => {
    try {
      console.log('[Auth] Fetching customer_id for user:', userId);
      
      const { data, error } = await supabase
        .from('profiles')
        .select('customer_id')
        .eq('user_id', userId)
        .single();

      if (error) {
        console.error('[Auth] Error fetching customer_id:', error);
        throw error;
      }
      
      console.log('[Auth] Customer ID found:', data?.customer_id);
      setCustomerId(data?.customer_id || null);
    } catch (error) {
      console.error('Error fetching customer_id:', error);
      setCustomerId(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomerContext.Provider value={{ user, session, customerId, loading }}>
      {children}
    </CustomerContext.Provider>
  );
}
