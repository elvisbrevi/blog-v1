#!/usr/bin/env node

/**
 * Redimensiona todas las cover images del blog a 1200×686px usando sharp.
 * Uso: node resize-covers.cjs
 *
 * Requiere sharp: npm install --prefix /tmp/imgtools sharp
 */

const fs = require('fs');
const path = require('path');

let sharp;
try {
  sharp = require('/tmp/imgtools/node_modules/sharp');
} catch {
  // Intentar desde node_modules local
  sharp = require('sharp');
}

const COVERS_DIR = path.join(__dirname, 'public', 'images', 'covers');
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 686;

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

async function resizeCover(filename) {
  const filePath = path.join(COVERS_DIR, filename);
  const ext = path.extname(filename).toLowerCase();
  const originalSize = fs.statSync(filePath).size;

  const image = sharp(filePath).resize(TARGET_WIDTH, TARGET_HEIGHT, {
    fit: 'cover',
    position: 'center',
  });

  let outputBuffer;
  if (ext === '.png') {
    outputBuffer = await image.png({ compressionLevel: 9, palette: true }).toBuffer();
  } else if (ext === '.jpg' || ext === '.jpeg') {
    outputBuffer = await image.jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  } else if (ext === '.webp') {
    outputBuffer = await image.webp({ quality: 82 }).toBuffer();
  } else {
    outputBuffer = await image.toBuffer();
  }

  fs.writeFileSync(filePath, outputBuffer);

  const newSize = outputBuffer.length;
  const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);
  return { originalSize, newSize, reduction };
}

async function main() {
  const files = fs.readdirSync(COVERS_DIR).filter(f =>
    /\.(png|jpe?g|webp)$/i.test(f)
  );

  console.log(`\n🖼️  Redimensionando ${files.length} covers → ${TARGET_WIDTH}×${TARGET_HEIGHT}px\n`);

  let totalBefore = 0;
  let totalAfter = 0;

  for (const filename of files) {
    process.stdout.write(`   ${filename.padEnd(30)}`);
    try {
      const { originalSize, newSize, reduction } = await resizeCover(filename);
      totalBefore += originalSize;
      totalAfter += newSize;
      console.log(`${formatBytes(originalSize).padStart(9)} → ${formatBytes(newSize).padStart(9)}  (↓${reduction}%) ✅`);
    } catch (err) {
      console.log(`ERROR: ${err.message} ❌`);
    }
  }

  const totalReduction = ((1 - totalAfter / totalBefore) * 100).toFixed(1);
  console.log(`\n   ${'TOTAL'.padEnd(30)}${formatBytes(totalBefore).padStart(9)} → ${formatBytes(totalAfter).padStart(9)}  (↓${totalReduction}%)`);
  console.log('\n✅ Listo\n');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
