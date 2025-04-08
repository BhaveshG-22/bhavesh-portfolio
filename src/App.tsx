
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import { AuthProvider } from "@/contexts/AuthContext"; 
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SecretProjectAdd from "./pages/SecretProjectAdd";
import Blog from "./pages/Blog";
import SecretBlogAdd from "./pages/SecretBlogAdd";
import Login from "./pages/Login";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/login" element={<Login />} />
              <Route 
                path="/secret-project-add" 
                element={
                  <ProtectedRoute adminOnly>
                    <SecretProjectAdd />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/secret-blog-add" 
                element={
                  <ProtectedRoute adminOnly>
                    <SecretBlogAdd />
                  </ProtectedRoute>
                } 
              />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
