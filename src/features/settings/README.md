# ⚙️ Módulo de Configuración (`src/features/settings`)
Este módulo gestiona las preferencias del usuario, la edición de su perfil público y acciones críticas de la cuenta (Cerrar sesión, Eliminar cuenta).


## 📂 Estructura del Directorio
src/features/settings/
├── hooks/             # Lógica de negocio (useEditProfile, useSettings)
├── i18n/              # Textos traducidos (en/es)
├── resources/         # Iconos SVG específicos del módulo
└── screens/           # Pantallas (Settings, Profile, EditProfile)


🛠️ Características Principales
1. Gestión de Perfil (ProfileScreen & EditProfileScreen)
Permite al usuario visualizar y modificar su información personal.

Edición Robusta (useEditProfile):

Validación de Datos: Sanitización de nombres (eliminación de espacios múltiples) y validación de campos requeridos antes del envío.

Gestión de Avatar: Integración con expo-image-picker con validación de tamaño (<5MB) y solicitud de permisos de galería en tiempo de ejecución.

Protección de Cambios ("Dirty Check"): Implementa un interceptor de navegación (beforeRemove). Si el usuario intenta salir con cambios sin guardar, se muestra una alerta de confirmación para evitar la pérdida de datos.

Manejo de Errores Granular: Diferencia entre el éxito de la actualización de texto y el fallo de la subida de imagen, informando al usuario adecuadamente ("Éxito parcial").


2. Preferencias de la Aplicación (SettingsScreen)
Control centralizado para la personalización de la experiencia.

Temas: Cambio entre Modo Claro y Oscuro (integrado con ThemeProvider).

Idioma: Selección de idioma (Español/Inglés) con recarga inmediata de textos (integrado con i18n).


3. Gestión de Cuenta
Acciones sensibles protegidas con confirmaciones.

Cerrar Sesión: Llama al AuthProvider para limpiar tokens y almacenamiento local.

Eliminar Cuenta: Ejecuta el caso de uso DeleteAccountUseCase. Esta acción es destructiva e irreversible, por lo que requiere una confirmación explícita del usuario.


📦 Dependencias Clave
expo-image-picker: Selección de fotos de perfil.

@react-navigation/native: Manejo de navegación y eventos beforeRemove.

useAuth: Para acceder al estado actual del usuario y refrescar la sesión tras la edición.


⚠️ Notas de Implementación
UX de Guardado: El botón de "Guardar" en la pantalla de edición se habilita solo cuando hay cambios reales (hasChanges) para reducir llamadas innecesarias al backend.

Sincronización: Al guardar el perfil con éxito, se invoca refreshSession() del AuthProvider para asegurar que los cambios (como la nueva foto o nombre) se reflejen instantáneamente en toda la app (cabeceras, menús, etc.).