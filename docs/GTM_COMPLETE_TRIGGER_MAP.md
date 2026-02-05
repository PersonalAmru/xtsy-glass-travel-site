 # Complete GTM Trigger Map - XTSY Website
 
 **Last Updated:** 2026-02-05  
 **GTM Container:** GTM-5FXJ9QBK  
 **GA4 Property:** G-SJY2WX6L4B  
 **Google Ads:** AW-17352497815
 
 > This document maps ALL GTM triggers page-by-page and event-by-event for cross-checking with GTM console.
 
 ---
 
 ## 📊 GTM Brain Architecture
 
 All events flow through `gtmEventRouter.ts` before reaching GA4/GTM:
 
 ```
 User Action → Component → useComponentTracking → gtmEventRouter → DataLayer → GTM → GA4/Google Ads
 ```
 
 Admin/Lovable sessions are automatically filtered via `isLovableSession()` check.
 
 ---
 
 ## 🗂️ PAGE-BY-PAGE EVENT MAPPING
 
 ### 1. HOME PAGE (`/`)
 
 | Section | Event Name | Trigger Type | GTM Trigger Name | Parameters |
 |---------|------------|--------------|------------------|------------|
 | **Page Load** | `page_navigation` | Auto | `CE - page_navigation` | page_path: "/", page_category: "landing" |
 | **Scroll Tracking** | `scroll_depth` | Auto (25/50/75/100%) | `CE - scroll_depth` | scroll_milestone, time_to_milestone_seconds |
 | **Header** | `button_click` | Click | `CE - button_click` | button_name: "logo", button_location: "header" |
 | **Header** | `cta_click` | Click | `CE - cta_click` | cta_name: "book_now", cta_location: "header" |
 | **Hero Search** | `form_start` | Focus | `CE - form_start` | form_name: "hero_search" |
 | **Hero Search** | `form_field_focus` | Focus | `CE - form_field_focus` | field_name: "location/dates/guests" |
 | **Hero Search** | `cta_click` | Submit | `CE - cta_click` | cta_name: "check_availability" |
 | **XTSY Prime** | `card_click` | Click | `CE - card_click` | card_name: "{prime_item}", card_type: "prime" |
 | **XTSY Prime** | `modal_interaction` | Open/Close | `CE - modal_interaction` | modal_name, modal_action: "open/close" |
 | **Tour Packages** | `carousel_navigate` | Swipe/Arrow | `CE - carousel_navigate` | navigation_direction, slide_index |
 | **Tour Packages** | `card_click` | Click | `CE - card_click` | card_name: "{package}", card_type: "package" |
 | **Tour Packages** | `package_viewed` | View | `CE - package_viewed` | item_name, item_type: "package" |
 | **Explore Northeast** | `section_view` | IntersectionObserver | `CE - section_view` | section_name: "explore_northeast" |
 | **Adventure CTA** | `cta_click` | Click | `CE - cta_click` | cta_name: "start_adventure" |
 | **About Section** | `section_view` | IntersectionObserver | `CE - section_view` | section_name: "about_xtsy" |
 | **Reviews** | `review_interaction` | Expand/Click | `CE - review_interaction` | action, review_source |
 | **Reviews** | `carousel_navigate` | Swipe | `CE - carousel_navigate` | carousel_location: "reviews" |
 | **FAQ** | `section_view` | IntersectionObserver | `CE - section_view` | section_name: "faq" |
 | **Footer** | `link_click` | Click | `CE - link_click` | link_name, link_destination |
 | **Footer** | `whatsapp_click` | Click | `CE - whatsapp_click` | - |
 | **Footer** | `call_click` | Click | `CE - call_click` | - |
 
 ---
 
 ### 2. TRAVEL PAGE (`/travel`)
 
 | Section | Event Name | Trigger Type | GTM Trigger Name | Parameters |
 |---------|------------|--------------|------------------|------------|
 | **Page Load** | `page_navigation` | Auto | `CE - page_navigation` | page_path: "/travel", page_category: "product" |
 | **Scroll Tracking** | `scroll_depth` | Auto | `CE - scroll_depth` | scroll_milestone |
 | **Category Tabs** | `button_click` | Click | `CE - button_click` | button_name: "{category}" |
 | **Package Cards** | `card_click` | Click | `CE - card_click` | card_name: "{package}", card_type: "tour_package" |
 | **Package Modal** | `modal_interaction` | Open | `CE - modal_interaction` | modal_name: "{package}" |
 | **Package Modal** | `package_viewed` | View | `CE - package_viewed` | item_name |
 | **Book via WhatsApp** | `cta_click` | Click | `CE - cta_click` | cta_name: "book_whatsapp" |
 | **View Details** | `cta_click` | Click | `CE - cta_click` | cta_name: "view_package_details" |
 
 ---
 
 ### 3. XTSY 270 PAGE (`/xtsy-270`)
 
 | Section | Event Name | Trigger Type | GTM Trigger Name | Parameters |
 |---------|------------|--------------|------------------|------------|
 | **Page Load** | `page_navigation` | Auto | `CE - page_navigation` | page_path: "/xtsy-270", page_category: "product" |
 | **Scroll Tracking** | `scroll_depth` | Auto | `CE - scroll_depth` | scroll_milestone |
 | **Hero CTA** | `cta_click` | Click | `CE - cta_click` | cta_name: "book_270" |
 | **Gallery** | `carousel_navigate` | Swipe | `CE - carousel_navigate` | carousel_location: "xtsy_270_gallery" |
 | **Room Viewed** | `room_viewed` | Auto | `CE - room_viewed` | item_name: "XTSY 270 Suite" |
 | **WhatsApp CTA** | `whatsapp_click` | Click | `CE - whatsapp_click` | - |
 
 ---
 
 ### 4. GALLERY PAGE (`/gallery`)
 
 | Section | Event Name | Trigger Type | GTM Trigger Name | Parameters |
 |---------|------------|--------------|------------------|------------|
 | **Page Load** | `page_navigation` | Auto | `CE - page_navigation` | page_path: "/gallery", page_category: "engagement" |
 | **Category Filter** | `button_click` | Click | `CE - button_click` | button_name: "{category}" |
 | **Image Click** | `modal_interaction` | Open | `CE - modal_interaction` | modal_name: "gallery_lightbox" |
 | **Gallery Navigate** | `carousel_navigate` | Arrow/Swipe | `CE - carousel_navigate` | navigation_direction |
 
 ---
 
 ### 5. ABOUT PAGE (`/about`)
 
 | Section | Event Name | Trigger Type | GTM Trigger Name | Parameters |
 |---------|------------|--------------|------------------|------------|
 | **Page Load** | `page_navigation` | Auto | `CE - page_navigation` | page_path: "/about", page_category: "information" |
 | **Scroll Tracking** | `scroll_depth` | Auto | `CE - scroll_depth` | scroll_milestone |
 | **Section Views** | `section_view` | IntersectionObserver | `CE - section_view` | section_name |
 | **Team Cards** | `card_click` | Click | `CE - card_click` | card_type: "team_member" |
 | **Contact CTA** | `cta_click` | Click | `CE - cta_click` | cta_name: "contact_us" |
 
 ---
 
 ### 6. PROPERTY SELECTION (`/properties`)
 
 | Section | Event Name | Trigger Type | GTM Trigger Name | Parameters |
 |---------|------------|--------------|------------------|------------|
 | **Page Load** | `page_navigation` | Auto | `CE - page_navigation` | page_path: "/properties", page_category: "booking" |
 | **Property Card** | `card_click` | Click | `CE - card_click` | card_name: "{property}", card_type: "property" |
 | **Property Viewed** | `property_viewed` | Click | `CE - property_viewed` | item_name |
 | **Filter Change** | `button_click` | Click | `CE - button_click` | button_name: "filter_{type}" |
 | **View Details CTA** | `cta_click` | Click | `CE - cta_click` | cta_name: "view_property" |
 
 ---
 
 ### 7. PROPERTY DETAIL (`/properties/:id`)
 
 | Section | Event Name | Trigger Type | GTM Trigger Name | Parameters |
 |---------|------------|--------------|------------------|------------|
 | **Page Load** | `page_navigation` | Auto | `CE - page_navigation` | page_path: "/properties/{id}", page_category: "booking" |
 | **Property Viewed** | `property_viewed` | Auto | `CE - property_viewed` | item_name: "{property_name}" |
 | **Room Selection** | `room_viewed` | Click | `CE - room_viewed` | item_name: "{room_type}" |
 | **Book Now CTA** | `cta_click` | Click | `CE - cta_click` | cta_name: "book_now_property" |
 | **Gallery** | `carousel_navigate` | Swipe | `CE - carousel_navigate` | carousel_location: "property_gallery" |
 | **WhatsApp** | `whatsapp_click` | Click | `CE - whatsapp_click` | - |
 | **Call** | `call_click` | Click | `CE - call_click` | - |
 | **Directions** | `get_directions_click` | Click | `CE - get_directions_click` | - |
 
 ---
 
 ### 8. BOOKING FLOW (`/booking`, `/book`)
 
 | Step | Event Name | Trigger Type | GTM Trigger Name | Parameters |
 |------|------------|--------------|------------------|------------|
 | **Page Load** | `page_navigation` | Auto | `CE - page_navigation` | page_path, page_category: "booking" |
 | **Form Start** | `form_start` | Focus | `CE - form_start` | form_name: "booking_form" |
 | **Field Focus** | `form_field_focus` | Focus | `CE - form_field_focus` | field_name |
 | **Step Change** | `button_click` | Click | `CE - button_click` | button_name: "step_{n}" |
 | **Room Select** | `room_viewed` | Select | `CE - room_viewed` | item_name |
 | **Booking Initiated** | `booking_initiated` | Submit | `CE - booking_initiated` | conversion_value, room_type |
 | **Booking Confirmed** | `booking_confirmed` | Success | `CE - booking_confirmed` | conversion_value, booking_id |
 | **Form Abandon** | `form_abandon` | Unload | `CE - form_abandon` | last_field, time_spent_ms |
 
 ---
 
 ### 9. SPECIAL PAGES
 
 #### Pet Friendly (`/pet-friendly`)
 | Event | Trigger | Parameters |
 |-------|---------|------------|
 | `page_navigation` | Auto | page_path: "/pet-friendly" |
 | `scroll_depth` | Auto | scroll_milestone |
 | `cta_click` | Click | cta_name: "book_pet_friendly" |
 
 #### Female Travellers (`/female-travellers`)
 | Event | Trigger | Parameters |
 |-------|---------|------------|
 | `page_navigation` | Auto | page_path: "/female-travellers" |
 | `scroll_depth` | Auto | scroll_milestone |
 | `cta_click` | Click | cta_name: "book_female_dorm" |
 
 #### Work From Home (`/work-from-home`)
 | Event | Trigger | Parameters |
 |-------|---------|------------|
 | `page_navigation` | Auto | page_path: "/work-from-home" |
 | `scroll_depth` | Auto | scroll_milestone |
 | `cta_click` | Click | cta_name: "book_workation" |
 
 #### XTSY vs Zostel (`/xtsy-vs-zostel`)
 | Event | Trigger | Parameters |
 |-------|---------|------------|
 | `page_navigation` | Auto | page_path: "/xtsy-vs-zostel" |
 | `scroll_depth` | Auto | scroll_milestone |
 | `cta_click` | Click | cta_name: "book_xtsy" |
 
 ---
 
 ## 🎯 CONVERSION EVENTS (Google Ads)
 
 | Event Name | Conversion ID | Label | Value Multiplier | Priority |
 |------------|---------------|-------|------------------|----------|
 | `booking_confirmed` | 17456979648 | 5J0pCJO_18MbEMC9kYRB | 1.0 | Primary |
 | `whatsapp_engaged_validated` | 17352497815 | TBD | 1.0 | Secondary |
 | `call_engaged_validated` | 17352497815 | TBD | 1.2 | Secondary |
 | `lead_qualified` | 17352497815 | TBD | 1.5 | Lead |
 | `booking_initiated` | 17352497815 | TBD | 0.8 | Micro |
 | `group_enquiry_submit` | 17352497815 | TBD | 1.5 | Lead |
 | `b2b_enquiry_submit` | 17352497815 | TBD | 2.0 | Lead |
 | `get_directions_click` | - | - | 0.3 | Micro |
 | `app_download` | - | - | 0.4 | Micro |
 
 ---
 
 ## 📈 SESSION QUALITY EVENTS
 
 | Event Name | Trigger Condition | Intent Level |
 |------------|-------------------|--------------|
 | `session_quality_signal` | >15s active scroll | Average |
 | `high_intent_detected` | 2+ pages + 60s+ | High |
 | `hot_lead_detected` | Booking/WhatsApp intent | Hot |
 
 ---
 
 ## 🔧 GTM CONFIGURATION CHECKLIST
 
 ### Required Data Layer Variables (DLV - Version 2)
 
 ```
 DLV - button_name
 DLV - button_location
 DLV - cta_name
 DLV - cta_location
 DLV - card_name
 DLV - card_type
 DLV - card_location
 DLV - modal_name
 DLV - modal_action
 DLV - form_name
 DLV - field_name
 DLV - page_path
 DLV - page_category
 DLV - event_category
 DLV - event_priority
 DLV - is_conversion
 DLV - scroll_milestone
 DLV - scroll_depth_percent
 DLV - time_to_milestone_seconds
 DLV - item_name
 DLV - item_type
 DLV - navigation_direction
 DLV - slide_index
 DLV - carousel_location
 DLV - link_name
 DLV - link_destination
 DLV - conversion_value
 DLV - booking_id
 DLV - room_type
 ```
 
 ### Required Custom Triggers
 
 | Trigger Name | Type | Event Match |
 |--------------|------|-------------|
 | CE - page_navigation | Custom Event | `page_navigation` |
 | CE - button_click | Custom Event | `button_click` |
 | CE - cta_click | Custom Event | `cta_click` |
 | CE - card_click | Custom Event | `card_click` |
 | CE - modal_interaction | Custom Event | `modal_interaction` |
 | CE - form_start | Custom Event | `form_start` |
 | CE - form_field_focus | Custom Event | `form_field_focus` |
 | CE - form_submit | Custom Event | `form_submit` |
 | CE - form_abandon | Custom Event | `form_abandon` |
 | CE - scroll_depth | Custom Event | `scroll_depth` |
 | CE - section_view | Custom Event | `section_view` |
 | CE - carousel_navigate | Custom Event | `carousel_navigate` |
 | CE - link_click | Custom Event | `link_click` |
 | CE - package_viewed | Custom Event | `package_viewed` |
 | CE - room_viewed | Custom Event | `room_viewed` |
 | CE - property_viewed | Custom Event | `property_viewed` |
 | CE - review_interaction | Custom Event | `review_interaction` |
 | CE - whatsapp_click | Custom Event | `whatsapp_click` |
 | CE - call_click | Custom Event | `call_click` |
 | CE - get_directions_click | Custom Event | `get_directions_click` |
 | CE - booking_initiated | Custom Event | `booking_initiated` |
 | CE - booking_confirmed | Custom Event | `booking_confirmed` |
 | CE - whatsapp_engaged_validated | Custom Event | `whatsapp_engaged_validated` |
 | CE - call_engaged_validated | Custom Event | `call_engaged_validated` |
 | CE - lead_qualified | Custom Event | `lead_qualified` |
 | CE - group_enquiry_submit | Custom Event | `group_enquiry_submit` |
 | CE - b2b_enquiry_submit | Custom Event | `b2b_enquiry_submit` |
 | CE - session_quality_signal | Custom Event | `session_quality_signal` |
 | CE - high_intent_detected | Custom Event | `high_intent_detected` |
 | CE - hot_lead_detected | Custom Event | `hot_lead_detected` |
 
 ---
 
 ## 🛡️ TRAFFIC FILTERING
 
 Admin traffic is automatically excluded via `isLovableSession()`:
 - Lovable preview sessions (`__lovable_token` in URL)
 - Admin dashboard access
 - Franchise portal access
 
 ---
 
 ## 🔍 DEBUGGING
 
 ### Admin Dashboard Routes
 - **GTM Brain Tab**: `/admin/analytics` → "GTM Brain" tab
 - **DataLayer Debug**: `/admin/datalayer`
 - **Traffic Command Center**: `/admin/traffic`
 
 ### Browser Console
 All GTM events log: `[GTM Router] ✓ event_name (category)`
 Blocked events log: `[GTM Router] BLOCKED (admin): event_name`
 
 ---
 
 ## 📱 DEVICE-SPECIFIC EVENTS
 
 | Event | iOS | Android | Desktop |
 |-------|-----|---------|---------|
 | Tap-to-Call | ✅ | ✅ | ❌ |
 | Swipe Carousel | ✅ | ✅ | ❌ |
 | Scroll Depth | ✅ | ✅ | ✅ |
 | Hover Interactions | ❌ | ❌ | ✅ |
 | Touch Feedback | ✅ | ✅ | ❌ |