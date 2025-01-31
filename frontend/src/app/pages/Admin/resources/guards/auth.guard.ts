import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { inject } from '@angular/core';
import { MessageService } from 'primeng/api';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    messageService.add({ severity: 'error', summary: 'Error', detail: 'You must be logged in to access this page.', key: 'bc'});
    router.navigate(['/login2']);
    return false;
  }

};
