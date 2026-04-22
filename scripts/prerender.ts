/**
 * Build-Time Pre-rendering Script for SEO Pages
 * 
 * Generates static HTML files for all 300+ programmatic SEO pages
 * so that search engine crawlers see fully-rendered content, meta tags,
 * and structured data without needing JavaScript execution.
 * 
 * Usage: tsx scripts/prerender.ts (runs automatically after vite build)
 */

import fs from 'fs';
import path from 'path';

// We need to import the SEO data at build time.
// Since seoPages.ts uses TypeScript, we use dynamic import via tsx.
async function loadSEOPages() {
  // tsx executes this script with TypeScript loader, so import the .ts source
  // directly. The previous `.js` extension caused the import to fail silently
  // and resulted in zero pre-rendered HTML files (the #1 indexation blocker).
  const mod = await import('../src/data/seoPages');
  return (mod as any).ALL_SEO_PAGES;
}

interface SEOPageData {
  slug: string;
  category: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  sections: { heading: string; content: string; listItems?: string[] }[];
  faqs: { question: string; answer: string }[];
  schemaType: string;
  relatedSlugs: string[];
  ctaText: string;
  ctaLink: string;
  keywords: string[];
}

const SITE_URL = 'https://xtsy.one';
const OG_IMAGE = 'https://storage.googleapis.com/gpt-engineer-file-uploads/1WJsBBRRZpg9MH8fICqqeJ2sC6q1/social-images/social-1765259372136-with_padding.png';

function buildSchema(page: SEOPageData): string {
  const base: any = {
    '@context': 'https://schema.org',
    '@type': page.schemaType,
    name: page.h1,
    description: page.metaDescription,
    url: `${SITE_URL}/${page.slug}`,
  };

  if (['Hostel', 'Hotel', 'LodgingBusiness'].includes(page.schemaType)) {
    // Only attach reviews to TRUE property routes — review spam on
    // informational pages risks Google manual action.
    const PROPERTY_ROUTES = new Set([
      'best-hostel-in-shillong',
      'xtsy-travellers-hostel',
      'experience-by-xtsy',
      'xtsy-270-glasshouse',
      'hostel-shillong',
    ]);
    Object.assign(base, {
      address: { '@type': 'PostalAddress', streetAddress: 'Mawdiangdiang Road', addressLocality: 'Shillong', addressRegion: 'Meghalaya', postalCode: '793018', addressCountry: 'IN' },
      telephone: '+91-8837317070',
      priceRange: '₹329 - ₹4,999',
    });
    if (PROPERTY_ROUTES.has(page.slug)) {
      (base as any).aggregateRating = { '@type': 'AggregateRating', ratingValue: '4.8', reviewCount: '320', bestRating: '5', worstRating: '1' };
    }
  }

  if (page.schemaType === 'TouristTrip') {
    Object.assign(base, { touristType: 'Adventure', provider: { '@type': 'TravelAgency', name: 'XTSY', url: SITE_URL } });
  }

  if (page.schemaType === 'TouristAttraction') {
    Object.assign(base, { isAccessibleForFree: true, address: { '@type': 'PostalAddress', addressRegion: 'Meghalaya', addressCountry: 'IN' } });
  }

  return JSON.stringify(base);
}

function buildFAQSchema(faqs: SEOPageData['faqs']): string {
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question', name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  });
}

function buildBreadcrumbSchema(page: SEOPageData): string {
  const categoryLabels: Record<string, string> = {
    hostels: 'Hostels', hotels: 'Hotels', homestays: 'Homestays', glamping: 'Glamping',
    accommodation: 'Accommodation', rentals: 'Rentals', tours: 'Tour Packages',
    'travel-guides': 'Travel Guides', destinations: 'Destinations', attractions: 'Attractions',
    itineraries: 'Itineraries', activities: 'Activities', hospitals: 'Near Hospitals',
    restaurants: 'Dining', weddings: 'Weddings & Events', transport: 'Transport',
    'competitor-capture': 'Hostel Comparison', 'food-dining': 'Food & Dining',
    seasonal: 'Seasonal Guides', events: 'Events', 'travel-agency': 'Travel Agency',
  };
  const label = categoryLabels[page.category] || page.category;
  return JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_URL}/` },
      { '@type': 'ListItem', position: 2, name: label, item: `${SITE_URL}/things-to-do-in-meghalaya` },
      { '@type': 'ListItem', position: 3, name: page.h1 },
    ],
  });
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function generatePageHTML(page: SEOPageData, templateHTML: string): string {
  // Build the visible content that crawlers will see
  const sectionsHTML = page.sections.map(s => {
    let html = `<section><h2>${escapeHtml(s.heading)}</h2><p>${escapeHtml(s.content)}</p>`;
    if (s.listItems) {
      html += '<ul>' + s.listItems.map(item => `<li>${escapeHtml(item)}</li>`).join('') + '</ul>';
    }
    html += '</section>';
    return html;
  }).join('\n');

  const faqsHTML = page.faqs.length > 0
    ? `<section><h2>Frequently Asked Questions</h2>${page.faqs.map(f =>
        `<details><summary>${escapeHtml(f.question)}</summary><p>${escapeHtml(f.answer)}</p></details>`
      ).join('')}</section>`
    : '';

  const bodyContent = `
    <div id="seo-prerender" style="max-width:800px;margin:0 auto;padding:20px;">
      <nav aria-label="breadcrumb"><a href="/">Home</a> &gt; <a href="/things-to-do-in-meghalaya">${escapeHtml(page.category)}</a> &gt; ${escapeHtml(page.h1)}</nav>
      <h1>${escapeHtml(page.h1)}</h1>
      <p>${escapeHtml(page.intro)}</p>
      ${sectionsHTML}
      ${faqsHTML}
      <div><a href="${escapeHtml(page.ctaLink)}">${escapeHtml(page.ctaText)}</a></div>
      <p>Plan Your Meghalaya Trip with XTSY — Stay at Shillong's #1 rated hostel. Dorms from ₹499, private rooms from ₹1,499.</p>
    </div>`;

  // Build structured data scripts
  let schemaScripts = `<script type="application/ld+json">${buildSchema(page)}</script>\n`;
  schemaScripts += `<script type="application/ld+json">${buildBreadcrumbSchema(page)}</script>\n`;
  if (page.faqs.length > 0) {
    schemaScripts += `<script type="application/ld+json">${buildFAQSchema(page.faqs)}</script>\n`;
  }

  // Replace title, meta, and inject content
  let html = templateHTML;

  // Replace <title>
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(page.title)}</title>`);

  // Replace meta description
  html = html.replace(
    /<meta name="description" content="[^"]*">/,
    `<meta name="description" content="${escapeHtml(page.metaDescription)}">`
  );

  // Replace meta keywords
  html = html.replace(
    /<meta name="keywords" content="[^"]*">/,
    `<meta name="keywords" content="${escapeHtml(page.keywords.join(', '))}">`
  );

  // Replace canonical
  html = html.replace(
    /<link rel="canonical" href="[^"]*" \/>/,
    `<link rel="canonical" href="${SITE_URL}/${page.slug}" />`
  );

  // Replace OG tags
  html = html.replace(/<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${escapeHtml(page.title)}" />`);
  html = html.replace(/<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${escapeHtml(page.metaDescription)}" />`);
  html = html.replace(/<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${SITE_URL}/${page.slug}" />`);

  // Replace Twitter tags
  html = html.replace(/<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${escapeHtml(page.title)}" />`);
  html = html.replace(/<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${escapeHtml(page.metaDescription)}" />`);

  // Inject structured data before </head>
  html = html.replace('</head>', `${schemaScripts}</head>`);

  // Inject pre-rendered content into <div id="root">
  // The SPA will hydrate over this content when JS loads
  html = html.replace('<div id="root"></div>', `<div id="root">${bodyContent}</div>`);

  return html;
}

async function prerender() {
  const distDir = path.resolve(process.cwd(), 'dist');
  const indexPath = path.join(distDir, 'index.html');

  if (!fs.existsSync(indexPath)) {
    console.error('❌ dist/index.html not found. Run "vite build" first.');
    process.exit(1);
  }

  const templateHTML = fs.readFileSync(indexPath, 'utf-8');
  
  let pages: SEOPageData[];
  try {
    pages = await loadSEOPages();
  } catch (err) {
    console.error('❌ Failed to load SEO pages:', err);
    process.exit(1);
  }

  console.log(`🔧 Pre-rendering ${pages.length} SEO pages...`);

  let success = 0;
  let failed = 0;

  for (const page of pages) {
    try {
      const pageDir = path.join(distDir, page.slug);
      fs.mkdirSync(pageDir, { recursive: true });

      const html = generatePageHTML(page, templateHTML);
      fs.writeFileSync(path.join(pageDir, 'index.html'), html, 'utf-8');
      success++;
    } catch (err) {
      console.error(`  ❌ Failed: ${page.slug}`, err);
      failed++;
    }
  }

  // Also pre-render places-to-visit pages if they exist
  const placesDir = path.join(distDir, 'places-to-visit');
  if (!fs.existsSync(placesDir)) {
    fs.mkdirSync(placesDir, { recursive: true });
  }

  console.log(`\n✅ Pre-rendered ${success} pages successfully.`);
  if (failed > 0) console.log(`⚠️  ${failed} pages failed.`);
  console.log(`📁 Output: ${distDir}/`);
}

prerender().catch(console.error);
