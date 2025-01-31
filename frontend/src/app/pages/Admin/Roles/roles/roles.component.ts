import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Role } from '../../../../models/role.model';
import { RolesService } from '../../../../services/roles/roles.service';
import { PermissionsService } from '../../../../services/auth/permissions.service';
import { Permissions } from '../../../../models/permissions.enums';

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss']
})
export class RolesComponent implements OnInit{
  roles: Role[] = [];
  canConfigureAccessControl: boolean = false;
  filteredRoles: Role[] = [];
  searchTerm: string = '';
  page: number = 1;

  Permissions = Permissions;

constructor(
  public router: Router,
  private roleService: RolesService,
  private permissionService: PermissionsService
) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe((data: Role[]) => {
      this.roles = data
      this.filteredRoles = data;
    });
  }

  viewRole(roleId: string): void {
    console.log(`View role with Id: ${roleId}`);
    this.router.navigate(['/role', roleId]);
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredRoles = this.roles.filter(role => 
      role.name.toLowerCase().includes(searchTerm) ||
      role.roleDescription.toLowerCase().includes(searchTerm)  
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredRoles = this.roles;
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissionService.hasPermission(permission)
  }
}
