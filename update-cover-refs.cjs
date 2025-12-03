#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Mapeo inverso: URL -> nombre local (con SVG placeholders)
const COVER_MAPPING = {
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1697312244910/d1486ed2-9f2a-4eca-a3a0-ceccebd91c7e.webp': 'rust-wasm-cover.svg',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1697335651065/3ae432a5-96e7-43a2-9296-b175b6545841.webp': 'static-web-cover.svg',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1701777393365/21df199f-25a6-4d5d-bd6d-e069b137153c.png': 'aoc-day-1-cover.svg',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1701887652025/152a0e54-85aa-48cb-ad82-d6c2a6845a49.png': 'aoc-day-2-cover.svg',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1701982955506/68506e8a-dd52-4f3c-bf4b-077cc31829bd.png': 'aoc-day-3-cover.svg',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1702289980318/1ac7f839-4da6-4d3a-b5dc-d8297261291e.png': 'aoc-day-4-cover.svg',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1702375828721/22d82463-cab7-4781-aaae-0f7e805a2f01.png': 'aoc-day-5-cover.svg',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1702649764433/8fc91e5e-0f66-453a-a992-819713eed8a7.png': 'aoc-day-6-cover.svg',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1703079583973/095cf230-8368-44ad-87bf-e28f5ec53124.png': 'aoc-day-7-cover.svg',
  'https://cdn.hashnode.com/res/hashnode/image/upload/v1705691034256/81bc5cb5-5f0a-40ec-945e-310b48cc38c2.jpeg': 'aoc-day-8-cover.svg',
};

const POSTS_DIRS = [
  path.join(__dirname, 'posts'),
  path.join(__dirname, 'public', 'posts'),
];

function updateFile(filepath) {
  let content = fs.readFileSync(filepath, 'utf8');
  let updated = false;

  for (const [cdnUrl, localFile] of Object.entries(COVER_MAPPING)) {
    // Reemplazar URL del CDN con referencia local
    // Capturar diferentes patrones de la línea cover
    const patterns = [
      // Patrón original: cover: "URL"
      new RegExp(`cover:\\s*"${cdnUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`, 'g'),
      // Patrón con parámetros: cover: "URL?w=1200&auto=compress,format"
      new RegExp(`cover:\\s*"${cdnUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[^"]*"`, 'g'),
    ];

    for (const pattern of patterns) {
      if (pattern.test(content)) {
        content = content.replace(pattern, `cover: "/images/covers/${localFile}"`);
        updated = true;
        console.log(`✅ Actualizado: ${path.basename(filepath)}`);
        console.log(`   ${localFile}`);
        break;
      }
    }
  }

  if (updated) {
    fs.writeFileSync(filepath, content, 'utf8');
  }

  return updated;
}

function main() {
  console.log('🔄 Actualizando referencias de portadas en posts...\n');

  let totalUpdated = 0;

  for (const postsDir of POSTS_DIRS) {
    if (!fs.existsSync(postsDir)) {
      console.log(`⚠️  Directorio no encontrado: ${postsDir}`);
      continue;
    }

    const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

    for (const file of files) {
      const filepath = path.join(postsDir, file);
      if (updateFile(filepath)) {
        totalUpdated++;
      }
    }
  }

  console.log(`\n✅ Actualización completa! ${totalUpdated} posts actualizados.`);

  // Verificar que los archivos de portada existan
  const coversDir = path.join(__dirname, 'public', 'images', 'covers');
  if (fs.existsSync(coversDir)) {
    const covers = fs.readdirSync(coversDir);
    console.log(`\n📊 Portadas disponibles: ${covers.length}`);
    covers.forEach(c => console.log(`   - /images/covers/${c}`));
  } else {
    console.log(`\n⚠️  Directorio de portadas no encontrado: ${coversDir}`);
    console.log('   Asegúrate de ejecutar primero: node download-and-optimize-covers.cjs');
  }
}

try {
  main();
} catch (error) {
  console.error(error);
}
