# Pruebas realizadas

Fecha: 8 de julio de 2026.

## Automáticas

- `npm run check`: correcto.
- Validación de sintaxis Node para:
  - `js/shared.js`.
  - `js/customer.js`.
  - `js/admin.js`.
  - `js/profile.js`.
- Verificación de archivos obligatorios: correcta.
- Verificación básica de HTML completo: correcta.
- `npm run build`: correcto.

## Servidor local

Se comprobó respuesta HTTP 200 para:

- `/`.
- `/admin.html`.
- `/profile.html?slug=demo-luna`.

## Pendiente de prueba manual

- Flujo completo desde solicitud pública hasta carga en administrador.
- Carga real de fotografías en distintos teléfonos.
- Impresión física frente/reverso.
- Escaneo de tags en distintos tamaños y materiales.
- Navegadores móviles iOS y Android.
- Supabase, autenticación, pagos y notificaciones.
