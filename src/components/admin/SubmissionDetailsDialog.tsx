
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
};

interface SubmissionDetailsDialogProps {
  submission: ContactSubmission | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SubmissionDetailsDialog = ({ 
  submission,
  open,
  onOpenChange
}: SubmissionDetailsDialogProps) => {
  if (!submission) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Submission Details</DialogTitle>
          <DialogDescription>
            Submitted on {new Date(submission.created_at).toLocaleDateString()} at {new Date(submission.created_at).toLocaleTimeString()}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-medium">Status:</h4>
            <Badge variant={
              submission.status === "completed" ? "default" :
              submission.status === "in-progress" ? "secondary" : "outline"
            }>
              {submission.status || "new"}
            </Badge>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium">From:</h4>
            <p>{submission.name} (<a href={`mailto:${submission.email}`} className="text-primary hover:underline">{submission.email}</a>)</p>
          </div>
          
          <div className="space-y-1">
            <h4 className="text-sm font-medium">Subject:</h4>
            <p>{submission.subject}</p>
          </div>
          
          <Card>
            <CardContent className="p-4 mt-2">
              <h4 className="text-sm font-medium mb-2">Message:</h4>
              <p className="whitespace-pre-line text-sm">{submission.message}</p>
            </CardContent>
          </Card>
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SubmissionDetailsDialog;
