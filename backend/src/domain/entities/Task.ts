export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId: number;
  createdAt?: Date;
  updatedAt?: Date;
}
