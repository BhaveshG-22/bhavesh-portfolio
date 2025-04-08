
import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FileText, Search } from "lucide-react";
import { fetchVisibleBlogPosts, fetchCategories, type BlogPost } from "@/services/blogService";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  // Fetch blog posts from Supabase using React Query
  const { 
    data: blogPosts = [],
    isLoading: isLoadingPosts,
    isError: isPostsError 
  } = useQuery({
    queryKey: ["blogPosts"],
    queryFn: fetchVisibleBlogPosts
  });
  
  // Fetch categories from Supabase using React Query
  const { 
    data: categories = ["All"],
    isLoading: isLoadingCategories,
    isError: isCategoriesError 
  } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: fetchCategories
  });
  
  // Show toast error if data fetch fails
  useEffect(() => {
    if (isPostsError) {
      toast.error("Failed to load blog posts");
    }
    if (isCategoriesError) {
      toast.error("Failed to load categories");
    }
  }, [isPostsError, isCategoriesError]);

  // Filter posts based on search query and category
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "All" || post.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow pt-24 pb-16">
        <div className="max-container">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">My Blog</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Thoughts, stories and ideas about web development, design and technology
            </p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-10">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input 
                placeholder="Search articles..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex overflow-x-auto gap-2 py-2 w-full md:w-auto">
              {isLoadingCategories ? (
                <div className="animate-pulse flex gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-9 w-20 bg-muted rounded-md"></div>
                  ))}
                </div>
              ) : (
                categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveCategory(category)}
                    className="whitespace-nowrap"
                  >
                    {category}
                  </Button>
                ))
              )}
            </div>
          </div>

          {/* Blog Posts */}
          {isLoadingPosts ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="border rounded-lg overflow-hidden animate-pulse">
                  <div className="h-48 bg-muted"></div>
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-muted rounded w-1/3"></div>
                    <div className="h-6 bg-muted rounded w-4/5"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                    <div className="h-10 bg-muted rounded w-full mt-4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post) => (
                <article 
                  key={post.id} 
                  className="flex flex-col border rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                >
                  <div className="h-48 bg-muted relative">
                    <img 
                      src={post.image} 
                      alt={post.title} 
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-4 right-4 bg-primary/90 text-primary-foreground text-xs px-2 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-5 flex-grow flex flex-col">
                    <div className="flex items-center text-sm text-muted-foreground mb-3">
                      <span>{post.date}</span>
                      <Separator orientation="vertical" className="mx-2 h-4" />
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {post.read_time}
                      </span>
                    </div>
                    <h2 className="text-xl font-semibold mb-3 line-clamp-2">{post.title}</h2>
                    <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                    <Button variant="outline" className="w-full mt-auto gap-2" asChild>
                      <a href={`#blog/${post.id}`}>
                        <BookOpen className="h-4 w-4" /> Read Article
                      </a>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <h3 className="text-xl font-medium mb-2">No articles found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter criteria
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Blog;
