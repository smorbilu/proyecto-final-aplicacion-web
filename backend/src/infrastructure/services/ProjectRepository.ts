import { Project } from '../../domain/entities/Project';
import { IProjectRepository } from '../interfaces/IProjectRepository';
import ProjectModel from '../models/ProjectModel';

export class ProjectRepository implements IProjectRepository {
  async findAll(): Promise<Project[]> {
    return await ProjectModel.findAll({ order: [['createdAt', 'DESC']] });
  }

  async findById(id: number): Promise<Project | null> {
    return await ProjectModel.findByPk(id);
  }

  async create(project: Project): Promise<Project> {
    return await ProjectModel.create({
      name: project.name,
      description: project.description,
    });
  }

  async update(id: number, project: Partial<Project>): Promise<Project | null> {
    const existing = await ProjectModel.findByPk(id);
    if (!existing) return null;
    return await existing.update(project);
  }

  async delete(id: number): Promise<boolean> {
    const rows = await ProjectModel.destroy({ where: { id } });
    return rows > 0;
  }
}
