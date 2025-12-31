# 👤 API de Usuarios (`src/infra/api/users`)

Este módulo implementa la comunicación con el backend para todas las operaciones relacionadas con el perfil del usuario. Actúa como la capa de infraestructura que implementa la interfaz `ProfileRepository` del dominio.

## 📂 Archivos Principales

* **`ProfileApiRepository.ts`**: Implementación concreta del repositorio. Maneja las peticiones HTTP y la subida de archivos (avatares).
* **`profile.dto.ts`**: Definición de tipos de datos que vienen del servidor (Data Transfer Objects).
* **`profile.mappers.ts`**: Funciones puras para transformar los DTOs en entidades de dominio (`UserProfile`).

## 🛠️ Características Clave

### 1. Gestión de Perfiles
Permite obtener, crear y actualizar la información del usuario autenticado.

* **Consulta (`getProfile`, `getPublicProfile`):**
    * Recupera la información del usuario (nombre, biografía, rol).
    * Maneja la carga paralela del avatar si el usuario tiene uno asignado.
    * Implementa una política de **reintentos automática** para la descarga de imágenes (ver sección Resiliencia).

### 2. Gestión de Avatares (Imágenes)
Maneja la subida y descarga de fotos de perfil.

* **Subida (`uploadAvatar`):**
    * Utiliza `FormData` para enviar la imagen como `multipart/form-data`.
    * Transforma el objeto `ReactNativeFile` al formato compatible con `axios` en React Native.
* **Descarga (`getBlob`):**
    * Descarga la imagen como `Blob` y la convierte a Base64 localmente para su renderizado.

### 3. Registro y Borrado
* **Creación (`createProfile`):** Se llama durante el flujo de registro para inicializar los datos del usuario en PostgreSQL.
* **Eliminación (`deleteAccount`):** Permite al usuario borrar su perfil y datos asociados.

## ⚠️ Manejo de Errores y Resiliencia

Este módulo implementa estrategias avanzadas para garantizar una buena experiencia de usuario incluso con fallos de red parciales.

| Estrategia | Descripción |
| :--- | :--- |
| **Retry en Imágenes** | Si la descarga del avatar falla, el repositorio reintenta hasta 3 veces con un *backoff* de 1s antes de rendirse. |
| **Degradación Graciosa** | Si el avatar no carga tras los reintentos, el perfil se devuelve con `avatarUrl: undefined` (mostrando un placeholder), en lugar de fallar toda la pantalla. |
| **Manejo de 404** | Si el perfil no existe (`getProfile`), devuelve `null` para que la capa de dominio pueda redirigir al flujo de registro. |

## 📦 Dependencias

* `httpClient` (`../http/client`): Cliente base para peticiones autenticadas.
* `@core/utils/fileUtils`: Utilidad para convertir `Blob` a Base64.