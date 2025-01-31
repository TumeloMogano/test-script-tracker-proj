import { Injectable } from '@angular/core';
import { Permissions } from '../../models/permissions.enums';
import { AuthService } from './auth.service';
import { JwtService } from './jwt.service';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class PermissionsService {
  private apiUrl = `${environment.baseUrl}/AccessControl`

  private userPermissions: Permissions | null = null;

  constructor(private jwtService: JwtService) {
    this.refreshPermissions();
  }

  refreshPermissions(): void {
    this.userPermissions = this.jwtService.getPermissions();
    console.log(`Permissions refreshed: ${this.userPermissions}`);
  }

  clearPermissions(): void {
    this.userPermissions = null;
    console.log(`Permissions cleared`);
  }

  hasPermission(requiredPermission: Permissions): boolean {
    if (requiredPermission === Permissions.None) return true;
    if (!this.userPermissions) return false;
    return (this.userPermissions & requiredPermission) === requiredPermission;
  }
}
