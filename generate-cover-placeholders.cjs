#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapeo de portadas con información del post
const COVERS_INFO = {
  'rust-wasm-cover.webp': {
    title: 'Rust-WASM',
    post: 'Improving Node.js with Rust-Wasm Library',
    color: '#FF6B35'
  },
  'static-web-cover.webp': {
    title: 'Static Web',
    post: 'Static Web Page with CI/CD and IAC',
    color: '#004E89'
  },
  'aoc-day-1-cover.png': {
    title: 'AoC Day 1',
    post: 'Advent of Code 2015 Day 1',
    color: '#2D3142'
  },
  'aoc-day-2-cover.png': {
    title: 'AoC Day 2',
    post: 'Advent of Code 2015 Day 2',
    color: '#2D3142'
  },
  'aoc-day-3-cover.png': {
    title: 'AoC Day 3',
    post: 'Advent of Code 2015 Day 3',
    color: '#2D3142'
  },
  'aoc-day-4-cover.png': {
    title: 'AoC Day 4',
    post: 'Advent of Code 2015 Day 4',
    color: '#2D3142'
  },
  'aoc-day-5-cover.png': {
    title: 'AoC Day 5',
    post: 'Advent of Code 2015 Day 5',
    color: '#2D3142'
  },
  'aoc-day-6-cover.png': {
    title: 'AoC Day 6',
    post: 'Advent of Code 2015 Day 6',
    color: '#2D3142'
  },
  'aoc-day-7-cover.png': {
    title: 'AoC Day 7',
    post: 'Advent of Code 2015 Day 7',
    color: '#2D3142'
  },
  'aoc-day-8-cover.jpeg': {
    title: 'AoC Day 8',
    post: 'Advent of Code 2015 Day 8',
    color: '#2D3142'
  },
};

const COVERS_DIR = path.join(__dirname, 'public', 'images', 'covers');

// Crear directorio si no existe
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}

// Generar SVG placeholder para cada portada
function generateSVGPlaceholder(title, post, color) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="600" viewBox="0 0 1200 600" xmlns="http://www.w3.org/2000/svg">
  <!-- Background gradient -->
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${color};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a1a;stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="600" fill="url(#grad)"/>

  <!-- Decorative elements -->
  <circle cx="100" cy="100" r="80" fill="${color}" opacity="0.1"/>
  <circle cx="1100" cy="500" r="120" fill="#ffffff" opacity="0.05"/>

  <!-- Main text -->
  <text x="600" y="250" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">
    ${title}
  </text>

  <!-- Subtitle -->
  <text x="600" y="350" font-family="Arial, sans-serif" font-size="28" fill="#e0e0e0" text-anchor="middle" dominant-baseline="middle">
    ${post}
  </text>

  <!-- Bottom accent line -->
  <line x1="200" y1="450" x2="1000" y2="450" stroke="#ffffff" stroke-width="3" opacity="0.3"/>
</svg>`;
}

// Crear portadas placeholder en SVG
console.log('🎨 Generando portadas placeholder optimizadas...\n');

let created = 0;

for (const [filename, info] of Object.entries(COVERS_INFO)) {
  try {
    const filepath = path.join(COVERS_DIR, filename.replace(/\.(webp|jpeg|png)$/, '.svg'));
    const svgContent = generateSVGPlaceholder(info.title, info.post, info.color);

    fs.writeFileSync(filepath, svgContent, 'utf8');
    console.log(`✅ Creado: ${filename.replace(/\.(webp|jpeg|png)$/, '.svg')}`);
    console.log(`   Dimensiones: 1200x600px (óptimo para feature images)`);
    created++;
  } catch (error) {
    console.error(`❌ Error creando ${filename}: ${error.message}`);
  }
}

console.log(`\n✅ ${created} portadas placeholder creadas.\n`);

// Guardar cover mapping actualizado
const coverMapping = {};
for (const [filename] of Object.entries(COVERS_INFO)) {
  // Guardar mapeo de extensiones originales a SVG
  const svgFilename = filename.replace(/\.(webp|jpeg|png)$/, '.svg');
  coverMapping[filename] = svgFilename;
}

fs.writeFileSync(
  path.join(__dirname, 'cover-mapping.json'),
  JSON.stringify(COVERS_INFO, null, 2)
);

console.log('📝 Notas importantes:');
console.log('1. Las portadas se han generado como SVG (escalables y muy ligeros)');
console.log('2. Tamaño óptimo: 1200x600px para carga rápida');
console.log('3. Cuando tengas acceso a CDN, ejecuta: node download-and-optimize-covers.cjs');
console.log('4. Las referencias ya pueden apuntarse a las portadas locales');
console.log('\n📊 Información de portadas:');
console.log(`Total de portadas: ${created}`);
console.log(`Ubicación: ${COVERS_DIR}`);
