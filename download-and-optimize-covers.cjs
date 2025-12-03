#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');
const { execSync } = require('child_process');

const COVERS_DIR = path.join(__dirname, 'public', 'images', 'covers');
const TEMP_DIR = path.join(__dirname, 'temp_covers');

// Mapeo de imágenes de portada: URL -> nombre descriptivo del archivo
const COVER_MAPPING = {
  // Improving Node.js with Rust-Wasm Library
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1697312244910/d1486ed2-9f2a-4eca-a3a0-ceccebd91c7e.webp': 'rust-wasm-cover.webp',

  // Static Web Page with Continuous Deployment and IAC
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1697335651065/3ae432a5-96e7-43a2-9296-b175b6545841.webp': 'static-web-cover.webp',

  // Advent of Code covers
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1701777393365/21df199f-25a6-4d5d-bd6d-e069b137153c.png': 'aoc-day-1-cover.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1701887652025/152a0e54-85aa-48cb-ad82-d6c2a6845a49.png': 'aoc-day-2-cover.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1701982955506/68506e8a-dd52-4f3c-bf4b-077cc31829bd.png': 'aoc-day-3-cover.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1702289980318/1ac7f839-4da6-4d3a-b5dc-d8297261291e.png': 'aoc-day-4-cover.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1702375828721/22d82463-cab7-4781-aaae-0f7e805a2f01.png': 'aoc-day-5-cover.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1702649764433/8fc91e5e-0f66-453a-a992-819713eed8a7.png': 'aoc-day-6-cover.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1703079583973/095cf230-8368-44ad-87bf-e28f5ec53124.png': 'aoc-day-7-cover.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1705691034256/81bc5cb5-5f0a-40ec-945e-310b48cc38c2.jpeg': 'aoc-day-8-cover.jpeg',
};

// Crear directorios
if (!fs.existsSync(COVERS_DIR)) {
  fs.mkdirSync(COVERS_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Función para descargar una imagen
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https') ? https : http;
    const file = fs.createWriteStream(filepath);

    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${url}: ${response.statusCode}`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {});
      reject(err);
    });
  });
}

// Función para obtener tamaño de archivo
function getFileSize(filepath) {
  const stats = fs.statSync(filepath);
  return stats.size;
}

// Función para formatear bytes
function formatBytes(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}

// Función para redimensionar imagen con ImageMagick
function resizeImage(inputPath, outputPath) {
  const filename = path.basename(outputPath);
  try {
    // Redimensionar a 1200x600 (óptimo para feature images)
    execSync(`convert "${inputPath}" -resize 1200x600 -quality 85 "${outputPath}"`, { stdio: 'pipe' });
    return true;
  } catch (e) {
    console.warn(`  ⚠️  ImageMagick no disponible, usando archivo original`);
    return false;
  }
}

// Función para optimizar imágenes
function optimizeImage(inputPath, outputPath) {
  const ext = path.extname(inputPath).toLowerCase();
  const filename = path.basename(outputPath);

  try {
    if (ext === '.webp') {
      // Para WebP, intentar redimensionar primero, luego copiar
      let tempResized = inputPath + '.resized';
      if (resizeImage(inputPath, tempResized)) {
        fs.copyFileSync(tempResized, outputPath);
        fs.unlinkSync(tempResized);
      } else {
        // Si falla redimensionamiento, copiar original
        fs.copyFileSync(inputPath, outputPath);
      }
      return true;
    } else if (ext === '.png' || ext === '.jpeg' || ext === '.jpg') {
      // Para PNG/JPEG, redimensionar a 1200x600 y optimizar
      resizeImage(inputPath, outputPath);

      // Aplicar optimizaciones adicionales según tipo
      if (ext === '.png') {
        try {
          execSync(`pngquant --force --quality=70-85 --output "${outputPath}.temp" "${outputPath}"`, { stdio: 'pipe' });
          fs.renameSync(`${outputPath}.temp`, outputPath);
        } catch (e) {
          // Si falla pngquant, continuar
        }

        try {
          execSync(`optipng -quiet -o2 "${outputPath}"`, { stdio: 'pipe' });
        } catch (e) {
          // Si falla optipng, continuar
        }
      } else if (ext === '.jpeg' || ext === '.jpg') {
        try {
          execSync(`jpegoptim --max=85 "${outputPath}"`, { stdio: 'pipe' });
        } catch (e) {
          // Si falla jpegoptim, continuar
        }
      }
      return true;
    }

    // Por defecto, copiar archivo
    fs.copyFileSync(inputPath, outputPath);
    return true;
  } catch (error) {
    console.error(`Error optimizing ${filename}: ${error.message}`);
    return false;
  }
}

// Función principal
async function main() {
  console.log('🎨 Descargando imágenes de portada...\n');

  const urls = Object.keys(COVER_MAPPING);
  let downloaded = 0;
  const downloadedFiles = {};

  for (const url of urls) {
    const filename = COVER_MAPPING[url];
    const tempPath = path.join(TEMP_DIR, filename);

    try {
      console.log(`Descargando: ${filename}`);
      await downloadImage(url, tempPath);
      downloaded++;
      downloadedFiles[url] = filename;
    } catch (error) {
      console.error(`❌ Error descargando ${filename}: ${error.message}`);
    }
  }

  console.log(`\n✅ Descarga completa. ${downloaded}/${urls.length} imágenes descargadas.\n`);

  // Optimizar imágenes
  console.log('🔧 Optimizando imágenes de portada para web...\n');

  const images = fs.readdirSync(TEMP_DIR);
  let optimized = 0;

  for (const image of images) {
    const tempPath = path.join(TEMP_DIR, image);
    const finalPath = path.join(COVERS_DIR, image);

    try {
      const originalSize = getFileSize(tempPath);

      console.log(`Optimizando: ${image}`);

      if (optimizeImage(tempPath, finalPath)) {
        const optimizedSize = getFileSize(finalPath);
        const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

        console.log(`  Original: ${formatBytes(originalSize)} → Optimizado: ${formatBytes(optimizedSize)} (${reduction}% reducción)`);
        optimized++;
      }
    } catch (error) {
      console.error(`❌ Error optimizando ${image}: ${error.message}`);
    }
  }

  // Limpiar directorio temporal
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  console.log(`\n✅ Optimización completa! ${optimized} imágenes optimizadas.\n`);

  // Resumen
  console.log('📊 Resumen:');
  const finalImages = fs.readdirSync(COVERS_DIR);
  console.log(`Total de portadas: ${finalImages.length}`);

  let totalSize = 0;
  finalImages.forEach(img => {
    totalSize += getFileSize(path.join(COVERS_DIR, img));
  });
  console.log(`Espacio total utilizado: ${formatBytes(totalSize)}`);

  // Guardar mapeo para referencia
  fs.writeFileSync(
    path.join(__dirname, 'cover-mapping.json'),
    JSON.stringify(COVER_MAPPING, null, 2)
  );
  console.log('\n✅ Mapeo de portadas guardado en cover-mapping.json');

  // Mostrar instrucciones para actualizar referencias
  console.log('\n📝 Próximo paso: actualizar las referencias de portada en los posts');
  console.log('   Ejecutar: node update-cover-refs.cjs');
}

main().catch(console.error);
