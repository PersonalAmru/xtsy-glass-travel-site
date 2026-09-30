#!/usr/bin/env bash
# Every optimised WebP must have its AVIF twin: <picture> serves the AVIF first and a missing file
# would show as a broken image (no per-file fallback). Run scripts/images/make-avif.py to fix.
missing=0
for f in public/img/o/*.webp public/img/px/*.webp; do
  [ -f "${f%.webp}.avif" ] || { echo "::error::missing AVIF for $f (run python3 scripts/images/make-avif.py)"; missing=$((missing+1)); }
done
echo "AVIF check: $missing missing"
[ "$missing" = 0 ]
