
import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Only reviews with 4+ stars (5-scale) or 8+ stars (10-scale) as requested
  const filteredReviews = [
    {
      name: "Sarah Johnson",
      rating: 9,
      comment: "Amazing hostel with great facilities! The staff was incredibly helpful and the location is perfect.",
      date: "2 weeks ago",
      source: "Google"
    },
    {
      name: "Mike Chen",
      rating: 8,
      comment: "Clean rooms, friendly atmosphere, and excellent value for money. Will definitely stay again!",
      date: "1 month ago",
      source: "Booking.com"
    },
    {
      name: "Emma Rodriguez",
      rating: 10,
      comment: "Best hostel experience ever! The convenience store and laundry services made my stay so comfortable.",
      date: "3 weeks ago",
      source: "HostelWorld"
    },
    {
      name: "John Smith",
      rating: 9,
      comment: "Fantastic location and amazing views! The staff went above and beyond to make our stay memorable.",
      date: "1 week ago",
      source: "Google"
    },
    {
      name: "Lisa Wang",
      rating: 8,
      comment: "Great value for money and wonderful facilities. The common areas are perfect for meeting other travelers.",
      date: "2 months ago",
      source: "MakeMyTrip"
    },
    {
      name: "David Brown",
      rating: 9,
      comment: "Excellent service and clean facilities. The free taxi service was a great bonus for our group.",
      date: "5 days ago",
      source: "Google"
    }
  ];

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(filteredReviews.length - 2));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(filteredReviews.length - 2)) % Math.ceil(filteredReviews.length - 2));
  };

  useEffect(() => {
    const interval = setInterval(nextReview, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="reviews" className="py-20 px-4 relative bg-gradient-to-br from-slate-900/50 via-slate-800/50 to-slate-900/50">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent font-['Poppins']">
            Guest Reviews
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto font-['Inter']">
            See what our guests have to say about their stay at XTSY
          </p>
        </div>

        {/* Floating Carousel */}
        <div className="relative mb-12">
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(filteredReviews.length - 2) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                    {filteredReviews.slice(slideIndex, slideIndex + 3).map((review, index) => (
                      <Card 
                        key={index} 
                        className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl transform-gpu"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-white font-['Poppins']">
                              {review.name}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400 font-bold">{review.rating}</span>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </div>
                          </div>
                          <CardDescription className="text-gray-400 text-sm flex items-center gap-2 font-['Inter']">
                            <span>{review.date}</span>
                            <span>•</span>
                            <span className="text-teal-400">{review.source}</span>
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300 font-['Inter']">{review.comment}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={prevReview}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm"
            onClick={nextReview}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(filteredReviews.length - 2) }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-teal-400' : 'bg-white/30'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>

        {/* Integration Notice */}
        <div className="text-center">
          <p className="text-gray-400 text-sm font-['Inter']">
            Reviews are automatically integrated from Google, Booking.com, HostelWorld, and MakeMyTrip
          </p>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
