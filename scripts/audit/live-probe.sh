#!/usr/bin/env bash
# Live server probe: for each URL, 3 back-to-back requests. Records status, time to first byte,
# total time, size and the caching-related response headers — shows whether pages are cached
# at the edge (repeat requests fast) and what the host sends.
set -uo pipefail
BASE="${BASE_URL:-https://xtsy.one}"
OUT="${OUT_DIR:-probe}"
mkdir -p "$OUT"
URLS="${PROBE_URLS:-/ /best-hostel-in-shillong /xtsy-270 /tours /tours/5n-6d-tawang-tour /living-root-bridges-meghalaya /faq /book /guides /destinations/meghalaya/shillong}"
ASSETS="$(curl -s "$BASE/" | grep -oE '/assets/[^"]+\.(css|js)' | head -2) /img/o/xtsy-property-images-8-portrait-828.webp /fonts/manrope-latin.woff2"
: > "$OUT/probe.tsv"
echo -e "url\ttry\tstatus\tttfb_s\ttotal_s\tbytes\tcache-control\tcf-cache-status\tage\tserver\tx-xtsy-cache\tlink" >> "$OUT/probe.tsv"
for u in $URLS $ASSETS; do
  for t in 1 2 3; do
    h=$(mktemp)
    m=$(curl -s -o /dev/null -D "$h" -H 'User-Agent: Mozilla/5.0 (Linux; Android 11) xtsy-live-probe' -H 'Accept-Encoding: br, gzip' -w '%{http_code}\t%{time_starttransfer}\t%{time_total}\t%{size_download}' "$BASE$u")
    g() { grep -i "^$1:" "$h" | head -1 | cut -d' ' -f2- | tr -d '\r' | cut -c1-120; }
    echo -e "$u\t$t\t$m\t$(g cache-control)\t$(g cf-cache-status)\t$(g age)\t$(g server)\t$(g x-xtsy-cache)\t$(g link)" >> "$OUT/probe.tsv"
    [ "$u" = "/" ] && [ "$t" = 1 ] && cp "$h" "$OUT/home-headers.txt"
    rm -f "$h"
  done
done
column -t -s $'\t' "$OUT/probe.tsv" | cut -c1-260
