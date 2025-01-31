import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { Role } from '../../../../models/role.model';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../services/roles/roles.service';
import { PermissionsService } from '../../../../services/auth/permissions.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Permissions } from '../../../../models/permissions.enums';

import * as bootstrap from 'bootstrap'; 
import { LoadingService } from '../../../../services/loading/loading.service';

@Component({
  selector: 'app-role-detail',
  templateUrl: './role-detail.component.html',
  styleUrls: ['./role-detail.component.scss']
})
export class RoleDetailComponent implements OnInit, AfterViewChecked{
  role: Role | null = null;
  roleId: string | null = null;
  permissions: number = 0;
  originalPermissions: number = 0;
  availablePermissions: { value: number, name: string, description: string }[] = [];
  Permissions = Permissions;

  constructor(
    private route: ActivatedRoute,
    private messageService: MessageService,
    private roleService: RolesService,
    private permissionService: PermissionsService,
    private confirmationService: ConfirmationService,
    private loadingService: LoadingService,
    public router: Router
  ){}


  ngOnInit(): void {
    this.roleId = this.route.snapshot.paramMap.get('roleId');
    if (this.roleId){
      this.loadRole(this.roleId);
      this.loadPermission(this.roleId);
    }
  }

  ngAfterViewChecked(): void {
    this.initializeTooltips();
  }

  initializeTooltips(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (!tooltipInstance){
        new bootstrap.Tooltip(tooltipTriggerEl);
      }
      
    });
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

  loadRole(roleId: string): void {
    this.roleService.getRoleById(roleId).subscribe({
      next: (role: Role) => {
        this.role = role;
      },
      error: (error) => {
        console.error('Error fetching role:', error);
      }
    });
  }

  loadPermission(roleId: string): void {
    this.roleService.getRoleConfiguration(roleId).subscribe({
      next: (response) => {
        this.permissions = response.roles[0].permissions;
        this.originalPermissions = this.permissions;
        this.availablePermissions = response.availablePermissions.map((perm: number) => ({
          value: perm,
          name: Permissions[perm as unknown as keyof typeof Permissions],
          description: response.roles[0].permissionDescriptions[perm]
        }));
      },
      error: (error) => {
        console.error('Error fetching permissions:', error);
      }
    });
  }

  hasPermission(permission: number): boolean {
    return (this.permissions & permission) === permission;
  }

  togglePermission(permission: number): void {
    if (this.hasPermission(permission)) {
      this.permissions &= ~permission;
    } else {
      this.permissions |= permission;
    }
  }
  confirmUpdateConfiguration(): void {
    if (this.permissions === this.originalPermissions) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No changes detected',
        detail: 'Please make changes before updating permissions',
        key: 'bc'
      });
    } else {
      this.confirmationService.confirm({
        header: 'Update Role Permissions?',
        message: 'Are you sure you want to update the permissions?',
        accept: () => {
          this.updateConfiguration();
        }
      });
    }   
  }

  updateConfiguration(): void {
    if (this.roleId) {
      this.loadingService.show('Updating Role Permissions...');

      this.roleService.updateRoleConfiguration(this.roleId, this.permissions).subscribe({
        next: (response) => {
          console.log('Permissions updated successfully', response);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role Permissions updated successfully', key: 'tl' });
          this.loadingService.hide();
          this.originalPermissions = this.permissions;
        },
        error: (error) => {
          console.error('Error updating permissions:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update permissions',
            key: 'bc'
          });
          this.loadingService.hide();
        }
      });
    }
  }

  confirmDeleteRole(roleId: string | undefined): void {
    if (!roleId) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid role ID', key: 'tl' });
      return;
    }

    this.confirmationService.confirm({
      header: 'Delete Role?',
      message: 'Are you sure you want to delete this role?',
      accept: () => {
        this.deleteRole(roleId);
      }
    });
  }

  deleteRole(roleId: string): void {
    this.roleService.deleteRole(roleId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role deleted successfully',key: 'tl' });
        this.router.navigate(['/roles']);
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Role could not be deleted', key: 'tl' });
      }
    });
  }

  hasRolePermission(permission: Permissions): boolean {
    return this.permissionService.hasPermission(permission)
  }

  goBack(): void {
    this.router.navigate(['/roles']);
  }

}
