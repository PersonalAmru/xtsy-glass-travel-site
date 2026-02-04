
# GTM & Landing Page Improvements Plan

**Created:** 2026-02-04  
**Status:** ✅ Completed  
**Priority:** High  

---

## 📊 Overview

This plan addressed all GTM tracking gaps and landing page improvements identified in the analysis. All user interactions are now properly tracked and counted as events in GA4.

---

## 🏷️ Phase 1: GTM Event Tracking Improvements

### 1.1 Scroll Depth Tracking (Homepage)
**Status:** ✅ Completed  
**Files:** `src/hooks/useScrollDepthTracking.ts`

- [x] Created `useScrollDepthTracking` hook with debounced scroll listener
- [x] Tracks scroll milestones: 25%, 50%, 75%, 100%
- [x] Fires `scroll_depth` event at each milestone (once per session)
- [x] Integrated with homepage via Index.tsx

### 1.2 Review Section Tracking
**Status:** ✅ Completed  
**Files:** `src/components/ReviewsSection.tsx`

- [x] Added `review_interaction` event with action types
- [x] Tracks review expansion (review_expanded)
- [x] Tracks view all modal open (view_all_opened)
- [x] Includes review source and property metadata

### 1.3 Group Booking Form Tracking
**Status:** ✅ Completed  
**Files:** `src/components/GroupBookingForm.tsx`, `src/components/B2BBookingForm.tsx`

- [x] Added `group_enquiry_start` event (form opened)
- [x] Added `group_enquiry_submit` event (form submitted)
- [x] Added `b2b_enquiry_start` and `b2b_enquiry_submit`
- [x] Includes group size, nights, value, food addons metadata

### 1.4 Register New Events in GTM Router
**Status:** ✅ Completed  
**Files:** `src/utils/gtmEventRouter.ts`

Added events:
- [x] `group_enquiry_start`
- [x] `group_enquiry_submit` (conversion, valueMultiplier: 1.5)
- [x] `b2b_enquiry_start`
- [x] `b2b_enquiry_submit` (conversion, valueMultiplier: 2.0)
- [x] `review_interaction`
- [x] `review_source_click`
- [x] `trust_signal_view`

---

## 🏠 Phase 2: Landing Page SEO Improvements

### 2.1 Add React Helmet for Meta Tags
**Status:** ✅ Completed  
**Files:** `src/components/SEOHead.tsx`, `src/pages/Index.tsx`

- [x] Created `SEOHead` component using react-helmet
- [x] Added dynamic `<title>` and `<meta description>` tags
- [x] Meta tags now properly injected into `<head>`
- [x] Integrated with homepage
