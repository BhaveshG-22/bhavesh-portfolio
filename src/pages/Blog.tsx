
import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { BookOpen, FileText, Search } from "lucide-react";

// Sample blog data
const BLOG_POSTS = [
  {
    id: 1,
    title: "Getting Started with React",
    excerpt: "Learn the basics of React and how to build your first component.",
    date: "April 2, 2025",
    category: "React",
    image: "/placeholder.svg",
    readTime: "5 min read"
  },
  {
    id: 2,
    title: "Advanced TypeScript Patterns",
    excerpt: "Discover advanced TypeScript patterns to improve your code quality and maintainability.",
    date: "March 28, 2025",
    category: "TypeScript",
    image: "/placeholder.svg",
    readTime: "8 min read"
  },
  {
    id: 3,
    title: "Mastering Tailwind CSS",
    excerpt: "Take your CSS skills to the next level with advanced Tailwind techniques.",
    date: "March 20, 2025",
    category: "CSS",
    image: "/placeholder.svg",
    readTime: "6 min read"
  },
  {
    id: 4,
    title: "Building Responsive UIs",
    excerpt: "Learn how to create responsive user interfaces that work on any device.",
    date: "March 15, 2025",
    category: "UI/UX",
    image: "/placeholder.svg",
    readTime: "7 min read"
  }
];

const CATEGORIES = ["All", "React", "TypeScript", "CSS", "UI/UX", "JavaScript"];

const Blog = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter posts based on search query and category
  const filteredPosts = BLOG_POSTS.filter((post) => {
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
              {CATEGORIES.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveCategory(category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Blog Posts */}
          {filteredPosts.length > 0 ? (
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
                        {post.readTime}
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
