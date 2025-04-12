
import { AlertCircle, RefreshCw } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

interface SubmissionErrorProps {
  error: string;
  refreshSubmissions?: () => void;
}

export const SubmissionError = ({ error, refreshSubmissions }: SubmissionErrorProps) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription className="flex flex-col gap-4">
        <span>{error}. Please try refreshing the data or check your database connection.</span>
        {refreshSubmissions && (
          <Button onClick={refreshSubmissions} variant="outline" size="sm" className="self-start">
            <RefreshCw className="mr-2 h-4 w-4" />
            Try Again
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

export default SubmissionError;
