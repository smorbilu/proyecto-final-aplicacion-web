import { Router } from 'express';
import { ProjectController } from '../controllers/ProjectController';
import { ProjectService } from '../../services/ProjectService';
import { ProjectRepository } from '../services/ProjectRepository';

const router = Router();

const projectRepository = new ProjectRepository();
const projectService = new ProjectService(projectRepository);
const projectController = new ProjectController(projectService);

router.get('/', projectController.getAll);
router.get('/:id', projectController.getById);
router.post('/', projectController.create);
router.put('/:id', projectController.update);
router.delete('/:id', projectController.delete);

export default router;
