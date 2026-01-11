/**
 * Admin Demand Intelligence Page
 * View demand signals and actionable insights
 */

import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { DemandSignalsDashboard } from '@/components/admin/DemandSignalsDashboard';

export default function AdminDemand() {
  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6">
        <DemandSignalsDashboard />
      </div>
    </UnifiedAdminLayout>
  );
}
