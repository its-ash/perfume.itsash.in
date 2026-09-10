import { PERFUMES } from '~/data/perfumes';

const SITE_URL = 'https://perfume.itsash.in';

export default defineEventHandler((event) => {
  const urls = [
    { loc: `${SITE_URL}/`, priority: '1.0' },
    ...PERFUMES.map(p => ({ loc: `${SITE_URL}/perfume/${p.id}`, priority: '0.7' }))
  ];

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>\n    <loc>${u.loc}</loc>\n    <priority>${u.priority}</priority>\n  </url>`).join('\n')}
</urlset>`;

  setHeader(event, 'content-type', 'application/xml');
  return body;
});
