import { Request, Response } from 'express';
import { ProjectService } from '../../services/ProjectService';

export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  getAll = async (_req: Request, res: Response): Promise<void> => {
    try {
      const projects = await this.projectService.getAll();
      res.json(projects);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const project = await this.projectService.getById(Number(req.params.id));
      if (!project) {
        res.status(404).json({ message: 'Proyecto no encontrado' });
        return;
      }
      res.json(project);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const project = await this.projectService.create(req.body);
      res.status(201).json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const project = await this.projectService.update(Number(req.params.id), req.body);
      res.json(project);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.projectService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
