# Plan de Refactorización a Arquitectura Limpia y Screaming

## Objetivo
Refactorizar la aplicación Node.js/Express para mejorar la mantenibilidad, testabilidad y escalabilidad, combinando los principios de Arquitectura Limpia con una "Screaming Architecture" (organización por funcionalidades).

## Fase 1: Módulo de Autenticación (`auth`)

### 1. Creación de la Estructura de Directorios
Se creará la siguiente estructura de carpetas para aislar la funcionalidad de `auth`:

```
/src
└── /auth
    ├── /application
    │   ├── /use-cases
    │   └── /repositories
    ├── /domain
    └── /infrastructure
        ├── /database
        └── /http
            └── /middlewares
```

### 2. Definición del Dominio (`domain`)
- **Archivo:** `src/auth/domain/user.js`
- **Descripción:** Se creará una clase o una función factory `User` que represente la entidad de negocio. Contendrá propiedades como `id`, `name`, `email`, `password`, `role`, y `status`. Será un objeto plano de JavaScript, sin dependencias externas.

### 3. Lógica de Aplicación (`application`)

#### Casos de Uso (`use-cases`)
Contendrán la lógica de negocio pura, orquestando el flujo de datos.
- `src/auth/application/use-cases/registerUser.js`: Lógica para registrar un nuevo usuario.
- `src/auth/application/use-cases/loginUser.js`: Lógica para el inicio de sesión.
- `src/auth/application/use-cases/getAuthenticatedUser.js`: Lógica para obtener los datos del usuario autenticado.

#### Interfaces de Repositorio (`repositories`)
Definirán los contratos (puertos de salida) que los casos de uso necesitan para acceder a los datos.
- `src/auth/application/repositories/iUserRepository.js`: Definirá métodos como `findByEmail(email)`, `findById(id)`, y `save(user)`.

### 4. Implementación de la Infraestructura (`infrastructure`)

#### Repositorio de Base de Datos (`database`)
- **Archivo:** `src/auth/infrastructure/database/userRepository.js`
- **Descripción:** Implementará la interfaz `iUserRepository`. Contendrá las consultas SQL (`pool.query(...)`) para interactuar con la base de datos PostgreSQL.

#### Capa HTTP (`http`)
Componentes relacionados con el framework Express.
- **Controlador:** `src/auth/infrastructure/http/auth.controller.js`
  - **Descripción:** Tendrá métodos como `register(req, res)`, `login(req, res)`, etc. Se encargará de recibir la petición, llamar al caso de uso correspondiente y enviar la respuesta HTTP.
- **Rutas:** `src/auth/infrastructure/http/auth.routes.js`
  - **Descripción:** Definirá los endpoints (`/register`, `/login`, `/me`) y los asociará a los métodos del controlador.
- **Middlewares:** `src/auth/infrastructure/http/middlewares/auth.middleware.js`
  - **Descripción:** Contendrá la lógica de los middlewares `auth` y `adminAuth`, adaptada para usar el nuevo repositorio y manejar la verificación de tokens JWT.

### 5. Ensamble y Actualización
- Se modificará el `server.js` principal para que importe y utilice las nuevas rutas de `src/auth/infrastructure/http/auth.routes.js`.
- Se aplicará inyección de dependencias para conectar las capas: la implementación del repositorio se pasará a los casos de uso, y los casos de uso se pasarán al controlador.
