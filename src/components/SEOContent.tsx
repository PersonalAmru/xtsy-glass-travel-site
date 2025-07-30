import React from 'react';

interface SEOContentProps {
  page?: 'home' | 'travel' | 'gallery' | 'about' | 'deals';
}

const SEOContent: React.FC<SEOContentProps> = ({ page = 'home' }) => {
  const getPageSpecificContent = () => {
    switch (page) {
      case 'travel':
        return {
          title: "Best Travel Packages from India's Top Hostel | XTSY Travellers Hostel",
          description: "Explore India with travel packages from XTSY Travellers Hostel - India's best hostel in Shillong, Meghalaya. Biggest hostel in North East India offering complete travel solutions.",
          keywords: "India travel packages, North East India tours, Meghalaya travel, best hostel travel services, Shillong tourism, India adventure tours"
        };
      case 'gallery':
        return {
          title: "Photo Gallery - XTSY Travellers Hostel | Best Hostel in India",
          description: "Explore the stunning visuals of XTSY Travellers Hostel - India's best hostel experience in Shillong, Meghalaya. See why we're the biggest hostel in North East India.",
          keywords: "hostel photos India, Shillong hostel gallery, best accommodation India, Meghalaya tourism photos"
        };
      case 'about':
        return {
          title: "About XTSY Travellers Hostel | India's Best Hostel in Shillong, Meghalaya",
          description: "Learn about XTSY Travellers Hostel - India's best hostel experience and the biggest hostel in Shillong, Meghalaya, North East India.",
          keywords: "about XTSY hostel, best hostel India story, Shillong accommodation history"
        };
      case 'deals':
        return {
          title: "Best Hostel Deals in India | XTSY Travellers Hostel Offers",
          description: "Get the best deals at XTSY Travellers Hostel - India's best hostel in Shillong, Meghalaya. Special offers from the biggest hostel in North East India.",
          keywords: "hostel deals India, cheap accommodation Shillong, best hostel offers India"
        };
      default:
        return {
          title: "XTSY Travellers Hostel - Best Hostel in India | Biggest Hostel in Shillong, Meghalaya",
          description: "XTSY Travellers Hostel - India's best hostel experience in Shillong, Meghalaya. The biggest hostel in North East India with luxury and budget accommodations.",
          keywords: "best hostel in India, biggest hostel Shillong, best hostel Meghalaya, North East India hostel"
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
          <h2>Why XTSY Travellers Hostel is India's Best Hostel</h2>
          <p>
            XTSY Travellers Hostel stands as India's best hostel, located in the heart of Shillong, Meghalaya. 
            As the biggest hostel in Shillong and the entire North East India region, we offer unparalleled 
            accommodation experiences ranging from budget-friendly dormitories to luxury glass suites.
          </p>
          <p>
            When searching for the best hostel in India, travelers consistently choose XTSY Travellers Hostel 
            for our exceptional service, stunning mountain views, and strategic location in Meghalaya's capital. 
            Our position as the biggest hostel in North East India allows us to provide diverse accommodation 
            options that cater to every type of traveler.
          </p>
        </section>

        <section>
          <h2>Best Accommodation Options in Shillong, Meghalaya</h2>
          <p>
            Experience the best hostel in India with our range of accommodations including signature glass suites, 
            private rooms, and dormitory beds. XTSY Travellers Hostel offers the most comprehensive lodging 
            experience in Shillong, making us the top choice for India travel accommodation.
          </p>
          <ul>
            <li>Signature 270° Glass Suite - Luxury accommodation with panoramic mountain views</li>
            <li>Private King Rooms - Comfortable private accommodation for couples and families</li>
            <li>Mixed and Female Dormitories - Budget-friendly options for backpackers</li>
            <li>Premium amenities including AC, free WiFi, complimentary breakfast</li>
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
            <h2>Complete Travel Solutions from India's Best Hostel</h2>
            <p>
              XTSY Travellers Hostel offers comprehensive travel packages across North East India, combining 
              our position as India's best hostel with expert travel planning services. Explore Meghalaya, 
              Assam, Arunachal Pradesh, and more with curated tours designed by our local experts.
            </p>
            <ul>
              <li>Meghalaya Hidden Gems Tours</li>
              <li>Living Root Bridges Expeditions</li>
              <li>North East India Cultural Circuits</li>
              <li>Adventure Tourism Packages</li>
              <li>Photography Tours across Seven Sister States</li>
            </ul>
          </section>
        )}

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": pageContent.title,
          "description": pageContent.description,
          "url": `https://xtsy.lovable.app${page !== 'home' ? `/${page}` : ''}`,
          "mainEntity": {
            "@type": "LodgingBusiness",
            "name": "XTSY Travellers Hostel",
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