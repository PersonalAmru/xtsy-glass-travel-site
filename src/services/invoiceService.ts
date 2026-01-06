import { supabase } from '@/integrations/supabase/client';

export interface InvoiceData {
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
  specialRequests?: string;
  userId?: string;
}

export interface GenerateInvoiceResponse {
  success: boolean;
  bookingId?: string;
  bookingUUID?: string;
  html?: string;
  error?: string;
}

export async function generateInvoice(data: InvoiceData): Promise<GenerateInvoiceResponse> {
  try {
    const { data: result, error } = await supabase.functions.invoke('generate-invoice', {
      body: {
        action: 'generate',
        invoiceData: data,
      },
    });

    if (error) {
      console.error('Invoice generation error:', error);
      return { success: false, error: error.message };
    }

    return result;
  } catch (error) {
    console.error('Invoice service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate invoice',
    };
  }
}

export async function getInvoice(bookingId: string): Promise<{ success: boolean; invoice?: any; error?: string }> {
  try {
    const { data: result, error } = await supabase.functions.invoke('generate-invoice', {
      body: {
        action: 'get',
        bookingId,
      },
    });

    if (error) {
      console.error('Get invoice error:', error);
      return { success: false, error: error.message };
    }

    return result;
  } catch (error) {
    console.error('Invoice service error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get invoice',
    };
  }
}

export async function getInvoiceLocal(bookingId: string) {
  const { data, error } = await supabase
    .from('booking_invoices')
    .select('*')
    .eq('booking_id', bookingId)
    .single();

  if (error) {
    console.error('Get invoice error:', error);
    return { data: null, error: error.message };
  }

  return { data, error: null };
}

export function downloadInvoiceAsPDF(html: string, bookingId: string) {
  // Open in new window for printing/saving as PDF
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    
    // Auto-trigger print dialog after a short delay
    setTimeout(() => {
      printWindow.print();
    }, 500);
  }
}

export function openInvoiceHTML(html: string) {
  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  window.open(url, '_blank');
  
  // Cleanup after a delay
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}
