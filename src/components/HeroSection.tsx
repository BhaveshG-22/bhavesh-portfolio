// AlternativeHeroSection.tsx with enhanced terminal
import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  ChevronRight,
  Github,
  Linkedin,
  Twitter,
  ExternalLink,
  Code2,
  Sparkles,
  Monitor,
  Terminal,
  Play,
  X,
  CheckCircle2,
  RefreshCw,
  HelpCircle,
  Coffee,

} from "lucide-react";

// Helper function to create element with custom props
const createElement = (type, props = {}, ...children) => {
  return React.createElement(type, props, ...children);
};

// Enhanced terminal text scramble effect
const TextScramble = ({ text }) => {
  const [displayText, setDisplayText] = useState(text);
  const chars = "!<>-_\\/[]{}—=+*^?#_$%&";
  const ref = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let iteration = 0;
    let originalText = text;

    clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      setDisplayText(prevText => {
        return originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");
      });

      if (iteration >= originalText.length) {
        clearInterval(intervalRef.current);
      }

      iteration += 1 / 3;
    }, 30);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  return createElement("span", { ref }, displayText);
};

// Cursor blink component for terminal effect
const BlinkingCursor = () => {
  return createElement("span", {
    className: "inline-block w-2 h-4 bg-primary ml-1",
    style: {
      animation: "blink 1s step-end infinite"
    }
  });
};

// Main component
const AlternativeHeroSection = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [terminalCommand, setTerminalCommand] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [terminalHistory, setTerminalHistory] = useState([]);
  const [currentTab, setCurrentTab] = useState("terminal");
  const [userInput, setUserInput] = useState("");
  const [allowUserInput, setAllowUserInput] = useState(false);
  const [showCoffeeBreak, setShowCoffeeBreak] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [suggestionsVisible, setSuggestionsVisible] = useState(false);
  const [tabPressCount, setTabPressCount] = useState(0);
  const inputRef = useRef(null);
  const terminalRef = useRef(null);
  const heroRef = useRef(null);

  // Available terminal commands
  const availableCommands = [
    "help",
    "clear",
    "projects",
    "skills",
    "about",
    "contact",
    "github",
    "coffee",
    "portfolio",
    "personal",
    "professional",
    "programming",
    "profile"
  ];

  const commands = {
    help: () => ({
      type: "response",
      content: `Available commands:
- help: Show this help message
- clear: Clear terminal history
- projects: View my projects
- skills: List my skills
- about: About me
- contact: Contact information
- github: Visit my GitHub profile
- coffee: Take a coffee break
- portfolio: View portfolio details
- professional: View professional experience
- personal: View personal information`
    }),
    clear: () => {
      setTerminalHistory([]);
      return null;
    },
    skills: () => ({
      type: "response",
      content: `My technical skills:
- Frontend: React, Next.js, TypeScript, Tailwind CSS
- Backend: Node.js, Express, FastAPI, Django
- Database: PostgreSQL, MongoDB, Supabase
- DevOps: Docker, AWS, Vercel`
    }),
    about: () => ({
      type: "response",
      content: `Hi, I'm Bhavesh Gavali, a Full Stack Developer passionate about creating exceptional digital experiences. I specialize in React, TypeScript, and modern backend technologies with 1.5+ years of experience.`
    }),
    contact: () => ({
      type: "response",
      content: `Email: bhaveshgavali2022@gmail.com
LinkedIn: https://www.linkedin.com/in/bhaveshgavali/
Twitter: @Bhavesh_2424_`
    }),
    github: () => {
      window.open("https://github.com/BhaveshG-22", "_blank");
      return {
        type: "response",
        content: "Opening GitHub profile..."
      };
    },
    coffee: () => {
      setShowCoffeeBreak(true);
      setTimeout(() => setShowCoffeeBreak(false), 5000);
      return {
        type: "response",
        content: "☕ Taking a short coffee break... ☕"
      };
    },
    portfolio: () => ({
      type: "response",
      content: `My portfolio highlights:
- 1.5+ years of development experience
- 4+ strong showcased projects delivered
- Scaled Gigzy.ca with 20+ live users
- Implemented CI/CD & real-time logging in Shipyard`
    }),
    professional: () => ({
      type: "response",
      content: `Professional Experience:
- Full Stack Developer Intern at Tutormates (Feb 2024 – Jun 2024)
- Personal Projects & Learning (2023-Present)
- Focus on React, TypeScript, and Node.js development`
    }),
    personal: () => ({
      type: "response",
      content: `A bit about me:
Passionate about building innovative web solutions and continuously learning new technologies. Currently exploring modern web development patterns and best practices.`
    }),
    projects: () => ({
      type: "response",
      content: `Featured Projects:
- Shipyard: CI/CD platform with real-time logging
- Gigzy: Local service marketplace (20+ live users)
- AI Trade Agent: Crypto arbitrage bot
- Personal Portfolio: This interactive terminal site`
    }),
    programming: () => ({
      type: "response",
      content: `Programming Languages & Technologies:
- JavaScript (Proficient)
- TypeScript (Proficient)
- Node.js (Proficient)
- SQL (Intermediate)
- React & Next.js (Proficient)`
    }),
    profile: () => ({
      type: "response",
      content: `Professional Profile:
Full Stack Developer with 1.5+ years of experience building scalable web applications. Passionate about creating efficient solutions, clean code, and delivering exceptional user experiences.`
    }),
    unknown: (cmd) => ({
      type: "response",
      content: `Command not found: ${cmd}. Type 'help' for available commands.`
    })
  };

  // Find matching command suggestions based on user input
  const findSuggestions = (input) => {
    const trimmedInput = input.trim().toLowerCase();
    if (!trimmedInput) return [];

    return availableCommands.filter(cmd =>
      cmd.toLowerCase().startsWith(trimmedInput)
    );
  };

  // Auto complete with tab key
  const handleTabCompletion = () => {
    const matchingSuggestions = findSuggestions(userInput);

    if (matchingSuggestions.length === 1) {
      // If only one suggestion, autocomplete it
      setUserInput(matchingSuggestions[0]);
      setSuggestionsVisible(false);
    } else if (matchingSuggestions.length > 1) {
      // If multiple suggestions
      setSuggestions(matchingSuggestions);
      setSuggestionsVisible(true);

      if (tabPressCount > 0 && matchingSuggestions.length > 0) {
        // Cycle through suggestions on repeated tab presses
        const currentIndex = tabPressCount % matchingSuggestions.length;
        setUserInput(matchingSuggestions[currentIndex]);
      }

      setTabPressCount(prev => prev + 1);
    }
  };

  // Process user input command
  const processCommand = (cmd) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    const commandFn = commands[trimmedCmd] || commands.unknown;

    // Reset tab press count and hide suggestions on command execution
    setTabPressCount(0);
    setSuggestionsVisible(false);

    // Add command to history
    setTerminalHistory(prev => [
      ...prev,
      {
        type: "command",
        content: cmd,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);

    // Process command and get response
    const response = commandFn(trimmedCmd);

    // If there's a response, add it to history after a slight delay for realism
    if (response) {
      setTimeout(() => {
        setTerminalHistory(prev => [...prev, { ...response, timestamp: new Date().toLocaleTimeString() }]);
      }, 300);
    }

    setUserInput("");
  };

  // Custom hooks for animations
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 300);

    const handleMouseMove = (e) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width;
        const y = (e.clientY - rect.top) / rect.height;
        setMousePosition({ x, y });
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Terminal animation sequence
  useEffect(() => {
    if (isLoaded) {
      const initialCommands = [
        { text: "npm install", delay: 800 },
        { text: "npx create-next-app@latest my-portfolio --typescript", delay: 2500 },
        { text: "cd my-portfolio", delay: 1000 },
        { text: "npm run dev -- --turbo", delay: 1500 }
      ];

      let totalDelay = 1000;

      initialCommands.forEach((cmd, index) => {
        // Start typing animation
        setTimeout(() => {
          setIsTyping(true);
          let i = 0;
          const typeInterval = setInterval(() => {
            if (i <= cmd.text.length) {
              setTerminalCommand(cmd.text.substring(0, i));
              i++;
            } else {
              clearInterval(typeInterval);
              setIsTyping(false);

              // Add command to history after completing typing
              setTimeout(() => {
                let response = "";
                if (cmd.text.includes("npm install")) {
                  response = "added 1252 packages in 12.5s";
                } else if (cmd.text.includes("create-next-app")) {
                  response = "✅ Creating a new Next.js app in my-portfolio";
                } else if (cmd.text.includes("npm run dev")) {
                  response = "ready - started server on 0.0.0.0:3000";
                } else if (cmd.text.includes("git commit")) {
                  response = "[main (root-commit) 8f23a21] Initial commit";
                } else if (cmd.text.includes("git push")) {
                  response = "Everything up-to-date";
                }

                setTerminalHistory(prev => [
                  ...prev,
                  {
                    type: "command",
                    content: cmd.text,
                    timestamp: new Date().toLocaleTimeString()
                  },
                  {
                    type: "response",
                    content: response,
                    timestamp: new Date().toLocaleTimeString()
                  }
                ]);
                setTerminalCommand("");

                // Enable user input after initial animation sequence
                if (index === initialCommands.length - 1) {
                  setTimeout(() => {
                    setTerminalHistory(prev => [
                      ...prev,
                      {
                        type: "response",
                        content: "Type 'help' to see available commands.",
                        timestamp: new Date().toLocaleTimeString()
                      }
                    ]);
                    setAllowUserInput(true);
                    if (inputRef.current) {
                      inputRef.current.focus();
                    }
                  }, 1000);
                }
              }, 300);
            }
          }, 20);
        }, totalDelay);

        totalDelay += cmd.delay + cmd.text.length * 20 + 600;
      });
    }
  }, [isLoaded]);

  // Update suggestions when user input changes
  useEffect(() => {
    const matchingSuggestions = findSuggestions(userInput);
    setSuggestions(matchingSuggestions);

    // Hide suggestions if no input or no matches
    if (!userInput || matchingSuggestions.length === 0) {
      setSuggestionsVisible(false);
    }

    // Reset tab press count when input changes manually (not via tab)
    setTabPressCount(0);
  }, [userInput]);

  // Auto-scroll to bottom when terminal content changes
  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [terminalHistory, userInput]);

  // 3D tilt effect styles based on mouse position
  const getTiltStyle = () => {
    const maxTilt = 6; // max tilt in degrees

    return {
      transform: `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * -maxTilt}deg) rotateY(${(mousePosition.x - 0.5) * maxTilt}deg) scale3d(1.03, 1.03, 1.03)`,
      transition: "transform 0.1s ease"
    };
  };

  // Handle key press in terminal
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      processCommand(userInput);
    } else if (e.key === 'Tab') {
      e.preventDefault(); // Prevent focus change
      handleTabCompletion();
    } else if (e.key === 'Escape') {
      // Hide suggestions on escape
      setSuggestionsVisible(false);
      setTabPressCount(0);
    } else {
      // If typing normally, hide suggestions temporarily
      setSuggestionsVisible(false);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setUserInput(suggestion);
    setSuggestionsVisible(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Custom CSS
  const styles = `
    @keyframes fadeUp {
      0% { opacity: 0; transform: translateY(20px); }
      100% { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes fadeIn {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    
    @keyframes floatSlow {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes pulse {
      0%, 100% { opacity: 0.7; }
      50% { opacity: 1; }
    }
    
    @keyframes gradientMove {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    
    @keyframes typewriter {
      from { width: 0; }
      to { width: 100%; }
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0; }
    }
    
    @keyframes scanline {
      0% {
        transform: translateY(-100%);
      }
      100% {
        transform: translateY(100%);
      }
    }
    
    @keyframes glitch {
      0% {
        clip: rect(0, 9999px, 2px, 0);
        transform: skew(0.65deg);
      }
      5% {
        clip: rect(0, 9999px, 42px, 0);
        transform: skew(0.4deg);
      }
      10% {
        clip: rect(0, 9999px, 10px, 0);
        transform: skew(0.25deg);
      }
      15% {
        clip: rect(0, 9999px, 28px, 0);
        transform: skew(0.65deg);
      }
      20% {
        clip: rect(0, 9999px, 16px, 0);
        transform: skew(0.15deg);
      }
      25% {
        clip: rect(0, 9999px, 5px, 0);
        transform: skew(0.55deg);
      }
      30% {
        clip: rect(0, 9999px, 16px, 0);
        transform: skew(0.85deg);
      }
      35% {
        clip: rect(0, 9999px, 25px, 0);
        transform: skew(0.35deg);
      }
      40% {
        clip: rect(0, 9999px, 18px, 0);
        transform: skew(0.45deg);
      }
      45% {
        clip: rect(0, 9999px, 12px, 0);
        transform: skew(0.65deg);
      }
      50% {
        clip: rect(0, 9999px, 2px, 0);
        transform: skew(0.25deg);
      }
      55% {
        clip: rect(0, 9999px, 12px, 0);
        transform: skew(0.65deg);
      }
      60% {
        clip: rect(0, 9999px, 16px, 0);
        transform: skew(0.25deg);
      }
      65% {
        clip: rect(0, 9999px, 38px, 0);
        transform: skew(0.75deg);
      }
      70% {
        clip: rect(0, 9999px, 9px, 0);
        transform: skew(0.35deg);
      }
      75% {
        clip: rect(0, 9999px, 23px, 0);
        transform: skew(0.05deg);
      }
      80% {
        clip: rect(0, 9999px, 13px, 0);
        transform: skew(0.45deg);
      }
      85% {
        clip: rect(0, 9999px, 36px, 0);
        transform: skew(0.2deg);
      }
      90% {
        clip: rect(0, 9999px, 6px, 0);
        transform: skew(0.65deg);
      }
      95% {
        clip: rect(0, 9999px, 42px, 0);
        transform: skew(0.15deg);
      }
      100% {
        clip: rect(0, 9999px, 2px, 0);
        transform: skew(0.65deg);
      }
    }
    
    @keyframes coffee-steam {
      0% { opacity: 0.8; transform: translateY(0) scale(1); }
      50% { opacity: 0.3; transform: translateY(-15px) scale(1.5); }
      100% { opacity: 0; transform: translateY(-30px) scale(2); }
    }
    
    .coffee-steam {
      position: absolute;
      top: -8px;
      left: 50%;
      height: 8px;
      width: 8px;
      border-radius: 50%;
      background-color: rgba(255, 255, 255, 0.7);
      animation: coffee-steam 2s infinite;
    }
    
    .steam-1 { left: 45%; animation-delay: 0.2s; }
    .steam-2 { left: 50%; animation-delay: 0.8s; }
    .steam-3 { left: 55%; animation-delay: 0.5s; }
    
    .noise-bg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
      opacity: 0.05;
      z-index: 1;
    }
    
    .glassmorphism {
      background: rgba(0, 0, 0, 0.8);
      backdrop-filter: blur(16px);
      border: 1px solid rgba(55, 65, 81, 0.3);
      box-shadow: 0 4px 30px rgba(0, 0, 0, 0.3);
    }
    
    .text-gradient {
      background-size: 200% auto;
      background-image: linear-gradient(to right, var(--primary) 0%, var(--accent) 50%, var(--primary) 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: gradientMove 4s linear infinite;
    }
    
    .code-typing {
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      border-right: 3px solid var(--primary);
      animation: typewriter 4s steps(40) infinite, blink 1s step-end infinite;
    }
    
    .grid-bg {
      background-size: 30px 30px;
      background-image: 
        linear-gradient(to right, rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
    }
    
    .scanline {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 10px;
      background: linear-gradient(to bottom, 
        rgba(255,255,255,0) 0%,
        rgba(0,255,196,0.2) 50%, 
        rgba(255,255,255,0) 100%);
      opacity: 0.15;
      animation: scanline 8s linear infinite;
      z-index: 2;
    }
    
    .crt-effect:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%);
      background-size: 100% 4px;
      pointer-events: none;
      z-index: 10;
      opacity: 0.12;
    }
    
    .terminal-wrapper:before {
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: radial-gradient(circle at center, transparent 50%, rgba(0,0,0,0.4) 100%);
      pointer-events: none;
      z-index: 1;
    }
    
    .glitch {
      position: relative;
    }
    
    .glitch:after {
      content: attr(data-text);
      position: absolute;
      left: 0;
      top: 0;
      color: #0fe;
      overflow: hidden;
      clip: rect(0, 900px, 0, 0);
      animation: glitch 2s infinite linear alternate-reverse;
      opacity: 0.8;
    }
    
    .terminal-tabs {
      display: flex;
      background: rgba(17, 24, 39, 0.8);
      border-bottom: 1px solid rgba(75, 85, 99, 0.5);
    }
    
    .terminal-tab {
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(209, 213, 219, 0.8);
      border-right: 1px solid rgba(75, 85, 99, 0.3);
      transition: all 0.2s ease;
    }
    
    .terminal-tab.active {
      background: rgba(0, 0, 0, 0.6);
      color: rgba(255, 255, 255, 0.95);
      border-bottom: 2px solid var(--primary);
      margin-bottom: -1px;
    }
    
    .terminal-tab:hover:not(.active) {
      background: rgba(31, 41, 55, 0.5);
    }
    
    .animate-delay-100 { animation-delay: 100ms; }
    .animate-delay-200 { animation-delay: 200ms; }
    .animate-delay-300 { animation-delay: 300ms; }
    .animate-delay-400 { animation-delay: 400ms; }
    .animate-delay-500 { animation-delay: 500ms; }
    
    .suggestions-list {
      position: absolute;
      background: rgba(0, 0, 0, 0.95);
      border: 1px solid rgba(75, 85, 99, 0.5);
      border-radius: 4px;
      padding: 0.25rem 0;
      z-index: 50;
      max-height: 200px;
      overflow-y: auto;
      width: auto;
      min-width: 150px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
      margin-top: 4px;
      left: 220px;
    }
    
    .suggestion-item {
      padding: 0.25rem 1rem;
      cursor: pointer;
      white-space: nowrap;
    }
    
    .suggestion-item:hover, .suggestion-item.active {
      background: rgba(59, 130, 246, 0.3);
    }
    
    .suggestion-hint {
      position: absolute;
      top: 100%;
      left: 0;
      padding-top: 4px;
      font-size: 0.75rem;
      color: rgba(156, 163, 175, 0.8);
    }
  `;

  // CSS variables for dynamic styling
  const cssVars = {
    "--mouse-x": mousePosition.x,
    "--mouse-y": mousePosition.y,
  };

  // Create terminal with enhanced appearance
  const createTerminal = () => {
    return createElement("div", {
      key: "terminal-3d",
      className: "glassmorphism relative rounded-md overflow-hidden w-full h-full crt-effect terminal-wrapper",
      style: getTiltStyle()
    }, [
      // Glow effect that follows cursor
      createElement("div", {
        key: "glow",
        className: "absolute pointer-events-none",
        style: {
          background: "radial-gradient(circle at center, rgba(var(--primary-rgb), 0.4) 0%, transparent 70%)",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          left: `calc(${mousePosition.x * 100}% - 125px)`,
          top: `calc(${mousePosition.y * 100}% - 125px)`,
          opacity: 0.3,
          filter: "blur(30px)",
          transition: "left 0.2s, top 0.2s",
          mixBlendMode: "screen",
          zIndex: 2
        }
      }),

      // Scanline effect
      createElement("div", {
        key: "scanline",
        className: "scanline"
      }),

      // Terminal tabs
      createElement("div", {
        key: "terminal-tabs",
        className: "terminal-tabs"
      }, [
        createElement("div", {
          key: "tab-terminal",
          className: `terminal-tab ${currentTab === "terminal" ? "active" : ""}`,
          onClick: () => setCurrentTab("terminal")
        }, [
          createElement(Terminal, { key: "icon", className: "w-3.5 h-3.5" }),
          "Terminal"
        ]),
        createElement("div", {
          key: "tab-output",
          className: `terminal-tab ${currentTab === "output" ? "active" : ""}`,
          onClick: () => setCurrentTab("output")
        }, [
          createElement(Play, { key: "icon", className: "w-3.5 h-3.5" }),
          "Output"
        ])
      ]),

      // Terminal header
      createElement("div", {
        key: "terminal-header",
        className: "bg-black/90 p-2 flex items-center justify-between"
      }, [
        createElement("div", {
          key: "dots",
          className: "flex gap-1.5"
        }, [
          createElement("div", {
            key: "dot-1",
            className: "w-3 h-3 rounded-full bg-red-500 relative group cursor-pointer transition-all hover:brightness-110",
            title: "Close",
            onClick: () => commands.clear()
          }, [
            createElement(X, {
              key: "icon",
              className: "w-2 h-2 absolute inset-0 m-auto text-red-900 opacity-0 group-hover:opacity-100 transition-opacity"
            })
          ]),
          createElement("div", {
            key: "dot-2",
            className: "w-3 h-3 rounded-full bg-yellow-500 relative group cursor-pointer transition-all hover:brightness-110",
            title: "Minimize"
          }, [
            createElement("div", {
              key: "icon",
              className: "w-1.5 h-0.5 bg-yellow-900 absolute inset-0 m-auto opacity-0 group-hover:opacity-100 transition-opacity"
            })
          ]),
          createElement("div", {
            key: "dot-3",
            className: "w-3 h-3 rounded-full bg-green-500 relative group cursor-pointer transition-all hover:brightness-110",
            title: "Expand",
            onClick: () => {
              setCurrentTab(prev => prev === "terminal" ? "output" : "terminal");
            }
          }, [
            createElement(CheckCircle2, {
              key: "icon",
              className: "w-2 h-2 absolute inset-0 m-auto text-green-900 opacity-0 group-hover:opacity-100 transition-opacity"
            })
          ])
        ]),
        createElement("div", {
          key: "title",
          className: "absolute left-1/2 transform -translate-x-1/2 text-xs text-gray-400 font-mono tracking-wide",
          "data-text": "~/portfolio",
          style: {
            textShadow: "0 0 2px rgba(0,255,196,0.4), 0 0 4px rgba(0,255,196,0.2)"
          }
        }, "~/portfolio"),
        createElement("div", {
          key: "terminal-date",
          className: "text-xs text-gray-500 font-mono"
        }, new Date().toLocaleTimeString())
      ]),

      // Terminal body
      createElement("div", {
        key: "terminal-body",
        ref: terminalRef,
        className: "bg-black/90 p-4 font-mono text-sm h-[calc(100%-78px)] overflow-auto no-scrollbar relative"
      }, [
        // Coffee break overlay
        showCoffeeBreak && createElement("div", {
          key: "coffee-break",
          className: "absolute inset-0 flex flex-col items-center justify-center bg-black/85 z-20 animate-fade-in"
        }, [
          createElement("div", {
            key: "coffee-container",
            className: "relative"
          }, [
            createElement("div", { key: "steam-1", className: "coffee-steam steam-1" }),
            createElement("div", { key: "steam-2", className: "coffee-steam steam-2" }),
            createElement("div", { key: "steam-3", className: "coffee-steam steam-3" }),
            createElement(Coffee, {
              key: "coffee-icon",
              className: "w-16 h-16 text-primary animate-pulse"
            })
          ]),
          createElement("p", {
            key: "coffee-text",
            className: "mt-4 text-center text-white"
          }, "Taking a coffee break...")
        ]),

        // Conditional content based on selected tab
        currentTab === "terminal" ? [
          // Terminal welcome message
          createElement("div", {
            key: "welcome",
            className: `mb-4 text-gray-400 ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`
          }, [
            createElement("div", {
              key: "system-info",
              className: "mb-2 flex flex-col space-y-0.5"
            }, [
              createElement("span", {
                key: "line-0",
                className: "text-green-400 text-base glitch",
                "data-text": "Welcome to DevTerminal v3.5.0"
              }, "Welcome to DevTerminal v3.5.0"),
              createElement("span", {
                key: "line-1",
                className: "text-blue-400 flex items-center text-xs"
              }, [
                "OS: ",
                createElement("span", { key: "os", className: "ml-1 text-gray-300" }, "NextOS v14.0.1")
              ]),
              createElement("span", {
                key: "line-2",
                className: "text-blue-400 flex items-center text-xs"
              }, [
                "NODE: ",
                createElement("span", { key: "node", className: "ml-1 text-gray-300" }, "v18.17.0")
              ]),
              createElement("span", {
                key: "line-3",
                className: "text-blue-400 flex items-center text-xs"
              }, [
                "USER: ",
                createElement("span", { key: "user", className: "ml-1 text-gray-300" }, "developer@portfolio")
              ])
            ]),
            createElement("div", {
              key: "divider",
              className: "w-full my-2 border-t border-gray-800 opacity-50"
            }),
            createElement("span", {
              key: "motivation",
              className: "block mb-1 text-green-400 opacity-80"
            }, "// Crafting digital experiences with clean code")
          ]),

          // Terminal history (commands and responses)
          ...terminalHistory.map((item, index) => {
            if (item.type === "command") {
              return createElement("div", {
                key: `history-cmd-${index}`,
                className: "flex mb-1 text-gray-300"
              }, [
                createElement("span", { key: "prompt", className: "text-green-400 mr-2" }, "➜"),
                createElement("span", { key: "path", className: "text-blue-400 mr-2" }, "~/portfolio"),
                createElement("span", { key: "command", className: "text-gray-300" }, item.content)
              ]);
            } else {
              return createElement("div", {
                key: `history-resp-${index}`,
                className: "pl-10 mb-2 text-gray-400 text-xs font-light whitespace-pre-wrap"
              }, item.content);
            }
          }),

          // Current command line
          createElement("div", {
            key: "current-command",
            className: "flex items-start relative"
          }, [
            createElement("span", { key: "prompt", className: "text-green-400 mr-2" }, "➜"),
            createElement("span", { key: "path", className: "text-blue-400 mr-2" }, "~/portfolio"),

            allowUserInput ?
              createElement("div", {
                key: "user-input-container",
                className: "flex-grow text-gray-300 focus-within:outline-none relative"
              }, [
                createElement("input", {
                  key: "user-input",
                  type: "text",
                  ref: inputRef,
                  value: userInput,
                  onChange: (e) => setUserInput(e.target.value),
                  onKeyDown: handleKeyPress,
                  className: "bg-transparent border-none outline-none text-gray-300 w-full",
                  placeholder: "Type a command... (press Tab for completion)",
                  autoComplete: "off",
                  autoCorrect: "off",
                  autoCapitalize: "off",
                  spellCheck: "false"
                }),

                // Tab completion suggestion hint
                userInput && !suggestionsVisible && suggestions.length > 0 && createElement("div", {
                  key: "completion-hint",
                  className: "suggestion-hint"
                }, "Press TAB to autocomplete"),

                // Suggestions dropdown
                suggestionsVisible && suggestions.length > 0 && createElement("div", {
                  key: "suggestions-dropdown",
                  className: "suggestions-list"
                },
                  suggestions.map((suggestion, idx) => createElement("div", {
                    key: `suggestion-${idx}`,
                    className: `suggestion-item text-gray-300 ${idx === tabPressCount % suggestions.length ? "active bg-blue-800/30" : ""}`,
                    onClick: () => handleSuggestionClick(suggestion)
                  }, suggestion))
                )
              ]) :
              createElement(React.Fragment, { key: "animated-text" }, [
                createElement("span", { key: "command-text", className: "text-gray-300" }, terminalCommand),
                !isTyping && createElement(BlinkingCursor, { key: "cursor" })
              ])
          ])
        ] : [
          // Output tab content
          createElement("div", {
            key: "output-preview",
            className: "text-sm text-gray-300 bg-gray-900/50 p-4 rounded-md border border-gray-800/50"
          }, [
            createElement("div", {
              key: "preview-header",
              className: "mb-2 text-gray-300 border-b border-gray-700/50 pb-2 flex items-center"
            }, [
              createElement(Monitor, { key: "monitor-icon", className: "w-4 h-4 mr-2 text-primary" }),
              "Development Server"
            ]),
            createElement("div", {
              key: "output-content",
              className: "text-xs text-gray-400 font-mono space-y-1 opacity-0",
              style: { animation: "fadeIn 0.5s ease-out forwards" }
            }, [
              createElement("div", { key: "line-1", className: "text-blue-400" }, "ready - started server on 0.0.0.0:3000"),
              createElement("div", { key: "line-2" }, "event - compiled client and server successfully in 248 ms (17 modules)"),
              createElement("div", { key: "line-3", className: "text-green-500" }, "✓ Ready in 352ms")
            ]),
            createElement("div", {
              key: "preview-stats",
              className: "mt-4 grid grid-cols-2 gap-2 text-xs"
            }, [
              createElement("div", {
                key: "stat-1",
                className: "bg-gray-800/50 p-2 rounded-md flex flex-col"
              }, [
                createElement("span", { key: "label", className: "text-gray-500" }, "Build Time"),
                createElement("span", { key: "value", className: "text-white font-medium" }, "352ms")
              ]),
              createElement("div", {
                key: "stat-2",
                className: "bg-gray-800/50 p-2 rounded-md flex flex-col"
              }, [
                createElement("span", { key: "label", className: "text-gray-500" }, "Memory Usage"),
                createElement("span", { key: "value", className: "text-white font-medium" }, "124 MB")
              ]),
              createElement("div", {
                key: "stat-3",
                className: "bg-gray-800/50 p-2 rounded-md flex flex-col"
              }, [
                createElement("span", { key: "label", className: "text-gray-500" }, "Total Size"),
                createElement("span", { key: "value", className: "text-white font-medium" }, "4.2 MB")
              ]),
              createElement("div", {
                key: "stat-4",
                className: "bg-gray-800/50 p-2 rounded-md flex flex-col"
              }, [
                createElement("span", { key: "label", className: "text-gray-500" }, "Status"),
                createElement("span", { key: "value", className: "text-green-400 font-medium flex items-center" }, [
                  createElement(CheckCircle2, { key: "icon", className: "w-3 h-3 mr-1" }),
                  "Online"
                ])
              ])
            ]),
            // Quick actions for output tab
            createElement("div", {
              key: "quick-actions",
              className: "mt-4 flex justify-between items-center border-t border-gray-800 pt-3"
            }, [
              createElement("div", {
                key: "left-actions",
                className: "flex items-center gap-2"
              }, [
                createElement(Button, {
                  key: "refresh-btn",
                  size: "sm",
                  variant: "outline",
                  className: "h-8 flex gap-2 items-center text-xs bg-gray-800/60 hover:bg-gray-700/60",
                  onClick: () => {
                    setCurrentTab("terminal");
                    setTimeout(() => setCurrentTab("output"), 300);
                  }
                }, [
                  createElement(RefreshCw, { key: "icon", className: "w-3 h-3" }),
                  "Refresh"
                ])
              ]),
              createElement("div", {
                key: "right-actions",
                className: "text-xs text-gray-500"
              }, "Updated just now")
            ])
          ])
        ]
      ])
    ]);
  };

  // Create social links with hover effects
  const createSocialLinks = () => {
    const socialIcons = [
      { icon: Github, href: "https://github.com/BhaveshG-22", label: "GitHub" },
      { icon: Linkedin, href: "https://www.linkedin.com/in/bhaveshgavali/", label: "LinkedIn" },
      { icon: Twitter, href: "https://x.com/Bhavesh_2424_", label: "Twitter" }
    ];

    return createElement("div", {
      key: "social-links",
      className: `flex gap-4 ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-700 delay-700`
    },
      socialIcons.map((social, index) =>
        createElement("a", {
          key: `social-${index}`,
          href: social.href,
          target: "_blank",
          rel: "noopener noreferrer",
          className: "w-10 h-10 flex items-center justify-center rounded-full bg-black/30 backdrop-blur-sm border border-white/10 text-gray-300 hover:text-white hover:border-primary/50 transition-all hover:scale-110",
          "aria-label": social.label
        },
          createElement(social.icon, { className: "w-5 h-5" })
        )
      )
    );
  };

  // Build the complete component with React.createElement
  return createElement("div", {
    key: "hero-container",
    ref: heroRef,
    id: "hero",
    className: "relative min-h-screen flex items-center py-20 overflow-hidden",
    style: cssVars
  }, [
    // Background elements
    createElement("div", {
      key: "bg-gradient",
      className: "absolute inset-0 bg-gradient-to-br from-black to-gray-900 z-0"
    }),

    createElement("div", {
      key: "noise-overlay",
      className: "noise-bg"
    }),

    createElement("div", {
      key: "grid-overlay",
      className: "absolute inset-0 grid-bg z-0"
    }),

    // Glowing orbs
    createElement("div", {
      key: "orb-1",
      className: "absolute top-[10%] left-[20%] w-80 h-80 rounded-full bg-primary/20 filter blur-[100px] opacity-60 animate-floatSlow z-0"
    }),

    createElement("div", {
      key: "orb-2",
      className: "absolute bottom-[10%] right-[10%] w-96 h-96 rounded-full bg-accent/20 filter blur-[120px] opacity-50 animate-floatSlow z-0",
      style: { animationDelay: "2s" }
    }),

    // Main content wrapper
    createElement("div", {
      key: "content-wrapper",
      className: "container mx-auto px-4 relative z-10"
    }, [
      // Two column layout
      createElement("div", {
        key: "two-col-layout",
        className: "grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
      }, [
        // Left column (Text content)
        createElement("div", {
          key: "left-column",
          className: "space-y-8"
        }, [
          createElement("div", {
            key: "badge",
            className: `inline-flex items-center px-3 py-1 rounded-full border border-primary/20 bg-primary/5 text-primary text-sm ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500`,
            style: isLoaded ? { animation: "fadeUp 0.6s ease forwards" } : {}
          }, [
            createElement(Sparkles, { key: "icon", className: "w-3.5 h-3.5 mr-2" }),
            "Full-Stack Developer"
          ]),

          createElement("h1", {
            key: "heading",
            className: `text-4xl md:text-5xl lg:text-6xl font-bold leading-tight ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500 delay-100`,
            style: isLoaded ? { animation: "fadeUp 0.6s ease forwards", animationDelay: "100ms" } : {}
          }, [
            "Building ",
            createElement("span", { key: "gradient-text", className: "text-gradient" }, "exceptional"),
            createElement("br", { key: "br" }),
            "digital experiences"
          ]),

          createElement("p", {
            key: "description",
            className: `text-lg text-gray-300 max-w-xl ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500 delay-200`,
            style: isLoaded ? { animation: "fadeUp 0.6s ease forwards", animationDelay: "200ms" } : {}
          }, "I build full-stack web applications and automation tools using modern technologies. Specializing in high-performance systems, intuitive interfaces, and real-world problem solving."),

          createElement("div", {
            key: "buttons",
            className: `flex flex-wrap gap-4 ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-500 delay-300`,
            style: isLoaded ? { animation: "fadeUp 0.6s ease forwards", animationDelay: "300ms" } : {}
          }, [
            createElement(Button, {
              key: "primary-btn",
              asChild: true,
              size: "lg",
              className: "relative overflow-hidden group bg-gradient-to-r from-primary to-accent text-white font-medium hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            },
              createElement("a", {
                href: "/projects",
                className: "flex items-center"
              }, [
                createElement(Monitor, { key: "icon", className: "mr-2 h-4 w-4" }),
                "Explore Projects",
                createElement(ArrowRight, { key: "arrow", className: "ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" })
              ])
            ),

            createElement(Button, {
              key: "secondary-btn",
              variant: "outline",
              size: "lg",
              asChild: true,
              className: "border-gray-600 hover:border-white text-gray-200 hover:text-white transition-all duration-300"
            },
              createElement("a", {
                href: "#contact",
                className: "flex items-center"
              }, "Full Stack Developer ")
            )
          ]),

          // Social links
          createSocialLinks()
        ]),

        // Right column (Enhanced Terminal)
        createElement("div", {
          key: "right-column",
          className: `w-full h-[500px] ${isLoaded ? "opacity-100" : "opacity-0"} transition-all duration-700 delay-500`,
          style: isLoaded ? { animation: "fadeIn 0.8s ease forwards", animationDelay: "500ms" } : {}
        }, createTerminal())
      ])
    ]),

    // Helper floating button (help)
    createElement("div", {
      key: "helper",
      className: "absolute bottom-4 right-4 z-20 opacity-0 animation-delay-1000",
      style: isLoaded ? { animation: "fadeIn 0.8s ease forwards", animationDelay: "2000ms" } : {}
    },
      createElement(Button, {
        key: "helper-btn",
        size: "sm",
        variant: "outline",
        className: "rounded-full w-8 h-8 p-0 bg-black/40 border-white/20",
        onClick: () => {
          setCurrentTab("terminal");
          processCommand("help");
          if (inputRef.current) {
            inputRef.current.focus();
          }
        }
      },
        createElement(HelpCircle, { className: "w-4 h-4" })
      )
    ),

    // CSS styles
    createElement("style", {
      key: "custom-styles",
      dangerouslySetInnerHTML: { __html: styles }
    })
  ]);
};

export default AlternativeHeroSection;
