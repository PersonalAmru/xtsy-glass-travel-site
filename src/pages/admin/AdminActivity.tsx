/**
 * Admin Activity Page - Real-time visitor tracking
 */

import { UnifiedAdminLayout } from '@/layouts/UnifiedAdminLayout';
import { AppleCard } from '@/components/admin/AppleCard';
import { Activity } from 'lucide-react';

export default function AdminActivity() {
  return (
    <UnifiedAdminLayout>
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-2xl font-bold tracking-tight">Live Activity</h1>
          <p className="text-sm text-muted-foreground">Real-time visitor tracking</p>
        </header>

        <AppleCard variant="elevated" className="text-center py-12">
          <Activity className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Real-time activity feed coming soon</p>
        </AppleCard>
      </div>
    </UnifiedAdminLayout>
  );
}
