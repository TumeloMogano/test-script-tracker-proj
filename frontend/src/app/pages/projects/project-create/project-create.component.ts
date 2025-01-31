import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from '../../../services/projects/projects.service';
import { Client } from '../../../models/client/client.model';
import { Team } from '../../../models/team/team.model';
import { TeamService } from '../../../services/teams/team.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClientService } from '../../../services/clients/client.service';
import { ClientRepresentative } from '../../../models/client/clientrep.model';
import { Permissions } from '../../../models/permissions.enums';
import { PermissionsService } from '../../../services/auth/permissions.service';

@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss']
})
export class ProjectCreateComponent implements OnInit {
  projectForm: FormGroup;
  clients: Client[] = [];
  teams: Team[] = [];
  clientReps: ClientRepresentative[] = [];
  clientId: string;
  client: Client| undefined;
  Permissions = Permissions;

  constructor(
    private projectsService: ProjectsService,
    private teamService: TeamService,
    private clientService: ClientService,
    private route: ActivatedRoute,    
    private confirmationService: ConfirmationService,
    private permissionsService: PermissionsService,
    private messageService: MessageService,
    private router: Router
  ) {
    this.projectForm = new FormGroup({
      projectName: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]),
      startDate: new FormControl('', [Validators.required, this.startDateValidator]),
      endDate: new FormControl('', [Validators.required, this.endDateValidator.bind(this)]),
      projectDescription: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(150)]),
      clientId: new FormControl(null, Validators.required),
      assignTeam: new FormControl(false),
      teamId: new FormControl(null),
      assignClientRep: new FormControl(false),
      responsibleClientRep: new FormControl(null) 
    });
    this.clientId = this.route.snapshot.paramMap.get('clientId')!;
  }

  ngOnInit(): void {

    this.teamService.getFullTeams().subscribe(teams => {
      this.teams = teams;
    });

    // this.teamService.getTeams().subscribe(teams => {
    //   this.teams = teams;
    // });

    this.loadClient(this.clientId);

    this.clientService.getClientRepsByClientId(this.clientId).subscribe({
      next: (reps: ClientRepresentative[]) => {
        this.clientReps = reps;
        if (this.clientReps.length === 0) {
          console.log('There are no client representatives. You can assign them later.');
          //this.messageService.add({severity: 'info', summary: 'No Client Reps', detail: 'There are no client representatives. You can assign one later.', key: 'bc'});
        }
      },
      error: (error) => {
        console.error('Error fetching client representatives:', error);
        //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch client representatives', key: 'bc' });
      }
    });

    this.projectForm.patchValue({ clientId: this.clientId });
    this.projectForm.controls['assignTeam'].valueChanges.subscribe(assignTeam => {
      if (assignTeam) {
        this.projectForm.controls['teamId'].setValidators([Validators.required]);
      } else {
        this.projectForm.controls['teamId'].clearValidators();
      }
      this.projectForm.controls['teamId'].updateValueAndValidity();
    });

    this.projectForm.controls['assignClientRep'].valueChanges.subscribe(assignClientRep => {
      if (assignClientRep) {
        this.projectForm.controls['responsibleClientRep'].setValidators([Validators.required]);
      } else {
        this.projectForm.controls['responsibleClientRep'].clearValidators();
      }
      this.projectForm.controls['responsibleClientRep'].updateValueAndValidity();
    });

  }

  loadClient(clientId: string): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (client: Client) => {
        this.client = client;
        console.log('Payload:' ,client);
      },
      error: (error) => {
        console.error('Error fetching client:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch client details', key: 'bc' });
      }
    });
  }



  cancel(): void {
    this.confirmationService.confirm({
      header: 'Cancel',
      message: 'Are you sure you want to cancel? All unsaved changes will be lost.',
      accept: () => {
        const clientId = this.route.snapshot.queryParams['clientId'];
        if (clientId) {
          this.router.navigate(['/client', clientId]);
        } else {
          this.router.navigate(['/projects']);
        }      
      }
    });
  }

  goBack(): void {
    const clientId = this.route.snapshot.queryParams['clientId'];
    if (clientId) {
      this.router.navigate(['/client', clientId]);
    } else {
      this.router.navigate(['/projects']);
    }
  }

  startDateValidator(control: FormControl): { [key: string]: boolean } | null {
    const startDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (startDate < today) {
      return { 'startDateInvalid': true };
    }
    return null;
  }

  endDateValidator(control: FormControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const endDate = new Date(control.value);
    const startDateValue = this.projectForm.controls['startDate'].value;
    if (startDateValue) {
      const startDate = new Date(startDateValue);
      if (endDate < startDate) {
        return { 'endDateInvalid': true };
      }
    }
    return null;
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissionsService.hasPermission(permission)
  }

  onSubmit(): void {
  if (this.projectForm.invalid) {
    this.projectForm.markAllAsTouched();
    return;
  }

  const projectFormValue = this.projectForm.value;
  const projectData = {
    projectName: projectFormValue.projectName,
    startDate: projectFormValue.startDate ? new Date(projectFormValue.startDate) : null,
    endDate: projectFormValue.endDate ? new Date(projectFormValue.endDate) : null,
    projectDescription: projectFormValue.projectDescription,
    clientId: this.clientId,
    teamId: projectFormValue.assignTeam ? projectFormValue.teamId : null,
    responsibleClientRep: projectFormValue.assignClientRep ? projectFormValue.responsibleClientRep : null 
  };

  this.confirmationService.confirm({
    header: 'Confirm Submission',
    message: 'Are you sure you want to submit this project?',
    accept: () => {
      this.projectsService.createProject(projectData).subscribe(
        (project) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Submitted',
            detail: 'Project submitted successfully',
            key: 'bc'
          });
          this.router.navigate(['/project', project.projectId]);
        },
        error => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to submit project',
            key: 'bc'
          });
        }
      );
    },
    reject: () => {
    }
  });
}

}