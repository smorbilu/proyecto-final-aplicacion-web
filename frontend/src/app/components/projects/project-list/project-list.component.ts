import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProjectService } from '../../../services/project.service';
import { Project } from '../../../interfaces/project.interface';
import { ProjectFormComponent } from '../project-form/project-form.component';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  standalone: false,
  styleUrl: './project-list.component.scss'
})
export class ProjectListComponent implements OnInit, OnDestroy {
  projects: Project[] = [];
  loading = true;
  error = '';
  private pollInterval: any;

  constructor(
    private projectService: ProjectService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.pollInterval = setInterval(() => this.loadProjects(), 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.pollInterval);
  }

  loadProjects(): void {
    this.projectService.getAll().subscribe({
      next: (data) => {
        this.projects = data;
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
    const ref = this.dialog.open(ProjectFormComponent, {
      width: '500px',
      data: { project: null }
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.loadProjects();
    });
  }

  openEditDialog(project: Project): void {
    const ref = this.dialog.open(ProjectFormComponent, {
      width: '500px',
      data: { project }
    });
    ref.afterClosed().subscribe(result => {
      if (result) this.loadProjects();
    });
  }

  viewTasks(projectId: number): void {
    this.router.navigate(['/tasks'], { queryParams: { projectId } });
  }

  deleteProject(project: Project): void {
    if (!confirm(`¿Eliminar el proyecto "${project.name}"? Se eliminarán todas sus tareas.`)) return;
    this.projectService.delete(project.id!).subscribe({
      next: () => {
        this.snackBar.open('Proyecto eliminado', 'Cerrar', { duration: 3000 });
        this.loadProjects();
      },
      error: () => this.snackBar.open('Error al eliminar proyecto', 'Cerrar', { duration: 3000 })
    });
  }
}
