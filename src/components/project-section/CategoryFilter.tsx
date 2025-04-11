
import React from "react";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  setActiveCategory: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ 
  categories, 
  activeCategory, 
  setActiveCategory 
}) => {
  return (
    <div className="flex gap-6 mb-10 flex-wrap">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={cn(
            "px-4 py-1 text-sm rounded-md transition-all",
            activeCategory.toLowerCase() === category.toLowerCase()
              ? "bg-teal-500/20 text-teal-400 border border-teal-500/40"
              : "text-gray-400 hover:text-gray-200"
          )}
        >
          {category === "all" ? "All" : category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
