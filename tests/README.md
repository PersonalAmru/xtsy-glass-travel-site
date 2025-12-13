# Visual Regression Testing for Mobile Modals

This directory contains visual regression tests specifically designed to catch mobile modal layout issues before they reach production.

## Setup

```bash
# Install Playwright browsers
npx playwright install --with-deps

# Run all visual tests
npm run test:visual

# Run only mobile tests
npm run test:visual:mobile

# Update baseline screenshots (when layout changes are intentional)
npm run test:visual:update

# View test report
npm run test:visual:report
```

## Test Structure

```
tests/
├── config/
│   └── devices.ts          # Mobile device viewport configurations
├── helpers/
│   └── modal-helpers.ts    # Utility functions for modal testing
├── visual/
│   └── modals/
│       ├── travel-selection-modal.spec.ts
│       ├── all-modals.spec.ts
│       └── __snapshots__/  # Baseline screenshots (auto-generated)
└── README.md
```

## Key Features

### Mobile Device Coverage
- iPhone SE (375x667) - Smallest common viewport
- iPhone 12 (390x844) - Standard iPhone
- iPhone 14 Pro (393x852) - Latest iPhone
- Pixel 5 (393x851) - Android reference device
- Samsung Galaxy S21 (360x800) - Android with narrow viewport

### Automated Checks
1. **Centering Verification** - Modal must be centered horizontally and vertically
2. **Overflow Detection** - Modal must not extend beyond viewport edges
3. **Width Validation** - Modal width must follow `calc(100vw - 32px)` with max 28rem
4. **Visual Snapshots** - Pixel-by-pixel comparison against baseline images

## Adding Tests for New Modals

1. Add `data-testid="your-modal-name"` to the modal's `DialogContent` component
2. Create a new test file or add to `all-modals.spec.ts`
3. Run `npm run test:visual:update` to generate baseline screenshot

Example:
```typescript
import { test, expect } from '@playwright/test';
import { openModalByTrigger, verifyModalLayout } from '../../helpers/modal-helpers';

test('my-modal should be centered', async ({ page }) => {
  const modal = await openModalByTrigger(
    page,
    '/',                              // Route to navigate to
    'button:has-text("Open Modal")', // Selector for trigger
    'my-modal'                        // data-testid value
  );
  
  const { allPassed } = await verifyModalLayout(page, modal);
  expect(allPassed).toBe(true);
});
```

## CI Integration

Tests run automatically on pull requests via GitHub Actions. Failed tests upload:
- HTML report with interactive diff viewer
- Diff images showing pixel differences
- Screenshots of actual vs expected

## Troubleshooting

### Tests failing after intentional changes
Run `npm run test:visual:update` to update baseline screenshots.

### Tests flaky on CI
- Increase `maxDiffPixels` threshold in `playwright.config.ts`
- Add `page.waitForLoadState('networkidle')` before screenshots
- Use `hideDynamicContent()` helper to mask timestamps/prices

### Modal not opening in tests
- Ensure trigger selector is correct
- Add explicit waits: `await modal.waitFor({ state: 'visible' })`
- Check if modal requires authentication
