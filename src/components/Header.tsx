
import { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu, LogOut } from "lucide-react"
import { Link as RouterLink } from "react-router-dom";
import { useAuth } from '@/hooks/useAuth';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navigationLinks = [
    { name: 'Projects', href: '/projects' },
    { name: 'Blog', href: '/blog' }
  ];

  const adminLinks = [
    { name: 'Edit Certifications', href: '/edit-certifications' },
    { name: 'Edit Blog', href: '/edit-blog' }
  ];

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

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
            {isAuthenticated && adminLinks.map((link) => (
              <RouterLink key={link.name} to={link.href} className="hover:text-primary transition-colors">
                {link.name}
              </RouterLink>
            ))}
            {isAuthenticated ? (
              <Button variant="ghost" size="sm" onClick={logout} className="hover:text-primary transition-colors">
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            ) : (
              <RouterLink to="/login" className="hover:text-primary transition-colors">
                Login
              </RouterLink>
            )}
          </nav>
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
                  <RouterLink key={link.name} to={link.href} className="hover:text-primary transition-colors block py-2" onClick={() => setIsMenuOpen(false)}>
                    {link.name}
                  </RouterLink>
                ))}
                {isAuthenticated && adminLinks.map((link) => (
                  <RouterLink key={link.name} to={link.href} className="hover:text-primary transition-colors block py-2" onClick={() => setIsMenuOpen(false)}>
                    {link.name}
                  </RouterLink>
                ))}
                {isAuthenticated ? (
                  <Button variant="ghost" onClick={handleLogout} className="justify-start px-2">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                ) : (
                  <RouterLink to="/login" className="hover:text-primary transition-colors block py-2" onClick={() => setIsMenuOpen(false)}>
                    Login
                  </RouterLink>
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
