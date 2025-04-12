import { useState, useEffect } from "react";
import { BadgeCheck, Calendar, Building, ChevronRight, ExternalLink } from "lucide-react";
import { fetchVisibleCertifications, Certification } from "@/services/certificationService";
import { toast } from "sonner";

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid"); // grid or list

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
    <section id="certifications" className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="mb-12 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Certifications</h2>
              <p className="text-muted-foreground max-w-2xl">
                Industry-recognized credentials that validate my expertise and professional qualifications.
              </p>
            </div>
            
            {/* View toggle */}
            <div className="mt-6 md:mt-0 flex items-center space-x-2 bg-muted/30 p-1 rounded-lg self-start">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === "grid" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Grid View
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-1.5 text-sm font-medium rounded ${
                  viewMode === "list" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                List View
              </button>
            </div>
          </div>
          <div className="mt-8 h-px bg-border w-full"></div>
        </div>

        {isLoading ? (
          /* Professional skeleton loader */
          <div className={viewMode === "grid" 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8" 
            : "space-y-4"
          }>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              viewMode === "grid" ? (
                <div key={i} className="bg-card rounded-lg border border-border overflow-hidden animate-pulse">
                  <div className="h-40 bg-muted/30"></div>
                  <div className="p-6">
                    <div className="h-5 w-3/4 bg-muted/30 rounded mb-4"></div>
                    <div className="h-4 w-2/3 bg-muted/30 rounded mb-4"></div>
                    <div className="h-4 w-1/2 bg-muted/30 rounded"></div>
                  </div>
                </div>
              ) : (
                <div key={i} className="bg-card rounded-lg border border-border p-4 animate-pulse flex items-center">
                  <div className="w-12 h-12 bg-muted/30 rounded-lg mr-4"></div>
                  <div className="flex-1">
                    <div className="h-5 w-2/3 bg-muted/30 rounded mb-2"></div>
                    <div className="h-4 w-1/3 bg-muted/30 rounded"></div>
                  </div>
                  <div className="w-6 h-6 bg-muted/30 rounded-full"></div>
                </div>
              )
            ))}
          </div>
        ) : (
          <>
            {certifications.length > 0 ? (
              viewMode === "grid" ? (
                /* Grid View */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {certifications.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-all duration-300"
                    >
                      {/* Certificate image with overlay */}
                      <div className="relative h-40">
                        <img 
                          src={cert.image} 
                          alt={cert.title} 
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                        
                        {/* Issuer badge */}
                        <div className="absolute top-4 right-4 bg-background/90 px-3 py-1.5 rounded text-xs font-medium">
                          {cert.issuer}
                        </div>
                        
                        {/* Date badge */}
                        <div className="absolute bottom-4 left-4 flex items-center text-white/90 text-sm">
                          <Calendar className="w-4 h-4 mr-1.5" />
                          <span>{cert.date}</span>
                        </div>
                      </div>
                      
                      {/* Certificate content */}
                      <div className="p-6">
                        <h3 className="font-semibold text-lg mb-4 group-hover:text-primary transition-colors">
                          {cert.title}
                        </h3>
                        
                        {/* Actions */}
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                            {index === 0 ? "Premium Certification" : "Certification"}
                          </span>
                          
                          {cert.credential_url && (
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
                            >
                              <span className="mr-1.5">Verify</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                /* List View - More corporate/resume style */
                <div className="space-y-4">
                  {certifications.map((cert, index) => (
                    <div
                      key={cert.id}
                      className="group relative bg-card border border-border rounded-lg overflow-hidden hover:shadow-sm transition-all duration-300"
                    >
                      <div className="p-5 flex items-center">
                        {/* Left - Logo/Image */}
                        <div className="w-14 h-14 rounded-lg border border-border/50 bg-background flex items-center justify-center overflow-hidden mr-5 flex-shrink-0">
                          <img 
                            src={cert.image} 
                            alt={cert.issuer} 
                            className="w-10 h-10 object-contain"
                          />
                        </div>
                        
                        {/* Middle - Content */}
                        <div className="flex-1">
                          <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors">
                            {cert.title}
                          </h3>
                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-muted-foreground mt-1.5 sm:space-x-4">
                            <div className="flex items-center">
                              <Building className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                              <span>{cert.issuer}</span>
                            </div>
                            <div className="flex items-center mt-1 sm:mt-0">
                              <Calendar className="w-3.5 h-3.5 mr-1.5 flex-shrink-0" />
                              <span>{cert.date}</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Right - Actions */}
                        <div className="flex items-center space-x-4">
                          {index === 0 && (
                            <span className="hidden md:inline-flex text-xs font-medium px-2.5 py-1 rounded-full bg-primary/10 text-primary">
                              Premium
                            </span>
                          )}
                          
                          {cert.credential_url && (
                            <a
                              href={cert.credential_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
                            >
                              <BadgeCheck className="w-4 h-4 mr-1.5" />
                              <span className="hidden sm:inline mr-1">Verify</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          
                          <button className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            ) : (
              <div className="text-center py-12 bg-card/50 rounded-lg border border-border">
                <p className="text-muted-foreground">No certifications found.</p>
              </div>
            )}
          </>
        )}
        
        {/* Bottom section with additional information */}
        {!isLoading && certifications.length > 0 && (
          <div className="mt-12 pt-10 border-t border-border">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between">
              <div className="max-w-xl">
                <h3 className="text-lg font-semibold mb-2">About My Certifications</h3>
                <p className="text-sm text-muted-foreground">
                  These professional certifications represent my commitment to industry standards and continuous professional development. Each credential has been earned through rigorous examination and practical application of skills.
                </p>
              </div>
              
              <div className="mt-6 md:mt-0 flex items-center">
                <BadgeCheck className="w-5 h-5 text-primary mr-2" />
                <span className="text-sm">All certifications are current and verified</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;