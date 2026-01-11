# API de Market (`src/infra/api/market`)

Este módulo implementa el acceso a la API del mercado actuando ...n “adaptador” de infraestructura: envía requests/stream y transforma DTOs en entidades de dominio.

## Estructura del Directorio
src/infra/api/market/
├── MarketApiRepository.ts  # Implementación concreta de MarketRepository (stream, buy, sell)
├── market.dto.ts           # Definiciones de tipos (DTO) esperadas desde el gateway/API
└── market.mappers.ts       # Transformación de datos (DTO -> Domain Entities)


Componentes Clave
1. Repository (MarketApiRepository.ts)
Implementa la interfaz MarketRepository del dominio y expone:
- subscribeToMarket(courseId/teamPublicId, handlers): Suscripción al stream de snapshots
- buyAsset(params): Compra de un activo
- sellAsset(params): Venta de un activo

Internamente delega el transporte a MarketGrpcClient y aplica mappers para entregar entidades del dominio.

2. DTOs (market.dto.ts)
Define las estructuras de entrada/salida del gateway. Se soportan variantes de naming (PascalCase y camelCase) para robustez ante diferencias del backend:
- MarketSnapshotDTO (timestamp, assets)
- MarketAssetDTO (id/symbol/name/price/basePrice/volatility)
- TradeResultDTO + TradeNotificationDTO

3. Mappers (market.mappers.ts)
Convierte DTOs a entidades del dominio, saneando valores faltantes y normalizando:
- mapSnapshot(dto) -> MarketSnapshot
- mapTradeResult(dto) -> TradeResult
Incluye manejo defensivo de timestamps (string | number) con fallback a Date().


Dependencias Externas
MarketGrpcClient (@infra/api/http/marketGrpcClient): Cliente de transporte (HTTP + streaming) contra el API Gateway.

supabase (@infra/external/supabase): Fuente del access token de sesión para Authorization: Bearer <token>.

XMLHttpRequest: Implementación de streaming y requests en entorno React Native/Expo (según el cliente).


Notas de Seguridad
Este módulo NO debe contener lógica de negocio compleja; solo debe actuar como puente de transporte y transformación de datos.

Autenticación: Las llamadas incluyen token cuando existe sesión activa. El token se obtiene desde supabase.auth.getSession() en el cliente de transporte.

Endpoints esperados (vía gateway):
- POST /api/market/buy/
- POST /api/market/sell/
- GET  /api/market/stream/{teamPublicId}
