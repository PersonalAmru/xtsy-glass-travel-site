"""Writes an AVIF next to every responsive WebP in public/img/o and public/img/px.

<Photo> serves them through <picture> (AVIF first, WebP fallback) — about a third fewer bytes
for the same picture. Re-run after adding images:  python3 scripts/images/make-avif.py
"""
import os, sys
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

QUALITY = 50

def convert(path):
    out = path[:-5] + '.avif'
    if os.path.exists(out) and os.path.getmtime(out) >= os.path.getmtime(path):
        return 0
    im = Image.open(path)
    im = im.convert('RGBA' if im.mode in ('RGBA', 'LA') else 'RGB')
    im.save(out, 'AVIF', quality=QUALITY, speed=6)
    return 1

files = [os.path.join(d, f) for d in ('public/img/o', 'public/img/px') for f in sorted(os.listdir(d)) if f.endswith('.webp')]
with ThreadPoolExecutor(max_workers=os.cpu_count() or 2) as ex:
    made = sum(ex.map(convert, files))
print(f'{made} AVIF files written ({len(files)} WebP checked)')
