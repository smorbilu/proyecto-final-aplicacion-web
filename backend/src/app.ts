import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sequelize, { createDatabaseIfNotExists } from './infrastructure/database/connection';
import { seedDatabase } from './infrastructure/database/seeder';
import './infrastructure/models/ProjectModel';
import './infrastructure/models/TaskModel';
import projectRoutes from './infrastructure/routes/projectRoutes';
import taskRoutes from './infrastructure/routes/taskRoutes';

dotenv.config();

const app = express();
const PORT = process.env['PORT'] || 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);

app.get('/api/projects/:projectId/tasks', async (req, res) => {
  const { TaskController } = await import('./infrastructure/controllers/TaskController');
  const { TaskService } = await import('./services/TaskService');
  const { TaskRepository } = await import('./infrastructure/services/TaskRepository');
  const { ProjectRepository } = await import('./infrastructure/services/ProjectRepository');
  const ctrl = new TaskController(
    new TaskService(new TaskRepository(), new ProjectRepository())
  );
  ctrl.getByProjectId(req, res);
});

async function bootstrap() {
  try {
    await createDatabaseIfNotExists();
    await sequelize.sync({ alter: true });
    console.log('Base de datos sincronizada');
    await seedDatabase();
    app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
  } catch (err) {
    console.error('Error al iniciar el servidor:', err);
  }
}

bootstrap();
