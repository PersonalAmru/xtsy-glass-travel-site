import { useState, useEffect, useCallback, useMemo } from "react";
import { Star, X, Loader2, BadgeCheck, Quote, Sparkles, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import PremiumReviewCard from "./reviews/PremiumReviewCard";
import PlatformRatingCard from "./reviews/PlatformRatingCard";
import { cn } from "@/lib/utils";
import { useReviews, type Review } from "@/hooks/useReviews";
import { routeGTMEvent } from "@/utils/gtmEventRouter";
import { googleReviews } from "@/data/googleReviews";

// Number of reviews to show initially in the modal
const REVIEWS_PER_PAGE = 12;

// Check if user is on mobile
const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 768 || /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
};

const ReviewsSection = () => {
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);
  const [visibleReviewsCount, setVisibleReviewsCount] = useState(REVIEWS_PER_PAGE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Fetch reviews from Supabase
  const { reviews: dbReviews, loading: dbLoading, hasReviews } = useReviews();

  // Detect mobile on mount
  useEffect(() => {
    setIsMobile(isMobileDevice());
    const handleResize = () => setIsMobile(isMobileDevice());
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Reset visible reviews when modal opens
  useEffect(() => {
    if (isAllReviewsOpen) {
      setVisibleReviewsCount(REVIEWS_PER_PAGE);
      // Track review modal open
      routeGTMEvent({
        eventName: 'review_interaction',
        params: {
          action: 'view_all_opened',
          review_count: allReviewsCombined?.length || 0,
        },
      });
    }
  }, [isAllReviewsOpen]);

  // Track individual review expansion
  const handleReviewClick = useCallback((review: Review) => {
    setSelectedReview(review);
    setIsDialogOpen(true);
    routeGTMEvent({
      eventName: 'review_interaction',
      params: {
        action: 'review_expanded',
        review_source: review.source,
        review_property: review.property,
        review_rating: review.rating,
      },
    });
  }, []);

  // Hardcoded OTA platform reviews (fallback when DB is empty)
  const fallbackReviews: Review[] = [{
    name: "Rohit",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Rai",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Kashfi",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Arun",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Himanjit",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "4-Bed Female Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Aman",
    rating: 10,
    comment: "Exceptional",
    date: "April 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Vihaan",
    rating: 10,
    comment: "Exceptional",
    date: "April 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Alisha",
    rating: 10,
    comment: "Exceptional",
    date: "October 2025",
    source: "Booking.com",
    roomType: "Double Room with Lake View",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Наталья",
    rating: 10,
    comment: "XTSY (ecstasy) travellers hostel was my last stop in India before my visa expired. I stay here one night before going to bangladesh. Hostel very nice clean and peaceful. People friendly, and P is best. He helps with everything. Good news—I get new visa and already book again! Hey P, I come back on 14 Feb! This time I stay longer and explore meghalaya and northeast. See you soon! 😊",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Female Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Anonymous",
    rating: 10,
    comment: "The location was a bit outskirts but it was worth it, The people were very friendly and very engaging, the staffs were very police and easy accessible. Food was also very good.",
    date: "October 2025",
    source: "Booking.com",
    roomType: "4-Bed Female Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Gaurav",
    rating: 10,
    comment: "The rooms are very premium. And property is Close to nature.",
    date: "December 2024",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Nitin",
    rating: 10,
    comment: "I loved the hospitality and the caring nature of the hosts. They both ensured that our stay was fantastic. Helped us with their two-wheeler to roam around the city and helped us in making our travel plans. We had no clue that sunrise and sunset vary so much in NE India compared to the mainland. Also, I traveled to Shillong with my fiancée who is 100% vegetarian and it is not easy to find a pure veg restaurant in the northeast part of India. The hosts went above and beyond to ensure she got a proper veg meal. They made sure to cook for her before preparing anything non-veg. This level of care for your guests is rare and I'm really grateful that they took care her meals.",
    date: "January 2025",
    source: "Booking.com",
    roomType: "Two-Bedroom Suite",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Lahari",
    rating: 10,
    comment: "The overall experience was very good! Staff were very much helpful and the host was amazing in ensuring our facilities were available for our stay! Great to be there!",
    date: "January 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Female Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Olivia",
    rating: 10,
    comment: "When my friends and I planned our North East India trip, we were hesitant. But XTSY Travellers Hostel changed everything! We instantly felt safe and welcomed—it's honestly one of the safest places we've traveled to. The hostel itself is awesome—clean, cozy, and full of good vibes. The bonfire and BBQ nights on the terrace were a blast, with incredible views and fun conversations. And the location? Perfect! Tucked in peaceful pine forests, from the chaos of city traffic. The host was amazing, organizing trips to stunning spots like Dawki, Cherrapunji, and even hidden gems we'd never have found on our own.",
    date: "January 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Harshit",
    rating: 10,
    comment: "The place is very good and have some good facilities too. the host is very friendly and very welcoming. And the food there is too good.",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Shreya",
    rating: 10,
    comment: "Had the best time at XTSY Travellers Hostel! 💖 Super chill vibes, comfy beds, and the coolest people. Perfect spot to crash after exploring. 10/10 would stay again! ✨",
    date: "January 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Hrishikesh",
    rating: 10,
    comment: "Amazing owner, very helpful staff and nice place to chill!",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Amritha",
    rating: 10,
    comment: "Even though I booked the property just because it was cheap without much expectations as I was gonna just crash after a long day of travel, the property and staffs really surprised me by providing a very warm experience. The owner, my host Eurica and all other staffs are really friendly and goes above and beyond to make you feel at home and also does their maximum to satisfy your requests. The terrace area with bonfire is also another highlight and I had such an enjoyable experience with the whole XTSY fam there! :D Will definitely be back, try and stop me!!",
    date: "March 2025",
    source: "Booking.com",
    roomType: "4-Bed Female Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Deepak",
    rating: 10,
    comment: "This hostel is a hidden gem for backpackers. Its location is absolutely perfect for nature lovers… From the moment I parked my car in spacious parking walked through the door, I felt completely at home. The staff was incredibly welcoming and created such a friendly, inclusive atmosphere. The common area felt like a big living room where it was easy to meet other travelers, whether we were sharing travel stories or joining in on one of the hostel's evening activities. This isn't just a place to sleep—it's a place to connect.",
    date: "October 2025",
    source: "Booking.com",
    roomType: "6-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "T2t",
    rating: 10,
    comment: "Exceptional",
    date: "February 2025",
    source: "Booking.com",
    roomType: "6-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Kush Agarwal",
    rating: 10,
    comment: "Amazing location, clean space. Awesome hosts",
    date: "May 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Jishnu",
    rating: 10,
    comment: "Amazing location, clean space. Awesome hosts",
    date: "May 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Syama",
    rating: 10,
    comment: "The hospitality, facilities",
    date: "March 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Madeleine",
    rating: 10,
    comment: "We had a great time at XTSY hostel. The staff is excellent and the beds are really comfortable",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Gorre",
    rating: 10,
    comment: "The hosts are very great .the place was very good.great location .great view.also budget friendly. We liked everything.",
    date: "March 2025",
    source: "Booking.com",
    roomType: "Bed in 6-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Amritha",
    rating: 10,
    comment: "XTSY made me me ecstatic! Best hostel in Shillong rn as the team claims to be. Even though I booked the property just because it was cheap without much expectations as I was gonna just crash after a long day of travel, the property and staffs really surprised me by providing a very warm experience. The owner, my host Eurica and all other staffs are really friendly and goes above and beyond to make you feel at home and also does their maximum to satisfy your requests. The terrace area with bonfire is also another highlight and I had such an enjoyable experience with the whole XTSY fam there! :D Will definitely be back, try and stop me!!",
    date: "February 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Female Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Harshaan",
    rating: 10,
    comment: "Exceptional",
    date: "April 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Mani",
    rating: 10,
    comment: "Exceptional",
    date: "May 2025",
    source: "Booking.com",
    roomType: "Bed in 8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Shree",
    rating: 10,
    comment: "Superb",
    date: "July 2025",
    source: "Booking.com",
    roomType: "Bed in 4-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Santhosh",
    rating: 5,
    comment: "we'll maintain hygienic and quality and responsibilities staffs.",
    date: "April 2025",
    source: "MakeMyTrip",
    roomType: "Deluxe 6 Bed Mixed Dormitory",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Millie C.",
    rating: 5,
    comment: "Xtsy Travellers Hostel is hands down the best hostel I've ever stayed in! The beds are incredibly cozy and spotless—honestly, they're so comfortable that I think they should be charging more! The entire place is well-maintained, with a warm and welcoming vibe. But what truly sets it apart is the stunning view. Everywhere you look, you're surrounded by pure nature—lush greenery, fresh mountain air, and total tranquility. If you're looking for a perfect stay in Shillong, this is the place!",
    date: "February 2025",
    source: "MakeMyTrip",
    roomType: "Standard 8 Bed Mixed Dormitory",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Brilliant",
    rating: 10,
    comment: "Exceptional",
    date: "August 2025",
    source: "Booking.com",
    roomType: "Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Danish",
    rating: 10,
    comment: "Exceptional",
    date: "August 2025",
    source: "Booking.com",
    roomType: "8-Bed Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Keita",
    rating: 10,
    comment: "Exceptional",
    date: "September 2025",
    source: "Booking.com",
    roomType: "Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Gandharv",
    rating: 10,
    comment: "Exceptional",
    date: "September 2025",
    source: "Booking.com",
    roomType: "Mixed Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Ritika",
    rating: 10,
    comment: "The hostel has a very welcoming atmosphere with friendly staff and a helpful property manager. The food is excellent, cleanliness is always maintained, and Wi-Fi connectivity is smooth. As a student, I never faced any issues, and having Swiggy and Zomato working perfectly was a big plus. The location is also close to beautiful scenic spots, which makes staying here even better.",
    date: "August 2025",
    source: "Booking.com",
    roomType: "Female Dormitory Room",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Samdarshi",
    rating: 5,
    comment: "Holiday | Friends",
    date: "4 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great value"
  }, {
    name: "KaDusH Music",
    rating: 5,
    comment: "Business | Solo",
    date: "3 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great value"
  }, {
    name: "Raju Paul",
    rating: 5,
    comment: "Holiday | Family",
    date: "3 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Quiet"
  }, {
    name: "Angel Kenny",
    rating: 5,
    comment: "Holiday | Friends",
    date: "3 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Quiet · Child-friendly · Great value"
  }, {
    name: "Reejan",
    rating: 5,
    comment: "Stay was a very good experience. Rooms were much comfortable. They do have rooms for all price ranges. Dormitory facilities are also available. Food is prepared to order and to your taste. Thanks Xsty team for your support.",
    date: "a week ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 4.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Great value"
  }, {
    name: "Deepak D",
    rating: 5,
    comment: "This hostel is a hidden gem for backpackers. Its location is absolutely perfect. From the moment I walked through the door, I felt completely at home. The staff was incredibly welcoming and created such a friendly, inclusive atmosphere. The common area felt like a big living room where it was easy to meet other travelers, whether we were sharing travel stories or joining in on one of the hostel's evening activities. This isn't just a place to sleep—it's a place to connect.",
    date: "6 days ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Luxury · Great view · Romantic · Quiet · Great value · High-tech"
  }, {
    name: "Vishwas Aditya Chauhan",
    rating: 5,
    comment: "Rooms are good and are of wide space. Nearby activity is full of peace and silence yeah but in hostel they provide music systems and fun games for enjoyment. The food is very good as compared to other stays and rooms.",
    date: "a month ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 4.0",
    property: "XTSY Travellers Hostel",
    highlights: "Luxury · Great value"
  }, {
    name: "Gokarna Shrestha",
    rating: 5,
    comment: "Best Budget accommodation ✨",
    date: "a week ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Child-friendly · Great value"
  }, {
    name: "Dipankar boro Boro",
    rating: 5,
    comment: "Best Hostel in Shillong ♥️",
    date: "a week ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Romantic · Quiet · Great value"
  }, {
    name: "saad sep",
    rating: 5,
    comment: "Everything is good in here",
    date: "2 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 4.0",
    property: "XTSY Travellers Hostel",
    highlights: "Romantic · Quiet · Great value"
  }, {
    name: "SAHIL BENIWAL",
    rating: 5,
    comment: "Very nice place for group stay👍",
    date: "a month ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel"
  }, {
    name: "Dhruba Thakuria",
    rating: 5,
    comment: "Very good hospitality and excellent tour package management",
    date: "a week ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Romantic · Quiet · Child-friendly · Great value"
  }, {
    name: "Mariza Pyngrope",
    rating: 5,
    comment: "Unforgettable stay at XTSY Travellers Hostel! From the moment I stepped into XTSY Travellers Hostel, I felt like I'd stumbled into a home away from home. The energy of the place is electric — full of laughter, music, and the kind of conversations that stretch late into the night. What truly sets this hostel apart, though, are the people. Amrudeen and Prabhu are the heartbeat of XTSY. Their warmth is unmatched — they greeted me with huge smiles and instantly made me feel like part of the family. I still remember Prabhu pulling out his guitar one evening and turning a quiet dinner into a spontaneous jam session. Amrudeen, ever the gracious host, made sure everyone had what they needed, whether it was a hot cup of tea or a local travel tip that turned into a hidden gem discovery. The food deserves its own shoutout — every meal was a celebration. From hearty breakfasts that fueled our adventures to cozy dinners that brought everyone together, the flavors were rich and comforting. I especially loved the local touches in the menu — it felt like a culinary tour of Meghalaya without leaving the dining table. The vibe of the hostel is youthful and welcoming. Whether you're a solo traveler or part of a group, there's always someone to chat with, explore with, or just sit quietly and take in the view. The common spaces are designed for connection — I met people from all over the world and shared stories that I'll carry with me for years. If you're heading to Shillong and want more than just a place to sleep — if you want memories, friendships, and a true sense of belonging — XTSY is the place. I'll be back, and next time, I'm bringing friends!",
    date: "a month ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Luxury · Great view · Romantic · Quiet · Great value · High-tech"
  }, {
    name: "Adhiyamaan Arasu",
    rating: 5,
    comment: "I had a wonderful experience at Xtsy Traveller Hostel! The staff were super friendly and helpful, and the atmosphere was very welcoming. The rooms were clean and comfortable, and the common areas has games and tv. It felt like a good vibes. Highly recommend this place if you're looking for a great stay!",
    date: "a month ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Luxury · Great view · Quiet · Child-friendly · Great value · High-tech"
  }, {
    name: "chandan chaudhary",
    rating: 5,
    comment: "It was a very pleasant stay. Rooms and dorms are very nice, near and clean. Staff is very humble and polite and services are very classy",
    date: "a month ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 4.0",
    property: "XTSY Travellers Hostel",
    highlights: "Luxury · Great view · Romantic · Quiet · Child-friendly · Great value · High-tech"
  }, {
    name: "Emmanuel Swamy",
    rating: 5,
    comment: "A gem in Shillong! Staying at XTSY Travellers Hostel was an absolute delight. From the moment I arrived, I was welcomed with genuine warmth and infectious energy by Amrudeen and Prabhu — two of the most lively and gracious hosts I've ever met. Their hospitality goes beyond expectations, making you feel less like a guest and more like family. The vibe of the hostel is vibrant and full of life — perfect for travelers looking to connect, relax, and soak in the spirit of Shillong. The common areas are cozy and inviting, and there's always something happening that brings people together. And the food? Absolutely delicious! Every meal was prepared with care and flavor, offering a comforting taste of home with a local twist. Whether you're starting your day with a hearty breakfast or winding down with a warm dinner, the kitchen never disappoints. If you're looking for a place that blends comfort, community, and character — XTSY is it. Huge thanks to Amrudeen and Prabhu for making my stay unforgettable. Can't wait to come back!",
    date: "a month ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Luxury · Great view · Romantic · Quiet · Child-friendly · Great value · High-tech"
  }, {
    name: "Sahaa Msd",
    rating: 5,
    comment: "Absolutely loved my stay at XTSY Travellers Hostel! The staff here are exceptionally warm, attentive, and truly go above and beyond to make everyone feel welcome and cared for. The beds are incredibly comfortable—like sinking into a cloud after a long day exploring Shillong. Everything was spotlessly clean, and the atmosphere made it easy to relax and recharge. Highly recommend this hostel if friendly service and a good night's sleep are important! Cafe there also provides healthy and tasty food. BBQ set up, DJ party, Panoramic stargaze stay are the main attractions of XTSY",
    date: "a month ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Luxury · Great view · Quiet · Great value · High-tech"
  }, {
    name: "Malathi Gunda",
    rating: 5,
    comment: "Had a very memorable and pleasant stay. Staff was of great help as we had bad experience with the cab service from Guwahati to Shillong. Thanks to the XTSY staff's timely help in this regard. Would recommend without any hesitation. Thank you XTSY!!!",
    date: "3 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Quiet · Great value"
  }, {
    name: "Rahul Dev Lenka",
    rating: 5,
    comment: "Just one word for XTSY STAYS, 'THE BEST'. It's one of the best stays I have been lately. The support staff is very very helpful and the owners are just awesome. I would strongly recommend everyone to be here if you are travelling in Shillong. The location is also great because it is just in the middle of the new Shillong road.",
    date: "4 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Romantic · Great value · High-tech"
  }, {
    name: "Umapathi Prithiv",
    rating: 5,
    comment: "I had an amazing stay at XTSY Travellers Hostel in Meghalaya! The rooms were clean, comfortable, and well-maintained, making it the perfect place to relax after a day of exploring. The service was outstanding—staff were super friendly, helpful, and always went out of their way to make sure everything was perfect. The location is unbeatable, close to key attractions and surrounded by beautiful views, which added so much charm to the trip.",
    date: "3 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view"
  }, {
    name: "Rama Krishna",
    rating: 5,
    comment: "The hostel is comfy and situated in the calmness of the nature. With clean rooms and friendly staff.",
    date: "4 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 4.0",
    property: "XTSY Travellers Hostel",
    highlights: "Luxury · Great view · Romantic · Quiet · Child-friendly · Great value · High-tech"
  }, {
    name: "Rewa S",
    rating: 5,
    comment: "Travellers looking for a place of co-existence, away from city hustle, but warm enough to keep you surrounded with a diverse crowd of expert travellers, remote working people, new comers or first-time travellers, you basically get a very welcoming environment here. It's a must experience hostel. Food: simple, wholesome. Vibe: 100% great. Cleanliness: Very regular and maintained. Cost effectiveness: Great. Scope to connect with like minded people: 100%. Most importantly, the man behind the scenes, you'd see running around for room allocations, taking canteen orders, arranging bikes, managing the staff team but always keeping a smile on his face- Santosh bhaiya. He is a gem of a person. Made our stay worth remembering. Thanks to the entire XTSY team ❤️ My travel dates: Nov 11-17, 2025",
    date: "2 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Quiet · Great value"
  }, {
    name: "Parichit Doshi",
    rating: 5,
    comment: "Amazing experience staying at XTSY traveller's hostel.. Amazing host.. Santosh was amazing.. Great people.. Met a lot new people who became a part of my life now.. absolutely beautiful place.. worth every single penny.. definitely coming here again",
    date: "a week ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Quiet · Great value"
  }];

  // Use DB reviews if available, otherwise fallback to hardcoded OTA reviews
  const allReviewsCombined = useMemo(() => {
    if (hasReviews && dbReviews.length > 0) {
      // Combine DB reviews with fallback OTA reviews
      return [...dbReviews, ...fallbackReviews];
    }
    // Use only fallback reviews when DB is empty
    return fallbackReviews;
  }, [dbReviews, hasReviews]);

  // Sort reviews by comment length (longest first) for carousel
  const filteredReviews = useMemo(() => 
    [...allReviewsCombined].sort((a, b) => b.comment.length - a.comment.length), 
    [allReviewsCombined]
  );

  // Sort reviews by rating (highest first) for "View All" modal
  const topRatedReviews = useMemo(() => 
    [...allReviewsCombined].sort((a, b) => {
      // Normalize ratings to 0-10 scale for comparison
      const ratingA = a.source === "Google" || a.source === "MakeMyTrip" ? a.rating * 2 : a.rating;
      const ratingB = b.source === "Google" || b.source === "MakeMyTrip" ? b.rating * 2 : b.rating;
      // Sort by rating first, then by comment length
      if (ratingB !== ratingA) return ratingB - ratingA;
      return b.comment.length - a.comment.length;
    }), 
    [allReviewsCombined]
  );

  // Removed carousel navigation - now using CSS marquee animation

  // Load more reviews handler
  const handleLoadMore = useCallback(() => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleReviewsCount(prev => prev + REVIEWS_PER_PAGE);
      setIsLoadingMore(false);
    }, 150);
  }, []);

  // Get avatar gradient for selected review
  const getAvatarGradient = (name: string) => {
    const gradients = [
      "from-violet-500 via-purple-500 to-fuchsia-500",
      "from-cyan-500 via-teal-500 to-emerald-500",
      "from-orange-500 via-amber-500 to-yellow-500",
      "from-rose-500 via-pink-500 to-fuchsia-500",
      "from-blue-500 via-indigo-500 to-purple-500",
    ];
    const index = name.charCodeAt(0) % gradients.length;
    return gradients[index];
  };

  return (
    <section 
      id="reviews" 
      className={cn(
        "relative py-20 px-4 overflow-hidden -mt-1",
        isMobile ? 'mobile-disable-pulse' : ''
      )}
    >
      {/* Premium Dark Background — brand aligned */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card to-background" />
      
      {/* Animated gradient orbs - Disabled on mobile */}
      {!isMobile && (
        <>
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-primary/15 to-brand-ember/15 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-brand-gold/10 to-brand-copper/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-br from-primary/5 to-brand-ember/5 rounded-full blur-[150px]" />
        </>
      )}
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--foreground) / 0.1) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground) / 0.1) 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Premium Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Verified Guest Experiences
            </span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground mb-4 font-playfair">
            Guest{" "}
            <span className="text-primary">
              Reviews
            </span>
          </h2>
          
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Discover what our amazing guests have to say about their unforgettable experiences at XTSY
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-primary to-brand-ember mx-auto mt-6 rounded-full" />
        </div>

        {/* Infinite Marquee - Row 1 (scrolls left) */}
        <div className="relative mb-4 overflow-hidden">
          {/* Gradient fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          
          <div 
            className="flex gap-4 marquee-track"
            style={{ 
              animation: `marquee-left ${Math.max(40, filteredReviews.length * 3)}s linear infinite`,
              width: 'max-content',
            }}
            onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
          >
            {/* Triple reviews for seamless continuous loop */}
            {[...filteredReviews, ...filteredReviews, ...filteredReviews].map((review, index) => (
              <div key={`row1-${index}`} className="flex-shrink-0 w-[300px] sm:w-[340px]">
                <PremiumReviewCard
                  review={review}
                  onClick={() => handleReviewClick(review)}
                  variant="carousel"
                  isMobile={isMobile}
                  index={0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Infinite Marquee - Row 2 (scrolls right) */}
        <div className="relative mb-12 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-r from-background to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 bg-gradient-to-l from-background to-transparent pointer-events-none" />
          
          <div 
            className="flex gap-4 marquee-track"
            style={{ 
              animation: `marquee-right ${Math.max(45, filteredReviews.length * 3.5)}s linear infinite`,
              width: 'max-content',
            }}
            onMouseEnter={(e) => e.currentTarget.style.animationPlayState = 'paused'}
            onMouseLeave={(e) => e.currentTarget.style.animationPlayState = 'running'}
          >
            {/* Triple reversed for seamless continuous loop */}
            {(() => {
              const reversed = [...filteredReviews].reverse();
              return [...reversed, ...reversed, ...reversed].map((review, index) => (
                <div key={`row2-${index}`} className="flex-shrink-0 w-[300px] sm:w-[340px]">
                  <PremiumReviewCard
                    review={review}
                    onClick={() => handleReviewClick(review)}
                    variant="carousel"
                    isMobile={isMobile}
                    index={0}
                  />
                </div>
              ));
            })()}
          </div>
        </div>

        {/* View All Button */}
        <div className="flex justify-center">
          <Button 
            onClick={() => setIsAllReviewsOpen(true)}
            className={cn(
              "px-8 py-3 rounded-full font-medium",
              "bg-gradient-to-r from-primary to-brand-ember",
              "hover:from-primary/90 hover:to-brand-ember/90",
              "text-primary-foreground shadow-lg shadow-primary/25",
              "hover:shadow-xl hover:shadow-primary/30",
              "transition-all duration-300 hover:scale-105"
            )}
          >
            <Sparkles className="w-4 h-4 mr-2" />
            View All {filteredReviews.length} Reviews
          </Button>
        </div>

        {/* Platform Ratings */}
        <div className="mt-16">
          <h3 className="text-xl sm:text-2xl font-semibold text-foreground text-center mb-8">
            Trusted Across{" "}
            <span className="text-primary">
              All Platforms
            </span>
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-w-5xl mx-auto">
            <PlatformRatingCard platform="Google" rating={4.8} maxRating={5} isMobile={isMobile} />
            <PlatformRatingCard platform="Booking.com" rating={9.4} maxRating={10} isMobile={isMobile} />
            <PlatformRatingCard platform="Expedia" rating={9.5} maxRating={10} isMobile={isMobile} />
            <PlatformRatingCard platform="MakeMyTrip" rating={4.4} maxRating={5} isMobile={isMobile} />
            <PlatformRatingCard platform="GoIbibo" rating={4.6} maxRating={5} isMobile={isMobile} />
            <PlatformRatingCard platform="Agoda" rating={9.6} maxRating={10} isMobile={isMobile} />
          </div>
          
          {/* Coming Soon Platforms */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Coming Soon:</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted/50 border border-border text-xs font-medium text-muted-foreground">Airbnb</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-muted/50 border border-border text-xs font-medium text-muted-foreground">MMT Luxe</span>
          </div>
        </div>

        {/* Integration Notice */}
        <div className="text-center mt-12">
          <div className={cn(
            "inline-flex items-center gap-2 px-6 py-3 rounded-full",
            "bg-secondary/50 backdrop-blur-xl border border-border"
          )}>
            <BadgeCheck className="w-5 h-5 text-success" />
            <span className="text-muted-foreground text-sm">
              Reviews automatically synced from all major booking platforms
            </span>
          </div>
        </div>
      </div>

      {/* All Reviews Modal - only rendered when open */}
      {isAllReviewsOpen && (
      <Dialog open={isAllReviewsOpen} onOpenChange={setIsAllReviewsOpen}>
        <DialogContent 
          className={cn(
            "max-w-6xl w-[95vw] sm:w-full max-h-[90vh]",
            "bg-gradient-to-br from-background via-card to-background",
            "border-border"
          )}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          <DialogHeader className="sticky top-0 bg-background/95 backdrop-blur-xl z-10 pb-4 border-b border-border">
            <DialogTitle className="flex items-center gap-3 text-xl sm:text-2xl font-bold text-foreground">
              <Sparkles className="w-6 h-6 text-primary" />
              All Guest Reviews ({allReviewsCombined.length})
            </DialogTitle>
            <VisuallyHidden>
              <DialogDescription>Browse all verified guest reviews</DialogDescription>
            </VisuallyHidden>
          </DialogHeader>
          
          <div 
            className="overflow-y-auto smooth-scroll pr-2 pt-4" 
            style={{ 
              maxHeight: 'calc(90vh - 100px)',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topRatedReviews.slice(0, visibleReviewsCount).map((review, idx) => (
                <PremiumReviewCard
                  key={idx}
                  review={review}
                  onClick={() => handleReviewClick(review)}
                  variant="grid"
                  isMobile={isMobile}
                  index={idx % 4}
                />
              ))}
            </div>
            
            {/* Load More Button */}
            {visibleReviewsCount < allReviewsCombined.length && (
              <div className="flex justify-center pt-8 pb-4">
                <Button
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className={cn(
                    "px-8 py-3 rounded-full font-medium",
                    "bg-gradient-to-r from-primary to-brand-ember",
                    "hover:from-primary/90 hover:to-brand-ember/90",
                    "text-primary-foreground"
                  )}
                >
                  {isLoadingMore ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    `Load More (${allReviewsCombined.length - visibleReviewsCount} remaining)`
                  )}
                </Button>
              </div>
            )}
            
            {visibleReviewsCount >= allReviewsCombined.length && (
              <p className="text-center text-muted-foreground text-sm py-6">
                All {allReviewsCombined.length} reviews loaded
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
      )}

      {/* Review Detail Modal - only rendered when open */}
      {isDialogOpen && (
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent 
          className={cn(
            "max-w-2xl w-[95vw] sm:w-full",
            "bg-gradient-to-br from-background via-card to-background",
            "border-border"
          )}
          style={{
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {selectedReview && (
            <>
              <DialogHeader className="pb-4 border-b border-border">
                <VisuallyHidden>
                  <DialogDescription>View detailed review from {selectedReview.name}</DialogDescription>
                </VisuallyHidden>
                <div className="flex items-start gap-4">
                  {/* Gradient Avatar */}
                  <div 
                    className={cn(
                      "relative flex-shrink-0 rounded-full p-[2px]",
                      `bg-gradient-to-br ${getAvatarGradient(selectedReview.name)}`,
                      "shadow-lg"
                    )}
                  >
                    <div className="flex items-center justify-center w-14 h-14 rounded-full bg-background text-lg font-bold text-foreground">
                      {selectedReview.name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 bg-gradient-to-br from-success to-success/80 rounded-full p-0.5 shadow-lg">
                      <BadgeCheck className="w-4 h-4 text-success-foreground" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <DialogTitle className="text-lg sm:text-xl font-semibold text-foreground mb-2">
                      {selectedReview.name}
                    </DialogTitle>
                    
                    <div className="flex items-center gap-2 flex-wrap mb-2">
                      {/* Rating */}
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/15 border border-primary/30">
                        <Star className="w-3 h-3 fill-primary text-primary" />
                        <span className="text-primary text-xs font-bold">
                          {selectedReview.source === "Google" || selectedReview.source === "MakeMyTrip" 
                            ? `${selectedReview.rating}/5` 
                            : `${selectedReview.rating}/10`}
                        </span>
                      </div>
                      
                      {/* Property badge */}
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-medium text-primary-foreground",
                        selectedReview.property === "XTSY Xperience" 
                          ? "bg-gradient-to-r from-brand-copper to-brand-ember"
                          : "bg-gradient-to-r from-primary to-brand-gold"
                      )}>
                        {selectedReview.property}
                      </span>
                      
                      {/* Source badge */}
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium text-primary-foreground bg-gradient-to-r from-brand-ember to-primary">
                        {selectedReview.source}
                      </span>
                    </div>
                    
                    <p className="text-xs text-muted-foreground">
                      {selectedReview.date} {selectedReview.roomType && `• ${selectedReview.roomType}`}
                    </p>
                  </div>
                </div>
              </DialogHeader>
              
              <div 
                className="overflow-y-auto pt-4"
                style={{
                  maxHeight: 'min(60vh, 60dvh)',
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                <div className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/20" />
                  <p className="text-sm sm:text-base text-foreground/80 leading-relaxed pl-6 whitespace-pre-wrap">
                    {selectedReview.comment}
                  </p>
                </div>
                
                {selectedReview.highlights && (
                  <div className="mt-6 pt-4 border-t border-border">
                    <p className="text-xs text-muted-foreground mb-2">Highlights</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedReview.highlights.split(" · ").map((highlight: string, i: number) => (
                        <span 
                          key={i}
                          className="text-xs px-3 py-1 rounded-full bg-secondary text-secondary-foreground border border-border"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
      )}
    </section>
  );
};

export default ReviewsSection;
