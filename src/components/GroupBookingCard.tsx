
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users } from "lucide-react";

interface GroupBookingCardProps {
  type: "corporate" | "group";
  onBookingClick: () => void;
}

const GroupBookingCard = ({ type, onBookingClick }: GroupBookingCardProps) => {
  const isB2B = type === "corporate";
  
  return (
    <Card className="bg-white border border-gray-200 hover:border-orange-300 hover:shadow-lg transition-all duration-300 transform hover:scale-105 shadow-md h-full flex flex-col">
      <CardHeader className="text-center pb-3">
        <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
          {isB2B ? (
            <Building className="h-8 w-8 text-orange-600" />
          ) : (
            <Users className="h-8 w-8 text-red-600" />
          )}
        </div>
        <CardTitle className="text-xl font-bold text-gray-900">
          {isB2B ? "B2B Corporate Booking" : "Group Booking"}
        </CardTitle>
        <CardDescription className="text-gray-600">
          {isB2B ? "Perfect for corporate events and business trips" : "Ideal for family gatherings and group adventures"}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow flex flex-col">
        <div className="flex-grow">
          <ul className="space-y-2 text-sm text-gray-600">
            {isB2B ? (
              <>
                <li>• Corporate rates available</li>
                <li>• Team building packages</li>
                <li>• Conference facilities</li>
                <li>• Group transportation</li>
              </>
            ) : (
              <>
                <li>• Group discounts available</li>
                <li>• Customized packages</li>
                <li>• Flexible booking options</li>
                <li>• Dedicated group coordinator</li>
              </>
            )}
          </ul>
        </div>
        
        <div className="mt-auto pt-4">
          <Button 
            onClick={onBookingClick}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            {isB2B ? "Get Corporate Quote" : "Book Group Stay"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupBookingCard;
