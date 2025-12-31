# 🌐 Cliente HTTP (`src/infra/api/http`)
Este módulo provee la instancia central de comunicación con el backend (API Gateway). Encapsula la librería de peticiones (actualmente `axios`), maneja la inyección automática de tokens de seguridad y normaliza el manejo de errores para toda la aplicación.


## 📂 Archivos Principales
* **`client.ts`**: Configuración principal de Axios, interceptores y la clase `HttpClient`.
* **`devClient.ts`**: (Opcional) Cliente alternativo para entornos de desarrollo o mock servers.


## 🛠️ Características Implementadas
### 1. Inyección Automática de Auth
El cliente utiliza interceptores (`axiosInstance.interceptors.request`) para obtener la sesión actual de Supabase e inyectar el `access_token` en el header `Authorization` de cada petición.

```typescript
// Ejemplo simplificado de lo que ocurre internamente
config.headers.Authorization = `Bearer ${token}`;


2. Manejo de Errores Centralizado
La clase HttpClient envuelve las peticiones para capturar errores técnicos y transformarlos en excepciones tipadas (HttpError).

Timeout (408): Detecta si una petición tarda demasiado (configurado a 15s por defecto) y lanza un error específico para que la UI avise al usuario.

Errores de Servidor (5xx): Dispara eventos globales de desconexión si el servidor no responde.

Errores de Autenticación (401): Si el token expira o es inválido, el interceptor de respuesta emite un evento emitLogout para cerrar la sesión de la app automáticamente.


3. Métodos HTTP Tipados
La clase HttpClient expone métodos genéricos (get<T>, post<T>, etc.) que permiten tipar la respuesta esperada en los repositorios, mejorando la seguridad de tipos en toda la app.

TypeScript
const data = await httpClient.get<UserProfileDTO>('/users/me');


⚙️ Configuración
El cliente lee la URL base de la variable de entorno EXPO_PUBLIC_API_GATEWAY_URL.

Timeout: 15,000ms (15 segundos).

Content-Type: application/json (por defecto).


⚠️ Notas para Desarrolladores
No usar axios directamente: Siempre importar httpClient desde este módulo en los repositorios. Esto asegura que la autenticación y el manejo de errores funcionen.

Subida de Archivos: Para multipart/form-data (imágenes), el método post acepta un objeto de configuración para sobrescribir los headers.