import { useState, useEffect } from "react";
import { BadgeCheck, Award, Calendar, Building, ExternalLink } from "lucide-react";
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
    <section id="certifications" className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-background/60 relative">
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-accent/5 rounded-full blur-2xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="flex flex-col items-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-3">
            <BadgeCheck className="w-4 h-4 mr-2" />
            <span>Professional Growth</span>
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-center mb-6">
            My Certifications
          </h2>
          <div className="w-16 h-1 bg-primary rounded-full mb-6"></div>
          <p className="text-center text-muted-foreground max-w-2xl">
            Professional achievements and continuous learning that showcase my expertise and dedication to staying current in my field.
          </p>
        </div>

        {isLoading ? (
          /* Skeleton Loader */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl bg-card/40 border border-border/50 p-6 animate-pulse">
                <div className="h-6 w-2/3 bg-muted/30 rounded mb-4"></div>
                <div className="h-4 w-1/2 bg-muted/30 rounded mb-8"></div>
                <div className="h-4 w-3/4 bg-muted/30 rounded mb-2"></div>
                <div className="h-4 w-1/3 bg-muted/30 rounded"></div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {certifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {certifications.map((cert, index) => (
                  <div
                    key={cert.id}
                    className={`group relative rounded-2xl transition-all duration-300 overflow-hidden 
                      ${selectedCert === cert.id 
                        ? "ring-2 ring-primary ring-offset-2 ring-offset-background" 
                        : "hover:shadow-xl"}`}
                    onClick={() => setSelectedCert(cert.id === selectedCert ? null : cert.id)}
                  >
                    {/* Card background with gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-card to-card/80 backdrop-blur-sm border border-border/50"></div>
                    
                    {/* Top accent colored bar - different color for first certificate */}
                    <div className={`absolute top-0 left-0 right-0 h-1 
                      ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-primary" : "bg-secondary"}`}>
                    </div>
                    
                    {/* Main content */}
                    <div className="relative p-6 h-full flex flex-col">
                      {/* Status badge - special for first cert */}
                      {index === 0 && (
                        <div className="absolute top-3 right-3 bg-yellow-500/15 text-yellow-500 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                          <Award className="w-3 h-3 mr-1" />
                          <span>Featured</span>
                        </div>
                      )}
                      
                      {/* Certificate logo/image - small thumbnail */}
                      <div className="w-12 h-12 rounded-lg bg-primary/10 overflow-hidden mb-4 flex-shrink-0">
                        <img 
                          src={cert.image} 
                          alt="" 
                          className="w-full h-full object-cover opacity-80"
                        />
                      </div>
                      
                      {/* Certification title */}
                      <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {cert.title}
                      </h3>
                      
                      {/* Issuer with icon */}
                      <div className="flex items-center text-sm text-muted-foreground mt-auto">
                        <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span className="truncate">{cert.issuer}</span>
                      </div>
                      
                      {/* Date with icon */}
                      <div className="flex items-center text-sm text-muted-foreground mt-2">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        <span>{cert.date}</span>
                      </div>
                      
                      {/* View certificate link */}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="mt-4 inline-flex items-center text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                        >
                          <BadgeCheck className="w-4 h-4 mr-1.5" />
                          <span>View Certificate</span>
                          <ExternalLink className="w-3 h-3 ml-1" />
                        </a>
                      )}
                    </div>
                    
                    {/* Expanded view when selected */}
                    {selectedCert === cert.id && (
                      <div className="absolute inset-0 bg-card/95 backdrop-blur-sm p-6 flex flex-col justify-between transition-opacity duration-300">
                        <div>
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-bold text-primary mb-4">{cert.title}</h3>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedCert(null);
                              }}
                              className="text-muted-foreground hover:text-foreground"
                            >
                              ✕
                            </button>
                          </div>
                          
                          <div className="space-y-3">
                            <div className="flex items-center text-sm">
                              <Building className="w-4 h-4 mr-2 text-primary" />
                              <span>Issued by <b>{cert.issuer}</b></span>
                            </div>
                            <div className="flex items-center text-sm">
                              <Calendar className="w-4 h-4 mr-2 text-primary" />
                              <span>Issued {cert.date}</span>
                            </div>
                            <p className="text-sm text-muted-foreground mt-2">
                              This certification validates expertise in the related field and demonstrates professional growth and commitment to excellence.
                            </p>
                          </div>
                        </div>
                        
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="mt-4 inline-flex items-center justify-center w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
                          >
                            <BadgeCheck className="w-4 h-4 mr-2" />
                            <span>Verify Certificate</span>
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-card/30 rounded-lg border border-border/50">
                <p className="text-muted-foreground">No certifications found.</p>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;