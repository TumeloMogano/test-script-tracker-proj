import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AddTeamMember, Team, TeamMember, TeamUser } from '../../models/team/team.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private apiUrl = `${environment.baseUrl}/Teams`
  constructor(private http: HttpClient) { }

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/GetTeams`);
  }

  getTeamMembers(teamId: string): Observable<TeamMember[]> {
    return this.http.get<TeamMember[]>(`${this.apiUrl}/GetTeamMembers/${teamId}`);
  }

  getTeamById(teamId: string): Observable<Team> {
    return this.http.get<Team>(`${this.apiUrl}/GetTeamById/${teamId}`);
  }

  createTeam(team: Team): Observable<Team> {
    return this.http.post<Team>(`${this.apiUrl}/CreateTeam`, team);
  }

  updateTeam(teamId: string, team: Team): Observable<void>{
    return this.http.put<void>(`${this.apiUrl}/UpdateTeam/${teamId}`, team);
  }

  deleteTeam(teamId: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/RemoveTeam/${teamId}`);
  }

  removeTeamMember(teamId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${teamId}/member/${userId}`);
  }
  
  getAvailableUsers(teamId: string): Observable<TeamUser[]> {
    return this.http.get<TeamUser[]>(`${this.apiUrl}/GetAvailableUsers/${teamId}`);
  }

  addTeamMembers(teamId: string , teamMembers: { teamId: string, userId: string, isTeamLead: boolean }[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/AddTeamMember/${teamId}`, { teamId, teamMembers });
  }

  getFullTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/GetFullTeams`);
  }


  updateIsTeamLead(teamId: string, userId: string, isTeamLead: boolean): Observable<void> {
    const url = `${this.apiUrl}/${teamId}/member/${userId}/isTeamLead`;
    return this.http.patch<void>(url, isTeamLead, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  isUserTeamLead(userId: string, projectId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/IsUserTeamLead/${userId}/${projectId}`);
  }

  canAddMemberToTeam(teamId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/CanAddMemberToTeam/${teamId}`);
  }

  canAddTeamLead(teamId: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/CanAddTeamLead/${teamId}`);
  }

  getFilteredTeamsForUser(userId: string): Observable<Team[]> {
    return this.http.get<Team[]>(`${this.apiUrl}/GetFilteredTeamsForUser/${userId}`);
  }




}
