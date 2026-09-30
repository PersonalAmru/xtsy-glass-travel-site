#!/usr/bin/env bash
# Page-cache check against a running production build (CI). Fails the step on any problem.
set -uo pipefail
BASE="${BASE_URL:-http://localhost:4174}"
fail=0
hdr() { curl -s -D - -o /dev/null "$BASE$1" | tr -d '\r' | grep -i "^$2:" | head -1 | cut -d' ' -f2-; }
body() { curl -s "$BASE$1" | sha1sum | cut -c1-12; }
for p in / /best-hostel-in-shillong /tours/5n-6d-tawang-tour /living-root-bridges-meghalaya /guides; do
  a=$(hdr "$p" x-xtsy-cache); b=$(hdr "$p" x-xtsy-cache); h1=$(body "$p"); h2=$(body "$p")
  echo "$p first=$a second=$b body=$h1/$h2"
  [ "$b" = "HIT" ] || { echo "::error::$p second request was not a cache HIT ($b)"; fail=1; }
  [ "$h1" = "$h2" ] || { echo "::error::$p cached body differs"; fail=1; }
done
for p in "/book" "/book?checkIn=2030-01-01&checkOut=2030-01-02"; do
  c=$(hdr "$p" x-xtsy-cache); echo "$p cache=${c:-none}"
  [ -z "$c" ] || { echo "::error::$p must not be cached ($c)"; fail=1; }
done
s1=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/this-page-does-not-exist"); s2=$(curl -s -o /dev/null -w '%{http_code}' "$BASE/this-page-does-not-exist"); c=$(hdr /this-page-does-not-exist x-xtsy-cache)
echo "404 page: $s1 $s2 cache=${c:-none}"
[ "$s2" = "404" ] && [ -z "$c" ] || { echo "::error::404 page cached or wrong status"; fail=1; }
t=$(curl -s -o /dev/null -w '%{time_starttransfer}' "$BASE/")
echo "::notice::Page cache check: $([ $fail = 0 ] && echo passed || echo FAILED); cached home TTFB ${t}s"
exit $fail
