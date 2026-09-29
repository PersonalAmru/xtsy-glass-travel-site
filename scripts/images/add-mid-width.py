"""Adds an 828px WebP next to every 1280px WebP (public/img/o, public/img/px) and lists it in the
srcset manifests (src/data/optimizedImages.ts, src/data/pexelsPhotos.ts).

Phones (~720-830 device px wide) otherwise download the 1280px file. Re-run after adding images:
    python3 scripts/images/add-mid-width.py
"""
import os, re
from PIL import Image

MID = 828
made = 0
for d in ('public/img/o', 'public/img/px'):
    for f in sorted(os.listdir(d)):
        if not f.endswith('-1280.webp'):
            continue
        out = os.path.join(d, f.replace('-1280.webp', f'-{MID}.webp'))
        if os.path.exists(out):
            continue
        im = Image.open(os.path.join(d, f)).convert('RGB')
        w, h = im.size
        if w <= MID:
            continue
        im.resize((MID, round(h * MID / w)), Image.LANCZOS).save(out, 'WEBP', quality=70, method=6)
        made += 1
print('created', made, 'files')

pat = re.compile(r'(\[\s*\n(\s*)1280,\s*\n\s*"(/img/(?:o|px)/[^"]+)-1280\.webp"\s*\n\s*\])')
for m_path in ('src/data/optimizedImages.ts', 'src/data/pexelsPhotos.ts'):
    s = open(m_path).read()
    def add(m):
        indent = m.group(2)
        base = m.group(3)
        mid = f'{base}-{MID}.webp'
        if not os.path.exists('public' + mid) or f'"{mid}"' in s:
            return m.group(1)
        close = indent[:-1] if indent.endswith(' ') else indent
        return f'[\n{indent}{MID},\n{indent}"{mid}"\n{close}],\n{close}' + m.group(1)
    s2 = pat.sub(add, s)
    open(m_path, 'w').write(s2)
    print(m_path, s2.count(f'{MID},') , 'entries with', MID)
