# Privacidad y seguridad

## Reglas básicas

- No almacenar dirección domiciliaria exacta durante el MVP.
- No incluir datos privados dentro del QR.
- El QR debe apuntar a un `publicSlug` aleatorio.
- No usar IDs secuenciales internos en URLs.
- El perfil público recibe solo campos autorizados.
- Las observaciones internas nunca son públicas.
- La clave `service_role` nunca se usa en el navegador.
- Todas las tablas deben activar RLS.
- Las fotografías deben limitar formato, peso y dimensiones.
- El formulario “Encontré a esta mascota” requiere rate limiting y protección anti-spam.

## Administración

`noindex` no protege el administrador. La versión productiva debe utilizar:

- Supabase Auth.
- Roles de administrador.
- Cloudflare Access como barrera adicional.
- Registro de acciones sensibles.

## Pagos

- Validar pagos mediante webhook firmado.
- Nunca confiar en un parámetro enviado por el frontend.
- No guardar datos de tarjetas.

## Perfil público

El dueño controla si se muestran:

- Nombre.
- Teléfono.
- WhatsApp.
- Correo.
- Ciudad.
- Información médica.
- Indicaciones de comportamiento.
