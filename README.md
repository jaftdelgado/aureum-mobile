# 🌟 Aureum Mobile

Aureum es una **plataforma móvil educativa** para aprender sobre inversiones mediante simulaciones prácticas.  
Los usuarios participan en **equipos que funcionan como mercados aislados**, donde cada compra y venta de acciones impacta el resultado del equipo.  

La app permite experimentar **estrategias de inversión**, entender el comportamiento de los mercados y colaborar en un entorno seguro y controlado, combinando **interactividad, gamificación y simulación financiera**.

> [!IMPORTANT]  
> Este proyecto es privado y **no acepta contribuciones externas**.

## 🛠 Stack Tecnológico
![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=for-the-badge&logo=react)
![Expo](https://img.shields.io/badge/Expo-1B1F23?style=for-the-badge&logo=expo)
![NativeWind](https://img.shields.io/badge/NativeWind-06B6D4?style=for-the-badge)

---

## 🏗 Arquitectura: Hexagonal + Modular

El proyecto sigue la **arquitectura hexagonal** combinada con **modularidad por funcionalidades**.  
Esto permite independencia entre la lógica de negocio, la infraestructura y la interfaz de usuario.

| Capa       | Carpeta/Ubicación       | Descripción                                                                 |
|------------|------------------------|-----------------------------------------------------------------------------|
| 🏠 App     | `app/`                 | Configuración general de la app, navegación y providers.                   |
|            | `config/`              | Variables de entorno (`env.ts`).                                           |
|            | `navigation/`          | Rutas, TabBar, iconos de la app.                                          |
|            | `providers/`           | Contextos y providers globales (App, Fonts, Query).                        |
| 🎨 Core    | `core/`                | Elementos reutilizables y utilidades comunes.                              |
|            | `design/`              | Colores, tipografía y tamaños de fuente.                                   |
|            | `ui/`                  | Componentes base: Button, Avatar, Text, ListItem.                          |
|            | `utils/`               | Funciones de ayuda (ej. `cn.ts` para NativeWind).                           |
| 💼 Domain  | `domain/`              | Lógica de negocio pura (independiente de UI o infraestructuras externas). |
|            | `entities/`            | Entidades del dominio (ej. `Asset`).                                       |
|            | `repositories/`        | Interfaces de repositorios.                                                |
|            | `use-cases/`           | Casos de uso de la app (ej. `GetAssetsUseCase`).                           |
| 🔧 Infra   | `infra/`               | Implementaciones de infraestructura (APIs, cliente HTTP, mappers).         |
|            | `api/`                 | Repositorios que interactúan con la API externa.                           |
| 🗂 Features| `features/`            | Funcionalidades concretas de la app, organizadas por módulo.               |
|            | `assets/`              | Pantallas, hooks y componentes de activos.                                  |
|            | `lessons/`, `teams/`  | Otros módulos independientes.                                              |
| 📦 Resources| `resources/`           | Assets estáticos: fuentes, imágenes, etc.                                  |
|            | `fonts/`               | Tipografías personalizadas (`Geist.ttf`).                                   |


---

## ⚡ Instalación

1️⃣ Clonar el repositorio:
> git clone https://github.com/usuario/aureum-mobile.git

2️⃣ Instalar dependencias:
> npm install

3️⃣ Ejecutar la app en Expo:
> npx expo start

> [!NOTE]  
> Asegúrate de tener instalado **Node.js** y **Expo CLI**.

---

## 🔒 Estado del proyecto

Proyecto **en desarrollo**.

Código privado no abierto para contribuciones externas.

## 📄 Licencia

Propietario: código privado.
