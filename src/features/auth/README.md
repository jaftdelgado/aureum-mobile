# 🔐 Módulo de Autenticación (`src/features/auth`)

Este módulo encapsula toda la lógica de negocio y presentación relacionada con la autenticación del usuario, registro y gestión de sesiones.

## 📂 Estructura del Directorio
src/features/auth/
├── components/        # Componentes de UI reutilizables (formularios, botones sociales)
├── hooks/             # Lógica de estado y efectos (useLoginForm, useSignUp)
├── i18n/              # Archivos de traducción específicos del módulo
├── schemas/           # Esquemas de validación Zod (login, registro)
└── screens/           # Pantallas principales (Login, Registro)


🛠️ Características Principales
1. Gestión de Sesión
El módulo se integra con el AuthProvider global para manejar el ciclo de vida de la sesión.

Login (LoginScreen):

Soporta inicio de sesión con correo/contraseña y Google.

Implementa protección contra Race Conditions usando useRef para evitar reseteos de formulario no deseados durante la carga.

Registro (RegisterScreen):

Flujo de múltiples pasos con validación progresiva.

Atomicidad: Implementa un mecanismo de Rollback manual. Si la creación del perfil en base de datos falla después de crear el usuario en Auth, la cuenta se elimina automáticamente para mantener la consistencia.


2. Validaciones Robustas
Utiliza zod para garantizar la integridad de los datos antes de enviarlos al servidor.

Sanitización: Los esquemas aplican trim() y toLowerCase() automáticamente a correos y nombres de usuario.

Seguridad:

Contraseñas: Valida longitud, complejidad y que no contenga datos personales.

Nombres: Regex mejorado para soportar caracteres latinos (acentos, ñ).


3. Manejo de Errores y UX
El módulo prioriza una experiencia de usuario fluida incluso en casos de error.

Feedback Visual: Muestra alertas claras y localizadas para errores comunes (credenciales inválidas, usuario ya existe).

Navegación Inteligente: En el registro, si el usuario ya existe, redirige automáticamente al paso relevante y marca el campo erróneo.

Resiliencia: Maneja errores de red (Timeout, Sin conexión) gracias a la integración con el HttpClient y ErrorMapper.


📦 Dependencias Clave
react-hook-form + @hookform/resolvers: Gestión de formularios.

zod: Validación de esquemas.

expo-auth-session / expo-google-sign-in: (Si aplica) para OAuth.


⚠️ Notas de Implementación
Google Flow: El registro con Google detecta si es un usuario nuevo y pre-llena el formulario de registro, pero obliga a completar datos faltantes (como el rol académico).

Internacionalización: Todos los textos visibles están extraídos en los archivos JSON dentro de i18n/.