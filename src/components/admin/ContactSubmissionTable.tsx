
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import SubmissionDetailsDialog from "./SubmissionDetailsDialog";
import { Search } from "lucide-react";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
};

interface ContactSubmissionTableProps {
  submissions: ContactSubmission[];
  onStatusUpdate: (id: string, status: string) => Promise<void>;
}

export const ContactSubmissionTable = ({ submissions, onStatusUpdate }: ContactSubmissionTableProps) => {
  const [selectedSubmission, setSelectedSubmission] = useState<ContactSubmission | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleViewDetails = (submission: ContactSubmission) => {
    setSelectedSubmission(submission);
    setDetailsOpen(true);
  };
  
  return (
    <>
      <div className="rounded-lg border shadow-sm overflow-hidden bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">
                  {new Date(submission.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>{submission.name}</TableCell>
                <TableCell>
                  <a 
                    href={`mailto:${submission.email}`} 
                    className="text-primary hover:underline"
                  >
                    {submission.email}
                  </a>
                </TableCell>
                <TableCell>{submission.subject}</TableCell>
                <TableCell>
                  <Badge variant={
                    submission.status === "completed" ? "default" :
                    submission.status === "in-progress" ? "secondary" : "outline"
                  }>
                    {submission.status || "new"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleViewDetails(submission)}
                    >
                      <Search className="h-4 w-4 mr-1" />
                      View
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => onStatusUpdate(submission.id, "in-progress")}
                      disabled={submission.status === "in-progress"}
                    >
                      Mark In Progress
                    </Button>
                    <Button 
                      variant="default" 
                      size="sm" 
                      onClick={() => onStatusUpdate(submission.id, "completed")}
                      disabled={submission.status === "completed"}
                    >
                      Mark Completed
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <SubmissionDetailsDialog
        submission={selectedSubmission}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />
    </>
  );
};

export default ContactSubmissionTable;
