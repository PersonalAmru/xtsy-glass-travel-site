import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Clock, Shield, FileText, AlertTriangle, CheckCircle, XCircle, Calendar, CreditCard } from "lucide-react";

interface PolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'cancellation' | 'travel' | 'terms';
}

const PolicyModal = ({ isOpen, onClose, type }: PolicyModalProps) => {
  const renderCancellationPolicy = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Clock className="h-12 w-12 text-orange-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Cancellation & Modification Policy</h3>
        <p className="text-gray-600">XTSY Travellers Hostel & XTSY Luxury</p>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-red-600 mb-3 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            1. Advance Payment Policy
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• All advance payments are <strong>strictly non-refundable</strong></li>
            <li>• Advance payment secures your room and blocks inventory exclusively for you</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-red-600 mb-3 flex items-center">
            <XCircle className="h-4 w-4 mr-2" />
            2. Cancellation Policy (Guest-Initiated)
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• <strong>Cancellations are not accepted</strong> once an advance payment is made</li>
            <li>• No refunds will be issued under any circumstances for cancellations or no-shows</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-green-600 mb-3 flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            3. Booking Modification Policy (Guest-Initiated)
          </h4>
          <p className="text-sm text-gray-700 mb-3">
            Bookings can be <strong>modified instead of cancelled</strong>, subject to availability:
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Date modification allowed within <strong>90 days</strong> from original check-in date</li>
            <li>• Only <strong>one-time modification</strong> permitted per booking</li>
            <li>• Room type upgrades/downgrades subject to availability and fare difference</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
            <Shield className="h-4 w-4 mr-2" />
            4. Property-Initiated Changes (XTSY)
          </h4>
          <p className="text-sm text-gray-700 mb-2">
            In rare cases where XTSY is unable to honor a confirmed booking due to unavoidable reasons, guests will be offered:
          </p>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Free date modification, OR</li>
            <li>• Alternate room or equivalent property, OR</li>
            <li>• <strong>Full refund</strong> (only if accommodation cannot be provided)</li>
          </ul>
          <p className="text-xs text-gray-600 mt-2 italic">Guest preference will be prioritized.</p>
        </CardContent>
      </Card>

      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-orange-600 mb-3 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            5. Group & Promotional Bookings
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Group bookings and special promotional offers are <strong>non-refundable</strong> and <strong>non-cancellable</strong></li>
            <li>• Modification rules remain the same unless specified otherwise</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-purple-600 mb-3 flex items-center">
            <FileText className="h-4 w-4 mr-2" />
            6. How to Request a Modification
          </h4>
          <p className="text-sm text-gray-700 mb-3">To modify your booking, contact us with:</p>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>• <strong>WhatsApp:</strong> +91 88373 17070</li>
            <li>• <strong>Email:</strong> booking@xtsy.one</li>
          </ul>
          <p className="text-sm text-gray-700 mt-3">Please include:</p>
          <ul className="text-xs text-gray-600 space-y-1 mt-1">
            <li>• Booking name</li>
            <li>• Booking date</li>
            <li>• Room type</li>
            <li>• Registered contact number</li>
          </ul>
        </CardContent>
      </Card>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 text-gray-600" />
          7. Important Notes
        </h4>
        <ul className="text-sm text-gray-700 space-y-2">
          <li>• Booking is confirmed only after advance payment is received</li>
          <li>• Failure to check-in on confirmed date will be treated as a <strong>no-show</strong></li>
          <li>• No refund or credit will be issued for no-shows</li>
          <li>• XTSY reserves the right to amend this policy without prior notice</li>
        </ul>
      </div>
    </div>
  );

  const renderTravelPolicies = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="h-12 w-12 text-blue-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Travel Policies</h3>
        <p className="text-gray-600">Important guidelines for your stay at XTSY properties</p>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-red-600 mb-3 flex items-center">
            <AlertTriangle className="h-4 w-4 mr-2" />
            Universal Rules (All Properties) - Strict Enforcement
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• <strong>Respect fellow travelers & staff</strong> at all times</li>
            <li>• <strong>Maintain cleanliness:</strong> ₹500 fine for littering in rooms/common areas</li>
            <li>• <strong>Smoking policy:</strong> Designated outdoor zones only (₹2000 fine for indoor smoking)</li>
            <li>• <strong>Alcohol restrictions:</strong> Only in Bonfire & Terrace zones (₹10,000 fine + legal action for violations)</li>
            <li>• <strong>Bed assignments:</strong> Use assigned beds only (₹500 fine for unauthorized bed use)</li>
            <li>• <strong>24/7 CCTV monitoring</strong> in all common areas for safety</li>
            <li>• <strong>Round-the-clock caretakers</strong> available for assistance</li>
          </ul>
        </CardContent>
      </Card>

      <Card className="bg-orange-50 border-orange-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-orange-600 mb-3 flex items-center">
            <Clock className="h-4 w-4 mr-2" />
            Property-Specific Rules
          </h4>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-gray-800">XTSY Economy Dorms:</p>
              <ul className="text-sm text-gray-700 space-y-1 mt-1">
                <li>• Quiet hours: 11 PM – 6 AM (strictly enforced)</li>
                <li>• No food allowed in dorms (₹2000 fine)</li>
                <li>• Upgrade required for common areas, terrace, bonfire access</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-800">XTSY Travellers Hostel:</p>
              <ul className="text-sm text-gray-700 space-y-1 mt-1">
                <li>• Flexible quiet hours with guest consideration</li>
                <li>• Food allowed in designated areas</li>
                <li>• Free access to all amenities and experiences</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-gray-800">XTSY Luxury:</p>
              <ul className="text-sm text-gray-700 space-y-1 mt-1">
                <li>• No strict quiet hours, premium privacy</li>
                <li>• All privileges included with room service</li>
                <li>• Exclusive signature stay experience</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-600 mb-3 flex items-center">
            <CreditCard className="h-4 w-4 mr-2" />
            ID Verification & Check-in
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Valid government-issued photo ID required for all guests</li>
            <li>• Foreign nationals must present passport and valid visa</li>
            <li>• Check-in starts at 2:00 PM, Check-out by 11:00 AM</li>
            <li>• Early check-in subject to availability (additional charges may apply)</li>
            <li>• Late check-in until 11:00 PM free, after 11:00 PM ₹500 fee</li>
            <li>• All guests must register at reception upon arrival</li>
          </ul>
        </CardContent>
      </Card>

      <div className="bg-green-50 p-4 rounded-lg">
        <p className="text-sm text-green-800">
          <strong>Questions about our policies?</strong> Our friendly staff is available 24/7 to assist you. 
          Contact us at reception or call +91 88373 17070 for any clarifications.
        </p>
      </div>
    </div>
  );

  const renderHostelTerms = () => (
    <div className="space-y-6">
      <div className="text-center">
        <FileText className="h-12 w-12 text-purple-500 mx-auto mb-3" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Hostel Terms & Conditions</h3>
        <p className="text-gray-600">Community guidelines and accommodation rules with enforcement</p>
      </div>

      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-red-600 mb-3 flex items-center">
            <XCircle className="h-4 w-4 mr-2" />
            Prohibited Activities & Fines
          </h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• <strong>Indoor smoking:</strong> ₹2000 fine (designated outdoor areas only)</li>
            <li>• <strong>Alcohol violations:</strong> ₹10,000 fine + legal action (Bonfire & Terrace zones only)</li>
            <li>• <strong>Unauthorized bed use:</strong> ₹500 fine (use assigned beds only)</li>
            <li>• <strong>Littering/uncleanliness:</strong> ₹500 fine (maintain room/common area cleanliness)</li>
            <li>• <strong>XTSY Economy food in dorms:</strong> ₹2000 fine (no food allowed in dorms)</li>
            <li>• <strong>Zero tolerance:</strong> Drugs or illegal substances (immediate eviction + legal action)</li>
            <li>• <strong>Weapons/sharp objects:</strong> Not allowed in dormitories</li>
            <li>• <strong>Outside visitors in dorms:</strong> Not allowed after 10:00 PM</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-purple-600 mb-3">Shared Space Etiquette</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Keep dormitories clean and organized at all times</li>
            <li>• Use provided lockers for valuables and personal items</li>
            <li>• Respect privacy curtains and personal space boundaries</li>
            <li>• Clean up after yourself in kitchen and common areas</li>
            <li>• Share common facilities respectfully with other guests</li>
            <li>• Report any issues to reception immediately</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-orange-600 mb-3">Property-Specific Access Rules</h4>
          <div className="space-y-3">
            <div>
              <p className="font-medium text-orange-700">XTSY Economy Dorms:</p>
              <ul className="text-xs text-gray-600 space-y-1 mt-1">
                <li>• Common areas: Upgrade required</li>
                <li>• Terrace access: Upgrade required</li>
                <li>• Bonfire nights: Upgrade required</li>
                <li>• No charging points or study lights</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-green-700">XTSY Travellers Hostel:</p>
              <ul className="text-xs text-gray-600 space-y-1 mt-1">
                <li>• Free access to all amenities and common areas</li>
                <li>• 10% discount at convenience store</li>
                <li>• BBQ experiences available (paid)</li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-blue-700">XTSY Luxury:</p>
              <ul className="text-xs text-gray-600 space-y-1 mt-1">
                <li>• All services included</li>
                <li>• Exclusive premium facilities and experiences</li>
                <li>• Dedicated concierge service</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-orange-600 mb-3">Damage Charges & Liability</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• <strong>Lost key card replacement:</strong> ₹200</li>
            <li>• <strong>Damaged bed linens or towels:</strong> ₹500 per item</li>
            <li>• <strong>Room cleanliness violations:</strong> ₹500 littering fine</li>
            <li>• <strong>Common area damage:</strong> Charged to responsible party</li>
            <li>• <strong>Group bookings (8+ people):</strong> Security deposit may be required</li>
            <li>• XTSY not liable for lost or stolen personal items</li>
            <li>• Guests liable for all damage to property or equipment</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-blue-600 mb-3">Staff Authority & Enforcement</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• XTSY staff have authority to enforce all policies and fines</li>
            <li>• Violation of rules may result in immediate eviction without refund</li>
            <li>• No refund for bookings terminated due to policy violations</li>
            <li>• Management reserves right to refuse service</li>
            <li>• Final decisions on disputes rest with management</li>
            <li>• 24/7 CCTV monitoring in common areas for safety and enforcement</li>
            <li>• All fines must be paid before check-out</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <h4 className="font-semibold text-green-600 mb-3">Guest Rights & Services</h4>
          <ul className="text-sm text-gray-700 space-y-2">
            <li>• Right to clean and safe accommodation</li>
            <li>• 24/7 security and emergency assistance</li>
            <li>• Access to all advertised amenities per property tier</li>
            <li>• Privacy and respectful treatment by staff</li>
            <li>• Complaint resolution through proper channels</li>
            <li>• Equal treatment regardless of nationality or background</li>
            <li>• Clear communication of all applicable charges and fines</li>
          </ul>
        </CardContent>
      </Card>

      <div className="bg-purple-50 p-4 rounded-lg">
        <p className="text-sm text-purple-800">
          <strong>Legal Disclaimer:</strong> These terms constitute a binding agreement between guests and XTSY properties. 
          By completing your booking, you agree to abide by all stated terms, conditions, and fine structures. 
          Management reserves the right to modify these terms with prior notice. All fines are enforceable and must be paid before departure.
        </p>
      </div>
    </div>
  );

  const getContent = () => {
    switch (type) {
      case 'cancellation':
        return renderCancellationPolicy();
      case 'travel':
        return renderTravelPolicies();
      case 'terms':
        return renderHostelTerms();
      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (type) {
      case 'cancellation':
        return 'Cancellation Policy';
      case 'travel':
        return 'Travel Policies';
      case 'terms':
        return 'Hostel Terms & Conditions';
      default:
        return 'Policy';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        data-testid="policy-modal"
        className="max-w-2xl max-h-[90vh] overflow-y-auto"
        style={{
          position: 'fixed',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(calc(100vw - 32px), 42rem)',
          maxWidth: '42rem',
          maxHeight: 'min(calc(100vh - 32px), 90vh)',
          boxSizing: 'border-box',
          margin: 0,
        }}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-gray-800">
            {getTitle()}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {getContent()}
        </div>

        <Separator className="my-4" />
        
        <div className="text-center text-xs text-gray-500">
          <p>Last updated: December 2024 | XTSY Travellers Hostel & XTSY Luxury</p>
          <p className="mt-1">
            For questions about these policies, contact us at{" "}
            <span className="text-orange-600 font-medium">booking@xtsy.one</span> or{" "}
            <span className="text-orange-600 font-medium">+91 88373 17070</span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PolicyModal;