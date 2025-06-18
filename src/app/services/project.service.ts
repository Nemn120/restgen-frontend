import { AuthService } from 'src/app/services/auth.service';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { GitHubUploadDto, Proyect, ProyectForm } from '../models/proyect.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  static readonly END_POINT = environment.URI + '/api/projects';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) { }

  findAll(): Observable<Proyect[]> {
    return this.http.get<Proyect[]>(ProjectService.END_POINT);
  }

  create(value: Proyect) {
    return this.http.post<any>(ProjectService.END_POINT, value);
  }

  update(projectId: string, value: Proyect) {
    return this.http.put<Proyect>(`${ProjectService.END_POINT}/${projectId}`, value);
  }

  findById(uuid: string) {
    return this.http.get<ProyectForm>(`${ProjectService.END_POINT}/${uuid}`);
  }

  public downloadProjectByUuid(uuid: String) {
    this.http.get(`${ProjectService.END_POINT}/${uuid}/download`, { responseType: "blob" })
      .subscribe(blob => {
        saveAs(blob, uuid + '.zip');
      });
  }

  public delete(uuid: string) {
    return this.http.delete(`${ProjectService.END_POINT}/${uuid}`);
  }

  public generate(uuid: string) {
    let body = {
      id: uuid
    };
    return this.http.patch(`${ProjectService.END_POINT}/generate`, body, { responseType: 'text' });
  }

  getDiagram(uuid: string): Observable<any> {
    return this.http.get(`${ProjectService.END_POINT}/${uuid}/diagram`);
  }

  uploadProjectToGitHub(projectId: string, dto: GitHubUploadDto): Observable<any> {
    dto.githubToken = this.authService.getTokenGithub();
    return this.http.post(`${ProjectService.END_POINT}/upload/${projectId}`, dto);
  }

}
