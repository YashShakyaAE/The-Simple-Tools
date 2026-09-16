// Prerender crawlable per-tool pages + sitemap for TheSimpleTools.
// Runs after `vite build` (see package.json) and emits:
//   dist/tools/<slug>/index.html   — static SEO page per tool
//   dist/sitemap.xml + public/sitemap.xml — homepage + all tool URLs
// Tool pages are self-contained (inline CSS, zero JS dependency) and link
// into the app via /#tool-<id>, which auto-opens the workspace on load.

import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SITE_ORIGIN, TOOLS_SEO } from './tools-seo.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const today = new Date().toISOString().slice(0, 10);

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function toolPage(t) {
  const url = `${SITE_ORIGIN}/tools/${t.slug}/`;
  const launchUrl = `${SITE_ORIGIN}/#tool-${t.id}`;
  const faqJson = t.faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  }));
  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: `TheSimpleTools — ${t.h1}`,
        url,
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0' },
        description: t.metaDescription,
      },
      { '@type': 'FAQPage', mainEntity: faqJson },
    ],
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(t.pageTitle)} | TheSimpleTools</title>
<meta name="description" content="${esc(t.metaDescription)}" />
<meta name="robots" content="index, follow" />
<link rel="canonical" href="${url}" />
<meta property="og:type" content="website" />
<meta property="og:site_name" content="TheSimpleTools" />
<meta property="og:url" content="${url}" />
<meta property="og:title" content="${esc(t.pageTitle)} | TheSimpleTools" />
<meta property="og:description" content="${esc(t.metaDescription)}" />
<meta name="theme-color" content="#0D0D12" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Red+Hat+Mono:wght@400;500;700&family=Schibsted+Grotesk:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
<link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%23FB7185'/><stop offset='55%25' stop-color='%23E879A8'/><stop offset='100%25' stop-color='%23C084FC'/></linearGradient></defs><rect width='64' height='64' rx='15' fill='url(%23g)'/><text x='32' y='44' text-anchor='middle' font-family='Arial,sans-serif' font-weight='900' font-size='27' fill='white' letter-spacing='-1'>ST</text></svg>" />
<script type="application/ld+json">${JSON.stringify(schema)}</script>
<style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Schibsted Grotesk',system-ui,sans-serif;background:#0D0D12;color:#fff;line-height:1.65;min-height:100vh}
.wrap{max-width:820px;margin:0 auto;padding:0 1.25rem}
.topbar{display:flex;align-items:center;justify-content:space-between;padding:1.1rem 0;border-bottom:1px solid rgba(192,132,252,.18)}
.brand{display:flex;align-items:center;gap:.65rem;font-weight:800;font-size:1.1rem;color:#fff;text-decoration:none}
.tile{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,#FB7185 0%,#E879A8 48%,#C084FC 100%);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:.8rem;box-shadow:0 2px 14px rgba(251,113,133,.35)}
.grad{background:linear-gradient(120deg,#FDA4AF 0%,#F0ABFC 60%,#D8B4FE 100%);-webkit-background-clip:text;background-clip:text;color:transparent}
.crumbs{font-size:.82rem;color:#94A3B8;margin:1.5rem 0 .5rem}
.crumbs a{color:#C084FC;text-decoration:none}
h1{font-size:clamp(1.9rem,5vw,2.8rem);line-height:1.2;letter-spacing:-.02em;margin:.25rem 0 .75rem}
.tag{font-size:1.1rem;color:#E2E8F0;margin-bottom:1rem}
.prose{color:#c3cad6}
.prose p{margin-bottom:1rem}
.chips{display:flex;flex-wrap:wrap;gap:.45rem;margin:1.1rem 0 1.75rem;list-style:none}
.chips li{font-family:'Red Hat Mono',monospace;font-size:.75rem;padding:.25rem .6rem;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);border-radius:8px;color:#94A3B8}
.cta-row{display:flex;gap:.75rem;flex-wrap:wrap;margin:1.5rem 0 2.5rem}
.btn{display:inline-flex;align-items:center;gap:.5rem;font-weight:700;font-size:.95rem;padding:.8rem 1.5rem;border-radius:9999px;text-decoration:none}
.btn-hot{background:linear-gradient(135deg,#FB7185,#C084FC);color:#fff}
.btn-ghost{border:1px solid rgba(255,255,255,.15);color:#fff}
h2.sec{font-size:1.35rem;margin:2.25rem 0 1rem}
ol.steps{padding-left:1.3rem;display:flex;flex-direction:column;gap:.6rem;color:#c3cad6}
.faq{border-top:1px solid rgba(255,255,255,.08)}
.faq div{padding:1rem 0;border-bottom:1px solid rgba(255,255,255,.08)}
.faq h3{font-size:1rem;margin-bottom:.35rem}
.faq p{color:#94A3B8;font-size:.95rem}
footer{margin:3.5rem 0 0;padding:2rem 0;border-top:1px solid rgba(192,132,252,.18);color:#64748B;font-size:.85rem;text-align:center}
footer a{color:#C084FC;text-decoration:none}
@media(max-width:640px){.topbar{padding:.9rem 0}h1{line-height:1.25}}
</style>
</head>
<body>
<div class="wrap">
<header class="topbar">
<a class="brand" href="${SITE_ORIGIN}/"><span class="tile">ST</span><span>TheSimple<span class="grad">Tools</span></span></a>
<a class="btn btn-ghost" style="padding:.5rem 1.1rem;font-size:.85rem" href="${SITE_ORIGIN}/#converter-suite">All 12 tools</a>
</header>
<main>
<nav class="crumbs" aria-label="Breadcrumb"><a href="${SITE_ORIGIN}/">Home</a> &rsaquo; <a href="${SITE_ORIGIN}/#converter-suite">Tools</a> &rsaquo; ${esc(t.h1)}</nav>
<h1>${esc(t.h1)}</h1>
<p class="tag">${esc(t.tagline)}</p>
<div class="cta-row">
<a class="btn btn-hot" href="${esc(launchUrl)}">Launch this tool — free</a>
<a class="btn btn-ghost" href="${SITE_ORIGIN}/#converter-suite">Browse all tools</a>
</div>
<div class="prose"><p>${esc(t.intro)}</p></div>
<ul class="chips">${t.formats.map((f) => `<li>${esc(f)}</li>`).join('')}</ul>
<h2 class="sec">How to use it</h2>
<ol class="steps">${t.steps.map((s) => `<li>${esc(s)}</li>`).join('')}</ol>
<h2 class="sec">Frequently asked questions</h2>
<div class="faq">${t.faqs.map((f) => `<div><h3>${esc(f.q)}</h3><p>${esc(f.a)}</p></div>`).join('')}</div>
<div class="cta-row">
<a class="btn btn-hot" href="${esc(launchUrl)}">Open ${esc(t.h1)} now</a>
</div>
</main>
<footer>Powered by <strong>TheSimpleTools</strong> &middot; 100% private in-browser processing &middot; <a href="${SITE_ORIGIN}/">Home</a></footer>
</div>
</body>
</html>`;
}

let pages = 0;
for (const t of TOOLS_SEO) {
  const dir = join(dist, 'tools', t.slug);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), toolPage(t));
  pages++;
}

const urls = [
  { loc: `${SITE_ORIGIN}/`, priority: '1.0', changefreq: 'weekly' },
  ...TOOLS_SEO.map((t) => ({
    loc: `${SITE_ORIGIN}/tools/${t.slug}/`,
    priority: '0.9',
    changefreq: 'monthly',
  })),
];
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`;
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
writeFileSync(join(root, 'public', 'sitemap.xml'), sitemap);

console.log(`prerender-tools: wrote ${pages} tool pages + sitemap (${urls.length} URLs)`);
