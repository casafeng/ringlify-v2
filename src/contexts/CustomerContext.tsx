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
  // Mock data for demonstration
  const mockUser = {
    id: 'demo-user-123',
    email: 'demo@ringlify.com',
    created_at: new Date().toISOString(),
  } as User;

  const mockSession = {
    user: mockUser,
    access_token: 'demo-token',
  } as Session;

  return (
    <CustomerContext.Provider value={{ 
      user: mockUser, 
      session: mockSession, 
      customerId: 'demo-customer-123', 
      loading: false 
    }}>
      {children}
    </CustomerContext.Provider>
  );
}
