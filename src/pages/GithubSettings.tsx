
import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  githubUsername: z.string().min(1, "GitHub username is required"),
  githubToken: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function GithubSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settingsId, setSettingsId] = useState<string | null>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      githubUsername: "",
      githubToken: "",
    },
  });
  
  // Fetch existing GitHub settings
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from("github_settings")
          .select("id, github_username")
          .single();
          
        if (error) {
          console.error("Error loading GitHub settings:", error);
          toast.error("Failed to load GitHub settings");
          return;
        }
        
        if (data) {
          setSettingsId(data.id);
          form.setValue("githubUsername", data.github_username);
        }
      } catch (error) {
        console.error("Error:", error);
        toast.error("An unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }
    
    loadSettings();
  }, [form]);
  
  // Save GitHub settings
  const onSubmit = async (values: FormValues) => {
    try {
      setSaving(true);
      
      // Update username in database
      const { error: updateError } = await supabase
        .from("github_settings")
        .update({ github_username: values.githubUsername })
        .eq("id", settingsId);
        
      if (updateError) {
        console.error("Error updating GitHub settings:", updateError);
        toast.error("Failed to save GitHub settings");
        return;
      }
      
      // If GitHub token is provided, call the edge function to save it
      if (values.githubToken) {
        const response = await fetch(
          `${window.location.origin}/api/save-github-token`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`,
            },
            body: JSON.stringify({ token: values.githubToken }),
          }
        );
        
        if (!response.ok) {
          console.error("Error saving GitHub token:", await response.text());
          toast.error("Failed to save GitHub token");
          return;
        }
      }
      
      toast.success("GitHub settings saved successfully");
      form.setValue("githubToken", ""); // Clear token field after save
    } catch (error) {
      console.error("Error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-teal-500" />
        </div>
      </AdminLayout>
    );
  }
  
  return (
    <AdminLayout>
      <div className="container max-w-3xl py-8">
        <h1 className="text-3xl font-bold mb-6">GitHub Settings</h1>
        
        <Card>
          <CardHeader>
            <CardTitle>Configure GitHub Integration</CardTitle>
            <CardDescription>
              Configure your GitHub username and access token for the contributions graph on your portfolio.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="githubUsername"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Username</FormLabel>
                      <FormControl>
                        <Input placeholder="octocat" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the GitHub username to display contributions for.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="githubToken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>GitHub Access Token (optional)</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Enter GitHub token if you want to update it" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        Generate a personal access token from GitHub with the <code>read:user</code> scope.
                        Leave blank to keep your existing token.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : "Save Settings"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
