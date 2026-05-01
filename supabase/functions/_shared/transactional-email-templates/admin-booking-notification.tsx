/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'XTSY'

interface AdminBookingNotificationProps {
  bookingId?: string
  guestName?: string
  email?: string
  phone?: string
  checkIn?: string
  checkOut?: string
  nights?: number | string
  guests?: number | string
  roomType?: string
  quantity?: number | string
  subtotal?: number | string
  taxes?: number | string
  totalAmount?: number | string
  address?: string
  city?: string
  state?: string
  pincode?: string
  specialRequests?: string
  emergencyContact?: string
  source?: string
}

const fmt = (v: any) =>
  v === undefined || v === null || v === '' ? '—' : String(v)

const fmtMoney = (v: any) => {
  if (v === undefined || v === null || v === '') return '—'
  const n = typeof v === 'number' ? v : Number(v)
  if (Number.isNaN(n)) return String(v)
  return `₹${n.toLocaleString('en-IN')}`
}

const Row = ({ label, value }: { label: string; value: any }) => (
  <tr>
    <td style={tdLabel}>{label}</td>
    <td style={tdValue}>{fmt(value)}</td>
  </tr>
)

const AdminBookingNotificationEmail = (p: AdminBookingNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>
      New booking {p.bookingId ? `#${p.bookingId}` : ''} — {fmt(p.guestName)} · {fmtMoney(p.totalAmount)}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New booking received</Heading>
        <Text style={subtle}>
          A new booking just came in on {SITE_NAME}.
        </Text>

        <Section style={card}>
          <table style={table}>
            <tbody>
              <Row label="Booking ID" value={p.bookingId} />
              <Row label="Source" value={p.source || 'Website'} />
              <Row label="Total" value={fmtMoney(p.totalAmount)} />
            </tbody>
          </table>
        </Section>

        <Heading as="h2" style={h2}>Guest</Heading>
        <Section style={card}>
          <table style={table}>
            <tbody>
              <Row label="Name" value={p.guestName} />
              <Row label="Email" value={p.email} />
              <Row label="Phone / WhatsApp" value={p.phone} />
              <Row label="Emergency Contact" value={p.emergencyContact} />
              <Row label="Address" value={p.address} />
              <Row label="City" value={p.city} />
              <Row label="State" value={p.state} />
              <Row label="Pincode" value={p.pincode} />
            </tbody>
          </table>
        </Section>

        <Heading as="h2" style={h2}>Stay</Heading>
        <Section style={card}>
          <table style={table}>
            <tbody>
              <Row label="Check-in" value={p.checkIn} />
              <Row label="Check-out" value={p.checkOut} />
              <Row label="Nights" value={p.nights} />
              <Row label="Guests" value={p.guests} />
              <Row label="Room Type" value={p.roomType} />
              <Row label="Quantity" value={p.quantity} />
            </tbody>
          </table>
        </Section>

        <Heading as="h2" style={h2}>Charges</Heading>
        <Section style={card}>
          <table style={table}>
            <tbody>
              <Row label="Subtotal" value={fmtMoney(p.subtotal)} />
              <Row label="Taxes (GST)" value={fmtMoney(p.taxes)} />
              <Row label="Total" value={fmtMoney(p.totalAmount)} />
            </tbody>
          </table>
        </Section>

        {p.specialRequests ? (
          <>
            <Heading as="h2" style={h2}>Special requests</Heading>
            <Section style={card}>
              <Text style={text}>{p.specialRequests}</Text>
            </Section>
          </>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          {SITE_NAME} · automated booking notification
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: AdminBookingNotificationEmail,
  subject: (d: Record<string, any>) =>
    `🛎️ New Booking ${d.bookingId ? `#${d.bookingId}` : ''} — ${d.guestName || 'Guest'} (${
      typeof d.totalAmount === 'number'
        ? `₹${Number(d.totalAmount).toLocaleString('en-IN')}`
        : d.totalAmount || ''
    })`.trim(),
  displayName: 'Admin: New booking notification',
  to: 'booking@xtsy.one',
  previewData: {
    bookingId: 'XTSY-12345678',
    guestName: 'Aarav Sharma',
    email: 'aarav@example.com',
    phone: '+91 98765 43210',
    checkIn: '2026-05-10',
    checkOut: '2026-05-12',
    nights: 2,
    guests: 2,
    roomType: 'Private Queen Room',
    quantity: 1,
    subtotal: 4200,
    taxes: 504,
    totalAmount: 4704,
    city: 'Shillong',
    state: 'Meghalaya',
    specialRequests: 'Early check-in if possible',
    source: 'Website',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: 0 }
const container = { padding: '24px', maxWidth: '600px', margin: '0 auto' }
const h1 = { fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 6px' }
const h2 = { fontSize: '14px', fontWeight: 600, color: '#0f172a', margin: '20px 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' }
const subtle = { fontSize: '14px', color: '#64748b', margin: '0 0 18px' }
const card = { backgroundColor: '#f8fafc', borderRadius: '10px', padding: '12px 14px', border: '1px solid #e2e8f0' }
const table = { width: '100%', borderCollapse: 'collapse' as const, fontSize: '13px' }
const tdLabel = { color: '#64748b', padding: '6px 10px 6px 0', verticalAlign: 'top' as const, width: '40%' }
const tdValue = { color: '#0f172a', padding: '6px 0', fontWeight: 500 }
const text = { fontSize: '13px', color: '#0f172a', margin: 0, lineHeight: 1.5 }
const hr = { borderColor: '#e2e8f0', margin: '24px 0 12px' }
const footer = { fontSize: '11px', color: '#94a3b8', textAlign: 'center' as const }
