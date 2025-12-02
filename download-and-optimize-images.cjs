#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const https = require('https');
const { execSync } = require('child_process');

const IMAGES_DIR = path.join(__dirname, 'public', 'images', 'posts');
const TEMP_DIR = path.join(__dirname, 'temp_images');

// Mapeo de imágenes: URL -> nombre descriptivo del archivo
const IMAGE_MAPPING = {
  // Imágenes del post: improving-nodejs-with-rust-wasm-library
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1697222302376/6a1bb6c0-827f-4e93-85b6-fb519bfa59b5.png': 'rust-wasm-1.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1697222485225/33c9afce-7469-400f-a4b0-7a0cad017270.png': 'rust-wasm-2.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1697224065362/39f321fc-f53b-4ee0-85e8-6406a32d31f6.png': 'rust-wasm-3.png',

  // Imágenes del post: static-web-page-with-continuous-deployment-and-iac
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1686587280898/6b0d2fc6-43bd-4900-93ca-c39295d1d7da.png': 'static-web-1.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687914545603/dabdeb65-d090-467a-ade7-742be9ee75bf.png': 'static-web-2.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687277813325/25230c9a-d4aa-41b3-89fb-411886dbe6ff.png': 'static-web-3.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687282040112/3ec48d80-4cfa-4eb5-a212-d8ca929a52bf.png': 'static-web-4.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687282281080/716b206b-d4be-4f0d-b865-19f75f987f8b.png': 'static-web-5.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687297263852/49541cf0-ddf7-42e6-944c-5f6518a447f3.png': 'static-web-6.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687300221635/ac1525ed-f245-4ba1-9629-80727a31d9d5.png': 'static-web-7.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687434369524/a88c6bf6-ff66-497f-95e4-16c18af18d45.png': 'static-web-8.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687879783527/5c78ec05-274e-469f-8456-48beacb4c12d.png': 'static-web-9.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687880989757/6bd3f349-41df-448a-a21d-89a5cdbab85d.png': 'static-web-10.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687882139798/24260aa6-99f7-47da-bf2e-5663114083f7.png': 'static-web-11.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687882447871/774c4ea4-d1d8-48fc-97f9-4e12f824e7f8.png': 'static-web-12.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1688467648773/94c2fe81-6077-42b3-8f73-9802ae7ed8e9.png': 'static-web-13.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1687949803769/83097460-9efa-4ca0-ad4f-61c7ca0c37d0.png': 'static-web-14.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1688471190402/62cc6f6b-7b28-47e1-ba07-6e08a3c2b080.png': 'static-web-15.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1688516895788/da93148d-a1c6-4979-acb7-3eb089662f3e.png': 'static-web-16.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1688517107573/8f1e92c3-402d-4177-8df1-aca8788a861e.png': 'static-web-17.png',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1688517503838/af72f6fc-0ecf-407a-8209-1fe0c589008d.png': 'static-web-18.png',
};

// Crear directorios
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}
if (!fs.existsSync(TEMP_DIR)) {
  fs.mkdirSync(TEMP_DIR, { recursive: true });
}

// Función para descargar una imagen
function downloadImage(url, filepath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
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

// Función principal
async function main() {
  console.log('📥 Descargando imágenes...\n');

  const urls = Object.keys(IMAGE_MAPPING);
  let downloaded = 0;

  for (const url of urls) {
    const filename = IMAGE_MAPPING[url];
    const tempPath = path.join(TEMP_DIR, filename);

    try {
      console.log(`Descargando: ${filename}`);
      await downloadImage(url, tempPath);
      downloaded++;
    } catch (error) {
      console.error(`❌ Error descargando ${filename}: ${error.message}`);
    }
  }

  console.log(`\n✅ Descarga completa. ${downloaded}/${urls.length} imágenes descargadas.\n`);

  // Optimizar imágenes
  console.log('🔧 Optimizando imágenes para web...\n');

  const images = fs.readdirSync(TEMP_DIR).filter(f => f.endsWith('.png'));
  let optimized = 0;

  for (const image of images) {
    const tempPath = path.join(TEMP_DIR, image);
    const finalPath = path.join(IMAGES_DIR, image);

    try {
      const originalSize = getFileSize(tempPath);

      console.log(`Optimizando: ${image}`);

      // Usar pngquant para reducir colores
      try {
        execSync(`pngquant --force --quality=65-80 --output "${tempPath}.temp" "${tempPath}"`, { stdio: 'pipe' });
        fs.renameSync(`${tempPath}.temp`, tempPath);
      } catch (e) {
        // Si falla pngquant, continuar con el archivo original
      }

      // Usar optipng para optimización adicional
      try {
        execSync(`optipng -quiet -o2 "${tempPath}"`, { stdio: 'pipe' });
      } catch (e) {
        // Si falla optipng, continuar
      }

      // Mover al directorio final
      fs.copyFileSync(tempPath, finalPath);

      const optimizedSize = getFileSize(finalPath);
      const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(1);

      console.log(`  Original: ${formatBytes(originalSize)} → Optimizado: ${formatBytes(optimizedSize)} (${reduction}% reducción)`);
      optimized++;
    } catch (error) {
      console.error(`❌ Error optimizando ${image}: ${error.message}`);
    }
  }

  // Limpiar directorio temporal
  fs.rmSync(TEMP_DIR, { recursive: true, force: true });

  console.log(`\n✅ Optimización completa! ${optimized} imágenes optimizadas.\n`);

  // Resumen
  console.log('📊 Resumen:');
  const finalImages = fs.readdirSync(IMAGES_DIR).filter(f => f.endsWith('.png'));
  console.log(`Total de imágenes: ${finalImages.length}`);

  let totalSize = 0;
  finalImages.forEach(img => {
    totalSize += getFileSize(path.join(IMAGES_DIR, img));
  });
  console.log(`Espacio total utilizado: ${formatBytes(totalSize)}`);

  // Guardar mapeo para referencia
  fs.writeFileSync(
    path.join(__dirname, 'image-mapping.json'),
    JSON.stringify(IMAGE_MAPPING, null, 2)
  );
  console.log('\n✅ Mapeo de imágenes guardado en image-mapping.json');
}

main().catch(console.error);
