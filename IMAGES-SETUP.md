# Configuración de Imágenes Locales del Blog

Este documento describe cómo descargar y optimizar las imágenes reales de las entradas del blog.

## 📋 Estado Actual

- ✅ **Referencias actualizadas**: Todas las imágenes externas (CDN de Hashnode) ahora apuntan a rutas locales `/images/posts/*.png`
- ✅ **Placeholders creados**: Se crearon imágenes placeholder temporales para desarrollo
- ✅ **Estructura de carpetas**: `public/images/posts/` contiene las imágenes

## 🎯 Descargar Imágenes Reales

### Requisitos Previos

Asegúrate de tener instaladas las herramientas de optimización:

```bash
# En Ubuntu/Debian
sudo apt-get install imagemagick optipng jpegoptim pngquant webp

# En macOS
brew install imagemagick optipng jpegoptim pngquant webp
```

### Paso 1: Ejecutar Script de Descarga

El script `download-and-optimize-images.cjs` descarga todas las imágenes desde el CDN de Hashnode y las optimiza automáticamente:

```bash
node download-and-optimize-images.cjs
```

### Paso 2: Verificar Resultados

El script:
- Descarga 21 imágenes desde cdn.hashnode.com
- Las optimiza usando `pngquant` y `optipng`
- Las guarda en `public/images/posts/`
- Genera un archivo `image-mapping.json` con el mapeo de URLs

## 📊 Mapeo de Imágenes

El archivo `image-mapping.json` contiene el mapeo completo de URLs originales a nombres de archivos locales:

```json
{
  "https://cdn.hashnode.com/.../6a1bb6c0-827f-4e93-85b6-fb519bfa59b5.png": "/images/posts/rust-wasm-1.png",
  "https://cdn.hashnode.com/.../33c9afce-7469-400f-a4b0-7a0cad017270.png": "/images/posts/rust-wasm-2.png",
  ...
}
```

### Imágenes por Post

#### Post: Improving Node.js with Rust-Wasm Library
- `rust-wasm-1.png` - Output de compilación WASM
- `rust-wasm-2.png` - Alert en navegador
- `rust-wasm-3.png` - Comparación de rendimiento

#### Post: Static Web Page with Continuous Deployment and IAC
- `static-web-1.png` hasta `static-web-18.png` - Diagramas de arquitectura AWS y capturas de pantalla

## 🔧 Optimización Manual

Si prefieres optimizar las imágenes manualmente:

```bash
# Para PNG
optipng -o2 public/images/posts/*.png
pngquant --force --quality=65-80 public/images/posts/*.png

# Para JPG/JPEG
jpegoptim --max=80 public/images/posts/*.jpg

# Convertir a WebP (formato más eficiente)
for img in public/images/posts/*.png; do
  cwebp -q 80 "$img" -o "${img%.png}.webp"
done
```

## 📝 Archivos Relacionados

- `download-and-optimize-images.cjs` - Script principal de descarga y optimización
- `update-image-refs.cjs` - Script para actualizar referencias (ya ejecutado)
- `image-mapping.json` - Mapeo de URLs a archivos locales
- `download-images.sh` - Script alternativo en bash (no usado finalmente)

## ⚙️ Cambios Realizados

1. **Estructura de carpetas**:
   - Creado `public/images/posts/` para almacenar imágenes del blog

2. **Referencias actualizadas en**:
   - `posts/2023-10-14-improving-nodejs-with-rust-wasm-library.md` (3 imágenes)
   - `posts/2023-07-05-static-web-page-with-continuous-deployment-and-iac.md` (18 imágenes)
   - `public/posts/` (copias actualizadas)

3. **Formato de referencias**:
   - Antes: `![](https://cdn.hashnode.com/res/hashnode/image/upload/v.../xxx.png align="center")`
   - Después: `![](/images/posts/xxx.png)`

## 🚀 Próximos Pasos

1. Ejecuta `node download-and-optimize-images.cjs` en tu entorno local para descargar las imágenes reales
2. Verifica que todas las imágenes se carguen correctamente en el blog
3. Opcionalmente, convierte las imágenes a formato WebP para mejor rendimiento
4. Considera implementar lazy loading para las imágenes

## 📦 Tamaño Esperado

- **Placeholders actuales**: ~172KB total (21 imágenes)
- **Imágenes reales optimizadas**: Se espera ~2-5MB total dependiendo del contenido
- **Reducción esperada**: 30-50% del tamaño original después de optimización

## ⚠️ Notas Importantes

- Las imágenes actuales son placeholders y deben ser reemplazadas por las reales
- El script de descarga funciona solo en entornos con acceso a cdn.hashnode.com
- Las referencias en los archivos markdown ya están actualizadas y apuntan a las rutas locales
- Asegúrate de ejecutar el script de descarga antes de desplegar a producción
