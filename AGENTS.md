# Architecture rules

- Resolve booking catalogue labels and calculate GST-inclusive quotes through the shared booking quote utilities; this keeps displayed, persisted and WhatsApp amounts consistent without bypassing server validation.
- Keep shared hostel policies in a browser-safe data module and reuse them in guest information pages; this prevents policy copy from drifting between pages.
- Extend the existing `/faq` page rather than creating a duplicate hostel FAQ URL; public safety rules have their own route and route-owned metadata.
- Load optional consent diagnostics after mount with a locally caught import failure; a missing debug chunk must never reject into the root route and hide guest content.
- Use the shared consent parser and pre-tag Consent Mode bootstrap for analytics permission; this prevents loaders and identifier writers from restoring incompatible or forced-opt-in records.
- Store table, campsite and contact requests through the shared enquiry function with a distinguishing type instead of adding a parallel reservations table or route; this keeps one pending queue for the desk and preserves its server-side validation and throttling.
- Store Bistro lunch preorders in the existing table-request enquiry category, distinguishing lunch in the request name and details; requested lunch times never extend the restaurant's table service windows.
- Keep SECURITY DEFINER functions that call `auth.*` owned by a role with USAGE on the `auth` schema; ownership repairs must retain caller-bound admin checks, backend-only OTP execution and narrowly scoped write grants, because the migration role cannot access auth and an ownership handover must not expose privileged operations.