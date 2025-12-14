# LCP Optimization Guide - XTSY

## Current Performance (Dec 2024)
- **LCP**: 1.1s - 2.9s (target: <2.5s) ✅
- **FCP**: ~3ms ✅

---

## Critical Rules to Maintain LCP Performance

### 1. LCP Element Protection
The LCP element is the XTSY brand symbol in the hero section:
```
/lovable-uploads/8059ea95-b64d-4eba-8b12-52e002c59567.png
```

**Never:**
- Change this image without updating all preload references
- Add lazy loading to this image
- Remove the `fetchpriority="high"` attribute
- Move the preload tag lower in `<head>`

**Locations to update if changing LCP image:**
- `index.html` (preload link + inline script)
- `src/components/HeroSection.tsx`
- `src/utils/criticalImagePreloader.ts`
- `src/main.tsx`

---

### 2. Script Loading Order (index.html)

**ALWAYS defer these scripts:**
- Google Analytics → Load after `window.load` + 100ms delay
- Razorpay → Load on-demand when payment needed
- Twemoji → Load 2s after DOMContentLoaded

**NEVER add to `<head>` without `async` or `defer`:**
- Any third-party analytics
- Payment gateways
- Social widgets
- Chat widgets

---

### 3. Font Loading Strategy

**Critical fonts** (Playfair Display) use preload:
```html
<link rel="preload" href="...Playfair+Display..." as="style" onload="...">
```

**Non-critical fonts** use print media trick:
```html
<link href="..." rel="stylesheet" media="print" onload="this.media='all'">
```

**Never:**
- Add fonts to `<head>` without `display=swap`
- Use blocking font loads
- Add more than 4 font weights per family

---

### 4. Image Optimization Checklist

For any new above-the-fold image:
- [ ] Add `loading="eager"` (NOT lazy)
- [ ] Add `fetchpriority="high"` (use lowercase!)
- [ ] Add `decoding="sync"`
- [ ] Specify `width` and `height` attributes
- [ ] Keep file size under 100KB
- [ ] Use WebP format when possible

For below-the-fold images:
- [ ] Use `loading="lazy"`
- [ ] Use `decoding="async"`

---

### 5. React Component Best Practices

**Header/Hero components:**
```tsx
// ✅ CORRECT - lowercase fetchpriority
<img 
  src={image}
  loading="eager"
  // @ts-expect-error - React 18.3 compatibility
  fetchpriority="high"
  decoding="sync"
/>

// ❌ WRONG - causes React warning
<img fetchPriority="high" />
```

**Lazy load non-critical components:**
```tsx
const TravelSection = lazy(() => import('./TravelSection'));
```

---

### 6. Monitoring Performance

The `PerformanceMonitor` component logs LCP automatically:
```
console.log('Largest Contentful Paint: XXXms');
```

**Target thresholds:**
- LCP < 2,500ms → ✅ Good
- LCP 2,500-4,000ms → ⚠️ Needs improvement
- LCP > 4,000ms → ❌ Poor

---

### 7. Common LCP Killers to Avoid

| Issue | Impact | Solution |
|-------|--------|----------|
| Blocking scripts in `<head>` | +2-5s | Use `defer` or dynamic loading |
| Render-blocking CSS | +1-3s | Inline critical CSS, async load rest |
| Large hero images | +1-4s | Compress to <100KB, use WebP |
| Web fonts without swap | +0.5-2s | Always use `display=swap` |
| Third-party scripts | +1-5s | Defer until after load event |

---

### 8. Pre-deployment Checklist

Before any deployment:
- [ ] Run Lighthouse audit (target LCP < 2.5s)
- [ ] Check for new blocking resources in `<head>`
- [ ] Verify LCP image preload is intact
- [ ] Test on slow 3G connection
- [ ] Check console for `fetchPriority` warnings

---

## Quick Reference: File Locations

| Purpose | File |
|---------|------|
| Preload tags | `index.html` |
| Critical image preloader | `src/utils/criticalImagePreloader.ts` |
| LCP element (hero symbol) | `src/components/HeroSection.tsx` |
| Performance monitor | `src/components/PerformanceMonitor.tsx` |
| Main entry (preload call) | `src/main.tsx` |
