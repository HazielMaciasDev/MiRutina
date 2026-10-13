// Generates PWA icons (PNG) for the Routine app.
// Visual: warm paper background, a serif "R" in deep ink with a small
// mandarina accent dot — quietly editorial, no rainbow anywhere.
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');
fs.mkdirSync(OUT, { recursive: true });

function makeSvg(size) {
  const r = size * 0.22;
  const dotR = size * 0.05;
  const dotX = size * 0.72;
  const dotY = size * 0.30;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <clipPath id="round">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${r}" ry="${r}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#round)">
    <rect width="${size}" height="${size}" fill="#faf7f2"/>
    <!-- tiny mandarina accent dot (the "today" mark) -->
    <circle cx="${dotX}" cy="${dotY}" r="${dotR}" fill="#e85a1a"/>
    <!-- R in deep ink, serif, optical-aligned -->
    <text x="${size * 0.50}" y="${size * 0.78}"
          text-anchor="middle"
          font-family="Newsreader, Source Serif 4, Georgia, serif"
          font-weight="500"
          font-size="${size * 0.86}"
          fill="#1a1310"
          letter-spacing="-${size * 0.035}">R</text>
  </g>
</svg>`;
}

async function build() {
  for (const size of [192, 512]) {
    const svg = makeSvg(size);
    const out = path.join(OUT, `icon-${size}.png`);
    await sharp(Buffer.from(svg)).png().toFile(out);
    console.log('wrote', out);
  }
}

build().catch(e => { console.error(e); process.exit(1); });