# 👥 API de Equipos (`src/infra/api/teams`)

Este módulo implementa la comunicación con el backend para todas las operaciones relacionadas con la gestión de cursos (equipos) y membresías. Actúa como la capa de infraestructura que implementa la interfaz `TeamsRepository` del dominio.

## 📂 Archivos Principales

* **`TeamsApiRepository.ts`**: Implementación concreta del repositorio. Maneja las peticiones HTTP y la transformación de errores.
* **`team.dto.ts`**: Definición de tipos de datos que vienen del servidor (Data Transfer Objects).
* **`team.mappers.ts`**: Funciones puras para transformar los DTOs en entidades de dominio (`Team`, `TeamMember`).

## 🛠️ Características Clave

### 1. Gestión de Cursos
Permite listar cursos según el rol del usuario y crear nuevos cursos con soporte para subida de imágenes.

* **Listado (`getProfessorTeams`, `getStudentTeams`):**
    * Maneja automáticamente el error **404** del backend (usuario sin cursos) devolviendo un arreglo vacío `[]` para no romper la UI.
* **Creación (`createTeam`):**
    * Utiliza `FormData` para enviar datos multipart (texto + imagen).
    * Detecta y transforma el error **413 (Payload Too Large)** si la imagen excede el límite del servidor.

### 2. Gestión de Miembros
Maneja la lógica compleja de obtener la lista de estudiantes y sus perfiles asociados.

* **Carga Resiliente (`getTeamMembers`):**
    * Realiza una carga en dos pasos: primero obtiene las membresías y luego los perfiles públicos en paralelo.
    * Implementa tolerancia a fallos parciales: si el perfil de un estudiante falla al cargar, se devuelve un objeto "Usuario Desconocido" en lugar de fallar toda la lista.
    * Maneja **404** si el curso no existe.

### 3. Membresía y Acceso
* **Unirse (`joinTeam`):**
    * Envía el código de acceso al backend.
    * Transforma errores específicos de negocio:
        * **404:** `TEAM_NOT_FOUND` (Código incorrecto).
        * **409:** `TEAM_ALREADY_MEMBER` (Ya estás en el curso).

## ⚠️ Manejo de Errores Específico

Este módulo intercepta errores HTTP para lanzar excepciones de dominio controladas que la capa de presentación puede traducir.

| Error HTTP | Excepción Lanzada | Significado |
| :--- | :--- | :--- |
| **404** (Join) | `TEAM_NOT_FOUND` | El código de curso no existe. |
| **409** (Join) | `TEAM_ALREADY_MEMBER` | El usuario ya pertenece al curso. |
| **413** (Create) | `IMAGE_TOO_LARGE_SERVER` | La imagen de portada es muy pesada. |
| **404** (List) | (Retorna `[]`) | El usuario no tiene cursos (no es error). |

## 📦 Dependencias

* `httpClient` (`../http/client`): Cliente base para peticiones autenticadas.
* `ProfileApiRepository` (`../users/ProfileApiRepository`): Reutilizado para obtener detalles de los miembros.