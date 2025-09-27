import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRoomAvailability } from '@/hooks/useRoomAvailability';
import { createRoomAliases } from '@/utils/roomIdentifiers';

interface AvailabilityDebuggerProps {
  roomName: string;
}

const AvailabilityDebugger: React.FC<AvailabilityDebuggerProps> = ({ roomName }) => {
  const { availability, loading, error } = useRoomAvailability(roomName, true);
  
  const aliases = createRoomAliases(roomName);
  
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="text-sm">Availability Debug: {roomName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div>
          <Badge variant={loading ? "secondary" : "default"}>
            {loading ? "Loading..." : "Loaded"}
          </Badge>
        </div>
        
        {error && (
          <div className="text-xs text-destructive">
            Error: {error}
          </div>
        )}
        
        <div className="text-xs">
          <div className="font-medium">Aliases:</div>
          <div className="text-muted-foreground">
            {aliases.join(', ')}
          </div>
        </div>
        
        <div className="text-xs">
          <div className="font-medium">Availability dates:</div>
          <div className="text-muted-foreground">
            {Object.keys(availability).length} dates loaded
          </div>
        </div>
        
        {!loading && !error && Object.keys(availability).length > 0 && (
          <div className="text-xs">
            <div className="font-medium">Sample dates:</div>
            <div className="text-muted-foreground">
              {Object.entries(availability).slice(0, 3).map(([date, data]) => (
                <div key={date}>
                  {date}: {data.available}/{data.total} available
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AvailabilityDebugger;