import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '../utils/piiRedactedLogger';

interface GDPRDataSummary {
  user_id: string;
  email: string;
  data_summary: {
    profile_exists: boolean;
    booking_count: number;
    profile_created: string;
  };
  export_options: {
    formats: string[];
    include_bookings: boolean;
    include_profile: boolean;
  };
}

interface DeletionInfo {
  user_id: string;
  email: string;
  can_delete: boolean;
  active_bookings: number;
  total_bookings: number;
  deletion_info: {
    what_will_be_deleted: string[];
    what_cannot_be_deleted: string[];
  };
}

export const useGDPRCompliance = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportUserData = async (options: {
    includeBookings?: boolean;
    includeProfile?: boolean;
    format?: 'json' | 'csv';
  } = {}) => {
    setLoading(true);
    setError(null);

    try {
      logger.gdpr('data_export_initiated', options);

      const { data, error } = await supabase.functions.invoke('gdpr-data-export', {
        body: {
          includeBookings: options.includeBookings ?? true,
          includeProfile: options.includeProfile ?? true,
          format: options.format ?? 'json'
        }
      });

      if (error) throw error;

      // Create and trigger download
      const filename = `data-export-${Date.now()}.${options.format || 'json'}`;
      const contentType = options.format === 'csv' ? 'text/csv' : 'application/json';
      const content = options.format === 'csv' ? data : JSON.stringify(data, null, 2);
      
      const blob = new Blob([content], { type: contentType });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      logger.gdpr('data_export_completed', { format: options.format, filename });
      return { success: true, filename };

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to export data';
      setError(errorMessage);
      logger.error('GDPR data export failed', { error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDataSummary = async (): Promise<GDPRDataSummary> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('gdpr-data-export', {
        method: 'GET'
      });

      if (error) throw error;

      logger.gdpr('data_summary_requested');
      return data;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get data summary';
      setError(errorMessage);
      logger.error('GDPR data summary failed', { error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getDeletionInfo = async (): Promise<DeletionInfo> => {
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.functions.invoke('gdpr-data-deletion', {
        method: 'GET'
      });

      if (error) throw error;

      logger.gdpr('deletion_info_requested');
      return data;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to get deletion info';
      setError(errorMessage);
      logger.error('GDPR deletion info failed', { error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const deleteUserData = async (confirmDeletion: boolean, reason?: string) => {
    if (!confirmDeletion) {
      throw new Error('Deletion confirmation required');
    }

    setLoading(true);
    setError(null);

    try {
      logger.gdpr('data_deletion_initiated', { reason });

      const { data, error } = await supabase.functions.invoke('gdpr-data-deletion', {
        body: {
          confirmDeletion: true,
          reason
        }
      });

      if (error) throw error;

      logger.gdpr('data_deletion_completed');
      
      // Sign out user after successful deletion
      await supabase.auth.signOut();
      
      return data;

    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete user data';
      setError(errorMessage);
      logger.error('GDPR data deletion failed', { error: errorMessage });
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    exportUserData,
    getDataSummary,
    getDeletionInfo,
    deleteUserData
  };
};