// Enhanced Audit Log Service - Immutable Audit Trail
import { supabase } from '@/integrations/supabase/client';
import { EnhancedAuditLog } from '@/types/commercial';
import type { Json } from '@/integrations/supabase/types';

type ActorRole = 'admin' | 'franchise' | 'system';

/**
 * Get audit logs for a property
 */
export async function getPropertyAuditLogs(
  propertyId: string,
  options?: {
    startDate?: string;
    endDate?: string;
    action?: string;
    limit?: number;
  }
): Promise<EnhancedAuditLog[]> {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .eq('property_id', propertyId)
    .order('created_at', { ascending: false });

  if (options?.startDate) {
    query = query.gte('created_at', options.startDate);
  }
  if (options?.endDate) {
    query = query.lte('created_at', options.endDate);
  }
  if (options?.action) {
    query = query.eq('action', options.action);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return data as EnhancedAuditLog[];
}

/**
 * Get audit logs by date range
 */
export async function getAuditLogsByDateRange(
  startDate: string,
  endDate: string,
  propertyId?: string
): Promise<EnhancedAuditLog[]> {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .gte('created_at', startDate)
    .lte('created_at', endDate)
    .order('created_at', { ascending: false });

  if (propertyId) {
    query = query.eq('property_id', propertyId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching audit logs:', error);
    return [];
  }

  return data as EnhancedAuditLog[];
}

/**
 * Get audit log by ID
 */
export async function getAuditLogById(
  logId: string
): Promise<EnhancedAuditLog | null> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('id', logId)
    .single();

  if (error) {
    console.error('Error fetching audit log:', error);
    return null;
  }

  return data as EnhancedAuditLog;
}

/**
 * Create a manual audit log entry
 */
export async function createAuditLog(
  entry: {
    action: string;
    table_name: string;
    record_id?: string;
    old_values?: Record<string, unknown>;
    new_values?: Record<string, unknown>;
    property_id?: string;
    actor_role?: ActorRole;
    metadata?: Record<string, unknown>;
  }
): Promise<{ success: boolean; id?: string; error?: string }> {
  const { data, error } = await supabase
    .from('audit_logs')
    .insert([{
      action: entry.action,
      table_name: entry.table_name,
      record_id: entry.record_id || null,
      old_values: (entry.old_values || null) as Json,
      new_values: (entry.new_values || null) as Json,
      property_id: entry.property_id || null,
      actor_role: entry.actor_role || 'system',
      snapshot_type: 'mutation',
      is_rollback: false,
      metadata: (entry.metadata || {}) as Json,
    }])
    .select('id')
    .single();

  if (error) {
    console.error('Error creating audit log:', error);
    return { success: false, error: error.message };
  }

  return { success: true, id: data.id };
}

/**
 * Apply a rollback from an audit log snapshot
 */
export async function applyRollback(
  auditLogId: string
): Promise<{ success: boolean; error?: string }> {
  // Get the original audit log
  const originalLog = await getAuditLogById(auditLogId);
  
  if (!originalLog) {
    return { success: false, error: 'Audit log not found' };
  }

  if (!originalLog.old_values) {
    return { success: false, error: 'No previous state to rollback to' };
  }

  const recordId = originalLog.record_id;

  if (!recordId) {
    return { success: false, error: 'No record ID for rollback' };
  }

  // For rollback, we log but don't auto-apply (safety measure)
  // Admin must manually apply the old values after review
  await supabase
    .from('audit_logs')
    .insert([{
      action: 'ROLLBACK_REQUESTED',
      table_name: originalLog.table_name,
      record_id: recordId,
      old_values: (originalLog.new_values || null) as Json,
      new_values: (originalLog.old_values || null) as Json,
      property_id: originalLog.property_id,
      actor_role: 'admin',
      snapshot_type: 'rollback',
      rollback_of: auditLogId,
      is_rollback: true,
      metadata: { original_audit_id: auditLogId } as Json,
    }]);

  return { success: true };
}

/**
 * Get rollback history for a record
 */
export async function getRollbackHistory(
  recordId: string
): Promise<EnhancedAuditLog[]> {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .eq('record_id', recordId)
    .eq('is_rollback', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching rollback history:', error);
    return [];
  }

  return data as EnhancedAuditLog[];
}

/**
 * Get audit summary for dashboard
 */
export async function getAuditSummary(
  propertyId?: string,
  days: number = 7
): Promise<{
  total_actions: number;
  by_action: Record<string, number>;
  by_table: Record<string, number>;
  by_actor_role: Record<string, number>;
  rollbacks: number;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  let query = supabase
    .from('audit_logs')
    .select('action, table_name, actor_role, is_rollback')
    .gte('created_at', startDate.toISOString());

  if (propertyId) {
    query = query.eq('property_id', propertyId);
  }

  const { data, error } = await query;

  if (error || !data) {
    return {
      total_actions: 0,
      by_action: {},
      by_table: {},
      by_actor_role: {},
      rollbacks: 0,
    };
  }

  const summary = {
    total_actions: data.length,
    by_action: {} as Record<string, number>,
    by_table: {} as Record<string, number>,
    by_actor_role: {} as Record<string, number>,
    rollbacks: 0,
  };

  data.forEach((log) => {
    summary.by_action[log.action] = (summary.by_action[log.action] || 0) + 1;
    summary.by_table[log.table_name] = (summary.by_table[log.table_name] || 0) + 1;
    if (log.actor_role) {
      summary.by_actor_role[log.actor_role] = (summary.by_actor_role[log.actor_role] || 0) + 1;
    }
    if (log.is_rollback) {
      summary.rollbacks++;
    }
  });

  return summary;
}

/**
 * Search audit logs
 */
export async function searchAuditLogs(
  searchTerm: string,
  options?: {
    propertyId?: string;
    limit?: number;
  }
): Promise<EnhancedAuditLog[]> {
  let query = supabase
    .from('audit_logs')
    .select('*')
    .or(`action.ilike.%${searchTerm}%,table_name.ilike.%${searchTerm}%`)
    .order('created_at', { ascending: false });

  if (options?.propertyId) {
    query = query.eq('property_id', options.propertyId);
  }
  if (options?.limit) {
    query = query.limit(options.limit);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error searching audit logs:', error);
    return [];
  }

  return data as EnhancedAuditLog[];
}

/**
 * Get changes between two audit snapshots
 */
export function getChanges(
  oldValues: Record<string, unknown> | null,
  newValues: Record<string, unknown> | null
): { field: string; oldValue: unknown; newValue: unknown }[] {
  const changes: { field: string; oldValue: unknown; newValue: unknown }[] = [];
  
  if (!oldValues && !newValues) return changes;

  const allKeys = new Set([
    ...Object.keys(oldValues || {}),
    ...Object.keys(newValues || {}),
  ]);

  allKeys.forEach((key) => {
    const oldVal = oldValues?.[key];
    const newVal = newValues?.[key];

    if (JSON.stringify(oldVal) !== JSON.stringify(newVal)) {
      changes.push({
        field: key,
        oldValue: oldVal,
        newValue: newVal,
      });
    }
  });

  return changes;
}
