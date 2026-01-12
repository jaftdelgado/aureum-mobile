# Módulo de Portfolio (`src/features/portfolio`)

Este módulo orquesta la visualización del estado financiero del usuario, incluyendo el balance total, el rendimiento de sus activos y el historial de transacciones.

## Estructura del Directorio
src/features/portfolio/
├── components/        # UI: Resumen de balance, gráficas de PnL y tarjetas de activos
├── hooks/             # Lógica de cálculo de rendimiento en tiempo real (usePortfolio)
├── i18n/              # Traducciones para términos financieros (Profit, Loss, Equity)
└── screens/           # Pantalla principal del portafolio

## Características Principales

### 1. Enriquecimiento de Datos en Tiempo Real
El módulo no solo muestra datos estáticos; utiliza el hook `usePortfolio` para integrar los precios vivos del mercado.
* **Precios Dinámicos:** Se conecta a `useMarketStream` para obtener el último precio de los activos.
* **Cálculo de PnL:** Calcula automáticamente el valor actual de la inversión, la ganancia/pérdida no realizada y el porcentaje de rendimiento basado en el precio de mercado actual vs el precio promedio de compra.

### 2. Resumen Visual
* **Balance:** Componentes que muestran el equity total y el balance de efectivo.
* **Gráficas:** Visualización del rendimiento histórico (PnL) mediante `PortfolioPnLChart`.

### 3. Gestión de Estado de Carga
Implementa estados de carga refinados que esperan tanto la respuesta del servidor como el primer "snapshot" del mercado para evitar saltos visuales en los precios.

## Dependencias Clave
* `@tanstack/react-query`: Gestión de caché y sincronización del inventario.
* `useMarketStream`: Para la actualización de precios en vivo.
* `useAuth`: Para contextualizar el portafolio al usuario actual.