# Prompt maestro para Codex — PetID

Trabaja sobre el ZIP `petid-online-mvp.zip` que contiene una base funcional en HTML, CSS y JavaScript para PetID.

## Objetivo

Convertir progresivamente este prototipo en una aplicación productiva para:

- recibir solicitudes públicas de clientes;
- registrar mascotas y responsables;
- confirmar pagos de forma segura;
- preparar dos o tres propuestas de credencial;
- permitir que el cliente apruebe una propuesta;
- producir una credencial física o digital;
- generar un tag QR para el collar;
- mantener un perfil público móvil para contactar a la familia;
- operar también desde administración en ferias o atención presencial.

## Reglas obligatorias

1. No comenzar desde cero.
2. Ejecutar primero `npm run check`, `npm run dev` y `npm run build`.
3. No eliminar funciones existentes sin documentar el motivo.
4. Conservar las diez plantillas y sus nombres:
   - Guardián oscuro.
   - Deportivo rojo.
   - Kennel clásico.
   - Compañero jovial.
   - Urbano tech.
   - Blush elegante.
   - Lavanda premium.
   - Diva burdeo.
   - Dulce compañía.
   - Floral celeste.
5. No generar imágenes mediante IA.
6. No crear fondos, mascotas, mockups o decoraciones rasterizadas nuevas.
7. Trabajar con HTML, CSS, TypeScript/JavaScript, SVG simple, recursos existentes y fotografías del usuario.
8. No exponer secretos ni claves `service_role`.
9. No considerar `noindex` como seguridad.
10. No afirmar que las capturas de pantalla pueden impedirse completamente.
11. Mantener una copia de respaldo antes de refactorizar.
12. Después de cada fase, indicar archivos modificados, pruebas realizadas y pendientes.

## Auditoría inicial

Antes de modificar:

- revisar `README.md` y todos los documentos de `docs/`;
- revisar `index.html`, `admin.html`, `profile.html`;
- revisar `js/shared.js`, `js/customer.js`, `js/admin.js`, `js/profile.js`;
- revisar `supabase/migrations/001_petid_initial.sql`;
- revisar las referencias de `legacy/`;
- si se adjuntan `petid_index_v1.html`, `petid_index_v2.html` y `petid_index_v4_ajuste_foto.html`, compararlas con esta base y recuperar cualquier función útil no incorporada.

Actualizar `docs/ESTADO_ACTUAL.md` antes de la primera intervención importante.

## Entorno temporal

Usar inicialmente:

- Público: `https://petid-dev.inkpro.cl`
- Administración: `https://petid-admin-dev.inkpro.cl`

No usar la identidad visual de InkPRO dentro del producto. InkPRO es solamente el dominio temporal.

Centralizar URLs mediante variables de entorno:

```env
PUBLIC_SITE_URL=https://petid-dev.inkpro.cl
ADMIN_SITE_URL=https://petid-admin-dev.inkpro.cl
SUPABASE_URL=
SUPABASE_PUBLISHABLE_KEY=
PAYMENT_PROVIDER=
PAYMENT_PUBLIC_KEY=
```

Crear una función central `buildPublicPetUrl(publicSlug)` y no concatenar dominios en componentes aislados.

## Arquitectura objetivo

Preferencia:

- React.
- Vite.
- TypeScript.
- CSS modular o estructura CSS clara.
- Supabase Auth.
- PostgreSQL de Supabase.
- Supabase Storage.
- Cloudflare Pages.
- Pages Functions o backend seguro cuando sea necesario.

La migración a React debe hacerse por fases. No romper el prototipo mientras se realiza.

## Portal público

Debe permitir:

- elegir modalidad;
- subir fotografía;
- ingresar datos de mascota y responsable;
- configurar privacidad;
- seleccionar hasta tres estilos preferidos;
- revisar una muestra protegida;
- aceptar términos;
- crear una solicitud;
- iniciar pago real en fase posterior.

Modalidades:

1. Kit PetID físico.
2. PetID digital imprimible.
3. Perfil PetID.

El cliente no descarga la credencial final antes del pago. La vista previa debe:

- llevar marca de agua;
- utilizar baja resolución razonable;
- ocultar o invalidar el QR definitivo;
- no exponer el reverso completo;
- impedir descarga directa desde la interfaz;
- reconocer que no existe protección absoluta contra capturas.

## Flujo de pago

No confiar en el frontend.

1. Crear solicitud en base de datos.
2. Crear orden de pago desde backend o función segura.
3. Recibir webhook firmado del proveedor.
4. Validar firma y monto.
5. Actualizar `payment_status` en servidor.
6. Habilitar diseño y producción.

No almacenar datos de tarjetas.

## Propuestas de diseño

Agregar una entidad `design_proposals` con:

- `id`.
- `request_id`.
- `template_id`.
- configuración de foto;
- archivo de muestra;
- marca de agua;
- estado: borrador, enviada, aprobada, rechazada;
- comentario del cliente;
- fechas.

El cliente recibe un enlace privado para:

- ver dos o tres propuestas;
- aprobar una;
- solicitar una corrección breve.

La credencial final se genera después de pago y aprobación.

## Panel administrativo

Mantener y mejorar:

- solicitudes;
- búsqueda;
- estados de pago;
- estados de producción;
- creación manual para ferias;
- edición de mascota;
- privacidad;
- estado extraviado;
- ajuste de fotografía;
- selección de plantilla;
- impresión;
- exportación;
- tag QR;
- reimpresión;
- apertura del perfil público.

Estados de producción:

- solicitud recibida;
- pago pendiente;
- pagada;
- en diseño;
- propuesta enviada;
- corrección solicitada;
- diseño aprobado;
- en producción;
- enviada;
- entregada;
- finalizada.

## Credenciales

Conservar los diez diseños como componentes programados y editables.

Cada credencial debe poder incluir:

- fotografía;
- nombre;
- código PetID;
- especie;
- raza;
- sexo;
- nacimiento o edad;
- responsable cuando corresponda;
- título o personalidad;
- QR;
- frente y reverso.

Mantener ajuste de foto:

- cargar;
- mover horizontal y verticalmente;
- ampliar o reducir;
- cubrir o contener;
- brillo básico;
- restablecer;
- conservar encuadre al cambiar de plantilla.

Agregar exportación PNG y PDF de alta resolución sin depender obligatoriamente de CDNs externos.

## Tag QR

Mantener:

- circular;
- rectangular con bordes redondeados;
- medalla o hueso simplificado.

Cara frontal:

- nombre;
- “Escanéame”;
- identidad PetID.

Cara posterior:

- QR;
- código PetID;
- “Si estoy perdido, escanea este código”.

El tag y la credencial usan exactamente el mismo QR.

No venderlo como GPS ni AirTag.

Añadir pruebas de tamaño y advertencia cuando el QR sea demasiado pequeño.

## Identidad y URLs

Código visible:

`PETID-2026-000001`

URL pública:

`/p/:publicSlug`

El `publicSlug` debe ser aleatorio y difícil de adivinar. No usar IDs secuenciales de base de datos en la URL.

## Perfil público

Diseño móvil primero.

Mostrar solo campos autorizados:

- foto;
- nombre;
- código PetID;
- especie;
- raza;
- sexo;
- edad;
- ciudad;
- información médica;
- comportamiento;
- llamada;
- WhatsApp;
- correo opcional;
- estado extraviado;
- formulario “Encontré a esta mascota”.

No mostrar dirección exacta.

La lectura pública debe realizarse mediante RPC, vista segura o endpoint que devuelva solamente datos permitidos.

## Modo extraviado

Permitir:

- marcar como extraviada;
- fecha;
- último lugar;
- mensaje;
- contacto preferido;
- recompensa opcional;
- marcar como encontrada;
- historial de estado.

## Supabase

Implementar progresivamente la migración incluida.

Tablas mínimas:

- `profiles`.
- `owners`.
- `customer_requests`.
- `pets`.
- `pet_status_history`.
- `design_proposals`.
- `finder_messages`.
- `qr_scans`.

Storage:

- fotografías públicas separadas de documentos privados;
- nombres únicos;
- JPG, PNG o WebP;
- límites de peso y dimensiones;
- compresión;
- reemplazo y limpieza de archivo anterior.

RLS:

- habilitar en todas las tablas;
- anónimos no pueden listar mascotas ni responsables;
- perfil público solo por función segura y slug;
- responsables acceden a sus registros;
- administradores acceden según rol;
- `service_role` solo en servidor.

## Protección antiabuso

Añadir:

- rate limiting;
- Cloudflare Turnstile o alternativa;
- validación de formularios en servidor;
- límites de mensajes;
- sanitización;
- auditoría de cambios sensibles.

## Publicación

Mantener:

- `npm run dev`.
- `npm run build`.
- `npm run check`.

Preparar Cloudflare Pages:

- build command: `npm run build`;
- output: `dist`;
- `_redirects` para `/p/:slug`;
- `_headers`;
- `robots.txt`;
- 404;
- variables por ambiente;
- previews por rama.

Proteger administración con:

- Supabase Auth;
- rol de administrador;
- Cloudflare Access.

## Migración futura de dominio

Mantener `docs/MIGRACION_DOMINIO.md`.

Cuando exista dominio definitivo:

- cambiar variables;
- preservar `/p/:publicSlug`;
- mantener redirección permanente desde `petid-dev.inkpro.cl`;
- no invalidar QR impresos.

## Fases

### Fase 1

- Auditoría.
- Ejecutar base.
- Corregir errores.
- Confirmar las diez plantillas.
- Mejorar accesibilidad y pruebas.

### Fase 2

- Migrar estructura a React/Vite/TypeScript sin perder funciones.
- Separar componentes.
- Mantener modo demo.

### Fase 3

- Supabase Auth, tablas, RLS y Storage.
- Persistencia compartida.
- Perfil público real.

### Fase 4

- Pagos y webhooks.
- Propuestas privadas.
- Aprobación del cliente.

### Fase 5

- Exportación profesional.
- Producción, despacho y notificaciones.
- Pruebas físicas de QR.

### Fase 6

- Cloudflare Pages.
- Subdominios temporales.
- Cloudflare Access.
- Pruebas desde dispositivos distintos.

## Entregables por fase

- código completo;
- build exitoso;
- pruebas realizadas;
- migraciones;
- archivos modificados;
- pendientes;
- instrucciones de uso;
- commit descriptivo;
- ZIP de respaldo.

No entregar solamente fragmentos. Mantener siempre una versión ejecutable.
