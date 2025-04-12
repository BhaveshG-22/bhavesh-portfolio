import { useState, useEffect } from "react";
import { BadgeCheck, ExternalLink, ArrowUpRight, ChevronDown, ChevronUp } from "lucide-react";
import { fetchVisibleCertifications, Certification } from "@/services/certificationService";
import { toast } from "sonner";

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const [expandedCard, setExpandedCard] = useState(null);

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

  const toggleCard = (id) => {
    setExpandedCard(expandedCard === id ? null : id);
  };

  // Get unique issuers for filtering
  const issuers = [...new Set(certifications.map(cert => cert.issuer))];

  // Filter certifications
  const filteredCerts = activeFilter === "all" 
    ? certifications 
    : certifications.filter(cert => cert.issuer === activeFilter);

  return (
    <section id="certifications" className="py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-screen-xl mx-auto">
        {/* Section header with modern styling */}
        <div className="mb-12 md:mb-16">
          <span className="inline-block text-sm font-semibold text-primary mb-2 tracking-wider uppercase">Qualifications</span>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">My Certifications</h2>
          <p className="text-muted-foreground max-w-2xl">
            Professional credentials that demonstrate my expertise and commitment to continuous learning.
          </p>
        </div>

        {/* Filter pills - only show if we have certifications */}
        {!isLoading && certifications.length > 0 && (
          <div className="mb-8 overflow-x-auto pb-2 md:pb-0">
            <div className="flex space-x-2 md:space-x-3">
              <button
                onClick={() => setActiveFilter("all")}
                className={`whitespace-nowrap px-4 py-2 text-sm rounded-full transition-colors ${
                  activeFilter === "all"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80 text-foreground"
                }`}
              >
                All Certifications
              </button>
              
              {issuers.map(issuer => (
                <button
                  key={issuer}
                  onClick={() => setActiveFilter(issuer)}
                  className={`whitespace-nowrap px-4 py-2 text-sm rounded-full transition-colors ${
                    activeFilter === issuer
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80 text-foreground"
                  }`}
                >
                  {issuer}
                </button>
              ))}
            </div>
          </div>
        )}

        {isLoading ? (
          /* Modern skeleton loader */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-[4/3] bg-muted/40 rounded-2xl p-6 animate-pulse">
                <div className="h-6 w-2/3 bg-background/40 rounded-full mb-6"></div>
                <div className="h-4 w-1/2 bg-background/40 rounded-full mb-3"></div>
                <div className="h-4 w-3/4 bg-background/40 rounded-full mb-3"></div>
                <div className="h-4 w-1/3 bg-background/40 rounded-full"></div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCerts.length > 0 ? (
              filteredCerts.map((cert, index) => (
                <div
                  key={cert.id}
                  className={`group rounded-2xl overflow-hidden transition-all duration-300 ${
                    expandedCard === cert.id
                      ? "bg-card shadow-xl"
                      : "bg-muted/40 hover:bg-card hover:shadow-lg"
                  }`}
                >
                  {/* Card with expandable content */}
                  <div className="p-6">
                    {/* Top section with title and logo */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                          {cert.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">{cert.issuer}</p>
                      </div>
                      
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-background flex-shrink-0">
                        <img 
                          src={cert.image} 
                          alt="" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    {/* Date info */}
                    <div className="flex items-center text-sm text-muted-foreground mb-4">
                      <span className="opacity-70">Issued:</span>
                      <span className="ml-2 font-medium">{cert.date}</span>
                    </div>
                    
                    {/* Bottom action area */}
                    <div className="flex items-center justify-between mt-auto">
                      <button
                        onClick={() => toggleCard(cert.id)}
                        className="text-sm font-medium flex items-center text-primary hover:underline"
                      >
                        {expandedCard === cert.id ? (
                          <>
                            <span>Show less</span>
                            <ChevronUp className="ml-1 w-4 h-4" />
                          </>
                        ) : (
                          <>
                            <span>Show details</span>
                            <ChevronDown className="ml-1 w-4 h-4" />
                          </>
                        )}
                      </button>
                      
                      {cert.credential_url && !expandedCard && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-primary hover:underline flex items-center"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <span>Verify</span>
                          <ArrowUpRight className="ml-1 w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  {/* Expanded content */}
                  {expandedCard === cert.id && (
                    <div className="px-6 pb-6">
                      <div className="pt-4 border-t border-border/40">
                        <div className="text-sm space-y-4">
                          <div>
                            <h4 className="font-medium mb-1">About this certification</h4>
                            <p className="text-muted-foreground leading-relaxed">
                              This credential validates skills and knowledge in {cert.title}. 
                              It demonstrates professional expertise and commitment to industry standards.
                            </p>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Key skills</h4>
                            <div className="flex flex-wrap gap-2">
                              {["Technical Proficiency", "Professional Knowledge", "Industry Best Practices"].map((skill, i) => (
                                <span 
                                  key={i}
                                  className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
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
                              className="mt-4 inline-flex items-center justify-center w-full py-2.5 px-4 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              <BadgeCheck className="w-4 h-4 mr-2" />
                              <span>View and Verify Credential</span>
                              <ExternalLink className="ml-2 w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full flex items-center justify-center py-16 bg-muted/40 rounded-2xl">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No certifications found for this filter.</p>
                  <button
                    onClick={() => setActiveFilter("all")}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View all certifications
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default CertificationsSection;