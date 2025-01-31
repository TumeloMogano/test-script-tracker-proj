import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuditLog } from '../../models/auditlog';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuditlogService {
  private apiUrl = `${environment.baseUrl}/AuditLog`;

  // private apiUrl = 'https://localhost:7089/api/AuditLog';

  constructor(private http:HttpClient) { }
  
  getAuditLogs(): Observable<AuditLog[]> {
    return this.http.get<AuditLog[]>(`${this.apiUrl}`);
  }

  //Method to get the audit logss using a filter 
  getFilteredAuditLogs(firstName: string, surname: string, actionName: string, startDate: string, endDate: string): Observable<AuditLog[]> {
    let params = new HttpParams();
    if (firstName) params = params.append('firstName', firstName);
    if (surname) params = params.append('surname', surname);
    if (actionName) params = params.append('actionName', actionName);
    if (startDate) params = params.append('startDate', startDate);
    if (endDate) params = params.append('endDate', endDate);
  
    return this.http.get<AuditLog[]>(`${this.apiUrl}`, { params });
  }
  
}
