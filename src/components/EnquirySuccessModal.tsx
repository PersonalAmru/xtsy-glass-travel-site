import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import { 
  CheckCircle2, Calendar, MessageCircle, Lock, 
  X, ArrowRight, Bell, Shield, Clock, Home,
  Download, CreditCard, FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { format, parseISO, differenceInDays } from 'date-fns';
import { useNavigate } from '@/lib/router-compat';
import { numberToWordsINR } from '@/utils/numberToWords';

interface RoomSelectionDetail {
  roomName: string;
  quantity: number;
  ratePerNight: number;
  gstRate: number;
  lineTotal: number;
}

interface EnquirySuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  guestName: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  roomCount: number;
  roomType?: string;
  totalAmount?: number;
  isAuthenticated: boolean;
  ratePerNight: number;
  quantity: number;
  nights: number;
  gstRate: number;
  gstAmount: number;
  subtotal: number;
  guestEmail: string;
  guestPhone: string;
  guestCity: string;
  roomSelections: RoomSelectionDetail[];
}

const EnquirySuccessModal = ({ 
  isOpen, 
  onClose, 
  guestName,
  checkIn,
  checkOut,
  guests,
  roomCount,
  roomType,
  totalAmount,
  isAuthenticated,
  ratePerNight,
  quantity,
  nights,
  gstRate,
  gstAmount,
  subtotal,
  guestEmail,
  guestPhone,
  guestCity,
  roomSelections,
}: EnquirySuccessModalProps) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const formatDate = (dateStr: string) => {
    try {
      return format(parseISO(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };

  const getNights = () => {
    try {
      return differenceInDays(parseISO(checkOut), parseISO(checkIn));
    } catch {
      return nights || 1;
    }
  };

  const handleSignIn = () => {
    onClose();
    navigate('/auth', { state: { from: '/profile' } });
  };

  const handleViewProfile = () => {
    onClose();
    navigate('/profile');
  };

  const handleGoHome = () => {
    onClose();
    navigate('/');
  };

  const firstName = guestName.split(' ')[0];
  const computedNights = getNights();
  const total = totalAmount || 0;
  const cgstRate = gstRate / 2;
  const sgstRate = gstRate / 2;
  const cgstAmount = Math.round(gstAmount / 2);
  const sgstAmount = gstAmount - cgstAmount;

  const handleDownloadInvoice = () => {
    const invoiceDate = format(new Date(), 'dd MMM yyyy');
    const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>XTSY Quotation</title>
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: 'Segoe UI', Arial, sans-serif; color: #1a1a2e; background: #fff; padding: 24px; max-width: 800px; margin: auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 3px solid #10b981; padding-bottom: 16px; margin-bottom: 20px; }
  .company { font-size: 13px; line-height: 1.6; }
  .company h1 { font-size: 22px; color: #10b981; margin-bottom: 4px; }
  .badge { background: #fef3c7; color: #92400e; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: 600; display: inline-block; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 20px; }
  .box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 14px; }
  .box h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 1px; color: #64748b; margin-bottom: 8px; }
  .box p { font-size: 13px; line-height: 1.5; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 16px; }
  th { background: #10b981; color: white; padding: 10px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; text-align: left; }
  td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; font-size: 13px; }
  .text-right { text-align: right; }
  .totals { margin-left: auto; width: 300px; }
  .totals .row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 13px; }
  .totals .row.total { border-top: 2px solid #1a1a2e; font-size: 16px; font-weight: bold; padding-top: 10px; margin-top: 4px; }
  .words { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px; font-size: 12px; color: #166534; margin-bottom: 16px; }
  .terms { font-size: 11px; color: #64748b; line-height: 1.6; border-top: 1px solid #e2e8f0; padding-top: 12px; margin-top: 16px; }
  .upi { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 12px; text-align: center; margin-top: 12px; }
  .upi span { font-weight: 700; color: #1e40af; font-size: 15px; }
  @media print { body { padding: 0; } .no-print { display: none; } }
</style></head><body>
  <div class="header">
    <div class="company">
      <h1>XTSY Travellers Hostel</h1>
      <p>Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018</p>
      <p>GSTIN: 17QSKPK1714H1ZE &nbsp;|&nbsp; PAN: QSKPK1714H</p>
      <p>Email: admin@xtsy.one &nbsp;|&nbsp; Web: xtsy.one</p>
    </div>
    <div style="text-align:right">
      <div class="badge">⏳ Quotation / Pro-forma</div>
      <p style="font-size:12px;color:#64748b;margin-top:8px">Date: ${invoiceDate}</p>
    </div>
  </div>

  <div class="grid2">
    <div class="box">
      <h3>Bill To</h3>
      <p><strong>${guestName}</strong></p>
      <p>${guestPhone}</p>
      <p>${guestEmail}</p>
      ${guestCity ? `<p>${guestCity}</p>` : ''}
    </div>
    <div class="box">
      <h3>Stay Details</h3>
      <p><strong>Check-in:</strong> ${formatDate(checkIn)}</p>
      <p><strong>Check-out:</strong> ${formatDate(checkOut)}</p>
      <p><strong>Nights:</strong> ${computedNights} &nbsp;|&nbsp; <strong>Guests:</strong> ${guests}</p>
    </div>
  </div>

  <table>
    <thead><tr><th>Services</th><th>SAC</th><th>Qty</th><th class="text-right">Rate/Night</th><th class="text-right">Tax</th><th class="text-right">Amount</th></tr></thead>
    <tbody>
      ${roomSelections.map(sel => {
        const lineSubtotal = sel.ratePerNight * sel.quantity * computedNights;
        const lineGst = Math.round(lineSubtotal * (sel.gstRate / 100));
        return `<tr>
          <td>${sel.roomName}</td>
          <td>996311</td>
          <td>${sel.quantity} × ${computedNights}N</td>
          <td class="text-right">₹${sel.ratePerNight.toLocaleString('en-IN')}</td>
          <td class="text-right">₹${lineGst.toLocaleString('en-IN')}</td>
          <td class="text-right">₹${(lineSubtotal + lineGst).toLocaleString('en-IN')}</td>
        </tr>`;
      }).join('')}
    </tbody>
  </table>

  <div class="totals">
    <div class="row"><span>Taxable Amount</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
    <div class="row"><span>CGST @ ${cgstRate}%</span><span>₹${cgstAmount.toLocaleString('en-IN')}</span></div>
    <div class="row"><span>SGST @ ${sgstRate}%</span><span>₹${sgstAmount.toLocaleString('en-IN')}</span></div>
    <div class="row total"><span>Total</span><span>₹${total.toLocaleString('en-IN')}</span></div>
  </div>

  <div class="words"><strong>Amount in words:</strong> ${numberToWordsINR(total)}</div>

  <div class="upi">
    <p style="font-size:12px;color:#64748b;margin-bottom:4px">Pay via UPI</p>
    <span>9863627070@okbizaxis</span>
  </div>

  <div class="terms">
    <p><strong>Terms & Conditions:</strong></p>
    <p>• This is a quotation/pro-forma invoice. Final invoice will be issued upon confirmation.</p>
    <p>• Booking amount is non-refundable once confirmed by the host.</p>
    <p>• Check-in time: 1:00 PM | Check-out time: 11:00 AM</p>
    <p>• All disputes are subject to Meghalaya jurisdiction.</p>
    <p>• SAC Code 996311 — Accommodation services</p>
  </div>

  <div class="no-print" style="text-align:center;margin-top:24px">
    <button onclick="window.print()" style="background:#10b981;color:white;border:none;padding:12px 32px;border-radius:8px;font-size:14px;cursor:pointer;font-weight:600">🖨️ Print / Save as PDF</button>
  </div>
</body></html>`;
    
    const blob = new Blob([html], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
    setTimeout(() => URL.revokeObjectURL(url), 15000);
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          style={{ zIndex: 999999 }}
        >
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            onClick={handleGoHome}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="relative w-full max-w-[460px] bg-background rounded-[28px] shadow-2xl overflow-hidden my-auto max-h-[92vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleGoHome}
              className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 hover:bg-black/60 transition-colors z-10 backdrop-blur-xs"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Success header */}
            <div className="relative bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-700 px-5 pt-8 pb-14">
              <div className="absolute inset-0 overflow-hidden">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 100, opacity: [0, 1, 0] }}
                    transition={{ duration: 2, delay: i * 0.2, repeat: Infinity, repeatDelay: 3 }}
                    className="absolute w-2 h-2 rounded-full"
                    style={{ 
                      left: `${15 + i * 15}%`, 
                      backgroundColor: ['#fff', '#ffd700', '#ff6b6b', '#4ecdc4', '#a855f7', '#f472b6'][i],
                      opacity: 0.6
                    }}
                  />
                ))}
              </div>
              
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl relative"
              >
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                <motion.div
                  initial={{ scale: 1 }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute inset-0 rounded-full bg-white/30"
                />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-4"
              >
                <h2 className="text-2xl font-bold text-white">Booking Received!</h2>
                <p className="text-emerald-100/90 mt-1 text-sm">Thank you, {firstName}! 🎉</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="absolute -bottom-4 left-1/2 -translate-x-1/2"
              >
                <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 text-white rounded-full shadow-lg text-sm font-semibold">
                  <Clock className="w-4 h-4" />
                  Awaiting Host Confirmation
                </div>
              </motion.div>
            </div>

            {/* Invoice Content */}
            <div className="px-4 pt-8 pb-5 space-y-4">
              {/* Company Letterhead */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center border-b border-border/50 pb-3"
              >
                <h3 className="font-bold text-foreground text-sm">XTSY Travellers Hostel</h3>
                <p className="text-[11px] text-muted-foreground leading-relaxed mt-1">
                  Mawdiangdiang Road, New Shillong Township, Shillong, Meghalaya 793018<br />
                  GSTIN: <span className="font-mono font-medium text-foreground">17QSKPK1714H1ZE</span> &nbsp;|&nbsp; PAN: <span className="font-mono font-medium text-foreground">QSKPK1714H</span>
                </p>
              </motion.div>

              {/* Bill To + Stay Dates */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55 }}
                className="grid grid-cols-2 gap-3"
              >
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Bill To</p>
                  <p className="font-semibold text-foreground text-xs">{guestName}</p>
                  <p className="text-[11px] text-muted-foreground">{guestPhone}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{guestEmail}</p>
                  {guestCity && <p className="text-[11px] text-muted-foreground">{guestCity}</p>}
                </div>
                <div className="bg-muted/40 rounded-xl p-3">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Stay</p>
                  <div className="space-y-1">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-foreground font-medium">{formatDate(checkIn)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-foreground font-medium">{formatDate(checkOut)}</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">{computedNights}N · {guests} guest{guests > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </motion.div>

              {/* Line Items Table */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="rounded-xl overflow-hidden border border-border/50"
              >
                {/* Table header */}
                <div className="grid grid-cols-12 bg-emerald-600 text-white text-[10px] uppercase tracking-wider font-medium">
                  <div className="col-span-4 px-3 py-2">Services</div>
                  <div className="col-span-2 px-2 py-2">SAC</div>
                  <div className="col-span-2 px-2 py-2">Qty</div>
                  <div className="col-span-2 px-2 py-2 text-right">Rate</div>
                  <div className="col-span-2 px-3 py-2 text-right">Amount</div>
                </div>
                {/* Table rows */}
                {roomSelections.map((sel, idx) => {
                  const lineSubtotal = sel.ratePerNight * sel.quantity * computedNights;
                  const lineGst = Math.round(lineSubtotal * (sel.gstRate / 100));
                  return (
                    <div key={idx} className="grid grid-cols-12 text-xs border-t border-border/30 bg-background">
                      <div className="col-span-4 px-3 py-2.5 font-medium text-foreground truncate">{sel.roomName}</div>
                      <div className="col-span-2 px-2 py-2.5 text-muted-foreground font-mono text-[11px]">996311</div>
                      <div className="col-span-2 px-2 py-2.5 text-muted-foreground">{sel.quantity}×{computedNights}N</div>
                      <div className="col-span-2 px-2 py-2.5 text-right text-muted-foreground">₹{sel.ratePerNight.toLocaleString('en-IN')}</div>
                      <div className="col-span-2 px-3 py-2.5 text-right font-semibold text-foreground">₹{(lineSubtotal + lineGst).toLocaleString('en-IN')}</div>
                    </div>
                  );
                })}
              </motion.div>

              {/* Tax Breakdown + Total */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 }}
                className="space-y-1.5"
              >
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>Taxable Amount</span>
                  <span>₹{subtotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>CGST @ {cgstRate}%</span>
                  <span>₹{cgstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground px-1">
                  <span>SGST @ {sgstRate}%</span>
                  <span>₹{sgstAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-foreground/20 px-1">
                  <span className="text-sm font-bold text-foreground">Total</span>
                  <span className="text-lg font-bold text-foreground">₹{total.toLocaleString('en-IN')}</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic px-1">{numberToWordsINR(total)}</p>
              </motion.div>

              {/* UPI Payment */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-primary/5 border border-primary/20 rounded-xl p-3 text-center"
              >
                <p className="text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Pay via UPI</p>
                <p className="font-mono font-bold text-primary text-sm">9863627070@okbizaxis</p>
              </motion.div>

              {/* Terms */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.72 }}
                className="text-[10px] text-muted-foreground leading-relaxed space-y-0.5 px-1"
              >
                <p className="font-medium text-foreground text-[10px] mb-1">Terms & Conditions</p>
                <p>• Quotation valid until host confirmation. Final invoice issued upon approval.</p>
                <p>• Booking amount is non-refundable once confirmed.</p>
                <p>• Check-in: 11:00 AM | Check-out: 10:00 AM (strict)</p>
                <p>• All disputes subject to Meghalaya jurisdiction.</p>
              </motion.div>

              {/* Chat preview - Locked (only for unauthenticated) */}
              {!isAuthenticated && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.75 }}
                  className="relative overflow-hidden"
                >
                  <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 dark:from-slate-800/50 dark:to-slate-900/50 rounded-2xl p-3 border border-border/30">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                          <MessageCircle className="w-3.5 h-3.5 text-primary" />
                        </div>
                        <span className="font-medium text-foreground text-xs">Chat with Host</span>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1 bg-amber-500/20 rounded-full">
                        <Lock className="w-3 h-3 text-amber-500" />
                        <span className="text-[10px] font-semibold text-amber-500 uppercase">Locked</span>
                      </div>
                    </div>
                    <div className="space-y-1.5 blur-[2px] opacity-60 select-none pointer-events-none">
                      <div className="bg-muted rounded-lg px-2.5 py-1.5 max-w-[70%]">
                        <p className="text-[10px] text-muted-foreground">Hi! Thank you for your request...</p>
                      </div>
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent flex items-end justify-center rounded-2xl pb-2">
                    <p className="text-[10px] text-muted-foreground">Sign in to chat with your host</p>
                  </div>
                </motion.div>
              )}

              {/* CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="space-y-2.5"
              >
                {/* Download Invoice */}
                <Button
                  onClick={handleDownloadInvoice}
                  variant="outline"
                  className="w-full h-10 rounded-xl border-primary/30 text-primary hover:bg-primary/5"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Download Quotation
                </Button>

                {!isAuthenticated ? (
                  <>
                    <Button
                      onClick={handleSignIn}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold h-11 rounded-xl shadow-lg shadow-primary/20"
                    >
                      <span>Sign in to unlock features</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <div className="flex flex-wrap gap-2 justify-center">
                      {[
                        { icon: MessageCircle, label: 'Host Chat' },
                        { icon: Bell, label: 'Updates' },
                        { icon: Download, label: 'Invoice' },
                        { icon: CreditCard, label: 'Pay Online' },
                      ].map((feature) => (
                        <div
                          key={feature.label}
                          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-muted/50 text-muted-foreground"
                        >
                          <feature.icon className="w-3 h-3" />
                          <span className="text-[10px] font-medium">{feature.label}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleViewProfile}
                      className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground font-semibold h-11 rounded-xl"
                    >
                      <span>View My Bookings</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                    <div className="flex items-center justify-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-xl">
                      <Shield className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-medium text-emerald-500">You'll be notified when host confirms</span>
                    </div>
                  </>
                )}

                <Button
                  onClick={handleGoHome}
                  variant="ghost"
                  className="w-full h-9 text-muted-foreground hover:text-foreground"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Return to Home
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.85 }}
                className="text-[11px] text-center text-muted-foreground pt-1"
              >
                Our host typically confirms within <span className="font-medium text-foreground">2-4 hours</span>
              </motion.p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
};

export default EnquirySuccessModal;
