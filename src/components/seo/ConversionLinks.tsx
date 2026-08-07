import { Link } from '@/lib/router-compat';

const ConversionLinks = () => (
  <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/10">
    <p className="text-xs font-semibold text-foreground mb-2">🔗 Quick Links</p>
    <div className="flex flex-wrap gap-2">
      {[
        { to: '/book', label: '🏨 Book Your Stay' },
        { to: '/tours', label: '🗺️ Tour Packages' },
        { to: '/xtsy-270', label: '🏔️ XTSY 270° Glasshouse' },
        { to: '/tab-bistro', label: '🍴 TAB Bistro' },
      ].map(l => (
        <Link key={l.to} to={l.to} className="text-xs px-3 py-1.5 rounded-full bg-background border border-border text-primary hover:bg-primary/10 transition-colors">
          {l.label}
        </Link>
      ))}
    </div>
  </div>
);

export default ConversionLinks;
