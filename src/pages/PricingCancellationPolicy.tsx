import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Helmet } from 'react-helmet';
import { CreditCard, XCircle, Calendar, Shield, AlertTriangle, FileText, IndianRupee, Clock, CheckCircle, Info } from 'lucide-react';

/**
 * Pricing and Cancellation Policies page for XTSY
 * Comprehensive pricing, GST information, and cancellation policies for accommodation and tourism services
 */
export const PricingCancellationPolicy: React.FC = () => {
  const lastUpdated = "January 18, 2025";
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>Pricing & Cancellation Policies - XTSY</title>
        <meta name="description" content="XTSY Pricing & Cancellation Policies - Understand our pricing structure, GST rates, payment terms, and cancellation policies for accommodation and travel services." />
      </Helmet>
      
      <Header />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
          <h1 className="text-4xl font-bold mb-2 text-foreground">Pricing & Cancellation Policies</h1>
          <p className="text-muted-foreground mb-8">Last Updated: {lastUpdated}</p>
          
          <div className="prose prose-lg max-w-none space-y-8 text-foreground/90">
            
            {/* Introduction */}
            <section>
              <p className="text-lg">
                This document outlines our pricing structure, applicable taxes (GST), payment terms, 
                and cancellation policies for all services offered by XTSY Travellers Hostel, XTSY Xperience, 
                and XTSY Travel experiences.
              </p>
            </section>

            {/* GST Structure */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <IndianRupee className="h-6 w-6 text-primary" />
                1. Goods and Services Tax (GST) Structure
              </h2>
              
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-5 my-4">
                <p className="font-semibold text-foreground mb-3">📋 As per Current GST Laws (India)</p>
                <p className="text-foreground/80 mb-4">
                  GST rates for hospitality and tourism services are determined based on the tariff 
                  per unit of accommodation per day. The following rates apply:
                </p>
              </div>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">1.1 Accommodation GST Rates</h3>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-foreground font-medium">Room Tariff (per night)</th>
                      <th className="px-4 py-3 text-left text-foreground font-medium">GST Rate</th>
                      <th className="px-4 py-3 text-left text-foreground font-medium">Breakdown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr className="bg-green-500/10">
                      <td className="px-4 py-3 font-medium">Up to ₹7,500</td>
                      <td className="px-4 py-3 font-semibold text-green-600">5% GST</td>
                      <td className="px-4 py-3">CGST 2.5% + SGST 2.5%</td>
                    </tr>
                    <tr className="bg-amber-500/10">
                      <td className="px-4 py-3 font-medium">Above ₹7,500</td>
                      <td className="px-4 py-3 font-semibold text-amber-600">18% GST</td>
                      <td className="px-4 py-3">CGST 9% + SGST 9%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mt-4">
                <p className="flex items-start gap-2 text-foreground/90">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Note:</strong> The GST rate is determined by the declared/published tariff, 
                    not discounted prices. Hostel dormitory beds are typically charged at 5% GST 
                    as they fall under the ₹7,500 threshold.
                  </span>
                </p>
              </div>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">1.2 Other Services GST Rates</h3>
              <div className="overflow-x-auto mt-4">
                <table className="min-w-full border border-border rounded-lg">
                  <thead className="bg-muted">
                    <tr>
                      <th className="px-4 py-3 text-left text-foreground font-medium">Service Type</th>
                      <th className="px-4 py-3 text-left text-foreground font-medium">GST Rate</th>
                      <th className="px-4 py-3 text-left text-foreground font-medium">Breakdown</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    <tr>
                      <td className="px-4 py-3">Tourism & Travel Packages</td>
                      <td className="px-4 py-3 font-semibold">18% GST</td>
                      <td className="px-4 py-3">CGST 9% + SGST 9%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Restaurant Services (TAB Bistro)</td>
                      <td className="px-4 py-3 font-semibold">18% GST</td>
                      <td className="px-4 py-3">CGST 9% + SGST 9%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Transport & Vehicle Rentals</td>
                      <td className="px-4 py-3 font-semibold">18% GST</td>
                      <td className="px-4 py-3">CGST 9% + SGST 9%</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">Adventure Activities & Tours</td>
                      <td className="px-4 py-3 font-semibold">18% GST</td>
                      <td className="px-4 py-3">CGST 9% + SGST 9%</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">1.3 GST Invoice & Compliance</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All invoices include GSTIN, SAC codes, and proper tax breakdowns</li>
                <li>GST-compliant invoices are provided for all bookings</li>
                <li>Business guests can claim Input Tax Credit (ITC) on eligible services</li>
                <li>Our GSTIN is displayed on all official documents and invoices</li>
              </ul>
            </section>

            {/* Pricing Structure */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <CreditCard className="h-6 w-6 text-primary" />
                2. Pricing Structure
              </h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">2.1 Display Pricing</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>All prices on our website are displayed in Indian Rupees (INR)</li>
                <li>Prices shown may or may not include GST – check the booking summary for breakdown</li>
                <li>Final price with all applicable taxes is shown before payment confirmation</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">2.2 Dynamic Pricing</h3>
              <p>Our accommodation rates may vary based on:</p>
              <ul className="list-disc pl-6 space-y-2 mt-3">
                <li><strong>Seasonality:</strong> Peak season, festivals, and holidays may have higher rates</li>
                <li><strong>Demand:</strong> Real-time occupancy and booking velocity</li>
                <li><strong>Lead Time:</strong> Last-minute bookings may have different pricing</li>
                <li><strong>Room Type:</strong> Different categories have different base rates</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">2.3 Additional Charges</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Extra Guest:</strong> Charges apply for guests beyond room capacity</li>
                <li><strong>Early Check-in / Late Check-out:</strong> Subject to availability and charges</li>
                <li><strong>Damage/Loss:</strong> Guests are liable for damages to property</li>
                <li><strong>Cleaning Fee:</strong> May apply for excessive cleaning requirements</li>
              </ul>
            </section>

            {/* Advance Payment Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Clock className="h-6 w-6 text-red-500" />
                3. Advance Payment Policy
              </h2>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-5">
                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  Important: Non-Refundable Advance
                </h4>
                <ul className="space-y-2 text-foreground/90">
                  <li>• All advance payments are <strong>strictly non-refundable</strong></li>
                  <li>• Advance payment secures your room and blocks inventory exclusively for you</li>
                  <li>• Minimum advance varies by room type and season (typically 50-100% of booking value)</li>
                  <li>• Balance payment (if any) is due at check-in</li>
                </ul>
              </div>
            </section>

            {/* Cancellation Policy - Guest Initiated */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <XCircle className="h-6 w-6 text-red-500" />
                4. Cancellation Policy (Guest-Initiated)
              </h2>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-5">
                <h4 className="font-semibold text-red-600 dark:text-red-400 mb-3">
                  Strict No-Refund Policy
                </h4>
                <ul className="space-y-2 text-foreground/90">
                  <li>• <strong>Cancellations are not accepted</strong> once an advance payment is made</li>
                  <li>• No refunds will be issued under any circumstances for cancellations</li>
                  <li>• No-shows are treated as cancellations with no refund</li>
                  <li>• This policy applies to all room types, packages, and services</li>
                </ul>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 mt-4">
                <p className="flex items-start gap-2 text-foreground/90">
                  <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <span>
                    <strong>Why this policy?</strong> Your advance payment ensures we reserve your 
                    accommodation exclusively. This blocks inventory that could otherwise be sold to 
                    other travellers, especially during high-demand periods.
                  </span>
                </p>
              </div>
            </section>

            {/* Booking Modification Policy */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Calendar className="h-6 w-6 text-green-500" />
                5. Booking Modification Policy (Guest-Initiated)
              </h2>
              
              <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-5">
                <h4 className="font-semibold text-green-600 dark:text-green-400 mb-3 flex items-center">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Modify Instead of Cancel
                </h4>
                <p className="text-foreground/90 mb-4">
                  Bookings can be <strong>modified instead of cancelled</strong>, subject to availability:
                </p>
                <ul className="space-y-2 text-foreground/90">
                  <li>• Date modification allowed within <strong>90 days</strong> from original check-in date</li>
                  <li>• Only <strong>one-time modification</strong> permitted per booking</li>
                  <li>• Room type upgrades/downgrades subject to availability and fare difference</li>
                  <li>• Modification request must be made at least 48 hours before original check-in</li>
                  <li>• Any rate difference (higher dates) must be paid at time of modification</li>
                </ul>
              </div>
            </section>

            {/* Property-Initiated Changes */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <Shield className="h-6 w-6 text-blue-500" />
                6. Property-Initiated Changes (XTSY)
              </h2>
              
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-5">
                <p className="text-foreground/90 mb-4">
                  In rare cases where XTSY is unable to honor a confirmed booking due to unavoidable 
                  reasons (maintenance, safety issues, overbooking errors), guests will be offered:
                </p>
                <ul className="space-y-2 text-foreground/90">
                  <li>• <strong>Option 1:</strong> Free date modification to preferred dates</li>
                  <li>• <strong>Option 2:</strong> Alternate room or equivalent property accommodation</li>
                  <li>• <strong>Option 3:</strong> <strong>Full refund</strong> (only if accommodation cannot be provided)</li>
                </ul>
                <p className="text-sm text-foreground/70 mt-4 italic">
                  Guest preference will be prioritized. We will contact you immediately if such a 
                  situation arises.
                </p>
              </div>
            </section>

            {/* Group & Promotional Bookings */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-amber-500" />
                7. Group & Promotional Bookings
              </h2>
              
              <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-5">
                <ul className="space-y-2 text-foreground/90">
                  <li>• Group bookings (5+ rooms or 10+ guests) are <strong>non-refundable</strong> and <strong>non-cancellable</strong></li>
                  <li>• Special promotional offers and discounted rates are strictly non-refundable</li>
                  <li>• Modification rules remain the same unless specified otherwise in the offer terms</li>
                  <li>• Group bookings may require higher advance payment (up to 100%)</li>
                </ul>
              </div>
            </section>

            {/* Travel Packages & Tours */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">8. Travel Packages & Tours</h2>
              
              <h3 className="text-xl font-medium mb-3 text-foreground">8.1 Tour Package Cancellations</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tour package bookings are <strong>non-refundable</strong> once confirmed</li>
                <li>Date modifications may be possible subject to availability and supplier terms</li>
                <li>Third-party components (flights, permits) have separate cancellation policies</li>
              </ul>
              
              <h3 className="text-xl font-medium mb-3 mt-6 text-foreground">8.2 Weather & Force Majeure</h3>
              <ul className="list-disc pl-6 space-y-2">
                <li>Tours cancelled due to weather or safety will be rescheduled at no extra cost</li>
                <li>If rescheduling is not possible, credit will be issued for future travel</li>
                <li>Natural disasters and government restrictions are force majeure events</li>
              </ul>
            </section>

            {/* How to Request Modification */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground flex items-center gap-2">
                <FileText className="h-6 w-6 text-purple-500" />
                9. How to Request a Modification
              </h2>
              
              <p className="mb-4">To modify your booking, contact us with your booking reference:</p>
              <div className="bg-muted p-6 rounded-lg space-y-3">
                <p><strong>Email:</strong> <a href="mailto:booking@xtsy.one" className="text-primary hover:underline">booking@xtsy.one</a></p>
                <p><strong>Response Time:</strong> Within 24 hours (typically 2-4 hours)</p>
              </div>
              
              <p className="mt-4 text-foreground/80">
                Please include your booking ID/reference, registered email/phone, and requested changes 
                in your modification request.
              </p>
            </section>

            {/* Payment Methods */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">10. Accepted Payment Methods</h2>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>UPI:</strong> Google Pay, PhonePe, Paytm, BHIM UPI</li>
                <li><strong>Cards:</strong> Visa, Mastercard, RuPay (Credit & Debit)</li>
                <li><strong>Net Banking:</strong> All major Indian banks</li>
                <li><strong>Wallets:</strong> Paytm Wallet, PhonePe Wallet</li>
                <li><strong>EMI:</strong> Available on select cards (subject to bank terms)</li>
              </ul>
              <p className="mt-4 text-foreground/80">
                All payments are processed through RBI-compliant, PCI-DSS certified payment gateways.
              </p>
            </section>

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">11. Contact Us</h2>
              <p>For pricing queries or policy clarifications:</p>
              <div className="bg-muted p-6 rounded-lg mt-4 space-y-3">
                <p><strong>Email:</strong> <a href="mailto:admin@xtsy.one" className="text-primary hover:underline">admin@xtsy.one</a></p>
              </div>
            </section>
            
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default PricingCancellationPolicy;
