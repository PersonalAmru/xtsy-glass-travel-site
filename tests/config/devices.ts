/**
 * Mobile device viewport configurations for visual regression testing
 */
export const mobileDevices = {
  iPhoneSE: { 
    name: 'iPhone SE',
    width: 375, 
    height: 667,
    deviceScaleFactor: 2,
  },
  iPhone12: { 
    name: 'iPhone 12',
    width: 390, 
    height: 844,
    deviceScaleFactor: 3,
  },
  iPhone14Pro: { 
    name: 'iPhone 14 Pro',
    width: 393, 
    height: 852,
    deviceScaleFactor: 3,
  },
  Pixel5: { 
    name: 'Pixel 5',
    width: 393, 
    height: 851,
    deviceScaleFactor: 2.75,
  },
  SamsungS21: { 
    name: 'Samsung Galaxy S21',
    width: 360, 
    height: 800,
    deviceScaleFactor: 3,
  },
} as const;

export type MobileDevice = keyof typeof mobileDevices;

/**
 * Get expected modal width for a device viewport
 * Modal width = calc(100vw - 32px), max 28rem (448px)
 */
export function getExpectedModalWidth(viewportWidth: number): number {
  const calculatedWidth = viewportWidth - 32;
  const maxWidth = 448; // 28rem
  return Math.min(calculatedWidth, maxWidth);
}

/**
 * Calculate expected modal position (should be centered)
 */
export function getExpectedModalPosition(viewportWidth: number, viewportHeight: number) {
  const modalWidth = getExpectedModalWidth(viewportWidth);
  return {
    left: (viewportWidth - modalWidth) / 2,
    centerX: viewportWidth / 2,
    centerY: viewportHeight / 2,
  };
}
