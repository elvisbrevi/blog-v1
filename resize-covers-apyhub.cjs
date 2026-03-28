#!/usr/bin/env node

/**
 * Redimensiona las cover images del blog usando la API de ApyHub.
 * Uso:
 *   node resize-covers-apyhub.cjs 1   → procesa el lote 1 (primeras 5 imágenes)
 *   node resize-covers-apyhub.cjs 2   → procesa el lote 2 (últimas 5 imágenes)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

// ─── Configuración ───────────────────────────────────────────────────────────

const API_TOKEN = 'APY07sf6C8AQuIVTle1H3BJW4gXSOxOYfmsz5uyMVHrYAElV8JPnMs5KqEKrMIRqRj1zjA';
const COVERS_DIR = path.join(__dirname, 'public', 'images', 'covers');

// Tamaño objetivo: 1200×686 mantiene la relación 1.75:1 (igual que el original 1792×1024)
// Óptimo para web: carga rápida en escritorio (max ~800px display) y pantallas retina
const TARGET_WIDTH = 1200;
const TARGET_HEIGHT = 686;

// ─── Lotes ────────────────────────────────────────────────────────────────────

const BATCH_1 = [
  'aoc-day-1-cover.png',
  'aoc-day-2-cover.png',
  'aoc-day-3-cover.png',
  'aoc-day-4-cover.png',
  'aoc-day-5-cover.png',
];

const BATCH_2 = [
  'aoc-day-6-cover.png',
  'aoc-day-7-cover.png',
  'aoc-day-8-cover.jpeg',
  'rust-wasm-cover.webp',
  'static-web-cover.webp',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

function getMimeType(filename) {
  const ext = path.extname(filename).toLowerCase();
  const map = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
  };
  return map[ext] || 'application/octet-stream';
}

/**
 * Llama a la API de ApyHub para redimensionar una imagen.
 * Devuelve el buffer con la imagen redimensionada.
 */
function resizeWithApyHub(filePath, outputFilename, width, height) {
  return new Promise((resolve, reject) => {
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);
    const boundary = '----FormBoundary' + Math.random().toString(36).slice(2);

    // Construir el cuerpo multipart/form-data manualmente
    const parts = [];

    // Campo: image (archivo)
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="image"; filename="${path.basename(filePath)}"\r\nContent-Type: ${mimeType}\r\n\r\n`
      )
    );
    parts.push(fileBuffer);
    parts.push(Buffer.from('\r\n'));

    // Campo: width
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="width"\r\n\r\n${width}\r\n`
      )
    );

    // Campo: height
    parts.push(
      Buffer.from(
        `--${boundary}\r\nContent-Disposition: form-data; name="height"\r\n\r\n${height}\r\n`
      )
    );

    // Cierre
    parts.push(Buffer.from(`--${boundary}--\r\n`));

    const body = Buffer.concat(parts);

    const options = {
      hostname: 'api.apyhub.com',
      path: `/processor/image/resize/file?output=${encodeURIComponent(outputFilename)}`,
      method: 'POST',
      headers: {
        'apy-token': API_TOKEN,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': body.length,
      },
    };

    const req = https.request(options, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => {
        const responseBuffer = Buffer.concat(chunks);

        if (res.statusCode !== 200) {
          reject(
            new Error(
              `HTTP ${res.statusCode}: ${responseBuffer.toString().slice(0, 200)}`
            )
          );
          return;
        }

        // Verificar que la respuesta sea una imagen y no JSON de error
        const contentType = res.headers['content-type'] || '';
        if (contentType.includes('application/json')) {
          reject(new Error(`Respuesta inesperada (JSON): ${responseBuffer.toString()}`));
          return;
        }

        resolve(responseBuffer);
      });
    });

    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const batchArg = process.argv[2];
  const images = batchArg === '2' ? BATCH_2 : BATCH_1;
  const batchNum = batchArg === '2' ? 2 : 1;

  console.log(`\n🖼️  Redimensionando covers — Lote ${batchNum}/2`);
  console.log(`   Destino: ${TARGET_WIDTH}×${TARGET_HEIGHT}px (ratio 1.75:1)\n`);

  let success = 0;
  let failed = 0;

  for (const filename of images) {
    const filePath = path.join(COVERS_DIR, filename);

    if (!fs.existsSync(filePath)) {
      console.error(`❌ No encontrado: ${filename}`);
      failed++;
      continue;
    }

    const originalSize = fs.statSync(filePath).size;
    process.stdout.write(`   ${filename} (${formatBytes(originalSize)}) → `);

    try {
      const resizedBuffer = await resizeWithApyHub(filePath, filename, TARGET_WIDTH, TARGET_HEIGHT);

      // Hacer backup del original antes de sobreescribir
      const backupPath = filePath + '.bak';
      fs.copyFileSync(filePath, backupPath);

      // Guardar imagen redimensionada
      fs.writeFileSync(filePath, resizedBuffer);

      const newSize = fs.statSync(filePath).size;
      const reduction = ((1 - newSize / originalSize) * 100).toFixed(1);

      console.log(`${formatBytes(newSize)} (↓${reduction}%) ✅`);
      success++;
    } catch (err) {
      console.log(`ERROR ❌`);
      console.error(`   └─ ${err.message}`);
      failed++;
    }
  }

  console.log(`\n📊 Resultado: ${success} exitosas, ${failed} fallidas`);

  if (success > 0) {
    console.log(`\n💾 Los archivos originales tienen backup con extensión .bak`);
    console.log(`   Para eliminarlos: find public/images/covers -name "*.bak" -delete\n`);
  }

  if (batchNum === 1) {
    console.log(`⏭️  Mañana ejecuta el lote 2:`);
    console.log(`   node resize-covers-apyhub.cjs 2\n`);
  } else {
    console.log(`🎉 ¡Todas las covers han sido redimensionadas!\n`);
  }
}

main().catch((err) => {
  console.error('Error fatal:', err.message);
  process.exit(1);
});
