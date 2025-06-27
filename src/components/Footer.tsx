
import { Instagram, Phone, Mail, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const otaChannels = [
    { name: "Booking.com", url: "#", offer: "10% off on direct bookings" },
    { name: "MakeMyTrip", url: "#", offer: "Exclusive weekend deals" },
    { name: "HostelWorld", url: "#", offer: "Best price guarantee" },
    { name: "GoIbibo", url: "#", offer: "Instant confirmation" }
  ];

  return (
    <footer id="contact" className="bg-slate-900/50 backdrop-blur-lg border-t border-white/10 py-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Company Info */}
          <div className="space-y-4">
            <div className="w-32 h-8 bg-gradient-to-r from-teal-400 to-blue-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-lg">XTSY</span>
            </div>
            <p className="text-gray-400 text-sm">
              Your gateway to unforgettable adventures. Experience comfort, community, and convenience at XTSY Travellers Hostel.
            </p>
            <div className="flex space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-400 hover:text-white hover:bg-white/10 p-2"
                onClick={() => window.open("https://instagram.com/xtsy.one", "_blank")}
              >
                <Instagram className="h-5 w-5" />
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
                  <p className="text-sm">+91 98636 27070</p>
                  <p className="text-sm">+91 88373 17070</p>
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
              <Button className="mt-4 bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 text-white font-semibold text-sm">
                Book Now for Exclusive Offers
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 XTSY Travellers Hostel. All rights reserved. | Designed for adventure seekers and comfort lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
