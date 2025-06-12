import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ClassModel } from '../models/proyect.model';

@Injectable({
  providedIn: 'root'
})
export class EntityService {

    static readonly END_POINT = environment.URI + '/api/entities';

  constructor(private http: HttpClient) { }

  findByProjectId(projectId: string) {
    return this.http.get<ClassModel[]>(`${EntityService.END_POINT}/project/${projectId}`);
  }

  findById(projectId: string, entityId: string) {
    return this.http.get<ClassModel>(`${EntityService.END_POINT}/project/${projectId}/class/${entityId}`);
  }

  create(projectId: string, entity: any) {
    return this.http.post<any>(`${EntityService.END_POINT}/project/${projectId}`, entity);
  }

  delete(projectId: string, entityId: string) {
    return this.http.delete<any>(`${EntityService.END_POINT}/${projectId}/${entityId}`);
  }
}
