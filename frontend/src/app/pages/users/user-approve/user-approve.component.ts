import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users/users.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AspUsers } from '../../../models/aspusers';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
  selector: 'app-user-approve',
  templateUrl: './user-approve.component.html',
  styleUrl: './user-approve.component.scss'
})
export class UserApproveComponent implements OnInit{
  users: AspUsers[] = [];
  page: number = 1;

constructor(private router: Router, private userService: AspUsersServices,  
  public messageService: MessageService,
  public confirmationService: ConfirmationService,){}
ngOnInit(): void {
  this.loadRequests();
}
loadRequests(): void {
  this.userService.getRequests().subscribe(
    (data: AspUsers[]) => {
      this.users = data;
    },
    (error) => {
      console.error('Failed to load requests', error);
    }
  );
}
approveRequest(user: AspUsers) {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to approve this user?',
      accept: () => {
        console.log(user);
        if (user.userEmailAddress){
          this.userService.approveRequest(user.userEmailAddress).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Approved',
              detail: 'User approved successfully',
              key: 'bc'
            });
            this.ngOnInit();
          },
          error => {
            console.error('Validation Errors:', error.error.errors);  
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to approve user registration request',
              key: 'bc'
            });
            location.reload();}
        );}
      },
      reject: () => {
        
      }
    });}
  //   this.userService.approveRequest(user.userEmailAddress).subscribe(
  //     response => {
  //       console.log('User approved successfully', response);
  //       this.loadRequests(); // Refresh the list after approval
  //     },
  //     error => {
  //       console.error('Error approving user', error);
  //     }
  //   );
  // } else {
  //   console.error('User ID is undefined');
  // }
  goBack(): void {
    this.router.navigate(['/user-list']); 
  }
  rejectRequest(user: AspUsers) {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to reject this user?',
      accept: () => {
        console.log(user);
        if (user.userEmailAddress){
          this.userService.rejectRequest(user.userEmailAddress).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Rejected',
              detail: 'User rejected successfully',
              key: 'bc'
            });
            this.ngOnInit();
          },
          error => {
            console.error('Validation Errors:', error.error.errors);  
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to reject user registration request',
              key: 'bc'
            });
            location.reload();}
        );}
      },
      reject: () => {
        
      }
    });}
// rejectRequest(user: AspUsers) {
//   if (user.userEmailAddress !== undefined) {
//     this.userService.rejectRequest(user.userEmailAddress).subscribe(
//       response => {
//         console.log('User rejected successfully', response);
//         this.loadRequests(); // Refresh the list after rejection
//       },
//       error => {
//         console.error('Error rejecting user', error);
//       }
//     );
//   } else {
//     console.error('User ID is undefined');
//   }}

  goList(): void {
   this.router.navigate(['/user-list'])
  }
}
