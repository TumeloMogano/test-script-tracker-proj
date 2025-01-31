import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusType } from '../../models/status/status.model';
import { Status, StatusViewModel } from '../../models/status/statustype.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class StatusService {
  private apiUrl = `${environment.baseUrl}/Status`;

  constructor(private httpClient: HttpClient) {}

  getStatusTypes(): Observable<StatusType[]> {
    return this.httpClient.get<StatusType[]>(`${this.apiUrl}/GetStatusTypes`);
  }

  createStatus(status: StatusViewModel): Observable<any> {
    return this.httpClient.post<any>(`${this.apiUrl}/CreateStatus`, status);
  }

  getStatuses(): Observable<Status[]> {
    return this.httpClient.get<Status[]>(`${this.apiUrl}/GetStatuses`);
  }

  getStatusById(statusId: string): Observable<Status> {
    return this.httpClient.get<Status>(
      `${this.apiUrl}/GetStatusById/${statusId}`
    );
  }

  updateStatus(status: StatusViewModel, statusId: string): Observable<any> {
    return this.httpClient.put<any>(
      `${this.apiUrl}/UpdateStatus/${statusId}`,
      status
    );
  }

  deleteStatus(statusId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/DeleteStatus/${statusId}`);
  }
}
