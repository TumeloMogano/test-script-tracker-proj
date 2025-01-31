import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LogoutService {
 private logoutUrl = 'http://localhost:5045/api/User/logout';

  constructor(private http: HttpClient) { }

  logout():Observable<any> {
    return this.http.post(this.logoutUrl, {});
  }
}
