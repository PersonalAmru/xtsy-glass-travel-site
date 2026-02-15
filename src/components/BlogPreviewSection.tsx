import React from 'react';
import { ArrowRight, BookOpen, Calendar, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';

const blogPosts = [
  {
    slug: "living-root-bridges-meghalaya",
    title: "Living Root Bridges: Nature's 500-Year-Old Engineering",
    excerpt: "How Khasi tribes grew bridges from tree roots — and why you need to see them before overtourism hits.",
    category: "Meghalaya",
    readTime: "5 min",
    date: "Feb 2026",
    image: "https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/xtsy-gallery-assets/Travel%20DOM/1/download%20(26).jpg",
  },
  {
    slug: "solo-female-travel-northeast-india",
    title: "Solo Female Travel in Northeast India: The Honest Guide",
    excerpt: "Safety, culture shocks, packing tips, and why NE India is the most underrated solo destination.",
    category: "Solo Travel",
    readTime: "7 min",
    date: "Jan 2026",
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&auto=format&fit=crop&q=60",
  },
  {
    slug: "xtsy-270-glass-suite-experience",
    title: "We Slept in a Glass House at 5,000ft — Here's What Happened",
    excerpt: "A first-person account of the XTSY 270° panoramic glass suite. Stars, storms, and sunrise.",
    category: "Experience",
    readTime: "4 min",
    date: "Dec 2025",
    image: "https://images.unsplash.com/photo-1470770841497-7b3202f0f2a2?w=600&auto=format&fit=crop&q=60",
  },
];

const BlogPreviewSection = () => {
  return (
    <section className="py-10 px-4 bg-background" id="blog">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Badge className="mb-3 bg-accent text-accent-foreground border-border/30">
            <BookOpen className="w-3 h-3 mr-1" />
            Stories & Guides
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-foreground">
            From the Field
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Real stories, honest guides, and insider tips from Northeast India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {blogPosts.map((post) => (
            <Card
              key={post.slug}
              className="group overflow-hidden border-border/40 hover:border-primary/30 transition-colors cursor-pointer"
            >
              <div className="aspect-[16/10] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-[10px] px-2 py-0">
                    {post.category}
                  </Badge>
                  <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {post.readTime}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-foreground line-clamp-2 mb-1.5 group-hover:text-primary transition-colors">
                  {post.title}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {post.excerpt}
                </p>
                <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-primary">
                  Read more
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreviewSection;
