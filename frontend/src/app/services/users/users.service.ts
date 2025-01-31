import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../models/user';
import { Role } from '../../models/role.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private apiUrl = `${environment.baseUrl}/User`;


  // private apiUrl = 'https://localhost:7089';
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  private selectedUser: User | null = null;
  constructor(private httpClient: HttpClient) { }


  getSelectedUser(): User | null{
    return this.selectedUser;
  }
  setSelectedUser(user:User):void {
    this.selectedUser = user;
  }

  // endpoints
  getUsers(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/GetAllUsers`);
  }

  createUser(user: User): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/RegistrationRequest/`, user, this.httpOptions);
  }

  registerUser(user: User): Observable<any>{
    return this.httpClient.put(`${this.apiUrl}/RegisterUser/`, user, this.httpOptions);
  }
  registerClientRep(user: User): Observable<any>{
    return this.httpClient.put(`${this.apiUrl}/RegisterClient/`, user, this.httpOptions);
  }
  getRequests(): Observable<User[]> {
    return this.httpClient.get<User[]>(`${this.apiUrl}/GetRequests`);
  }

  approveRequest(userId: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/ApproveRequests/?userid=${userId}`, this.httpOptions);
  }
  rejectRequest(userId: number): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/RejectRequests?userid=${userId}`, this.httpOptions);
  }
  // getUserById(user: User): Observable<any> {
  //   return this.httpClient.get(`${this.apiUrl}/GetUserById/${user.userId}`, user, this.httpOptions);
  // }
  getUserById(userId: number): Observable<User> {
    return this.httpClient.get<User>(`${this.apiUrl}/GetUserById/${userId}`, this.httpOptions)
  }
  updateUser(user: User): Observable<any> {
    return this.httpClient.put(`${this.apiUrl}/UpdateUser/${user.userId}`, user, this.httpOptions);
  }

  removeUser(userId: number): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/RemoveUser/${userId}`);
  }



}