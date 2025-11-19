import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Minus, Plus } from "lucide-react";

interface FoodAddonsSectionProps {
  formData: {
    guests: number;
    breakfast: boolean;
    breakfastGuests: number;
    dinner: boolean;
    dinnerGuests: number;
    dinnerType: string;
    transportation: boolean;
    itinerary: boolean;
    petDetails: boolean;
    petType: string;
    petBreed: string;
    petSize: string;
    petAge: string;
  };
  onInputChange: (field: string, value: any) => void;
}

const FoodAddonsSection = ({ formData, onInputChange }: FoodAddonsSectionProps) => {
  return (
    <div className="space-y-4">
      <Label className="text-lg font-semibold">Food Add-ons & Additional Services</Label>
      
      {/* Breakfast */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
          <div>
            <h4 className="font-semibold">Breakfast</h4>
            <p className="text-sm text-muted-foreground">Start your day with a delightful morning feast</p>
          </div>
          <div className="flex items-center space-x-2">
            {formData.breakfast && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onInputChange('breakfastGuests', Math.max(1, formData.breakfastGuests - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={formData.guests}
                  value={formData.breakfastGuests}
                  onChange={(e) => onInputChange('breakfastGuests', Math.min(formData.guests, parseInt(e.target.value) || 1))}
                  className="text-center w-20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onInputChange('breakfastGuests', Math.min(formData.guests, formData.breakfastGuests + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}
            <input
              type="checkbox"
              checked={formData.breakfast}
              onChange={(e) => onInputChange('breakfast', e.target.checked)}
              className="w-5 h-5 text-primary ml-2"
            />
          </div>
        </div>
      </div>

      {/* Dinner */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
          <div>
            <h4 className="font-semibold">Dinner</h4>
            <p className="text-sm text-muted-foreground">Savor authentic flavors crafted with love</p>
          </div>
          <div className="flex items-center space-x-2">
            {formData.dinner && (
              <>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onInputChange('dinnerGuests', Math.max(1, formData.dinnerGuests - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  type="number"
                  min="1"
                  max={formData.guests}
                  value={formData.dinnerGuests}
                  onChange={(e) => onInputChange('dinnerGuests', Math.min(formData.guests, parseInt(e.target.value) || 1))}
                  className="text-center w-20"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onInputChange('dinnerGuests', Math.min(formData.guests, formData.dinnerGuests + 1))}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </>
            )}
            <input
              type="checkbox"
              checked={formData.dinner}
              onChange={(e) => onInputChange('dinner', e.target.checked)}
              className="w-5 h-5 text-primary ml-2"
            />
          </div>
        </div>
        
        {formData.dinner && (
          <div className="ml-4">
            <Label>Dinner Type</Label>
            <Select value={formData.dinnerType} onValueChange={(value) => onInputChange('dinnerType', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="veg">Vegetarian</SelectItem>
                <SelectItem value="nonveg">Non-Vegetarian</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Transportation */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
        <div>
          <h4 className="font-semibold">Transportation Arrangement</h4>
          <p className="text-sm text-muted-foreground">Local transport and transfers • Self Drive - Car & Bike Rental service</p>
        </div>
        <input
          type="checkbox"
          checked={formData.transportation}
          onChange={(e) => onInputChange('transportation', e.target.checked)}
          className="w-5 h-5 text-primary"
        />
      </div>

      {/* Travel Itinerary */}
      <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
        <div>
          <h4 className="font-semibold">Travel Itinerary Support</h4>
          <p className="text-sm text-muted-foreground">Customized itinerary planning</p>
        </div>
        <input
          type="checkbox"
          checked={formData.itinerary}
          onChange={(e) => onInputChange('itinerary', e.target.checked)}
          className="w-5 h-5 text-primary"
        />
      </div>

      {/* Pet Details */}
      <div className="space-y-2">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border border-border">
          <div>
            <h4 className="font-semibold">Pet Details</h4>
            <p className="text-sm text-muted-foreground">Details about your pet (type, breed, size, age)</p>
          </div>
          <input
            type="checkbox"
            checked={formData.petDetails}
            onChange={(e) => onInputChange('petDetails', e.target.checked)}
            className="w-5 h-5 text-primary"
          />
        </div>
        
        {formData.petDetails && (
          <div className="ml-4 space-y-3">
            <div>
              <Label>Pet Type</Label>
              <Input
                type="text"
                placeholder="e.g., Dog, Cat, Bird"
                value={formData.petType}
                onChange={(e) => onInputChange('petType', e.target.value)}
              />
            </div>
            <div>
              <Label>Breed</Label>
              <Input
                type="text"
                placeholder="e.g., Golden Retriever, Persian Cat"
                value={formData.petBreed}
                onChange={(e) => onInputChange('petBreed', e.target.value)}
              />
            </div>
            <div>
              <Label>Size</Label>
              <Select value={formData.petSize} onValueChange={(value) => onInputChange('petSize', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select size" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="small">Small</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="large">Large</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Age</Label>
              <Input
                type="text"
                placeholder="e.g., 2 years, 6 months"
                value={formData.petAge}
                onChange={(e) => onInputChange('petAge', e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodAddonsSection;
