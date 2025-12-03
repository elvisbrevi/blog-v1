# Migración de Imágenes de Portada (Cover Images)

## Estado Actual

✅ Todas las referencias de portadas han sido migradas de CDN a almacenamiento local (`/images/covers/`).

Actualmente se están usando **placeholders SVG** como referencia visual mientras se obtienen las imágenes reales del CDN de Hashnode.

## Imágenes de Portada por Post

| Post | Cover Actual | URL Original CDN |
|------|-------------|-----------------|
| Rust-WASM | `rust-wasm-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1697312244910/d1486ed2-9f2a-4eca-a3a0-ceccebd91c7e.webp` |
| Static Web | `static-web-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1697335651065/3ae432a5-96e7-43a2-9296-b175b6545841.webp` |
| AoC Day 1 | `aoc-day-1-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1701777393365/21df199f-25a6-4d5d-bd6d-e069b137153c.png` |
| AoC Day 2 | `aoc-day-2-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1701887652025/152a0e54-85aa-48cb-ad82-d6c2a6845a49.png` |
| AoC Day 3 | `aoc-day-3-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1701982955506/68506e8a-dd52-4f3c-bf4b-077cc31829bd.png` |
| AoC Day 4 | `aoc-day-4-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1702289980318/1ac7f839-4da6-4d3a-b5dc-d8297261291e.png` |
| AoC Day 5 | `aoc-day-5-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1702375828721/22d82463-cab7-4781-aaae-0f7e805a2f01.png` |
| AoC Day 6 | `aoc-day-6-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1702649764433/8fc91e5e-0f66-453a-a992-819713eed8a7.png` |
| AoC Day 7 | `aoc-day-7-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1703079583973/095cf230-8368-44ad-87bf-e28f5ec53124.png` |
| AoC Day 8 | `aoc-day-8-cover.svg` | `https://cdn.hashnode.com/res/hashnode/image/upload/v1705691034256/81bc5cb5-5f0a-40ec-945e-310b48cc38c2.jpeg` |

## Opción 1: Descargar y Optimizar Automáticamente (Recomendado)

Si tienes acceso a internet desde tu máquina local:

```bash
# En la raíz del proyecto
node download-and-optimize-covers.cjs
```

Este script:
1. Descarga todas las imágenes originales desde Hashnode CDN
2. Las redimensiona a **1200x600px** (óptimo para feature images)
3. Las optimiza usando herramientas disponibles (ImageMagick, pngquant, optipng, jpegoptim)
4. Las guarda en `public/images/covers/`

### Requisitos previos

```bash
# Ubuntu/Debian
sudo apt-get install imagemagick optipng jpegoptim pngquant

# macOS
brew install imagemagick optipng jpegoptim pngquant
```

## Opción 2: Descargar Manualmente

Si prefieres descargar las imágenes manualmente:

```bash
# Crear directorio si no existe
mkdir -p public/images/covers

# Descargar cada imagen (reemplaza w=1200&auto=compress,format para optimizar)
curl -o public/images/covers/rust-wasm-cover.webp "https://cdn.hashnode.com/res/hashnode/image/upload/v1697312244910/d1486ed2-9f2a-4eca-a3a0-ceccebd91c7e.webp?w=1200&auto=compress,format"
curl -o public/images/covers/static-web-cover.webp "https://cdn.hashnode.com/res/hashnode/image/upload/v1697335651065/3ae432a5-96e7-43a2-9296-b175b6545841.webp?w=1200&auto=compress,format"
curl -o public/images/covers/aoc-day-1-cover.png "https://cdn.hashnode.com/res/hashnode/image/upload/v1701777393365/21df199f-25a6-4d5d-bd6d-e069b137153c.png?w=1200&auto=compress,format"
# ... continúa con el resto de URLs de la tabla anterior
```

## Opción 3: Cargar Imágenes Desde Archivo Local

Si tienes las imágenes descargadas localmente:

```bash
# Copiar imágenes a la carpeta de covers
cp /ruta/a/tus/imagenes/* public/images/covers/

# Luego optimizarlas (si dispones de herramientas)
for img in public/images/covers/*; do
  convert "$img" -resize 1200x600 -quality 85 "$img"
done
```

## Dimensiones Recomendadas

- **Tamaño óptimo para web**: 1200x600px
- **Calidad JPEG/WebP**: 80-85%
- **Reducción esperada**: 30-50% del tamaño original

## Verificar Migración

Una vez descargadas las imágenes reales:

```bash
# Ver las imágenes en la carpeta
ls -lh public/images/covers/

# Verificar tamaños
du -sh public/images/covers/
```

## Estructura Final Esperada

```
public/images/covers/
├── rust-wasm-cover.webp (o .png, .jpeg)
├── static-web-cover.webp (o .png, .jpeg)
├── aoc-day-1-cover.png
├── aoc-day-2-cover.png
├── aoc-day-3-cover.png
├── aoc-day-4-cover.png
├── aoc-day-5-cover.png
├── aoc-day-6-cover.png
├── aoc-day-7-cover.png
└── aoc-day-8-cover.jpeg (o .png)
```

## Notas Importantes

- Las referencias en los posts ya apuntan a `/images/covers/`
- Los placeholders SVG se reemplazarán automáticamente cuando guardes las imágenes reales
- Los formatos originales (webp, png, jpeg) se pueden mantener o convertir según necesidad
- Para mejor compatibilidad, se recomienda usar PNG o WebP

## Scripts Disponibles

- **`download-and-optimize-covers.cjs`** - Descarga y optimiza automáticamente
- **`generate-cover-placeholders.cjs`** - Regenera placeholders SVG (útil si se eliminan accidentalmente)
- **`update-cover-refs.cjs`** - Actualiza referencias en posts (ya ejecutado)
- **`cover-mapping.json`** - Mapeo de URLs a archivos locales

## Solución de Problemas

### El script no descarga las imágenes
- Verifica que tengas conexión a internet
- Intenta descargar manualmente con `curl`
- Revisa si el CDN está disponible: `curl -I https://cdn.hashnode.com/`

### Las imágenes descargadas no se ven correctamente
- Verifica que los archivos estén en `public/images/covers/`
- Recarga el navegador (Ctrl+Shift+R en desarrollo)
- Revisa la consola del navegador para errores 404

### Las imágenes no se optimizan
- Instala las herramientas necesarias (ImageMagick, optipng, etc.)
- El script continuará funcionando sin ellas, solo sin optimización
- Las imágenes se copiarán con su tamaño original
