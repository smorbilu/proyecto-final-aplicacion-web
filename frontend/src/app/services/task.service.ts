import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { Task, CreateTaskDto, UpdateTaskDto, TaskStatus } from '../interfaces/task.interface';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly apiUrl = 'http://localhost:3000/api/tasks';
  private readonly projectsApiUrl = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) {}

  getAll(status?: TaskStatus): Observable<Task[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Task[]>(this.apiUrl, { params }).pipe(timeout(4000));
  }

  getByProjectId(projectId: number, status?: TaskStatus): Observable<Task[]> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<Task[]>(`${this.projectsApiUrl}/${projectId}/tasks`, { params }).pipe(timeout(4000));
  }

  getById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`).pipe(timeout(4000));
  }

  create(dto: CreateTaskDto): Observable<Task> {
    return this.http.post<Task>(this.apiUrl, dto).pipe(timeout(4000));
  }

  update(id: number, dto: UpdateTaskDto): Observable<Task> {
    return this.http.put<Task>(`${this.apiUrl}/${id}`, dto).pipe(timeout(4000));
  }

  changeStatus(id: number, status: TaskStatus): Observable<Task> {
    return this.http.patch<Task>(`${this.apiUrl}/${id}/status`, { status }).pipe(timeout(4000));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(timeout(4000));
  }
}
