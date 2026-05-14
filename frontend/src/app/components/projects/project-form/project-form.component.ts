import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../interfaces/project.interface';

interface DialogData {
  project: Project | null;
}

@Component({
  selector: 'app-project-form',
  templateUrl: './project-form.component.html',
  standalone: false,
  styleUrl: './project-form.component.scss'
})
export class ProjectFormComponent implements OnInit {
  form!: FormGroup;
  isEdit = false;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private projectService: ProjectService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<ProjectFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {}

  ngOnInit(): void {
    this.isEdit = !!this.data.project;
    this.form = this.fb.group({
      name: [this.data.project?.name || '', [Validators.required, Validators.minLength(3)]],
      description: [this.data.project?.description || '']
    });
  }

  submit(): void {
    if (this.form.invalid) return;
    this.saving = true;
    const dto = this.form.value;

    const op = this.isEdit
      ? this.projectService.update(this.data.project!.id!, dto)
      : this.projectService.create(dto);

    op.subscribe({
      next: () => {
        this.snackBar.open(
          this.isEdit ? 'Proyecto actualizado' : 'Proyecto creado',
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
