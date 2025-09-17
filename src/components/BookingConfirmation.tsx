import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Calendar, Users, Phone, Mail, Download, ExternalLink } from 'lucide-react';

interface BookingConfirmationProps {
  bookingData: {
    bookingId: string;
    guestName: string;
    email: string;
    whatsappNumber: string;
    checkIn: string;   // ISO date
    checkOut: string;  // ISO date
    nights: number;
    guests: number;
    totalAmount: number;
    items: Array<{
      roomName: string;
      quantity: number;
      price: number;
    }>;
    addOns?: {
      breakfast?: number;
      dinnerVeg?: number;
      dinnerNonVeg?: number;
      transportation?: boolean;
      itineraryPlanning?: boolean;
    };
    addOnTotal?: number;
  };
}

const BookingConfirmation = ({ bookingData }: BookingConfirmationProps) => {
  const [showWhatsAppRedirect, setShowWhatsAppRedirect] = useState(false);

  const addOnsText = () => {
    const a = bookingData.addOns;
    if (!a) return '';
    const lines: string[] = [];
    if (a.breakfast && a.breakfast > 0) lines.push(`• Breakfast: ${a.breakfast} meals × ₹150 = ₹${a.breakfast * 150}`);
    if (a.dinnerVeg && a.dinnerVeg > 0) lines.push(`• Dinner (Veg): ${a.dinnerVeg} meals × ₹300 = ₹${a.dinnerVeg * 300}`);
    if (a.dinnerNonVeg && a.dinnerNonVeg > 0) lines.push(`• Dinner (Non-Veg): ${a.dinnerNonVeg} meals × ₹300 = ₹${a.dinnerNonVeg * 300}`);
    if (a.transportation) lines.push(`• Transportation Services: Best rates available`);
    if (a.itineraryPlanning) {
      lines.push(`• Itinerary Planning: ${a.transportation ? 'Free (with Transportation)' : '5% convenience charges'}`);
    }
    return lines.length ? `\n🎯 Add-ons Selected:\n${lines.join('\n')}` : '';
  };

  const buildWhatsAppText = () => {
    const rooms = (bookingData.items || [])
      .map((r) => `• ${r.roomName} x${r.quantity}`)
      .join('\n');

    const addOnTotalLine = bookingData.addOnTotal ? `\n💰 Add-ons Total: ₹${bookingData.addOnTotal}` : '';

    return (
      `Booking Inquiry\n\n` +
      `📋 Booking ID: ${bookingData.bookingId}\n` +
      `👤 Guest: ${bookingData.guestName}\n` +
      `📧 Email: ${bookingData.email}\n\n` +
      `📅 Check-in: ${new Date(bookingData.checkIn).toLocaleDateString()}\n` +
      `📅 Check-out: ${new Date(bookingData.checkOut).toLocaleDateString()}\n` +
      `🌙 Nights: ${bookingData.nights} | 👥 Guests: ${bookingData.guests}\n\n` +
      `🏨 Room Details:\n${rooms}${addOnsText()}\n\n` +
      `💰 Total Amount: ₹${bookingData.totalAmount}${addOnTotalLine}\n\n` +
      `Thank you for choosing XTSY!`
    );
  };

  const handleWhatsAppClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const message = buildWhatsAppText();
    const url = `https://wa.me/918837317070?text=${encodeURIComponent(message)}`;
    window.location.href = url;      // direct navigation (least likely to be blocked)
    setShowWhatsAppRedirect(true);
  };

  const downloadInvoice = () => {
    alert('Invoice download will be available shortly via email and WhatsApp');
  };

  const goToHome = () => {
    window.location.href = '#home';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full bg-white shadow-xl border-0">
        <CardHeader className="text-center pb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            Booking Summary and Guest Details
          </CardTitle>

          <div className="text-lg font-semibold text-orange-600">
            Booking ID: {bookingData.bookingId}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Guest Details */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Guest Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-gray-400" />
                <span>{bookingData.guestName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-gray-400" />
                <span>{bookingData.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-gray-400" />
                <span>{bookingData.whatsappNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span>
                  {bookingData.nights} night{bookingData.nights > 1 ? 's' : ''}, {bookingData.guests} guest{bookingData.guests > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Stay Details */}
          <div className="bg-orange-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Stay Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm mb-4">
              <div>
                <span className="text-gray-600">Check-in</span>
                <div className="font-medium">{new Date(bookingData.checkIn).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="text-gray-600">Check-out</span>
                <div className="font-medium">{new Date(bookingData.checkOut).toLocaleDateString()}</div>
              </div>
            </div>

            <div className="space-y-2">
              {bookingData.items.map((room, idx) => (
                <div key={idx} className="flex justify-between items-center">
                  <span className="text-gray-700">{room.roomName} x{room.quantity}</span>
                  <Badge variant="outline">₹{room.price}/night</Badge>
                </div>
              ))}
            </div>
          </div>

          {/* Add-ons */}
          {bookingData.addOns && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Selected Add-ons</h3>
              <div className="space-y-2 text-sm">
                {bookingData.addOns.breakfast && bookingData.addOns.breakfast > 0 && (
                  <div className="flex justify-between">
                    <span>Breakfast ({bookingData.addOns.breakfast} meals)</span>
                    <span>₹{bookingData.addOns.breakfast * 150}</span>
                  </div>
                )}
                {bookingData.addOns.dinnerVeg && bookingData.addOns.dinnerVeg > 0 && (
                  <div className="flex justify-between">
                    <span>Dinner Veg ({bookingData.addOns.dinnerVeg} meals)</span>
                    <span>₹{bookingData.addOns.dinnerVeg * 300}</span>
                  </div>
                )}
                {bookingData.addOns.dinnerNonVeg && bookingData.addOns.dinnerNonVeg > 0 && (
                  <div className="flex justify-between">
                    <span>Dinner Non-Veg ({bookingData.addOns.dinnerNonVeg} meals)</span>
                    <span>₹{bookingData.addOns.dinnerNonVeg * 300}</span>
                  </div>
                )}
                {bookingData.addOns.transportation && (
                  <div className="text-blue-600">• Transportation Services: Best rates available</div>
                )}
                {bookingData.addOns.itineraryPlanning && (
                  <div className="text-blue-600">
                    • Itinerary Planning: {bookingData.addOns.transportation ? 'Free (with Transportation)' : '5% convenience charges'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Pricing Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Total Amount:</span>
                <span className="font-medium">₹{bookingData.totalAmount}</span>
              </div>
              {bookingData.addOnTotal && (
                <div className="flex justify-between text-blue-600">
                  <span>Add-ons Total:</span>
                  <span className="font-medium">₹{bookingData.addOnTotal}</span>
                </div>
              )}
              <div className="flex justify-between text-green-600">
                <span>Advance Paid (21%):</span>
                <span className="font-medium">₹{Math.round(bookingData.totalAmount * 0.21)}</span>
              </div>
              <div className="flex justify-between text-orange-600">
                <span>Balance at Check-in:</span>
                <span className="font-medium">
                  ₹{bookingData.totalAmount - Math.round(bookingData.totalAmount * 0.21)}
                </span>
              </div>
            </div>
          </div>

          {/* WhatsApp Notice */}
          {showWhatsAppRedirect && (
            <div className="bg-green-100 border border-green-300 rounded-lg p-4 text-center">
              <div className="text-green-800 font-medium mb-2">Opening WhatsApp…</div>
              <div className="text-green-700 text-sm">
                If a new tab didn’t open, please allow pop-ups for this site and tap the button again.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button
              type="button"
              onClick={downloadInvoice}
              variant="outline"
              className="flex-1 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download Invoice
            </Button>

            <Button
              type="button"
              onClick={handleWhatsAppClick}
              className="flex-1 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white flex items-center justify-center gap-2"
              title="Open WhatsApp"
            >
              <ExternalLink className="w-4 h-4" />
              Complete Booking via WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BookingConfirmation;
