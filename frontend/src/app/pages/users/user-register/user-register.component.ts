import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AspUsers } from '../../../models/aspusers';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrl: './user-register.component.scss'
})
export class UserRegisterComponent {
  constructor(private router: Router, private userService: AspUsersServices, 
    public messageService: MessageService,
    public confirmationService: ConfirmationService){}
  usertype: string = 'employee';
  useremail: string = ' ';
  regCode: string = ' ';
  testUser!: AspUsers;
  
  goRequest() : void {
    this.router.navigate(['/user-request'])
  }
  goLogIn() : void {
    this.router.navigate(['/login2'])
  }

  // registerUser(): void {
  //   if (this.useremail && this.regCode.length >= 5) {
  //     this.router.navigate(['/user-password', this.usertype, this.useremail, this.regCode]);
  //   }}
  registerUser() {
    this.userService.getUserByEmail(this.useremail).subscribe(
      user => {
        console.log('Fetched user details:', user);
        if(user.regStatusId == 1){
          this.messageService.add({
          severity: 'info',
          summary: 'Info',
          detail: 'User registration request is not yet approved. Please look out for communication via email',
          key: 'bc'
        });
        this.router.navigate(['/login2']);
      }
    else if(user.regStatusId == 2){
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to register this user profile?',
      accept: () => {
        if (this.useremail && this.regCode.length >= 5) {
          this.router.navigate(['/user-password', this.usertype, this.useremail, this.regCode]).then(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Registration code captured successfully',
              key: 'bc'
            });
            
          }).catch(error => {
            console.error('Navigation Error:', error);  
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to navigate to the user-password page',
              key: 'bc'
            });
            this.router.navigate(['/login2']);
          });
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Validation failed: Please ensure all fields are filled correctly',
            key: 'bc'
          });
        }
      },
      reject: () => {
      }
    }); 
  }
    else if(user.regStatusId == 3){
    this.messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: 'User registration request is rejected. Please check your emails',
    key: 'bc'
  });
  this.router.navigate(['/login2']);
} else if (user.regStatusId == 4){
  this.messageService.add({
  severity: 'info',
  summary: 'Info',
  detail: 'User email is already registered',
  key: 'bc'
});
this.router.navigate(['/login2']);
}
},
error => {
  console.error('Error fetching user details', error);
  this.messageService.add({
    severity: 'error',
    summary: 'Error',
    detail: 'User registration request does not exist, please contact admin.',
    key: 'bc'
  });
  this.router.navigate(['/login2']);
}
);}}

  
