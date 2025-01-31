import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Project } from '../../models/project';
import { Client } from '../../models/client';
import { ProjectPhaseReturnDto } from '../../models/project-phase-return-dto.model';
import { ProjectSignOffReturnDto } from '../../models/project-signoff-return-dto.model';
import { environment } from '../../../environments/environment.development';



@Injectable({
  providedIn: 'root'
})
export class ProjectsService {
  private apiUrl = `${environment.baseUrl}`;

  // private apiUrl = 'https://localhost:7089/api/';

  httpOptions ={
    headers: new HttpHeaders({
      ContentType: 'application/json'
    })
  }

  constructor(private httpClient: HttpClient) { }

  getProjects(): Observable<Project[]> {
    return this.httpClient.get<Project[]>(`${this.apiUrl}/Projects/GetAllProjects`);
  }

  getProject(projectId: string): Observable<Project> {
    return this.httpClient.get<Project>(`${this.apiUrl}/Projects/GetProjectById/${projectId}`);
  }

  createProject(projectData: Partial<Project>): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/Projects/CreateProject`, projectData, this.httpOptions);
  }

  editProject(projectId: string, projectData: Partial<Project>): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/Projects/UpdateProject/${projectId}`, projectData);
  }

  deleteProject(projectId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/Projects/RemoveProject/${projectId}`);
  }

  getClientProjects(clientId: string): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/Projects/GetClientProjects/${clientId}`);
  }

  getClients(): Observable<Client[]> {
    return this.httpClient.get<Client[]>(`${this.apiUrl}/Clients/GetAllClients`);
  }

  getClient(clientId: string): Observable<Client> {
    return this.httpClient.get<Client>(`${this.apiUrl}/Clients/GetClientById/${clientId}`);
  }

  assignTeamToProject(assignData: { projectId: string, teamId: string }): Observable<void> {
    return this.httpClient.put<void>(`${this.apiUrl}/Projects/AssignTeam`, assignData);
  }

  activateProject(projectId: string): Observable<Project> {
    return this.httpClient.put<Project>(`${this.apiUrl}/Projects/ActivateProject/${projectId}`, {});
  }

  deactivateProject(projectId: string): Observable<Project> {
    return this.httpClient.put<Project>(`${this.apiUrl}/Projects/DeActivateProject/${projectId}`, {});
  }

  assignResponsibleClientRep(projectId: string, clientRepEmail: string): Observable<Project> {
    return this.httpClient.put<Project>(`${this.apiUrl}/Projects/AssignResponsibleClientRep`, { projectId: projectId, clientRepEmail: clientRepEmail });
  }

    // Call the CheckPhaseChangeReady endpoint
    checkPhaseChangeReady(projectId: string): Observable<ProjectPhaseReturnDto> {
      return this.httpClient.get<ProjectPhaseReturnDto>(
        `${this.apiUrl}/TestScript/CheckPhaseChangeReady?projectId=${projectId}`
      );
    }
  
    // Call the InitiateChangePhase endpoint
    initiatePhaseChange(
      projectId: string,
      dto: ProjectPhaseReturnDto
    ): Observable<any> {
      return this.httpClient.put(
        `${this.apiUrl}/TestScript/InitiateChangePhase?projectId=${projectId}`,
        dto
      );
    }

        // Call the CheckPhaseChangeReady endpoint
    checkSignOffReady(projectId: string): Observable<ProjectSignOffReturnDto> {
      return this.httpClient.get<ProjectSignOffReturnDto>(
        `${this.apiUrl}/TestScript/CheckSignOffReady?projectId=${projectId}`
      );
    }


    getPhases(): Observable<{ phaseId: number; phaseName: string }[]> {
      return this.httpClient.get<{ phaseId: number; phaseName: string }[]>(`${this.apiUrl}/Projects/GetAllPhases`);
    }

    //Call the GetFilteredProjectsForUser endpoint
    getFilteredProjectsForUser(userId: string): Observable<Project[]> {
      return this.httpClient.get<Project[]>(
        `${this.apiUrl}/Projects/GetProjectsFilteredForUserAccess/${userId}`);
    }

}
