// Generates PWA icons (PNG) for the Routine app.
// Visual: white rounded square background with a soft conic-gradient ring
// and a Plus Jakarta-style "R" wordmark in violet (#6647f0).
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, '..', 'assets');
fs.mkdirSync(OUT, { recursive: true });

// SVG for 512 master — conic gradient via SVG <foreignObject> + CSS isn't trivial.
// Use linear gradient on ring + bold "R" mark.
function makeSvg(size) {
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size * 0.46;
  const rInner = size * 0.40;
  const stroke = size * 0.025;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#40ddff"/>
      <stop offset="50%" stop-color="#7612fa"/>
      <stop offset="100%" stop-color="#fa18e3"/>
    </linearGradient>
    <linearGradient id="text" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#40ddff"/>
      <stop offset="50%" stop-color="#7612fa"/>
      <stop offset="100%" stop-color="#fa18e3"/>
    </linearGradient>
    <clipPath id="round">
      <rect x="0" y="0" width="${size}" height="${size}" rx="${size * 0.22}" ry="${size * 0.22}"/>
    </clipPath>
  </defs>
  <g clip-path="url(#round)">
    <rect width="${size}" height="${size}" fill="#ffffff"/>
    <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="none" stroke="url(#ring)" stroke-width="${stroke}"/>
    <text x="${cx}" y="${cy + size * 0.16}"
          text-anchor="middle"
          font-family="Plus Jakarta Sans, Inter, system-ui, sans-serif"
          font-weight="800"
          font-size="${size * 0.66}"
          fill="url(#text)"
          letter-spacing="-${size * 0.02}">R</text>
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