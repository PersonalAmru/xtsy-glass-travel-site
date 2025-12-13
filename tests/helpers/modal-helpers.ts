import { Page, expect, Locator } from '@playwright/test';
import { getExpectedModalWidth, getExpectedModalPosition } from '../config/devices';

/**
 * Wait for modal animations to complete
 */
export async function waitForModalAnimation(page: Page, timeout = 500): Promise<void> {
  await page.waitForTimeout(timeout);
}

/**
 * Open the Travel Selection Modal
 */
export async function openTravelModal(page: Page): Promise<Locator> {
  // Navigate to home page
  await page.goto('/');
  
  // Click on the Travel link in navigation to open the modal
  const travelLink = page.locator('text=Travel').first();
  await travelLink.click();
  
  // Wait for modal to appear
  const modal = page.locator('[data-testid="travel-selection-modal"]');
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  await waitForModalAnimation(page);
  
  return modal;
}

/**
 * Open a modal by navigating to a route and clicking a trigger
 */
export async function openModalByTrigger(
  page: Page, 
  route: string, 
  triggerSelector: string,
  modalTestId: string
): Promise<Locator> {
  await page.goto(route);
  await page.waitForLoadState('networkidle');
  
  const trigger = page.locator(triggerSelector);
  await trigger.click();
  
  const modal = page.locator(`[data-testid="${modalTestId}"]`);
  await modal.waitFor({ state: 'visible', timeout: 5000 });
  await waitForModalAnimation(page);
  
  return modal;
}

/**
 * Verify modal is centered on screen
 */
export async function verifyModalCentering(
  page: Page, 
  modal: Locator
): Promise<{ passed: boolean; details: string }> {
  const viewport = page.viewportSize();
  if (!viewport) {
    return { passed: false, details: 'No viewport size available' };
  }
  
  const boundingBox = await modal.boundingBox();
  if (!boundingBox) {
    return { passed: false, details: 'Modal has no bounding box' };
  }
  
  const expectedPosition = getExpectedModalPosition(viewport.width, viewport.height);
  const modalCenterX = boundingBox.x + boundingBox.width / 2;
  const modalCenterY = boundingBox.y + boundingBox.height / 2;
  
  // Allow 5px tolerance for centering
  const tolerance = 5;
  const horizontallyCentered = Math.abs(modalCenterX - expectedPosition.centerX) <= tolerance;
  const verticallyCentered = Math.abs(modalCenterY - expectedPosition.centerY) <= tolerance;
  
  if (!horizontallyCentered || !verticallyCentered) {
    return {
      passed: false,
      details: `Modal not centered. Expected center: (${expectedPosition.centerX}, ${expectedPosition.centerY}), Actual: (${modalCenterX.toFixed(1)}, ${modalCenterY.toFixed(1)})`
    };
  }
  
  return { passed: true, details: 'Modal is properly centered' };
}

/**
 * Verify modal has no horizontal overflow
 */
export async function verifyNoHorizontalOverflow(
  page: Page, 
  modal: Locator
): Promise<{ passed: boolean; details: string }> {
  const viewport = page.viewportSize();
  if (!viewport) {
    return { passed: false, details: 'No viewport size available' };
  }
  
  const boundingBox = await modal.boundingBox();
  if (!boundingBox) {
    return { passed: false, details: 'Modal has no bounding box' };
  }
  
  const leftEdge = boundingBox.x;
  const rightEdge = boundingBox.x + boundingBox.width;
  
  // Check if modal extends beyond viewport
  if (leftEdge < 0) {
    return { passed: false, details: `Modal overflows left by ${Math.abs(leftEdge)}px` };
  }
  
  if (rightEdge > viewport.width) {
    return { passed: false, details: `Modal overflows right by ${rightEdge - viewport.width}px` };
  }
  
  // Check for expected margins (16px on each side)
  const expectedMargin = 16;
  if (leftEdge < expectedMargin - 2) { // 2px tolerance
    return { passed: false, details: `Left margin too small: ${leftEdge}px (expected ~${expectedMargin}px)` };
  }
  
  return { passed: true, details: 'Modal has proper margins and no overflow' };
}

/**
 * Verify modal width matches expected calculation
 */
export async function verifyModalWidth(
  page: Page, 
  modal: Locator
): Promise<{ passed: boolean; details: string }> {
  const viewport = page.viewportSize();
  if (!viewport) {
    return { passed: false, details: 'No viewport size available' };
  }
  
  const boundingBox = await modal.boundingBox();
  if (!boundingBox) {
    return { passed: false, details: 'Modal has no bounding box' };
  }
  
  const expectedWidth = getExpectedModalWidth(viewport.width);
  const tolerance = 2; // 2px tolerance
  
  if (Math.abs(boundingBox.width - expectedWidth) > tolerance) {
    return {
      passed: false,
      details: `Modal width incorrect. Expected: ${expectedWidth}px, Actual: ${boundingBox.width}px`
    };
  }
  
  return { passed: true, details: `Modal width correct: ${boundingBox.width}px` };
}

/**
 * Run all modal layout verifications
 */
export async function verifyModalLayout(
  page: Page, 
  modal: Locator
): Promise<{ allPassed: boolean; results: Array<{ test: string; passed: boolean; details: string }> }> {
  const results = [
    { test: 'centering', ...(await verifyModalCentering(page, modal)) },
    { test: 'no-overflow', ...(await verifyNoHorizontalOverflow(page, modal)) },
    { test: 'width', ...(await verifyModalWidth(page, modal)) },
  ];
  
  const allPassed = results.every(r => r.passed);
  
  return { allPassed, results };
}

/**
 * Hide dynamic content that might cause false diffs
 */
export async function hideDynamicContent(page: Page): Promise<void> {
  await page.addStyleTag({
    content: `
      /* Hide timestamps and dynamic dates */
      [data-dynamic], time, .timestamp { visibility: hidden !important; }
      
      /* Hide loading spinners */
      .animate-spin, .loading { visibility: hidden !important; }
      
      /* Disable all animations for consistent screenshots */
      *, *::before, *::after {
        animation-duration: 0s !important;
        animation-delay: 0s !important;
        transition-duration: 0s !important;
        transition-delay: 0s !important;
      }
    `
  });
}

/**
 * Take a screenshot with consistent settings
 */
export async function takeModalScreenshot(
  page: Page,
  modal: Locator,
  name: string
): Promise<Buffer> {
  await hideDynamicContent(page);
  await waitForModalAnimation(page, 100);
  
  return await modal.screenshot({
    animations: 'disabled',
  });
}
