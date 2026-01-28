# GTM Trigger Map - XTSY Website

**Last Updated:** 2026-01-28  
**GTM Container:** GTM-5FXJ9QBK  
**GA4 Property:** G-SJY2WX6L4B  
**Google Ads:** AW-17352497815

---

## 📊 Complete Trigger Coverage

### PAGES (Auto-tracked via `page_navigation`)

| Page Path | Page Name | Category | Priority |
|-----------|-----------|----------|----------|
| `/` | Home | landing | high |
| `/about` | About Us | information | medium |
| `/gallery` | Gallery | engagement | medium |
| `/travel` | Tour Packages | product | high |
| `/xtsy-270` | XTSY 270 Suite | product | critical |
| `/pet-friendly` | Pet Friendly | product | high |
| `/xtsy-vs-zostel` | Comparison | product | high |
| `/female-travellers` | Female Travellers | product | high |
| `/work-from-home` | Work From Home | product | medium |
| `/xtsy-rentals` | Rentals | product | medium |
| `/properties` | Property Selection | booking | critical |
| `/properties/:id` | Property Detail | booking | critical |
| `/booking` | Booking Flow | booking | critical |
| `/book` | Quick Book | booking | critical |
| `/auth` | User Auth | account | high |
| `/profile` | User Profile | account | medium |

---

## 🔘 BUTTONS & CTAs

### Hero Section (Home Page)
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Check Availability | `cta_check_availability` | hero_booking_form | critical |
| Location Dropdown | `interaction_location_select` | hero_booking_form | medium |
| Date Picker | `interaction_date_select` | hero_booking_form | medium |
| Guest Counter (+/-) | `interaction_guest_change` | hero_booking_form | low |
| Scroll Down Arrow | `button_scroll_to_content` | hero_section | low |

### Header Navigation
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Logo Click | `nav_logo_click` | header | medium |
| Home Link | `nav_home` | header | low |
| About Link | `nav_about` | header | low |
| Gallery Link | `nav_gallery` | header | low |
| Travel Link | `nav_travel` | header | medium |
| XTSY 270 Link | `nav_xtsy_270` | header | high |
| Book Now Button | `cta_book_now` | header | critical |
| Mobile Menu Toggle | `nav_mobile_menu` | header | low |

### Tour Packages Section
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Package Card Click | `package_card_click` | tour_packages | high |
| Explore Button | `cta_explore_package` | tour_package_card | high |
| View All Packages | `cta_view_all_packages` | tour_packages | medium |
| Carousel Navigation | `carousel_navigate` | tour_packages | low |
| Package Modal Open | `modal_package_open` | tour_packages | high |
| Book via WhatsApp | `cta_book_whatsapp` | package_modal | critical |
| View Details | `cta_view_package_details` | package_modal | high |

### XTSY Prime Section
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Prime Card Click | `prime_card_click` | xtsy_prime | high |
| View Full Details | `cta_prime_details` | prime_modal | high |
| Book Now (Prime) | `cta_prime_book` | prime_modal | critical |
| Back to Home | `nav_back_to_section` | prime_page | medium |

### Property Cards
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Property Card Click | `property_card_click` | property_grid | high |
| View Details Button | `cta_property_details` | property_card | high |
| Price Expand | `interaction_price_view` | property_card | medium |
| Image Gallery | `interaction_image_gallery` | property_card | low |

### Booking Flow
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Start Booking | `form_booking_start` | booking_flow | critical |
| Step Navigation | `form_step_change` | booking_flow | high |
| Room Selection | `form_room_select` | booking_flow | critical |
| Guest Details Input | `form_guest_details` | booking_flow | high |
| Payment Method Select | `form_payment_select` | booking_flow | critical |
| Confirm Booking | `cta_confirm_booking` | booking_flow | critical |
| Cancel/Back | `form_booking_abandon` | booking_flow | high |

### Contact & Conversion CTAs
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| WhatsApp Button | `cta_whatsapp_click` | floating/footer | critical |
| WhatsApp (validated 30s+) | `whatsapp_engaged_validated` | - | critical |
| Call Button | `cta_call_click` | floating/footer | critical |
| Call (validated 60s+) | `call_engaged_validated` | - | critical |
| Get Directions | `get_directions_click` | footer/property | high |
| Email Contact | `cta_email_click` | footer | medium |

### Reviews Section
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Review Card Expand | `engagement_review_expand` | reviews | low |
| Review Carousel | `carousel_reviews` | reviews | low |
| Write Review CTA | `cta_write_review` | reviews | medium |

### Group Booking Section
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Corporate Booking | `cta_corporate_booking` | group_booking | high |
| Group Enquiry | `cta_group_enquiry` | group_booking | high |
| Submit Group Form | `form_group_submit` | group_booking | critical |

### Footer
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Social Links | `social_click_{platform}` | footer | medium |
| Quick Links | `footer_link_click` | footer | low |
| Newsletter Signup | `form_newsletter_submit` | footer | medium |
| App Download | `app_download` | footer | high |

### Consent Modal
| Element | Trigger Name | Location | Priority |
|---------|-------------|----------|----------|
| Accept All | `consent_accept_all` | consent_modal | high |
| Reject Non-Essential | `consent_reject` | consent_modal | medium |
| Customize | `consent_customize` | consent_modal | low |
| Save Preferences | `consent_save_custom` | consent_modal | medium |

---

## 🎯 CONVERSION EVENTS (Send to Google Ads)

| Event Name | Trigger | Value Multiplier | Ads Conversion |
|------------|---------|------------------|----------------|
| `booking_confirmed` | Payment success | 1.0 | ✅ Primary |
| `whatsapp_engaged_validated` | 30s+ chat | 1.0 | ✅ Secondary |
| `call_engaged_validated` | 60s+ call | 1.2 | ✅ Secondary |
| `lead_qualified` | High intent form | 1.5 | ✅ Lead |
| `booking_initiated` | Start checkout | 0.8 | ⚡ Micro |
| `form_submit` | Any form complete | 0.5 | ⚡ Micro |
| `get_directions_click` | Maps click | 0.3 | ⚡ Micro |
| `app_download` | PWA install | 0.4 | ⚡ Micro |

---

## 📈 SESSION QUALITY SIGNALS

| Signal | Trigger Condition | Intent Classification |
|--------|-------------------|----------------------|
| `session_quality_signal` | >15s active scroll | Average |
| `high_intent_detected` | 2+ pages + 60s+ | High |
| `hot_lead_detected` | Booking/WhatsApp intent | Hot |

---

## 🔧 GTM Configuration

### DataLayer Variables to Create in GTM:
```
- {{DLV - button_name}}
- {{DLV - button_location}}
- {{DLV - page_category}}
- {{DLV - event_category}}
- {{DLV - event_priority}}
- {{DLV - is_conversion}}
- {{DLV - value}}
- {{DLV - form_name}}
- {{DLV - package_name}}
- {{DLV - property_name}}
```

### Custom Triggers in GTM:
1. **Button Click Trigger**: Event = `button_click`
2. **CTA Click Trigger**: Event = `cta_click`
3. **Form Submit Trigger**: Event = `form_submit`
4. **Conversion Trigger**: Event matches `*_validated|booking_confirmed|lead_qualified`
5. **Page Navigation Trigger**: Event = `page_navigation`

---

## 🛡️ Traffic Exclusion Rules

Admin traffic is AUTOMATICALLY excluded via `isLovableSession()` check:
- Lovable preview sessions
- Admin dashboard access
- Franchise portal access
- Any session with `__lovable_token` parameter

---

## 📱 Mobile-Specific Triggers

| Element | Trigger Name | iOS/Android |
|---------|-------------|-------------|
| Bottom Nav | `mobile_nav_click` | Both |
| Swipe Carousel | `mobile_swipe_carousel` | Both |
| Tap-to-Call | `mobile_tap_to_call` | Both |
| Share Button | `mobile_share_click` | Both |
| Pull-to-Refresh | `mobile_refresh` | Both |

---

## 🔄 Implementation Status

### ✅ Implemented
- Page navigation tracking
- Button click tracking (generic)
- Conversion events (validated)
- Session quality signals
- Admin traffic exclusion
- Consent events

### 🚧 To Implement
- Specific button tracking per section
- Carousel interaction tracking
- Form field-level tracking
- Video engagement (if any)
- Scroll depth milestones (25/50/75/100%)

---

## 📊 Admin Dashboard Access

View real-time GTM activity:
- **GTM Brain Tab**: `/admin/analytics` → "GTM Brain" tab
- **DataLayer Debug**: `/admin/datalayer`
- **Traffic Command Center**: `/admin/traffic`
