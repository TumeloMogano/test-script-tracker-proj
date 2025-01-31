import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Defect } from '../../models/testscript/defects';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class DefectsServices {
    private apiUrl = `${environment.baseUrl}/Defect`;

   // private apiUrl = 'https://localhost:7089';

    private httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  constructor(private http: HttpClient) { }

  logDefect(defect: Defect): Observable<Defect> {
    return this.http.post(`${this.apiUrl}/LogDefect`, defect, this.httpOptions);
  }

  closeDefect(defectId: string): Observable<Defect> {
    return this.http.put(`${this.apiUrl}/CloseDefect?defectId=${defectId}`, null, this.httpOptions);
  }

  resolveDefect(defectId: string): Observable<Defect> {
    return this.http.put(`${this.apiUrl}/ResolveDefect?defectId=${defectId}`, null, this.httpOptions);
  }

  unresolveDefect(defectId: string): Observable<Defect> {
    return this.http.put(`${this.apiUrl}/UnresolveDefect?defectId=${defectId}`, null, this.httpOptions);
  }
  getAllDefects(): Observable<Defect[]> {
    return this.http.get<Defect[]>(`${this.apiUrl}/GetAllDefects`);
  }

  getDefects(testScriptId: string): Observable<Defect[]> {
    return this.http.get<Defect[]>(`${this.apiUrl}/GetDefects?testScriptId=${testScriptId}`);
  }

  getDefect(defectId: string): Observable<Defect> {
    return this.http.get(`${this.apiUrl}/GetDefect/${defectId}`, this.httpOptions);
  }
  
  // updateDefect(defectId: string, defectUpdate: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/UpdateDefect?defectId=${defectId}`, defectUpdate, this.httpOptions);
  // }
 
  // updateD(defectId: string, defectUpdate: any): Observable<Defect> {
  //   return this.http.put(`${this.apiUrl}/Updatedefect?defectId=${defectId}`, defectUpdate, this.httpOptions);
  // }
  updateDefects(defectId: string, defectDescription: string): Observable<Defect> {
    return this.http.put(`${this.apiUrl}/UpdateDefect/${defectId}`, JSON.stringify(defectDescription), this.httpOptions);
  }
  
  removeDefect(defectId: string): Observable<Defect> {
    return this.http.delete(`${this.apiUrl}/RemoveDefect?defect=${defectId}`, this.httpOptions);
  }

  getDefectByStatus(statusId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetDefectByStatus?statusId=${statusId}`, this.httpOptions);
  }
  
}
