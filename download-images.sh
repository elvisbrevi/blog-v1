#!/bin/bash

# Script para descargar y optimizar imágenes del blog

set -e

IMAGES_DIR="public/images/posts"
TEMP_DIR="temp_images"

# Crear directorios si no existen
mkdir -p "$IMAGES_DIR"
mkdir -p "$TEMP_DIR"

echo "📥 Descargando imágenes..."

# Array de URLs de imágenes encontradas
declare -a URLS=(
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1697222302376/6a1bb6c0-827f-4e93-85b6-fb519bfa59b5.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1697222485225/33c9afce-7469-400f-a4b0-7a0cad017270.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1697224065362/39f321fc-f53b-4ee0-85e8-6406a32d31f6.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1686587280898/6b0d2fc6-43bd-4900-93ca-c39295d1d7da.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687914545603/dabdeb65-d090-467a-ade7-742be9ee75bf.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687277813325/25230c9a-d4aa-41b3-89fb-411886dbe6ff.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687282040112/3ec48d80-4cfa-4eb5-a212-d8ca929a52bf.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687282281080/716b206b-d4be-4f0d-b865-19f75f987f8b.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687297263852/49541cf0-ddf7-42e6-944c-5f6518a447f3.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687300221635/ac1525ed-f245-4ba1-9629-80727a31d9d5.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687434369524/a88c6bf6-ff66-497f-95e4-16c18af18d45.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687879783527/5c78ec05-274e-469f-8456-48beacb4c12d.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687880989757/6bd3f349-41df-448a-a21d-89a5cdbab85d.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687882139798/24260aa6-99f7-47da-bf2e-5663114083f7.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687882447871/774c4ea4-d1d8-48fc-97f9-4e12f824e7f8.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1688467648773/94c2fe81-6077-42b3-8f73-9802ae7ed8e9.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1687949803769/83097460-9efa-4ca0-ad4f-61c7ca0c37d0.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1688471190402/62cc6f6b-7b28-47e1-ba07-6e08a3c2b080.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1688516895788/da93148d-a1c6-4979-acb7-3eb089662f3e.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1688517107573/8f1e92c3-402d-4177-8df1-aca8788a861e.png"
  "https://cdn.hashnode.com/res/hashnode/image/upload/v1688517503838/af72f6fc-0ecf-407a-8209-1fe0c589008d.png"
)

# Descargar cada imagen
for url in "${URLS[@]}"; do
  # Extraer el nombre del archivo (el ID único de hashnode)
  filename=$(basename "$url" | cut -d'.' -f1)
  extension="${url##*.}"

  # Descargar a directorio temporal
  echo "Descargando: $filename.$extension"
  curl -s -o "$TEMP_DIR/$filename.$extension" "$url"
done

echo ""
echo "✅ Descarga completa. Total de imágenes: ${#URLS[@]}"
echo ""
echo "🔧 Optimizando imágenes para web..."

# Optimizar imágenes PNG
for img in "$TEMP_DIR"/*.png; do
  if [ -f "$img" ]; then
    filename=$(basename "$img")
    echo "Optimizando PNG: $filename"

    # Usar pngquant para reducir colores (mejor compresión)
    pngquant --force --quality=65-80 --output "$TEMP_DIR/temp_$filename" "$img" 2>/dev/null || cp "$img" "$TEMP_DIR/temp_$filename"

    # Luego optipng para optimización adicional
    optipng -quiet -o2 "$TEMP_DIR/temp_$filename" 2>/dev/null || true

    # Mover al directorio final
    mv "$TEMP_DIR/temp_$filename" "$IMAGES_DIR/$filename"

    # Mostrar tamaños
    original_size=$(stat -f%z "$img" 2>/dev/null || stat -c%s "$img")
    optimized_size=$(stat -f%z "$IMAGES_DIR/$filename" 2>/dev/null || stat -c%s "$IMAGES_DIR/$filename")
    reduction=$(echo "scale=1; 100 - ($optimized_size * 100 / $original_size)" | bc)
    echo "  Original: $(numfmt --to=iec $original_size 2>/dev/null || echo $original_size) → Optimizado: $(numfmt --to=iec $optimized_size 2>/dev/null || echo $optimized_size) (${reduction}% reducción)"
  fi
done

# Limpiar directorio temporal
rm -rf "$TEMP_DIR"

echo ""
echo "✅ Optimización completa!"
echo ""
echo "📊 Resumen:"
ls -lh "$IMAGES_DIR" | tail -n +2 | wc -l | xargs echo "Total de imágenes optimizadas:"
du -sh "$IMAGES_DIR" | cut -f1 | xargs echo "Espacio total utilizado:"
