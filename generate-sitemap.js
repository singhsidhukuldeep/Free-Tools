import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const baseUrl = 'https://singhsidhukuldeep.github.io/Free-Tools'; // Update with actual URL

const routes = [
  '/',
  '/word-counter',
  '/humanize-text',
  '/paste-to-markdown',
  '/qr-generator',
  '/image-compressor',
  '/bg-remover',
  '/pdf-to-jpg',
  '/image-resizer',
  '/jpg-to-pdf',
  '/merge-pdf',
  '/merge-images',
  '/compress-pdf',
  '/pdf-editor'
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${routes.map(route => `
  <url>
    <loc>${baseUrl}${route}</loc>
    <changefreq>weekly</changefreq>
    <priority>${route === '/' ? '1.0' : '0.8'}</priority>
  </url>
  `).join('')}
</urlset>`;

fs.writeFileSync(path.resolve(__dirname, 'public/sitemap.xml'), sitemap);
console.log('Sitemap generated!');
