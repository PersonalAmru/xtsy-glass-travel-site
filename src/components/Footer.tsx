
import { Instagram, Phone, Mail, ExternalLink, Youtube } from "lucide-react";
import { Button } from "@/components/ui/button";

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

  return (
    <footer id="contact" className="bg-slate-900/30 backdrop-blur-xl border-t border-white/10 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <img 
              src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Header/Color%20logo%20-%20no%20background.png"
              alt="XTSY Logo"
              className="h-14 w-auto"
            />
            <p className="text-gray-400 text-sm">
              Your gateway to unforgettable adventures. Experience comfort, community, and convenience at XTSY Travellers Hostel.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 backdrop-blur-sm"
                onClick={() => window.open("https://instagram.com/xtsy.one", "_blank")}
              >
                <Instagram className="h-5 w-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2 backdrop-blur-sm"
                onClick={() => window.open("https://youtube.com/@XTSY_Shillong", "_blank")}
              >
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Contact Us</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-400">
                <Phone className="h-4 w-4" />
                <div>
                  <p className="text-sm hover:text-white transition-colors">+91 98636 27070</p>
                  <p className="text-sm hover:text-white transition-colors">+91 88373 17070</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Mail className="h-4 w-4" />
                <a href="mailto:booking@xtsy.one" className="text-sm hover:text-white transition-colors">
                  booking@xtsy.one
                </a>
              </div>
            </div>
          </div>

          {/* OTA Channels */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Book Through</h3>
            <div className="space-y-2">
              {otaChannels.map((channel, index) => (
                <div key={index} className="group">
                  <a
                    href={channel.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between text-gray-400 hover:text-white transition-colors text-sm py-1"
                  >
                    <span>{channel.name}</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                  <p className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                    {channel.offer}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Quick Links</h3>
            <div className="space-y-2">
              <a href="#home" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Home
              </a>
              <a href="#services" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Services
              </a>
              <a href="#rooms" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Rooms
              </a>
              <a href="#reviews" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Reviews
              </a>
              <Button className="mt-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold text-sm backdrop-blur-sm">
                Book Now for Exclusive Offers
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 XTSY Travellers Hostel. All rights reserved. | Powered by XTSY ONE LLP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
