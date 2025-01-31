import { Component, OnInit } from '@angular/core';
import { AspUsers } from '../../../models/aspusers';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import { AuthService } from '../../../services/auth/auth.service';
import { Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-account.component.html',
  styleUrls: ['./user-account.component.scss']
})
export class UserAccountComponent implements OnInit{
  user: AspUsers | null = null;

  constructor(
    private aspService: AspUsersServices,
    private authService: AuthService,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadUserDetails();
  }

  loadUserDetails(): void {
    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.aspService.getUserById(userId).subscribe({
        next: (response) => {
          this.user = response;
        },
        error: (err) => {
          console.error('Failed to fetch user details', err);
        }
      });
    } else {
      console.error('No userId not found.');
    }
  }

  goUpdateAccount(): void {
    const userEmail = this.user?.userEmailAddress;    
      if (userEmail) {
        this.confirmationService.confirm({
          message: 'Are you sure you want to update account details?',
          header: 'Update Account',
          accept: () => {
            this.router.navigate(['/user-update', userEmail ]);
          }
        });
      }
  }

  goUpdatePassword(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to update you password?',
      header: 'Update Password',
      accept: () => {
        this.router.navigate(['/resetpassword1']);
      }
    });
  }

  goLogOut(): void {
    this.authService.logout();
  }

  onLogout(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to Log-out?',
      accept: () => {
        this.authService.logout();
        this.router.navigate(['/login2']);
      },
      reject: () => {
        console.log('Logout cancelled');
      }
    });   
  }

}
