
import { BadgeCheck, Award, Bookmark } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";

interface CertificationProps {
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl?: string;
}

const certifications: CertificationProps[] = [
  {
    title: "Full Stack Web Development",
    issuer: "Udacity",
    date: "March 2023",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7",
    credentialUrl: "#"
  },
  {
    title: "React Advanced Concepts",
    issuer: "Meta",
    date: "January 2023",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085",
    credentialUrl: "#"
  },
  {
    title: "Machine Learning Specialization",
    issuer: "Coursera",
    date: "November 2022",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6",
    credentialUrl: "#"
  }
];

const CertificationsSection = () => {
  return (
    <section id="certifications" className="section-padding relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 right-10 w-40 h-40 rounded-full bg-secondary/5 blur-3xl"></div>
        <div className="absolute bottom-20 left-10 w-56 h-56 rounded-full bg-primary/10 blur-3xl"></div>
      </div>
      
      <div className="max-container relative z-10">
        <div className="flex flex-col items-center text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4 text-gradient-light">Certifications</h2>
          <div className="w-24 h-1.5 bg-primary rounded-full mb-6 animate-pulse"></div>
          <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed">
            Professional achievements and continuous learning that showcase my expertise and dedication.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {certifications.map((cert, index) => (
            <Card 
              key={index} 
              className="group bg-card/30 backdrop-blur-sm border border-white/10 overflow-hidden hover:border-primary/30 transition-all duration-300"
            >
              <div className="relative">
                <AspectRatio ratio={16/9}>
                  <img 
                    src={cert.image} 
                    alt={cert.title} 
                    className="object-cover w-full h-full opacity-60 group-hover:opacity-80 transition-opacity duration-300"
                  />
                </AspectRatio>
                <div className="absolute top-3 right-3 bg-primary/90 p-2 rounded-full shadow-lg">
                  {index === 0 ? (
                    <Award className="h-5 w-5 text-white" />
                  ) : (
                    <Bookmark className="h-5 w-5 text-white" />
                  )}
                </div>
              </div>
              <CardContent className="p-5">
                <h3 className="font-semibold text-lg mb-1 text-gradient group-hover:text-white transition-colors">
                  {cert.title}
                </h3>
                <div className="flex items-center text-sm text-muted-foreground mb-3">
                  <span className="mr-2">Issued by {cert.issuer}</span>
                  <span>•</span>
                  <span className="ml-2">{cert.date}</span>
                </div>
                <div className="flex items-center text-sm mt-3 text-primary">
                  {cert.credentialUrl && (
                    <a 
                      href={cert.credentialUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center hover:underline"
                    >
                      <BadgeCheck className="w-4 h-4 mr-1" />
                      Verify Certificate
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CertificationsSection;
