import { Component, OnInit } from '@angular/core';
import { AuthUser } from '../../models/auth/auth.model';
import { AuthService } from '../../services/auth/auth.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { PermissionsService } from '../../services/auth/permissions.service';
import { Permissions } from '../../models/permissions.enums';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user$: Observable<AuthUser | null>;

  Permissions = Permissions;

  constructor(
    private authService: AuthService,
    private router: Router,
    private permissionsService: PermissionsService
  ) {
    this.user$ = this.authService.userDetails$;
  }

  ngOnInit(): void {
    // This will be handled by the sidebar component
  };

  viewProfile(): void {
    const userid = this.authService.getCurrentUserId();

    if (userid) {
      this.router.navigate(['/view-profile', userid]);
    }
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissionsService.hasPermission(permission)
  }
}

