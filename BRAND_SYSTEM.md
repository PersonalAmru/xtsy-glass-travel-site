# XTSY Brand Design System
## The Definitive Visual Identity Framework

> **Brand Essence**: Bold adventure meets premium comfort. XTSY is not a chain hostel — it's a movement for conscious, experience-driven travelers.

---

## 1. Core Brand Colors (from Logo)

The XTSY logo uses a warm orange-to-crimson gradient — fire tones that evoke adventure, energy, and warmth.

| Token | HSL | Hex | Usage |
|-------|-----|-----|-------|
| `--brand-primary` | `25 95% 53%` | `#F97316` | Logo, primary CTAs, brand marks |
| `--brand-secondary` | `0 84% 60%` | `#DC2626` | Gradient endpoints, urgency accents |
| `--brand-accent` | `33 100% 50%` | `#FF9500` | Highlights, hover states, warmth |

### Brand Gradient (Signature)
```css
background: linear-gradient(135deg, hsl(25 95% 53%), hsl(0 84% 60%));
```
This is the **XTSY Fire Gradient** — used on logo fallbacks, badges, primary CTAs, and hero accents.

---

## 2. Extended UI Palette (Website Surfaces)

### Dark Theme (Primary — site default)
| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `222 47% 4%` | Page background (#020617 slate-950) |
| `--foreground` | `0 0% 95%` | Primary text |
| `--card` | `222 30% 8%` | Card surfaces |
| `--muted` | `220 15% 15%` | Subtle backgrounds |
| `--muted-foreground` | `220 10% 55%` | Secondary text |
| `--surface-elevated` | `222 25% 12%` | Elevated surfaces (modals, sheets) |

### Light Theme (Optional — booking flows)
| Token | HSL | Usage |
|-------|-----|-------|
| `--background` | `40 33% 97%` | Warm cream page background |
| `--foreground` | `220 15% 15%` | Dark text |
| `--card` | `0 0% 100%` | Pure white cards |
| `--muted` | `30 20% 95%` | Warm muted surfaces |

### Neutral Scale (Warm-tinted)
| Level | HSL | Usage |
|-------|-----|-------|
| `--neutral-50` | `30 20% 97%` | Lightest surface |
| `--neutral-100` | `30 15% 93%` | Light dividers |
| `--neutral-200` | `25 12% 85%` | Borders |
| `--neutral-700` | `220 15% 30%` | Muted dark text |
| `--neutral-900` | `222 47% 4%` | Deepest dark |

---

## 3. CTA / Conversion Colors

| State | Color | Token | Usage |
|-------|-------|-------|-------|
| **Primary CTA** | Orange Fire Gradient | `--cta-primary` | "Book Now", "Reserve", "Check Availability" |
| **Secondary CTA** | White/10 border + ghost | `--cta-secondary` | "Learn More", "View Details" |
| **Success** | `142 76% 36%` | `--success` | Booking confirmed, availability |
| **Warning** | `38 92% 50%` | `--warning` | Limited availability, offers expiring |
| **Destructive** | `0 84% 60%` | `--destructive` | Cancel, delete actions |
| **WhatsApp** | `142 70% 45%` (#25D366) | `--whatsapp` | WhatsApp CTA (brand-locked) |

### CTA Hierarchy
1. **ShinyButton** (fire gradient + animation) → Highest priority conversion
2. **Solid Button** (orange fill) → Standard conversion
3. **Ghost Button** (border only) → Secondary action
4. **Link** (underline) → Tertiary navigation

---

## 4. Gradient System (Hero Sections)

### Hero Backgrounds
```css
/* Primary Hero — Deep space with warm radial glow */
--hero-bg: linear-gradient(135deg, #020617 0%, #0f172a 50%, #020617 100%);
--hero-glow: radial-gradient(ellipse at 50% 40%, hsl(25 95% 53% / 0.08) 0%, transparent 60%);

/* XTSY Xperience Hero — Night sky luxury */
--hero-xperience: linear-gradient(180deg, #020617 0%, #0c1220 40%, #0f172a 100%);

/* Travel Section — Warm adventure gradient */
--hero-travel: linear-gradient(135deg, hsl(25 95% 98%) 0%, hsl(0 84% 97%) 25%, hsl(220 85% 97%) 50%, hsl(142 76% 97%) 75%);
```

### Text Gradients
```css
/* Fire text — for hero headings */
background: linear-gradient(135deg, hsl(25 95% 53%), hsl(33 100% 60%));
-webkit-background-clip: text;
-webkit-text-fill-color: transparent;

/* Subtle warm — for section headings */
background: linear-gradient(135deg, hsl(25 95% 60%), hsl(0 84% 65%));
```

### Glow Effects
```css
/* Orange pulse glow — ShinyButton, premium CTAs */
box-shadow: 0 0 30px hsl(25 95% 53% / 0.3);

/* Warm ambient — card hover states */
box-shadow: 0 10px 40px hsl(25 95% 53% / 0.15);
```

---

## 5. Typography System

### Font Stack
| Role | Font | Weight | Usage |
|------|------|--------|-------|
| **Display** | Playfair Display | 600-700 | Hero headings, brand statements |
| **Heading** | Josefin Sans | 500-600 | Section titles, card headers |
| **Body** | Glacial Indifference → Josefin Sans → system-ui | 300-400 | Paragraphs, descriptions |
| **UI** | system-ui | 400-500 | Buttons, labels, inputs |

### Type Scale (Mobile → Desktop)
| Element | Mobile | Tablet | Desktop | Font |
|---------|--------|--------|---------|------|
| Hero H1 | 30px | 48px | 72px | Playfair Display 700 |
| Section H2 | 24px | 36px | 48px | Josefin Sans 600 |
| Subsection H3 | 20px | 28px | 36px | Josefin Sans 500 |
| Card Title | 18px | 20px | 24px | Josefin Sans 600 |
| Body Large | 16px | 18px | 20px | Glacial Indifference 400 |
| Body | 14px | 16px | 18px | Glacial Indifference 300 |
| Caption | 12px | 12px | 14px | system-ui 400 |
| CTA Button | 14px | 16px | 16px | Josefin Sans 600 |

### Letter Spacing
- **Hero headings**: `-0.02em` (tight, impactful)
- **Section headings**: `-0.01em`
- **All-caps labels**: `0.08em` (e.g., "XTSY PRIME")
- **Body text**: `0` (natural)

---

## 6. UI Component Color Rules

### Buttons
| Variant | Background | Text | Border |
|---------|------------|------|--------|
| `default` (primary) | `hsl(var(--primary))` | White | None |
| `shiny` | Fire gradient + animation | White | Animated conic |
| `ghost` | Transparent | `hsl(var(--foreground))` | None |
| `outline` | Transparent | `hsl(var(--foreground))` | `hsl(var(--border))` |
| `destructive` | `hsl(var(--destructive))` | White | None |

### Cards
- **Dark theme**: `bg-card` with `border-white/10`, subtle warm glow on hover
- **Light theme**: `bg-card` with `border-border`, shadow-lg on hover
- **Premium cards**: Glass morphism with `backdrop-blur-md` (desktop only)
- **Hover**: `translateY(-4px)` + warm shadow expansion

### Inputs
- Background: `hsl(var(--input))`
- Border: `hsl(var(--border))`
- Focus ring: `hsl(var(--ring))` — brand orange
- Placeholder: `hsl(var(--muted-foreground))`

### Navigation
- Header: `bg-black/95` (mobile) / `bg-black/80 backdrop-blur-md` (desktop)
- Active link: Brand orange text
- Hover: `text-primary` transition
- Mobile menu: `bg-gray-950` sheet

---

## 7. Hospitality UX Color Mapping

| Signal | Color | Token | Example |
|--------|-------|-------|---------|
| **Available** | Emerald | `--success` | "Available" badge, green dates |
| **Limited** | Amber | `--warning` | "Only 2 left", countdown |
| **Sold Out** | Red | `--destructive` | "Fully Booked" overlay |
| **Premium** | Orange gradient | `--brand-primary` | "XTSY Xperience" badge |
| **Verified** | Blue | `hsl(220 85% 60%)` | "Verified Review" checkmark |
| **Price** | White/foreground | `--foreground` | ₹7,499 display |
| **Discount** | Brand orange | `--brand-primary` | "37% Off" label |
| **Original Price** | Muted strikethrough | `--muted-foreground` | ₹11,999 crossed |

### Trust Indicators
- **Star rating**: `text-amber-400` (★)
- **Review count**: `text-muted-foreground`
- **Certifications**: `text-emerald-500`
- **WhatsApp verified**: `text-[#25D366]`

---

## 8. Hero Section Design

### Structure
```
┌─────────────────────────────────────────┐
│ [Header: Logo + Nav + CTA]              │
├─────────────────────────────────────────┤
│                                         │
│   Deep space gradient background        │
│   + subtle warm radial glow             │
│                                         │
│   "Hello" (rotating languages)          │
│   in fire gradient text                 │
│                                         │
│   "Live the XTSY Vibe"                  │
│   Playfair Display, fire gradient       │
│                                         │
│   "Premium Stays in Northeast India"    │
│   Josefin Sans, muted foreground        │
│                                         │
│   [Modern Booking Form]                 │
│   Location | Check-in | Check-out |     │
│   Guests | [Check Availability →]       │
│                                         │
│   Social proof: ★ 4.9 · 2500+ guests   │
│                                         │
└─────────────────────────────────────────┘
```

### Hero Rules
- Full viewport height (`100vh` or `100svh` on mobile)
- Background: `#020617` with warm radial glow at center
- Hero heading: Fire gradient text (orange → amber)
- Booking form: Glassmorphic card with warm border glow
- No heavy images above fold — text + gradient only for instant LCP
- Scroll indicator: Subtle chevron bounce at bottom

---

## 9. Icon & Illustration Style

### Icon System
- **Library**: Lucide React (consistent line-weight)
- **Size**: 16px (inline), 18px (nav), 20px (cards), 24px (features)
- **Color**: `text-primary/70` in navigation, `text-foreground` in content
- **Accent icons**: WhatsApp (#25D366), Phone (emerald-400), Location (rose-400)

### Illustration Approach
- **No generic illustrations** — use real photography from Northeast India
- **Photo treatment**: Slight warm color grade, high contrast for dark backgrounds
- **Overlay style**: Dark gradient overlays (bottom → top) for text readability
- **Gallery**: Full-bleed images with `object-cover`, subtle zoom on hover

### Brand Marks
- **Logo usage**: Always WebP format, `fetchpriority="high"` for header
- **Fallback**: Orange→red gradient block with "XTSY" in white bold
- **Favicon**: Brand symbol from Supabase storage
- **Minimum clearspace**: 1× logo height on all sides

---

## 10. Brand Personality

### Voice Attributes
| Attribute | Expression |
|-----------|------------|
| **Bold** | No hedging. "India's First 270° Glasshouse" not "One of the best..." |
| **Warm** | Hospitality language: "Welcome home", "Your adventure awaits" |
| **Authentic** | Real reviews, real photos, real prices (no bait-and-switch) |
| **Young** | Gen Z/Millennial tone, but never cringey. Confident, not try-hard |
| **Premium** | "Experience" not "stay", "Curated" not "selected" |

### Copy Patterns
- **Headlines**: Short, punchy, action-oriented ("Live the XTSY Vibe")
- **Subheads**: Descriptive but concise ("Premium Stays in Northeast India")
- **CTAs**: Active verbs ("Reserve Now", "Explore", "Book Your Experience")
- **Prices**: Always show value proposition (₹7,499 with ₹11,999 strike)

### Brand Don'ts
- ❌ Never use "cheap" — use "value" or "budget-friendly"
- ❌ Never use stock photography — only authentic XTSY/NE India images
- ❌ Never use blue as primary — blue is reserved for verified/trust badges only
- ❌ Never use more than 2 fonts per component
- ❌ Never show prices without tax context

---

## 11. Visual Style References

### Aesthetic DNA
- **Primary mood**: Boutique adventure lodge meets tech-forward hostel
- **Color inspiration**: Meghalaya sunsets (orange-amber), Shillong night sky (deep navy)
- **Texture**: Warm stone tones for light surfaces, deep space for dark backgrounds
- **Motion**: Purposeful — animated CTAs draw attention, not distraction
- **Photography**: Cinematic wide shots, warm color grade, golden hour preference

### Reference Brands (Inspiration, not imitation)
| Brand | What to borrow |
|-------|----------------|
| **Airbnb** | Trust signals, review presentation, clean booking flow |
| **SixSenses** | Premium hospitality language, experience-first messaging |
| **Hostelworld** | Social proof integration, traveler-centric UX |
| **Apple** | Typography confidence, whitespace, product hero treatment |

### Anti-References (What XTSY is NOT)
- Generic hotel booking sites (no beige, no corporate blue)
- Chain hostels (no grid-heavy layouts, no cookie-cutter cards)
- Travel blogs (no content overload, no ad clutter)

---

## Implementation Tokens (CSS Custom Properties)

```css
:root {
  /* Core Brand */
  --primary: 25 95% 53%;              /* XTSY Orange */
  --primary-foreground: 0 0% 100%;    /* White on orange */
  --ring: 25 95% 53%;                 /* Focus ring = brand */
  
  /* Brand Gradient */
  --brand-gradient: linear-gradient(135deg, hsl(25 95% 53%), hsl(0 84% 60%));
  --brand-glow: 0 0 30px hsl(25 95% 53% / 0.3);
  
  /* Surfaces (Dark default) */
  --background: 222 47% 4%;
  --foreground: 0 0% 95%;
  --card: 222 30% 8%;
  --muted: 220 15% 15%;
  --muted-foreground: 220 10% 55%;
  
  /* Semantic */
  --success: 142 76% 36%;
  --warning: 38 92% 50%;
  --destructive: 0 84% 60%;
  --whatsapp: 142 70% 45%;
}
```

---

**Last Updated**: March 2026  
**Maintained by**: XTSY Design System  
**Status**: Active — all new components MUST reference this system
