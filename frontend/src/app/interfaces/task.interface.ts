export type TaskStatus = 'pending' | 'in_progress' | 'completed';

export interface Task {
  id?: number;
  title: string;
  description?: string;
  status: TaskStatus;
  projectId: number;
  project?: { id: number; name: string };
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  projectId: number;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
}
