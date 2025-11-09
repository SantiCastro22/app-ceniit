# CENIIT Application - Docker Setup

Este proyecto contiene la configuración completa de Docker para levantar la aplicación CENIIT con frontend, backend, base de datos PostgreSQL y Nginx como proxy inverso.

## Estructura del Proyecto

```
app-ceniit/
├── docker-compose.yml          # Configuración principal de Docker Compose
├── nginx/
│   └── nginx.conf             # Configuración de Nginx como proxy
├── ceniit-backend/
│   ├── Dockerfile             # Dockerfile del backend
│   └── ...
└── ceniit-frontend/
    ├── Dockerfile             # Dockerfile del frontend
    ├── nginx.conf             # Configuración de Nginx para SPA
    └── ...
```

## Servicios

- **db**: Base de datos PostgreSQL 16
- **backend**: API Node.js/Express (puerto interno 3000)
- **frontend**: Aplicación React con Vite (puerto interno 80)
- **nginx**: Proxy inverso (puerto externo 80)

## Uso

### Levantar todos los servicios

```bash
docker-compose up -d
```

### Ver logs

```bash
# Todos los servicios
docker-compose logs -f

# Un servicio específico
docker-compose logs -f backend
```

### Detener los servicios

```bash
docker-compose down
```

### Reconstruir las imágenes

```bash
docker-compose build
docker-compose up -d
```

### Limpiar todo (incluye volúmenes)

```bash
docker-compose down -v
```

## Acceso a la Aplicación

- **Aplicación completa**: http://localhost
- **API Backend**: http://localhost/api/*
- **Frontend**: http://localhost/

El servicio de Nginx redirige automáticamente:
- `/api/*` → Backend (Node.js)
- `/*` → Frontend (React)

## Variables de Entorno

El backend utiliza las siguientes variables de entorno (configuradas en docker-compose.yml):

- `DB_HOST=db`
- `DB_PORT=5432`
- `DB_USER=postgres`
- `DB_PASSWORD=admin`
- `DB_NAME=ceniit_db`

## Persistencia de Datos

Los datos de PostgreSQL se persisten en un volumen de Docker llamado `db_data`.

## Notas

- El script `bd.sql` se ejecuta automáticamente al inicializar la base de datos
- Todos los servicios están en la misma red (`ceniit_network`)
- Los servicios se reinician automáticamente a menos que se detengan explícitamente
