"""Adds in-between WebP sizes and lists them in the srcset manifests
(src/data/optimizedImages.ts, src/data/pexelsPhotos.ts):
  - 828px next to every 1280px file: full-width images on phones (~720-830 device px)
  - 480px next to every 640px file: cards and thumbnails on phones (~300-480 device px)
Without them phones download far larger files than they display. Re-run after adding images:
    python3 scripts/images/add-mid-width.py
"""
import os, re
from PIL import Image

for SRC, MID in ((1280, 828), (640, 480)):
    made = 0
    for d in ('public/img/o', 'public/img/px'):
        for f in sorted(os.listdir(d)):
            if not f.endswith(f'-{SRC}.webp'):
                continue
            out = os.path.join(d, f.replace(f'-{SRC}.webp', f'-{MID}.webp'))
            if os.path.exists(out):
                continue
            im = Image.open(os.path.join(d, f)).convert('RGB')
            w, h = im.size
            if w <= MID:
                continue
            im.resize((MID, round(h * MID / w)), Image.LANCZOS).save(out, 'WEBP', quality=70, method=6)
            made += 1
    print(f'{MID}px: created', made, 'files')

    pat = re.compile(r'(\[\s*\n(\s*)' + str(SRC) + r',\s*\n\s*"(/img/(?:o|px)/[^"]+)-' + str(SRC) + r'\.webp"\s*\n\s*\])')
    for m_path in ('src/data/optimizedImages.ts', 'src/data/pexelsPhotos.ts'):
        s = open(m_path).read()
        def add(m):
            indent = m.group(2)
            mid = f'{m.group(3)}-{MID}.webp'
            if not os.path.exists('public' + mid) or f'"{mid}"' in s:
                return m.group(1)
            close = indent[:-1] if indent.endswith(' ') else indent
            return f'[\n{indent}{MID},\n{indent}"{mid}"\n{close}],\n{close}' + m.group(1)
        s2 = pat.sub(add, s)
        open(m_path, 'w').write(s2)
        print(' ', m_path, s2.count(f'{MID},'), 'entries with', MID)
