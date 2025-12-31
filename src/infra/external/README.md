# 🌐 Infraestructura Externa (`src/infra/external`)

Este módulo encapsula todas las interacciones con servicios de terceros (SaaS/BaaS) externos a nuestra propia API. Actualmente, su responsabilidad principal es la integración con **Supabase** para autenticación y persistencia de sesión.

## 📂 Estructura del Directorio
src/infra/external/
├── auth/                  # Implementación de Autenticación (Supabase Auth)
│   ├── AuthApiRepository.ts # Implementación concreta de AuthRepository
│   ├── auth.dto.ts        # Definiciones de tipos de respuesta de Supabase
│   └── auth.mappers.ts    # Transformación de datos (DTO -> Domain Entity)
└── supabase.ts            # Configuración e instancia del cliente Supabase


🛠️ Componentes Clave
1. Cliente Supabase (supabase.ts)
Inicializa la conexión con el proyecto de Supabase utilizando las variables de entorno (EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY).

Persistencia Segura (Adapter Pattern): Implementa un adaptador personalizado (ExpoSecureStoreAdapter) que utiliza expo-secure-store. Esto garantiza que los tokens de sesión (JWT) se almacenen en:

iOS: Keychain Services.

Android: SharedPreferences (encriptado). Esto permite que la sesión persista incluso si se cierra la app, manteniendo la seguridad.


2. Repositorio de Autenticación (AuthApiRepository)
Es la implementación concreta de la interfaz de dominio AuthRepository. Aísla a la aplicación de la librería específica de supabase-js.

Responsabilidades:

Login/Registro: Maneja el intercambio de credenciales por sesiones.

Gestión de Sesión: Recupera la sesión persistente al iniciar la app (getSession).

Eventos: Expone onAuthStateChange para reaccionar a cambios en tiempo real (login, logout, token refresh).

Login Social: Maneja el intercambio de tokens de Google (signInWithIdToken).


3. Mappers y DTOs
Siguen el patrón de Data Mapper para desacoplar la infraestructura del dominio.

DTO (auth.dto.ts): Representa la estructura cruda que devuelve Supabase (ej. user_metadata, snake_case).

Mapper (auth.mappers.ts): Convierte el DTO en una entidad de dominio limpia (LoggedInUser), saneando datos y adaptando nombres de propiedades.


📦 Dependencias Externas
@supabase/supabase-js: Cliente oficial.

expo-secure-store: Almacenamiento seguro nativo.

base64-js: Utilidad para manejo de codificación requerida por el almacenamiento.


⚠️ Notas de Seguridad
Este módulo NO debe contener lógica de negocio compleja; solo debe actuar como un puente de transporte y transformación de datos.

Las llaves de API se inyectan vía app.config.ts y variables de entorno.