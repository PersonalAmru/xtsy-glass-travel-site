# XTSY Project Knowledge Document
## T=0 Feature Snapshot (January 2026)

---

## 1. PROJECT OVERVIEW

**XTSY** is a premium travel and hospitality platform targeting the Northeast India market. It combines boutique hostel booking with curated travel experiences, featuring an admin-first analytics architecture that prioritizes data quality and conversion integrity.

### Core Value Proposition
- **Luxury Glass Suite** (XTSY 270°) - Signature panoramic experience
- **Budget-Friendly Dorms** - Female-only, mixed, economy options
- **Work From Home Packages** - Digital nomad "workation" stays
- **Curated Travel Itineraries** - Northeast India expeditions

### Technology Stack
- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, shadcn/ui
- **Backend**: Supabase (PostgreSQL, Edge Functions, Auth, Storage)
- **Analytics**: GA4 + Google Ads + Internal Admin Analytics
- **Payments**: UPI-based (India market)

---

## 2. ARCHITECTURE PRINCIPLES (NON-NEGOTIABLE)

These principles are defined in custom knowledge and MUST be followed:

### 2.1 Admin Dashboard is PRIMARY Source of Truth
- All traffic, session data, intent scoring computed internally first
- GA4 is a downstream consumer, NOT the decision-maker
- Google Ads receives ONLY admin-validated events

### 2.2 Raw Traffic ≠ Value
- Clicks, taps, opens are diagnostic only
- Only validated engagement qualifies for analytics/ads optimization

### 2.3 Conversion Integrity
- **Allowed Conversions**: `whatsapp_engaged_validated`, `call_engaged_validated`, `lead_qualified`, `booking_confirmed`
- Accidental taps, short calls, bots NEVER promoted as success

### 2.4 Unified Intent Scoring
- Every session classified by click quality, behavior, validation
- Only High or Hot intent sessions advance in funnel

### 2.5 Privacy & Compliance
- CMP with Google Consent Mode v2 (Advanced) - never bypassed
- No cookies/identifiers before consent
- Compliant with GDPR, India DPDP, iOS/Android privacy

### 2.6 Non-Destructive Performance
- LCP/speed optimizations NEVER break tracking, consent, validation
- Functional correctness > performance scores

---

## 3. ROOM INVENTORY SYSTEM

### 3.1 Room Types (src/config/roomTypes.ts)
Central source of truth for all room configurations:

| ID | Name | Category | Unit Type | Capacity | Base Price |
|----|------|----------|-----------|----------|------------|
| `xtsy-270` | XTSY 270° Panorama Glass Ensuite | luxury | room | 2 | ₹4,999 |
| `4-bed-female-only-dorm` | 4-Bed Female Dormitory | hostel | bed | 4 | ₹649 |
| `4-bed-mixed-female-dorm` | 4-Bed Mixed Dormitory | hostel | bed | 4 | ₹599 |
| `6-bed-mixed-female-dorm` | 6-Bed Female Dormitory | hostel | bed | 6 | ₹549 |
| `6-bed-mixed-dorm` | 6-Bed Mixed Dormitory | hostel | bed | 6 | ₹499 |
| `king-double-room` | King Double Room | hostel | room | 2 | ₹1,899 |
| `king-triple-room` | King Triple Room | hostel | room | 3 | ₹2,299 |
| `6-bed-mixed-economy-dorm` | 6-Bed Economy (OTA only) | economy | bed | 6 | ₹399 |
| `8-bed-mixed-economy-dorm` | 8-Bed Economy (OTA only) | economy | bed | 8 | ₹349 |

### 3.2 Key Concepts
- **unitType**: `bed` (dormitories) vs `room` (private suites)
- **isBookable**: Economy rooms are OTA-only (not bookable on website)
- **totalUnits**: Physical inventory count per room type

---

## 4. BOOKING SYSTEM

### 4.1 Booking Flow (src/components/BookingModal.tsx)
4-step modal process:
1. **Room Selection** - Multi-room cart with Instagram-grade photo grids
2. **Date Selection** - Check-in/out with availability validation
3. **Guest Details** - Form with validation
4. **Payment** - UPI-based payment handling

### 4.2 Enquiry System (src/services/enquiryService.ts)
Bookings are processed as enquiries requiring admin approval:
- `createEnquiry()` - Creates pending enquiry via RPC
- `approveEnquiry()` - Admin approves, generates booking + invoice
- `rejectEnquiry()` - Admin rejects with reason

### 4.3 Database Tables
- `enquiries` - Pending booking requests
- `bookings` - Confirmed bookings
- `booking_invoices` - Generated invoices
- `room_inventory` - Date-based availability
- `blocked_dates` - Admin-blocked dates

---

## 5. ADMIN DASHBOARD

### 5.1 Layout (src/layouts/UnifiedAdminLayout.tsx)
Premium hamburger-menu navigation with sections:
- Overview, Live Traffic, Analytics
- Bookings Calendar, Guest Chats
- Properties, Franchise Owners
- Inventory & Yield, OTA Connections
- Finance & Settlements, GST & Compliance
- Reviews, WhatsApp Templates, Audit Logs

### 5.2 Key Admin Pages
| Route | Component | Purpose |
|-------|-----------|---------|
| `/admin` | AdminOverview | Dashboard home |
| `/admin/traffic` | LiveTrafficCommandCenter | Real-time session monitoring |
| `/admin/analytics` | AdminAnalytics | GA4-style analytics |
| `/admin/bookings` | AdminBookingsCalendar | Calendar view of bookings |
| `/admin/inventory` | AdminInventory | Yield management |
| `/admin/finance` | AdminFinance | Settlements & payouts |
| `/admin/whatsapp` | AdminWhatsAppTemplates | Message templates |

### 5.3 Security Features
- **Intrusion Detection**: `security_intrusion_logs` table
- **Security Alerts**: Real-time notifications in `SecurityAlertNotification.tsx`
- **Audit Logs**: All admin actions tracked in `audit_logs` table
- **PII Redaction**: `src/utils/piiRedactedLogger.ts`

---

## 6. ANALYTICS SYSTEM

### 6.1 Traffic Analytics (src/services/trafficAnalyticsService.ts)
Comprehensive session tracking with:
- **Bot Detection**: `bot_likelihood_score` computation
- **Traffic Quality**: Classification (high/medium/low)
- **Device Tier**: iOS prioritized as 'premium'
- **Unified Intent Score**: Behavioral intent classification

### 6.2 Database Tables
| Table | Purpose |
|-------|---------|
| `traffic_sessions` | Session-level data with geo, device, UTM |
| `traffic_page_events` | Page-level interactions |
| `traffic_validated_events` | Conversion events sent to GA4/Ads |
| `traveller_profiles` | Aggregated visitor profiles |
| `traveller_events` | Granular event tracking |

### 6.3 Consent Management
- **CMP Banner**: `src/components/consent/ConsentBanner.tsx`
- **DPDP Compliance**: `src/components/consent/DPDPConsentBanner.tsx`
- **Consent Records**: `consent_records` and `dpdp_consents` tables
- **Defaults**: Analytics, marketing, personalization enabled by default (user can opt-out)

---

## 7. EDGE FUNCTIONS

### 7.1 Public Functions (no auth required)
| Function | Purpose |
|----------|---------|
| `get-room-availability` | Check room availability |
| `get-room-types` | Fetch room configurations |
| `validate-booking` | Validate booking data |
| `fetch-exchange-rates` | Currency conversion |
| `track-analytics` | Anonymous analytics tracking |
| `generate-invoice` | Create booking invoice |
| `send-whatsapp` | WhatsApp Business messaging |
| `ota-webhook-handler` | OTA integration webhooks |
| `payment-webhook` | Payment gateway callbacks |
| `csp-report` | CSP violation reporting |

### 7.2 Protected Functions (auth required)
| Function | Purpose |
|----------|---------|
| `security-monitoring` | Security event monitoring |
| `secure-blocking` | Admin room blocking |
| `analytics-dashboard` | Admin analytics data |
| `traveller-intelligence` | Visitor intelligence |
| `realtime-intelligence` | Real-time insights |
| `compute-demand-signals` | Demand forecasting |
| `update-channel-health` | OTA channel health |
| `auto-settle-bookings` | Automatic settlement |

---

## 8. SPECIALIZED PAGES

### 8.1 Work From Home (src/pages/WorkFromHome.tsx)
Digital nomad "workation" packages:
- **Weekly**: ₹5,400 (7 nights, WiFi, co-working, breakfast)
- **Monthly**: ₹22,999 (30 nights, laundry included)
- **Quarterly**: ₹64,999 (90 nights, priority support, storage)

### 8.2 Female Travellers (src/pages/FemaleTravellers.tsx)
Safety-focused accommodations:
- Female-only dormitories
- Women-led initiatives
- Community bonding features

### 8.3 Pet Friendly (src/pages/PetFriendly.tsx)
Pet accommodation options with designated areas

### 8.4 Travel & Tours (src/pages/Travel.tsx)
Curated itineraries:
- Northeast India expeditions
- Ecological immersion tours
- Tribal cultural experiences
- Motorcycle adventures

### 8.5 XTSY vs Zostel (src/pages/XTSYvsZostel.tsx)
Competitive comparison page

---

## 9. PROPERTY & FRANCHISE SYSTEM

### 9.1 Multi-Property Architecture
- `properties` - Property configurations
- `property_room_types` - Room types per property
- `property_wallets` - Financial tracking per property
- `property_onboarding` - Onboarding checklist

### 9.2 Franchise Management
- `franchise_assignments` - User-property mappings
- `franchise_invites` - Invitation system
- Separate franchise login and dashboard

---

## 10. CHANNEL MANAGEMENT

### 10.1 OTA Integration
- `ota_connections` - Channel configurations
- `channel_strategy` - Rate and inventory rules
- `ical_sync_configs` - iCal synchronization
- Supported: Booking.com, Agoda, MakeMyTrip, Goibibo, etc.

### 10.2 Demand Signals
- `demand_signals` - Real-time demand indicators
- `demand_forecasts` - ML-based predictions
- `pricing_rules` - Dynamic pricing configuration

---

## 11. PERFORMANCE OPTIMIZATIONS

### 11.1 LCP Strategy
- **LCP Skeleton**: Pre-rendered HTML in `index.html`
- **Critical CSS**: Inlined for above-fold content
- **Deferred JS**: Non-essential scripts load after first paint
- **Image Optimization**: `fetchpriority="high"` on LCP image

### 11.2 Code Splitting
- All routes lazy-loaded with retry logic
- `createLazyComponent()` wrapper for error handling

### 11.3 Caching
- Edge function response caching
- Service worker registration
- Aggressive static asset caching

---

## 12. SECURITY IMPLEMENTATION

### 12.1 Security Headers
- CSP, HSTS, X-Frame-Options via `SecurityHeadersProvider`
- CSP violation reporting to `csp-report` edge function

### 12.2 RLS Policies
All tables have Row Level Security enabled:
- User data restricted by `user_id` or session
- Admin operations verified via `user_roles` table
- Public read where appropriate (room types, properties)

### 12.3 Rate Limiting
- `rate_limits` table for API protection
- Edge function rate limiting via `rateLimiter.ts`

---

## 13. KEY INTEGRATIONS

### 13.1 Google Analytics 4 (GA4)
- Measurement ID: `G-SJY2WX6L4B`
- Enhanced ecommerce tracking
- Consent Mode v2 integration

### 13.2 Google Ads
- Account: `AW-17456979648`
- Enhanced conversions enabled
- Value-based bidding support

### 13.3 WhatsApp Business
- Template-based messaging via edge function
- Admin-editable templates in database

### 13.4 Sentry
- Error monitoring (configured in `main.tsx`)

---

## 14. DATABASE SCHEMA HIGHLIGHTS

### Core Tables (50+ tables)
- **Bookings**: `enquiries`, `bookings`, `booking_invoices`, `booking_messages`
- **Inventory**: `room_types`, `room_inventory`, `blocked_dates`, `room_availability_status`
- **Analytics**: `traffic_sessions`, `traffic_page_events`, `traffic_validated_events`, `traveller_profiles`
- **Admin**: `audit_logs`, `admin_notifications`, `admin_security_alerts`
- **Finance**: `settlements`, `invoices`, `property_wallets`
- **Channels**: `ota_connections`, `channel_strategy`, `ical_sync_configs`

### Key RPC Functions
- `create_enquiry` - Create new booking enquiry
- `approve_enquiry` - Admin approval with booking generation

---

## 15. FILE STRUCTURE

```
src/
├── components/
│   ├── admin/          # Admin dashboard components
│   ├── booking/        # Booking flow components
│   ├── consent/        # CMP and consent banners
│   ├── reviews/        # Review display
│   ├── skeletons/      # Loading skeletons
│   └── ui/             # shadcn/ui components
├── config/
│   └── roomTypes.ts    # Room configuration source of truth
├── contexts/           # React contexts
├── hooks/              # Custom hooks (analytics, availability, etc.)
├── layouts/            # Page layouts (Admin, Franchise, User)
├── pages/
│   ├── admin/          # Admin pages
│   ├── franchise/      # Franchise pages
│   ├── user/           # User auth pages
│   └── lazy/           # Lazy-loaded page wrappers
├── services/           # Business logic services
├── styles/             # CSS files
└── utils/              # Utility functions

supabase/
└── functions/
    ├── _shared/        # Shared utilities (CORS, cache, rate limiting)
    └── [function-name]/# Individual edge functions
```

---

## 16. DESIGN SYSTEM

### Color Tokens (HSL in index.css)
- `--background`, `--foreground`
- `--primary`, `--primary-foreground`
- `--secondary`, `--muted`, `--accent`
- `--destructive`, `--border`, `--ring`

### Typography
- Custom font loading with `font-display: swap`
- Typography guide in `TYPOGRAPHY_GUIDE.md`

### Component Library
- shadcn/ui with custom variants
- Framer Motion for animations

---

## 17. TESTING & QUALITY

### Visual Regression
- Playwright configuration in `playwright.config.ts`
- Modal tests in `tests/visual/modals/`

### Load Testing
- k6 configuration in `tests/load/`

### Security Scanning
- GitHub Actions workflow for secret scanning
- Gitleaks configuration

---

## 18. DEPLOYMENT

### Frontend
- Deployed via Lovable (click "Update" to publish)
- Preview URL: `https://id-preview--9a4a5e4b-f1f1-40f7-ba6f-5d944df4e08e.lovable.app`
- Published URL: `https://xtsy-one.lovable.app`

### Backend
- Edge functions deploy automatically
- Supabase project: `oidnydyyjyjfnyadhyzn`

---

## 19. COMMON PATTERNS

### Analytics Event Tracking
```typescript
// Use trafficAnalyticsService for all analytics
import { trafficAnalyticsService } from '@/services/trafficAnalyticsService';
trafficAnalyticsService.trackEvent('event_name', { ...metadata });
```

### Booking Flow
```typescript
// Use enquiryService for bookings
import { createEnquiry } from '@/services/enquiryService';
const result = await createEnquiry(enquiryData);
```

### Admin Check
```typescript
// Verify admin role before sensitive operations
const { data: role } = await supabase
  .from('user_roles')
  .select('role')
  .eq('user_id', userId)
  .single();
```

### Lovable Session Detection
```typescript
// Skip tracking for admin/preview sessions
import { isLovableSession } from '@/utils/analyticsFilters';
if (isLovableSession()) return;
```

---

## 20. KNOWN LIMITATIONS

1. **No VITE_* env vars** - Use Supabase secrets instead
2. **Economy rooms not bookable** - OTA-only inventory
3. **India-focused** - UPI payments, GST compliance
4. **Single property live** - Multi-property infrastructure ready

---

*Last updated: January 2026*
*Version: T=0 Snapshot*
