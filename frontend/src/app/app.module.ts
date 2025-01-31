import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidenavbarComponent } from './navigation/sidenavbar/sidenavbar.component';
import { HeaderComponent } from './navigation/header/header.component';
import { ProjectsComponent } from './pages/projects/projects.component';
import { TeamsComponent } from './pages/teams/teams.component';
import { ClientsComponent } from './pages/clients/clients.component';
import { ProjectDetailComponent } from './pages/projects/project-detail/project-detail.component';
import { ProjectEditComponent } from './pages/projects/project-edit/project-edit.component';
import { ProjectCreateComponent } from './pages/projects/project-create/project-create.component';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FileUploadModule } from 'primeng/fileupload';
import { ThemesComponent } from './pages/themes/themes.component';
import { ThemeDetailsComponent } from './pages/themes/theme-details/theme-details.component';
import { ThemeListComponent } from './pages/themes/theme-list/theme-list.component';
import { TeamService } from './services/teams/team.service';
import { AddteamComponent } from './pages/teams/addteam/addteam.component';
import { EditTeamComponent } from './pages/teams/edit-team/edit-team.component';
import { SharedModule } from './shared/modules/shared/shared.module';
import { ClientDetailComponent } from './pages/clients/client-detail/client-detail.component';
import { AddClientComponent } from './pages/clients/add-client/add-client.component';
import { EditClientComponent } from './pages/clients/edit-client/edit-client.component';
import { AddClientrepComponent } from './pages/clients/add-clientrep/add-clientrep.component';
import { EditClientrepComponent } from './pages/clients/edit-clientrep/edit-clientrep.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { Login2Component } from './pages/login2/login2.component';
import { RouterOutlet } from '@angular/router';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { Forgotpassword1Component } from './pages/forgotpassword1/forgotpassword1.component';
import { Resetpassword1Component } from './pages/resetpassword1/resetpassword1.component';
import { PasswordOTPComponent } from './pages/password-otp/password-otp.component';

import { ManageTeamComponent } from './pages/teams/manage-team/manage-team.component';
import { RolesComponent } from './pages/Admin/Roles/roles/roles.component';
import { RoleDetailComponent } from './pages/Admin/Roles/role-detail/role-detail.component';
import { authInterceptor } from './pages/Admin/resources/interceptor/auth.interceptor';
import { RoleCreateComponent } from './pages/Admin/Roles/role-create/role-create/role-create.component';
import { EditRoleComponent } from './pages/Admin/Roles/edit-role/edit-role.component';
import { LoadingComponent } from './pages/resources/loading/loading.component';
import { LoadingInterceptor } from './pages/Admin/resources/interceptor/loading/loading.interceptor';


import { UserApproveComponent } from './pages/users/user-approve/user-approve.component';
import { UserDetailsComponent } from './pages/users/user-details/user-details.component';
import { UserListComponent } from './pages/users/user-list/user-list.component';
import { UserPasswordComponent } from './pages/users/user-password/user-password.component';
import { UserRegisterComponent } from './pages/users/user-register/user-register.component';
import { UserRegisteroptionComponent } from './pages/users/user-registeroption/user-registeroption.component';
import { UserRequestComponent } from './pages/users/user-request/user-request.component';
import { UserUpdateComponent } from './pages/users/user-update/user-update.component';

import { TemplateListComponent } from './pages/template/template-list/template-list.component';
import { TemplateDetailComponent } from './pages/template/template-detail/template-detail.component';

import { RegisteredUsersReportComponent } from './pages/reporting/registered-users-report/registered-users-report.component';
import { ActiveProjectsReportComponent } from './pages/reporting/active-projects-report/active-projects-report.component';
import { TemplatesReportComponent } from './pages/reporting/templates-report/templates-report.component';
import { ClientsReportComponent } from './pages/reporting/clients-report/clients-report.component';
import { DefectsReportComponent  } from './pages/reporting/defects-report/defects-report.component';
import { ProjectPhaseReportComponent } from './pages/reporting/project-phase-report/project-phase-report.component';
import { UserLoadReportComponent } from './pages/reporting/user-load-report/user-load-report.component';
import { TestScriptStatusReportComponent } from './pages/reporting/test-script-status-report/test-script-status-report.component';
import { AssignedScriptsReportComponent } from './pages/reporting/assigned-scripts-report/assigned-scripts-report.component';

import { TestscriptListComponent } from './pages/testscripts/testscript-list/testscript-list.component';
import { TestscriptsUpdateComponent } from './pages/testscripts/testscripts-update/testscripts-update/testscripts-update.component';
import { DefectsComponent } from './pages/defects/defects/defects.component';

import { HelpComponent } from './pages/Help/help.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { CalendarComponent } from './pages/calendar/calendar.component';


import { SystemComponent } from './pages/system/system.component';
import { AddStatusComponent } from './pages/system/add-status/add-status.component';
import { AddTagComponent } from './pages/system/add-tag/add-tag.component';
import { EditStatusComponent } from './pages/system/edit-status/edit-status.component';
import { EditTagComponent } from './pages/system/edit-tag/edit-tag.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { ForbiddenComponent } from './pages/errors/forbidden/forbidden.component';

import { AuditlogComponent } from './pages/auditlog/auditlog/auditlog.component';

import { BackuprestoreComponent } from './pages/system/backuprestore/backuprestore.component';
import { FieldsetModule } from 'primeng/fieldset';
import { LookupComponent } from './pages/lookups/lookup/lookup.component';
import { RegionComponent } from './pages/lookups/region/region/region.component';
import { CityComponent } from './pages/lookups/city/city/city.component';
import { UserAccountComponent } from './pages/users/user-account/user-account.component';

import { ScrollingModule } from '@angular/cdk/scrolling';
import { UserPopupComponent } from './pages/testscripts/user-popup/user-popup.component';
import { TestScheduleComponent } from './test-schedule/test-schedule.component';


@NgModule({
  declarations: [
    AppComponent,
    SidenavbarComponent,
    HeaderComponent,
    ProjectsComponent,
    TeamsComponent,
    ClientsComponent,
    ProjectDetailComponent,
    ProjectEditComponent,
    ProjectCreateComponent,
    ThemesComponent,
    ThemeDetailsComponent,
    ThemeListComponent,

    AddteamComponent,
    EditTeamComponent,
    ClientDetailComponent,
    AddClientComponent,
    EditClientComponent,
    AddClientrepComponent,
    EditClientrepComponent,
    Forgotpassword1Component,
    Resetpassword1Component,
    PasswordOTPComponent,

    ManageTeamComponent,
    RolesComponent,
    RoleDetailComponent,
    RoleCreateComponent,
    EditRoleComponent,
    LoadingComponent,

    UserApproveComponent,
    UserDetailsComponent,
    UserListComponent,
    UserPasswordComponent,
    UserRegisterComponent,
    UserRegisteroptionComponent,
    UserRequestComponent,
    UserUpdateComponent,

    TemplateListComponent,
    TemplateDetailComponent,
    RegisteredUsersReportComponent,
    ActiveProjectsReportComponent,
    TemplatesReportComponent,
    ClientsReportComponent,
    DefectsReportComponent,
    ProjectPhaseReportComponent,
    UserLoadReportComponent,
    TestScriptStatusReportComponent,
    AssignedScriptsReportComponent,

    TestscriptListComponent,
    TestscriptsUpdateComponent,

    DefectsComponent,


    HelpComponent,
    NotificationsComponent,
    CalendarComponent,

    //DashboardComponent


    SystemComponent,
    AddStatusComponent,
    AddTagComponent,
    EditStatusComponent,
    EditTagComponent,
    ForbiddenComponent,

    AuditlogComponent,

    BackuprestoreComponent,
    LookupComponent,
    RegionComponent,
    CityComponent,
    UserPopupComponent,
    UserAccountComponent,
    UserPopupComponent,
    TestScheduleComponent,
    //DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ColorPickerModule,
    FileUploadModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    Login2Component,
    DashboardComponent,
    RouterModule,
    MatAutocompleteModule,
    MatInputModule,

    ScrollingModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [ 
    { 
      provide: HTTP_INTERCEPTORS,
      useClass: authInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: LoadingInterceptor,
      multi: true
    }
   ],
  bootstrap: [AppComponent]

})
export class AppModule {}
