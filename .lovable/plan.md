

## Plan: Update Invoice Layout to Professional Zoho-Style Quotation

### Overview
Replace the current Airbnb-style success modal with a professional tax invoice/quotation layout matching the XTSY PDF format (GSTIN, SAC code, CGST/SGST split, terms, amount in words).

### Changes

#### 1. Pass additional data to EnquirySuccessModal
**File: `src/components/BookingModal.tsx`**
- Expand `successData` type to include: `ratePerNight`, `quantity`, `gstRate`, `gstAmount`, `subtotal`, `roomSelections` array, `guestEmail`, `guestPhone`, `guestCity`
- Pass these through to `EnquirySuccessModal`

#### 2. Expand EnquirySuccessModal props
**File: `src/components/EnquirySuccessModal.tsx`**
- Add new props: `ratePerNight`, `quantity`, `gstRate`, `gstAmount`, `subtotal`, `guestEmail`, `guestPhone`, `guestCity`

#### 3. Redesign the modal body with professional invoice layout
**File: `src/components/EnquirySuccessModal.tsx`**

Replace the booking summary card with a Zoho-style invoice section:

- **Header**: Keep the emerald gradient success header (already nice) but update title to "Booking Received!"
- **Invoice section** (below header):
  - XTSY letterhead: company name, address, GSTIN `17QSKPK1714H1ZE`, PAN `QSKPK1714H`, email, website
  - "Bill To" block: guest name, phone, email, city
  - Line items table with columns: Services | SAC | Qty | Rate | Tax | Amount
    - Room name, SAC code 996311, quantity x nights, rate per night, tax amount, line total
  - Tax breakdown: Taxable amount, CGST (half of GST), SGST (half of GST)
  - **Total in bold** with Indian number-to-words conversion
  - Terms: "All disputes subject to Meghalaya jurisdiction" + non-refundable booking notice
  - UPI payment info: `9863627070@okbizaxis`
- **Action buttons**: "Download Invoice" (generates printable HTML), "View My Bookings" / "Sign In", "Return Home"
- Keep the locked chat preview for non-authenticated users

#### 4. Number-to-words utility
Add a small helper function (inline or utility) to convert INR amounts to Indian English words (e.g., "Two Thousand Five Hundred Fourteen Rupees").

#### 5. Download Invoice function
Add a "Download Invoice" button that opens a clean printable HTML invoice in a new tab (similar to existing `ProfessionalInvoice.tsx` pattern but matching the new Zoho layout).

### Visual Structure
```text
┌─────────────────────────────────┐
│  [Emerald gradient header]      │
│  ✓ Booking Received!            │
│  Thank you, {name}! 🎉         │
│  [Awaiting Host Confirmation]   │
├─────────────────────────────────┤
│  XTSY Travellers Hostel         │
│  GSTIN: 17QSKPK1714H1ZE        │
│  PAN: QSKPK1714H               │
├─────────────────────────────────┤
│  Bill To: {guest}  │ Stay Dates │
├─────────────────────────────────┤
│  SERVICES  │SAC   │QTY│RATE│AMT │
│  Room Name │996311│2x3│₹X  │₹Y  │
├─────────────────────────────────┤
│  Taxable:  ₹X                   │
│  CGST @2.5%: ₹X  SGST @2.5%: ₹X│
│  TOTAL: ₹X (in words)          │
├─────────────────────────────────┤
│  Terms & Conditions             │
│  UPI: 9863627070@okbizaxis      │
├─────────────────────────────────┤
│  [Download Invoice] [View My..] │
│  [Return Home]                  │
└─────────────────────────────────┘
```

