import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ArrowRight, MapPin, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';

// Use real Meghalaya destination images from Supabase storage and existing assets
import dawkiImg from '@/assets/dawki-crystal-clear-authentic.jpg';
import doubleDeckerImg from '@/assets/double-decker-bridge-new.jpg';
import kremChympeImg from '@/assets/krem-chympe-cave-expedition.jpg';
import wariChoraImg from '@/assets/wari-chora-authentic.jpg';

const STORAGE_BASE = 'https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets';

const blogPosts = [
  {
    id: 'living-root-bridges',
    title: 'The Living Root Bridges (Nongriat)',
    excerpt: 'These are not just bridges; they are masterpieces of "bio-engineering" by the Khasi tribes. Grown over decades from the roots of ancient rubber trees.',
    image: doubleDeckerImg,
    location: 'Nongriat, Meghalaya',
    readTime: '4 min',
  },
  {
    id: 'nohkalikai-falls',
    title: 'Nohkalikai Falls (Sohra)',
    excerpt: "India's tallest plunge waterfall leaps off a 1,115-foot cliff into a deep green pool. Watching the mist dance around the falls is a poetic experience.",
    image: `${STORAGE_BASE}/Travel%20DOM/1/download%20(26).jpg`,
    location: 'Sohra, Meghalaya',
    readTime: '3 min',
  },
  {
    id: 'umngot-river-dawki',
    title: 'The Umngot River (Dawki)',
    excerpt: "Famous for having the clearest water in India, the Umngot River is like a sheet of liquid glass. Boats appear to be floating in mid-air.",
    image: dawkiImg,
    location: 'Dawki, Meghalaya',
    readTime: '3 min',
  },
  {
    id: 'laitlum-canyons',
    title: 'Laitlum Canyons',
    excerpt: 'Known as "The End of Hills," Laitlum offers some of the most vast and breathtaking views in the Northeast. Watch clouds roll through the valleys below.',
    image: wariChoraImg,
    location: 'East Khasi Hills, Meghalaya',
    readTime: '3 min',
  },
  {
    id: 'krang-suri-falls',
    title: 'Krang Suri Falls (Jaintia Hills)',
    excerpt: 'Often described as a fairy-tale lagoon. Known for its shimmering, crystal-blue water, this waterfall is a hidden gem in the Jaintia Hills.',
    image: `${STORAGE_BASE}/Travel%20DOM/1/download%20(26).jpg`,
    location: 'Jaintia Hills, Meghalaya',
    readTime: '3 min',
  },
  {
    id: 'wei-sawdong-falls',
    title: 'Wei Sawdong Falls',
    excerpt: 'This three-tiered waterfall is a masterpiece of nature. Three perfectly aligned cascades falling into turquoise basins — one of the most Instagrammable spots.',
    image: kremChympeImg,
    location: 'East Khasi Hills, Meghalaya',
    readTime: '4 min',
  },
  {
    id: 'mawlynnong-village',
    title: 'Mawlynnong Village',
    excerpt: "Awarded 'Asia\'s Cleanest Village,' Mawlynnong is a lesson in community and sustainability — filled with colorful orchids and bamboo dustbins.",
    image: dawkiImg,
    location: 'East Khasi Hills, Meghalaya',
    readTime: '3 min',
  },
  {
    id: 'umiam-lake',
    title: 'Umiam Lake (Barapani)',
    excerpt: 'A massive, serene reservoir surrounded by pine-covered hills. Perfect for sunset views, kayaking, or simply transitioning into the mountain mood.',
    image: wariChoraImg,
    location: 'Ri-Bhoi, Meghalaya',
    readTime: '3 min',
  },
  {
    id: 'mawsmai-cave',
    title: 'Mawsmai Cave',
    excerpt: 'This limestone cave is filled with ancient stalactites and stalagmites. Some sections require a squeeze, making you feel like a prehistoric explorer.',
    image: kremChympeImg,
    location: 'Sohra, Meghalaya',
    readTime: '3 min',
  },
  {
    id: 'elephant-falls',
    title: 'Elephant Falls',
    excerpt: 'A beautiful three-step waterfall just outside Shillong. Highly accessible and perfect for a quick nature break with ferns and moss.',
    image: doubleDeckerImg,
    location: 'Shillong, Meghalaya',
    readTime: '2 min',
  },
  {
    id: 'garden-of-caves',
    title: 'Garden of Caves',
    excerpt: "A hidden wonderland near Sohra — seven small caves and multiple waterfalls with natural rock formations like the 'King's Throne.'",
    image: `${STORAGE_BASE}/Travel%20DOM/1/download%20(26).jpg`,
    location: 'Sohra, Meghalaya',
    readTime: '3 min',
  },
  {
    id: 'mawphlang-sacred-forest',
    title: 'Mawphlang Sacred Forest',
    excerpt: 'For over 800 years, not a single leaf has been allowed to be removed. Ancient ritual monoliths and rare medicinal plants preserved by deep-rooted belief.',
    image: wariChoraImg,
    location: 'East Khasi Hills, Meghalaya',
    readTime: '4 min',
  },
  {
    id: 'tyrshi-falls',
    title: 'Tyrshi Falls',
    excerpt: 'A broad, powerful cascade in Jaintia Hills with a beautiful arch bridge providing panoramic views of vast green paddy fields below.',
    image: dawkiImg,
    location: 'Jaintia Hills, Meghalaya',
    readTime: '3 min',
  },
  {
    id: 'nokrek-biosphere',
    title: 'Nokrek Biosphere Reserve',
    excerpt: 'Home of the rare Red Panda, Nokrek is a biodiversity hotspot offering raw, untamed jungle — a must for wildlife enthusiasts.',
    image: kremChympeImg,
    location: 'Garo Hills, Meghalaya',
    readTime: '4 min',
  },
];

const BlogSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visiblePosts = showAll ? blogPosts : blogPosts.slice(0, 6);

  return (
    <section className="pt-12 pb-16 px-4 bg-background" id="blog">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <BookOpen className="w-3 h-3 mr-1" />
            XTSY Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Discover Meghalaya
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            14 places that make Meghalaya unlike anywhere else on Earth
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {visiblePosts.map((post) => (
            <Card
              key={post.id}
              className="group overflow-hidden border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg cursor-pointer"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
                <div className="absolute bottom-2 left-2">
                  <span className="inline-flex items-center gap-1 bg-background/90 backdrop-blur-sm text-foreground text-xs px-2 py-1 rounded-full">
                    <MapPin className="w-3 h-3 text-primary" />
                    {post.location}
                  </span>
                </div>
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{post.readTime} read</span>
                  <span className="text-xs text-primary font-semibold group-hover:underline inline-flex items-center gap-1">
                    Read More <ArrowRight className="w-3 h-3" />
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {!showAll && blogPosts.length > 6 && (
          <div className="text-center mt-8">
            <Button
              variant="outline"
              onClick={() => setShowAll(true)}
              className="border-primary/30 hover:border-primary hover:bg-primary/5"
            >
              Show All {blogPosts.length} Destinations
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogSection;
