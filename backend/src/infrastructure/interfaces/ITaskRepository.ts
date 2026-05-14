import { Task, TaskStatus } from '../../domain/entities/Task';

export interface ITaskRepository {
  findAll(status?: TaskStatus): Promise<Task[]>;
  findByProjectId(projectId: number, status?: TaskStatus): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
  create(task: Task): Promise<Task>;
  update(id: number, task: Partial<Task>): Promise<Task | null>;
  delete(id: number): Promise<boolean>;
}
