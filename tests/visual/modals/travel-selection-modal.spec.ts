import { test, expect } from '@playwright/test';
import { 
  openTravelModal, 
  verifyModalLayout, 
  takeModalScreenshot,
  waitForModalAnimation 
} from '../../helpers/modal-helpers';

test.describe('Travel Selection Modal - Visual Regression', () => {
  
  test('should be properly centered on mobile viewport', async ({ page }) => {
    const modal = await openTravelModal(page);
    
    const { allPassed, results } = await verifyModalLayout(page, modal);
    
    // Log detailed results for debugging
    for (const result of results) {
      console.log(`${result.test}: ${result.passed ? '✅' : '❌'} ${result.details}`);
    }
    
    expect(allPassed, `Layout verification failed: ${JSON.stringify(results)}`).toBe(true);
  });

  test('should match visual snapshot', async ({ page }) => {
    const modal = await openTravelModal(page);
    
    await expect(modal).toHaveScreenshot('travel-selection-modal.png', {
      maxDiffPixels: 100,
    });
  });

  test('should have no horizontal overflow', async ({ page }) => {
    const modal = await openTravelModal(page);
    
    const boundingBox = await modal.boundingBox();
    const viewport = page.viewportSize();
    
    expect(boundingBox).not.toBeNull();
    expect(viewport).not.toBeNull();
    
    if (boundingBox && viewport) {
      // Modal should not extend beyond viewport
      expect(boundingBox.x).toBeGreaterThanOrEqual(0);
      expect(boundingBox.x + boundingBox.width).toBeLessThanOrEqual(viewport.width);
      
      // Should have ~16px margins on each side
      expect(boundingBox.x).toBeGreaterThanOrEqual(14); // Allow 2px tolerance
    }
  });

  test('should have accessible buttons', async ({ page }) => {
    const modal = await openTravelModal(page);
    
    // Check domestic button is visible and clickable
    const domesticButton = modal.locator('text=Domestic Travel');
    await expect(domesticButton).toBeVisible();
    
    // Check international button is visible
    const internationalButton = modal.locator('text=XTSY Asia & Europe');
    await expect(internationalButton).toBeVisible();
    
    // Verify buttons are within modal bounds
    const modalBox = await modal.boundingBox();
    const domesticBox = await domesticButton.boundingBox();
    
    if (modalBox && domesticBox) {
      expect(domesticBox.x).toBeGreaterThanOrEqual(modalBox.x);
      expect(domesticBox.x + domesticBox.width).toBeLessThanOrEqual(modalBox.x + modalBox.width);
    }
  });

  test('should close when clicking close button', async ({ page }) => {
    const modal = await openTravelModal(page);
    
    // Find and click the close button
    const closeButton = modal.locator('button[class*="absolute"]').first();
    await closeButton.click();
    
    // Modal should be hidden
    await expect(modal).not.toBeVisible();
  });

  test('should navigate correctly when selecting domestic', async ({ page }) => {
    const modal = await openTravelModal(page);
    
    const domesticButton = modal.locator('text=Domestic Travel');
    await domesticButton.click();
    
    // Should navigate to travel page with domestic tab
    await expect(page).toHaveURL(/\/travel\?tab=domestic/);
  });
});
