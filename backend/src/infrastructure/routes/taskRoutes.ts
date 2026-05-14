import { Router } from 'express';
import { TaskController } from '../controllers/TaskController';
import { TaskService } from '../../services/TaskService';
import { TaskRepository } from '../services/TaskRepository';
import { ProjectRepository } from '../services/ProjectRepository';

const router = Router();

const taskRepository = new TaskRepository();
const projectRepository = new ProjectRepository();
const taskService = new TaskService(taskRepository, projectRepository);
const taskController = new TaskController(taskService);

router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.post('/', taskController.create);
router.put('/:id', taskController.update);
router.patch('/:id/status', taskController.changeStatus);
router.delete('/:id', taskController.delete);

export default router;
