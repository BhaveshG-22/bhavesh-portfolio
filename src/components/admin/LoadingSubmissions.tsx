
import { Loader2 } from "lucide-react";

export const LoadingSubmissions = () => {
  return (
    <div className="flex items-center justify-center py-12">
      <Loader2 className="h-8 w-8 animate-spin mr-2" />
      <span>Loading submissions...</span>
    </div>
  );
};

export default LoadingSubmissions;
