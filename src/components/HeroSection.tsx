// HeroSection.tsx - Simplified version without special characters
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  // Use createElement approach to avoid any JSX parsing issues
  return React.createElement("div", {
    id: "hero",
    className: "relative min-h-screen flex items-center pt-16"
  }, [
    // Background gradient
    React.createElement("div", {
      key: "bg",
      className: "absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 z-0"
    }),
    
    // Background elements
    React.createElement("div", {
      key: "bg-1",
      className: "absolute top-20 right-10 h-64 w-64 bg-primary/10 rounded-full blur-3xl"
    }),
    React.createElement("div", {
      key: "bg-2",
      className: "absolute bottom-20 left-10 h-64 w-64 bg-purple-500/10 rounded-full blur-3xl"
    }),
    
    // Main content
    React.createElement("div", {
      key: "content",
      className: "max-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10"
    }, [
      // Left column - Text content
      React.createElement("div", {
        key: "text-column",
        className: "flex flex-col space-y-6"
      }, [
        // Badge
        React.createElement("span", {
          key: "badge",
          className: "text-sm md:text-base font-medium text-primary px-4 py-2 bg-primary/10 rounded-full w-fit"
        }, "Full-Stack Web Developer"),
        
        // Main heading
        React.createElement("h1", {
          key: "heading",
          className: "text-4xl md:text-5xl lg:text-6xl font-bold leading-tight"
        }, [
          "Crafting ",
          React.createElement("span", {
            key: "gradient-text",
            className: "bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent"
          }, "digital experiences"),
          " with code"
        ]),
        
        // Description
        React.createElement("p", {
          key: "description",
          className: "text-lg text-foreground/80 max-w-lg"
        }, "I build responsive, performant, and accessible web applications using modern technologies. Let's bring your ideas to life with elegant solutions."),
        
        // Buttons
        React.createElement("div", {
          key: "buttons",
          className: "flex flex-wrap gap-4 pt-4"
        }, [
          // Primary button
          React.createElement(Button, {
            key: "primary-btn",
            asChild: true,
            size: "lg",
            className: "bg-primary hover:bg-primary/90"
          }, 
            React.createElement("a", {
              href: "#projects",
              className: "flex items-center"
            }, [
              "View My Work",
              React.createElement(ArrowRight, {
                key: "arrow",
                className: "ml-2 h-4 w-4"
              })
            ])
          ),
          
          // Secondary button
          React.createElement(Button, {
            key: "secondary-btn",
            variant: "outline",
            size: "lg",
            asChild: true
          }, 
            React.createElement("a", {
              href: "#contact"
            }, "Contact Me")
          )
        ])
      ]),
      
      // Right column - Code mockup
      React.createElement("div", {
        key: "mockup",
        className: "relative w-full h-[400px] lg:h-[500px] p-4"
      }, [
        // Background glow
        React.createElement("div", {
          key: "glow",
          className: "absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-lg opacity-20 blur-xl"
        }),
        
        // Card container
        React.createElement("div", {
          key: "card",
          className: "absolute inset-4 bg-black/50 rounded-lg flex items-center justify-center p-8 border border-white/10"
        }, 
          // Code editor mockup
          React.createElement("div", {
            key: "editor",
            className: "relative w-full h-full bg-black/70 rounded-md border border-white/10 p-4 overflow-hidden"
          }, [
            // Editor chrome
            React.createElement("div", {
              key: "window-controls",
              className: "absolute top-2 left-2 flex gap-1"
            }, [
              React.createElement("div", { key: "red", className: "w-3 h-3 rounded-full bg-red-500" }),
              React.createElement("div", { key: "yellow", className: "w-3 h-3 rounded-full bg-yellow-500" }),
              React.createElement("div", { key: "green", className: "w-3 h-3 rounded-full bg-green-500" })
            ]),
            
            // Code content
            React.createElement("div", {
              key: "code-content",
              className: "mt-5 space-y-2"
            }, [
              React.createElement("div", { key: "line1", className: "h-4 bg-white/20 rounded w-3/4" }),
              React.createElement("div", { key: "line2", className: "h-4 bg-white/20 rounded w-full" }),
              React.createElement("div", { key: "line3", className: "h-4 bg-primary/20 rounded w-2/3" }),
              React.createElement("div", { key: "block", className: "h-12 mt-4 bg-white/10 rounded-md border border-white/20" }),
              React.createElement("div", { 
                key: "flex-row", 
                className: "flex gap-2 mt-4" 
              }, [
                React.createElement("div", { key: "pill1", className: "h-4 bg-purple-500/30 rounded w-1/3" }),
                React.createElement("div", { key: "pill2", className: "h-4 bg-blue-500/30 rounded w-1/3" })
              ]),
              React.createElement("div", { key: "line4", className: "h-4 bg-white/20 rounded w-5/6" }),
              React.createElement("div", { key: "line5", className: "h-4 bg-white/20 rounded w-4/5" }),
              React.createElement("div", { key: "line6", className: "h-4 bg-primary/20 rounded w-3/4" })
            ])
          ])
        )
      ])
    ])
  ]);
};

export default HeroSection;