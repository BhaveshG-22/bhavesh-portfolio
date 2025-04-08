
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, LogIn, LogOut, Mail, Github, Linkedin } from "lucide-react";

export interface HeaderProps {
  activeSection?: string;
}

export const Header = ({ activeSection }: HeaderProps) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!isMobile && mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  }, [isMobile]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = async () => {
    await logout();
  };

  const renderMobileMenu = () => {
    if (!mobileMenuOpen) return null;

    return (
      <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-sm z-40 flex flex-col">
        <div className="flex justify-end p-4">
          <Button variant="ghost" size="icon" onClick={toggleMobileMenu}>
            <X />
          </Button>
        </div>
        <nav className="flex flex-col items-center justify-center flex-1 gap-8 text-lg">
          <Link 
            to="/#home" 
            className={`hover:text-teal-400 ${activeSection === 'home' ? 'text-teal-400' : ''}`}
            onClick={toggleMobileMenu}
          >
            Home
          </Link>
          <Link 
            to="/#about" 
            className={`hover:text-teal-400 ${activeSection === 'about' ? 'text-teal-400' : ''}`}
            onClick={toggleMobileMenu}
          >
            About
          </Link>
          <Link 
            to="/#skills" 
            className={`hover:text-teal-400 ${activeSection === 'skills' ? 'text-teal-400' : ''}`}
            onClick={toggleMobileMenu}
          >
            Skills
          </Link>
          <Link 
            to="/#projects" 
            className={`hover:text-teal-400 ${activeSection === 'projects' ? 'text-teal-400' : ''}`}
            onClick={toggleMobileMenu}
          >
            Projects
          </Link>
          <Link 
            to="/#contact" 
            className={`hover:text-teal-400 ${activeSection === 'contact' ? 'text-teal-400' : ''}`}
            onClick={toggleMobileMenu}
          >
            Contact
          </Link>
          {user ? (
            <Button variant="destructive" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
          ) : (
            <Link to="/login" onClick={toggleMobileMenu}>
              <Button size="sm">
                <LogIn className="h-4 w-4 mr-2" /> Admin Login
              </Button>
            </Link>
          )}
        </nav>
      </div>
    );
  };

  return (
    <header className="fixed top-0 w-full z-30 bg-black/90 backdrop-blur-sm border-b border-white/5">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link 
          to="/" 
          className="font-bold text-xl flex items-center"
        >
          <div className="flex items-center">
            <span className="font-bold text-white">BhaveshG</span>
            <span className="text-blue-400">.dev</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link 
            to="/#home" 
            className={`hover:text-teal-400 ${activeSection === 'home' ? 'text-teal-400' : ''}`}
          >
            Home
          </Link>
          <Link 
            to="/#about" 
            className={`hover:text-teal-400 ${activeSection === 'about' ? 'text-teal-400' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/#skills" 
            className={`hover:text-teal-400 ${activeSection === 'skills' ? 'text-teal-400' : ''}`}
          >
            Skills
          </Link>
          <Link 
            to="/#projects" 
            className={`hover:text-teal-400 ${activeSection === 'projects' ? 'text-teal-400' : ''}`}
          >
            Projects
          </Link>
          <Link 
            to="/#contact" 
            className={`hover:text-teal-400 ${activeSection === 'contact' ? 'text-teal-400' : ''}`}
          >
            Contact
          </Link>
        </nav>

        {/* Right side buttons */}
        <div className="flex items-center space-x-2">
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="Github">
            <Github className="h-5 w-5" />
          </Button>
          
          <Button variant="ghost" size="icon" className="hidden md:inline-flex" aria-label="LinkedIn">
            <Linkedin className="h-5 w-5" />
          </Button>
          
          <Button variant="outline" size="sm" className="hidden md:inline-flex">
            <Mail className="h-4 w-4 mr-2" /> Contact Me
          </Button>
          
          {/* Mobile menu toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="md:hidden" 
            onClick={toggleMobileMenu}
          >
            <Menu />
          </Button>
        </div>
      </div>
      
      {renderMobileMenu()}
    </header>
  );
};

export default Header;
