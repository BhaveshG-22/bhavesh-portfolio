
import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false 
}) => {
  const { user, loading, isAdmin } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!loading && !user) {
      toast.error("Please log in to access this page");
    } else if (!loading && adminOnly && !isAdmin) {
      toast.error("You don't have permission to access this page");
    }
  }, [loading, user, adminOnly, isAdmin]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
          <p className="text-teal-400">Loading authentication...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect to login page with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (adminOnly && !isAdmin) {
    // Redirect to home if not admin
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
