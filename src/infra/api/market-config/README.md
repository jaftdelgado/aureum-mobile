# API de Configuración de Mercado (`src/infra/api/market-config`)

Este módulo implementa la comunicación con el backend para todas las operaciones relacionadas con la configuración de mercados de simulación. Actúa como la capa de infraestructura que implementa la interfaz `MarketConfigRepository` del dominio.

## Archivos Principales

* **`MarketConfigApiRepository.ts`**: Implementación concreta del repositorio. Maneja las peticiones HTTP y la transformación de datos.
* **`marketConfig.dto.ts`**: Definición de tipos de datos que vienen del servidor (Data Transfer Objects) y tipos enumerados para configuraciones.
* **`marketConfig.mappers.ts`**: Funciones puras bidireccionales para transformar entre DTOs y entidades de dominio (`MarketConfig`).

## Características Clave

### 1. Consulta de Configuración

Permite obtener la configuración de mercado asociada a un equipo específico.

* **Obtener Configuración (`getMarketConfig`):**
    * Recupera la configuración completa del mercado mediante el `teamPublicId`.
    * Retorna todos los parámetros de simulación configurados para el equipo.
    * Transforma automáticamente las fechas de creación y actualización a objetos `Date`.

### 2. Creación de Configuración

Permite crear una nueva configuración de mercado para un equipo.

* **Crear Configuración (`createMarketConfig`):**
    * Acepta una entidad `MarketConfig` del dominio.
    * Transforma la entidad a formato DTO antes de enviarla al servidor.
    * Convierte las fechas a formato ISO string para el backend.
    * Retorna la configuración creada con los datos del servidor.

### 3. Actualización de Configuración

Permite modificar la configuración existente de un mercado.

* **Actualizar Configuración (`updateMarketConfig`):**
    * Utiliza el `teamId` de la configuración para identificar el recurso a actualizar.
    * Transforma la entidad completa a DTO antes de enviarla.
    * Realiza una actualización completa (PUT) de todos los campos.
    * Retorna la configuración actualizada desde el servidor.

## Estructura de Datos

### MarketConfigDTO

Representa la estructura de datos que maneja el servidor (snake_case):

| Campo | Tipo | Descripción |
| :--- | :--- | :--- |
| `public_id` | `string` | Identificador único de la configuración. |
| `team_id` | `string` | Identificador del equipo asociado. |
| `initial_cash` | `number` | Capital inicial para cada participante. |
| `currency` | `Currency` | Moneda del mercado: USD, EUR o MXN. |
| `market_volatility` | `Volatility` | Nivel de volatilidad del mercado. |
| `market_liquidity` | `Volatility` | Nivel de liquidez del mercado. |
| `thick_speed` | `ThickSpeed` | Velocidad de actualización de precios. |
| `transaction_fee` | `TransactionFee` | Nivel de comisiones por transacción. |
| `event_frequency` | `TransactionFee` | Frecuencia de eventos de mercado. |
| `dividend_impact` | `TransactionFee` | Impacto de dividendos en el mercado. |
| `crash_impact` | `TransactionFee` | Impacto de eventos de crash. |
| `allow_short_selling` | `boolean` | Permite ventas en corto. |
| `created_at` | `string?` | Fecha de creación (ISO string, opcional). |
| `updated_at` | `string?` | Fecha de actualización (ISO string, opcional). |

### Tipos Enumerados

El módulo define varios tipos para garantizar valores válidos:

**Currency**
```
'USD' | 'EUR' | 'MXN'
```

**Volatility**
```
'High' | 'Medium' | 'Low' | 'Disabled'
```

**ThickSpeed**
```
'High' | 'Medium' | 'Low'
```

**TransactionFee**
```
'High' | 'Medium' | 'Low' | 'Disabled'
```

## Transformación de Datos

Los mappers implementan transformación bidireccional entre DTO y entidad:

### mapMarketConfigDTOToEntity

Transforma datos del servidor a entidad de dominio:

* Convierte nombres de campos de `snake_case` a `camelCase`.
* Transforma strings ISO de fechas (`created_at`, `updated_at`) a objetos `Date`.
* Si las fechas no están presentes, asigna `new Date()` como valor por defecto.
* Preserva los valores de tipos enumerados sin transformación.

### mapMarketConfigEntityToDTO

Transforma entidad de dominio a formato del servidor:

* Convierte nombres de campos de `camelCase` a `snake_case`.
* Transforma objetos `Date` a strings ISO usando `toISOString()`.
* Maneja correctamente fechas opcionales que pueden ser `undefined`.
* Prepara los datos en el formato exacto que espera el backend.

## Flujo de Operaciones

### Lectura (GET)
```
Backend (DTO snake_case) → mapMarketConfigDTOToEntity → Dominio (camelCase)
```

### Escritura (POST/PUT)
```
Dominio (camelCase) → mapMarketConfigEntityToDTO → Backend (DTO snake_case)
```

## Parámetros de Configuración

La configuración de mercado permite ajustar múltiples aspectos de la simulación:

* **Económicos**: Capital inicial, moneda, comisiones de transacción.
* **Comportamiento del Mercado**: Volatilidad, liquidez, velocidad de actualización.
* **Eventos**: Frecuencia de eventos, impacto de dividendos y crashes.
* **Reglas**: Permitir o prohibir ventas en corto.

## Dependencias

* `httpClient` (`../http/client`): Cliente base para peticiones autenticadas.
* `MarketConfig` (`@domain/entities/MarketConfig`): Entidad de dominio que representa la configuración.
* `MarketConfigRepository` (`@domain/repositories/MarketConfigRepository`): Interfaz del repositorio que implementa este módulo.
