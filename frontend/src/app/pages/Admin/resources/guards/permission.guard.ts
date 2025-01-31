import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { PermissionsService } from '../../../../services/auth/permissions.service';
import { MessageService } from 'primeng/api';
import { Permissions } from '../../../../models/permissions.enums';

export const permissionGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const permissionService = inject(PermissionsService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login2']);
    return false;
  }

  const requiredPermission: Permissions = route.data['permission'];

  if (permissionService.hasPermission(requiredPermission)) {
    console.log('Permission granted');
    return true;
  } else {
    console.log('Permission denied');
    router.navigate(['/forbidden-403']);
    return false;
  }
};
