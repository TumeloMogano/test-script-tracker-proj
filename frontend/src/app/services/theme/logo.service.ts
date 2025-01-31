import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Logo } from '../../models/theme';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class LogoService {
  private apiUrl = `${environment.baseUrl}/Clients`;

  // private apiUrl = 'https://localhost:7089/api/';

  constructor(private http: HttpClient) { }

  addLogo(themeId: string, logoModel: Logo): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddLogo/${themeId}`, logoModel);
  }

  updateLogo(logoId: string, logoModel: Logo): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateLogo/${logoId}`, logoModel);
  }

  removeLogo(logoId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/RemoveLogo/${logoId}`);
  }

  getThemeLogos(themeId: string): Observable<Logo[]> {
    return this.http.get<Logo[]>(`${this.apiUrl}/GetThemeLogos/${themeId}`);
  }

  getLogoById(logoId: string): Observable<Logo> {
    return this.http.get<Logo>(`${this.apiUrl}/GetLogoById/${logoId}`);
  }
}
