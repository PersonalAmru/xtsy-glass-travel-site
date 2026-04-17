import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { SEOHead } from "@/components/SEOHead";
import { Button } from "@/components/ui/button";
import { Home, MapPin } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <>
      <SEOHead
        title="Page Not Found (404) | XTSY Travel"
        description="The page you're looking for doesn't exist. Explore XTSY's hostels, tours and Meghalaya travel guides instead."
        canonicalUrl={`https://xtsy.one${location.pathname}`}
        noIndex
      />
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <div className="text-center max-w-md">
          <p className="text-7xl font-bold text-primary mb-2">404</p>
          <h1 className="text-2xl font-semibold text-foreground mb-3">
            We couldn't find that page
          </h1>
          <p className="text-muted-foreground mb-8">
            The page <code className="px-1 py-0.5 bg-muted rounded text-sm">{location.pathname}</code> doesn't exist or has been moved. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button asChild size="lg">
              <Link to="/" aria-label="Go to homepage">
                <Home className="mr-2 h-4 w-4" /> Homepage
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/tours" aria-label="Browse tours">
                <MapPin className="mr-2 h-4 w-4" /> Browse Tours
              </Link>
            </Button>
          </div>
          <nav aria-label="Popular pages" className="text-sm">
            <p className="text-muted-foreground mb-2">Or try these popular pages:</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2 justify-center">
              <li><Link to="/best-hostel-in-shillong" className="text-primary hover:underline">Best Hostel Shillong</Link></li>
              <li><Link to="/meghalaya-tour-packages" className="text-primary hover:underline">Meghalaya Tours</Link></li>
              <li><Link to="/things-to-do-in-meghalaya" className="text-primary hover:underline">Things to Do</Link></li>
              <li><Link to="/gallery" className="text-primary hover:underline">Gallery</Link></li>
              <li><Link to="/faq" className="text-primary hover:underline">FAQ</Link></li>
            </ul>
          </nav>
        </div>
      </main>
    </>
  );
};

export default NotFound;
