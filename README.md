# TaskFlow — Instrucciones de Ejecución

## Requisitos previos
- Node.js v18+
- PostgreSQL instalado y corriendo en el puerto 5432
- Angular CLI instalado globalmente

---

## 1. Configurar la base de datos

En PostgreSQL, crear la base de datos:

```sql
CREATE DATABASE taskflow_db;
```

Actualizar el archivo `backend/.env` con tus credenciales:

```
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=taskflow_db
DB_USER=postgres
DB_PASSWORD=Admin1234
```

---

## 2. Ejecutar el Backend

```bash
cd backend
npm install
npm run dev
```

El servidor iniciará en `http://localhost:3000`.
Sequelize sincronizará las tablas automáticamente al iniciar.

---

## 3. Ejecutar el Frontend

```bash
cd frontend
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200`.

---

## Estructura del Proyecto

```
proyecto final/
├── PROPUESTA.md          ← Serie 1: Análisis y Propuesta
├── backend/
│   └── src/
│       ├── domain/entities/          ← Entidades de dominio
│       ├── services/                 ← Casos de uso
│       └── infrastructure/
│           ├── database/             ← Conexión Sequelize
│           ├── models/               ← Modelos ORM
│           ├── services/             ← Repositorios (implementaciones)
│           ├── interfaces/           ← Contratos de repositorios
│           ├── controllers/          ← Controladores Express
│           └── routes/               ← Rutas Express
└── frontend/
    └── src/app/
        ├── interfaces/               ← DTOs TypeScript
        ├── services/                 ← Servicios Angular (HttpClient)
        └── components/
            ├── shell/                ← Layout principal
            ├── projects/             ← Vistas de proyectos
            └── tasks/                ← Vistas de tareas
```

## Endpoints de la API

| Método | Endpoint                        | Descripción                  |
|--------|---------------------------------|------------------------------|
| GET    | /api/projects                   | Listar proyectos             |
| POST   | /api/projects                   | Crear proyecto               |
| PUT    | /api/projects/:id               | Editar proyecto              |
| DELETE | /api/projects/:id               | Eliminar proyecto            |
| GET    | /api/tasks?status=              | Listar tareas (con filtro)   |
| GET    | /api/projects/:id/tasks?status= | Tareas de un proyecto        |
| POST   | /api/tasks                      | Crear tarea                  |
| PUT    | /api/tasks/:id                  | Editar tarea                 |
| PATCH  | /api/tasks/:id/status           | Cambiar estado de tarea      |
| DELETE | /api/tasks/:id                  | Eliminar tarea               |
# proyecto-final-aplicacion-web
