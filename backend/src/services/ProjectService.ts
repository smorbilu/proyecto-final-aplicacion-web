import { Project } from '../domain/entities/Project';
import { IProjectRepository } from '../infrastructure/interfaces/IProjectRepository';

export class ProjectService {
  constructor(private readonly projectRepository: IProjectRepository) {}

  async getAll(): Promise<Project[]> {
    return this.projectRepository.findAll();
  }

  async getById(id: number): Promise<Project | null> {
    return this.projectRepository.findById(id);
  }

  async create(data: { name: string; description?: string }): Promise<Project> {
    if (!data.name || data.name.trim() === '') {
      throw new Error('El nombre del proyecto es obligatorio');
    }
    return this.projectRepository.create({ name: data.name.trim(), description: data.description });
  }

  async update(id: number, data: Partial<Project>): Promise<Project | null> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) throw new Error('Proyecto no encontrado');
    return this.projectRepository.update(id, data);
  }

  async delete(id: number): Promise<boolean> {
    const existing = await this.projectRepository.findById(id);
    if (!existing) throw new Error('Proyecto no encontrado');
    return this.projectRepository.delete(id);
  }
}
