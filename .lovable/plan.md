

## Fix: Review Marquee Not Scrolling

### Root Cause
The marquee animation is broken because of a mismatch between how keyframes are defined and how they're used:

- **Keyframes** (`marquee-left`, `marquee-right`) are defined in `tailwind.config.ts`, which means Tailwind only generates the `@keyframes` CSS when the corresponding utility classes (`animate-marquee-left`, `animate-marquee-right`) are used in markup.
- **But** `ReviewsSection.tsx` applies the animation via **inline styles** (`style={{ animation: 'marquee-left 40s linear infinite' }}`), not Tailwind classes. Since no element uses `className="animate-marquee-left"`, Tailwind tree-shakes the keyframes — they never appear in the final CSS.

### Fix

**Option A (cleanest):** Add the `@keyframes` to `src/index.css` so they exist regardless of Tailwind class usage. Then the inline style references will work.

**File: `src/index.css`** — Add raw `@keyframes` for `marquee-left` and `marquee-right`:
```css
@keyframes marquee-left {
  0% { transform: translateX(0%); }
  100% { transform: translateX(-33.333%); }
}
@keyframes marquee-right {
  0% { transform: translateX(-33.333%); }
  100% { transform: translateX(0%); }
}
```

No other files need changes. The inline `animation` style in `ReviewsSection.tsx` already references the correct keyframe names and durations.

