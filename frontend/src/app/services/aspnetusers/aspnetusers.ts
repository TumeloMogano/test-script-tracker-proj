import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AspUsers } from '../../models/aspusers';
import { AST } from '@angular/compiler';
import { ClientRepresentative } from '../../models/client/clientrep.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AspUsersServices {
  // private apiUrl = 'https://localhost:7089';
  private apiUrl = `${environment.baseUrl}/Authentication`;


  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  constructor(private httpClient: HttpClient) { }


  // private handleError<T>(operation = 'operation', result?: T) {
  //   return (error: any): Observable<T> => {
  //     console.error(`${operation} failed: ${error.message}`);
  //     return of(result as T);
  //   };}

// endpoints

  registrationRequest(user: AspUsers): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/RegistrationRequest/`, user, this.httpOptions);
  }

  registerUser(usertype: string, useremail: string, registeredUser: AspUsers): Observable<any> {
    const url = `${this.apiUrl}/RegisterUser?usertype=${usertype}&useremail=${useremail}`;
    return this.httpClient.put<any>(url, registeredUser, this.httpOptions);
  }
  registerClientRep(usertype: string, useremail: string): Observable<any> {
    const url = `${this.apiUrl}/RegisterClient?usertype=${usertype}&useremail=${useremail}`;
    return this.httpClient.post<any>(url, this.httpOptions);
  }
  // registerClientR(usertype: string, useremail: string): Observable<any> {
  //   return this.httpClient.post(`${this.apiUrl}/RegisterClient/`, JSON.stringify(usertype), JSON.stringify(useremail), this.httpOptions);
  // }
  getUsers(): Observable<AspUsers[]> {
    return this.httpClient.get<AspUsers[]>(`${this.apiUrl}/GetsAllUsers`);
  }

  getRequests(): Observable<AspUsers[]> {
    return this.httpClient.get<AspUsers[]>(`${this.apiUrl}/GetsRequests`);
  }

  approveRequest(useremail: String): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/ApproveRequests/?useremail=${useremail}`, this.httpOptions);
  }
  rejectRequest(useremail: String): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/RejectRequests?useremail=${useremail}`, this.httpOptions);
  }

  getUserByEmail(email: String): Observable<AspUsers> {
    const url = `${this.apiUrl}/GetUsersByEmail?email=${email}`;
    return this.httpClient.get<AspUsers>(url, this.httpOptions);
  }
  getCRepByEmail(email: String): Observable<ClientRepresentative> {
    const url = `${this.apiUrl}/GetCRepsByEmail?email=${email}`;
    return this.httpClient.get<ClientRepresentative>(url, this.httpOptions);
  }
  
  updateUser(email?: String, updatedUser?: AspUsers): Observable<any> {
    const url = `${this.apiUrl}/UpdateUsers?email=${email}`;
    return this.httpClient.put<any>(url, updatedUser, this.httpOptions);
  }
  
  removeUser(email?: String): Observable<any> {
    const url = `${this.apiUrl}/RemoveUsers?email=${email}`;
    return this.httpClient.delete<any>(url, this.httpOptions);
  }

  getUserById(userId: string): Observable<AspUsers> {
    return this.httpClient.get<AspUsers>(`${this.apiUrl}/GetUserById/${userId}`);
  }

  getRegistrationStatuses(): Observable<{ regStatusId: number; regStatusName: string }[]> {
    return this.httpClient.get<{ regStatusId: number; regStatusName: string }[]>(`${this.apiUrl}/GetAllRegistrationStatuses`);
  }
}
