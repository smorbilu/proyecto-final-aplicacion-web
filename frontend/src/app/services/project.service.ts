import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';
import { Project, CreateProjectDto } from '../interfaces/project.interface';

@Injectable({ providedIn: 'root' })
export class ProjectService {
  private readonly apiUrl = 'http://localhost:3000/api/projects';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Project[]> {
    return this.http.get<Project[]>(this.apiUrl).pipe(timeout(4000));
  }

  getById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.apiUrl}/${id}`).pipe(timeout(4000));
  }

  create(dto: CreateProjectDto): Observable<Project> {
    return this.http.post<Project>(this.apiUrl, dto).pipe(timeout(4000));
  }

  update(id: number, dto: Partial<CreateProjectDto>): Observable<Project> {
    return this.http.put<Project>(`${this.apiUrl}/${id}`, dto).pipe(timeout(4000));
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`).pipe(timeout(4000));
  }
}
