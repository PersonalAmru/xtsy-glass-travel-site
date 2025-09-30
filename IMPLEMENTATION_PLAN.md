# Real-Time Room Availability Sync - Implementation Plan

## Overview
Synchronize admin room availability controls with booking page calendars in real-time using Supabase realtime subscriptions.

## Architecture

### Database Layer
- **Table**: `room_availability_status` (already exists)
  - Columns: room_type_id, status, admin_note, override_until
  - Real-time enabled via Supabase

### Real-Time Data Flow
```
Admin Action → room_availability_status table → Supabase Realtime → Booking Page Calendar
```

## Implementation Steps

### Step 1: Enable Realtime on Database Table
- Add `room_availability_status` to `supabase_realtime` publication
- Enable `REPLICA IDENTITY FULL` for complete row data

### Step 2: Update useRoomAvailability Hook
- Subscribe to `room_availability_status` changes
- Merge admin status with inventory-based availability
- Handle all three data sources: room_inventory, blocked_dates, room_availability_status

### Step 3: Create Availability Calendar Component
- Visual calendar showing 30+ days
- Color-coded availability states:
  - Available (green)
  - Limited (yellow)
  - Sold Out (red)
  - Admin Blocked (gray/purple)
  - Maintenance (orange)
- Integrate into FastRoomCard

### Step 4: Admin Dashboard Integration
- Add RoomAvailabilityControl to admin dashboard
- Per-room-type status management
- Real-time status updates

### Step 5: Edge Function Enhancement
- Update blocking logic to work with room_availability_status
- Handle both date-specific blocks and room-wide status

### Step 6: UI/UX Polish
- Loading states during status changes
- Success/error notifications
- Optimistic updates for instant feedback

## Key Features

### Admin Side
1. Set room status: Available, Sold Out, Maintenance
2. Add admin notes visible to staff
3. Set temporary overrides with expiry
4. Block specific dates via calendar

### Booking Side
1. Real-time availability calendar
2. Visual indicators for each date
3. Disable booking for unavailable dates
4. Show reason when hovering over blocked dates

## Technical Considerations

### Performance
- Throttle real-time updates (max 1/second)
- Use React.memo for calendar components
- Debounce admin input changes

### Error Handling
- Fallback to polling if realtime fails
- Show stale data warnings
- Retry failed status updates

### Security
- RLS policies enforcing admin-only writes
- Public read access for availability status
- Audit logging for all status changes

## Success Criteria
✓ Admin blocks room → Booking calendar shows "Sold Out" within 1 second
✓ Admin unblocks room → Booking calendar shows "Available" within 1 second
✓ No page reloads required
✓ Works across multiple browser tabs/users
✓ Graceful degradation if realtime unavailable
