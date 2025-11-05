# XTSY Typography System Guide

## Responsive Text Sizing Philosophy

Our typography system is designed to be fluid and readable across all devices - from mobile phones (320px) to large desktop screens (1920px+).

### Base Font Size Scaling

The root font size (`html`) scales automatically based on viewport width:

- **Mobile (< 640px)**: 14px base
- **Tablet (640px - 767px)**: 15px base
- **Desktop (768px+)**: 16px base

This creates a fluid foundation for all relative sizing (rem/em units).

## Heading System

### Hero Headings
```tsx
// For main page titles and hero sections
className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-center"

// Or use utility class:
className="heading-hero"
```

**Size Scale:**
- Mobile: 30px (1.875rem)
- Small Tablet: 36px (2.25rem)
- Tablet: 48px (3rem)
- Desktop: 60px (3.75rem)
- Large Desktop: 72px (4.5rem)

### Section Headings
```tsx
// For main section titles
className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center"

// Or use utility class:
className="heading-section"
```

**Size Scale:**
- Mobile: 24px
- Small Tablet: 30px
- Tablet: 36px
- Desktop: 48px

### Subsection Headings
```tsx
// For subsection titles and card headers
className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold leading-snug"

// Or use utility class:
className="heading-subsection"
```

**Size Scale:**
- Mobile: 20px
- Small Tablet: 24px
- Tablet: 30px
- Desktop: 36px

### Card Headings
```tsx
// For card titles and smaller sections
className="text-lg sm:text-xl md:text-2xl font-semibold leading-snug text-left"

// Or use utility class:
className="heading-card"
```

**Size Scale:**
- Mobile: 18px
- Small Tablet: 20px
- Tablet/Desktop: 24px

## Body Text System

### Large Body Text
```tsx
// For introductory paragraphs and important text
className="text-base sm:text-lg md:text-xl leading-relaxed"

// Or use utility class:
className="body-large"
```

**Size Scale:**
- Mobile: 16px
- Small Tablet: 18px
- Tablet/Desktop: 20px

### Normal Body Text
```tsx
// For standard paragraph text
className="text-sm sm:text-base md:text-lg leading-relaxed"

// Or use utility class:
className="body-normal"
```

**Size Scale:**
- Mobile: 14px
- Small Tablet: 16px
- Tablet/Desktop: 18px

### Small Body Text
```tsx
// For secondary text and descriptions
className="text-xs sm:text-sm md:text-base leading-normal"

// Or use utility class:
className="body-small"
```

**Size Scale:**
- Mobile: 12px
- Small Tablet: 14px
- Tablet/Desktop: 16px

## Label and UI Text

### Large Labels
```tsx
// For form labels and button text
className="text-sm sm:text-base font-medium"

// Or use utility class:
className="label-large"
```

### Normal Labels
```tsx
// For small labels and metadata
className="text-xs sm:text-sm font-medium"

// Or use utility class:
className="label-normal"
```

### Captions
```tsx
// For tiny text, legal disclaimers
className="text-xs leading-tight"

// Or use utility class:
className="caption"
```

## Responsive Text Alignment

### Center Aligned
```tsx
// Always centered
className="text-center"
```

### Responsive Left Alignment
```tsx
// Centered on mobile/tablet, left on desktop
className="text-center sm:text-center md:text-left"

// Or use utility class:
className="text-responsive-left"
```

### Always Left
```tsx
// Always left aligned
className="text-left"

// Or use utility class:
className="text-responsive-start"
```

## Line Height Guidelines

Line heights are automatically optimized for each viewport:

### Mobile (< 640px)
- **H1/Hero**: 1.2 (tight for impact)
- **H2/Section**: 1.3
- **H3/Subsection**: 1.4
- **Body Text**: 1.6 (comfortable reading)

### Tablet (640px - 1023px)
- **H1/Hero**: 1.2
- **H2/Section**: 1.3
- **H3/Subsection**: 1.4
- **Body Text**: 1.65

### Desktop (1024px+)
- **H1/Hero**: 1.1 (tighter for impact)
- **H2/Section**: 1.2
- **H3/Subsection**: 1.3
- **Body Text**: 1.7 (maximum readability)

## Best Practices

### ✅ DO

1. **Use responsive classes for all text**
   ```tsx
   <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
   ```

2. **Specify alignment for different breakpoints**
   ```tsx
   <p className="text-center sm:text-center md:text-left">
   ```

3. **Use semantic HTML**
   ```tsx
   <h1> for page titles
   <h2> for section titles
   <h3> for subsection titles
   <p> for paragraphs
   ```

4. **Maintain hierarchy**
   - Don't skip heading levels (h1 → h3)
   - Larger text = more important content

### ❌ DON'T

1. **Don't use fixed sizes only**
   ```tsx
   // Bad
   <h1 className="text-4xl">
   
   // Good
   <h1 className="text-3xl sm:text-4xl md:text-5xl">
   ```

2. **Don't forget mobile sizes**
   ```tsx
   // Bad (too large on mobile)
   <p className="text-2xl">
   
   // Good
   <p className="text-base sm:text-lg md:text-xl">
   ```

3. **Don't use inline styles for text sizing**
   ```tsx
   // Bad
   <h1 style={{fontSize: '48px'}}>
   
   // Good
   <h1 className="heading-hero">
   ```

## Testing Checklist

Before deploying, test typography on:

- [ ] Mobile (320px - 639px)
- [ ] Tablet (640px - 1023px)
- [ ] Desktop (1024px - 1279px)
- [ ] Large Desktop (1280px+)

Ensure:
- [ ] Text is readable at all sizes
- [ ] Line lengths are comfortable (45-75 characters)
- [ ] Headings maintain visual hierarchy
- [ ] No text overflow or wrapping issues
- [ ] Alignment works across breakpoints

## Common Patterns

### Hero Section
```tsx
<section className="text-center">
  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
    Hero Title
  </h1>
  <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
    Hero description text
  </p>
</section>
```

### Content Section
```tsx
<section>
  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8">
    Section Title
  </h2>
  <p className="text-sm sm:text-base md:text-lg leading-relaxed text-center max-w-4xl mx-auto">
    Section content
  </p>
</section>
```

### Card Component
```tsx
<div className="card">
  <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2">
    Card Title
  </h3>
  <p className="text-xs sm:text-sm md:text-base text-gray-600">
    Card description
  </p>
</div>
```

## Mobile-First Approach

Always start with mobile sizing and scale up:

```tsx
// ✅ Mobile-first (recommended)
text-sm sm:text-base md:text-lg lg:text-xl

// ❌ Desktop-first (not recommended)
text-xl lg:text-lg md:text-base sm:text-sm
```

This ensures better performance and clearer intent.

## Accessibility

- Minimum text size on mobile: 14px (text-sm or larger)
- Minimum touch target: 44x44px for interactive text
- Sufficient color contrast: WCAG AA minimum (4.5:1 for normal text)
- Use semantic HTML for screen readers

## Performance Tips

1. **Avoid font size transitions** - They're expensive to animate
2. **Use system fonts** when possible for instant load
3. **Limit custom font weights** - Only load what you use
4. **Subset fonts** - Remove unused characters

## Quick Reference

| Element | Mobile | Tablet | Desktop |
|---------|---------|---------|----------|
| Hero H1 | 30px | 48px | 60px+ |
| Section H2 | 24px | 36px | 48px |
| Subsection H3 | 20px | 30px | 36px |
| Card H4 | 18px | 20px | 24px |
| Body Large | 16px | 18px | 20px |
| Body Normal | 14px | 16px | 18px |
| Body Small | 12px | 14px | 16px |
| Labels | 12-14px | 14-16px | 14-16px |
| Captions | 12px | 12px | 12px |

---

**Last Updated**: Current version implements fluid scaling across all breakpoints for optimal readability and user experience.
