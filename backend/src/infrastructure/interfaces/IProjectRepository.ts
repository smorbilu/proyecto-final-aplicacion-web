import { Project } from '../../domain/entities/Project';

export interface IProjectRepository {
  findAll(): Promise<Project[]>;
  findById(id: number): Promise<Project | null>;
  create(project: Project): Promise<Project>;
  update(id: number, project: Partial<Project>): Promise<Project | null>;
  delete(id: number): Promise<boolean>;
}
