
import { Github } from "lucide-react";
import GitHubContributions from "@/components/GitHubContributions";
import { Button } from "./ui/button";

const GithubSection = () => {
  return (
    <section id="github" className="section-padding bg-black py-20">
      <div className="max-container">
        <div className="flex flex-col items-center text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 flex items-center gap-2 text-white">
            <Github className="h-8 w-8 text-teal-500" />
            <span className="bg-gradient-to-r from-white to-teal-400 bg-clip-text text-transparent">
              GitHub Activity
            </span>
          </h2>
          <div className="w-20 h-1.5 bg-teal-500 rounded-full mb-8" />
          <p className="text-lg text-gray-300 max-w-3xl mb-10">
            My open source contributions and coding activity over time.
          </p>
        </div>
        
        <div className="w-full max-w-5xl mx-auto">
          <GitHubContributions />
        </div>
        
        <div className="mt-10 flex justify-center">
          <Button 
            size="lg"
            variant="dark"
            className="border border-gray-700 px-6"
            asChild
          >
            <a 
              href="https://github.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <Github className="h-5 w-5" />
              View GitHub Profile
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default GithubSection;
