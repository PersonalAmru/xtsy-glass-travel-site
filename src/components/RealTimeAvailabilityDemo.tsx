import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, WifiIcon, ShieldCheckIcon, RefreshCcwIcon, DatabaseIcon, BellIcon } from 'lucide-react';

const RealTimeAvailabilityDemo: React.FC = () => {
  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Real-Time Room Availability System
        </h1>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
          A comprehensive real-time availability synchronization system that ensures booking data 
          is always accurate across admin dashboard and customer booking flow.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Single Source of Truth */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DatabaseIcon className="w-5 h-5 text-primary" />
              Single Source of Truth
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The <code>blocked_dates</code> table serves as the unified source for room availability,
              eliminating discrepancies between admin and customer views.
            </p>
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs">blocked_dates table</Badge>
              <Badge variant="outline" className="text-xs">room_inventory table</Badge>
              <Badge variant="outline" className="text-xs">bookings table</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Real-Time Updates */}
        <Card className="border-success/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <WifiIcon className="w-5 h-5 text-success" />
              Real-Time Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Supabase WebSocket subscriptions provide instant updates when availability changes,
              ensuring all users see the latest data without page refreshes.
            </p>
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs bg-success/10">postgres_changes</Badge>
              <Badge variant="outline" className="text-xs bg-success/10">WebSocket sync</Badge>
              <Badge variant="outline" className="text-xs bg-success/10">Auto refresh</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Visual States */}
        <Card className="border-warning/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-warning" />
              Visual Availability States
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Clear visual indicators show room availability at a glance using a three-state system.
            </p>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-success"></div>
                <span className="text-xs">✅ Available</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-warning"></div>
                <span className="text-xs">🟠 Limited (≤2 left)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-destructive"></div>
                <span className="text-xs">🔴 Sold Out</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Booking-Aware Calendar */}
        <Card className="border-secondary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCcwIcon className="w-5 h-5 text-secondary-foreground" />
              Booking-Aware Logic
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              The availability engine combines admin blocks, existing bookings, and inventory 
              to calculate real-time availability for each date.
            </p>
            <div className="text-xs text-muted-foreground">
              <code>available = total_units - booked_count - blocked_count</code>
            </div>
          </CardContent>
        </Card>

        {/* Security & RLS */}
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShieldCheckIcon className="w-5 h-5 text-destructive" />
              Secure Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Row-Level Security ensures public read access for availability while restricting 
              write operations to authenticated admins only.
            </p>
            <div className="space-y-2">
              <Badge variant="outline" className="text-xs bg-destructive/10">Public read</Badge>
              <Badge variant="outline" className="text-xs bg-destructive/10">Admin write</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Admin Integration */}
        <Card className="border-accent/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellIcon className="w-5 h-5 text-accent-foreground" />
              Admin Instant Sync
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Admin dashboard actions (blocking/unblocking dates) instantly propagate to all 
              customer booking calendars within seconds.
            </p>
            <div className="text-xs text-muted-foreground">
              Admin blocks → Database → WebSocket → Calendar update
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Technical Implementation Details */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Technical Implementation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-3">Key Components</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• <code>useRoomAvailability</code> - Real-time availability hook</li>
                <li>• <code>RoomAvailabilityCalendar</code> - Visual calendar component</li>
                <li>• <code>get-room-availability</code> - Server-side availability function</li>
                <li>• <code>admin-room-blocking</code> - Admin blocking operations</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3">Real-time Subscriptions</h4>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>• <code>blocked_dates</code> table changes</li>
                <li>• <code>bookings</code> table updates</li>
                <li>• <code>room_inventory</code> modifications</li>
                <li>• Automatic subscription cleanup on unmount</li>
              </ul>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-semibold text-sm mb-2">Example: Real-time Flow</h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>1. Admin blocks "8-bed mixed economy dorm" for 2024-12-25</p>
              <p>2. Database insert triggers WebSocket event</p>
              <p>3. All connected booking calendars receive update</p>
              <p>4. Calendar cells automatically turn red (🔴 Sold Out)</p>
              <p>5. Users see immediate availability change without refresh</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RealTimeAvailabilityDemo;