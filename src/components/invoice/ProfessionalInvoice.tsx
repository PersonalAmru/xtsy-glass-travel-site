/**
 * Professional Invoice Component - Premium invoice generation with QR codes
 */

import { useState, useRef } from 'react';
import { format } from 'date-fns';
import { Download, Printer, Mail, QrCode, CheckCircle2, Clock, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';

interface InvoiceProps {
  invoiceNumber: string;
  bookingId: string;
  status: 'pending' | 'confirmed' | 'paid' | 'cancelled';
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestAddress?: string;
  guestCity?: string;
  guestState?: string;
  guestPincode?: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
  roomType: string;
  quantity: number;
  nights: number;
  ratePerNight: number;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  propertyName?: string;
  propertyAddress?: string;
  propertyGSTIN?: string;
}

export default function ProfessionalInvoice({
  invoiceNumber,
  bookingId,
  status,
  guestName,
  guestEmail,
  guestPhone,
  guestAddress,
  guestCity,
  guestState,
  guestPincode,
  checkIn,
  checkOut,
  roomName,
  roomType,
  quantity,
  nights,
  ratePerNight,
  subtotal,
  gstRate,
  gstAmount,
  totalAmount,
  propertyName = 'XTSY Travellers Hostel',
  propertyAddress = 'Shillong, Meghalaya 793001',
  propertyGSTIN = 'PENDING',
}: InvoiceProps) {
  const invoiceRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  
  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy');
    } catch {
      return dateStr;
    }
  };
  
  const statusConfig = {
    pending: { label: 'Pending Approval', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Clock },
    confirmed: { label: 'Confirmed', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20', icon: CheckCircle2 },
    paid: { label: 'Paid', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20', icon: CheckCircle2 },
    cancelled: { label: 'Cancelled', color: 'text-red-400', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: Clock },
  };
  
  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;
  
  const handlePrint = () => {
    setIsPrinting(true);
    window.print();
    setTimeout(() => setIsPrinting(false), 1000);
  };
  
  const handleDownload = () => {
    // Generate downloadable HTML
    const htmlContent = generateDownloadableHTML();
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `invoice-${invoiceNumber}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };
  
  const generateDownloadableHTML = () => {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #fff; color: #1a1a1a; padding: 40px; }
    .invoice { max-width: 800px; margin: 0 auto; }
    .header { display: flex; justify-content: space-between; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 2px solid #f0f0f0; }
    .logo { font-size: 24px; font-weight: 700; color: #f97316; }
    .invoice-meta { text-align: right; }
    .invoice-number { font-size: 20px; font-weight: 600; color: #1a1a1a; }
    .invoice-date { color: #666; margin-top: 4px; }
    .section { margin-bottom: 32px; }
    .section-title { font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #666; margin-bottom: 12px; }
    .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
    .info-block h3 { font-size: 16px; font-weight: 600; margin-bottom: 4px; }
    .info-block p { color: #666; font-size: 14px; line-height: 1.5; }
    .details-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .details-table th { text-align: left; padding: 12px; background: #f8f8f8; font-weight: 600; font-size: 12px; text-transform: uppercase; }
    .details-table td { padding: 16px 12px; border-bottom: 1px solid #f0f0f0; }
    .totals { background: #f8f8f8; padding: 24px; border-radius: 8px; }
    .total-row { display: flex; justify-content: space-between; margin-bottom: 12px; }
    .total-row.grand { font-size: 18px; font-weight: 700; padding-top: 12px; border-top: 2px solid #e0e0e0; margin-top: 12px; margin-bottom: 0; }
    .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #f0f0f0; text-align: center; color: #666; font-size: 12px; }
    @media print { body { padding: 20px; } }
  </style>
</head>
<body>
  <div class="invoice">
    <div class="header">
      <div class="logo">XTSY</div>
      <div class="invoice-meta">
        <div class="invoice-number">${invoiceNumber}</div>
        <div class="invoice-date">${format(new Date(), 'dd MMM yyyy')}</div>
      </div>
    </div>
    
    <div class="section">
      <div class="info-grid">
        <div class="info-block">
          <div class="section-title">Bill To</div>
          <h3>${guestName}</h3>
          <p>${guestEmail}<br>${guestPhone}</p>
          ${guestAddress ? `<p>${guestAddress}${guestCity ? `, ${guestCity}` : ''}${guestState ? `, ${guestState}` : ''}${guestPincode ? ` - ${guestPincode}` : ''}</p>` : ''}
        </div>
        <div class="info-block" style="text-align: right;">
          <div class="section-title">From</div>
          <h3>${propertyName}</h3>
          <p>${propertyAddress}</p>
          <p>GSTIN: ${propertyGSTIN}</p>
        </div>
      </div>
    </div>
    
    <div class="section">
      <div class="section-title">Booking Details</div>
      <div class="info-grid">
        <p><strong>Check-in:</strong> ${formatDate(checkIn)}</p>
        <p><strong>Check-out:</strong> ${formatDate(checkOut)}</p>
      </div>
    </div>
    
    <div class="section">
      <table class="details-table">
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty × Nights</th>
            <th>Rate</th>
            <th style="text-align: right;">Amount</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>${roomName}</strong><br><span style="color: #666; font-size: 12px;">${roomType === 'dorm' ? 'Dormitory Bed' : 'Private Room'}</span></td>
            <td>${quantity} × ${nights}</td>
            <td>₹${ratePerNight.toLocaleString('en-IN')}</td>
            <td style="text-align: right; font-weight: 600;">₹${subtotal.toLocaleString('en-IN')}</td>
          </tr>
        </tbody>
      </table>
      
      <div class="totals">
        <div class="total-row">
          <span>Subtotal</span>
          <span>₹${subtotal.toLocaleString('en-IN')}</span>
        </div>
        <div class="total-row">
          <span>GST (${(gstRate * 100).toFixed(0)}%)</span>
          <span>₹${gstAmount.toLocaleString('en-IN')}</span>
        </div>
        <div class="total-row grand">
          <span>Total Amount</span>
          <span>₹${totalAmount.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
    
    <div class="footer">
      <p>Thank you for choosing XTSY Travellers Hostel</p>
      <p style="margin-top: 8px;">This is a computer-generated invoice</p>
    </div>
  </div>
</body>
</html>`;
  };
  
  // Generate QR code data URL (simple implementation)
  const qrData = `XTSY-${bookingId}|${totalAmount}|${formatDate(checkIn)}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-background"
    >
      {/* Actions Bar */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="flex items-center gap-2">
          <div className={`px-3 py-1.5 rounded-full ${currentStatus.bg} ${currentStatus.border} border flex items-center gap-2`}>
            <StatusIcon className={`w-4 h-4 ${currentStatus.color}`} />
            <span className={`text-sm font-medium ${currentStatus.color}`}>{currentStatus.label}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} disabled={isPrinting}>
            <Printer className="w-4 h-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="w-4 h-4 mr-2" />
            Download
          </Button>
        </div>
      </div>
      
      {/* Invoice */}
      <Card ref={invoiceRef} className="bg-white text-zinc-900 p-8 print:shadow-none print:p-4">
        {/* Header */}
        <div className="flex items-start justify-between pb-6 border-b border-zinc-200">
          <div>
            <h1 className="text-2xl font-bold text-primary">XTSY</h1>
            <p className="text-sm text-zinc-500 mt-1">{propertyName}</p>
            <p className="text-xs text-zinc-400">{propertyAddress}</p>
            {propertyGSTIN && (
              <p className="text-xs text-zinc-400 mt-1">GSTIN: {propertyGSTIN}</p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-wide">Invoice</p>
            <p className="text-lg font-semibold text-zinc-900">{invoiceNumber}</p>
            <p className="text-sm text-zinc-500 mt-1">{format(new Date(), 'dd MMM yyyy')}</p>
          </div>
        </div>
        
        {/* Guest & Booking Info */}
        <div className="grid grid-cols-2 gap-8 py-6 border-b border-zinc-200">
          <div>
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Bill To</p>
            <p className="font-semibold text-zinc-900">{guestName}</p>
            <p className="text-sm text-zinc-600">{guestEmail}</p>
            <p className="text-sm text-zinc-600">{guestPhone}</p>
            {guestAddress && (
              <p className="text-sm text-zinc-600 mt-1">
                {guestAddress}
                {guestCity && `, ${guestCity}`}
                {guestState && `, ${guestState}`}
                {guestPincode && ` - ${guestPincode}`}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">Stay Details</p>
            <p className="text-sm text-zinc-600">
              <span className="font-medium">Check-in:</span> {formatDate(checkIn)}
            </p>
            <p className="text-sm text-zinc-600">
              <span className="font-medium">Check-out:</span> {formatDate(checkOut)}
            </p>
            <p className="text-sm text-zinc-600">
              <span className="font-medium">Duration:</span> {nights} Night{nights > 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        {/* Line Items */}
        <div className="py-6">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="text-left text-xs text-zinc-500 uppercase tracking-wide pb-3">Description</th>
                <th className="text-center text-xs text-zinc-500 uppercase tracking-wide pb-3">Qty × Nights</th>
                <th className="text-right text-xs text-zinc-500 uppercase tracking-wide pb-3">Rate</th>
                <th className="text-right text-xs text-zinc-500 uppercase tracking-wide pb-3">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-4">
                  <p className="font-medium text-zinc-900">{roomName}</p>
                  <p className="text-sm text-zinc-500">{roomType === 'dorm' ? 'Dormitory Bed' : 'Private Room'}</p>
                </td>
                <td className="text-center text-zinc-700">{quantity} × {nights}</td>
                <td className="text-right text-zinc-700">₹{ratePerNight.toLocaleString('en-IN')}</td>
                <td className="text-right font-medium text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Totals */}
        <div className="bg-zinc-50 rounded-lg p-4">
          <div className="flex justify-between py-2">
            <span className="text-zinc-600">Subtotal</span>
            <span className="text-zinc-900">₹{subtotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between py-2 border-b border-zinc-200">
            <span className="text-zinc-600">GST ({(gstRate * 100).toFixed(0)}%)</span>
            <span className="text-zinc-900">₹{gstAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-lg font-semibold text-zinc-900">Total Amount</span>
            <span className="text-lg font-bold text-zinc-900">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-zinc-200 text-center">
          <p className="text-sm text-zinc-500">Thank you for choosing XTSY Travellers Hostel</p>
          <p className="text-xs text-zinc-400 mt-2">This is a computer-generated invoice</p>
        </div>
      </Card>
    </motion.div>
  );
}
