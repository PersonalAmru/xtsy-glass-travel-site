
import { useState, useEffect } from "react";
import { Star, Upload, Send, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const ReviewsSection = () => {
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewerName, setReviewerName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const existingReviews = [
    {
      name: "Sarah Johnson",
      rating: 9,
      comment: "Amazing hostel with great facilities! The staff was incredibly helpful and the location is perfect.",
      date: "2 weeks ago"
    },
    {
      name: "Mike Chen",
      rating: 8,
      comment: "Clean rooms, friendly atmosphere, and excellent value for money. Will definitely stay again!",
      date: "1 month ago"
    },
    {
      name: "Emma Rodriguez",
      rating: 10,
      comment: "Best hostel experience ever! The convenience store and laundry services made my stay so comfortable.",
      date: "3 weeks ago"
    },
    {
      name: "John Smith",
      rating: 9,
      comment: "Fantastic location and amazing views! The staff went above and beyond to make our stay memorable.",
      date: "1 week ago"
    },
    {
      name: "Lisa Wang",
      rating: 8,
      comment: "Great value for money and wonderful facilities. The common areas are perfect for meeting other travelers.",
      date: "2 months ago"
    }
  ];

  const nextReview = () => {
    setCurrentIndex((prev) => (prev + 1) % Math.ceil(existingReviews.length - 2));
  };

  const prevReview = () => {
    setCurrentIndex((prev) => (prev - 1 + Math.ceil(existingReviews.length - 2)) % Math.ceil(existingReviews.length - 2));
  };

  useEffect(() => {
    const interval = setInterval(nextReview, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleSubmitReview = () => {
    console.log("Review submitted:", { rating, reviewText, reviewerName });
    setRating(0);
    setReviewText("");
    setReviewerName("");
  };

  return (
    <section id="reviews" className="py-20 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 bg-gradient-to-r from-teal-400 to-blue-400 bg-clip-text text-transparent">
            Guest Reviews
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
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
              {Array.from({ length: Math.ceil(existingReviews.length - 2) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                    {existingReviews.slice(slideIndex, slideIndex + 3).map((review, index) => (
                      <Card 
                        key={index} 
                        className="backdrop-blur-xl bg-white/10 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                      >
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg font-semibold text-white">
                              {review.name}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400 font-bold">{review.rating}</span>
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            </div>
                          </div>
                          <CardDescription className="text-gray-400 text-sm">
                            {review.date}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-300">{review.comment}</p>
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
            {Array.from({ length: Math.ceil(existingReviews.length - 2) }).map((_, index) => (
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

        {/* Submit Review Button */}
        <div className="text-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold px-8 py-3 text-lg">
                Submit a Review
              </Button>
            </DialogTrigger>
            <DialogContent className="backdrop-blur-xl bg-slate-900/95 border border-white/20 text-white max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-center">Share Your Experience</DialogTitle>
                <DialogDescription className="text-gray-400 text-center">
                  We'd love to hear about your stay at XTSY!
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Name</label>
                  <Input
                    value={reviewerName}
                    onChange={(e) => setReviewerName(e.target.value)}
                    placeholder="Enter your name"
                    className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Rating (1-10)</label>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                      <button
                        key={star}
                        onClick={() => handleStarClick(star)}
                        onMouseEnter={() => setHoveredRating(star)}
                        onMouseLeave={() => setHoveredRating(0)}
                        className="transition-colors duration-150"
                      >
                        <Star
                          className={`h-6 w-6 ${
                            star <= (hoveredRating || rating)
                              ? "fill-yellow-400 text-yellow-400"
                              : "text-gray-400"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  <p className="text-sm text-gray-400 mt-1">Selected: {rating}/10</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Your Review</label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell us about your experience..."
                    rows={4}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder-gray-400 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Add Photos/Videos (Optional)</label>
                  <Button variant="outline" className="w-full border-white/20 text-gray-300 hover:bg-white/10">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Media
                  </Button>
                  <p className="text-xs text-gray-400 mt-1">Images and videos will be stored in Supabase</p>
                </div>

                <Button
                  onClick={handleSubmitReview}
                  disabled={!rating || !reviewText.trim() || !reviewerName.trim()}
                  className="w-full bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold py-3"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit Review
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </section>
  );
};

export default ReviewsSection;
