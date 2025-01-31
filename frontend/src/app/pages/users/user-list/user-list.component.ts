import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users/users.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AspUsers } from '../../../models/aspusers';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import { Message } from 'primeng/api';
import { PermissionsService } from '../../../services/auth/permissions.service';
import { Permissions } from '../../../models/permissions.enums';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.scss'
})
export class UserListComponent implements OnInit{
  users: AspUsers[] = [];
  filteredUsers: AspUsers[] = [];
  page: number = 1;
  numRequests: number = 0;
  ApproveRegistrationsExistMessages: Message[] = [];
  registrationStatuses: { regStatusId: number; regStatusName: string }[] = []; 
  selectedRegistrationStatusId: number | null = null; 



  Permissions = Permissions;

constructor (
  private router: Router, 
  private userService: AspUsersServices, 
  private httpClient: HttpClient,
  private permissionService: PermissionsService
  ){}

 ngOnInit(): void {  
  this.getUsers();
  this.showApproveRegistrationsExistMessage()
  this.loadRequests()
  this.loadRegistrationStatuses();

 }

 goApprove(): void {
  this.router.navigate(['/user-approve'])
  }

getUsers(): void {
  this.userService.getUsers().subscribe({
    next: (data: AspUsers[]) => {
      this.users = data;
      this.filteredUsers = data;
    },
    error: (error) => {
      console.error('Error fetching clients:', error);
    }
  });
}

loadRegistrationStatuses(): void {
  this.userService.getRegistrationStatuses().subscribe((statuses) => {
    this.registrationStatuses = statuses;
  });
}

showApproveRegistrationsExistMessage() {
  this.ApproveRegistrationsExistMessages = [
    {
      severity: 'info',
      summary: 'Approve Registrations:',
      detail: `There are user registration requests that are awaiting to be approved, please proceed to verify the registrations.`,
      sticky: true
    }
  ];
}

loadRequests(): void {
  this.userService.getRequests().subscribe(
    (data: AspUsers[]) => {
      this.users = data;
      this.numRequests = this.users.length;
      console.log('Number of Requests:', this.numRequests);
    },
    (error) => {
      console.error('Failed to load requests', error);
    }
  );
}

viewUserDetails(email?: string): void {
  this.router.navigate(['/user-details', email]);
}
onSearch(event: any): void {
  const searchTerm = event.target.value.toLowerCase();
  this.filteredUsers = this.users.filter(user => 
    user.userFirstName?.toLowerCase().includes(searchTerm) ||
    user.userEmailAddress?.toLowerCase().includes(searchTerm) ||
    user.userSurname?.toString().toLowerCase().includes(searchTerm) 
    
  ); 
}

onFilterChange(): void {
  const selectedStatusId = Number(this.selectedRegistrationStatusId);

  if (selectedStatusId) {
    this.filteredUsers = this.users.filter(user => user.regStatusId === selectedStatusId);
  } else {
    this.filteredUsers = [...this.users];
  }
}

clearFilters(): void {
  this.selectedRegistrationStatusId = null;
  //this.searchQuery = '';
  this.filteredUsers = [...this.users];
}

hasPermission(permission: Permissions): boolean {
  return this.permissionService.hasPermission(permission)
}

}