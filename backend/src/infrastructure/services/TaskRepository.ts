import { Op } from 'sequelize';
import { Task, TaskStatus } from '../../domain/entities/Task';
import { ITaskRepository } from '../interfaces/ITaskRepository';
import TaskModel from '../models/TaskModel';
import ProjectModel from '../models/ProjectModel';

export class TaskRepository implements ITaskRepository {
  async findAll(status?: TaskStatus): Promise<Task[]> {
    const where = status ? { status } : {};
    return await TaskModel.findAll({
      where,
      include: [{ model: ProjectModel, as: 'project', attributes: ['id', 'name'] }],
      order: [['createdAt', 'DESC']],
    });
  }

  async findByProjectId(projectId: number, status?: TaskStatus): Promise<Task[]> {
    const where: Record<string, unknown> = { projectId };
    if (status) where['status'] = status;
    return await TaskModel.findAll({
      where,
      order: [['createdAt', 'DESC']],
    });
  }

  async findById(id: number): Promise<Task | null> {
    return await TaskModel.findByPk(id, {
      include: [{ model: ProjectModel, as: 'project', attributes: ['id', 'name'] }],
    });
  }

  async create(task: Task): Promise<Task> {
    return await TaskModel.create({
      title: task.title,
      description: task.description,
      status: task.status || 'pending',
      projectId: task.projectId,
    });
  }

  async update(id: number, task: Partial<Task>): Promise<Task | null> {
    const existing = await TaskModel.findByPk(id);
    if (!existing) return null;
    return await existing.update(task);
  }

  async delete(id: number): Promise<boolean> {
    const rows = await TaskModel.destroy({ where: { id } });
    return rows > 0;
  }
}
