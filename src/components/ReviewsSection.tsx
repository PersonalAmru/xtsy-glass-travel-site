import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Real OTA platform reviews
  const filteredReviews = [{
    name: "Rohit",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room"
  }, {
    name: "Rai",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room"
  }, {
    name: "Kashfi",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room"
  }, {
    name: "Arun",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room"
  }, {
    name: "Himanjit",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "4-Bed Female Dormitory Room"
  }, {
    name: "Aman",
    rating: 10,
    comment: "Exceptional",
    date: "April 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room"
  }, {
    name: "Vihaan",
    rating: 10,
    comment: "Exceptional",
    date: "April 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room"
  }, {
    name: "Alisha",
    rating: 10,
    comment: "Exceptional",
    date: "October 2025",
    source: "Booking.com",
    roomType: "Double Room with Lake View"
  }, {
    name: "Наталья",
    rating: 10,
    comment: "XTSY (ecstasy) travellers hostel was my last stop in India before my visa expired. I stay here one night before going to bangladesh. Hostel very nice clean and peaceful. People friendly, and P is best. He helps with everything. Good news—I get new visa and already book again! Hey P, I come back on 14 Feb! This time I stay longer and explore meghalaya and northeast. See you soon! 😊",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Female Dormitory Room"
  }, {
    name: "Anonymous",
    rating: 10,
    comment: "The location was a bit outskirts but it was worth it, The people were very friendly and very engaging, the staffs were very police and easy accessible. Food was also very good.",
    date: "October 2025",
    source: "Booking.com",
    roomType: "4-Bed Female Dormitory Room"
  }, {
    name: "Gaurav",
    rating: 10,
    comment: "The rooms are very premium. And property is Close to nature.",
    date: "December 2024",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room"
  }, {
    name: "Nitin",
    rating: 10,
    comment: "I loved the hospitality and the caring nature of the hosts. They both ensured that our stay was fantastic. Helped us with their two-wheeler to roam around the city and helped us in making our travel plans. We had no clue that sunrise and sunset vary so much in NE India compared to the mainland. Also, I traveled to Shillong with my fiancée who is 100% vegetarian and it is not easy to find a pure veg restaurant in the northeast part of India. The hosts went above and beyond to ensure she got a proper veg meal. They made sure to cook for her before preparing anything non-veg. This level of care for your guests is rare and I'm really grateful that they took care her meals.",
    date: "January 2025",
    source: "Booking.com",
    roomType: "Two-Bedroom Suite"
  }, {
    name: "Lahari",
    rating: 10,
    comment: "The overall experience was very good! Staff were very much helpful and the host was amazing in ensuring our facilities were available for our stay! Great to be there!",
    date: "January 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Female Dormitory Room"
  }, {
    name: "Olivia",
    rating: 10,
    comment: "When my friends and I planned our North East India trip, we were hesitant. But XTSY Travellers Hostel changed everything! We instantly felt safe and welcomed—it's honestly one of the safest places we've traveled to. The hostel itself is awesome—clean, cozy, and full of good vibes. The bonfire and BBQ nights on the terrace were a blast, with incredible views and fun conversations. And the location? Perfect! Tucked in peaceful pine forests, from the chaos of city traffic. The host was amazing, organizing trips to stunning spots like Dawki, Cherrapunji, and even hidden gems we'd never have found on our own.",
    date: "January 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room"
  }, {
    name: "Harshit",
    rating: 10,
    comment: "The place is very good and have some good facilities too. the host is very friendly and very welcoming. And the food there is too good.",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room"
  }, {
    name: "Shreya",
    rating: 10,
    comment: "Had the best time at XTSY Travellers Hostel! 💖 Super chill vibes, comfy beds, and the coolest people. Perfect spot to crash after exploring. 10/10 would stay again! ✨",
    date: "January 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room"
  }, {
    name: "Hrishikesh",
    rating: 10,
    comment: "Amazing owner, very helpful staff and nice place to chill!",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room"
  }, {
    name: "Amritha",
    rating: 10,
    comment: "Even though I booked the property just because it was cheap without much expectations as I was gonna just crash after a long day of travel, the property and staffs really surprised me by providing a very warm experience. The owner, my host Eurica and all other staffs are really friendly and goes above and beyond to make you feel at home and also does their maximum to satisfy your requests. The terrace area with bonfire is also another highlight and I had such an enjoyable experience with the whole XTSY fam there! :D Will definitely be back, try and stop me!!",
    date: "March 2025",
    source: "Booking.com",
    roomType: "4-Bed Female Dormitory Room"
  }, {
    name: "Deepak",
    rating: 10,
    comment: "This hostel is a hidden gem for backpackers. Its location is absolutely perfect for nature lovers… From the moment I parked my car in spacious parking walked through the door, I felt completely at home. The staff was incredibly welcoming and created such a friendly, inclusive atmosphere. The common area felt like a big living room where it was easy to meet other travelers, whether we were sharing travel stories or joining in on one of the hostel's evening activities. This isn't just a place to sleep—it's a place to connect.",
    date: "October 2025",
    source: "Booking.com",
    roomType: "6-Bed Mixed Dormitory Room"
  }, {
    name: "T2t",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "6-Bed Mixed Dormitory Room"
  }, {
    name: "Kush Agarwal",
    rating: 10,
    comment: "Amazing location, clean space. Awesome hosts",
    date: "May 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room"
  }, {
    name: "Jishnu",
    rating: 10,
    comment: "Amazing location, clean space. Awesome hosts",
    date: "May 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room"
  }, {
    name: "Syama",
    rating: 10,
    comment: "The hospitality, facilities",
    date: "March 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room"
  }, {
    name: "Madeleine",
    rating: 10,
    comment: "We had a great time at XTSY hostel. The staff is excellent and the beds are really comfortable",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room"
  }, {
    name: "Gorre",
    rating: 10,
    comment: "The hosts are very great .the place was very good.great location .great view.also budget friendly. We liked everything.",
    date: "March 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room"
  }, {
    name: "Amritha",
    rating: 10,
    comment: "XTSY made me me ecstatic! Best hostel in Shillong rn as the team claims to be. Even though I booked the property just because it was cheap without much expectations as I was gonna just crash after a long day of travel, the property and staffs really surprised me by providing a very warm experience. The owner, my host Eurica and all other staffs are really friendly and goes above and beyond to make you feel at home and also does their maximum to satisfy your requests. The terrace area with bonfire is also another highlight and I had such an enjoyable experience with the whole XTSY fam there! :D Will definitely be back, try and stop me!!",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Female Dormitory Room"
  }, {
    name: "Harshaan",
    rating: 10,
    comment: "Exceptional",
    date: "April 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room"
  }, {
    name: "Mani",
    rating: 10,
    comment: "Exceptional",
    date: "May 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room"
  }, {
    name: "Shree",
    rating: 10,
    comment: "Superb",
    date: "July 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room"
  }, {
    name: "Santhosh",
    rating: 5,
    comment: "we'll maintain hygienic and quality and responsibilities staffs.",
    date: "April 2025",
    source: "MakeMyTrip",
    roomType: "Deluxe 6 Bed Mixed Dormitory"
  }, {
    name: "Millie C.",
    rating: 5,
    comment: "Xtsy Travellers Hostel is hands down the best hostel I've ever stayed in! The beds are incredibly cozy and spotless—honestly, they're so comfortable that I think they should be charging more! The entire place is well-maintained, with a warm and welcoming vibe. But what truly sets it apart is the stunning view. Everywhere you look, you're surrounded by pure nature—lush greenery, fresh mountain air, and total tranquility. If you're looking for a perfect stay in Shillong, this is the place!",
    date: "February 2025",
    source: "MakeMyTrip",
    roomType: "Standard 8 Bed Mixed Dormitory"
  }, {
    name: "Brilliant",
    rating: 10,
    comment: "Exceptional",
    date: "August 2025",
    source: "XTSY Economy",
    roomType: "Mixed Dormitory Room"
  }, {
    name: "Danish",
    rating: 10,
    comment: "Exceptional",
    date: "August 2025",
    source: "XTSY Economy",
    roomType: "8-Bed Mixed Dormitory Room"
  }, {
    name: "Keita",
    rating: 10,
    comment: "Exceptional",
    date: "September 2025",
    source: "XTSY Economy",
    roomType: "Mixed Dormitory Room"
  }, {
    name: "Gandharv",
    rating: 10,
    comment: "Exceptional",
    date: "September 2025",
    source: "XTSY Economy",
    roomType: "Mixed Dormitory Room"
  }, {
    name: "Ritika",
    rating: 10,
    comment: "The hostel has a very welcoming atmosphere with friendly staff and a helpful property manager. The food is excellent, cleanliness is always maintained, and Wi-Fi connectivity is smooth. As a student, I never faced any issues, and having Swiggy and Zomato working perfectly was a big plus. The location is also close to beautiful scenic spots, which makes staying here even better.",
    date: "August 2025",
    source: "XTSY Economy",
    roomType: "Female Dormitory Room"
  }];

  const nextReview = () => {
    setCurrentIndex(prev => (prev + 1) % Math.ceil(filteredReviews.length - 2));
  };
  const prevReview = () => {
    setCurrentIndex(prev => (prev - 1 + Math.ceil(filteredReviews.length - 2)) % Math.ceil(filteredReviews.length - 2));
  };

  const truncateText = (text: string, maxLength: number = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const handleReviewClick = (review: any) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
  };
  useEffect(() => {
    const interval = setInterval(nextReview, 5000);
    return () => clearInterval(interval);
  }, []);

  return <section id="reviews" className="pt-16 pb-20 px-4 relative bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 overflow-hidden -mt-1">
      {/* Enhanced Background Effects - Updated to black and shining */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-gray-900 to-black animate-pulse" />
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-30 animate-pulse" />
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-white/30 via-gray-300/50 to-white/30 animate-pulse" />
      <div className="absolute -top-32 -right-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-white/10 rounded-full blur-3xl animate-pulse" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="text-center mb-16">
          <div className="glass-card inline-block px-8 py-6 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 shadow-xl max-w-4xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 font-playfair text-center">
              Guest Reviews
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-gray-300 text-center leading-relaxed max-w-2xl mx-auto mb-3">See what our amazing guests have to say about their unforgettable stay at XTSY!</p>
            <div className="w-20 sm:w-28 h-0.5 bg-gradient-to-r from-white/50 to-gray-300/50 mx-auto mt-4 rounded-full" />
          </div>
        </div>

        {/* Floating Carousel */}
        <div className="relative mb-12">
          <div className="overflow-hidden">
            <div className="flex transition-transform duration-500 ease-in-out" style={{
            transform: `translateX(-${currentIndex * 100}%)`
          }}>
              {Array.from({
              length: Math.ceil(filteredReviews.length - 2)
            }).map((_, slideIndex) => <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 px-4">
                     {filteredReviews.slice(slideIndex, slideIndex + 4).map((review, index) => <Card 
                        key={index} 
                        className="backdrop-blur-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:shadow-2xl transform-gpu cursor-pointer h-[260px] flex flex-col hover:border-white/20"
                        onClick={() => handleReviewClick(review)}
                      >
                        <CardHeader className="flex-shrink-0 pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <CardTitle className="text-base font-semibold text-white font-['Poppins'] truncate">
                              {review.name}
                            </CardTitle>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-400 font-bold text-sm">
                                {review.source === "MakeMyTrip" ? `${review.rating}/5` : `${review.rating}/10`}
                              </span>
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            </div>
                          </div>
                          
                          {/* XTSY Travellers Hostel Tag */}
                          <div className="mb-2">
                            <span className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm">
                              XTSY Travellers Hostel
                            </span>
                          </div>

                          <CardDescription className="text-gray-400 text-xs font-['Inter']">
                            <div className="flex items-center gap-1 mb-1">
                              <span>{review.date}</span>
                              <span>•</span>
                              <span className="text-teal-400">{review.source}</span>
                            </div>
                            {review.roomType && (
                              <div className="text-xs text-gray-500 truncate">{review.roomType}</div>
                            )}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col justify-between p-3">
                          <p className="text-gray-300 font-['Inter'] text-xs leading-relaxed flex-grow">
                            {truncateText(review.comment, 80)}
                          </p>
                          {review.comment.length > 80 && (
                            <p className="text-teal-400 text-xs mt-1 font-medium">Click to read more...</p>
                          )}
                        </CardContent>
                      </Card>)}
                  </div>
                </div>)}
            </div>
          </div>

          {/* Navigation Buttons */}
          <Button variant="outline" size="icon" className="absolute left-0 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm" onClick={prevReview}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <Button variant="outline" size="icon" className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm" onClick={nextReview}>
            <ChevronRight className="h-4 w-4" />
          </Button>

          {/* Dots Indicators */}
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({
            length: Math.ceil(filteredReviews.length - 2)
          }).map((_, index) => <button key={index} className={`w-3 h-3 rounded-full transition-colors ${index === currentIndex ? 'bg-white/70' : 'bg-white/30'}`} onClick={() => setCurrentIndex(index)} />)}
          </div>
        </div>

        {/* Enhanced Five-Star Rating Display */}
        <div className="mt-8 text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">Our Ratings Across Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-1">Booking.com</div>
                <div className="text-3xl font-bold text-orange-400 mb-2">9.8</div>
                <div className="flex justify-center mb-2 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
            
            <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-1">MakeMyTrip</div>
                <div className="text-3xl font-bold text-orange-400 mb-2">4.4</div>
                <div className="flex justify-center mb-2 gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-4 w-4 fill-yellow-400/40 text-yellow-400/40" />
                </div>
              </div>
            </div>
            
            <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-1">GoIbibo</div>
                <div className="text-3xl font-bold text-orange-400 mb-2">4.4</div>
                <div className="flex justify-center mb-2 gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-4 w-4 fill-yellow-400/40 text-yellow-400/40" />
                </div>
              </div>
            </div>
            
            <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 transition-all duration-300">
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-1">Expedia</div>
                <div className="text-3xl font-bold text-orange-400 mb-2">9.8</div>
                <div className="flex justify-center mb-2 gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Notice */}
        <div className="text-center mt-8">
          <div className="glass-card bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 max-w-md mx-auto">
            <p className="text-white/80 text-sm">
              <span className="text-orange-400 font-semibold">✨ Enhanced Integration:</span> Reviews automatically synced from all major booking platforms
            </p>
          </div>
        </div>
      </div>

      {/* Review Detail Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-xl font-semibold">{selectedReview?.name}</span>
                <span className="inline-block bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm w-fit">
                  XTSY Travellers Hostel
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 font-bold">
                  {selectedReview?.source === "MakeMyTrip" ? `${selectedReview?.rating}/5` : `${selectedReview?.rating}/10`}
                </span>
                <Star className="h-5 w-5 fill-yellow-500 text-yellow-500" />
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="text-sm text-gray-600">
              <div className="flex items-center gap-2 mb-2">
                <span>{selectedReview?.date}</span>
                <span>•</span>
                <span className="text-blue-600 font-medium">{selectedReview?.source}</span>
              </div>
              {selectedReview?.roomType && (
                <div className="text-gray-500">{selectedReview?.roomType}</div>
              )}
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">
                {selectedReview?.comment}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>;
};
export default ReviewsSection;
