import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RolesService } from '../../../../../services/roles/roles.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Role } from '../../../../../models/role.model';

@Component({
  selector: 'app-role-create',
  templateUrl: './role-create.component.html',
  styleUrl: './role-create.component.scss'
})
export class RoleCreateComponent implements OnInit {
  createRoleForm: FormGroup;

  constructor(
    private router: Router,
    private roleService: RolesService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.createRoleForm = this.formBuilder.group({
      roleName: ['', Validators.required],
      roleDescription: ['', Validators.required]
    });
  }

  ngOnInit(): void {

  }

  confirmSaveRole(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to create this role?',
      header: 'Confirm Role Creation?',
      accept: () => {
        this.saveRole();
      }
    });
  }

  saveRole(): void {
    if (this.createRoleForm.valid) {
      
      
      const newRole: Partial<Role> = {
        name: this.createRoleForm.get('roleName')?.value,
        roleDescription: this.createRoleForm.get('roleDescription')?.value
      };

      this.roleService.createRole(newRole).subscribe(() => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Role Created successfully', key: 'bc' });
        this.router.navigate(['/roles']);
      }, error => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Create Role', key: 'bc' });
      });
    } else {
      this.createRoleForm.markAllAsTouched();
    }
  }

  cancel(): void {
    this.router.navigate(['/roles']);
  }

  get f() { return this.createRoleForm.controls; }

}
