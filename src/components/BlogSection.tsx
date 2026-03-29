import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BookOpen, ChevronDown, ChevronUp, MapPin, Eye, Heart, MessageCircle } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  fullContent: string;
  location: string;
  readTime: string;
  views: number;
  likes: number;
  comments: number;
}

const blogPosts: BlogPost[] = [
  {
    id: 'living-root-bridges',
    title: 'The Living Root Bridges (Nongriat)',
    excerpt: 'These are not just bridges; they are masterpieces of "bio-engineering" by the Khasi tribes.',
    fullContent: 'These are not just bridges; they are masterpieces of "bio-engineering" by the Khasi tribes. Grown over decades from the roots of ancient rubber trees, the Double Decker Living Root Bridge is a testament to human patience. The trek down 3,500 steps is a rite of passage for any traveler, leading you into a lush jungle paradise that feels worlds away from modern life.',
    location: 'Nongriat, Meghalaya',
    readTime: '4 min',
    views: 12480,
    likes: 876,
    comments: 42,
  },
  {
    id: 'nohkalikai-falls',
    title: 'Nohkalikai Falls (Sohra)',
    excerpt: "India's tallest plunge waterfall leaps off a 1,115-foot cliff into a deep green pool.",
    fullContent: "As India's tallest plunge waterfall, Nohkalikai is a site of raw, dramatic power. It leaps off a 1,115-foot cliff into a deep green pool. Watching the mist dance around the falls while the sun catches the spray is a poetic experience that stays with you long after you've left the viewpoint.",
    location: 'Sohra, Meghalaya',
    readTime: '3 min',
    views: 9320,
    likes: 654,
    comments: 31,
  },
  {
    id: 'umngot-river-dawki',
    title: 'The Umngot River (Dawki)',
    excerpt: "Famous for having the clearest water in India, the Umngot River is like a sheet of liquid glass.",
    fullContent: "Famous for having the clearest water in India, the Umngot River is like a sheet of liquid glass. During the winter, the water is so transparent that boats appear to be floating in mid-air. A boat ride here offers a rare sense of clarity and peace as you glide over the smooth riverbed pebbles.",
    location: 'Dawki, Meghalaya',
    readTime: '3 min',
    views: 11050,
    likes: 793,
    comments: 38,
  },
  {
    id: 'laitlum-canyons',
    title: 'Laitlum Canyons',
    excerpt: 'Known as "The End of Hills," Laitlum offers some of the most vast and breathtaking views in the Northeast.',
    fullContent: 'Known as "The End of Hills," Laitlum offers some of the most vast and breathtaking views in the Northeast. Standing at the edge of these massive canyons, you can watch the clouds roll through the valleys below, revealing tiny tribal hamlets tucked into the green mountainside.',
    location: 'East Khasi Hills, Meghalaya',
    readTime: '3 min',
    views: 7840,
    likes: 521,
    comments: 27,
  },
  {
    id: 'krang-suri-falls',
    title: 'Krang Suri Falls (Jaintia Hills)',
    excerpt: 'Often described as a fairy-tale lagoon with shimmering, crystal-blue water.',
    fullContent: 'Krang Suri is often described as a fairy-tale lagoon. Known for its shimmering, crystal-blue water, this waterfall is a hidden gem in the Jaintia Hills. The path to the falls is paved with stone, offering a scenic walk before you reach the cool, inviting waters of the natural pool.',
    location: 'Jaintia Hills, Meghalaya',
    readTime: '3 min',
    views: 8670,
    likes: 612,
    comments: 29,
  },
  {
    id: 'wei-sawdong-falls',
    title: 'Wei Sawdong Falls',
    excerpt: 'This three-tiered waterfall is a masterpiece of nature — one of the most Instagrammable spots.',
    fullContent: 'This three-tiered waterfall is a masterpiece of nature. Reaching Wei Sawdong requires a bit of a scramble down bamboo ladders, but the reward is a view of three perfectly aligned cascades falling into turquoise basins. It is widely considered one of the most beautiful and "Instagrammable" spots in the state.',
    location: 'East Khasi Hills, Meghalaya',
    readTime: '4 min',
    views: 6920,
    likes: 489,
    comments: 22,
  },
  {
    id: 'mawlynnong-village',
    title: 'Mawlynnong Village',
    excerpt: "Awarded 'Asia's Cleanest Village,' a lesson in community and sustainability.",
    fullContent: "Awarded the title of \"Asia's Cleanest Village,\" Mawlynnong is a lesson in community and sustainability. The village is filled with colorful orchids, bamboo dustbins, and stone-paved paths. It's a quiet, peaceful place that proves how beautiful life can be when lived in harmony with the environment.",
    location: 'East Khasi Hills, Meghalaya',
    readTime: '3 min',
    views: 10230,
    likes: 734,
    comments: 35,
  },
  {
    id: 'umiam-lake',
    title: 'Umiam Lake (Barapani)',
    excerpt: 'A massive, serene reservoir surrounded by pine-covered hills. Perfect for sunset views.',
    fullContent: 'Often the first major site you see when driving toward Shillong, Umiam Lake is a massive, serene reservoir surrounded by pine-covered hills. It is a perfect spot for sunset views, kayaking, or simply having a picnic by the shore to transition into the "mountain mood."',
    location: 'Ri-Bhoi, Meghalaya',
    readTime: '3 min',
    views: 5680,
    likes: 398,
    comments: 19,
  },
  {
    id: 'mawsmai-cave',
    title: 'Mawsmai Cave',
    excerpt: 'This limestone cave is filled with ancient stalactites and stalagmites.',
    fullContent: 'For those who love mystery, Mawsmai Cave offers a thrilling look into the world beneath the hills. This limestone cave is filled with ancient stalactites and stalagmites. Some sections require a bit of a squeeze, making you feel like a prehistoric explorer navigating a natural labyrinth.',
    location: 'Sohra, Meghalaya',
    readTime: '3 min',
    views: 7120,
    likes: 467,
    comments: 24,
  },
  {
    id: 'elephant-falls',
    title: 'Elephant Falls',
    excerpt: 'A beautiful three-step waterfall just outside Shillong. Highly accessible.',
    fullContent: 'Located just outside Shillong, Elephant Falls is a beautiful three-step waterfall. It is highly accessible and perfect for a quick nature break. Each level offers a unique view of the water as it fans out over the dark rocks, surrounded by ferns and moss.',
    location: 'Shillong, Meghalaya',
    readTime: '2 min',
    views: 8940,
    likes: 583,
    comments: 28,
  },
  {
    id: 'garden-of-caves',
    title: 'Garden of Caves',
    excerpt: "A hidden wonderland near Sohra — seven small caves and multiple waterfalls.",
    fullContent: "A hidden wonderland near Sohra, the Garden of Caves features seven small caves and multiple waterfalls tucked into a lush valley. With natural rock formations like the \"King's Throne\" and soft golden light filtering through the trees, it feels like stepping into a secret, ancient garden.",
    location: 'Sohra, Meghalaya',
    readTime: '3 min',
    views: 4560,
    likes: 312,
    comments: 16,
  },
  {
    id: 'mawphlang-sacred-forest',
    title: 'Mawphlang Sacred Forest',
    excerpt: 'For over 800 years, not a single leaf has been allowed to be removed from this grove.',
    fullContent: 'This forest is a spiritual heart for the Khasi people. For over 800 years, not a single leaf or stone has been allowed to be removed from this grove. Walking through Mawphlang with a local guide reveals ancient ritual monoliths and rare medicinal plants, all preserved by a deep-rooted cultural belief.',
    location: 'East Khasi Hills, Meghalaya',
    readTime: '4 min',
    views: 6340,
    likes: 445,
    comments: 21,
  },
  {
    id: 'tyrshi-falls',
    title: 'Tyrshi Falls',
    excerpt: 'A broad, powerful cascade in Jaintia Hills with a panoramic arch bridge.',
    fullContent: 'Found in the Jaintia Hills, Tyrshi Falls is a broad, powerful cascade. A beautiful arch bridge spans the valley nearby, providing a panoramic view of the vast green paddy fields below. It is a peaceful alternative to the more crowded falls in the Khasi Hills.',
    location: 'Jaintia Hills, Meghalaya',
    readTime: '3 min',
    views: 3890,
    likes: 278,
    comments: 14,
  },
  {
    id: 'nokrek-biosphere',
    title: 'Nokrek Biosphere Reserve',
    excerpt: 'Home of the rare Red Panda — raw, untamed nature at its best.',
    fullContent: 'Located in the Garo Hills, Nokrek is a biodiversity hotspot and the home of the rare Red Panda. This is raw, untamed nature at its best. It offers a denser, wilder jungle experience and is a must for wildlife enthusiasts looking to explore the lesser-known parts of Meghalaya.',
    location: 'Garo Hills, Meghalaya',
    readTime: '4 min',
    views: 5210,
    likes: 367,
    comments: 18,
  },
  // Travel Guide Articles
  {
    id: 'best-time-meghalaya',
    title: 'Best Time to Visit Meghalaya',
    excerpt: 'October to May for clear skies, June–September for monsoon magic. Here\'s your season-by-season guide.',
    fullContent: 'October to March is the peak tourist season with clear skies, comfortable temperatures (10–22°C), and perfect trekking weather. April and May bring spring blooms but warmer days. June to September is monsoon season — Cherrapunji and Mawsynram receive record rainfall, waterfalls are at their most spectacular, but some roads may be slippery. The shoulder months of September–October offer the best of both: lush green landscapes without heavy rain.',
    location: 'Meghalaya, India',
    readTime: '5 min',
    views: 18420,
    likes: 1243,
    comments: 67,
  },
  {
    id: 'how-to-reach-shillong',
    title: 'How to Reach Shillong from Guwahati',
    excerpt: 'By air, train, or road — the complete transport guide to getting to Shillong.',
    fullContent: 'The nearest airport is Lokpriya Gopinath Bordoloi International Airport in Guwahati (GAU), 100 km from Shillong (2.5 hours by road via NH6). Shared taxis (Sumo/Innova) depart every 30 minutes from ISBT Guwahati for ₹400–600 per person. Private taxis cost ₹2,500–3,500. The scenic drive passes through Ri-Bhoi district\'s pine forests and Umiam Lake (Barapani). Shillong also has a small airport at Umroi (SHL) with limited flights. Guwahati Railway Station is the major railhead, well-connected to Delhi, Kolkata, and Mumbai.',
    location: 'Guwahati to Shillong',
    readTime: '4 min',
    views: 22150,
    likes: 1567,
    comments: 89,
  },
  {
    id: 'meghalaya-monsoon-guide',
    title: 'Meghalaya Monsoon Travel Guide',
    excerpt: 'Why the wettest place on Earth is actually magical during monsoon — if you\'re prepared.',
    fullContent: 'Meghalaya receives some of the highest rainfall on Earth, especially in Cherrapunji (Sohra) and Mawsynram. During June–September, waterfalls roar at full force, rivers swell to emerald green, and the landscape transforms into a living painting. Pack waterproof bags, quick-dry clothing, and sturdy trekking shoes with grip. Roads can be slippery and landslides occasionally block routes — always check conditions before heading to remote areas. The upside: far fewer tourists, lower hotel rates, and an authentically raw Meghalaya experience.',
    location: 'Meghalaya, India',
    readTime: '5 min',
    views: 14680,
    likes: 987,
    comments: 54,
  },
  {
    id: 'living-root-bridge-treks',
    title: 'Top 5 Living Root Bridge Treks in Meghalaya',
    excerpt: 'Beyond the famous Double Decker — five living root bridge treks for every fitness level.',
    fullContent: '1. Double Decker Living Root Bridge, Nongriat (3,500 steps, moderate–hard, 4–6 hours). The most famous, combining two bridges with natural swimming pools. 2. Ritymmen Root Bridge, Mawlynnong (easy, 30 min walk). A single-decker bridge near Asia\'s cleanest village. 3. Mawsaw Root Bridge, Riwai (moderate, 1.5 hours). Less crowded alternative with a stunning single bridge. 4. Wahthyllong Root Bridge, Rangthylliang (moderate, 2 hours). Remote and rarely visited. 5. Nongthymmai Living Root Bridge, Pynursla (easy–moderate, 1 hour). Growing newer bridge showing the tradition continues.',
    location: 'Meghalaya, India',
    readTime: '6 min',
    views: 16340,
    likes: 1120,
    comments: 72,
  },
  {
    id: 'solo-female-northeast',
    title: 'Solo Female Travel Guide: Northeast India',
    excerpt: 'Is Northeast India safe for solo women? Yes — here\'s everything you need to know.',
    fullContent: 'Northeast India is widely considered one of the safest regions in India for solo female travellers. Meghalaya is a matrilineal society where women hold property rights and family lineage passes through the mother. Shillong is a laid-back, well-policed city with a vibrant café culture. Tips: stick to well-reviewed hostels like XTSY that offer female-only dorms with 24/7 security; carry a local SIM card (Jio/Airtel work well); dress comfortably but modestly in tribal villages; and always inform your hostel about your travel plans. The warmth and respect you\'ll experience from Khasi, Garo, and Jaintia communities will make this one of your most memorable trips.',
    location: 'Northeast India',
    readTime: '7 min',
    views: 19870,
    likes: 1456,
    comments: 93,
  },
  {
    id: 'shillong-nightlife-cafes',
    title: 'Shillong Nightlife & Café Culture',
    excerpt: 'From rock music to artisan coffee — Shillong is the cultural capital of Northeast India.',
    fullContent: 'Known as the "Rock Capital of India," Shillong has a thriving live music scene with venues like Cloud 9 and Café Shillong hosting bands every weekend. Police Bazaar is the commercial heart — wander the lanes for street food (jadoh, tungrymbai) and local shopping. For coffee lovers, Café Heritage, Dylan\'s Café, and ML 05 Café serve excellent brews with mountain views. The city comes alive after 6 PM with locals and travellers mixing over momos, chai, and music. Unlike other Indian cities, Shillong feels distinctly different — the cool climate, colonial architecture, and Western-influenced culture create a unique vibe.',
    location: 'Shillong, Meghalaya',
    readTime: '5 min',
    views: 11230,
    likes: 823,
    comments: 45,
  },
];

const formatCount = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return n.toString();
};

const BlogCard = ({ post }: { post: BlogPost }) => {
  const [expanded, setExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!liked) {
      setLikeCount(prev => prev + 1);
      setLiked(true);
    } else {
      setLikeCount(prev => prev - 1);
      setLiked(false);
    }
  };

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className="group cursor-pointer border border-border/50 rounded-xl p-5 hover:border-primary/30 transition-all duration-300 hover:shadow-md bg-card/50 backdrop-blur-sm"
    >
      {/* Header Row */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="w-3 h-3 text-primary" />
              {post.location}
            </span>
            <span className="text-xs text-muted-foreground">·</span>
            <span className="text-xs text-muted-foreground">{post.readTime} read</span>
          </div>
          <h3 className="font-bold text-foreground group-hover:text-primary transition-colors text-base leading-tight">
            {post.title}
          </h3>
        </div>
        <div className="flex-shrink-0 mt-1">
          {expanded ? (
            <ChevronUp className="w-4 h-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="w-4 h-4 text-muted-foreground" />
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center gap-4 mt-3">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Eye className="w-3.5 h-3.5" />
          {formatCount(post.views)}
        </span>
        <button
          onClick={handleLike}
          className={`inline-flex items-center gap-1 text-xs transition-colors ${liked ? 'text-red-500' : 'text-muted-foreground hover:text-red-400'}`}
        >
          <Heart className={`w-3.5 h-3.5 ${liked ? 'fill-current' : ''}`} />
          {formatCount(likeCount)}
        </button>
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MessageCircle className="w-3.5 h-3.5" />
          {post.comments}
        </span>
      </div>

      {/* Excerpt (always visible) */}
      {!expanded && (
        <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
          {post.excerpt}
        </p>
      )}

      {/* Expanded Content */}
      {expanded && (
        <div className="mt-4 pt-3 border-t border-border/40">
          <p className="text-sm text-foreground/85 leading-relaxed">
            {post.fullContent}
          </p>
        </div>
      )}
    </div>
  );
};

const BlogSection = () => {
  const [showAll, setShowAll] = useState(false);
  const visiblePosts = showAll ? blogPosts : blogPosts.slice(0, 6);

  return (
    <section className="pt-12 pb-16 px-4 bg-background" id="blog">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-10">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <BookOpen className="w-3 h-3 mr-1" />
            XTSY Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Discover Meghalaya
          </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
            {blogPosts.length} places and guides that make Meghalaya unlike anywhere else on Earth
          </p>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {visiblePosts.map((post) => (
            <BlogCard key={post.id} post={post} />
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
