import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable, of, tap } from 'rxjs';
import { AuthUser, LoginRequest } from '../../models/auth/auth.model';
import { JwtService } from './jwt.service';
import { environment } from '../../../environments/environment.development';
import { MessageService } from 'primeng/api';
import { PermissionsService } from './permissions.service';
import { LoadingService } from '../loading/loading.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl: string = `${environment.baseUrl}/Authentication`;
  private userDetailsSubject = new BehaviorSubject<AuthUser | null>(null);
  userDetails$ = this.userDetailsSubject.asObservable();
  private readonly userDetailsKey = 'userDetails';
  private loggedInSource = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedInSource.asObservable();

  constructor(
    private http: HttpClient, 
    private jwtService: JwtService, 
    private messageService: MessageService,
    private permissionsService: PermissionsService,
    private loadingService: LoadingService,
    private router: Router
  ) {
    this.loadUserDetailsFromStorage();
   }

  login(request: LoginRequest): Observable<any> {
    const minimumDisplayTime = 3000;
    const startTime = Date.now();
    this.loggedInSource.next(true);
    return this.http.post<any>(`${this.apiUrl}/Sign-in`, request)
    .pipe(
      tap({
        next: response => {
          this.jwtService.setToken(response.accessToken);
          this.permissionsService.refreshPermissions();
          this.fetchUserDetails(response.email).subscribe(() => {            
            this.router.navigate(['/dashboard']).then(() => {
              const elapsedTime = Date.now() - startTime;
              const remainingTime = minimumDisplayTime - elapsedTime;
              if (remainingTime > 0) {
                setTimeout(() => {
                  this.loadingService.hide();
                }, remainingTime);
              } else {
                this.loadingService.hide();
              }
            });
          });          
        }       
      }),
      catchError(error => {
        this.loadingService.hide();
        if (error.status === 400) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Incorrect Email or Password. Please try again.', key: 'bc' });
        } 
        if (error.status === 500) {
          this.messageService.add({ severity: 'Error', summary: 'Error', detail: 'Login not successful. Please try again', key: 'bc'});
        }
        return of(null);
      })
    );
    
  }

  private fetchUserDetails(email: string): Observable<AuthUser> {
    return this.http.get<AuthUser>(`${this.apiUrl}/GetUserDetails/${encodeURIComponent(email)}`).pipe(
      tap(user => this.setUserDetails(user))
    );
  }

  private setUserDetails(user: AuthUser): void {
    this.userDetailsSubject.next(user);
    localStorage.setItem(this.userDetailsKey, JSON.stringify(user));
  }

  private loadUserDetailsFromStorage(): void {
    const userDetails = localStorage.getItem(this.userDetailsKey);
    if (userDetails) {
      this.userDetailsSubject.next(JSON.parse(userDetails));
    }
  }

  logout(): void {
    this.loggedInSource.next(false);
    this.jwtService.removeToken();
    this.permissionsService.clearPermissions();
    this.clearUserDetails();
    this.loadingService.hide();
    this.router.navigate(['/login2'])
    this.messageService.add({ severity: 'info', summary: 'Logged Out', detail: 'You have been successfully logged out.', key: 'tl' });
  }

  private clearUserDetails(): void {
    this.userDetailsSubject.next(null);
    localStorage.removeItem(this.userDetailsKey);
  }

  isAuthenticated(): boolean {
    return this.jwtService.isAuthenticated();
  }

  getUserDetails(): AuthUser | null {
    return this.userDetailsSubject.value;
  }


  //Nosipho  - returning user id or user email 

  getCurrentUserId(): string | null {
    const userDetails = this.getUserDetails();
    return userDetails ? userDetails.id : null; // Assuming `id` is the unique identifier for the user
  }

  getCurrentUserEmail(): string | null {
    const userDetails = this.getUserDetails();
    return userDetails ? userDetails.email : null;
  }

  // isLoggedIn(): Observable<boolean> {
  //   return this.isLoggedInSubject.asObservable();
  // }
  

}
