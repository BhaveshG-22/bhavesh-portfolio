
import { Github } from "lucide-react";
import GitHubContributions from "@/components/GitHubContributions";

const GithubSection = () => {
  return (
    <section id="github" className="section-padding bg-gray-900 dark:bg-gray-950">
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
        
        <div className="w-full max-w-6xl mx-auto">
          <GitHubContributions />
        </div>
        
        <div className="mt-12 flex justify-center">
          <a 
            href="https://github.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-primary/90 text-white px-6 py-3 rounded-full flex items-center gap-2 hover:bg-primary transition-all shadow-lg hover:shadow-primary/20"
          >
            <Github className="h-5 w-5" />
            View my GitHub Profile
          </a>
        </div>
      </div>
    </section>
  );
};

export default GithubSection;
