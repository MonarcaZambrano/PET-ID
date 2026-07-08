# PetID Online MVP

Paquete recuperado y ampliado para continuar el proyecto PetID en Codex.

## Qué incluye

- Portal público para solicitar PetID desde cualquier ciudad.
- Tres modalidades: kit físico, archivo digital y perfil digital.
- Carga y compresión local de fotografía.
- Selección de hasta tres diseños preferidos.
- Vista previa protegida con marca de agua y sin QR definitivo.
- Panel administrativo de demostración.
- Diez tarjetas predefinidas recuperadas:
  1. Guardián oscuro
  2. Deportivo rojo
  3. Kennel clásico
  4. Compañero jovial
  5. Urbano tech
  6. Blush elegante
  7. Lavanda premium
  8. Diva burdeo
  9. Dulce compañía
  10. Floral celeste
- Editor de fotografía: encuadre, zoom, brillo y posición.
- Frente y reverso de credencial con QR.
- Tags circular, rectangular y medalla/hueso.
- Perfil público móvil mediante `/p/:publicSlug`.
- Estado de mascota extraviada.
- Formulario “Encontré a esta mascota”.
- Datos locales de demostración.
- Migración SQL propuesta para Supabase.
- Configuración preparada para Cloudflare Pages.
- Prompt maestro para continuar en Codex.

## Ejecutar localmente

Requiere Node.js 18 o superior.

```bash
npm run check
npm run dev
```

Abrir:

- Portal público: `http://localhost:4173/`
- Administrador: `http://localhost:4173/admin.html`
- Perfil QR demo: `http://localhost:4173/p/demo-luna`

## Generar carpeta de publicación

```bash
npm run build
```

El resultado queda en `dist/`.

## Publicación temporal

Configuración prevista:

- Sitio público: `https://petid-dev.inkpro.cl`
- Administración: `https://petid-admin-dev.inkpro.cl`

En Cloudflare Pages:

- Build command: `npm run build`
- Output directory: `dist`

## Limitaciones actuales

Esta es una base funcional de demostración, no una versión productiva.

- Los datos se guardan en `localStorage` y no se comparten entre dispositivos.
- No existe pago real.
- No existe autenticación real en administración.
- No existe envío automático de correo o WhatsApp.
- Los perfiles creados localmente solo pueden consultarse en el mismo navegador.
- El perfil `demo-luna` está disponible para probar la ruta y el QR.

Antes de venta real deben completarse Supabase, pagos, autenticación, almacenamiento, protección contra abuso, validación de impresión y política de privacidad.

## Archivos principales

- `index.html`: portal público y solicitud.
- `admin.html`: administración y producción.
- `profile.html`: perfil público QR.
- `js/shared.js`: configuración, plantillas, QR y almacenamiento demo.
- `js/customer.js`: flujo público.
- `js/admin.js`: flujo administrativo.
- `js/profile.js`: perfil y aviso de hallazgo.
- `supabase/migrations/001_petid_initial.sql`: base de datos propuesta.
- `docs/PROMPT_CODEX.md`: instrucción completa para Codex.
