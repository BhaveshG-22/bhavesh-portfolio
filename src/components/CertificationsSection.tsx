import { useState, useEffect } from "react";
import { BadgeCheck, Award, Bookmark, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { fetchVisibleCertifications, Certification } from "@/services/certificationService";
import { toast } from "sonner";

const CertificationsSection = () => {
  const [certifications, setCertifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCard, setActiveCard] = useState(null);

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
    <section id="certifications" className="py-16 md:py-24 px-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-1/4 right-10 w-40 h-40 rounded-full bg-secondary/5 blur-3xl"></div>
        <div className="absolute bottom-1/4 left-10 w-56 h-56 rounded-full bg-primary/10 blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col items-center text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-gradient-light">Certifications</h2>
          <div className="w-24 h-1.5 bg-primary rounded-full mb-6 animate-pulse"></div>
          <p className="text-base md:text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Professional achievements and continuous learning that showcase my expertise and dedication.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[1, 2, 3].map((item) => (
              <Card key={item} className="bg-card/30 backdrop-blur-sm border border-white/10 overflow-hidden">
                <div className="h-40 sm:h-48 bg-muted/20 animate-pulse"></div>
                <CardContent className="p-4 md:p-5">
                  <div className="h-6 w-3/4 bg-muted/20 animate-pulse mb-2"></div>
                  <div className="h-4 w-1/2 bg-muted/20 animate-pulse mb-4"></div>
                  <div className="h-4 w-1/3 bg-muted/20 animate-pulse"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {certifications.length > 0 ? (
              certifications.map((cert, index) => (
                <Card 
                  key={cert.id} 
                  className={`group relative bg-card/30 backdrop-blur-sm border overflow-hidden transition-all duration-300 ${
                    activeCard === cert.id 
                      ? "border-primary scale-105 shadow-xl z-10" 
                      : "border-white/10 hover:border-primary/30"
                  }`}
                  onMouseEnter={() => setActiveCard(cert.id)}
                  onMouseLeave={() => setActiveCard(null)}
                  onClick={() => cert.credential_url && window.open(cert.credential_url, "_blank")}
                >
                  <div className="relative">
                    <AspectRatio ratio={16/9}>
                      <img 
                        src={cert.image} 
                        alt={cert.title} 
                        className={`object-cover w-full h-full transition-all duration-300 ${
                          activeCard === cert.id ? "opacity-90 scale-105" : "opacity-70 group-hover:opacity-80"
                        }`}
                      />
                    </AspectRatio>
                    
                    {/* Badge overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-80"></div>
                    
                    {/* Top right badge */}
                    <div className={`absolute top-3 right-3 p-2 rounded-full shadow-lg transition-all duration-300 ${
                      index === 0 ? "bg-yellow-500/90" : "bg-primary/90"
                    }`}>
                      {index === 0 ? (
                        <Award className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      ) : (
                        <Bookmark className="h-4 w-4 md:h-5 md:w-5 text-white" />
                      )}
                    </div>
                    
                    {/* Issuer Badge */}
                    <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                      {cert.issuer}
                    </div>
                    
                    {/* Date Badge */}
                    <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-xs">
                      {cert.date}
                    </div>
                  </div>
                  
                  <CardContent className="p-4 md:p-5">
                    <div className="flex justify-between items-start">
                      <h3 className={`font-bold text-base md:text-lg transition-colors ${
                        activeCard === cert.id 
                          ? "text-white" 
                          : "text-gradient group-hover:text-white"
                      }`}>
                        {cert.title}
                      </h3>
                    </div>
                    
                    {cert.credential_url && (
                      <div className="flex items-center justify-between mt-4">
                        <span className="text-xs md:text-sm text-muted-foreground">
                          Tap to view details
                        </span>
                        <div className="flex items-center text-xs md:text-sm text-primary group-hover:text-primary-light transition-colors">
                          <BadgeCheck className="w-4 h-4 mr-1" />
                          <span className="mr-1">Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </div>
                      </div>
                    )}
                  </CardContent>
                  
                  {/* Interactive hover effect overlay */}
                  {cert.credential_url && (
                    <div className={`absolute inset-0 bg-primary/10 pointer-events-none transition-opacity duration-300 ${
                      activeCard === cert.id ? "opacity-100" : "opacity-0"
                    }`}></div>
                  )}
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-10">
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