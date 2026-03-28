# Redimensionar Cover Images con ApyHub

Reduce las covers de **1792×1024 px** → **1200×686 px** (ratio 1.75:1 preservado).
Esto pasa los PNGs de ~2–3 MB a ~300–600 KB típicamente.

## Requisitos

- Node.js instalado
- Conexión a internet
- El token de ApyHub ya está configurado en el script

## Lote 1 — Primeras 5 imágenes

```bash
node resize-covers-apyhub.cjs 1
```

Procesa:
- `aoc-day-1-cover.png` (2.4 MB)
- `aoc-day-2-cover.png` (2.1 MB)
- `aoc-day-3-cover.png` (2.3 MB)
- `aoc-day-4-cover.png` (2.7 MB)
- `aoc-day-5-cover.png` (2.2 MB)

## Lote 2 — Últimas 5 imágenes (ejecutar al día siguiente)

```bash
node resize-covers-apyhub.cjs 2
```

Procesa:
- `aoc-day-6-cover.png` (2.1 MB)
- `aoc-day-7-cover.png` (3.1 MB)
- `aoc-day-8-cover.jpeg` (1.9 MB)
- `rust-wasm-cover.webp` (275 KB)
- `static-web-cover.webp` (188 KB)

## Backups

El script guarda una copia del original con extensión `.bak` antes de sobreescribir.
Una vez verificado el resultado, elimínalos con:

```bash
find public/images/covers -name "*.bak" -delete
```

## Si alguna imagen falla

La API de ApyHub permite 5 imágenes diarias. Si el error es por límite de cuota (`429`), espera al día siguiente.
Para cualquier otro error, el mensaje aparecerá en consola con el detalle HTTP.

## Después de redimensionar

No es necesario cambiar nada en el código. Los nombres de archivo y rutas (`/images/covers/...`) se mantienen igual.
El componente `OptimizedImage` seguirá funcionando sin cambios.
