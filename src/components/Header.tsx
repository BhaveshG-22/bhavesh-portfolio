
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navItems = [
    { title: "About", href: "#about" },
    { title: "Skills", href: "#skills" },
    { title: "Projects", href: "#projects" },
    { title: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed w-full z-30 transition-all duration-300 ${
        scrolled 
          ? "py-2 bg-white/90 shadow-md backdrop-blur-sm dark:bg-portfolio-blue/90" 
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-container flex items-center justify-between">
        <a href="#hero" className="text-xl font-bold text-gradient">
          DevPortfolio
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  className="text-sm font-medium hover:text-primary transition-colors"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Github className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Linkedin className="h-5 w-5" />
              </Button>
            </a>
            <Button asChild>
              <a href="#contact">
                <Mail className="h-4 w-4 mr-2" />
                Contact Me
              </a>
            </Button>
          </div>
        </nav>

        {/* Mobile Navigation */}
        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </Button>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 bg-white dark:bg-portfolio-blue/95 p-4 shadow-md md:hidden">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.title}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-medium hover:text-primary transition-colors"
                >
                  {item.title}
                </a>
              ))}
              <div className="flex items-center gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Github className="h-5 w-5" />
                  </Button>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <Button variant="ghost" size="icon" className="h-9 w-9">
                    <Linkedin className="h-5 w-5" />
                  </Button>
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
