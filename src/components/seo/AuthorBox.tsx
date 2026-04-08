import { MapPin, Star, Calendar } from 'lucide-react';

const AuthorBox = () => (
  <div className="mt-8 border border-border rounded-xl p-6 bg-card">
    <div className="flex items-start gap-4">
      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
        XT
      </div>
      <div>
        <p className="font-semibold text-foreground text-sm">Written by XTSY Travel Team</p>
        <p className="text-xs text-muted-foreground mt-0.5">Local travel experts based in Shillong, Meghalaya</p>
        <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Based in Shillong since 2019</span>
          <span className="flex items-center gap-1"><Star className="h-3 w-3" /> 4.8★ Google Rating (320+ reviews)</span>
          <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> 5,000+ guests hosted</span>
        </div>
        <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
          Our team lives and breathes Meghalaya travel. Every guide is written from first-hand experience exploring the region's waterfalls, caves, living root bridges, and hidden villages.
        </p>
      </div>
    </div>
  </div>
);

export default AuthorBox;
