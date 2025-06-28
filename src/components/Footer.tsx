
import { Instagram, Phone, Mail, ExternalLink, Youtube } from "lucide-react";

const Footer = () => {
  const otaChannels = [
    { 
      name: "Booking.com", 
      url: "https://www.booking.com/hotel/in/xtsy-travellers-hostel.en-gb.html?aid=356980&label=gog235jc-1FCAsobEIWeHRzeS10cmF2ZWxsZXJzLWhvc3RlbEgzWANobIgBAZgBCbgBF8gBDNgBAegBAfgBDIgCAagCA7gCicT-wgbAAgHSAiRjMDA2M2IzNC02OTFlLTRjNDgtOWQ0NS05MDkyMmU1MWRjOGbYAgbgAgE&sid=b65f876d011c498b2585a7d4e406717b&dest_id=-2111081&dest_type=city&dist=0&group_adults=2&group_children=0&hapos=1&hpos=1&no_rooms=1&req_adults=2&req_children=0&room1=A%2CA&sb_price_type=total&sr_order=popularity&srepoch=1751097868&srpvid=97c8ee04b9e5412cd35a3dfa1b7c24e3&type=total&ucfs=1&", 
      offer: "10% off on direct bookings" 
    },
    { 
      name: "MakeMyTrip", 
      url: "https://www.makemytrip.com/hotels/xtsy_traveller_s_hostel_and_rooms-details-shillong.html", 
      offer: "Exclusive weekend deals" 
    },
    { 
      name: "HostelWorld", 
      url: "https://www.hostelworld.com/pwa/hosteldetails.php/XTSY-Travellers-Hostel/Shillong/333065?from=2025-06-29&to=2025-06-30&guests=2", 
      offer: "Best price guarantee" 
    },
    { 
      name: "GoIbibo", 
      url: "https://www.goibibo.com/hotels/xtsy-travellers-hostel-and-rooms-hotel-in-shillong-3246453588683171942/", 
      offer: "Instant confirmation" 
    }
  ];

  const RedditIcon = () => (
    <svg
      className="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z"/>
    </svg>
  );

  return (
    <footer id="contact" className="bg-slate-900/80 backdrop-blur-xl border-t border-white/10 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <img 
              src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Header/Color%20logo%20-%20no%20background.png"
              alt="XTSY Logo"
              className="h-20 w-auto"
            />
            <p className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
              Your gateway to unforgettable adventures. Experience comfort, community, and convenience at XTSY Travellers Hostel.
            </p>
            <div className="flex space-x-4">
              <button
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
                onClick={() => window.open("https://instagram.com/xtsy.one", "_blank")}
              >
                <Instagram className="h-5 w-5" />
              </button>
              <button
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
                onClick={() => window.open("https://youtube.com/@XTSY_Shillong", "_blank")}
              >
                <Youtube className="h-5 w-5" />
              </button>
              <button
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform hover:scale-110"
                onClick={() => {
                  // Reddit URL will be set later
                  console.log("Reddit link will be added later");
                }}
              >
                <RedditIcon />
              </button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Cormorant Garmond', serif" }}>Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <div>
                  <p className="text-sm hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>+91 88373 17070</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <a href="mailto:booking@xtsy.one" className="text-sm hover:text-white transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                  booking@xtsy.one
                </a>
              </div>
            </div>
          </div>

          {/* OTA Channels */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Cormorant Garmond', serif" }}>Book Through</h3>
            <div className="space-y-2">
              {otaChannels.map((channel, index) => (
                <div key={index} className="group">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-gray-400 hover:text-white transition-colors text-sm py-1"
                    style={{ fontFamily: "'Inter', sans-serif" }}
                  >
                    <span>{channel.name}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {channel.offer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white" style={{ fontFamily: "'Cormorant Garmond', serif" }}>Quick Links</h3>
            <div className="space-y-2">
              <a href="#home" className="block text-gray-400 hover:text-white transition-colors text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Home
              </a>
              <a href="#deals" className="block text-gray-400 hover:text-white transition-colors text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Deals & Offers
              </a>
              <a href="#services" className="block text-gray-400 hover:text-white transition-colors text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Services
              </a>
              <a href="#rooms" className="block text-gray-400 hover:text-white transition-colors text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Rooms
              </a>
              <a href="#reviews" className="block text-gray-400 hover:text-white transition-colors text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Reviews
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
            © 2024 XTSY Travellers Hostel. All rights reserved. | Powered by XTSY ONE LLP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
