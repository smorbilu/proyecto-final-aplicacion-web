import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { ShellComponent } from './components/shell/shell.component';
import { ProjectListComponent } from './components/projects/project-list/project-list.component';
import { ProjectFormComponent } from './components/projects/project-form/project-form.component';
import { TaskListComponent } from './components/tasks/task-list/task-list.component';
import { TaskFormComponent } from './components/tasks/task-form/task-form.component';

@NgModule({
  declarations: [
    App,
    ShellComponent,
    ProjectListComponent,
    ProjectFormComponent,
    TaskListComponent,
    TaskFormComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    AppRoutingModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatDividerModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    DatePipe,
  ],
  bootstrap: [App]
})
export class AppModule { }
