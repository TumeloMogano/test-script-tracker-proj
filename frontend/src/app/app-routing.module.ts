
import { RouterModule, Routes } from '@angular/router';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import { ProjectEditComponent } from './pages/projects/project-edit/project-edit.component';
import { ProjectCreateComponent } from './pages/projects/project-create/project-create.component';
import { ThemesComponent } from './pages/themes/themes.component';
import { ThemeListComponent } from './pages/themes/theme-list/theme-list.component';
import { ThemeDetailsComponent } from './pages/themes/theme-details/theme-details.component';
import { AddteamComponent } from './pages/teams/addteam/addteam.component';
import { EditTeamComponent } from './pages/teams/edit-team/edit-team.component';
import { ClientDetailComponent } from './pages/clients/client-detail/client-detail.component';
import { AddClientComponent } from './pages/clients/add-client/add-client.component';
import { EditClientComponent } from './pages/clients/edit-client/edit-client.component';
import { AddClientrepComponent } from './pages/clients/add-clientrep/add-clientrep.component';
import { EditClientrepComponent } from './pages/clients/edit-clientrep/edit-clientrep.component';

import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserApproveComponent } from './pages/users/user-approve/user-approve.component';
import { UserUpdateComponent } from './pages/users/user-update/user-update.component';
import { UserDetailsComponent } from './pages/users/user-details/user-details.component';
import { UserPasswordComponent } from './pages/users/user-password/user-password.component';
import { UserRegisterComponent } from './pages/users/user-register/user-register.component';
import { UserRegisteroptionComponent } from './pages/users/user-registeroption/user-registeroption.component';
import { UserRequestComponent } from './pages/users/user-request/user-request.component';

import { TemplateListComponent } from './pages/template/template-list/template-list.component';
import { TemplateDetailComponent } from './pages/template/template-detail/template-detail.component';
import { TestscriptListComponent } from './pages/testscripts/testscript-list/testscript-list.component';
import { TestscriptsUpdateComponent } from './pages/testscripts/testscripts-update/testscripts-update/testscripts-update.component';
import { DefectsComponent } from './pages/defects/defects/defects.component';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Login2Component } from './pages/login2/login2.component';
import { Forgotpassword1Component } from './pages/forgotpassword1/forgotpassword1.component';
import { PasswordOTPComponent } from './pages/password-otp/password-otp.component';
import { Resetpassword1Component } from './pages/resetpassword1/resetpassword1.component';

import { RegisteredUsersReportComponent } from './pages/reporting/registered-users-report/registered-users-report.component';
import { ActiveProjectsReportComponent } from './pages/reporting/active-projects-report/active-projects-report.component';
import { TemplatesReportComponent } from './pages/reporting/templates-report/templates-report.component';
import { ClientsReportComponent } from './pages/reporting/clients-report/clients-report.component';
import { DefectsReportComponent } from './pages/reporting/defects-report/defects-report.component';
import { ProjectPhaseReportComponent } from './pages/reporting/project-phase-report/project-phase-report.component';
import { UserLoadReportComponent } from './pages/reporting/user-load-report/user-load-report.component';
import { TestScriptStatusReportComponent } from './pages/reporting/test-script-status-report/test-script-status-report.component';
import { AssignedScriptsReportComponent } from './pages/reporting/assigned-scripts-report/assigned-scripts-report.component';
import { HelpComponent } from './pages/Help/help.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { ManageTeamComponent } from './pages/teams/manage-team/manage-team.component';
import { RolesComponent } from './pages/Admin/Roles/roles/roles.component';
import { RoleDetailComponent } from './pages/Admin/Roles/role-detail/role-detail.component';
import { authGuard } from './pages/Admin/resources/guards/auth.guard';
import { RoleCreateComponent } from './pages/Admin/Roles/role-create/role-create/role-create.component';
import { EditRoleComponent } from './pages/Admin/Roles/edit-role/edit-role.component';

import { SystemComponent } from './pages/system/system.component';
import { AddStatusComponent } from './pages/system/add-status/add-status.component';
import { AddTagComponent } from './pages/system/add-tag/add-tag.component';
import { EditStatusComponent } from './pages/system/edit-status/edit-status.component';
import { EditTagComponent } from './pages/system/edit-tag/edit-tag.component';
import { permissionGuard } from './pages/Admin/resources/guards/permission.guard';
import { Permissions } from './models/permissions.enums';
import { ForbiddenComponent } from './pages/errors/forbidden/forbidden.component';
import { NgModule } from '@angular/core';

import { AuditlogComponent } from './pages/auditlog/auditlog/auditlog.component';

import { BackuprestoreComponent } from './pages/system/backuprestore/backuprestore.component';
import { LookupComponent } from './pages/lookups/lookup/lookup.component';
import { RegionComponent } from './pages/lookups/region/region/region.component';
import { CityComponent } from './pages/lookups/city/city/city.component';
import { UserAccountComponent } from './pages/users/user-account/user-account.component';
import { TestScheduleComponent } from './test-schedule/test-schedule.component';


const routes: Routes = [
  { path: '', redirectTo: 'login2', pathMatch:'full' }, // redirects by default 
  { path:'login2', component: Login2Component },
  //routes decorated with "authGuard" can only be accessed after loggin in
  { path: 'dashboard', title: 'TestScriptTracker | Dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'projects', title: 'TestScriptTracker | Projects', component: ProjectsComponent, canActivate: [authGuard] },
  { path: 'teams', title: 'TestScriptTracker | Teams', component: TeamsComponent, canActivate: [authGuard] },
  { path: 'add-team', title: 'TestScriptTracker | Add Team', component: AddteamComponent, canActivate: [authGuard]},
  { path: 'edit-team/:teamId', title: 'TestScriptTracker | Update Team', component: EditTeamComponent, canActivate: [authGuard]},
  { path: 'clients', title: 'TestScriptTracker | Clients', component: ClientsComponent , canActivate: [authGuard]},
  { path: 'add-theme/:clientId',title: 'TestScriptTracker | Add Theme', component: ThemesComponent , canActivate: [authGuard]},
  { path: 'theme-details/:themeId', title: 'TestScriptTracker | Theme', component: ThemeDetailsComponent, canActivate: [authGuard] },

  { path: 'theme-list', component: ThemeListComponent, canActivate: [authGuard]},
  { path: 'roles', title: 'TestScriptTracker | Roles', component: RolesComponent , canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canViewRoles} },
  { path: 'role/:roleId', title: 'TestScriptTracker | RBPs', component: RoleDetailComponent , canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageRoles}},
  { path: 'add-role', title: 'TestScriptTracker | Add Role', component: RoleCreateComponent , canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageRoles }},
  { path: 'edit-role/:roleId', title: 'TestScriptTracker | Update Role', component: EditRoleComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageRoles }},
  { path: 'project/:projectId', title: 'TestScriptTracker | Project', component: ProjectDetailComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canViewProjects }},
  { path: 'create-project', title: 'TestScriptTracker | Project', component: ProjectCreateComponent , canActivate: [authGuard]},
  { path: 'add-project/:clientId', title: 'TestScriptTracker | Add Project', component: ProjectCreateComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageProjects }},
  { path: 'edit-project/:projectId', title: 'TestScriptTracker | Update Project', component: ProjectEditComponent , canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageProjects }},
  { path: 'team/:teamId', title: 'TestScriptTracker | Team', component: ManageTeamComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canViewTeams } },
  { path: 'add-client', title: 'TestScriptTracker | Add Client', component: AddClientComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageClients } },
  { path: 'client/:clientId',title: 'TestScriptTracker | Client',  component: ClientDetailComponent , canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canViewClients }},
  { path: 'edit-client/:clientId', title: 'TestScriptTracker | Update Client', component: EditClientComponent , canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageClients }},
  { path: 'add-clientrep/:clientId',title: 'TestScriptTracker | Add Client Rep', component: AddClientrepComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageClients }},
  { path: 'edit-clientrep/:clientRepId', title: 'TestScriptTracker | Update Client Rep', component: EditClientrepComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageClients }},
  { path: 'forbidden-403', title: 'TestScriptTracker | Forbidden', component: ForbiddenComponent, canActivate: [authGuard] },
  { path: 'view-profile/:id', title: 'TestScriptTracker | Profile', component: UserAccountComponent, canActivate: [authGuard] },
  { path: 'user-list', title: 'TestScriptTracker | Users', component: UserListComponent , canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canViewUsers }},
  { path: 'user-approve', component: UserApproveComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageUsers } },
  { path: 'user-details/:email', component: UserDetailsComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageUsers } },
  { path: 'user-update/:useremail', component: UserUpdateComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageUsers} },
  {
    path: 'user-password/:usertype/:useremail/:regCode',
    component: UserPasswordComponent,
  },
  { path: 'user-register', component: UserRegisterComponent },
  { path: 'user-registeroption', component: UserRegisteroptionComponent },
  { path: 'user-request', component: UserRequestComponent },

  { path: 'template-list', title: 'TestScriptTracker | Templates' , component: TemplateListComponent , canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canViewTemplates}},
  { path: 'template/:templateId', component: TemplateDetailComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.canManageTemplates} },

  { path: 'registered-users-report', component: RegisteredUsersReportComponent, canActivate: [authGuard] },
  { path: 'active-projects-report', component: ActiveProjectsReportComponent, canActivate: [authGuard] },
  { path: 'templates-report', component: TemplatesReportComponent, canActivate: [authGuard] },
  { path: 'clients-report', component: ClientsReportComponent, canActivate: [authGuard] },
  { path: 'defects-report', component: DefectsReportComponent, canActivate: [authGuard] },
  { path: 'project-phase-report', component: ProjectPhaseReportComponent, canActivate: [authGuard] },
  { path: 'user-load-report', component: UserLoadReportComponent , canActivate: [authGuard]},
  { path: 'test-script-status-report', component: TestScriptStatusReportComponent, canActivate: [authGuard] },
  { path: 'assigned-scripts-report', component: AssignedScriptsReportComponent, canActivate: [authGuard] },
  { path: 'backup', component: BackuprestoreComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.SystemAdministrator } },
  { path: 'testscript-list', component: TestscriptListComponent , canActivate: [authGuard, permissionGuard] },
  { path: 'testscript-update/:testScriptId', component: TestscriptsUpdateComponent, canActivate: [authGuard] },
  { path: 'defects/:defectId', component: DefectsComponent, canActivate: [authGuard] },

  {path:'forgotpassword1',component: Forgotpassword1Component},
  {path:'password-otp', component: PasswordOTPComponent},
  {path:'resetpassword1', component: Resetpassword1Component},
  {path:'help', component: HelpComponent, canActivate: [authGuard]},
  {path:'notifications', component: NotificationsComponent, canActivate: [authGuard]},
  {path:'calendar', component: CalendarComponent, canActivate: [authGuard]},

  { path: 'testscript-list', component: TestscriptListComponent, canActivate: [authGuard] },
  {
    path: 'testscript-update/:testScriptId',
    component: TestscriptsUpdateComponent,canActivate: [authGuard]
  },
  { path: 'lookup', component: LookupComponent, canActivate: [authGuard] },
  { path: 'region', component: RegionComponent, canActivate: [authGuard] },
  { path: 'city', component: CityComponent, canActivate: [authGuard] },
  { path: 'forgotpassword1', component: Forgotpassword1Component },
  { path: 'password-otp', component: PasswordOTPComponent },
  { path: 'resetpassword1', component: Resetpassword1Component },
  { path: 'system', component: SystemComponent, canActivate: [authGuard] },
  { path: 'add-status', component: AddStatusComponent, canActivate: [authGuard] },
  { path: 'edit-status/:statusId', component: EditStatusComponent, canActivate: [authGuard] },
  { path: 'add-tag', component: AddTagComponent, canActivate: [authGuard] },
  { path: 'edit-tag/:tagId', component: EditTagComponent, canActivate: [authGuard] },



  {path: 'test-schedule', component: TestScheduleComponent, canActivate: [authGuard]},

  { path: 'auditlog', component: AuditlogComponent, canActivate: [authGuard, permissionGuard], data: { permission: Permissions.SystemAdministrator } },


  //{ path: '', redirectTo: '/projects', pathMatch: 'full' },
  //{ path: '', redirectTo: '/projects', pathMatch: 'full' },
  //{path: '**', redirectTo: '/forbidden-403' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}