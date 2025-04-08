
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface EmptySubmissionsProps {
  onRefresh: () => void;
}

export const EmptySubmissions = ({ onRefresh }: EmptySubmissionsProps) => {
  return (
    <div className="text-center py-12 bg-muted rounded-lg">
      <p className="text-muted-foreground">No contact form submissions found.</p>
      <p className="text-sm text-muted-foreground mt-2">
        If you've submitted forms, there might be a connection issue or permissions problem.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
        <Button onClick={onRefresh} variant="outline" size="sm">
          Try Refreshing
        </Button>
        <Button 
          onClick={() => toast.info("Checking permissions status...")}
          variant="secondary" 
          size="sm"
        >
          Check Permissions
        </Button>
      </div>
    </div>
  );
};

export default EmptySubmissions;
