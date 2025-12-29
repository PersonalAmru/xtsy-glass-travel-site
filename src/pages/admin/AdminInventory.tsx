/**
 * Admin Inventory Page - Room inventory management
 */

import { AdminLayout } from '@/layouts/AdminLayout';
import { InventoryManager } from '@/components/admin/InventoryManager';

export default function AdminInventory() {
  return (
    <AdminLayout>
      <div className="p-6">
        <InventoryManager />
      </div>
    </AdminLayout>
  );
}
