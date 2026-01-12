# API de Portafolio (`src/infra/api/portfolio`)

Este módulo implementa la comunicación con el backend para la gestión de activos adquiridos por los usuarios y su historial de movimientos. Implementa la interfaz `PortfolioRepository` del dominio.

## Archivos Principales

* **`PortfolioApiRepository.ts`**: Implementación del repositorio que gestiona las peticiones HTTP para obtener el estado actual del portafolio y el historial.
* **`portfolio.dto.ts`**: Definición de los objetos de transferencia de datos (DTO) para los elementos del portafolio y movimientos históricos.

## Características Clave

### 1. Consulta de Portafolio por Curso
Permite recuperar la lista de activos que un usuario posee dentro de un equipo/curso específico.
* **Método (`getByCourse`):** Obtiene los activos actuales, cantidades y precios promedio de compra.

### 2. Historial de Movimientos
Recupera el registro histórico de todas las transacciones realizadas.
* **Método (`getHistory`):** Devuelve una lista de movimientos (compra/venta) con detalles de precios, cantidades y el PnL realizado en el momento de la transacción.

## Estructura de Datos (DTOs)

### PortfolioItemDto
Representa un activo en posesión del usuario:
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `assetId` | `string` | Identificador del activo. |
| `quantity` | `number` | Cantidad total poseída. |
| `avgPrice` | `number` | Precio promedio de adquisición. |
| `profitOrLoss` | `number` | Ganancia o pérdida acumulada. |

### HistoryItemDto
Representa una transacción pasada:
| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `type` | `string` | Tipo de movimiento (Buy/Sell). |
| `price` | `number` | Precio al que se ejecutó la orden. |
| `realizedPnl` | `number` | Ganancia o pérdida realizada. |
| `date` | `string` | Fecha de la transacción. |

## Dependencias
* `httpClient`: Cliente base para peticiones autenticadas.
* `PortfolioRepository`: Interfaz definida en la capa de dominio.