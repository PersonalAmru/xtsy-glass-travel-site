import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { format, parseISO } from 'date-fns';

interface Forecast {
  room_type_id: string;
  room_type_name: string;
  predicted_demand: number;
  predicted_revenue: number;
  demand_level: string;
  confidence_score: number;
}

interface DemandForecastPanelProps {
  forecasts: Record<string, Forecast[]>;
}

const DEMAND_COLORS: Record<string, string> = {
  high: '#ef4444',
  above_normal: '#f59e0b',
  normal: '#10b981',
  below_normal: '#6b7280',
  low: '#3b82f6',
};

const DEMAND_LABELS: Record<string, string> = {
  high: 'High Demand',
  above_normal: 'Above Normal',
  normal: 'Normal',
  below_normal: 'Below Normal',
  low: 'Low Demand',
};

export function DemandForecastPanel({ forecasts }: DemandForecastPanelProps) {
  // Prepare chart data
  const chartData = Object.entries(forecasts)
    .slice(0, 14) // Next 14 days
    .map(([date, roomForecasts]) => {
      const totalDemand = roomForecasts.reduce((sum, f) => sum + f.predicted_demand, 0);
      const totalRevenue = roomForecasts.reduce((sum, f) => sum + f.predicted_revenue, 0);
      const avgConfidence = roomForecasts.reduce((sum, f) => sum + f.confidence_score, 0) / roomForecasts.length;

      return {
        date: format(parseISO(date), 'MMM d'),
        fullDate: date,
        demand: totalDemand,
        revenue: totalRevenue,
        confidence: Math.round(avgConfidence * 100),
      };
    });

  // Get room-wise breakdown
  const roomBreakdown: Record<string, { demand: number; revenue: number; forecasts: Forecast[] }> = {};
  Object.entries(forecasts).forEach(([_, roomForecasts]) => {
    roomForecasts.forEach(f => {
      if (!roomBreakdown[f.room_type_name]) {
        roomBreakdown[f.room_type_name] = { demand: 0, revenue: 0, forecasts: [] };
      }
      roomBreakdown[f.room_type_name].demand += f.predicted_demand;
      roomBreakdown[f.room_type_name].revenue += f.predicted_revenue;
      roomBreakdown[f.room_type_name].forecasts.push(f);
    });
  });

  // Find high demand dates
  const highDemandDates = Object.entries(forecasts)
    .filter(([_, roomForecasts]) => 
      roomForecasts.some(f => f.demand_level === 'high' || f.demand_level === 'above_normal')
    )
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Forecast Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">
                {chartData.reduce((sum, d) => sum + d.demand, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Total Predicted Bookings (14d)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold">
                ₹{(chartData.reduce((sum, d) => sum + d.revenue, 0) / 1000).toFixed(0)}K
              </p>
              <p className="text-sm text-muted-foreground">Predicted Revenue (14d)</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <p className="text-2xl font-bold">{highDemandDates.length}</p>
              <p className="text-sm text-muted-foreground">High Demand Days</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur border-border/50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">
                {chartData.length > 0 
                  ? Math.round(chartData.reduce((sum, d) => sum + d.confidence, 0) / chartData.length)
                  : 0}%
              </p>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Demand Chart */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">14-Day Demand Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="demand" 
                  stroke="hsl(var(--primary))" 
                  fill="hsl(var(--primary) / 0.2)"
                  name="Predicted Bookings"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Room-wise Breakdown */}
      <Card className="bg-card/50 backdrop-blur border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Room Type Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={Object.entries(roomBreakdown).map(([name, data]) => ({
                  name: name.length > 20 ? name.slice(0, 20) + '...' : name,
                  demand: data.demand,
                  revenue: data.revenue / 1000,
                }))}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150}
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={11}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="demand" fill="hsl(var(--primary))" name="Demand" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* High Demand Alerts */}
      {highDemandDates.length > 0 && (
        <Card className="bg-card/50 backdrop-blur border-amber-500/30 border-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              High Demand Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {highDemandDates.map(([date, roomForecasts]) => {
                const highDemandRooms = roomForecasts.filter(
                  f => f.demand_level === 'high' || f.demand_level === 'above_normal'
                );

                return (
                  <div 
                    key={date}
                    className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{format(parseISO(date), 'EEEE, MMM d')}</p>
                      <div className="flex gap-2 mt-1">
                        {highDemandRooms.map(room => (
                          <Badge 
                            key={room.room_type_id}
                            style={{ backgroundColor: DEMAND_COLORS[room.demand_level] }}
                            className="text-white text-xs"
                          >
                            {room.room_type_name.slice(0, 15)}...
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        ₹{roomForecasts.reduce((sum, f) => sum + f.predicted_revenue, 0).toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">potential revenue</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}