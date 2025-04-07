
import { Github } from "lucide-react";
import GitHubContributions from "@/components/GitHubContributions";
import { Button } from "./ui/button";

const GithubSection = () => {
  return (
    <section id="github" className="section-padding bg-gray-950">
      <div className="max-container">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2 text-white">
            <Github className="h-8 w-8 text-primary" />
            <span className="bg-gradient-to-r from-white to-primary/80 bg-clip-text text-transparent">
              My GitHub Activity
            </span>
          </h2>
          <div className="w-20 h-1.5 bg-primary rounded-full mb-8" />
          <p className="text-lg text-gray-300 max-w-3xl">
            Track my open source contributions and coding activity over time.
            I'm passionate about contributing to the developer community.
          </p>
        </div>
        
        <div className="w-full max-w-5xl mx-auto">
          <GitHubContributions />
        </div>
        
        <div className="mt-8 flex justify-center">
          <Button 
            variant="default"
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            asChild
          >
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              View my GitHub Profile
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GithubSection;
