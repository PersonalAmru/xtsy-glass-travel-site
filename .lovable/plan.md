

## Plan: 3-Second Celebration Modal + Professional Invoice Confirmation

### What we're building

1. **Celebration Interstitial (3 sec)**: After enquiry submission succeeds, show a full-screen celebratory overlay with confetti animation and "We are excited to host you!" message. Auto-dismisses after 3 seconds, then reveals the existing EnquirySuccessModal (booking received page).

2. **Professional Invoice on Confirmation Page**: Update the EnquirySuccessModal to include a Zoho-style professional invoice matching the PDF quotation format (GSTIN, SAC code, CGST/SGST split, terms, UPI details).

---

### Technical Details

#### 1. Install `canvas-confetti` dependency

#### 2. Create `src/components/ui/confetti.tsx`
- Adapted from the provided shadcn confetti component
- Exports `Confetti` (canvas-based) and `ConfettiButton`
- Uses `canvas-confetti` library with worker support

#### 3. Create `src/components/CelebrationInterstitial.tsx`
- Full-screen overlay (z-index 999999) with dark backdrop
- Fires side-cannon confetti (brand colors: emerald/teal/amber/gold) for 3 seconds
- Displays animated "We are excited to host you!" with guest's first name
- XTSY brand accent colors (emerald gradient)
- Auto-dismisses after 3 seconds via `useEffect` timer
- Props: `isOpen`, `guestName`, `onComplete` (callback when 3s elapsed)

#### 4. Modify `src/components/BookingModal.tsx`
- Add a `showCelebration` state (boolean)
- On successful enquiry submission (line ~612): set `showCelebration = true` instead of `showSuccessModal = true`
- When celebration completes (after 3s), set `showCelebration = false` and `showSuccessModal = true`
- Render `<CelebrationInterstitial>` before `<EnquirySuccessModal>`

#### 5. Update `src/components/EnquirySuccessModal.tsx`
- Add professional invoice section matching the PDF quotation format:
  - XTSY header with GSTIN (17QSKPK1714H1ZE), PAN, SAC code 996311
  - Line items table: room name, quantity, rate, tax, amount
  - Taxable amount breakdown with CGST/SGST split (2.5%+2.5% for <₹7500, 9%+9% for ≥₹7500)
  - Total in words (Indian format)
  - Terms & conditions
  - UPI payment info (9863627070@okbizaxis)
- Add "View Invoice" and "Download PDF" buttons that render this invoice in a new window
- Update header from green checkmark to amber clock icon (matching screenshot) with "Booking Received!" title
- Add booking ID display (enquiry ID passed from BookingModal)

#### Flow Summary
```text
Submit Enquiry
    ↓
[3-sec Celebration Overlay]
  - Confetti side cannons
  - "We are excited to host you, {name}!"
  - Auto-dismiss after 3s
    ↓
[Booking Received Page]
  - Amber clock icon + "Booking Received!"
  - Booking details card
  - View Invoice / Download PDF
  - Message to Host / Return Home
```

