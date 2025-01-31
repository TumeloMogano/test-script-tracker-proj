import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../../../services/projects/projects.service';
import { Project } from '../../../models/project';
import { Client } from '../../../models/client';
import { TestScript } from '../../../models/testscript/testscripts';
import { TestScriptsServices } from '../../../services/testscripts/testscripts.services';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TemplateService } from '../../../services/template/template.service';
import { Template } from '../../../models/template/template.model';
import { TemplateTestStep } from '../../../models/template/template.model';
import { TestStep } from '../../../models/testscript/teststeps';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ConfirmationService } from 'primeng/api';
import * as bootstrap from 'bootstrap'; 
import { Team } from '../../../models/team/team.model';
import { TeamService } from '../../../services/teams/team.service';
import { Message, MessageService } from 'primeng/api';
import { ClientService } from '../../../services/clients/client.service';
import { ClientRepresentative } from '../../../models/client/clientrep.model';
import { ProjectPhaseReturnDto } from '../../../models/project-phase-return-dto.model';
import { ProjectSignOffReturnDto } from '../../../models/project-signoff-return-dto.model';

import jsPDF from 'jspdf';
import SignaturePad from 'signature_pad';
import { CommonModule } from '@angular/common';
import { AuthUser } from '../../../models/auth/auth.model';
import { Observable } from 'rxjs';
import { AuthService } from '../../../services/auth/auth.service';
import { Permissions } from '../../../models/permissions.enums';
import { PermissionsService } from '../../../services/auth/permissions.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  //styleUrl: './project-detail.component.scss',
  // providers: [ConfirmationService, MessageService],
  styleUrls: ['./project-detail.component.scss'],  // Corrected 'styleUrl' to 'styleUrls' and used an array
  animations: [
    trigger('rotateChevron', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ]),
    trigger('toggleTable', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('300ms ease-out', style({ opacity: 1, height: '*' }))
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*' }),
        animate('300ms ease-in', style({ opacity: 0, height: '0px' }))
      ])
    ])
  ]
})
export class ProjectDetailComponent implements OnInit, AfterViewInit {
  project: Project | undefined;
  client: Client | undefined;
  team: Team | undefined;
  availableTeams: Team[] = [];
  clientReps: ClientRepresentative[] = [];
  showAssignClientRepModal: boolean = false;
  showReAssignClientRepModal: boolean = false;
  showAssignTeamModal: boolean = false;
  testScripts: TestScript[] = [];
  testSteps: TestStep[] = [];
  templates: Template [] =[];
  filteredTemplates: Template[] = [];
  addTestScriptForm!: FormGroup;  
  showModal: boolean = false;
  showModal2: boolean = false;
  templateId: string | undefined;
  selectedTemplateId: string | undefined;
  showScripts!: boolean ;
  searchQuery: string = '';
  filteredTestScripts: TestScript[] = [];
  hasClientReps: boolean = false;
  i: number = 0;
  archiveShow : boolean = false;
  selectedButton: string = 'button1';
  showSignOffModal: boolean = false;
  @ViewChild('canvas', { static: false }) canvasRef!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  user$: Observable<AuthUser | null>;
  loggedInUser: AuthUser | null = null;
  templateSearchTerm: string = '';

  phaseChangeReady: boolean = false;
  //loading: boolean = true;
  signOffReady: boolean = false;

  messages: Message[] = [];
  SignOffMessages: Message[] = [];
  ActivateProjectMessages: Message[] = [];
  AssignTeamMessages: Message[] = [];
  AssignClientRepMessages: Message[] = [];
  IsSignedOffMessages: Message[] = [];
  // notIsTeamLeadActivateMessages: Message[] = [];
  // notIsTeamLeadPhaseChangeMessages: Message[] = [];
  // assignTeamAndClientRep: Message[] = [];
  isTeamLead: boolean = false;

  Permissions = Permissions;


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private projectsService: ProjectsService,
    private teamService: TeamService,
    private testScriptService: TestScriptsServices,
    private templateService: TemplateService,
    private clientService: ClientService,
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private authService: AuthService,
    private permissionsService: PermissionsService
  ) { this.user$ = this.authService.userDetails$;}

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['projectId'];
    this.projectsService.getProject(projectId).subscribe(project => {
      this.project = project;
      if (project.clientId) {
        this.projectsService.getClient(project.clientId).subscribe(client => {
          this.client = client;
          this.initializeTooltips();
        });
      } 
      if (project.teamId) {
        this.teamService.getTeamById(project.teamId).subscribe(team => {
          this.team = team;
          this.initializeTooltips();
        });
      } else {
        this.initializeTooltips();
      }
    });
    this.initializeForm(projectId);
    this.loadTestScripts(projectId);

    this.authService.userDetails$.subscribe(user => {
      this.loggedInUser = user;
    });
    this.getTemplateList()
    this.showMessage();
    this.showSignOffMessage();
    this.showProjectActivateMessage();
    this.showAssignTeamMessage()
    // this.showassignTeamAndClientRepMessage()
    this.showAssignClientRepMessage()
    this.showIsSignedOffMessage();
    this.checkPhaseChangeReady(projectId);
    this.checkSignOffReady(projectId);
    this.checkIfUserIsTeamLead(projectId);
    // this.showNotTeamLeadMessage();
    // this.showNotTLPhaseChangeMessage();
  }


  filterTemplates(): void {
    const term = this.templateSearchTerm.toLowerCase().trim();
    this.filteredTemplates = this.templates.filter(template => template.templateName.toLowerCase().includes(term) ||
    template.templateTest.toLowerCase().includes(term) ||
    template.templateDescription.toLowerCase().includes(term));
  }
  
// checkList(projectId: string): void{
//   if(this.archiveShow == false){
//     this.loadTestScripts(projectId);
//   } 
//   if(this.archiveShow == true){
//     this.loadATestScripts(projectId);

//   }
// }
  initializeForm(projectId: string): void {
    this.addTestScriptForm = this.fb.group({
      process: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      test: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      testScriptDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      templateId: [this.selectedTemplateId], // Hidden field for template ID
      projectId: [projectId],
    });
  }

  ngAfterViewInit(): void {
    this.initializeTooltips();
  }

  initializeTooltips(): void {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
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

  checkPhaseChangeReady(projectId: string): void {
    this.projectsService.checkPhaseChangeReady(projectId).subscribe(
      (response: ProjectPhaseReturnDto) => {
        this.phaseChangeReady = response.isReadyForPhaseChange;
        //this.loading = false;
      },
      (error) => {
        console.error('Error checking phase change readiness', error);
        //this.loading = false;
      }
    );
  }

  checkSignOffReady(projectId: string): void {
    this.projectsService.checkSignOffReady(projectId).subscribe(
      (response: ProjectSignOffReturnDto) => {
        this.signOffReady = response.isReadyForSignOff;
        //this.loading = false;
      },
      (error) => {
        console.error('Error checking sign off readiness', error);
        //this.loading = false;
      }
    );
  }


  // initiatePhaseChange(): void {
  //   const dto: ProjectPhaseReturnDto = {
  //     projectId: this.project!.projectId,
  //     isReadyForPhaseChange: true,
  //   };

  //   this.projectsService.initiatePhaseChange(this.project!.projectId, dto).subscribe(
  //     (response) => {
  //       // Handle success
  //       console.log('Phase change initiated successfully', response);
  //       this.messageService.add({
  //         severity: 'success',
  //         summary: 'PhaseChanged',
  //         detail: 'Project phase changed successfully',
  //         key: 'bc'
  //       });
  //     },
  //     (error) => {
  //       console.error('Error initiating phase change', error);
  //       this.messageService.add({
  //         severity: 'Error',
  //         summary: 'Error',
  //         detail: 'Could not change project phase',
  //         key: 'bc'
  //       });
  //     }
  //   );
  // }
  initiatePhaseChange(): void {
    const dto: ProjectPhaseReturnDto = {
      projectId: this.project!.projectId,
      isReadyForPhaseChange: true,
    };

      this.confirmationService.confirm({
        header: 'Confirm Project Phase Change?',
        message: 'Are you sure you want to change the project phase?',
        accept: () => {
          this.projectsService.initiatePhaseChange(this.project!.projectId, dto).subscribe(
            () => {
              location.reload();
              this.messageService.add({
                severity: 'success',
                summary: 'Phase Changed',
                detail: 'Project Phase changed successfully',
                key: 'bc'
              });              
              //this.router.navigate(['/projects']);
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to change project phase',

                key: 'bc'
              });
            }
          );
        },
        reject: () => {
        }
      });
  }

  showMessage() {
    this.messages = [
      {
        severity: 'info',
        summary: 'Phase Change:',
        detail: `This project is ready to move on to the next phase. When ready, please proceed to change the phase. (alert team lead / admin)`,
        sticky: true
      }
    ];
  }

  showSignOffMessage() {
    this.SignOffMessages = [
      {
        severity: 'info',
        summary: 'Sign Off:',
        detail: `This project is ready to be signed off. When ready, please notify the responsible client representative to proceed and sign-off the project.`,
        sticky: true
      }
    ];
  }

  showIsSignedOffMessage() {
    this.IsSignedOffMessages = [
      {
        severity: 'info',
        summary: 'Deactivate Project:',
        detail: `This project has been signed off, if you wish to deactivate it, please proceed but you will no longer have access to work on it. (alert team lead / admin)`,
        sticky: true
      }
    ];
  }

  showProjectActivateMessage() {
    this.ActivateProjectMessages = [
      {
        severity: 'info',
        summary: 'Activate Project:',
        detail: `To start working on the project, please activate the project. (alert team lead / admin)`,
        sticky: true
      }
    ];
  }

  // showassignTeamAndClientRepMessage() {
  //   this.assignTeamAndClientRep = [
  //     {
  //       severity: 'info',
  //       summary: 'Team and Client Rep:',
  //       detail: `To start the project, alert the administrator to assign a team and client rep to the project!.`,
  //       sticky: true
  //     }
  //   ];
  // }

  showAssignTeamMessage() {
    this.AssignTeamMessages = [
      {
        severity: 'info',
        summary: 'Assign Team:',
        detail: `To start working on the project, please alert the administrator to assign the project to a team.`,
        sticky: true
      }
    ];
  }


  showAssignClientRepMessage() {
    this.AssignClientRepMessages = [
      {
        severity: 'info',
        summary: 'Assign Client Rep:',
        detail: `To start working on the project, please alert the administrator to assign the project to a responsible client representatives.`,
        sticky: true
      }
    ];
  }

  // showNotTeamLeadMessage() {
  //   this.notIsTeamLeadActivateMessages = [
  //     {
  //       severity: 'info',
  //       summary: 'Unauthorized:',
  //       detail: `Only the project team leader can activate or deactivate the project. Seek authorization from the team leader to proceed.`,
  //       sticky: true
  //     }
  //   ];
  // }

  // showNotTLPhaseChangeMessage() {
  //   this.notIsTeamLeadPhaseChangeMessages = [
  //     {
  //       severity: 'info',
  //       summary: 'Unauthorized:',
  //       detail: `This project is ready to move on to the next phase. Seek authorization from the team leader to proceed.`,
  //       sticky: true
  //     }
  //   ];
  // }


  editProject(): void {
    if (this.project) {
      this.router.navigate(['/edit-project', this.project.projectId]);
    }
  }

  deleteProject(): void {
    if (this.project && this.project.projectId) {
      this.confirmationService.confirm({
        header: 'Confirm Deletion',
        message: 'Are you sure you want to delete this project?',
        accept: () => {
          this.projectsService.deleteProject(this.project!.projectId).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Deleted',
                detail: 'Project deleted successfully',
                key: 'bc'
              });
              this.router.navigate(['/projects']);
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to delete project',
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

  goBack(): void {
    const clientId = this.route.snapshot.queryParams['clientId'];
    if (clientId) {
      this.router.navigate(['/client', clientId]);
    } else {
      this.router.navigate(['/projects']);
    }
  }
  

  openAssignTeamModal(): void {

    this.teamService.getFullTeams().subscribe(teams => {
      this.availableTeams = teams;
      this.showAssignTeamModal = true;
    });


    // this.teamService.getTeams().subscribe(teams => {
    //   this.availableTeams = teams;
    //   this.showAssignTeamModal = true;
    // });
  }

  closeAssignTeamModal(): void {
    this.showAssignTeamModal = false;
  }


  // assignTeam(teamId: string): void {
  //   if (this.project && this.project.projectId) {
  //     const assignData = {
  //       projectId: this.project.projectId,
  //       teamId: teamId
  //     };
  //     this.projectsService.assignTeamToProject(assignData).subscribe(() => {
  //       this.teamService.getTeamById(teamId).subscribe(team => {
  //         this.team = team;
  //         this.project!.teamId = teamId;
  //         this.closeAssignTeamModal();
  //         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team Assigned Successfully', key: 'bc' });
  //       });
  //     });
  //   }
  // }


  assignTeam(teamId: string): void {
    if (this.project && this.project.projectId) {
      const assignData = {
        projectId: this.project.projectId,
        teamId: teamId
      };
      this.confirmationService.confirm({
        header: 'Confirm Team Assignment',
        message: 'Are you sure you want to assign this team to this project?',
        accept: () => {
          this.projectsService.assignTeamToProject(assignData).subscribe(() => {
            this.teamService.getTeamById(teamId).subscribe(team => {
              this.team = team;
              this.project!.teamId = teamId;
              this.closeAssignTeamModal();
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team Assigned Successfully', key: 'bc' });
            });
          }, error => {
            console.error('Error assigning team:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to assign team',
              key: 'bc'
            });
          });
        },
        reject: () => {
        }
      });
    }
  }


  
  // Test Scripts
  loadTestScripts(projectId: string): void {
    this.testScriptService.getProjectScripts(projectId).subscribe((testScripts) => {
      this.testScripts = testScripts;
      this.filteredTestScripts = testScripts;
      console.log(testScripts.length);
      if (this.testScripts.length>0){this.showScripts = true;}
    });
  }
  loadATestScripts(projectId: string): void {
    this.testScriptService.getAProjectScripts(projectId).subscribe((testScripts) => {
      this.testScripts = testScripts;
      this.filteredTestScripts = testScripts;
      console.log(testScripts.length);
      if (this.testScripts.length>0){this.showScripts = true;}
    });
  }
  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredTestScripts = this.testScripts.filter(testScript =>
      testScript.process?.toLowerCase().includes(query) ||
      testScript.test?.toLowerCase().includes(query) ||
      testScript.testScriptDescription?.toLowerCase().includes(query)
    );
  }
  //get Templates
  getTemplateList(): void{
    this.templateService.getAllApprovedTemplates().subscribe((templates) =>
    {
      this.templates = templates;
      this.filteredTemplates = templates;
    });
  }

  selectTemplate(template: any): void {
    this.addTestScriptForm.patchValue({
      process: '',
      test: template.templateTest,
      testScriptDescription: template.templateDescription,
      templateId: template.templateId
    });
    this.templateService.getTemplateTestSteps(template.templateId).subscribe((testSteps: TemplateTestStep[]) => {
      this.testSteps = testSteps;
    }); 
    this.selectedTemplateId = template.templateId;
    this.closeTemplateList();
    this.openModal();
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissionsService.hasPermission(permission)
  }
  
  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
  viewArchived(button: string, projectId: string): void {
    this.archiveShow = true;
    this.selectedButton = button;
    console.log(this.archiveShow);
    console.log(this.filteredTestScripts);
    this.loadATestScripts(projectId);

 }
 viewUnArchived(button: string, projectId: string): void {
  this.archiveShow = false;
  this.selectedButton = button;
  console.log(this.archiveShow);
  console.log(this.filteredTestScripts);
  this.loadTestScripts(projectId);

}

  openTemplateList():void{
    this.showModal2 = true;
    this.templateSearchTerm = '';
    this.filteredTemplates = this.templates;
    //this.getTemplateList();
  }
  closeTemplateList(): void{
    this.showModal2 = false;
  }
  toggleShowScripts(){
    this.showScripts = !this.showScripts;
  }
 
  getFormattedDate(date: any): string {
    if (!date) {
      return '';
    }
  
    const dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return '';
    }
  
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('default', { month: 'long' });
    const year = dateObj.getFullYear();
  
    return `${day} ${month} ${year}`;
  }


  activateProject(): void {
    if (this.project) {
      this.confirmationService.confirm({
        header: 'Confirm Activation',
        message: 'Are you sure you want to activate this project?',
        accept: () => {
          this.projectsService.activateProject(this.project!.projectId).subscribe(
            (result: Project) => {
              location.reload();  
              this.messageService.add({
                severity: 'success',
                summary: 'Activated',
                detail: 'Project activated successfully',
                key: 'bc'
              });
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to activate project: ',
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

  deactivateProject(): void {
    if (this.project) {
      this.confirmationService.confirm({
        header: 'Confirm Deactivation',
        message: 'Are you sure you want to deactivate this project?',
        accept: () => {
          this.projectsService.deactivateProject(this.project!.projectId).subscribe(
            (result: Project) => {
              location.reload();  
              this.messageService.add({
                severity: 'success',
                summary: 'Deactivated',
                detail: 'Project deactivated successfully',
                key: 'bc'
              });
              },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to deactivate project: ',
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


  openReAssignClientRepModal(): void {
    this.clientService.getClientRepsByClientId(this.project!.clientId).subscribe({
      next: (reps: ClientRepresentative[]) => {
        this.clientReps = reps;
        this.showReAssignClientRepModal = true;
      },
      error: (error) => {
        console.error('Error fetching client representatives:',error);
        //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch client representatives', key: 'bc' });
      }
    });
  }

  closeReAssignClientRepModal(): void {
    this.showReAssignClientRepModal = false;
  }


  openAssignClientRepModal(): void {
    this.clientService.getClientRepsByClientId(this.project!.clientId).subscribe({
      next: (reps: ClientRepresentative[]) => {
        this.clientReps = reps;
        this.showAssignClientRepModal = true;
      },
      error: (error) => {
        console.error('Error fetching client representatives:',error);
        //this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch client representatives', key: 'bc' });
      }
    });
  }

  closeAssignClientRepModal(): void {
    this.showAssignClientRepModal = false;
  }

  checkIfUserIsTeamLead(projectId: string): void {
    const userId = this.authService.getCurrentUserId();
    if (userId) {
      this.teamService.isUserTeamLead(userId, projectId).subscribe(isLead => {
        this.isTeamLead = isLead;
        console.log('Is user team lead:', this.isTeamLead); // Debugging log
      }, error => {
        console.error('Error checking if user is team lead:', error);
      });
    }
  }

  canAccessTeamLeadOptions(): boolean {
    return this.isTeamLead;
  }


  assignClientRep(clientRepEmail: string): void {
    if (this.project && this.project.projectId) {
      this.confirmationService.confirm({
        header: 'Confirm Assignment',
        message: 'Are you sure you want to assign this client representative to this project?',
        accept: () => {
          this.projectsService.assignResponsibleClientRep(this.project!.projectId, clientRepEmail).subscribe(() => {
            this.projectsService.getProject(this.project!.projectId).subscribe(project => {
              this.project = project;
              this.closeAssignClientRepModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Client representative assigned successfully',
                key: 'bc'
              });
            });
          }, error => {
            console.error('Error assigning client representative:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to assign client representative',
              key: 'bc'
            });
          });
        },
        reject: () => {
        }
      });
    }
  }

  reAssignClientRep(clientRepEmail: string): void {
    if (this.project && this.project.projectId) {
      this.confirmationService.confirm({
        header: 'Confirm Assignment',
        message: 'Are you sure you want to reassign this client representative to this project?',
        accept: () => {
          this.projectsService.assignResponsibleClientRep(this.project!.projectId, clientRepEmail).subscribe(() => {
            this.projectsService.getProject(this.project!.projectId).subscribe(project => {
              this.project = project;
              this.closeReAssignClientRepModal();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Client representative reassigned successfully',
                key: 'bc'
              });
            });
          }, error => {
            console.error('Error assigning client representative:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to reassign client representative',
              key: 'bc'
            });
          });
        },
        reject: () => {
        }
      });
    }
  }

  CannotAssignClientRep(): void {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sorry! This client representative is already assigned.', key: 'bc' });
  }

  // assignClientRep(clientRepEmail: string): void {
  //   if (this.project && this.project.projectId) {
  //     this.projectsService.assignResponsibleClientRep(this.project.projectId, clientRepEmail).subscribe(() => {
  //       this.projectsService.getProject(this.project!.projectId).subscribe(project => {
  //         this.project = project;
  //         this.closeAssignClientRepModal();
  //         this.messageService.add({
  //           severity: 'success',
  //           summary: 'Success',
  //           detail: 'Client representative assigned successfully',
  //           key: 'bc'
  //         });
  //       });
  //     }, error => {
  //       console.error('Error assigning client representative:', error);
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'Failed to assign client representative',
  //         key: 'bc'
  //       });
  //     });
  //   }
  // }
  


  createTestScript(): void {
    if (this.addTestScriptForm.invalid) {
      this.addTestScriptForm.markAllAsTouched();
      return;
    }
  
    const newTestScript = this.addTestScriptForm.value;
    console.log(newTestScript);
    this.confirmationService.confirm({
      header: 'Confirm Creation',
      message: 'Are you sure you want to create this test script?',
      accept: () => {
        this.testScriptService.createTestScript(newTestScript).subscribe(
          (testScript) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Created',
              detail: 'Test script created successfully',
              key: 'bc'
            });
            this.closeModal();
            // if (testScript.testScriptId){
            // this.transferTestSteps(newTestScript.templateId, testScript.testScriptId);}
            this.router.navigate(['/testscript-update', testScript.testScriptId]);
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create test script',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
      }
    });
  }
  

  transferTestSteps(templateId: string, tsId: string): void {
    this.templateService.getTemplateTestSteps(templateId).subscribe((loadedSteps: any[]) => {
      if (loadedSteps && loadedSteps.length > 0) {
        for (let i = 0; i < loadedSteps.length; i++) {
          this.testScriptService.createTestStep(loadedSteps[i], tsId).subscribe(() => {
            console.log('Test Step loaded');
          });
        }
      } else {
        console.log('No Test Steps found');
      }
    }, error => {
      console.error('Error loading test steps:', error);
    });
  }


deleteTestScript(ts: TestScript): void {
  this.confirmationService.confirm({
    header: 'Confirm Archiving',
    message: 'Are you sure you want to archive this test script?',
    accept: () => {
      if (ts.testScriptId) {
        this.testScriptService.archiveTestScript(ts.testScriptId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Archived', detail: 'Test script archived successfully', key: 'bc' });
          this.router.navigate(['/project', this.project?.projectId]);
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to archive test script', key: 'bc' });
        });
      }
    },
    reject: () => {
    }
  });
}
 //Sign-Off

 clearSignature() {
   this.signaturePad.clear();
 }
 captureSignature() {
  if (this.signaturePad) {
    return this.signaturePad.toDataURL(); 
  }
  return '';
}

 savePDF() {
   if (this.signaturePad.isEmpty() && this.signaturePad) {
     alert("Please provide a signature first.");
     return;
   }
   const signatureImage = this.captureSignature(); 
   this.confirmationService.confirm({
    header: 'Confirm',
    message: 'Are you sure you want to sign off this project?',
    accept: () => {
      console.log(signatureImage);
      console.log(this.project?.projectId);
      var base64data: string = " ";
      if (this.project?.projectId){
        this.testScriptService.signOff(this.project.projectId, signatureImage).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Signed',
              detail: 'Project signed off successfully',
              key: 'bc'
            });
            this.showSignOffModal = false;
          const doc = new jsPDF();
          const currentTime = new Date();
          const date = currentTime.toLocaleDateString().replace(/\//g, '-');
          const time = currentTime.toLocaleTimeString().replace(/:/g, '-');
          const img = new Image();
          img.src = 'assets/company-logo.png';
          img.onload = () => {
          doc.addImage(img, 'PNG', 10, 15, 50, 20);
          doc.setFont('Arial');
          doc.setFontSize(18);
          doc.text('EPI-USE Africa', 70, 20);

          doc.setFontSize(10);
          doc.text('Project Sign-Off', 70, 25);
          doc.setFontSize(10);
          doc.text(`Date: ${date} Time: ${time}`, 70, 30);

          const generatedBy = this.loggedInUser ? `${this.loggedInUser.firstName} ${this.loggedInUser.surname}` : 'Unknown User';
          const projectName = this.project?.projectName;
          doc.setFontSize(10);
          doc.setFont('Arial', 'normal');
          doc.text(`Project signed-off by: ${generatedBy}`, 70, 35);
          
          doc.setLineWidth(0.5);
          doc.line(10, 40, 200, 40);
          doc.setFontSize(18);
          doc.setFont('Arial', 'bold');
          doc.text(`Project Sign-Off: ${projectName}`, 10, 46);
          
          doc.setFontSize(12);
          doc.setFont('Arial', 'normal');
          doc.text(' ', 10, 52)
          const paragraph = `The client representative hereby acknowledges and agrees that the project has been successfully completed and all test script solutions provided by EPI-USE, have met the required standards and expectations. With the signature below, the client representative confirms their approval of the work completed and consents to the formal closure of the project.`;
          doc.text(paragraph, 10, 53, { maxWidth: 180 });

          doc.setFontSize(12);
          doc.setFont('Arial', 'italic');
          doc.addImage(signatureImage, 'PNG', 10, 72, 100, 50);
          doc.text(`Signature of ${generatedBy}`, 10, 125);
       
          doc.save(`${projectName}_Sign-Off.pdf`); 
          // Convert PDF to Blob
          const pdfBlob = doc.output('blob');
          const formData = new FormData();
          formData.append('pdfFile', pdfBlob, `${projectName}_Sign-Off.pdf`);
          console.log(formData)
          if(this.project){
          this.testScriptService.sendSignOffEmail(this.project.projectId, formData).subscribe(()=>{
            this.messageService.add({
              severity: 'success',
              summary: 'Signed',
              detail: 'Project sign-off email sent successfully',
              key: 'bc'
            });console.log("Email sent to Client Rep");
          },
          error =>{
            console.error('Validation Errors:', error);  
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to send sign-off email',
            key: 'bc'
          });})}}
          
            (error: any) => {
          console.error('Validation Errors:', error);  
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to complete sign-off',
            key: 'bc'
          });
          this.showSignOffModal = false;
          //location.reload();
          this.closeModal();}
      });}
    },
    reject: () => {
      this.messageService.add({ severity: 'info', summary: 'Cancelled', detail: 'Sign-off cancelled', key: 'bc' });

    }
  });
 }


 openSignOffModal(): void {
  this.showSignOffModal = true;
  setTimeout(() => {
    const canvas = this.canvasRef.nativeElement;
    this.signaturePad = new SignaturePad(canvas); 
  }, 500);
}

closeSignOffModal(): void {
  this.showSignOffModal = false;
  this.clearSignature(); 
} 
 }

function foreach(arg0: boolean) {
  throw new Error('Function not implemented.');
}
