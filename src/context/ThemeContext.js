import React, { createContext, useState, useEffect, useContext, useCallback } from "react";

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme || "dark";
  });
  
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [ripplePosition, setRipplePosition] = useState({ x: 50, y: 50 });

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.body.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = useCallback((event) => {
    // Prevent multiple rapid toggles
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    
    // Calculate ripple position from click event if available
    if (event && event.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 100;
      const y = ((event.clientY - rect.top) / rect.height) * 100;
      setRipplePosition({ x, y });
      
      // Set CSS custom properties for ripple effect
      document.documentElement.style.setProperty('--ripple-x', `${(event.clientX / window.innerWidth) * 100}%`);
      document.documentElement.style.setProperty('--ripple-y', `${(event.clientY / window.innerHeight) * 100}%`);
    }
    
    // Add transition overlay
    const overlay = document.createElement('div');
    overlay.className = 'theme-transition-overlay active';
    document.body.appendChild(overlay);
    
    // Delay theme change slightly for smooth animation
    setTimeout(() => {
      setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
      
      // Remove overlay after transition
      setTimeout(() => {
        if (overlay.parentNode) {
          overlay.classList.remove('active');
          setTimeout(() => {
            if (overlay.parentNode) {
              overlay.parentNode.removeChild(overlay);
            }
          }, 600);
        }
        setIsTransitioning(false);
      }, 200);
    }, 100);
  }, [isTransitioning]);

  const createRipple = useCallback((event) => {
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    button.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    }, 600);
  }, []);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme, 
      isTransitioning, 
      ripplePosition,
      createRipple 
    }}>
      {children}
    </ThemeContext.Provider>
  );
};
