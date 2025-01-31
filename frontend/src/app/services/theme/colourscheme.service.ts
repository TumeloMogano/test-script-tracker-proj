import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ColourScheme } from '../../models/theme';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ColourSchemeService {
  private apiUrl = `${environment.baseUrl}/Clients`;

  // private apiUrl = 'https://localhost:7089/api/';

  constructor(private http: HttpClient) { }

  addColourScheme(themeId: string, colorSchemeModel: ColourScheme): Observable<any> {
    return this.http.post(`${this.apiUrl}/AddColorScheme/${themeId}`, colorSchemeModel);
  }

  updateColourScheme(csId: string, colorSchemeModel: ColourScheme): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateColourScheme/${csId}`, colorSchemeModel);
  }

  removeColourScheme(csId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/RemoveColourScheme/${csId}`);
  }

  getColourSchemeById(colourSchemeId: string): Observable<ColourScheme> {
    return this.http.get<ColourScheme>(`${this.apiUrl}/GetColourSchemeById/${colourSchemeId}`);
  }

  getThemeColourSchemes(themeId: string): Observable<ColourScheme[]> {
    return this.http.get<ColourScheme[]>(`${this.apiUrl}/GetThemeColourSchemes/${themeId}`);
  }
}
