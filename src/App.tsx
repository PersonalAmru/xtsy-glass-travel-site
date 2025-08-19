
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
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/gallery", label: "Gallery" },
    { to: "/deals", label: "Deals" },
    { to: "/xtsy-270", label: "XTSY 270°" },
    { to: "/faq", label: "FAQ" },
    { to: "/travel", label: "Travel" }
  ];

  return (
    <div className="dark min-h-screen bg-background">
      <PerformanceMonitor />
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Glassmorphism Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-white/20 shadow-lg">
          <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/784b2108-6432-4589-b79b-0433fa26bc3b.png" 
                  alt="XTSY Logo" 
                  className="h-10 w-auto object-contain" 
                  loading="eager" 
                />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                {navItems.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className="text-gray-700 hover:text-gray-900 transition-colors font-medium"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              {/* Right Side Actions */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Currency Selector */}
                <div className="flex items-center space-x-1 bg-gray-100 rounded-full px-3 py-1">
                  <span className="text-sm">🌐</span>
                  <span className="text-sm font-medium">$ USD</span>
                  <button className="text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Newsletter Button */}
                <button className="flex items-center space-x-1 text-green-600 hover:text-green-700 transition-colors">
                  <span className="text-sm">👤</span>
                  <span className="text-sm font-medium">Newsletter</span>
                </button>
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
              <div className="md:hidden py-4 bg-white/95 backdrop-blur-sm rounded-lg mt-2 border border-gray-200">
                <div className="flex flex-col space-y-2">
                  {navItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className="px-4 py-2 text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="px-4 py-2 border-t border-gray-200 mt-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Currency: $ USD</span>
                      <button className="text-green-600 text-sm">Newsletter</button>
                    </div>
                  </div>
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
