import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  private apiUrl = `${environment.baseUrl}/Dashboard`;

  // private apiUrl = 'https://localhost:7089/api/';

  constructor(private http: HttpClient) {}

  getUserTeams(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetUserTeams/${userId}`);
  }

  getUserProjects(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetUserProjects/${userId}`);
  }

  getUserTestScripts(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetUserTestScripts/${userId}`);
  }

  getUserTeamEvents(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetUserTeamEvents/${userId}`);
  }

  getUserNotifications(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetUserNotifications/${userId}`);
  }

  getUserProjectTestScriptsWithDefects(userId: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetUserProjectTestScriptsWithDefects/${userId}`);
  }

  getTeamTestScriptsWithStatus(userId: string, projectId?: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetTeamTestScriptsWithStatus/${userId}${projectId ? `?projectId=${projectId}` : ''}`);
  }
}