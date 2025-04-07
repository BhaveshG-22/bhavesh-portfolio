
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Github, Linkedin, Mail } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Sheet,
  SheetContent,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";

const Header = () => {
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
    { title: "Home", href: "#hero" },
    { title: "About", href: "#about" },
    { title: "Skills", href: "#skills" },
    { title: "Projects", href: "#projects" },
    { title: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed w-full z-30 transition-all duration-300 ${
        scrolled 
          ? "py-2 bg-white/90 dark:bg-portfolio-blue/90 shadow-md backdrop-blur-sm" 
          : "py-4 bg-transparent"
      }`}
    >
      <div className="max-container flex items-center justify-between">
        <a href="#hero" className="text-xl font-bold hover:text-primary transition-colors">
          <span className="text-gradient-light font-poppins">
            BhaveshG.dev
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6">
            {navItems.map((item) => (
              <li key={item.title}>
                <a
                  href={item.href}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors"
                >
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground hover:bg-gray-100 dark:hover:bg-white/10">
                <Github className="h-5 w-5" />
              </Button>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-foreground hover:bg-gray-100 dark:hover:bg-white/10">
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

        {/* Mobile Navigation with Sheet */}
        <div className="flex md:hidden items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                className="text-foreground hover:bg-gray-100 dark:hover:bg-white/10"
                aria-label="Open menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="p-0 w-full max-w-full sm:max-w-full bg-background/95 dark:bg-[#1A1F2C]/95 border-l-0 flex flex-col h-full">
              <div className="flex flex-col h-full">
                <div className="flex justify-end p-4">
                  <SheetClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary">
                    <X className="h-6 w-6 text-foreground" />
                    <span className="sr-only">Close</span>
                  </SheetClose>
                </div>
                
                <nav className="flex-1 flex flex-col justify-center items-center space-y-8 py-8">
                  {navItems.map((item) => (
                    <SheetClose asChild key={item.title}>
                      <a
                        href={item.href}
                        className="text-2xl font-medium text-foreground/70 hover:text-foreground transition-colors"
                      >
                        {item.title}
                      </a>
                    </SheetClose>
                  ))}
                </nav>
                
                <div className="flex justify-center space-x-6 p-6 border-t border-border">
                  <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/10">
                      <Github className="h-6 w-6" />
                    </Button>
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                    <Button variant="ghost" size="icon" className="h-10 w-10 text-foreground/70 hover:text-foreground hover:bg-gray-100 dark:hover:bg-white/10">
                      <Linkedin className="h-6 w-6" />
                    </Button>
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
