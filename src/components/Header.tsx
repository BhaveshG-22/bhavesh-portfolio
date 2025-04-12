
import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import ThemeToggle from './ThemeToggle';
import { ModeToggle } from './mode-toggle';
import { Link as RouterLink } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationLinks = [
    { name: 'Home', href: '/' },
    { name: 'Blog', href: '/blog' },
    { name: 'Edit Certifications', href: '/edit-certifications' }
  ];

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container flex h-16 items-center justify-between">
        <RouterLink to="/" className="font-bold text-2xl text-gradient-bright">
          BhaveshG.dev
        </RouterLink>
        <div className="flex items-center gap-4">
          <nav className="hidden md:flex gap-6">
            {navigationLinks.map((link) => (
              <RouterLink key={link.name} to={link.href} className="hover:text-primary transition-colors">
                {link.name}
              </RouterLink>
            ))}
          </nav>
          <ModeToggle />
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-sm">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Explore the site.
                </SheetDescription>
              </SheetHeader>
              <div className="grid gap-4 py-4">
                {navigationLinks.map((link) => (
                  <RouterLink key={link.name} to={link.href} className="hover:text-primary transition-colors block py-2">
                    {link.name}
                  </RouterLink>
                ))}
                <ThemeToggle />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
