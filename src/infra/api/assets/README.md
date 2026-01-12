# API de Activos (`src/infra/api/assets`)

Este módulo implementa la comunicación con el backend para todas las operaciones relacionadas con la gestión de activos financieros. Actúa como la capa de infraestructura que implementa la interfaz `AssetRepository` del dominio.

## Archivos Principales

* **`AssetApiRepository.ts`**: Implementación concreta del repositorio. Maneja las peticiones HTTP y la transformación de datos.
* **`asset.dto.ts`**: Definición de tipos de datos que vienen del servidor (Data Transfer Objects).
* **`asset.mappers.ts`**: Funciones puras para transformar los DTOs en entidades de dominio (`Asset`).

## Características Clave

### 1. Consulta de Activos con Paginación

Permite obtener listas de activos con soporte completo para filtrado, ordenamiento y paginación.

* **Listado (`getAssets`):**
    * Soporta múltiples parámetros de consulta: búsqueda por texto, tipo de activo, precio base, categoría.
    * Implementa ordenamiento flexible por precio (`orderByBasePrice`) o nombre (`orderByAssetName`).
    * Maneja paginación con control de página (`page`) y límite de resultados (`limit`).
    * Permite priorizar activos específicos mediante `selectedAssetIds`, útil para mostrar activos seleccionados primero.

### 2. Consulta Individual de Activos

Obtiene los detalles completos de un activo específico por su identificador.

* **Detalle (`getAssetById`):**
    * Recupera información completa de un activo mediante su `publicId`.
    * Soporta el parámetro `selectedAssetIds` para marcar el activo como seleccionado si corresponde.

### 3. Gestión de Activos Seleccionados

Implementa lógica especial para manejar activos previamente seleccionados por el usuario.

* **Priorización:**
    * Acepta `selectedAssetIds` tanto como parte del query como argumento separado.
    * Prioriza el array del query si está presente, de lo contrario usa el argumento.
    * Los IDs seleccionados se envían como parámetros de query múltiples al backend.
    * Los mappers marcan automáticamente los activos como `isSelected` si su ID está en la lista.

## Estructura de Datos

### AssetDTO

Representa la estructura de datos que retorna el servidor:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `publicId` | `string` | Identificador único del activo. |
| `assetSymbol` | `string` | Símbolo o ticker del activo (ej: "AAPL"). |
| `assetName` | `string` | Nombre completo del activo. |
| `assetType` | `string` | Tipo de activo (ej: "stock", "crypto"). |
| `basePrice` | `number` | Precio base del activo. |
| `volatility` | `number?` | Volatilidad del activo (opcional). |
| `drift` | `number?` | Tendencia de precio (opcional). |
| `maxPrice` | `number?` | Precio máximo histórico (opcional). |
| `minPrice` | `number?` | Precio mínimo histórico (opcional). |
| `dividendYield` | `number?` | Rendimiento por dividendos (opcional). |
| `liquidity` | `number?` | Nivel de liquidez del activo (opcional). |
| `logoUrl` | `string?` | URL del logo del activo (opcional). |
| `category` | `object?` | Categoría del activo con `categoryId` y `categoryKey` (opcional). |

### GetAssetsQueryDTO

Parámetros disponibles para filtrar y ordenar la consulta de activos:

| Parámetro | Tipo | Descripción |
| :--- | :--- | :--- |
| `page` | `number?` | Número de página (paginación). |
| `limit` | `number?` | Cantidad de resultados por página. |
| `search` | `string?` | Búsqueda por texto en nombre o símbolo. |
| `assetType` | `string?` | Filtrar por tipo de activo. |
| `basePrice` | `number?` | Filtrar por precio base. |
| `categoryId` | `number?` | Filtrar por categoría. |
| `orderByBasePrice` | `'ASC' \| 'DESC'?` | Ordenar por precio ascendente o descendente. |
| `orderByAssetName` | `'ASC' \| 'DESC'?` | Ordenar por nombre alfabéticamente. |
| `selectedAssetIds` | `string[]?` | IDs de activos seleccionados para priorizar. |

### PaginatedResultDTO

Estructura de respuesta paginada del servidor:

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `data` | `T[]` | Array de elementos de la página actual. |
| `meta.totalItems` | `number` | Total de elementos en todas las páginas. |
| `meta.itemCount` | `number` | Cantidad de elementos en la página actual. |
| `meta.itemsPerPage` | `number` | Límite de elementos por página. |
| `meta.totalPages` | `number` | Total de páginas disponibles. |
| `meta.currentPage` | `number` | Número de página actual. |

## Transformación de Datos

Los mappers realizan las siguientes transformaciones:

* **`mapAssetDTOToEntity`:**
    * Convierte `logoUrl` a `assetPicUrl` en la entidad de dominio.
    * Transforma el objeto `category` del DTO a la estructura esperada por el dominio.
    * Asigna valores `null` explícitos a campos opcionales que vienen como `undefined`.
    * Calcula la propiedad `isSelected` verificando si el `publicId` está en `selectedAssetIds`.

* **`mapPaginatedAssetsDTOToEntity`:**
    * Aplica `mapAssetDTOToEntity` a cada elemento del array `data`.
    * Preserva la metadata de paginación (`meta`) sin transformaciones.

## Construcción de Query Strings

El repositorio implementa una lógica robusta para construir URLs con parámetros:

1. Separa `selectedAssetIds` del resto de parámetros del query.
2. Itera sobre los parámetros restantes, agregando solo aquellos que no sean `undefined` o `null`.
3. Agrega cada ID seleccionado como un parámetro separado (`selectedAssetIds=id1&selectedAssetIds=id2`).
4. Construye la URL final con todos los parámetros codificados correctamente.

## Dependencias

* `httpClient` (`../http/client`): Cliente base para peticiones autenticadas.
* `Asset` (`@domain/entities/Asset`): Entidad de dominio que representa un activo.
* `AssetRepository` (`@domain/repositories/AssetRepository`): Interfaz del repositorio que implementa este módulo.
