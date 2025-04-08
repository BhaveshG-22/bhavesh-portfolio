
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface SubmissionErrorProps {
  error: string;
}

export const SubmissionError = ({ error }: SubmissionErrorProps) => {
  return (
    <Alert variant="destructive" className="mb-6">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>
        {error}. Please try refreshing the data or check your database connection.
      </AlertDescription>
    </Alert>
  );
};

export default SubmissionError;
