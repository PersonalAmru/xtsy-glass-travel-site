/**
 * Admin Calendar Page - Availability calendar
 */

import { AdminLayout } from '@/layouts/AdminLayout';
import { AvailabilityCalendar } from '@/components/admin/AvailabilityCalendar';

export default function AdminCalendar() {
  return (
    <AdminLayout>
      <div className="p-6">
        <AvailabilityCalendar />
      </div>
    </AdminLayout>
  );
}
