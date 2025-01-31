import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private apiUrl = `${environment.baseUrl}/Reporting`;

  // private apiUrl = 'https://localhost:7089/api/';

  constructor(private http: HttpClient) { }

  // generateDynamicReport(tables: string[], selectedAttributes: { [key: string]: string[] }): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/GenerateDynamicReport`, { tables, selectedAttributes });
  // }

  getRegisteredUsersReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GenerateRegisteredUsersReport`);
  }

  getActiveProjectsReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GenerateActiveProjectsReport`);
  }

  getTemplatesReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GenerateTemplatesReport`);
  }

  getClientsReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GenerateClientsReport`);
  }

  getDefectsReport(projectId?: number): Observable<any> {
    let params = new HttpParams();
    if (projectId) {
      params = params.set('projectId', projectId.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/GenerateDefectsReport`, { params });
  }

  getProjectPhaseReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GenerateProjectPhaseReport`);
  }

  getUserLoadReport(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GenerateUserLoadReport`);
  }


  getProjects(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllActiveProjects`);
  }


  searchProjects(query: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetAllActiveProjects`, {
      params: new HttpParams().set('search', query)
    });
  }


  getAllTeams(): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAllTeams`);
  }

  getPhases(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetPhases`);
  }

  getTestScriptStatusReport(projectId?: string): Observable<any> {
    let params = new HttpParams();
    if (projectId) {
      params = params.append('projectId', projectId);
    }
    return this.http.get<any>(`${this.apiUrl}/GenerateTestScriptStatusReport`, { params });
  }


  getTestScriptStatusWithPhasesReport(phaseId?: number): Observable<any> {
    let params = new HttpParams();
    if (phaseId !== undefined) {
      params = params.append('phaseId', phaseId.toString());
    }
    return this.http.get<any>(`${this.apiUrl}/GenerateTestScriptStatusPhasesReport`, { params });
  }

  getAssignedScriptsReport(projectId?: string, teamId?: string): Observable<any> {
    let params = new HttpParams();
    if (projectId) {
      params = params.append('projectId', projectId);
    }
    if (teamId) {
      params = params.append('teamId', teamId);
    }

    return this.http.get(`${this.apiUrl}/GenerateAssignedScriptsReport`, { params });
  }

}
