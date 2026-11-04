/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  /** Restrict even fixed-recipient templates to admins or trusted service-role callers. */
  requiresPrivileged?: boolean
  displayName?: string
  previewData?: Record<string, any>
}

import { template as adminBookingNotification } from './admin-booking-notification.tsx'
import { template as adminTripPlanReview } from './admin-trip-plan-review.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'admin-booking-notification': adminBookingNotification,
  'admin-trip-plan-review': adminTripPlanReview,
}
