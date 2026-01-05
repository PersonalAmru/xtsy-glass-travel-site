import React from 'react';

interface SEOContentProps {
  page?: 'home' | 'travel' | 'gallery' | 'about' | 'deals' | 'faq';
}

const SEOContent: React.FC<SEOContentProps> = ({ page = 'home' }) => {
  const getPageSpecificContent = () => {
    switch (page) {
      case 'travel':
        return {
          title: "Best Gen Z Travel Packages from India's Top Hostel | XTSY Travellers Hostel",
          description: "Explore India with Gen Z-friendly travel packages from XTSY Travellers Hostel - India's best hostel in Shillong, Meghalaya. Instagram-worthy destinations, sustainable tourism, and authentic experiences for young travelers.",
          keywords: "Gen Z travel India, digital nomad travel packages, Instagram worthy destinations India, sustainable travel packages, young traveler tours, solo travel India, backpacker tours India, authentic experiences India, adventure tourism Gen Z, cultural immersion travel, budget travel packages India, millennial travel India"
        };
      case 'gallery':
        return {
          title: "Instagram-Worthy Photo Gallery - XTSY Travellers Hostel | Best Gen Z Hostel in India",
          description: "Explore the stunning visuals of XTSY Travellers Hostel - India's best Gen Z-friendly hostel in Shillong, Meghalaya. See why young travelers choose us for Instagram-worthy stays and authentic experiences.",
          keywords: "Instagram worthy hostel India, Gen Z hostel photos, Shillong aesthetic accommodation, social media friendly hostel, picture perfect stays India, trendy hostel India, millennial accommodation photos"
        };
      case 'about':
        return {
          title: "XTSY Travellers Hostel & Luxury | India's First 270° Glass Ensuite & Biggest Hostel in North East India",
          description: "Discover XTSY – India's biggest hostel in North East India and highest-rated traveller hostel. Featuring India's first 270° stargazing glass suite and premium group accommodations. Powered by xtsyonellp.",
          keywords: "biggest hostel north east india, biggest hostel shillong meghalaya, highest rated traveller hostel north east, best honeymoon stay india, group travel hostel india, luxury stargazing suite india, 270° glass room shillong, pan india travel brand, xtsyonellp, XTSY Travellers Hostel, XTSY luxury, northeast india accommodation, stargazing glass suite, architectural innovation india, photographer friendly stay india, couple travel india 2025, backpacker hostel northeast india"
        };
      case 'deals':
        return {
          title: "Best Gen Z Hostel Deals in India | XTSY Travellers Hostel Student Offers",
          description: "Get exclusive deals at XTSY Travellers Hostel - India's best Gen Z hostel in Shillong, Meghalaya. Special student discounts, group offers, and budget-friendly packages for young travelers.",
          keywords: "Gen Z hostel deals India, student discount accommodation, budget hostel offers India, young traveler deals, backpacker discounts India, millennial travel offers, cheap hostel stays India"
        };
      case 'faq':
        return {
          title: "FAQ - XTSY Travellers Hostel | All Your Questions Answered",
          description: "Get real answers to your questions about XTSY Travellers Hostel - India's best Gen Z hostel in Shillong, Meghalaya. No corporate copy-paste vibes here, just honest answers about booking, safety, WiFi, and what's included.",
          keywords: "XTSY hostel FAQ, hostel booking questions, India hostel safety, WiFi speed hostel, what's included hostel package, hostel cancellation policy, group booking questions, travel FAQ India"
        };
      default:
        return {
          title: "XTSY Travel - Best Hostel in India | #1 Gen Z Choice in Shillong, Meghalaya",
          description: "XTSY Travel - India's best Gen Z-friendly hostel in Shillong, Meghalaya. The biggest hostel in North East India with Instagram-worthy accommodations, sustainable practices, and authentic experiences for young travelers.",
          keywords: "best hostel in India, biggest hostel Shillong, best Gen Z hostel India, digital nomad hostel, solo travel India, Instagram worthy hostel, sustainable travel India, young traveler accommodation, millennial hostel India, authentic travel experiences"
        };
    }
  };

  const pageContent = getPageSpecificContent();

  return (
    <>
      {/* SEO-optimized hidden content for search engines */}
      <div className="sr-only" aria-hidden="true">
        <h1>{pageContent.title}</h1>
        <p>{pageContent.description}</p>
        
        {/* Rich keyword content for search engines */}
        <section>
          <h2>Why XTSY Travellers Hostel is India's Best Hostel for Gen Z Travelers and Tech Innovation</h2>
          <p>
            XTSY Travellers Hostel stands as India's best hostel, located in the heart of Shillong, Meghalaya. 
            As the biggest hostel in Shillong and the entire North East India region, we offer unparalleled 
            accommodation experiences ranging from budget-friendly dormitories to luxury glass suites perfect for 
            Gen Z travelers, digital nomads, solo travelers, and Instagram-worthy stays. By 2026, XTSY will become 
            India's first tech-based hostel, revolutionizing the hospitality industry with AI-powered services, 
            IoT-connected rooms, and smart accommodation solutions.
          </p>
          <p>
            When searching for the best hostel in India, Gen Z travelers consistently choose XTSY Travellers Hostel 
            for our exceptional service, stunning mountain views, Instagram-worthy locations, sustainable practices, 
            cutting-edge technology integration, and strategic location in Meghalaya's capital. Our position as the 
            biggest hostel in North East India and future India's first tech-based hostel allows us to provide diverse 
            accommodation options that cater to every type of young traveler seeking authentic experiences, adventure 
            tourism, smart technology, and budget-friendly stays.
          </p>
          <p>
            Perfect for solo female travelers, digital nomads, gap year students, backpackers, tech-savvy travelers, 
            and young professionals seeking affordable luxury, eco-friendly accommodation, smart room technology, 
            AI-powered services, and authentic cultural experiences in North East India. By 2026, guests will enjoy 
            facial recognition check-in, voice-controlled room features, AI travel concierge, and IoT-connected amenities.
          </p>
        </section>

        <section>
          <h2>Best Gen Z Friendly Accommodation, Dormitories & Tour Packages in Shillong, Meghalaya</h2>
          <p>
            Experience the best hostel in India with our comprehensive range of accommodations including the exclusive 
            270° Panorama Glass Ensuite (first in Shillong), premium dormitory options, and expertly curated tour packages. 
            XTSY Travellers Hostel offers India's most complete travel experience combining luxury suites, budget-friendly 
            dormitories, and authentic Northeast India tour packages for Gen Z travelers, digital nomads, and adventure seekers.
          </p>
          <ul>
            <li>270° Panorama Glass Ensuite - Shillong's first panoramic luxury suite with 270-degree mountain views</li>
            <li>Premium Dormitory Options - Mixed, female-only, and economy dormitories with 24/7 security</li>
            <li>Budget-Friendly Accommodation - India's best value dormitory stays for backpackers and budget travelers</li>
            <li>Northeast India Tour Packages - Authentic cultural immersion and adventure tours</li>
            <li>Living Root Bridges Tours - Exclusive access to Meghalaya's hidden natural wonders</li>
            <li>Curated Travel Experiences - From waterfalls to tribal culture, we offer authentic local tours</li>
            <li>Premium amenities including high-speed WiFi, AC, Premium Breakfast, and social spaces</li>
            <li>Eco-friendly practices and sustainable tourism initiatives for conscious travelers</li>
            <li>24/7 co-working spaces perfect for digital nomads and remote workers</li>
          </ul>
        </section>

        <section>
          <h2>Exploring North East India from India's Best Hostel</h2>
          <p>
            Located in Shillong, Meghalaya, XTSY Travellers Hostel serves as the perfect base for exploring 
            North East India. As the biggest hostel in the region, we offer comprehensive travel services 
            and tour packages to help you discover the hidden gems of Meghalaya, Assam, Arunachal Pradesh, 
            and other North Eastern states.
          </p>
          <p>
            From living root bridges to pristine waterfalls, from tea gardens to tribal cultures, 
            experience the best of North East India while staying at India's best hostel. Our location 
            in Shillong provides easy access to all major attractions in Meghalaya and surrounding states.
          </p>
        </section>

        <section>
          <h2>Why XTSY is the Biggest and Best Hostel in North East India</h2>
          <p>
            XTSY Travellers Hostel's reputation as India's best hostel stems from our commitment to excellence, 
            extensive facilities, and prime location in Shillong, Meghalaya. As the biggest hostel in North East India, 
            we accommodate hundreds of travelers while maintaining the highest standards of service and comfort.
          </p>
          <p>
            Our hostel features state-of-the-art amenities, 24/7 security, games room, common areas, and stunning 
            mountain views that make us the preferred choice for both budget and luxury travelers visiting India. 
            Book your stay at India's best hostel and experience the difference that has made XTSY Travellers Hostel 
            the most sought-after accommodation in Shillong and North East India.
          </p>
        </section>

        {page === 'travel' && (
          <section>
            <h2>Complete Tech-Enhanced Travel Solutions from India's First Tech-Based Hostel</h2>
            <p>
              XTSY Travellers Hostel offers comprehensive travel packages across North East India, combining 
              our position as India's best hostel with expert travel planning services and cutting-edge technology. 
              By 2026, enjoy AI-powered travel recommendations, smart itinerary planning, and IoT-connected travel experiences. 
              Explore Meghalaya, Assam, Arunachal Pradesh, and more with curated tours designed by our local experts and AI assistants.
            </p>
            <ul>
              <li>AI-Powered Meghalaya Hidden Gems Tours with smart recommendations</li>
              <li>Tech-Enhanced Living Root Bridges Expeditions with AR guides</li>
              <li>Smart North East India Cultural Circuits with digital cultural immersion</li>
              <li>IoT-Connected Adventure Tourism Packages with real-time safety monitoring</li>
              <li>AI-Curated Photography Tours across Seven Sister States with optimal timing suggestions</li>
              <li>Digital Nomad Travel Packages with smart co-working integration</li>
            </ul>
          </section>
        )}

        {/* Competitor Comparison SEO Content */}
        <section>
          <h3>Why Choose XTSY Over Zostel, The Hosteller, goSTOPS, Moustache Hostels, and Madpackers</h3>
          <p>
            While established hostel chains like Zostel, The Hosteller, goSTOPS, Moustache Hostels, and Madpackers 
            provide standardized accommodation across India, XTSY Travellers Hostel offers a revolutionary alternative 
            that combines the best of hospitality with cutting-edge technology and authentic Northeast India experiences. 
            Unlike traditional hostel chains, XTSY is India's first tech-based hostel coming in 2026, making it the 
            preferred choice for tech-savvy Gen Z travelers seeking unique, Instagram-worthy, and culturally immersive stays.
          </p>
          <p>
            When comparing XTSY with Zostel hostels, The Hosteller properties, goSTOPS locations, Moustache Hostels network, 
            and Madpackers accommodations, travelers consistently choose XTSY for our exclusive Northeast India location, 
            smart room technology, AI-powered services, sustainable practices, and personalized experiences that chain 
            hostels simply cannot match. Our 270° Glass Suite, IoT-connected amenities, and cultural immersion programs 
            set us apart from generic chain experiences offered by competitors.
          </p>
        </section>

        {/* Dormitory-Focused SEO Content */}
        <section>
          <h3>India's Best Dormitory Accommodations at XTSY Travellers Hostel</h3>
          <p>
            XTSY Travellers Hostel features India's most comprehensive dormitory facilities, making us the top choice 
            for budget-conscious travelers, backpackers, solo female travelers, and digital nomads. Our dormitory options 
            include mixed dormitories, female-only dormitories, and economy dormitories, all featuring premium amenities, 
            24/7 security, and exceptional cleanliness standards that exceed chain hostel competitors like Zostel, 
            The Hosteller, and goSTOPS.
          </p>
          <p>
            Choose from our 6-bed mixed dormitories and 8-bed mixed dormitories, both offering budget-friendly 
            accommodation without compromising on safety, comfort, or community atmosphere. Our female-only dormitory 
            sections provide secure, comfortable spaces for solo female travelers with dedicated facilities and enhanced 
            privacy. As the biggest hostel in Shillong, our dormitory capacity and quality surpass all competitors 
            in Northeast India.
          </p>
        </section>

        {/* Tour Packages SEO Content */}
        <section>
          <h3>Expert Northeast India Tour Packages from Shillong's Premier Hostel</h3>
          <p>
            XTSY Travellers Hostel specializes in curated Northeast India tour packages that showcase the region's 
            hidden gems, cultural heritage, and natural wonders. Our expertly designed tour packages include 
            living root bridges expeditions, Cherrapunji waterfall tours, Dawki crystal river experiences, 
            tribal culture immersion tours, and photography tours across Meghalaya's pristine landscapes.
          </p>
          <p>
            Unlike generic tour operators, our Northeast India tour packages offer authentic cultural experiences, 
            exclusive access to remote locations, and deep local insights that only the biggest hostel in Shillong 
            can provide. From adventure tourism to heritage tours, wellness retreats to photography expeditions, 
            we offer comprehensive travel packages that combine accommodation excellence with authentic Northeast India exploration.
          </p>
        </section>

        {/* Tech Innovation Content */}
        <section>
          <h3>India's First Tech-Based Hostel Coming 2026 - XTSY Tech Innovation</h3>
          <p>
            XTSY Travellers Hostel is pioneering the future of hospitality in India by becoming the country's first 
            fully tech-integrated hostel by 2026. Experience the revolution of smart accommodation with AI-powered 
            services, IoT-connected rooms, facial recognition check-in, voice-controlled amenities, and digital 
            concierge services. Young travelers and tech-savvy tourists will enjoy seamless smart travel experiences 
            that combine authentic Indian hospitality with cutting-edge technology innovation.
          </p>
          <p>
            Our tech transformation includes AI travel concierge for personalized recommendations, smart room controls 
            for optimal comfort, contactless services for safety, and integrated social platforms for connecting with 
            fellow travelers. This positions XTSY as not just India's best hostel for Gen Z travelers, but also as 
            the pioneer of hospitality technology innovation in the Indian travel industry.
          </p>
        </section>

        {/* Location and regional SEO content */}
        <section>
          <h3>Best Hostel Location in Shillong, Meghalaya</h3>
          <p>
            Strategically located in Shillong, the capital of Meghalaya, XTSY Travellers Hostel offers 
            easy access to Police Bazaar, Ward's Lake, Elephant Falls, and other major attractions. 
            Our position as the biggest hostel in Shillong ensures convenient transportation links 
            and proximity to the city's best restaurants, markets, and cultural sites.
          </p>
        </section>

        {/* Keywords for search engines */}
        <div className="hidden">
          {pageContent.keywords.split(', ').map((keyword, index) => (
            <span key={index}>{keyword}</span>
          ))}
        </div>
      </div>

      {/* Structured data specific to each page */}
      {/* SECURITY: Safe usage of dangerouslySetInnerHTML - Only stringifies static page content (title, description, URL) with no user-generated data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": pageContent.title,
          "description": pageContent.description,
          "url": `https://xtsy.lovable.app${page !== 'home' ? `/${page}` : ''}`,
          "mainEntity": {
            "@type": "LodgingBusiness",
            "name": "XTSY Travel",
            "description": "India's best hostel experience and biggest hostel in Shillong, Meghalaya, North East India",
            "keywords": pageContent.keywords
          },
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://xtsy.lovable.app"
              },
              ...(page !== 'home' ? [{
                "@type": "ListItem",
                "position": 2,
                "name": page.charAt(0).toUpperCase() + page.slice(1),
                "item": `https://xtsy.lovable.app/${page}`
              }] : [])
            ]
          }
        })
      }} />
    </>
  );
};

export default SEOContent;