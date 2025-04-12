import { useState, useEffect } from "react";
import { BadgeCheck, ExternalLink, Clock, Building } from "lucide-react";
import { fetchVisibleCertifications, Certification } from "@/services/certificationService";
import { toast } from "sonner";

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

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

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section id="certifications" className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="mb-16 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6">Professional Certifications</h2>
          <div className="w-20 h-1 bg-primary mx-auto mb-6"></div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Credentials that validate my expertise and commitment to professional excellence.
          </p>
        </div>

        {isLoading ? (
          /* Skeleton loader */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="relative bg-card border border-border rounded-lg p-6 animate-pulse">
                <div className="h-6 w-3/4 bg-muted/30 rounded mb-6"></div>
                <div className="h-4 w-1/2 bg-muted/30 rounded mb-8"></div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="h-4 w-4 bg-muted/30 rounded-full"></div>
                  <div className="h-4 w-32 bg-muted/30 rounded"></div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="h-4 w-4 bg-muted/30 rounded-full"></div>
                  <div className="h-4 w-24 bg-muted/30 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {certifications.length > 0 ? (
              certifications.map((cert, index) => (
                <div
                  key={cert.id}
                  className={`group relative bg-card border hover:shadow-lg transition-all duration-300 overflow-hidden ${
                    expandedId === cert.id 
                      ? "border-primary" 
                      : "border-border hover:border-border/80"
                  }`}
                >
                  {/* Card design with two columns on larger screens */}
                  <div className="flex flex-col md:flex-row h-full">
                    {/* Left column - Image */}
                    <div className="md:w-1/3 bg-muted/10">
                      <div className="h-full relative">
                        <div className="absolute inset-0">
                          <img 
                            src={cert.image} 
                            alt="" 
                            className="w-full h-full object-cover object-center opacity-80"
                          />
                          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
                        </div>
                        
                        {/* Certification logo overlay */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                            <img 
                              src={cert.image} 
                              alt={cert.issuer} 
                              className="w-12 h-12 md:w-16 md:h-16 object-contain rounded-full"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Right column - Content */}
                    <div className="md:w-2/3 p-6 flex flex-col">
                      <div className="flex-1">
                        <div className="flex justify-between">
                          <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                            {cert.title}
                          </h3>
                          <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded font-medium">
                            {index === 0 ? "Featured" : "Certificate"}
                          </span>
                        </div>
                        
                        <div className="space-y-3 mt-3">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Building className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>{cert.issuer}</span>
                          </div>
                          
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Clock className="w-4 h-4 mr-2 flex-shrink-0" />
                            <span>Issued: {cert.date}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-border/50 flex justify-between items-center">
                        <button
                          onClick={() => toggleExpand(cert.id)}
                          className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
                        >
                          {expandedId === cert.id ? "View Less" : "View Details"}
                        </button>
                        
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <BadgeCheck className="w-4 h-4 mr-1" />
                            <span className="mr-1">Verify</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Expandable details section */}
                  {expandedId === cert.id && (
                    <div className="p-6 pt-0 md:ml-1/3 border-t border-border/50 bg-muted/5">
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Description</h4>
                          <p className="text-sm text-muted-foreground">
                            This professional certification demonstrates proficiency in industry standards and best practices.
                            It validates skills in {cert.title.toLowerCase()} and related technologies.
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-semibold mb-2">Skills Validated</h4>
                          <div className="flex flex-wrap gap-2">
                            {["Professional Knowledge", "Technical Expertise", "Industry Standards"].map((skill, i) => (
                              <span 
                                key={i}
                                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {cert.credential_url && (
                          <a
                            href={cert.credential_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 inline-flex items-center justify-center px-4 py-2 border border-primary text-sm text-primary rounded hover:bg-primary hover:text-primary-foreground transition-colors"
                          >
                            View Full Certificate
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-10 bg-card rounded-lg border border-border">
                <p className="text-muted-foreground">No certifications found.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;