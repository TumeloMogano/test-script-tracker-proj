import { Injectable } from '@angular/core';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Permissions } from '../../models/permissions.enums';


@Injectable({
  providedIn: 'root'
})
export class JwtService {
  private readonly tokenKey = 'accessToken';

  constructor() { }

  setToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  removeToken(): void {
    localStorage.removeItem(this.tokenKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  decodeToken(): any {
    const token = this.getToken();
    if (token) {
      return jwtDecode<JwtPayload>(token);
    }
    return null
  }

  getPermissions(): Permissions | null {
    const decodedToken = this.decodeToken();
    if (!decodedToken || !decodedToken['Permissions']) return null;
    
    const permissions = parseInt(decodedToken['Permissions'], 10);
    console.log(`Decoded Permissions: ${permissions}`);
    return permissions as Permissions;
  }

}


