# AppNova Locales · primera etapa

Prototipo independiente inspirado en los flujos de Kalu_Local. Kalu_Local no se modifica. Requiere un servidor HTTP local para cargar módulos JavaScript: desde esta carpeta ejecutar `python -m http.server 8000` y abrir `http://localhost:8000`. No requiere instalar dependencias de JavaScript.

## Estructura

- `index.html`: base semántica y navegación.
- `styles.css`: diseño adaptable.
- `src/store.js`: datos de ejemplo y persistencia `localStorage`.
- `src/app.js`: vistas, operaciones y eventos.

## Funciones

Selector de roles de demostración: Super Admin, dueño/administrador y vendedor. El Super Admin controla qué módulos aparecen para cada rol y configura solo proveedor y URL pública de referencia de la futura API tributaria. Hay Dashboard, Inventario, Ventas, Caja, Precios e Informes. Las ventas descuentan stock y requieren caja abierta. Informes permite filtrar por fecha y exportar CSV. Alertas de stock y suscripción pueden descartarse durante la sesión y reaparecen al volver a abrir la aplicación. `Restablecer demo` recupera los datos iniciales.

Los roles y la configuración visibles aquí son simulaciones de interfaz, no seguridad. **No introducir secretos, tokens ni claves tributarias:** `localStorage` no es un almacén seguro. Esta etapa no emite boletas o facturas ni consulta boletas históricas. Las fechas, productos y ventas iniciales son ficticios.

## Próxima etapa: Node.js y base de datos

Mantener `src/app.js` como capa de interfaz y reemplazar `src/store.js` por un repositorio que invoque una API (`/api/products`, `/api/sales`, `/api/cash`, `/api/reports`, `/api/settings`). En el servidor: autenticación, autorización por rol y módulo en cada ruta, validación de transacciones y stock, persistencia de movimientos y ventas, y secretos de proveedor tributario en variables de entorno o gestor de secretos. Separar emisión tributaria en un adaptador del proveedor; añadir búsqueda de boletas históricas en una etapa posterior. Migrar datos de prueba solo si se decide conservarlos.
