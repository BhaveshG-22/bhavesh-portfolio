
import { useState } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { 
  fetchCertifications, 
  addCertification, 
  updateCertification, 
  deleteCertification,
  toggleCertificationVisibility,
  type Certification 
} from "@/services/certificationService";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardFooter 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Pencil, Trash2, Eye, EyeOff, Link } from "lucide-react";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

// Form validation schema
const certificationSchema = z.object({
  title: z.string().min(1, "Title is required"),
  issuer: z.string().min(1, "Issuer is required"),
  date: z.string().min(1, "Date is required"),
  image: z.string().min(1, "Image URL is required"),
  credential_url: z.string().optional(),
});

type CertificationFormValues = z.infer<typeof certificationSchema>;

const EditCertifications = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);

  const queryClient = useQueryClient();

  // Fetch certifications
  const { 
    data: certifications = [], 
    isLoading: isLoadingCertifications,
    isError: isCertificationsError,
    error: certificationsError
  } = useQuery({
    queryKey: ["certifications"],
    queryFn: fetchCertifications
  });

  // Add certification mutation
  const addCertificationMutation = useMutation({
    mutationFn: (certification: Omit<Certification, "id" | "created_at" | "updated_at">) => addCertification(certification),
    onSuccess: () => {
      toast.success("Certification added successfully");
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      setIsAddDialogOpen(false);
    },
    onError: (error: Error) => {
      toast.error(`Failed to add certification: ${error.message}`);
    }
  });

  // Update certification mutation
  const updateCertificationMutation = useMutation({
    mutationFn: ({id, data}: {id: number, data: Partial<Omit<Certification, "id" | "created_at" | "updated_at">>}) => 
      updateCertification(id, data),
    onSuccess: () => {
      toast.success("Certification updated successfully");
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
      setIsEditDialogOpen(false);
      setEditingCertification(null);
    },
    onError: (error: Error) => {
      toast.error(`Failed to update certification: ${error.message}`);
    }
  });

  // Delete certification mutation
  const deleteCertificationMutation = useMutation({
    mutationFn: deleteCertification,
    onSuccess: () => {
      toast.success("Certification deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete certification: ${error.message}`);
    }
  });

  // Toggle visibility mutation
  const toggleVisibilityMutation = useMutation({
    mutationFn: ({id, isHidden}: {id: number, isHidden: boolean}) => 
      toggleCertificationVisibility(id, isHidden),
    onSuccess: () => {
      toast.success("Certification visibility updated");
      queryClient.invalidateQueries({ queryKey: ["certifications"] });
    },
    onError: (error: Error) => {
      toast.error(`Failed to update visibility: ${error.message}`);
    }
  });

  // Initialize add form
  const addForm = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: "",
      issuer: "",
      date: "",
      image: "",
      credential_url: "",
    }
  });

  // Initialize edit form
  const editForm = useForm<CertificationFormValues>({
    resolver: zodResolver(certificationSchema),
    defaultValues: {
      title: "",
      issuer: "",
      date: "",
      image: "",
      credential_url: "",
    }
  });

  // Setup edit form when editing certification
  const startEditing = (certification: Certification) => {
    setEditingCertification(certification);
    editForm.reset({
      title: certification.title,
      issuer: certification.issuer,
      date: certification.date,
      image: certification.image,
      credential_url: certification.credential_url || "",
    });
    setIsEditDialogOpen(true);
  };

  // Handle add certification form submit
  const handleAddSubmit = (values: CertificationFormValues) => {
    addCertificationMutation.mutate({
      title: values.title,
      issuer: values.issuer,
      date: values.date,
      image: values.image,
      credential_url: values.credential_url,
    });
    addForm.reset();
  };

  // Handle edit certification form submit
  const handleEditSubmit = (values: CertificationFormValues) => {
    if (!editingCertification) return;
    
    updateCertificationMutation.mutate({
      id: editingCertification.id,
      data: {
        title: values.title,
        issuer: values.issuer,
        date: values.date,
        image: values.image,
        credential_url: values.credential_url,
      }
    });
  };

  // Filter certifications based on active tab
  const filteredCertifications = activeTab === "all" 
    ? certifications 
    : activeTab === "visible" 
      ? certifications.filter(cert => !cert.hidden)
      : certifications.filter(cert => cert.hidden);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-container px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold">Certification Management</h1>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" /> Add New Certification
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add New Certification</DialogTitle>
                </DialogHeader>
                <Form {...addForm}>
                  <form onSubmit={addForm.handleSubmit(handleAddSubmit)} className="space-y-4 py-4">
                    <FormField
                      control={addForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Title *</FormLabel>
                          <FormControl>
                            <Input placeholder="Certification title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="issuer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Issuer *</FormLabel>
                          <FormControl>
                            <Input placeholder="Organization name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Date *</FormLabel>
                          <FormControl>
                            <Input placeholder="Month Year (e.g. March 2023)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image URL *</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com/image.jpg" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={addForm.control}
                      name="credential_url"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Credential URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://verify.credential.com/123" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <DialogFooter className="pt-4">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => {
                          addForm.reset();
                          setIsAddDialogOpen(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={addCertificationMutation.isPending}
                      >
                        {addCertificationMutation.isPending ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adding...
                          </>
                        ) : (
                          "Add Certification"
                        )}
                      </Button>
                    </DialogFooter>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>

          <Tabs 
            defaultValue="all" 
            value={activeTab} 
            onValueChange={setActiveTab} 
            className="mb-8"
          >
            <TabsList>
              <TabsTrigger value="all">All Certifications</TabsTrigger>
              <TabsTrigger value="visible">Visible</TabsTrigger>
              <TabsTrigger value="hidden">Hidden</TabsTrigger>
            </TabsList>
          </Tabs>

          {isLoadingCertifications ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-5 bg-muted rounded mb-4 w-3/4"></div>
                    <div className="h-4 bg-muted rounded mb-2 w-full"></div>
                    <div className="h-4 bg-muted rounded mb-2 w-full"></div>
                    <div className="h-4 bg-muted rounded mb-4 w-2/3"></div>
                    <div className="flex gap-2 mt-4">
                      <div className="h-9 bg-muted rounded w-24"></div>
                      <div className="h-9 bg-muted rounded w-24"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : isCertificationsError ? (
            <div className="bg-destructive/10 border border-destructive p-4 rounded-lg">
              <p className="text-destructive">
                Error loading certifications: {certificationsError instanceof Error ? certificationsError.message : 'Unknown error'}
              </p>
            </div>
          ) : filteredCertifications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCertifications.map((certification) => (
                <Card key={certification.id} className="overflow-hidden">
                  <CardHeader className="p-0">
                    <div className="aspect-video relative w-full overflow-hidden bg-muted">
                      <AspectRatio ratio={16/9}>
                        <img 
                          src={certification.image} 
                          alt={certification.title}
                          className="object-cover w-full h-full"
                        />
                      </AspectRatio>
                      <Badge 
                        className="absolute top-2 right-2"
                        variant={certification.hidden ? "destructive" : "secondary"}
                      >
                        {certification.hidden ? "Hidden" : "Visible"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4">
                    <CardTitle className="text-xl mb-2">{certification.title}</CardTitle>
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <span className="mr-2">Issued by {certification.issuer}</span>
                      <span>•</span>
                      <span className="ml-2">{certification.date}</span>
                    </div>
                    {certification.credential_url && (
                      <div className="flex items-center text-sm mt-3 text-primary">
                        <a 
                          href={certification.credential_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center hover:underline"
                        >
                          <Link className="w-4 h-4 mr-1" />
                          Verify Certificate
                        </a>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex justify-between p-4 pt-0">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="gap-1"
                      onClick={() => toggleVisibilityMutation.mutate({
                        id: certification.id, 
                        isHidden: !!certification.hidden
                      })}
                    >
                      {certification.hidden ? (
                        <>
                          <Eye className="h-3.5 w-3.5" /> Show
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3.5 w-3.5" /> Hide
                        </>
                      )}
                    </Button>
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => startEditing(certification)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button 
                            variant="destructive" 
                            size="sm"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Certification</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete "{certification.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => deleteCertificationMutation.mutate(certification.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border border-dashed rounded-lg">
              <p className="text-muted-foreground">No certifications found.</p>
              <Button 
                variant="outline" 
                onClick={() => setIsAddDialogOpen(true)}
                className="mt-4"
              >
                Add your first certification
              </Button>
            </div>
          )}

          {/* Edit Certification Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Edit Certification</DialogTitle>
              </DialogHeader>
              <Form {...editForm}>
                <form onSubmit={editForm.handleSubmit(handleEditSubmit)} className="space-y-4 py-4">
                  <FormField
                    control={editForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title *</FormLabel>
                        <FormControl>
                          <Input placeholder="Certification title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="issuer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Issuer *</FormLabel>
                        <FormControl>
                          <Input placeholder="Organization name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date *</FormLabel>
                        <FormControl>
                          <Input placeholder="Month Year (e.g. March 2023)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="image"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL *</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={editForm.control}
                    name="credential_url"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Credential URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://verify.credential.com/123" {...field || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <DialogFooter className="pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => {
                        setIsEditDialogOpen(false);
                        setEditingCertification(null);
                      }}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={updateCertificationMutation.isPending}
                    >
                      {updateCertificationMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        "Update Certification"
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default EditCertifications;
