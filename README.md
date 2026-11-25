# AppNova Locales · primera etapa

Prototipo independiente inspirado en los flujos de Kalu_Local. Kalu_Local no se modifica. Requiere un servidor HTTP local para cargar módulos JavaScript: desde esta carpeta ejecutar `python -m http.server 8000` y abrir `http://localhost:8000`. No requiere instalar dependencias de JavaScript.

## Estructura

- `index.html`: base semántica y navegación.
- `styles.css`: diseño adaptable.
- `src/store.js`: datos de ejemplo y persistencia `localStorage`.
- `src/app.js`: vistas, operaciones y eventos.
- `src/catalog.js`: plantilla, lectura y validación de importaciones.
- `vendor/exceljs.min.js`: lectura y generación local de archivos Excel (licencia incluida).

## Funciones

Selector de roles de demostración: Super Admin, dueño/administrador y vendedor. El Super Admin controla qué módulos aparecen para cada rol y configura solo proveedor y URL pública de referencia de la futura API tributaria. Hay Dashboard, Inventario, Ventas, Caja, Precios e Informes. Las ventas descuentan stock y requieren caja abierta. Informes permite filtrar por fecha y exportar CSV. Alertas de stock y suscripción pueden descartarse durante la sesión y reaparecen al volver a abrir la aplicación. `Restablecer demo` recupera los datos iniciales.

Los roles y la configuración visibles aquí son simulaciones de interfaz, no seguridad. **No introducir secretos, tokens ni claves tributarias:** `localStorage` no es un almacén seguro. Esta etapa no emite boletas o facturas ni consulta boletas históricas. Las fechas, productos y ventas iniciales son ficticios.

## Personalización y carga masiva

En **Marca**, el Super Admin o dueño puede cambiar nombre, texto secundario y logo (PNG, JPEG o WebP de hasta 500 KB). En **Inventario** y **Precios** se puede descargar el modelo `modelo-productos.xlsx` o CSV. Completar las columnas `sku`, `nombre`, `precio`, `stock`, `stock_minimo`, sin modificar los encabezados. Los importes y existencias deben ser enteros no negativos. Al importar, un SKU nuevo agrega un producto; uno existente actualiza nombre, precio, stock y mínimo. El sistema valida todas las filas antes de aplicar cambios y pide confirmación con el número de productos nuevos y actualizados. La búsqueda filtra por nombre o SKU; las casillas permiten seleccionar varios productos visibles y eliminarlos en un movimiento.

Los datos, la marca y el logo quedan solo en el navegador y origen HTTP usados. Para replicar la demo en otro local, copie la carpeta y configure su marca; para uso real, lleve la persistencia y los permisos al servidor. El borrado de un producto no borra ventas históricas: estas muestran «Producto eliminado». La biblioteca ExcelJS se distribuye bajo licencia MIT en `vendor/EXCELJS-LICENSE.txt`.

## Próxima etapa: Node.js y base de datos

Mantener `src/app.js` como capa de interfaz y reemplazar `src/store.js` por un repositorio que invoque una API (`/api/products`, `/api/sales`, `/api/cash`, `/api/reports`, `/api/settings`). En el servidor: autenticación, autorización por rol y módulo en cada ruta, validación de transacciones y stock, persistencia de movimientos y ventas, y secretos de proveedor tributario en variables de entorno o gestor de secretos. Separar emisión tributaria en un adaptador del proveedor; añadir búsqueda de boletas históricas en una etapa posterior. Migrar datos de prueba solo si se decide conservarlos.
