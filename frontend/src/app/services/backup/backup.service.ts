import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BackupService {
  private apiUrl = `${environment.baseUrl}/BackupRestore`;

  constructor(
    private http: HttpClient
  ) { }

  createBackup(): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/CreateBackup`, {});
  }

  getAllBackups(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/GetAllBackups`);
  }

  restoreBackup(backupName: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/RestoreBackup`, { backupName });
  }
}
