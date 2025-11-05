import { z } from 'https://deno.land/x/zod@v3.22.4/mod.ts';

// Newsletter signup validation schema
export const newsletterSchema = z.object({
  email: z.string()
    .trim()
    .toLowerCase()
    .email({ message: 'Invalid email address' })
    .max(255, { message: 'Email must be less than 255 characters' }),
  
  fullName: z.string()
    .trim()
    .min(1, { message: 'Name is required' })
    .max(100, { message: 'Name must be less than 100 characters' })
    .regex(/^[a-zA-Z\s.'-]+$/, { message: 'Name contains invalid characters' }),
  
  interests: z.array(z.string())
    .max(10, { message: 'Maximum 10 interests allowed' })
    .default([])
});

export type NewsletterSignupData = z.infer<typeof newsletterSchema>;

// HTML escape function to prevent XSS
export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// Sanitize array of strings for safe display
export function sanitizeArray(arr: string[]): string[] {
  return arr.map(item => escapeHtml(item.trim())).filter(item => item.length > 0);
}