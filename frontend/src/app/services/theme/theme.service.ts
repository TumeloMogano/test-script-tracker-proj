import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Theme, Font, ThemeDetails, ThemeDto, UpdateThemeDto, ColourScheme  } from '../../models/theme';
import { ThemeRequest } from '../../models/theme-request';
import { F } from '@fullcalendar/core/internal-common';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private apiUrl = `${environment.baseUrl}/Clients`;

  // private apiUrl = 'https://localhost:7089/api/';

  constructor(private http: HttpClient) { }

  createTheme(clientId: string, themeRequest: ThemeRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/CreateTheme/${clientId}`, themeRequest);
  }
  updateTheme(themeId: string, theme: UpdateThemeDto): Observable<Theme> {
    return this.http.put<Theme>(`${this.apiUrl}/UpdateTheme/${themeId}`, theme);
  }

  deleteTheme(themeId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/RemoveTheme/${themeId}`);
  }

  getClientThemes(clientId: string): Observable<Theme[]> {
    return this.http.get<Theme[]>(`${this.apiUrl}/GetClientThemes/${clientId}`);
  }

  getAllFonts(): Observable<Font[]> {
    return this.http.get<Font[]>(`${this.apiUrl}/GetAllFonts`);
  }

  getThemeById(themeId: string): Observable<ThemeDetails> {
    return this.http.get<ThemeDetails>(`${this.apiUrl}/GetThemeById/${themeId}`);
  }
  getThemeFullById(themeId: string): Observable<Theme> {
    return this.http.get<Theme>(`${this.apiUrl}/GetThemeFullById/${themeId}`);
  }
  getCFullById(colourId: string): Observable<ColourScheme> {
    return this.http.get<ColourScheme>(`${this.apiUrl}/GetCFullById/${colourId}`);
  }
  getFontById(fontId: number): Observable<Font> {
    return this.http.get<Font>(`${this.apiUrl}/GetFontById/${fontId}`);
  }
}
