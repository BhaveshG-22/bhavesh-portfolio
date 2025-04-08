
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Menu, X, LogIn, LogOut, Mail, BookOpen, FolderKanban } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export interface HeaderProps {
  activeSection?: string;
}

export const Header = ({ activeSection }: HeaderProps) => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="w-full z-30 bg-transparent border-b border-white/5">
      <div className="max-container flex items-center justify-between h-16 px-4">
        <Link
          to="/#hero"
          className="text-xl font-bold hover:text-primary transition-colors"
        >
          <span className="text-gradient-light font-poppins">BhaveshG.dev</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            <li>
              <Link
                to="/#hero"
                className={`text-sm font-medium text-foreground hover:text-primary transition-colors ${
                  activeSection === 'home' ? 'text-primary' : ''
                }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/#projects"
                className={`text-sm font-medium text-foreground hover:text-primary transition-colors ${
                  activeSection === 'projects' ? 'text-primary' : ''
                }`}
              >
                Projects
              </Link>
            </li>
            <li>
              <Link
                to="/projects"
                className={`text-sm font-medium text-foreground hover:text-primary transition-colors ${
                  activeSection === 'projects-page' ? 'text-primary' : ''
                }`}
              >
                All Projects
              </Link>
            </li>
            <li>
              <Link
                to="/blog"
                className={`text-sm font-medium text-foreground hover:text-primary transition-colors ${
                  activeSection === 'blog' ? 'text-primary' : ''
                }`}
              >
                Blog
              </Link>
            </li>
          </ul>
          <div className="flex items-center gap-2">
            <a href="#contact" onClick={handleContactClick}>
              <Button size="default" className="h-10">
                <Mail className="h-4 w-4 mr-2" />
                Contact Me
              </Button>
            </a>
            
            {user && (
              <Button variant="destructive" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" /> Logout
              </Button>
            )}
          </div>
        </nav>
        
        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" className="px-4 py-2" aria-label="Open menu">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="flex flex-col pt-16 bg-background/80 backdrop-blur-md">
              <nav className="flex flex-col items-start gap-6">
                <Link
                  to="/#hero"
                  className={`text-lg font-medium hover:text-primary transition-colors ${
                    activeSection === 'home' ? 'text-primary' : ''
                  }`}
                >
                  Home
                </Link>
                <Link
                  to="/#projects"
                  className={`text-lg font-medium hover:text-primary transition-colors ${
                    activeSection === 'projects' ? 'text-primary' : ''
                  }`}
                >
                  Projects
                </Link>
                <Link
                  to="/projects"
                  className={`text-lg font-medium hover:text-primary transition-colors ${
                    activeSection === 'projects-page' ? 'text-primary' : ''
                  }`}
                >
                  <FolderKanban className="h-4 w-4 mr-2 inline-block" /> All Projects
                </Link>
                <Link
                  to="/blog"
                  className={`text-lg font-medium hover:text-primary transition-colors ${
                    activeSection === 'blog' ? 'text-primary' : ''
                  }`}
                >
                  <BookOpen className="h-4 w-4 mr-2 inline-block" /> Blog
                </Link>
              </nav>
              
              <div className="flex flex-col gap-4 mt-8">
                <a href="#contact" onClick={handleContactClick}>
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Contact Me
                  </Button>
                </a>
                
                {user && (
                  <Button variant="destructive" onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" /> Logout
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
