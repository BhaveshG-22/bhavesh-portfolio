
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const HeroSection = () => {
  return (
    <section id="hero" className="relative min-h-screen flex items-center bg-black">
      {/* Dark gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-black to-portfolio-blue/20 z-0" />
      
      <div className="max-container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center z-10">
        {/* 3D Card with avatar */}
        <div className="relative w-full max-w-md mx-auto lg:mx-0">
          <div className="relative rounded-3xl overflow-hidden bg-[#121212] shadow-2xl border border-[#333333]/40">
            {/* Software Developer Header */}
            <div className="p-6 text-center">
              <h2 className="text-5xl font-bold text-gray-400 mb-1">SOFTWARE</h2>
              <h2 className="text-5xl font-bold text-gray-400">DEVELOPER</h2>
              <p className="text-gray-500 mt-2">Learn &gt; build &gt; repeat</p>
            </div>
            
            {/* Avatar section */}
            <div className="relative bg-[#181818] p-4 rounded-xl mx-4 mb-4">
              {/* Tech icons */}
              <div className="absolute left-4 top-10 flex flex-col gap-4">
                <div className="w-14 h-14 bg-[#222] rounded-xl flex items-center justify-center text-white font-bold">
                  NEXT
                </div>
                <div className="w-14 h-14 bg-[#222] rounded-xl flex items-center justify-center">
                  <span className="text-white">aws</span>
                </div>
                <div className="w-14 h-14 bg-[#222] rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-teal-500" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" fill="currentColor"/>
                  </svg>
                </div>
                <div className="w-14 h-14 bg-[#222] rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="w-14 h-14 flex items-center justify-center text-gray-400 font-mono">
                  node
                </div>
              </div>
              
              {/* Avatar image */}
              <div className="flex justify-center">
                <img 
                  src="/lovable-uploads/a2b4104a-8a20-4916-b1bb-464a78417156.png" 
                  alt="Developer Avatar" 
                  className="h-80 object-contain"
                />
              </div>
              
              {/* Right side tech icons */}
              <div className="absolute right-4 top-10 flex flex-col gap-4">
                <div className="w-14 h-14 bg-[#222] rounded-xl"></div>
                <div className="w-14 h-14 bg-[#222] rounded-xl flex items-center justify-center">
                  <svg className="w-10 h-10 text-blue-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="flex flex-col space-y-8 text-center lg:text-left">
          <div className="space-y-6">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white">
              Hey, I'm <br />Bhavesh <span className="inline-block animate-wave">👋</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 max-w-lg mx-auto lg:mx-0">
              I build software that solves real-world problems.
            </p>
            
            <p className="text-xl md:text-2xl text-white/80 font-medium">
              Learn &gt; Build &gt; Repeat
            </p>
          </div>
          
          <div className="flex justify-center lg:justify-start">
            <Button 
              asChild 
              size="lg" 
              className="bg-transparent hover:bg-blue-500/20 text-blue-400 border border-blue-500/50 rounded-full px-8 py-6 text-lg"
            >
              <a href="#about">
                Meet the Dev
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
