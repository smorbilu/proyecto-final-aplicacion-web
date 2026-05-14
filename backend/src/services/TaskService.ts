import { Task, TaskStatus } from '../domain/entities/Task';
import { ITaskRepository } from '../infrastructure/interfaces/ITaskRepository';
import { IProjectRepository } from '../infrastructure/interfaces/IProjectRepository';

export class TaskService {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly projectRepository: IProjectRepository
  ) {}

  async getAll(status?: TaskStatus): Promise<Task[]> {
    return this.taskRepository.findAll(status);
  }

  async getByProjectId(projectId: number, status?: TaskStatus): Promise<Task[]> {
    const project = await this.projectRepository.findById(projectId);
    if (!project) throw new Error('Proyecto no encontrado');
    return this.taskRepository.findByProjectId(projectId, status);
  }

  async getById(id: number): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }

  async create(data: {
    title: string;
    description?: string;
    status?: TaskStatus;
    projectId: number;
  }): Promise<Task> {
    if (!data.title || data.title.trim() === '') {
      throw new Error('El título de la tarea es obligatorio');
    }
    const project = await this.projectRepository.findById(data.projectId);
    if (!project) throw new Error('Proyecto no encontrado');

    return this.taskRepository.create({
      title: data.title.trim(),
      description: data.description,
      status: data.status || 'pending',
      projectId: data.projectId,
    });
  }

  async update(id: number, data: Partial<Task>): Promise<Task | null> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) throw new Error('Tarea no encontrada');
    return this.taskRepository.update(id, data);
  }

  async changeStatus(id: number, status: TaskStatus): Promise<Task | null> {
    const validStatuses: TaskStatus[] = ['pending', 'in_progress', 'completed'];
    if (!validStatuses.includes(status)) {
      throw new Error('Estado inválido');
    }
    const existing = await this.taskRepository.findById(id);
    if (!existing) throw new Error('Tarea no encontrada');
    return this.taskRepository.update(id, { status });
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.taskRepository.findById(id);
    if (!existing) throw new Error('Tarea no encontrada');
    return this.taskRepository.delete(id);
  }
}
