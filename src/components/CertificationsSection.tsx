import { useState, useEffect } from "react";
import { BadgeCheck, ExternalLink, ChevronRight, Calendar, Building } from "lucide-react";
import { fetchVisibleCertifications, Certification } from "@/services/certificationService";
import { toast } from "sonner";

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const loadCertifications = async () => {
      try {
        setIsLoading(true);
        const data = await fetchVisibleCertifications();
        setCertifications(data);
      } catch (error) {
        console.error("Error loading certifications:", error);
        toast.error("Failed to load certifications. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    loadCertifications();
  }, []);

  return (
    <section id="certifications" className="py-16 md:py-20 bg-background">
      <div className="container px-4 mx-auto">
        {/* Section header with professional styling */}
        <div className="mb-12">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Professional Certifications</h2>
          <div className="w-16 h-1 bg-primary mb-4"></div>
          <p className="text-muted-foreground max-w-3xl">
            Industry-recognized credentials validating technical expertise and professional qualifications.
          </p>
        </div>

        {/* Certification cards container */}
        <div className="space-y-5">
          {isLoading ? (
            /* Professional skeleton loader */
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="bg-card border border-border rounded-md shadow-sm p-5 animate-pulse">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="w-16 h-16 bg-muted/40 rounded-md flex-shrink-0"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-5 bg-muted/40 rounded w-2/3"></div>
                    <div className="h-4 bg-muted/40 rounded w-1/3"></div>
                    <div className="h-4 bg-muted/40 rounded w-1/2"></div>
                  </div>
                  <div className="w-8 h-8 bg-muted/40 rounded-full"></div>
                </div>
              </div>
            ))
          ) : (
            <>
              {certifications.length > 0 ? (
                certifications.map((cert, index) => (
                  <div 
                    key={cert.id}
                    className={`bg-card border transition-all duration-200 rounded-md shadow-sm overflow-hidden
                      ${selectedCert === cert.id 
                        ? "border-primary" 
                        : "border-border hover:border-border/80 hover:shadow"}`}
                  >
                    {/* Collapsed view */}
                    <div 
                      className="p-5 cursor-pointer"
                      onClick={() => setSelectedCert(selectedCert === cert.id ? null : cert.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center gap-4">
                        {/* Certificate logo */}
                        <div className="w-16 h-16 bg-muted/30 rounded-md border border-border/50 flex items-center justify-center overflow-hidden flex-shrink-0">
                          <img 
                            src={cert.image} 
                            alt={cert.issuer} 
                            className="w-12 h-12 object-contain"
                          />
                        </div>
                        
                        {/* Certificate details */}
                        <div className="flex-1">
                          <h3 className="text-base font-semibold mb-1">{cert.title}</h3>
                          
                          <div className="flex flex-col sm:flex-row sm:items-center gap-y-1 sm:gap-x-6 text-sm text-muted-foreground">
                            <div className="flex items-center">
                              <Building className="w-4 h-4 mr-1.5 text-muted-foreground/70" />
                              <span>{cert.issuer}</span>
                            </div>
                            
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1.5 text-muted-foreground/70" />
                              <span>{cert.date}</span>
                            </div>
                            
                            {index === 0 && (
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                                Featured
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Expand/collapse indicator */}
                        <div className={`w-8 h-8 rounded-full bg-muted/30 flex items-center justify-center transition-transform duration-200
                          ${selectedCert === cert.id ? "rotate-90" : ""}`}>
                          <ChevronRight className="w-5 h-5 text-muted-foreground" />
                        </div>
                      </div>
                    </div>
                    
                    {/* Expanded details */}
                    {selectedCert === cert.id && (
                      <div className="px-5 pb-5 pt-2 border-t border-border/40 bg-muted/5">
                        <div className="pl-0 md:pl-20">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 text-sm">
                            <div>
                              <h4 className="font-semibold mb-1.5 text-foreground">Overview</h4>
                              <p className="text-muted-foreground">
                                This certification validates professional expertise in {cert.title.toLowerCase()} 
                                and related technical competencies.
                              </p>
                            </div>
                            
                            <div>
                              <h4 className="font-semibold mb-1.5 text-foreground">Skills Validated</h4>
                              <ul className="text-muted-foreground space-y-1">
                                <li>• Technical proficiency</li>
                                <li>• Industry best practices</li>
                                <li>• Professional knowledge</li>
                              </ul>
                            </div>
                            
                            <div className="flex flex-col">
                              <h4 className="font-semibold mb-1.5 text-foreground">Credential</h4>
                              <div className="flex-1">
                                <p className="text-muted-foreground">
                                  Issued by {cert.issuer} in compliance with industry standards.
                                </p>
                              </div>
                              
                              {cert.credential_url && (
                                <a
                                  href={cert.credential_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <BadgeCheck className="w-4 h-4 mr-1.5" />
                                  <span>Verify credential</span>
                                  <ExternalLink className="ml-1.5 w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-10 bg-muted/20 rounded-md border border-border">
                  <p className="text-muted-foreground">No certifications found.</p>
                </div>
              )}
            </>
          )}
        </div>
        
        {/* Footer information */}
        {!isLoading && certifications.length > 0 && (
          <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm">
            <p className="text-muted-foreground max-w-lg">
              All certifications listed are current and in good standing. Verification links lead to the official issuer's credential verification system.
            </p>
            
            <div className="mt-4 sm:mt-0">
              <span className="inline-flex items-center px-3 py-1.5 rounded bg-muted text-muted-foreground">
                <BadgeCheck className="w-4 h-4 mr-1.5 text-primary" />
                <span>Verified credentials</span>
              </span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;