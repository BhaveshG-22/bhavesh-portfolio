
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  status: string;
};

export const useContactSubmissions = () => {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Fetching contact submissions...");
      
      const { data, error } = await supabase
        .from('contact_submissions')
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError(`Database error: ${error.message}`);
        throw error;
      }
      
      console.log("Raw response from Supabase:", data);
      
      if (data && Array.isArray(data)) {
        if (data.length === 0) {
          console.log("No submissions found in database");
        }
        
        setSubmissions(data as ContactSubmission[]);
        console.log("Submissions set to state:", data.length, "items found");
        
        if (data.length > 0) {
          console.log("Sample submission:", JSON.stringify(data[0]));
        }
      } else {
        console.warn("No submissions data or invalid format received:", data);
        setError("Received invalid data format from database");
        setSubmissions([]);
      }
    } catch (error: any) {
      const errorMsg = `Failed to fetch submissions: ${error.message}`;
      console.error(errorMsg, error);
      setError(errorMsg);
      toast.error(errorMsg);
      setSubmissions([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSubmissions = useCallback(() => {
    console.log("Manual refresh triggered");
    setLoading(true);
    setError(null);
    setSubmissions([]);
    
    setTimeout(() => {
      fetchSubmissions().catch(error => {
        console.error("Error in delayed refresh:", error);
      });
    }, 500);
  }, [fetchSubmissions]);

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase
        .from('contact_submissions')
        .update({ status })
        .eq("id", id);
      
      if (error) {
        console.error("Status update error:", error);
        throw error;
      }
      
      // Update local state to reflect the change
      setSubmissions(submissions.map(sub => 
        sub.id === id ? { ...sub, status } : sub
      ));
      
      toast.success(`Status updated to ${status}`);
    } catch (error: any) {
      toast.error(`Failed to update status: ${error.message}`);
      console.error("Error updating status:", error);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  return {
    submissions,
    loading,
    error,
    refreshSubmissions,
    updateStatus
  };
};

export default useContactSubmissions;
