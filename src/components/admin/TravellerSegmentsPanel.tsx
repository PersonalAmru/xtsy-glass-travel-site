import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, TrendingUp, IndianRupee, Target } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Segment {
  id: string;
  segment_name: string;
  segment_key: string;
  segment_description: string;
  segment_color: string;
  traveller_count: number;
  avg_lifetime_value: number;
  avg_booking_value: number;
  conversion_rate: number;
  total_revenue: number;
}

interface TravellerSegmentsPanelProps {
  segments: Segment[];
  distribution: Record<string, number>;
  spendDistribution: Record<string, number>;
}

export function TravellerSegmentsPanel({ segments, distribution, spendDistribution }: TravellerSegmentsPanelProps) {
  const totalTravellers = Object.values(distribution).reduce((sum, count) => sum + count, 0);

  const pieData = segments.map(s => ({
    name: s.segment_name,
    value: s.traveller_count,
    color: s.segment_color,
  }));

  const spendPieData = [
    { name: 'High Value', value: spendDistribution.high_value || 0, color: '#10b981' },
    { name: 'Medium', value: spendDistribution.medium || 0, color: '#f59e0b' },
    { name: 'Budget', value: spendDistribution.budget || 0, color: '#6b7280' },
  ];

  return (
    <div className="space-y-6">
      {/* Segment Distribution Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Traveller Segments
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 backdrop-blur-sm border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <IndianRupee className="h-5 w-5 text-primary" />
              Spend Tiers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={spendPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {spendPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segment Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {segments.map((segment) => {
          const percentage = totalTravellers > 0 
            ? ((segment.traveller_count / totalTravellers) * 100).toFixed(1)
            : '0';

          return (
            <Card 
              key={segment.id} 
              className="bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge 
                    style={{ backgroundColor: segment.segment_color }}
                    className="text-white"
                  >
                    {segment.segment_name}
                  </Badge>
                  <span className="text-sm text-muted-foreground">{percentage}%</span>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {segment.segment_description}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> Travellers
                    </span>
                    <span className="font-medium">{segment.traveller_count.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" /> Avg LTV
                    </span>
                    <span className="font-medium">₹{segment.avg_lifetime_value.toLocaleString()}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Target className="h-3 w-3" /> Conversion
                    </span>
                    <span className="font-medium">{segment.conversion_rate.toFixed(1)}%</span>
                  </div>
                </div>

                <Progress 
                  value={Number(percentage)} 
                  className="h-1"
                  style={{ 
                    '--progress-color': segment.segment_color 
                  } as React.CSSProperties}
                />
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}