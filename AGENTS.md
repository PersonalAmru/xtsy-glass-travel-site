# Architecture rules

- Resolve booking catalogue labels and calculate GST-inclusive quotes through the shared booking quote utilities; this keeps displayed, persisted and WhatsApp amounts consistent without bypassing server validation.
- Keep shared hostel policies in a browser-safe data module and reuse them in guest information pages; this prevents policy copy from drifting between pages.
- Extend the existing `/faq` page rather than creating a duplicate hostel FAQ URL; public safety rules have their own route and route-owned metadata.
- Load optional consent diagnostics after mount with a locally caught import failure; a missing debug chunk must never reject into the root route and hide guest content.
- Use the shared consent parser and pre-tag Consent Mode bootstrap for analytics permission; this prevents loaders and identifier writers from restoring incompatible or forced-opt-in records.