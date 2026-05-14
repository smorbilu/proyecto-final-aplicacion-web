# Serie 1: Análisis y Propuesta de Solución — TaskFlow

---

## 1. Propuesta de Base de Datos (7 puntos)

### Tablas (2 tablas — dentro del límite de 3)

#### Tabla: `projects`
| Campo       | Tipo           | Descripción                        |
|-------------|----------------|------------------------------------|
| id          | INTEGER (PK, AI)| Identificador único del proyecto   |
| name        | VARCHAR(150)   | Nombre del proyecto (obligatorio)  |
| description | TEXT           | Descripción opcional               |
| createdAt   | TIMESTAMP      | Fecha de creación (Sequelize auto) |
| updatedAt   | TIMESTAMP      | Fecha de actualización             |

#### Tabla: `tasks`
| Campo       | Tipo                               | Descripción                              |
|-------------|-------------------------------------|------------------------------------------|
| id          | INTEGER (PK, AI)                   | Identificador único de la tarea          |
| title       | VARCHAR(200)                        | Título de la tarea (obligatorio)         |
| description | TEXT                                | Descripción detallada opcional           |
| status      | ENUM('pending','in_progress','completed') | Estado de la tarea              |
| projectId   | INTEGER (FK → projects.id)         | Proyecto al que pertenece la tarea       |
| createdAt   | TIMESTAMP                           | Fecha de creación                        |
| updatedAt   | TIMESTAMP                           | Fecha de actualización                   |

### Relaciones
- `projects` (1) ←→ (N) `tasks`: Un proyecto puede tener muchas tareas.
- `tasks.projectId` es llave foránea que referencia a `projects.id`.
- Se aplica `ON DELETE CASCADE`: al eliminar un proyecto, sus tareas se eliminan automáticamente.

### Justificación de Normalización
- **1FN**: Todos los campos son atómicos, sin grupos repetidos.
- **2FN**: Cada campo no-llave depende completamente de la PK de su tabla.
- **3FN**: No existen dependencias transitivas. `status` depende directamente de `id` de tasks, no de otro campo no-llave.
- No es necesaria una tercera tabla para "estados" ya que son un dominio fijo representado eficientemente con ENUM, evitando joins innecesarios.

---

## 2. Propuesta de Backend (7 puntos)

### Endpoints REST

| Método | Ruta                              | Descripción                                  |
|--------|-----------------------------------|----------------------------------------------|
| GET    | /api/projects                     | Listar todos los proyectos                   |
| GET    | /api/projects/:id                 | Obtener un proyecto por ID                   |
| POST   | /api/projects                     | Crear un nuevo proyecto                      |
| PUT    | /api/projects/:id                 | Actualizar datos de un proyecto              |
| DELETE | /api/projects/:id                 | Eliminar un proyecto (y sus tareas en cascade)|
| GET    | /api/tasks                        | Listar todas las tareas (filtro ?status=)    |
| GET    | /api/tasks/:id                    | Obtener una tarea por ID                     |
| GET    | /api/projects/:projectId/tasks    | Tareas de un proyecto (filtro ?status=)      |
| POST   | /api/tasks                        | Crear una nueva tarea                        |
| PUT    | /api/tasks/:id                    | Actualizar una tarea                         |
| PATCH  | /api/tasks/:id/status             | Cambiar solo el estado de una tarea          |
| DELETE | /api/tasks/:id                    | Eliminar una tarea                           |

### Organización por capas (Clean Architecture)

```
src/
├── domain/
│   └── entities/          ← Interfaces puras de negocio (Project, Task)
├── services/              ← Casos de uso (ProjectService, TaskService)
│                            Validan reglas de negocio, orquestan el flujo
└── infrastructure/
    ├── database/          ← Conexión Sequelize a PostgreSQL
    ├── models/            ← Modelos ORM (ProjectModel, TaskModel) con relaciones
    ├── services/          ← Implementaciones de repositorios (acceso a BD)
    ├── interfaces/        ← Contratos/interfaces de repositorios (IProjectRepository, ITaskRepository)
    ├── controllers/       ← Manejo de Request/Response HTTP de Express
    └── routes/            ← Definición de rutas Express
```

**Flujo de datos**: Route → Controller → Service (dominio) → Repository (infraestructura) → Sequelize Model → PostgreSQL

### Modelos Sequelize y Relaciones

- **ProjectModel**: tabla `projects`, campos id/name/description/timestamps
- **TaskModel**: tabla `tasks`, campos id/title/description/status/projectId/timestamps
- Relación: `ProjectModel.hasMany(TaskModel)` / `TaskModel.belongsTo(ProjectModel)`

---

## 3. Propuesta de Frontend (6 puntos)

### Vistas y Componentes

| Componente              | Ruta       | Descripción                                                      |
|-------------------------|------------|------------------------------------------------------------------|
| ShellComponent          | /          | Layout principal con toolbar de navegación y `<router-outlet>`   |
| ProjectListComponent    | /projects  | Grilla de proyectos con acciones crear/editar/eliminar/ver tareas|
| ProjectFormComponent    | (diálogo)  | Formulario reactivo para crear/editar proyectos                  |
| TaskListComponent       | /tasks     | Lista de tareas con filtros por estado y proyecto                |
| TaskFormComponent       | (diálogo)  | Formulario reactivo para crear/editar tareas                     |

### Servicios Angular

| Servicio         | Endpoints que consume                                                       |
|------------------|-----------------------------------------------------------------------------|
| ProjectService   | GET/POST /api/projects, GET/PUT/DELETE /api/projects/:id                    |
| TaskService      | GET/POST /api/tasks, GET/PUT/DELETE/PATCH /api/tasks/:id/status, GET /api/projects/:id/tasks |

### Interfaces TypeScript (DTOs)

- `project.interface.ts`: `Project`, `CreateProjectDto`
- `task.interface.ts`: `Task`, `CreateTaskDto`, `UpdateTaskDto`, `TaskStatus`

### Flujo de Usuario

1. El usuario ingresa a `/projects` y ve la lista de proyectos.
2. Hace clic en "Nuevo Proyecto" → se abre un `MatDialog` con formulario reactivo.
3. Completa el formulario y guarda → se llama `ProjectService.create()` → la lista se recarga.
4. Desde un proyecto, hace clic en "Ver Tareas" → navega a `/tasks?projectId=X`.
5. En `/tasks` puede filtrar por estado (Pendiente/En Progreso/Completada) o por proyecto.
6. Crea una nueva tarea con "Nueva Tarea" → `MatDialog` con formulario reactivo seleccionando proyecto y estado.
7. Cambia el estado de una tarea directamente desde la tarjeta con botones de acción rápida.
8. Edita o elimina tareas y proyectos con los iconos de acción en cada tarjeta.
