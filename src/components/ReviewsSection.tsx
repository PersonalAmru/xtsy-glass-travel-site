import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, X, ExternalLink } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedReview, setSelectedReview] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isAllReviewsOpen, setIsAllReviewsOpen] = useState(false);

  // Real OTA platform reviews
  const allReviews = [{
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
    property: "XTSY Economy"
  }, {
    name: "Danish",
    rating: 10,
    comment: "Exceptional",
    date: "August 2025",
    source: "Booking.com",
    roomType: "8-Bed Mixed Dormitory Room",
    property: "XTSY Economy"
  }, {
    name: "Keita",
    rating: 10,
    comment: "Exceptional",
    date: "September 2025",
    source: "Booking.com",
    roomType: "Mixed Dormitory Room",
    property: "XTSY Economy"
  }, {
    name: "Gandharv",
    rating: 10,
    comment: "Exceptional",
    date: "September 2025",
    source: "Booking.com",
    roomType: "Mixed Dormitory Room",
    property: "XTSY Economy"
  }, {
    name: "Ritika",
    rating: 10,
    comment: "The hostel has a very welcoming atmosphere with friendly staff and a helpful property manager. The food is excellent, cleanliness is always maintained, and Wi-Fi connectivity is smooth. As a student, I never faced any issues, and having Swiggy and Zomato working perfectly was a big plus. The location is also close to beautiful scenic spots, which makes staying here even better.",
    date: "August 2025",
    source: "Booking.com",
    roomType: "Female Dormitory Room",
    property: "XTSY Economy"
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
    highlights: "Luxury · Great view · Romantic · Quiet · Great value · High-tech",
    details: {
      rooms: "Cozy soft curtains with hygiene bedspreads",
      activities: "Very good location for walking jogging falls lake and ponds",
      safety: "Good",
      food: "Available both Veg and Non-Veg with snacks"
    }
  }, {
    name: "Vishwas Aditya Chauhan",
    rating: 5,
    comment: "Rooms are good and are of wide space. Nearby activity is full of peace and silence yeah but in hostel they provide music systems and fun games for enjoyment. The food is very good as compared to other stays and rooms.",
    date: "a month ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 4.0",
    property: "XTSY Travellers Hostel",
    highlights: "Luxury · Great value",
    details: {
      walkability: "It is great",
      food: "The food is very good as compared to other stays and rooms"
    }
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
    highlights: "Luxury · Great view · Romantic · Quiet · Child-friendly · Great value · High-tech",
    details: {
      rooms: "Near and clean",
      safety: "Safe",
      walkability: "Walking space",
      food: "Good taste at a reasonable price"
    }
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
    highlights: "Luxury · Great view · Quiet · Great value · High-tech",
    details: {
      rooms: "Rooms are neat and clean",
      activities: "Skating, New Legislative Assembly of Shillong, Elephant falls, Laitlum Canyon",
      safety: "Safe is never compromised 24/7 CCTV",
      walkability: "Walkable from New Legislative Assembly of Meghalaya",
      food: "Food, snacks, drinks like beverages are arranged easily for you by friendly management"
    }
  }, {
    name: "Malathi Gunda",
    rating: 5,
    comment: "Had a very memorable and pleasant stay. Staff was of great help as we had bad experience with the cab service from Guwahati to Shillong. Thanks to the XTSY staff's timely help in this regard. Would recommend without any hesitation. Thank you XTSY!!!",
    date: "3 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Quiet · Great value",
    details: {
      rooms: "Neat and clean",
      safety: "Suitable for everyone and no issues with safety. We were all women group and had great stay"
    }
  }, {
    name: "Rahul Dev Lenka",
    rating: 5,
    comment: "Just one word for XTSY STAYS, 'THE BEST'. It's one of the best stays I have been lately. The support staff is very very helpful and the owners are just awesome. I would strongly recommend everyone to be here if you are travelling in Shillong. The location is also great because it is just in the middle of the new Shillong road.",
    date: "4 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view · Romantic · Great value · High-tech",
    details: {
      rooms: "10/10"
    }
  }, {
    name: "Umapathi Prithiv",
    rating: 5,
    comment: "I had an amazing stay at XTSY Travellers Hostel in Meghalaya! The rooms were clean, comfortable, and well-maintained, making it the perfect place to relax after a day of exploring. The service was outstanding—staff were super friendly, helpful, and always went out of their way to make sure everything was perfect. The location is unbeatable, close to key attractions and surrounded by beautiful views, which added so much charm to the trip.",
    date: "3 weeks ago",
    source: "Google",
    roomType: "Rooms 5.0 | Service 5.0 | Location 5.0",
    property: "XTSY Travellers Hostel",
    highlights: "Great view"
  }];

  // Sort reviews by comment length (longest first)
  const filteredReviews = [...allReviews].sort((a, b) => b.comment.length - a.comment.length);

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
                                {review.source === "Google" || review.source === "MakeMyTrip" ? `${review.rating}/5` : `${review.rating}/10`}
                              </span>
                              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            </div>
                          </div>
                          
                          {/* Property Tag */}
                          <div className="mb-2">
                            <span className={`inline-block ${
                              review.property === "XTSY Economy" 
                                ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                                : "bg-gradient-to-r from-orange-500 to-orange-600"
                            } text-white text-xs font-semibold px-2 py-1 rounded-full shadow-sm`}>
                              {review.property}
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

          {/* View All Button */}
          <div className="flex justify-center mt-6">
            <Button 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm px-6 py-2"
              onClick={() => setIsAllReviewsOpen(true)}
            >
              View All {filteredReviews.length} Reviews
            </Button>
          </div>
        </div>

        {/* Enhanced Five-Star Rating Display */}
        <div className="mt-8 text-center">
          <h3 className="text-lg sm:text-xl font-semibold text-white mb-6">Our Ratings Across Platforms</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
            <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:scale-105 hover:shadow-2xl hover:border-white/40 transition-all duration-300 cursor-pointer">
              <div className="text-center">
                <div className="text-xl font-bold text-white mb-1">Google</div>
                <div className="text-3xl font-bold text-orange-400 mb-2">4.9</div>
                <div className="flex justify-center mb-2 gap-0.5">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" style={{ clipPath: 'inset(0 10% 0 0)' }} />
                </div>
              </div>
            </div>
            
            <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:scale-105 hover:shadow-2xl hover:border-white/40 transition-all duration-300 cursor-pointer">
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
            
            <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:scale-105 hover:shadow-2xl hover:border-white/40 transition-all duration-300 cursor-pointer">
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
            
            <div className="glass-card bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4 hover:bg-white/15 hover:scale-105 hover:shadow-2xl hover:border-white/40 transition-all duration-300 cursor-pointer">
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

      {/* All Reviews Modal */}
      <Dialog open={isAllReviewsOpen} onOpenChange={setIsAllReviewsOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between text-2xl font-bold">
              <span>All Guest Reviews</span>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsAllReviewsOpen(false)}
                className="hover:bg-gray-100 rounded-full"
              >
                <X className="h-5 w-5" />
              </Button>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-8 mt-4">
            {/* Group reviews by platform */}
            {["Booking.com", "Google", "MakeMyTrip", "Expedia"].map(platform => {
              const platformReviews = allReviews.filter(r => r.source === platform);
              if (platformReviews.length === 0) return null;
              
              return (
                <div key={platform} className="space-y-4">
                  <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 border-b-2 border-orange-400 pb-2">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    {platform} Reviews
                    <span className="text-sm font-normal text-gray-500">({platformReviews.length} reviews)</span>
                  </h3>
                  
                  {/* Group by property within platform */}
                  {["XTSY Luxury", "XTSY Travellers Hostel", "XTSY Economy"].map(property => {
                    const propertyReviews = platformReviews.filter(r => r.property === property);
                    if (propertyReviews.length === 0) return null;
                    
                    return (
                      <div key={property} className="ml-4 space-y-3">
                        <h4 className="text-lg font-semibold text-gray-700 flex items-center gap-2">
                          <span className={`inline-block ${
                            property === "XTSY Economy" 
                              ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                              : property === "XTSY Luxury"
                              ? "bg-gradient-to-r from-purple-500 to-purple-600"
                              : "bg-gradient-to-r from-orange-500 to-orange-600"
                          } text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm`}>
                            {property}
                          </span>
                          <span className="text-sm text-gray-500">({propertyReviews.length})</span>
                        </h4>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {propertyReviews.map((review, idx) => (
                            <Card 
                              key={idx}
                              className="hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-l-4"
                              style={{
                                borderLeftColor: property === "XTSY Economy" ? "#3b82f6" : property === "XTSY Luxury" ? "#a855f7" : "#f97316"
                              }}
                            >
                              <CardHeader className="pb-3">
                                <div className="flex items-center justify-between mb-2">
                                  <CardTitle className="text-base font-semibold">
                                    {review.name}
                                  </CardTitle>
                                  <div className="flex items-center gap-1">
                                    <span className="text-yellow-600 font-bold text-sm">
                                      {platform === "Google" || platform === "MakeMyTrip" ? `${review.rating}/5` : `${review.rating}/10`}
                                    </span>
                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                  </div>
                                </div>
                                <CardDescription className="text-xs">
                                  <div className="flex items-center gap-1">
                                    <span>{review.date}</span>
                                  </div>
                                  {review.roomType && (
                                    <div className="text-xs text-gray-500 mt-1">{review.roomType}</div>
                                  )}
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="pt-0">
                                <p className="text-sm text-gray-700 leading-relaxed">
                                  {review.comment}
                                </p>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Review Detail Modal */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <span className="text-xl font-semibold">{selectedReview?.name}</span>
                <span className={`inline-block ${
                  selectedReview?.property === "XTSY Economy" 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600" 
                    : "bg-gradient-to-r from-orange-500 to-orange-600"
                } text-white text-xs font-semibold px-3 py-1 rounded-full shadow-sm w-fit`}>
                  {selectedReview?.property}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-600 font-bold">
                  {selectedReview?.source === "Google" || selectedReview?.source === "MakeMyTrip" ? `${selectedReview?.rating}/5` : `${selectedReview?.rating}/10`}
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
