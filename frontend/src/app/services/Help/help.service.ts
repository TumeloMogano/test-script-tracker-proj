import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface HelpPage {
  helpPageID: number;
  question: string;
  answer: string;
}


@Injectable({
  providedIn: 'root'
})
export class HelpService {
  private apiUrl = `${environment.baseUrl}/HelpPage`;

// private apiUrl = 'https://localhost:7089/api/HelpPage';

constructor (private http: HttpClient){}

getHelpPageItems():Observable<HelpPage[]> {
  return this.http.get<HelpPage[]>(this.apiUrl);

}

searchHelpPageItems(query: string): Observable<HelpPage[]> {
  const url = `${this.apiUrl}/search?query=${query}`;
  return this.http.get<HelpPage[]>(url);
}
}
