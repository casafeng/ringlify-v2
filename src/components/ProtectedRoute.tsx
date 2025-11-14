import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCustomer } from "@/contexts/CustomerContext";
import { Loader2 } from "lucide-react";
import { useOnboardingProgress } from "@/hooks/useOnboardingProgress";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useCustomer();
  const navigate = useNavigate();
  const location = useLocation();
  const { isChecking } = useOnboardingProgress();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading || isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
