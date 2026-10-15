import fs from 'fs';
import path from 'path';
import sharp from 'sharp';

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. Standard SVG Icon (512x512)
const standardSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#0c0a09" />
    </radialGradient>
    <radialGradient id="globeGrad" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="60%" stop-color="#047857" />
      <stop offset="100%" stop-color="#065f46" />
    </radialGradient>
    <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="50%" stop-color="#10b981" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.5" />
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="108" fill="url(#bgGrad)" />

  <!-- Outer subtle border -->
  <rect x="8" y="8" width="496" height="496" rx="100" fill="none" stroke="#292524" stroke-width="3" />

  <!-- Outer orbital ring -->
  <circle cx="256" cy="256" r="190" fill="none" stroke="url(#ringGrad)" stroke-width="3" stroke-dasharray="16 8" opacity="0.6" />

  <!-- Globe Body with Shadow -->
  <circle cx="256" cy="256" r="150" fill="url(#globeGrad)" filter="url(#shadow)" stroke="#34d399" stroke-width="4" />

  <!-- Meridians and Parallels -->
  <!-- Equator -->
  <ellipse cx="256" cy="256" rx="150" ry="24" fill="none" stroke="#6ee7b7" stroke-width="2.5" opacity="0.45" />
  <!-- Tropic north -->
  <ellipse cx="256" cy="196" rx="137" ry="18" fill="none" stroke="#6ee7b7" stroke-width="2" opacity="0.35" />
  <!-- Tropic south -->
  <ellipse cx="256" cy="316" rx="137" ry="18" fill="none" stroke="#6ee7b7" stroke-width="2" opacity="0.35" />
  <!-- Prime meridian -->
  <ellipse cx="256" cy="256" rx="42" ry="150" fill="none" stroke="#6ee7b7" stroke-width="2.5" opacity="0.45" />
  <!-- Curved meridian west -->
  <ellipse cx="256" cy="256" rx="95" ry="150" fill="none" stroke="#6ee7b7" stroke-width="2" opacity="0.35" />
  <!-- Central vertical line -->
  <line x1="256" y1="106" x2="256" y2="406" stroke="#a7f3d0" stroke-width="2.5" opacity="0.6" />

  <!-- Continent-like geographic silhouettes on globe -->
  <path d="M 210,165 Q 235,150 250,175 Q 260,195 240,215 Q 220,230 205,210 Q 195,185 210,165 Z" fill="#a7f3d0" opacity="0.85" />
  <path d="M 270,225 Q 310,210 325,245 Q 330,285 295,300 Q 275,270 270,225 Z" fill="#a7f3d0" opacity="0.8" />
  <path d="M 185,270 Q 200,260 215,280 Q 210,320 180,315 Q 170,290 185,270 Z" fill="#a7f3d0" opacity="0.75" />
  <path d="M 320,160 Q 345,155 355,175 Q 345,195 325,185 Z" fill="#a7f3d0" opacity="0.75" />

  <!-- Center Location Pin Beacon -->
  <g transform="translate(256, 215)">
    <!-- Pulse ring -->
    <circle cx="0" cy="0" r="16" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.8" />
    <circle cx="0" cy="0" r="8" fill="#f59e0b" stroke="#ffffff" stroke-width="2" />
  </g>

  <!-- Brand Typography "GEOMUNDO" at bottom -->
  <text x="256" y="460" font-family="'Plus Jakarta Sans', system-ui, -apple-system, sans-serif" font-size="28" font-weight="700" fill="#f5f5f4" text-anchor="middle" letter-spacing="4">GEOMUNDO</text>
</svg>`;

// 2. Maskable SVG Icon (512x512) - Extra safe-zone padding (content in center 80% circle)
const maskableSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="maskBg" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#1c1917" />
      <stop offset="100%" stop-color="#0c0a09" />
    </radialGradient>
    <radialGradient id="maskGlobe" cx="35%" cy="35%" r="65%">
      <stop offset="0%" stop-color="#064e3b" />
      <stop offset="60%" stop-color="#047857" />
      <stop offset="100%" stop-color="#065f46" />
    </radialGradient>
    <linearGradient id="maskRing" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#34d399" />
      <stop offset="100%" stop-color="#059669" />
    </linearGradient>
  </defs>

  <!-- Full-bleed background -->
  <rect width="512" height="512" fill="url(#maskBg)" />

  <!-- Center Content strictly within 80% safe zone (radius <= 200px from 256,256) -->
  <!-- Outer orbital ring -->
  <circle cx="256" cy="256" r="165" fill="none" stroke="url(#maskRing)" stroke-width="2.5" stroke-dasharray="12 6" opacity="0.5" />

  <!-- Globe Body -->
  <circle cx="256" cy="256" r="130" fill="url(#maskGlobe)" stroke="#34d399" stroke-width="3.5" />

  <!-- Meridians -->
  <ellipse cx="256" cy="256" rx="130" ry="20" fill="none" stroke="#6ee7b7" stroke-width="2" opacity="0.45" />
  <ellipse cx="256" cy="205" rx="118" ry="15" fill="none" stroke="#6ee7b7" stroke-width="1.8" opacity="0.35" />
  <ellipse cx="256" cy="307" rx="118" ry="15" fill="none" stroke="#6ee7b7" stroke-width="1.8" opacity="0.35" />
  <ellipse cx="256" cy="256" rx="36" ry="130" fill="none" stroke="#6ee7b7" stroke-width="2" opacity="0.45" />
  <ellipse cx="256" cy="256" rx="82" ry="130" fill="none" stroke="#6ee7b7" stroke-width="1.8" opacity="0.35" />
  <line x1="256" y1="126" x2="256" y2="386" stroke="#a7f3d0" stroke-width="2" opacity="0.6" />

  <!-- Land silhouettes -->
  <path d="M 215,178 Q 238,165 250,186 Q 258,204 242,221 Q 224,234 212,217 Q 202,195 215,178 Z" fill="#a7f3d0" opacity="0.85" />
  <path d="M 268,230 Q 302,216 315,246 Q 320,281 290,294 Q 272,268 268,230 Z" fill="#a7f3d0" opacity="0.8" />
  <path d="M 195,268 Q 208,260 220,277 Q 216,312 190,307 Q 182,286 195,268 Z" fill="#a7f3d0" opacity="0.75" />

  <!-- Beacon -->
  <circle cx="256" cy="221" r="14" fill="none" stroke="#fbbf24" stroke-width="2" opacity="0.8" />
  <circle cx="256" cy="221" r="7" fill="#f59e0b" stroke="#ffffff" stroke-width="1.5" />
</svg>`;

async function buildIcons() {
  console.log('Writing public/icon.svg...');
  fs.writeFileSync(path.join(publicDir, 'icon.svg'), standardSvg);

  console.log('Generating PNG icons via Sharp...');

  // 192x192 standard icon
  await sharp(Buffer.from(standardSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));

  // 512x512 standard icon
  await sharp(Buffer.from(standardSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));

  // 512x512 maskable icon
  await sharp(Buffer.from(maskableSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));

  // 180x180 Apple Touch Icon (PNG)
  await sharp(Buffer.from(standardSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));

  // 48x48 Favicon PNG
  await sharp(Buffer.from(standardSvg))
    .resize(48, 48)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));

  console.log('All icons generated successfully in /public!');
}

buildIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
