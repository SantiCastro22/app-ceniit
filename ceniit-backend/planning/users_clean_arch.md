# Plan de Refactorización: Módulo `users`

## Objetivo
Refactorizar el módulo de `users` (actualmente en `routes/users.js`) para alinearlo con la Arquitectura Limpia y Screaming, siguiendo el mismo patrón que el módulo `auth`.

### Fase 1: Reutilización y Extensión

1.  **Reutilizar Dominio y Repositorio:**
    *   **Entidad `User`:** Se reutilizará la entidad definida en `src/auth/domain/user.js`.
    *   **Interfaz `IUserRepository`:** Se reutilizará la interfaz de `src/auth/application/repositories/iUserRepository.js`.

2.  **Extender `UserRepository` Concreto:**
    *   Se modificarán `IUserRepository` y su implementación `UserRepository` en `src/auth/` para añadir los siguientes métodos:
        *   `findAll()`: Para obtener todos los usuarios.
        *   `update(id, data)`: Para actualizar un usuario.
        *   `delete(id)`: Para eliminar un usuario.

### Fase 2: Lógica de Aplicación (`application`)

1.  **Crear Directorio:** `mkdir -p src/users/application/use-cases`
2.  **Crear Casos de Uso** en `src/users/application/use-cases/`:
    *   `getAllUsers.js`: Lógica para obtener todos los usuarios.
    *   `getUserById.js`: Lógica para obtener un usuario por su ID.
    *   `updateUser.js`: Lógica para actualizar un usuario, incluyendo hasheo de nueva contraseña si se proporciona.
    *   `deleteUser.js`: Lógica para eliminar un usuario.

### Fase 3: Infraestructura (`infrastructure`)

1.  **Crear Directorio:** `mkdir -p src/users/infrastructure/http`
2.  **Crear Controlador** (`src/users/infrastructure/http/user.controller.js`):
    *   Manejará las peticiones HTTP (`req`, `res`).
    *   Llamará a los casos de uso correspondientes.
    *   **Importante:** Contendrá la lógica de validación de permisos que actualmente está en las rutas (ej. verificar si el usuario es admin o el dueño del perfil).
3.  **Crear Rutas** (`src/users/infrastructure/http/user.routes.js`):
    *   Definirá los endpoints de Express (`/`, `/:id`).
    *   Aplicará los middlewares de autenticación (`auth`, `adminAuth`) importados desde el módulo `auth`.
    *   Conectará cada ruta a su método correspondiente en el `UserController`.

### Fase 4: Ensamble y Actualización

1.  **Crear Contenedor de Dependencias** (`src/users/index.js`):
    *   Instanciará y conectará (`inyectará`) todas las dependencias del módulo `users`: `UserRepository` (extendido), los nuevos casos de uso y el `UserController`.
    *   Exportará el enrutador de `users` ya configurado.
2.  **Actualizar `server.js`:**
    *   Se comentará la importación de `./routes/users.js`.
    *   Se comentará la línea `app.use('/api/users', userRoutes)`.
    *   Se añadirá una nueva línea para importar y usar el `userRouter` desde `src/users/index.js`.
