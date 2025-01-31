import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../../models/user';
import { UsersService } from '../../../services/users/users.service';
import { AspUsers } from '../../../models/aspusers';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import { Role, RoleWithChecked } from '../../../models/role.model';
import { RolesService } from '../../../services/roles/roles.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { PermissionsService } from '../../../services/auth/permissions.service';
import { Permissions } from '../../../models/permissions.enums';
import { ClientRepresentative } from '../../../models/client/clientrep.model';
import { ClientService } from '../../../services/clients/client.service';

import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit{
  user: AspUsers ={
    id: '',
    userFirstName: '',
    userSurname: '',
    userIDNumber: '',
    userContactNumber: '',
    userEmailAddress: '',
    templateCreation: ''
  } ;
  isUser: boolean = true;
  isRegistered: boolean = true;
  roles: RoleWithChecked[] = [];
  userRoles: string[] = [];

  Permissions = Permissions;
  
constructor(
  private router: Router,
  private userService: AspUsersServices, 
  private route: ActivatedRoute,
  public messageService: MessageService,
  public confirmationService: ConfirmationService,
  private rolesService: RolesService,
  private permissionsService: PermissionsService,
  private clientService: ClientService
) {}

ngOnInit(): void {
  const email = this.route.snapshot.paramMap.get('email') || '';
  this.getUserDetails(email);
}

ngAfterViewInit(): void {
  this.initializeTooltips();
}

getUserDetails(email: string): void {
  this.userService.getUserByEmail(email).subscribe(user => {
    this.user = user;
    if(this.user.registrationCode == null){ this.isUser = false;}
    if(this.user.regStatusId != 4){this.isRegistered = false;}
  console.log(this.user.registrationCode);
  console.log(this.isUser);
    this.loadRoles(email);
  });
}

loadRoles(email: string): void {
  this.rolesService.getRoles().subscribe(roles => {
    this.rolesService.getUserRolesByEmail(email).subscribe(userRoles => {
      this.userRoles = userRoles.map(role => role.name);
      this.roles = roles.map(role => ({
        ...role,
        checked: this.userRoles.includes(role.name)
      }));
    });
  });
}

toggleRole(role: RoleWithChecked, event: Event): void {
  const isChecked = (event.target as HTMLInputElement).checked;
  const action = isChecked ? 'assign' : 'unassign';
  const message = `Are you sure you want to ${action} the role '${role.name}' to the user?`;

  this.confirmationService.confirm({
    header: 'Confirm Role Change',
    message: message,
    accept: () => {
      if (isChecked) {
        this.assignRole(role.name);
      } else {
        this.unassignRole(role.name);
      }
    },
    reject: () => {
      role.checked = !isChecked;
    }
  }); 
}

assignRole(role: string): void {
  if (this.user.id) {
    this.rolesService.addUserToRole(this.user.id, role).subscribe(
      () => {
        this.userRoles.push(role);
        this.messageService.add({
          severity: 'success',
          summary: 'Summary',
          detail: `Role '${role}' assigned successfully`,
          key: 'bc'
        });
    },
    error => {
      console.error('Error assigning role:', error);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: `Failed to assigned role '${role}'.`,
        key: 'bc'
      });
    }
    );
  }
}

unassignRole(role: string): void {
  if (this.user.id) {
    this.rolesService.removeUserFromRole(this.user.id, role).subscribe(
      () => {
      const roleIndex = this.userRoles.indexOf(role);
      if (roleIndex !== -1) {
        this.userRoles.splice(roleIndex, 1);
      }
      this.messageService.add({
        severity: 'success',
        summary: 'Success',
        detail: `Role '${role}' unassigned successfully.`,
        key: 'bc'
      });
    },
    error => {
      console.error('Error unassigning role:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: `Failed to unassign role '${role}'.`,
          key: 'bc'
        });     
      }
    );
  }
}

deleteUser(email?: string): void {
  this.confirmationService.confirm({
    header: 'Confirm',
    message: 'Are you sure you want to delete this user?',
    accept: () => {
      console.log(this.user);
      if (email){
        this.userService.removeUser(email).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Deleted',
            detail: 'User deleted successfully',
            key: 'bc'
          });
          this.router.navigate(['/user-list']);
        },
        error => {
          console.error('Validation Errors:', error);  
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete user as they exist in another entity',
            key: 'bc'
          });
          this.router.navigate(['/user-list']);}
        );}
    },
    reject: () => {
      
    }
  });}

goUpdate(useremail?: string) {
    this.router.navigate(['/user-update', useremail]);
  }

goList(): void {
  this.router.navigate(['/user-list'])
}

hasPermission(permission: Permissions): boolean {
  return this.permissionsService.hasPermission(permission);
}

hideTooltip(iconId: string): void {
  const tooltipElement = document.getElementById(iconId);
  if (tooltipElement) {
    const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement);
    if (tooltipInstance) {
      tooltipInstance.hide();
    }
  }
}

initializeTooltips(): void {
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.forEach((tooltipTriggerEl) => {
    new bootstrap.Tooltip(tooltipTriggerEl);
  });
}

}
