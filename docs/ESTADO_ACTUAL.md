# Estado actual recuperado

## Archivos anteriores localizados

- `petid_index_v1.html`
- `petid_index_v2.html`
- `petid_index_v4_ajuste_foto.html`
- Capturas de pruebas móviles de credenciales.

## Base funcional identificada

La versión v4 era la más avanzada porque ya reunía:

- ID PetID automático.
- Registro de mascota y responsable.
- Diez plantillas visuales.
- Código QR.
- Guardado y búsqueda local.
- Reimpresión.
- Impresión y generación de PDF mediante librerías web.
- Ajuste básico de fotografía.

## Trabajo incorporado en este paquete

Se creó una nueva base estática modular, sin generar imágenes nuevas, que añade:

- Portal público de solicitudes.
- Selección de producto.
- Flujo previo al pago.
- Selección de tres estilos favoritos.
- Vista protegida con marca de agua.
- Panel administrativo de producción.
- Perfiles públicos por slug.
- Modo extraviado.
- Formulario de hallazgo.
- Tags QR.
- Archivos para GitHub y Cloudflare Pages.
- Base SQL y políticas propuestas para Supabase.

## Decisión técnica

La demo se mantiene en HTML, CSS y JavaScript sin dependencias de compilación. Esto permite probarla de inmediato y entregarla a Codex para una migración progresiva, evitando perder las funciones recuperadas.

## Pendiente productivo

- Autenticación con Supabase.
- Persistencia compartida.
- Storage de fotografías.
- Pasarela de pago.
- Correos y notificaciones.
- Control de propuestas y aprobación privada.
- Exportación profesional PNG/PDF desde servidor o navegador.
- Pruebas físicas del QR.
- Política de privacidad y términos.

## Auditoría inicial Codex - 8 de julio de 2026

- Se verificó la integridad del paquete `petid-online-mvp-codex.zip` contra su SHA-256.
- Se ejecutó `check`, `dev` y `build` mediante `pnpm run ...` con el Node incluido en Codex, porque `npm` no está disponible en el PATH de esta sesión.
- El servidor local respondió HTTP 200 en `http://127.0.0.1:4173/`.
- Se revisaron `README.md`, documentos en `docs/`, HTML principales, scripts JS, migración Supabase y referencias en `legacy/`.
- Se confirmó que la base conserva las diez plantillas requeridas y mantiene modo demo con `localStorage`.
- Se creó respaldo previo en `C:\Users\jzamb\OneDrive\Documents\PETID\backups\petid-online-mvp-backup-20260708-1036.zip`.
- No se encontraron adjuntos originales `petid_index_v1.html`, `petid_index_v2.html` ni `petid_index_v4_ajuste_foto.html` fuera de la referencia documental incluida.
