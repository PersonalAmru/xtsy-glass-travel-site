/**
 * Admin Inventory Page - Room inventory management
 */

import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { InventoryCalendarView } from '@/components/admin/InventoryCalendarView';

export default function AdminInventory() {
  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6">
        <InventoryCalendarView />
      </div>
    </UnifiedAdminLayout>
  );
}
