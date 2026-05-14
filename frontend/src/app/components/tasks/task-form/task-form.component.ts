import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TaskService } from '../../../services/task.service';
import { Task, TaskStatus } from '../../../interfaces/task.interface';
import { Project } from '../../../interfaces/project.interface';

interface DialogData {
  task: Task | null;
  projects: Project[];
}

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  standalone: false,
  styleUrl: './task-form.component.scss'
})
export class TaskFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;

  readonly statusOptions: { value: TaskStatus; label: string }[] = [
    { value: 'pending', label: 'Pendiente' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completada' },
  ];

  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<TaskFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data.task;
    this.form = this.fb.group({
      title: [this.data.task?.title || '', [Validators.required, Validators.minLength(3)]],
      description: [this.data.task?.description || ''],
      status: [this.data.task?.status || 'pending', Validators.required],
      projectId: [this.data.task?.projectId || '', Validators.required]
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;

    const op = this.isEdit
      ? this.taskService.update(this.data.task!.id!, this.form.value)
      : this.taskService.create(this.form.value);

    op.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Tarea actualizada' : 'Tarea creada',
          'Cerrar',
          { duration: 3000 }
        );
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.snackBar.open(err.error?.message || 'Error al guardar', 'Cerrar', { duration: 3000 });
        this.saving = false;
      }
    });
  }

  cancel(): void {
    this.dialogRef.close(false);
  }
}
