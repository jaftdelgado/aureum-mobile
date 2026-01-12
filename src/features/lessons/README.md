#  Módulo de Lecciones (`src/features/lessons`)

Este módulo gestiona la presentación de contenido educativo para los usuarios, permitiendo listar y acceder a materiales de aprendizaje.

##  Estructura del Directorio
src/features/lessons/
├── hooks/             # Hook useLessons para gestión de estado y carga
├── i18n/              # Textos de la interfaz (Loading lessons, Error messages)
└── screens/           # Vista de lista de lecciones (LessonsScreen)

## Características Principales

### 1. Gestión de Estado Simplificada
Utiliza el hook `useLessons` para encapsular la lógica de carga:
* **Refetch:** Permite recargar el contenido manualmente mediante una función de refresco.
* **Control de Errores:** Maneja estados de error amigables para el usuario si la API falla.

### 2. Interfaz de Usuario
* **Visualización de Contenido:** Renderiza una lista de lecciones con previsualizaciones (thumbnails) y títulos.
* **Integración con Dominio:** Consume directamente el caso de uso `getLessonsUseCase` definido en la capa de Inyección de Dependencias (`di.ts`).

## Notas de Implementación
* **Carga Inicial:** Las lecciones se cargan automáticamente al montar el componente mediante un `useEffect`.
* **Navegación:** La pantalla está diseñada para listar contenidos que posteriormente redirigen al reproductor de video o detalle de la lección.