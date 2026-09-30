"""Writes an AVIF next to every responsive WebP in public/img/o and public/img/px.

<Photo> serves them through <picture> (AVIF first, WebP fallback) — about a third fewer bytes
for the same picture. Re-run after adding images:  python3 scripts/images/make-avif.py
"""
import os, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

# q38 at speed 5 is visually indistinguishable from q50 on our photos and ~40% smaller
# (checked side by side on the home hero and tour heroes). --force re-encodes existing files,
# keeping the new one only when it is smaller.
QUALITY = 38
SPEED = 5
FORCE = '--force' in sys.argv

def convert(path):
    out = path[:-5] + '.avif'
    exists = os.path.exists(out)
    if exists and not FORCE and os.path.getmtime(out) >= os.path.getmtime(path):
        return 0
    im = Image.open(path)
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA') else 'RGB')
    tmp = out + '.tmp'
    im.save(tmp, 'AVIF', quality=QUALITY, speed=SPEED)
    if exists and os.path.getsize(tmp) >= os.path.getsize(out):
        os.remove(tmp)
        return 0
    os.replace(tmp, out)
    return 1

files = [os.path.join(d, f) for d in ('public/img/o', 'public/img/px') for f in sorted(os.listdir(d)) if f.endswith('.webp')]
with ThreadPoolExecutor(max_workers=os.cpu_count() or 2) as ex:
    made = sum(ex.map(convert, files))
print(f'{made} AVIF files written ({len(files)} WebP checked)')
