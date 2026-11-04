/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1';
import {
  Body, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22';
import type { TemplateEntry } from './registry.ts';

interface AdminTripPlanReviewProps {
  enquiryId?: string;
  guestName?: string;
  email?: string;
  phone?: string;
  dates?: string;
  travellers?: number | string;
  duration?: string;
  destinations?: string;
  tripTitle?: string;
  itinerary?: string;
  status?: string;
  submittedAt?: string;
}

const value = (v: unknown) => v === undefined || v === null || v === '' ? '—' : String(v);

const AdminTripPlanReviewEmail = (p: AdminTripPlanReviewProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>XTSY AI trip plan needs review — {value(p.enquiryId)}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>XTSY AI trip plan — verification required</Heading>
        <Text style={subtle}>
          A traveller has submitted an AI-generated itinerary. Please verify the route, local Operator coverage,
          stays, guides, transport, permit requirements, pricing and operational feasibility before confirming.
        </Text>

        <Section style={card}>
          <Heading as="h2" style={h2}>Enquiry</Heading>
          <Text style={line}>Reference: <strong>{value(p.enquiryId)}</strong></Text>
          <Text style={line}>Submitted: {value(p.submittedAt)}</Text>
          <Text style={line}>Status: {value(p.status)}</Text>
          <Text style={line}>Trip: {value(p.tripTitle)}</Text>
          <Text style={line}>Duration: {value(p.duration)}</Text>
          <Text style={line}>Travel dates: {value(p.dates)}</Text>
          <Text style={line}>Travellers: {value(p.travellers)}</Text>
          <Text style={line}>Destinations: {value(p.destinations)}</Text>
        </Section>

        <Heading as="h2" style={h2}>Traveller</Heading>
        <Section style={card}>
          <Text style={line}>Name: {value(p.guestName)}</Text>
          <Text style={line}>Email: {value(p.email)}</Text>
          <Text style={line}>WhatsApp: {value(p.phone)}</Text>
        </Section>

        <Heading as="h2" style={h2}>Itinerary and Operator coverage notes</Heading>
        <Section style={card}>
          <Text style={itinerary}>{value(p.itinerary)}</Text>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Action required: contact the traveller only after the Booking Desk has verified the plan and confirmed the services.
        </Text>
      </Container>
    </Body>
  </Html>
);

export const template = {
  component: AdminTripPlanReviewEmail,
  subject: (d: Record<string, any>) =>
    `XTSY AI plan verification — ${d.enquiryId || 'New trip'} — ${d.guestName || 'Guest'}`,
  displayName: 'Admin: XTSY AI trip plan verification',
  to: 'booking@xtsy.one',
  requiresPrivileged: true,
  previewData: {
    enquiryId: 'XTSY-T-DEMO',
    guestName: 'Guest name',
    email: 'guest@example.com',
    phone: '+91 00000 00000',
    dates: 'Flexible',
    travellers: 2,
    duration: '5 days',
    destinations: 'Shillong, Sohra, Dawki',
    tripTitle: 'Custom XTSY AI trip plan',
    itinerary: 'Day-by-day itinerary and Operator coverage notes',
    status: 'pending',
    submittedAt: '2026-11-04',
  },
} satisfies TemplateEntry;

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: 0 };
const container = { padding: '24px', maxWidth: '680px', margin: '0 auto' };
const h1 = { fontSize: '22px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px' };
const h2 = { fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: '20px 0 8px', textTransform: 'uppercase' as const, letterSpacing: '0.05em' };
const subtle = { fontSize: '14px', lineHeight: 1.5, color: '#475569', margin: '0 0 18px' };
const card = { backgroundColor: '#f8fafc', borderRadius: '10px', padding: '14px 16px', border: '1px solid #e2e8f0' };
const line = { fontSize: '13px', lineHeight: 1.55, color: '#0f172a', margin: '3px 0' };
const itinerary = { fontSize: '13px', lineHeight: 1.6, color: '#0f172a', whiteSpace: 'pre-wrap' as const, margin: 0 };
const hr = { borderColor: '#e2e8f0', margin: '24px 0 12px' };
const footer = { fontSize: '12px', lineHeight: 1.5, color: '#64748b', textAlign: 'center' as const };
