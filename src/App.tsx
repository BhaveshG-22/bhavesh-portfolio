
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "./components/ThemeProvider";
import Index from "./pages/Index";
import Blog from "./pages/Blog";
import NotFound from "./pages/NotFound";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import EditCertifications from "./pages/EditCertifications";
import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import EditProject from "./pages/EditProject";
import Login from "./pages/Login";
import EditBlog from "./pages/EditBlog";
import ContactSubmissions from "./pages/ContactSubmissions";

function App() {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen">
          <RouterProvider
            router={createBrowserRouter([
              {
                path: "/",
                element: <Index />,
                errorElement: <NotFound />
              },
              {
                path: "/blog",
                element: <Blog />,
                errorElement: <NotFound />
              },
              {
                path: "/edit-certifications",
                element: <EditCertifications />,
                errorElement: <NotFound />
              },
              {
                path: "/projects",
                element: <Projects />,
                errorElement: <NotFound />
              },
              {
                path: "/project/new",
                element: <CreateProject />,
                errorElement: <NotFound />
              },
              {
                path: "/project/edit/:id",
                element: <EditProject />,
                errorElement: <NotFound />
              },
              {
                path: "/login",
                element: <Login />,
                errorElement: <NotFound />
              },
              {
                path: "/edit-blog",
                element: <EditBlog />,
                errorElement: <NotFound />
              },
              {
                path: "/admin/contact-submissions",
                element: <ContactSubmissions />,
                errorElement: <NotFound />
              }
            ])}
          />
          <Toaster />
        </div>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
