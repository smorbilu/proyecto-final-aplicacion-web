import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../services/task.service';
import { ProjectService } from '../../../services/project.service';
import { Task, TaskStatus } from '../../../interfaces/task.interface';
import { Project } from '../../../interfaces/project.interface';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  standalone: false,
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  projects: Project[] = [];
  loading = true;
  error = '';
  private pollInterval: any;

  statusFilter = new FormControl<TaskStatus | ''>('');
  projectFilter = new FormControl<number | ''>('');

  readonly statusOptions: { value: TaskStatus | ''; label: string }[] = [
    { value: '', label: 'Todos los estados' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
  ];

  readonly statusLabels: Record<TaskStatus, string> = {
    pending: 'Pendiente',
    in_progress: 'En Progreso',
    completed: 'Completada',
  };

  constructor(
    private taskService: TaskService,
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.projectService.getAll().subscribe(p => (this.projects = p));

    this.route.queryParams.subscribe(params => {
      if (params['projectId']) {
        this.projectFilter.setValue(Number(params['projectId']));
      }
    });

    this.loadTasks();
    this.pollInterval = setInterval(() => this.loadTasks(), 5000);

    this.statusFilter.valueChanges.subscribe(() => this.loadTasks());
    this.projectFilter.valueChanges.subscribe(() => this.loadTasks());
  }

  ngOnDestroy(): void {
    clearInterval(this.pollInterval);
  }

  loadTasks(): void {
    const status = this.statusFilter.value || undefined;
    const projectId = this.projectFilter.value || undefined;

    const obs = projectId
      ? this.taskService.getByProjectId(projectId as number, status as TaskStatus)
      : this.taskService.getAll(status as TaskStatus);

    obs.subscribe({
      next: (data) => {
        this.tasks = data;
        this.loading = false;
        this.error = '';
      },
      error: () => {
        this.loading = false;
        this.error = 'No se puede conectar al servidor. Verifica que el backend esté corriendo en http://localhost:3000';
      }
    });
  }

  openCreateDialog(): void {
    const ref = this.dialog.open(TaskFormComponent, {
      width: '550px',
      data: { task: null, projects: this.projects }
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.loadTasks();
    });
  }

  openEditDialog(task: Task): void {
    const ref = this.dialog.open(TaskFormComponent, {
      width: '550px',
      data: { task, projects: this.projects }
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.loadTasks();
    });
  }

  changeStatus(task: Task, status: TaskStatus): void {
    this.taskService.changeStatus(task.id!, status).subscribe({
      next: () => {
        this.snackBar.open('Estado actualizado', 'Cerrar', { duration: 2000 });
        this.loadTasks();
      },
      error: () => this.snackBar.open('Error al actualizar estado', 'Cerrar', { duration: 3000 })
    });
  }

  deleteTask(task: Task): void {
    if (!confirm(`¿Eliminar la tarea "${task.title}"?`)) return;
    this.taskService.delete(task.id!).subscribe({
      next: () => {
        this.snackBar.open('Tarea eliminada', 'Cerrar', { duration: 3000 });
        this.loadTasks();
      },
      error: () => this.snackBar.open('Error al eliminar tarea', 'Cerrar', { duration: 3000 })
    });
  }

  clearFilters(): void {
    this.statusFilter.setValue('');
    this.projectFilter.setValue('');
  }
}
