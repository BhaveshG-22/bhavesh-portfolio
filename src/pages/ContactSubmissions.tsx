
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRequireAuth } from "@/hooks/useAuth";
import useContactSubmissions from "@/hooks/useContactSubmissions";
import ContactSubmissionTable from "@/components/admin/ContactSubmissionTable";
import LoadingSubmissions from "@/components/admin/LoadingSubmissions";
import EmptySubmissions from "@/components/admin/EmptySubmissions";
import SubmissionError from "@/components/admin/SubmissionError";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

const ContactSubmissions = () => {
  const { isAuthenticated } = useRequireAuth();
  const navigate = useNavigate();
  const { submissions, loading, error, refreshSubmissions, updateStatus } = useContactSubmissions();

  useEffect(() => {
    document.title = "Contact Submissions | Admin";
  }, []);

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <section className="container py-8 md:py-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <h1 className="text-3xl font-bold mb-2">Contact Form Submissions</h1>
              <p className="text-muted-foreground">Manage messages from the contact form</p>
            </div>
            <Button onClick={refreshSubmissions} variant="outline" className="mt-4 md:mt-0">
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </div>

          {loading ? (
            <LoadingSubmissions />
          ) : error ? (
            <SubmissionError error={error} refreshSubmissions={refreshSubmissions} />
          ) : submissions.length === 0 ? (
            <EmptySubmissions />
          ) : (
            <ContactSubmissionTable 
              submissions={submissions}
              onStatusUpdate={updateStatus}
            />
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default ContactSubmissions;
