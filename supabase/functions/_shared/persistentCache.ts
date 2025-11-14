import { SupabaseClient } from 'https://esm.sh/@supabase/supabase-js@2.55.0';

export interface CacheEntry {
  key: string;
  value: any;
  expires_at: string;
  created_at?: string;
}

/**
 * Persistent cache using Supabase database
 * Survives edge function cold starts
 */
export class PersistentCache {
  private supabase: SupabaseClient;
  private tableName = 'edge_function_cache';

  constructor(supabase: SupabaseClient) {
    this.supabase = supabase;
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('value, expires_at')
        .eq('key', key)
        .single();

      if (error || !data) {
        return null;
      }

      // Check if expired
      if (new Date(data.expires_at) < new Date()) {
        // Delete expired entry
        await this.delete(key);
        return null;
      }

      return data.value as T;
    } catch (error) {
      console.error('Cache get error:', error);
      return null;
    }
  }

  async set(key: string, value: any, ttlSeconds: number): Promise<boolean> {
    try {
      const expiresAt = new Date(Date.now() + ttlSeconds * 1000).toISOString();

      const { error } = await this.supabase
        .from(this.tableName)
        .upsert({
          key,
          value,
          expires_at: expiresAt,
        }, {
          onConflict: 'key',
        });

      if (error) {
        console.error('Cache set error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Cache set error:', error);
      return false;
    }
  }

  async delete(key: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('key', key);

      return !error;
    } catch (error) {
      console.error('Cache delete error:', error);
      return false;
    }
  }

  async invalidatePattern(pattern: string): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .like('key', pattern);

      return !error;
    } catch (error) {
      console.error('Cache invalidate error:', error);
      return false;
    }
  }

  async cleanup(): Promise<number> {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .delete()
        .lt('expires_at', new Date().toISOString())
        .select('key');

      if (error) {
        console.error('Cache cleanup error:', error);
        return 0;
      }

      return data?.length || 0;
    } catch (error) {
      console.error('Cache cleanup error:', error);
      return 0;
    }
  }
}
