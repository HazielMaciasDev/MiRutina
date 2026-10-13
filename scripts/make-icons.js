// Generates PWA icons (PNG) for the Routine app.
// Visual: warm paper background (#faf7f2), Newsreader "R" wordmark with a
// warm conic gradient (mandarina → indigo → sage).
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');
fs.mkdirSync(OUT, { recursive: true });

function makeSvg(size) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="text" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#e85a1a"/>
      <stop offset="50%" stop-color="#3a4a6b"/>
      <stop offset="100%" stop-color="#6b8e6f"/>
    </linearGradient>
    <clipPath id="round">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${size * 0.22}" ry="${size * 0.22}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#round)">
    <rect width="${size}" height="${size}" fill="#faf7f2"/>
    <text x="${size / 2}" y="${size * 0.72}"
          text-anchor="middle"
          font-family="Newsreader, Source Serif 4, Georgia, serif"
          font-weight="500"
          font-size="${size * 0.78}"
          fill="url(#text)"
          letter-spacing="-${size * 0.025}">R</text>
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