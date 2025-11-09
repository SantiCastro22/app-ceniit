# Plan de Refactorización: Módulo `reservations`

## Objetivo
Refactorizar el módulo de `reservations` (actualmente en `routes/reservations.js`) para alinearlo con la Arquitectura Limpia y Screaming, creando un nuevo módulo `reservations` y un módulo básico para `resources`.

### Fase 1: Dominio y Repositorios

1.  **Crear Entidades de Dominio:**
    *   `src/reservations/domain/reservation.js`: Representará la entidad `Reservation` con sus propiedades (`id`, `resource_id`, `user_id`, `date`, `start_time`, `end_time`, `status`, etc.).
    *   `src/resources/domain/resource.js`: Se creará una entidad básica para `Resource` (`id`, `name`, `status`, etc.) ya que la lógica de negocio de reservaciones depende de ella.

2.  **Definir Interfaces de Repositorio:**
    *   `src/reservations/application/repositories/iReservationRepository.js`:
        *   `findAll({ userId })`: `userId` será opcional para filtrar.
        *   `findById(id)`
        *   `findOverlaps(resourceId, date, startTime, endTime)`: Para verificar colisiones de horarios.
        *   `save(reservationData)`
        *   `updateStatus(id, status)`
    *   `src/resources/application/repositories/iResourceRepository.js`:
        *   `findById(id)`

3.  **Implementar Repositorios Concretos:**
    *   `src/reservations/infrastructure/database/reservationRepository.js`: Implementará `IReservationRepository` con las consultas SQL correspondientes (incluyendo los `JOIN` necesarios).
    *   `src/resources/infrastructure/database/resourceRepository.js`: Implementará `IResourceRepository`.

### Fase 2: Lógica de Aplicación (`application`)

1.  **Crear Directorios:** `mkdir -p src/reservations/application/use-cases src/resources/application/repositories src/resources/infrastructure/database src/reservations/domain src/resources/domain`
2.  **Crear Casos de Uso** en `src/reservations/application/use-cases/`:
    *   `getAllReservations.js`: Lógica para obtener todas las reservas o solo las de un usuario, dependiendo de su rol.
    *   `createReservation.js`: Orquestará la creación de una reserva, incluyendo la verificación de disponibilidad del recurso y el solapamiento de horarios.
    *   `updateReservationStatus.js`: Contendrá la lógica para actualizar el estado de una reserva, incluyendo la validación de permisos (admin vs. usuario).

### Fase 3: Infraestructura (`infrastructure`)

1.  **Crear Directorio:** `mkdir -p src/reservations/infrastructure/http`
2.  **Crear Controlador** (`src/reservations/infrastructure/http/reservation.controller.js`):
    *   Manejará las peticiones HTTP (`req`, `res`).
    *   Llamará a los casos de uso correspondientes.
    *   Manejará los errores y formateará las respuestas.
3.  **Crear Rutas** (`src/reservations/infrastructure/http/reservation.routes.js`):
    *   Definirá los endpoints (`/`, `/:id`).
    *   Aplicará los middlewares de autenticación.
    *   Incluirá las cadenas de validación de `express-validator`.
    *   Conectará cada ruta a su método en el `ReservationController`.

### Fase 4: Ensamble y Actualización

1.  **Crear Contenedor de Dependencias** (`src/reservations/index.js`):
    *   Instanciará y conectará todas las dependencias del módulo `reservations` (repositorios, casos de uso, controlador).
    *   Exportará el enrutador de `reservations` configurado.
2.  **Actualizar `server.js`:**
    *   Se comentará la importación y uso de `./routes/reservations.js`.
    *   Se añadirá la importación y uso del nuevo `reservationRouter` desde `src/reservations/index.js`.
