/**
 * Admin Inventory Page - Room inventory management
 */

import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { InventoryManager } from '@/components/admin/InventoryManager';

export default function AdminInventory() {
  return (
    <UnifiedAdminLayout>
      <div className="p-6">
        <InventoryManager />
      </div>
    </UnifiedAdminLayout>
  );
}
