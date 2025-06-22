
import { Button } from "@/components/ui/button";
import { Github, Linkedin, Mail, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { isAuthenticated } = useAuth();
  
  return (
    <footer className="bg-muted/50 py-12">
      <div className="max-container">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-6 md:mb-0">
            <a href="#hero" className="text-2xl font-bold text-gradient">
              BhaveshG.dev
            </a>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm">
              Crafting innovative web solutions with a focus on performance,
              accessibility, and beautiful user experiences.
            </p>
          </div>
          
          <div className="flex flex-col items-center md:items-end">
            <div className="flex space-x-2 mb-4">
              <Button variant="ghost" size="icon" asChild>
                <a href="https://github.com/BhaveshG-22" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://www.linkedin.com/in/bhaveshgavali" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="https://x.com/Bhavesh_2424_" target="_blank" rel="noreferrer" aria-label="Twitter">
                  <Twitter className="h-5 w-5" />
                </a>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <a href="mailto:bhaveshgavali2022@gmail.com" aria-label="Email">
                  <Mail className="h-5 w-5" />
                </a>
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              © {currentYear} BhaveshG.dev. All rights reserved.
            </p>
          </div>
        </div>
        
        <div className="border-t border-border pt-6 flex flex-col sm:flex-row justify-between items-center">
          <div className="text-sm text-muted-foreground mb-4 sm:mb-0">
            Designed & Built with ❤️
          </div>
          <nav>
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
              <li>
                <a href="#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#skills" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Skills
                </a>
              </li>
              <li>
                <a href="#projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </a>
              </li>
              <li>
                <a href="#contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
              {isAuthenticated && (
                <li>
                  <Link to="/admin/contact-submissions" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Contact Submissions
                  </Link>
                </li>
              )}
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
