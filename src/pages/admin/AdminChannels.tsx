/**
 * Admin Channel Strategy Page
 * Manage OTA distribution, inventory caps, and channel performance
 */

import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { ChannelPerformanceDashboard } from '@/components/admin/ChannelPerformanceDashboard';

export default function AdminChannels() {
  return (
    <UnifiedAdminLayout>
      <div className="p-4 md:p-6">
        <ChannelPerformanceDashboard />
      </div>
    </UnifiedAdminLayout>
  );
}
