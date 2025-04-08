
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./ThemeToggle";
import { Menu, X, LogIn, LogOut } from "lucide-react";

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
            to="/#projects" 
            className={`hover:text-teal-400 ${activeSection === 'projects' ? 'text-teal-400' : ''}`}
            onClick={toggleMobileMenu}
          >
            Projects
          </Link>
          <Link 
            to="/#about" 
            className={`hover:text-teal-400 ${activeSection === 'about' ? 'text-teal-400' : ''}`}
            onClick={toggleMobileMenu}
          >
            About
          </Link>
          <Link 
            to="/blog" 
            className={`hover:text-teal-400 ${activeSection === 'blog' ? 'text-teal-400' : ''}`}
            onClick={toggleMobileMenu}
          >
            Blog
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
    <header className="fixed top-0 w-full z-30 bg-background/80 backdrop-blur-lg border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link 
          to="/" 
          className="font-bold text-xl flex items-center"
        >
          <span className="text-teal-400">BhaveshG.dev</span>
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
            to="/#projects" 
            className={`hover:text-teal-400 ${activeSection === 'projects' ? 'text-teal-400' : ''}`}
          >
            Projects
          </Link>
          <Link 
            to="/#about" 
            className={`hover:text-teal-400 ${activeSection === 'about' ? 'text-teal-400' : ''}`}
          >
            About
          </Link>
          <Link 
            to="/blog" 
            className={`hover:text-teal-400 ${activeSection === 'blog' ? 'text-teal-400' : ''}`}
          >
            Blog
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
          {/* Admin login button for desktop */}
          {!isMobile && (
            <>
              {user ? (
                <Button variant="destructive" size="sm" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </Button>
              ) : (
                <Link to="/login">
                  <Button size="sm">
                    <LogIn className="h-4 w-4 mr-2" /> Admin Login
                  </Button>
                </Link>
              )}
            </>
          )}
          
          <ThemeToggle />
          
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
