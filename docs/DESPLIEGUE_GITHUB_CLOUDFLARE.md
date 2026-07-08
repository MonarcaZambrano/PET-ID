# Despliegue en GitHub y Cloudflare Pages

## Repositorio

Crear un repositorio independiente, por ejemplo:

`petid-dev`

No mezclarlo con el repositorio principal de InkPRO.

## Prueba local

```bash
npm run check
npm run dev
```

## Build

```bash
npm run build
```

Salida: `dist`.

## Cloudflare Pages

1. Conectar el repositorio de GitHub.
2. Configurar rama principal.
3. Build command: `npm run build`.
4. Build output directory: `dist`.
5. Publicar primero con el dominio `pages.dev`.
6. Agregar `petid-dev.inkpro.cl` como dominio personalizado.
7. Proteger el administrador con Cloudflare Access antes de manejar datos reales.

El archivo `_redirects` reescribe `/p/:slug` hacia `profile.html`, manteniendo la URL visible. El archivo `_headers` añade encabezados básicos y `noindex`.

## Advertencia

El MVP estático no comparte datos entre dispositivos. Antes de imprimir QR reales, conecta Supabase y verifica que el perfil pueda abrirse desde un teléfono distinto.
