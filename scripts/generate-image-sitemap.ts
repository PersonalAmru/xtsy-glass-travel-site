#!/usr/bin/env tsx
/**
 * Image Sitemap Generator
 *
 * Emits public/sitemap-images.xml using the Google Image sitemap extension so
 * search engines can reliably discover all media — every room, panorama and
 * Dawki campsite image URL — attached to the page that renders it.
 *
 * Run via the `prebuild` hook (see package.json) so it stays in sync with the
 * CDN image map. Safe to run standalone: `tsx scripts/generate-image-sitemap.ts`.
 */
import { writeFileSync } from 'fs';
import { resolve } from 'path';
import { ROOM_IMAGES } from '../src/config/roomTypes';
import { CDN_IMAGE_MAP } from '../src/data/cdnImageMap';

const BASE_URL = 'https://xtsy.one';

const toAbsolute = (url: string): string =>
  /^https?:\/\//.test(url) ? url : `${BASE_URL}${url.startsWith('/') ? '' : '/'}${url}`;

const xmlEscape = (s: string): string =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

interface ImageEntry {
  loc: string;
  caption: string;
}
interface PageEntry {
  path: string;
  images: ImageEntry[];
}

function uniqueImages(entries: ImageEntry[]): ImageEntry[] {
  const seen = new Set<string>();
  return entries.filter((e) => (seen.has(e.loc) ? false : (seen.add(e.loc), true)));
}

// 1) Room + panorama images — rendered on the homepage rooms section.
// NOTE: there is no `/rooms` route in the app, so it must not be listed here.
const roomImages: ImageEntry[] = Object.entries(ROOM_IMAGES).flatMap(([roomId, urls]) =>
  urls
    .filter((u) => u && u !== '/placeholder.svg')
    .map((u, i) => ({ loc: toAbsolute(u), caption: `${roomId} — image ${i + 1}` })),
);

// 2) Dawki campsite images — rendered on the campsite property page.
const dawkiImages: ImageEntry[] = Object.entries(CDN_IMAGE_MAP)
  .filter(([key, url]) => key.startsWith('xtsy-adventure-campsite/') && url && url !== '/placeholder.svg')
  .map(([key, url]) => ({ loc: toAbsolute(url), caption: key.replace('xtsy-adventure-campsite/', '').replace(/\.[a-z]+$/i, '') }));

const PAGES: PageEntry[] = [
  { path: '/', images: uniqueImages(roomImages) },
  { path: '/xtsy-adventure-campsite-dawki', images: uniqueImages(dawkiImages) },
];

function generate(): string {
  const urls = PAGES.filter((p) => p.images.length > 0)
    .map((p) => {
      const images = p.images
        .map(
          (img) =>
            `    <image:image>\n      <image:loc>${xmlEscape(img.loc)}</image:loc>\n      <image:caption>${xmlEscape(img.caption)}</image:caption>\n    </image:image>`,
        )
        .join('\n');
      return `  <url>\n    <loc>${BASE_URL}${p.path}</loc>\n${images}\n  </url>`;
    })
    .join('\n');

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`,
    urls,
    `</urlset>`,
    '',
  ].join('\n');
}

const out = resolve('public/sitemap-images.xml');
writeFileSync(out, generate());
const totalImages = PAGES.reduce((n, p) => n + p.images.length, 0);
console.log(`sitemap-images.xml written (${PAGES.length} pages, ${totalImages} image refs)`);
