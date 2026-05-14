import { Request, Response } from 'express';
import { TaskService } from '../../services/TaskService';
import { TaskStatus } from '../../domain/entities/Task';

export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  getAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = req.query['status'] as TaskStatus | undefined;
      const tasks = await this.taskService.getAll(status);
      res.json(tasks);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getByProjectId = async (req: Request, res: Response): Promise<void> => {
    try {
      const status = req.query['status'] as TaskStatus | undefined;
      const tasks = await this.taskService.getByProjectId(Number(req.params.projectId), status);
      res.json(tasks);
    } catch (error: any) {
      res.status(404).json({ message: error.message });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.getById(Number(req.params.id));
      if (!task) {
        res.status(404).json({ message: 'Tarea no encontrada' });
        return;
      }
      res.json(task);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.create(req.body);
      res.status(201).json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const task = await this.taskService.update(Number(req.params.id), req.body);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  changeStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.body;
      const task = await this.taskService.changeStatus(Number(req.params.id), status);
      res.json(task);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.taskService.delete(Number(req.params.id));
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
}
