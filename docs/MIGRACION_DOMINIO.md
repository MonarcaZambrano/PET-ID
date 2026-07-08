# Migración de dominio

## Entorno temporal

- `petid-dev.inkpro.cl`
- `petid-admin-dev.inkpro.cl`

## Dominio definitivo

Cuando exista el dominio PetID:

1. Cambiar `PUBLIC_SITE_URL` y `ADMIN_SITE_URL`.
2. Mantener exactamente la ruta `/p/:publicSlug`.
3. Configurar redirección permanente desde el dominio temporal.
4. Conservar el mismo slug de cada mascota.
5. No eliminar el subdominio temporal si ya existen QR impresos.

Ejemplo:

`https://petid-dev.inkpro.cl/p/a8K4mP92xR5q`

Debe redirigir a:

`https://dominio-petid.cl/p/a8K4mP92xR5q`

La redirección debe preservar toda la ruta. Así, las credenciales y tags antiguos continúan funcionando.
