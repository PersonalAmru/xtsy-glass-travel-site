
export interface RoomType {
  id: string;
  name: string;
  description: string;
  capacity: number;
  base_price: number;
  amenities: string[];
  images: string[];
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role: 'guest' | 'staff' | 'admin' | 'channel_manager' | 'housekeeping' | 'front_desk';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface Inventory {
  id: string;
  room_type_id: string;
  date: string;
  total_units: number;
  available_units: number;
  rate: number;
  min_rate?: number;
  max_rate?: number;
  stop_sale: boolean;
  created_at: string;
  updated_at: string;
}

export interface OTAIntegration {
  id: string;
  ota_name: string;
  api_key?: string;
  api_secret?: string;
  endpoint_url?: string;
  is_active: boolean;
  sync_rates: boolean;
  sync_inventory: boolean;
  commission_rate?: number;
  mapping_config: Record<string, any>;
  last_sync?: string;
  created_at: string;
  updated_at: string;
}
