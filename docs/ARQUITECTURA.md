# Arquitectura propuesta

## Superficies

### Portal público

Ruta principal `/`.

Responsabilidades:

- Explicar productos.
- Capturar datos y fotografía.
- Registrar preferencias de diseño.
- Configurar privacidad.
- Iniciar el pago en la etapa productiva.
- Crear una solicitud, no una credencial final descargable.

### Administración

Ruta temporal `/admin.html` y futuro subdominio `petid-admin-dev.inkpro.cl`.

Responsabilidades:

- Revisar solicitudes.
- Confirmar pagos.
- Crear dos o tres propuestas.
- Ajustar fotografía.
- Elegir plantilla.
- Activar el perfil.
- Imprimir o exportar.
- Producir credencial y tag.
- Gestionar entrega y estado extraviado.

### Perfil público

Ruta `/p/:publicSlug`.

Responsabilidades:

- Mostrar solo los datos autorizados.
- Permitir llamada y WhatsApp.
- Mostrar modo extraviado.
- Recibir avisos de hallazgo.

## Datos productivos

- Supabase Auth: usuarios y administradores.
- PostgreSQL: solicitudes, responsables, mascotas, estados y avisos.
- Supabase Storage: fotografías.
- RPC o endpoint seguro: perfil público filtrado.
- Row Level Security: prohibir lectura directa anónima de datos privados.

## Pago

El proveedor debe integrarse en backend o función segura. El navegador nunca debe decidir por sí solo que un pago fue aprobado.

Flujo:

1. Se crea la solicitud.
2. Backend crea la orden de pago.
3. Proveedor informa el resultado mediante webhook firmado.
4. Backend actualiza `payment_status`.
5. Administración habilita propuestas y producción.

## Propuestas

Crear una entidad `design_proposals` en la siguiente fase:

- Solicitud.
- Plantilla.
- Configuración de foto.
- Archivo de muestra con marca de agua.
- Estado: borrador, enviada, aprobada, rechazada.
- Comentario del cliente.

El archivo final de impresión se genera únicamente después del pago y la aprobación.
