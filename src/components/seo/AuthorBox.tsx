import { MapPin, Star, Calendar } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

const AUTHOR_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'XTSY Travel Team',
  url: 'https://xtsy.one',
  logo: 'https://xtsy.one/lovable-uploads/160f683c-a41c-41fd-8bdb-700d74a7e027.png',
  description: 'Local travel experts based in Shillong, Meghalaya. Specializing in Northeast India travel guides, hostel stays, and curated tour packages.',
  foundingDate: '2024',
  areaServed: { '@type': 'Place', name: 'Meghalaya, Northeast India' },
  knowsAbout: ['Meghalaya tourism', 'Shillong hostels', 'Living root bridges', 'Northeast India travel'],
  sameAs: [
    'https://www.instagram.com/xtsytravellershostel',
    'https://www.facebook.com/xtsytravellershostel',
  ],
};

const AuthorBox = () => (
  <>
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(AUTHOR_SCHEMA)}</script>
    </Helmet>
    <div className="mt-8 border border-border rounded-xl p-6 bg-card" itemScope itemType="https://schema.org/Organization">
      <div className="flex items-start gap-4">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xl flex-shrink-0">
          XT
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm" itemProp="name">Written by XTSY Travel Team</p>
          <p className="text-xs text-muted-foreground mt-0.5" itemProp="description">Local travel experts based in Shillong, Meghalaya</p>
          <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> Based in Shillong since 2024</span>
            <span className="flex items-center gap-1"><Star className="h-3 w-3" /> 4.8★ Google Rating (161 verified reviews)</span>
            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> 5,000+ guests hosted</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
            Our team lives and breathes Meghalaya travel. Every guide is written from first-hand experience exploring the region's waterfalls, caves, living root bridges, and hidden villages.
          </p>
          <meta itemProp="url" content="https://xtsy.one" />
        </div>
      </div>
    </div>
  </>
);

export default AuthorBox;
