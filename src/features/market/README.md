# Módulo de Market (`src/features/market`)

Este módulo encapsula la lógica de presentación y orquestación d...ado de activos, visualización, selección y ejecución de trades (buy/sell) para un equipo.

## Estructura del Directorio
src/features/market/
├── components/        # Componentes de UI (listas, header actions, chart, settings UI)
├── constants/         # Constantes del módulo (keys, defaults, labels internos)
├── hooks/             # Orquestación de casos de uso y estado (stream, trading, assets)
├── i18n/              # Archivos de traducción específicos del módulo
├── navigation/        # Navigator y tipos de rutas (MarketNavigator, ParamList)
├── resources/         # Recursos estáticos (si aplica)
├── schemas/           # Helpers/validaciones de dominio del feature (selección, auth, trade rules)
├── screens/           # Pantallas principales (MarketScreen, MarketSettingsScreen)
└── utils/             # Utilidades del módulo (mapeo de errores a mensajes i18n)


Características Principales
1. Streaming de Mercado (Tiempo Real)
El módulo consume un stream de snapshots del mercado (useMarketStream) y mantiene el estado del último snapshot recibido para renderizar precios y tendencias.

2. Trading (Buy / Sell)
Se integra con casos de uso de compra/venta mediante useMarketTrading y expone un API simple (buy, sell, loading, error, lastTrade) para las pantallas.

3. Presentación Unificada (Presenter)
useMarketPresenter centraliza la lógica de UI: selección de activo, validaciones, acciones de compra/venta y mensajes al usuario (Alert + i18n). Esto reduce lógica en screens y mantiene responsabilidades claras.

4. Validaciones del Feature (schemas/)
Contiene validaciones y helpers de flujo (por ejemplo: selección válida, auth requerida, normalización de símbolos, canTrade) para mantener reglas de interacción coherentes entre componentes.


Dependencias Clave
@react-navigation/native + native-stack: Navegación del stack del Market.

react-i18next: Textos internacionalizados del módulo.

@tanstack/react-query: (Si aplica en settings/config) para cache y mutaciones de configuración del market.

react-native: Alert y componentes base para UX de errores/confirmaciones.


Notas de Implementación
Separación por capas: Este feature NO implementa transporte; consume casos de uso y repositorios ya resueltos por la capa infra (MarketApiRepository y/o MarketConfigApiRepository).

Errores de trading: Los mensajes visibles deben mapearse vía utils/marketErrorMapper.ts y llaves en i18n/ para evitar strings hardcodeadas.

Selección: El flujo asume selección única para operar (selectedIds.length === 1). Si se expande a multi-selección, actualizar schemas/ y presenter.
