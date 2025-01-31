import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Role } from '../../models/role.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
 private apiUrl = `${environment.baseUrl}/Roles`
 private confUrl = `${environment.baseUrl}/AccessControl`
  constructor(private http: HttpClient) { }

  getRoles(): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/GetAllRoles`);
  }

  createRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(`${this.apiUrl}/CreateRole`, role);
  }

  getRoleById(roleId: string): Observable<Role> {
    return this.http.get<Role>(`${this.apiUrl}/GetRoleById/${roleId}`);
  }

  updateRole(roleId: string, role: Partial<Role>): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/UpdateRole/${roleId}`, role);
  }

  deleteRole(roleId: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/RemoveRole/${roleId}`, { responseType: 'text' as 'json' });
  }

  getRoleConfiguration(roleId: string): Observable<any> {
    return this.http.get<any>(`${this.confUrl}/GetConfiguration/${roleId}`);
  }

  updateRoleConfiguration(roleId: string, permissions: number): Observable<any> {
    const payload = {
      roleId: roleId,
      permissions: permissions
    };
    return this.http.put<any>(`${this.confUrl}/UpdateConfiguration`, payload)
  }

  addUserToRole(userId: string, roleName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/AddUserToRole`, { userId, roleName }, { responseType: 'text' as 'json' });
  }

  removeUserFromRole(userId: string, roleName: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/RemoveUserFromRole`, { userId, roleName }, { responseType: 'text' as 'json' });
  }

  getUserRolesByEmail(email: string): Observable<Role[]> {
    return this.http.get<Role[]>(`${this.apiUrl}/GetUserRoles/${email}`);
  }

}
