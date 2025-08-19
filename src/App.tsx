
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Outlet, Link } from "react-router-dom";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Home, Building, Users, Phone, Calendar } from "lucide-react";
import LoadingScreen from "./components/LoadingScreen";
import PerformanceMonitor from "./components/PerformanceMonitor";
import Footer from "./components/Footer";
import { preloadCriticalResources, optimizeFontLoading, registerServiceWorker } from "./utils/bundleOptimization";

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Initialize performance optimizations
    preloadCriticalResources();
    optimizeFontLoading();
    registerServiceWorker();

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/rooms", label: "Rooms", icon: Building },
    { to: "/about", label: "About", icon: Users },
    { to: "/contact", label: "Contact", icon: Phone },
    { to: "/booking", label: "Book Now", icon: Calendar }
  ];

  return (
    <div className="dark min-h-screen bg-background">
      <PerformanceMonitor />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Glassmorphism Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-lg">
          <nav className="responsive-container">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center space-x-2">
                <img 
                  src="/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png" 
                  alt="XTSY Logo" 
                  className="h-20 w-20 sm:h-24 sm:w-24 object-contain" 
                  loading="eager" 
                />
                <span className="text-xl font-bold text-foreground">
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-6">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="flex items-center space-x-2 text-foreground/80 hover:text-foreground transition-colors"
                  >
                    <item.icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>

            {/* Mobile Navigation */}
            {isMobileMenuOpen && (
              <div className="md:hidden py-4 bg-card/95 backdrop-blur-sm rounded-lg mt-2 border border-border/50">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="flex items-center space-x-2 px-4 py-2 text-foreground/80 hover:text-foreground hover:bg-accent/50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </nav>
        </header>

        {/* Main Content */}
        <main className="pt-16">
          <Suspense fallback={<LoadingScreen />}>
            <Outlet />
          </Suspense>
        </main>

        {/* Footer */}
        <Footer />
      </TooltipProvider>
    </div>
  );
}

export default App;
