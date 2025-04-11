
import React from "react";
import { Button } from "@/components/ui/button";

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
    <div className="flex gap-2 mb-10 flex-wrap">
      {categories.map((category) => (
        <Button
          key={category}
          onClick={() => setActiveCategory(category)}
          variant={activeCategory.toLowerCase() === category.toLowerCase() ? "secondary" : "outline"}
          className="text-sm"
        >
          {category === "all" ? "All Projects" : category}
        </Button>
      ))}
    </div>
  );
};

export default CategoryFilter;
