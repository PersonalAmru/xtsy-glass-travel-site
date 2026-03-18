
## Plan: Add Auto-Scroll to InteractiveSelector Carousel

### What
Add a 2.5-second auto-advance timer to the `InteractiveSelector` component so the hero carousel on the XTSY 270 page cycles through all 5 images automatically. The timer resets on user interaction (swipe or click).

### Technical Details

**File: `src/components/ui/interactive-selector.tsx`**

Add a `useEffect` that runs a `setInterval` every 2500ms, advancing `activeIndex` to the next slide (wrapping back to 0 after the last). The interval resets whenever the user manually changes the slide (click on desktop, swipe on mobile, or dot click).

- Add `autoPlay` interval ref
- In the interval callback: `setActiveIndex(prev => (prev + 1) % options.length)`
- Clear and restart the interval on any manual interaction (`handleOptionClick`, `handleTouchEnd`, dot click)
- Clean up interval on unmount

No other changes — layout, styling, touch handling, and desktop accordion behavior remain untouched.
