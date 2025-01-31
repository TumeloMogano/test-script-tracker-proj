import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RolesService } from '../../../../services/roles/roles.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Role } from '../../../../models/role.model';

@Component({
  selector: 'app-edit-role',
  templateUrl: './edit-role.component.html',
  styleUrl: './edit-role.component.scss'
})
export class EditRoleComponent implements OnInit{
  editRoleForm: FormGroup;
  roleId: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private rolesService: RolesService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.editRoleForm = this.formBuilder.group({
      roleName: ['', Validators.required],
      roleDescription: ['', Validators.required]
    });
    this.roleId = this.route.snapshot.paramMap.get('roleId')!;
    console.log(`EditRoleComponent initialized with roleIdL ${this.roleId}`);
  }

  ngOnInit(): void {
    this.loadRoleData();
  }

  loadRoleData(): void {
    this.rolesService.getRoleById(this.roleId).subscribe(role => {
      console.log('Fetched role: ', role);
      this.editRoleForm.patchValue({
        roleName: role.name,
        roleDescription: role.roleDescription
      });
    }, error => {
      console.error('Error fetching role data:', error);
    });
  }

  confirmUpdate(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to update this role?',
      header: 'Confirm Update?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateRole();
      }
    });
  }

  updateRole(): void {
    if (this.editRoleForm.valid) {
      const updatedRole: Partial<Role> = {
        roleId: this.roleId,
        name: this.editRoleForm.get('roleName')?.value,
        roleDescription: this.editRoleForm.get('roleDescription')?.value
      };

      this.rolesService.updateRole(this.roleId, updatedRole).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role Updated Successfully!', key: 'bc' });
        this.router.navigate(['/role', this.roleId]);
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Update Role', key: 'bc' });
      });
    } else {
      this.editRoleForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/role', this.roleId])
  }

  confirmCancel(): void {
    this.confirmationService.confirm({
      header: 'Cancel Update?',
      message: 'Are you sure you want to cancel this operation?',
      accept: () => {
        this.cancel()
      }
    });
  }

  get f() { return this.editRoleForm.controls; }

}
