
import GitHubContributions from "./GitHubContributions";
import { BaseComponentProps } from "@/types/component";

const GithubSection = ({ className = "" }: BaseComponentProps) => {
  return (
    <section id="github" className={`section-padding ${className}`}>
      <div className="max-container">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gradient-bright mb-4">
            GitHub Activity
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            My GitHub contributions over the past year. I'm consistently working on projects and contributing to open-source.
          </p>
        </div>
        <div className="w-full">
          <GitHubContributions username="BhaveshG-22" />
        </div>
      </div>
    </section>
  );
};

export default GithubSection;
