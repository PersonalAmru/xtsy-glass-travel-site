
import { Instagram, Youtube, MapPin, Mail, Phone, ExternalLink } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contact" className="bg-gradient-to-br from-gray-900 via-black to-gray-900 py-12 sm:py-16 px-3 sm:px-4 relative overflow-hidden">
      {/* Background animations */}
      <div className="absolute inset-0">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="absolute w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-r from-white/5 to-gray-300/5 rounded-full blur-xl animate-pulse"
            style={{
              left: `${15 + i * 25}%`,
              bottom: `${20 + i * 15}%`,
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${4 + i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-8 sm:mb-12">
          {/* Logo and Description */}
          <div className="lg:col-span-1">
            <img 
              src="https://oidnydyyjyjfnyadhyzn.supabase.co/storage/v1/object/public/image-assets/Header/Color%20logo%20-%20no%20background.png"
              alt="XTSY Logo"
              className="h-12 sm:h-16 w-auto mb-3 sm:mb-4"
            />
            <p className="text-gray-400 mb-4 sm:mb-6 font-seasons text-sm sm:text-base text-justify">
              Experience the vibrant culture and breathtaking landscapes of Shillong with XTSY. 
              Your gateway to authentic Northeast Indian hospitality and unforgettable adventures.
            </p>
            <div className="flex space-x-3 sm:space-x-4">
              <a 
                href="https://www.instagram.com/xtsy.one" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Instagram className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
              <a 
                href="https://www.youtube.com/@XTSY_Shillong" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200"
              >
                <Youtube className="h-5 w-5 sm:h-6 sm:w-6" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-4 font-serif-sans text-sm sm:text-base">Quick Links</h3>
            <ul className="space-y-1 sm:space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons text-sm">Home</a></li>
              <li><a href="#rooms" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons text-sm">Our Properties</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons text-sm">Services</a></li>
              <li><a href="/gallery" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons text-sm">Gallery</a></li>
              <li><a href="#reviews" className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons text-sm">Reviews</a></li>
            </ul>
          </div>

          {/* Find us on */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-4 font-serif-sans text-sm sm:text-base">Find us on</h3>
            <div className="space-y-2">
              <a 
                href="https://www.booking.com/searchresults.en-gb.html?aid=356980&label=gog235jc-1BCAsobEIWeHRzeS10cmF2ZWxsZXJzLWhvc3RlbEgzWANobIgBAZgBCbgBF8gBDNgBAegBAYgCAagCA7gC3J__wgbAAgHSAiRiZWViMTNhYS0wNjU4LTRiM2EtOGJiNy1lZmNiODdkYTdlZTDYAgXgAgE&no_rooms=1&highlighted_hotels=13259692&redirected=1&city=-2111081&hlrd=user_sh&group_adults=2&source=hotel&group_children=0&expand_sb=1&keep_landing=1&sid=b65f876d011c498b2585a7d4e406717b"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons text-xs sm:text-sm flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                Booking.com
              </a>
              <a 
                href="https://www.makemytrip.com/hotels/xtsy_traveller_s_hostel_and_rooms-details-shillong.html?cmp=SEM|D|DH|G|DSA|DH_DSA_Mobile|Pmax&gad_source=1&gad_campaignid=21268867335&gbraid=0AAAAAD5Az1TjX8RG_VF19G6BJkoKdb85-&gclid=Cj0KCQjwpf7CBhCfARIsANIETVqkJpgBb6HfasOuMJFUKf4gPNqo8KxMOY_kbKNvxy9jk1zGTUmbUjsaAt4SEALw_wcB"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons text-xs sm:text-sm flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                MakeMyTrip
              </a>
              <a 
                href="https://www.hostelworld.com/pwa/hosteldetails.php/XTSY-Travellers-Hostel/Shillong/333065?from=2025-06-29&to=2025-07-02&guests=2"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons text-xs sm:text-sm flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                HostelWorld
              </a>
              <a 
                href="https://www.goibibo.com/hotels/xtsy-travellers-hostel-and-rooms-hotel-in-shillong-3246453588683171942/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors duration-200 font-seasons text-xs sm:text-sm flex items-center gap-2"
              >
                <ExternalLink className="h-3 w-3" />
                GoIbibo
              </a>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold mb-3 sm:mb-4 font-serif-sans text-sm sm:text-base">Contact</h3>
            <div className="space-y-2 text-gray-400 font-seasons text-xs sm:text-sm">
              <p className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <a 
                  href="https://maps.app.goo.gl/BsKV2mhjRSqsECT39"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors duration-200"
                >
                  Diengiong, New Shillong Township, Meghalaya - 793018
                  <br />
                  <span className="text-blue-400 underline">Get Directions</span>
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a 
                  href="mailto:booking@xtsy.one"
                  className="hover:text-white transition-colors duration-200"
                >
                  booking@xtsy.one
                </a>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a 
                  href="tel:+918837317070"
                  className="hover:text-white transition-colors duration-200"
                >
                  +91 88373 17070
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 pt-6 sm:pt-8 text-center">
          <p className="text-gray-400 font-seasons text-xs sm:text-sm">
            © 2024 XTSY. All rights reserved. | Live the Shillong Vibe | Powered by XTSY ONE LLP
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
