# API de Lecciones (`src/infra/api/lessons`)

Módulo encargado de la recuperación de contenido educativo y material didáctico desde el servidor.

## Archivos Principales

* **`LessonsApiRepository.ts`**: Implementación que maneja el listado de lecciones y la construcción de URLs de recursos multimedia.

## Características Clave

### 1. Mapeo de Recursos Multimedia
El repositorio realiza una transformación importante de los datos crudos (DTO) a entidades de dominio:
* **Imágenes (Thumbnails):** Convierte strings binarios en URIs base64 (`data:image/png;base64,...`) para su visualización directa en componentes `Image`.
* **Video URLs:** Construye dinámicamente la URL del streaming de video utilizando el `API_GATEWAY_URL` configurado en las variables de entorno.

### 2. Obtención de Contenido
* **`getAll`**: Recupera todas las lecciones disponibles, mapeando campos como descripción, título e identificadores únicos.

## Estructura del DTO
* `id`: string
* `title`: string
* `description`: string
* `thumbnail`: string (binario/null)

## Dependencias
* `httpClient`: Para peticiones GET al endpoint `/api/lessons`.
* `ENV`: Para acceder a la configuración del Gateway de la API.