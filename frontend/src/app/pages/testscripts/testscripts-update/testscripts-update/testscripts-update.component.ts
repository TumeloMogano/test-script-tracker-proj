import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { TestScript } from '../../../../models/testscript/testscripts';
import { TestStep } from '../../../../models/testscript/teststeps';
import { Defect } from '../../../../models/testscript/defects';
import { TestScriptsServices } from '../../../../services/testscripts/testscripts.services';
import { DefectsServices } from '../../../../services/defects/defects.services';
import { TestScriptAssignment } from '../../../../models/testscript/testscriptassignment';
import { Project } from '../../../../models/project';
import { ProjectsService } from '../../../../services/projects/projects.service';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { CommonModule } from '@angular/common';
import { Workbook, ImagePosition, Worksheet } from 'exceljs';
import { saveAs } from 'file-saver';
import { TeamMember } from '../../../../models/team/team.model';
import { TeamService } from '../../../../services/teams/team.service';
import { Team } from '../../../../models/team/team.model';
import { CommentsService } from '../../../../services/comments/comments.service';
import { Comment, CommentMentionVM } from '../../../../models/comment/comment.model';
import { CommentViewModel } from '../../../../models/comment/comment.model';
import { Message, MessageService, ConfirmationService } from 'primeng/api';
import { AuthService } from '../../../../services/auth/auth.service';
import { AuthUser } from '../../../../models/auth/auth.model';

import { async, map, Observable, Subject, takeUntil } from 'rxjs';
import { User } from '../../../../models/user';
import { AspUsers } from '../../../../models/aspusers';
import { AspUsersServices } from '../../../../services/aspnetusers/aspnetusers';
import { StepResult } from '../../../../models/testscript/stepresults';
import { Theme } from '../../../../models/theme';
import { Logo} from '../../../../models/theme';
import { ColourScheme } from '../../../../models/theme';
import { Font } from '../../../../models/theme';
import { ThemeService } from '../../../../services/theme/theme.service';
import { LogoService } from '../../../../services/theme/logo.service';
import { ColourSchemeService } from '../../../../services/theme/colourscheme.service';
import { HttpClient } from '@angular/common/http';
import { ClientService } from '../../../../services/clients/client.service';
import { ApplyTagReq, Tag } from '../../../../models/tag/tag.model';
import { TagService } from '../../../../services/tags/tag.service';
import *  as bootstrap from 'bootstrap';
import { TagType } from '../../../../models/tag/tagtype.model';import { MatDialog } from '@angular/material/dialog';
import { DefectsResolvedDto } from '../../../../models/defects-resolved-dto';
import { UserPopupComponent } from '../../user-popup/user-popup.component';
import { forkJoin } from 'rxjs';
import { Permissions } from '../../../../models/permissions.enums';
import { PermissionsService } from '../../../../services/auth/permissions.service';


// import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-testscripts-update',
  templateUrl: './testscripts-update.component.html',
  styleUrl: './testscripts-update.component.scss',
  animations: [
    trigger('rotateChevron', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', animate('300ms ease-in-out')),
    ]),
    trigger('toggleTable', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('300ms ease-out', style({ opacity: 1, height: '*' })),
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*' }),
        animate('300ms ease-in', style({ opacity: 0, height: '0px' })),
      ]),
    ]),
  ],
})
export class TestscriptsUpdateComponent implements OnInit, AfterViewChecked {
  testScript: TestScript | undefined;
  testScriptAssignment!: TestScriptAssignment;
  editForm: FormGroup;
  showEditForm: boolean = false;
  editingStepIndex: number | null = null;
  addingNewStepIndex: number | null = null;
  testStepData: any = {};
  showAddButtonIndex: number | null = null;
  initialFormValue: any;
  showDefects!: boolean;
  defects: Defect[] = [];
  themes: Theme [] = [];
  page: number = 1;
  showModal: boolean = false;
  showThemeModal: boolean = false;
  showLogoModal: boolean = false;
  showColoursModal: boolean = false;
  logDefectForm!: FormGroup;
  exportData: any = [];
  teams: Team[] = [];
  teamId!: string;
  clientThemeId!: string;
  teamMembers: TeamMember[] = [];
  stepResults: StepResult[] = [];
  selectedTeamId: string | null = null;
  selectedMemberId: string | null = null;
  selectTSId!: string;
  comments: Comment[] = [];
  logCommentForm!: FormGroup;
  editCommentForm!: FormGroup;
  commentToUpdateId!: string;
  tsId!: string;
  showAddCommentform = false;
  showAddCommentButton = true;
  showEditCommentform = false;
  showCommentsList = true;
  loggedInUser: AuthUser | null | undefined;
  userEmailD: string | undefined;
  Users: any[] = [];
  commentMentionVMArray: CommentMentionVM[] = [];
  tags: Tag[] = [];
  tagTypes: TagType[] = [];
  showTagModal = false;
  availableTags: Tag[] = [];
  showTags: boolean = false;
  userDets!: AspUsers;
  showAssignTeamMemberModal: boolean = false;

  private destroy$ = new Subject<void>();
  isLoggedIn: boolean = false;

  logos: Logo[] = [];
  colours: ColourScheme[] = [];
  font!: Font;
  theme!: Theme;
  logo!: Logo;
  Scolour!: ColourScheme;
  defectsResolvedReady: boolean = false;
  IsDefectsResolvedMessages: Message[] = [];
  IsDefectsResolvedMessages2: Message[] = [];
  IsAssignedMessages: Message[] = [];
  NeedsEvaluationMessages: Message[] = [];
  PassedMessages: Message[] = [];
  canSubmit: boolean = false;
  notTLAssignMember: Message[] = [];
  isTeamLead: boolean = false;
  numTestSteps: number = 0;

  Permissions = Permissions;



  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog,
    public testScriptService: TestScriptsServices,
    public defectService: DefectsServices,
    public fb: FormBuilder,
    public teamService: TeamService,
    public themeService: ThemeService,
    public logoService: LogoService,
    public colourService: ColourSchemeService,
    public clientService: ClientService,
    public projectService: ProjectsService,
    private tagsService: TagService,
    public commentsService: CommentsService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    private authService: AuthService,
    private permissionsService: PermissionsService,
    private userService: AspUsersServices,
    private http: HttpClient
  ) {
    this.editForm = this.fb.group({
      testScriptId: [this.testScript?.testScriptId],
      process: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      test: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(100),
        ],
      ],
      testScriptDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(200),
        ],
      ],
      testSteps: this.fb.array([]),
    });

    this.user$ = this.authService.userDetails$;
  }

  ngOnInit(): void {
    const testScriptId = this.route.snapshot.paramMap.get('testScriptId');
    if (testScriptId) {
      this.tsId = testScriptId;
      this.selectTSId = testScriptId;
      this.testScriptService
        .getTestScript(testScriptId)
        .subscribe((testScript) => {
          this.testScript = testScript;
          this.loadTestScriptDetails();
          this.getUserDets(testScriptId);       
          this.loadTestSteps(testScriptId);
          this.loadDefects(testScriptId);
          this.initializeForm(testScriptId);

          //get teamId
          this.loadTeams(testScript);
          this.loadTheme(testScript);
          this.loadTagTypes();
          this.loadTestScriptTags(testScriptId);
          this.checkDefectsResolvedReady(testScriptId);
          this.showNotTLAssignMemberMessage();
          this.showIsDefectsResolvedMessage();
          this.showIsDefectsResolvedMessage2();
          this.showIsAssignedMessage();
          this.showNeedsEvaluationMessage();
          this.showPassedMessage();
          this.checkIfUserIsTeamLead(testScript.projectId!);

          this.testScriptService.checkToSubmit(testScriptId).subscribe((testScript)=>{
            if(testScript){
              this.canSubmit = true;
            }
          })
        });
    }
    this.initializeTooltips();
    //Log Defect User retrieval variables
    this.authService.userDetails$.subscribe(user => {
      this.loggedInUser = user;
      this.userEmailD = user?.email;
    });
      //load users
      this.loadUsers();
    this.loadResults();
    this.getUsers();
    this.loadComments();
    this.authService.isLoggedIn$.pipe(takeUntil(this.destroy$)).subscribe(loggedIn => {
      this.isLoggedIn = loggedIn;
      if (!this.isLoggedIn) {
        this.clearComments(); // Reset form when user logs out
      }
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngAfterViewChecked(): void {
    this.initializeTooltips();
  }

  initializeTooltips(): void {
    const tooltipTriggerList = Array.from(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
      if (!tooltipInstance) {
        new bootstrap.Tooltip(tooltipTriggerEl);  // Only initialize if not already initialized
      }
    });
  }
  
  hideTooltip(iconId: string): void {
    const tooltipElement = document.getElementById(iconId);
    if (tooltipElement) {
      const tooltipInstance = bootstrap.Tooltip.getInstance(tooltipElement);
      if (tooltipInstance) {
        tooltipInstance.hide();
        tooltipInstance.dispose();  // Dispose of the tooltip to fully remove it
      }
    }
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissionsService.hasPermission(permission)
  }

  checkDefectsResolvedReady(testScriptId: string): void {
    this.testScriptService.checkDefectsResolvedReady(testScriptId).subscribe(
      (response: DefectsResolvedDto) => {
        this.defectsResolvedReady = response.IsZeroDefects;
        //this.loading = false;
      },
      (error) => {
        console.error('Error checking phase change readiness', error);
        //this.loading = false;
      }
    );
  }

  showIsDefectsResolvedMessage() {
    this.IsDefectsResolvedMessages = [
      {
        severity: 'info',
        summary: 'Ready for testing?',
        detail: `If you are done working on this test script. You can proceed to submit it and notify the client representative to use it for testing.`,
        sticky: true
      }
    ];
  }

  showIsDefectsResolvedMessage2() {
    this.IsDefectsResolvedMessages2 = [
      {
        severity: 'info',
        summary: 'Ready for re-testing?',
        detail: `If you are done making changes on this test script. You can proceed to submit it and notify the client representative to use it for re-testing.`,
        sticky: true
      }
    ];
  }


  showIsAssignedMessage() {
    this.IsAssignedMessages = [
      {
        severity: 'info',
        summary: 'Assign Test Script:',
        detail: `Please assign this test script to a team member. The test script cannot be submitted for testing unless it is assigned.`,
        sticky: true
      }
    ];
  }


  showNeedsEvaluationMessage() {
    this.NeedsEvaluationMessages = [
      {
        severity: 'warn',
        summary: 'Evaluate Test Script',
        detail: `This test script has been tested and has failed, please evaluate the test script's results and feedback. When done please resubmit for re-testing.`,
        sticky: true
      }
    ];
  }

  showPassedMessage() {
    this.PassedMessages = [
      {
        severity: 'success',
        summary: 'Passed Testing:',
        detail: `This test script has been tested and has passed and thus confirms successful completion on expected functionality the client's implemented solution. YOU CAN ARCHIVE THE TEST SCRIPT IF YOU WISH TO SO!`,
        sticky: true
      }
    ];
  }

  showNotTLAssignMemberMessage() {
    this.notTLAssignMember = [
      {
        severity: 'info',
        summary: 'Team Leader Required:',
        detail: `In order to work on this test script, you must be assigned by the team leader. Please contact you team leader!`,
        sticky: true
      }
    ];
  }

  
  evaluateFeedback(): void{
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to reopen this test script for feedback evaluation?',
      accept: () => {
        if (this.testScript && this.testScript.testScriptId)
          this.testScriptService.evaluateFeedback(this.testScript!.testScriptId).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Test script reopened successfully',
              key: 'bc'
            });
            this.ngOnInit();
        },
        error => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to reopen test script',
            key: 'bc'
          });
        }
      );},
      reject: () => {
      }
  });
  }

  recreateTs(): void{
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to recreate this test script for new testing?',
      accept: () => {
        if (this.testScript && this.testScript.testScriptId)
          this.testScriptService.recreateTestScript(this.testScript!.testScriptId).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Test script recreated successfully',
              key: 'bc'
            });
            this.ngOnInit();
        },
        error => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to recreate test script',
            key: 'bc'
          });
        }
      );},
      reject: () => {
      }
  });
  }
  loadUsers() {
    this.userService.getUsers().subscribe((users) => {
      this.users = users;
      console.log(users)
    });
  }
  getUserDets(testScriptId: string) {
    this.testScriptService.getTestScriptAssignment(testScriptId).subscribe((result)=>{
      console.log(result);
      //User Details
      if(result.userId){
      this.userService.getUserById(result.userId).subscribe((user)=>
      {
        this.userDets = user;
      })
      }
  })
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

  initializeForm(testScriptId: string): void {
    this.logDefectForm = this.fb.group({
      defectDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(150),
        ],
      ],
      testScriptId: [testScriptId],
      userEmailAddress: [this.userEmailD],
    });
  }
  loadTestScriptDetails(): void {
    this.editForm.patchValue({
      testScriptId: this.testScript?.testScriptId,
      process: this.testScript!.process,
      test: this.testScript!.test,
      testScriptDescription: this.testScript!.testScriptDescription,
    });
    this.initialFormValue = this.editForm.value;

    //test script assigned to?
  }

  loadTestSteps(testScriptId: string): void {
    this.testScriptService.getAllSteps(testScriptId).subscribe((testSteps) => {
      testSteps.forEach((testStep) => {
        if(testStep.stepResultId){
          console.log(testStep.stepResultId);
        this.testScriptService.getStepResult(testStep.stepResultId).subscribe((stepResult) => {
          testStep.stepResult = stepResult.stepResultName;
        });}
      });
      this.setTestSteps(testSteps);
      this.numTestSteps = testSteps.length;
      console.log(testSteps);
    });
  }


  loadResults(): void {
    this.testScriptService.getAllResults().subscribe((results) => {
      this.stepResults = results;
    });
  }


  onStepChange(event: Event, index: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const selectedStepResultId = Number(selectElement.value);

    if (selectedStepResultId) {
      this.saveStepResult(index, selectedStepResultId);
    }
  }

  loadTestScriptTags(testScriptId: string): void {
    this.tagsService.getTagsByTestScript(testScriptId).subscribe({
      next: (tags) => {
        this.tags = tags;

        this.showTags = this.tags.length > 0;
      },
      error: (err) => {
        console.error('Failed to load tags for testscript:', err);
      } 
    });
  }

  openTagModal(): void {
    this.showTagModal = true;
    this.loadAvailableTags();
  }

  loadAvailableTags(): void {
    this.tagsService.getTags().subscribe({
      next: (tags) => {
        this.availableTags = tags;
      },
      error: (err) => {
        console.error('Failed to load available tags:', err);
      }
    });
  }

  closeTagModal(): void {
    this.showTagModal = false;
  }

  ApplyTag(tagId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to apply this tag?',
      header: 'Apply Tag Confirmation',
      accept: () => {
        const request: ApplyTagReq = {
          testscriptId: this.tsId,
          tagId: tagId
      };

      this.tagsService.applyTag(request).subscribe({
        next: () => {
          this.loadTestScriptTags(this.tsId);
          this.closeTagModal();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tag applied successfully!',
            key: 'tl'
          });
        },
        error: (err) => {
          console.error('Failed to apply tag:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to apply tag.',
            key: 'bc',
          });
        }
      });
      }
    });
  }

  removeTag(tagId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to remove this tag?',
      header: 'Remove Tag Confirmation',
      accept: () => {
        const request: ApplyTagReq = {
          testscriptId: this.tsId,
          tagId: tagId
      };

      this.tagsService.removeAppliedTag(request).subscribe({
        next: () => {
          this.loadTestScriptTags(this.tsId);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Tag removed successfully!',
            key: 'tl',
          });
        },
        error: (err) => {
          console.error('Failed to remove tag:', err);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to remove tag.',
            key: 'bc',
          });
        }
      });
      }
    });
  }

  loadTagTypes() {
    this.tagsService.getTagTypes().subscribe((types) => {
      this.tagTypes = types;
    });
  }

  getTagTypeName(tagTypeId: number): string {
    const type = this.tagTypes.find((t) => t.tagTypeId === tagTypeId);
    return type ? type.tagtypeName : '';
  }

  saveStepResult(index: number, stepResultId: number): void {
    const updatedTestStep = this.testStepsFormArray.at(index).value;
    updatedTestStep.stepResultId = stepResultId;
    this.testScriptService.updateTestStep(updatedTestStep.testStepId, updatedTestStep).subscribe(
      () => {
        console.log('Step result saved successfully.');
        this.loadTestSteps(updatedTestStep.testScriptId);
        this.editingStepIndex = null;
      },
      (error) => {
        console.error('Error saving step result:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save step result.',
          key: 'bc',
        });
      }
    );
  }


  loadDefects(testScriptId: string): void {
    this.defectService.getDefects(testScriptId).subscribe((defects) => {
      this.defects = defects;
      console.log(defects.length);
    if (this.defects.length>0){this.showDefects = true;}
    });
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }
  toggleShowDefects() {
    this.showDefects = !this.showDefects;
  }

  toggleShowTags(): void {
    this.showTags = !this.showTags;
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
  logDefect(): void {
    if (this.logDefectForm.invalid) {
      this.logDefectForm.markAllAsTouched();
      return;
    }
    const newDefect = this.logDefectForm.value;
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to log new defect?',
      accept: () => {
        console.log(this.userEmailD);
        console.log(newDefect);
        if (newDefect){
          this.defectService.logDefect(newDefect).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Logged',
              detail: 'Defect logged successfully',
              key: 'bc'
            });
            this.showModal = false;
            this.ngOnInit();
          },
          error => {
            console.error('Validation Errors:', error.error.errors);  
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to log new defect',
              key: 'bc'
            });
            this.showModal = false;
            location.reload();
            this.closeModal();}
        );}
      },
      reject: () => {
        
      }
    });
  }

  deleteDefect(d: Defect): void {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to delete this defect?',
      accept: () => {
        console.log(d);
        if (d.defectId){
          this.defectService.removeDefect(d.defectId).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Defect deleted successfully',
              key: 'bc'
            });
            this.showModal = false;
            this.ngOnInit();
          },
          error => {
            console.error('Validation Errors:', error.error.errors);  
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete defect',
              key: 'bc'
            });
            this.showModal = false;
            this.ngOnInit();
            this.closeModal();}
        );}
      },
      reject: () => {
        
      }
    });
  }

  submitTestScript(): void {
    if(this.numTestSteps > 0){
      this.confirmationService.confirm({
        header: 'Confirm',
        message: 'Are you sure you want to submit this test script?',
        accept: () => {
          
          console.log(this.testScript);
          if (this.testScript && this.testScript.testScriptId){
            this.testScript.statusTypeId = 2;
            this.testScriptService.updateTestScript(this.testScript.testScriptId, this.testScript).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Submitted',
                detail: 'Test Script submitted successfully',
                key: 'bc'
              });
              this.ngOnInit();
            },
            error => {
              console.error('Validation Errors:', error.error.errors);  
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to submit test script',
                key: 'bc'
              });
              this.ngOnInit();}
          );}
        },
        reject: () => {
          
        }
      });
    }
    else{
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'There are NO test steps in this test script, please add test steps before you can submit!',
        key: 'bc'
      }); 
    }
  }
  get testStepsFormArray(): FormArray {
    return this.editForm.get('testSteps') as FormArray;
  }

  // setTestSteps(testSteps: TestStep[]): void {
  //   const testStepFGs = testSteps.map((step) =>
  //     this.fb.group({
  //       testStepId: [step.testStepId],
  //       testStepDescription: [
  //         step.testStepDescription,
  //         [
  //           Validators.required,
  //           Validators.minLength(10),
  //           Validators.maxLength(500),
  //         ],
  //       ],
  //       testStepRole: [
  //         step.testStepRole,
  //         [
  //           Validators.required,
  //           Validators.minLength(2),
  //           Validators.maxLength(50),
  //         ],
  //       ],
  //       testStepName: [
  //         step.testStepName,
  //         [
  //           Validators.required,
  //           Validators.minLength(10),
  //           Validators.maxLength(500),
  //         ],
  //       ],
  //       testData: [
  //         step.testData,
  //         [
  //           Validators.required,
  //           Validators.minLength(10),
  //           Validators.maxLength(500),
  //         ],
  //       ],
  //       expectedOutcome: [
  //         step.expectedOutcome,
  //         [
  //           Validators.required,
  //           Validators.minLength(10),
  //           Validators.maxLength(500),
  //         ],
  //       ],
  //       additionalInfo: [
  //         step.additionalInfo,
  //         [
  //           Validators.required,
  //           Validators.minLength(10),
  //           Validators.maxLength(500),
  //         ],
  //       ],
  //       feedback: [step.feedback, [Validators.minLength(10), Validators.maxLength(500)]],
  //       stepResult: [step.stepResult, [Validators.minLength(10), Validators.maxLength(500)]],
  //     })
  //   );
  //   const testStepFormArray = this.fb.array(testStepFGs);
  //   this.editForm.setControl('testSteps', testStepFormArray);
  // }

  setTestSteps(testSteps: any[]): void {
    const testStepFGs = testSteps.map((step) => {
      const formGroup = this.fb.group({
        testStepId: [step.testStepId],
        testStepDescription: [
          step.testStepDescription,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(500),
          ],
        ],
        testStepRole: [
          step.testStepRole,
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(50),
          ],
        ],
        testStepName: [
          step.testStepName,
          [
            Validators.required,
            Validators.minLength(10),
            Validators.maxLength(500),
          ],
        ],
        testData: [
          step.testData,
          [
            Validators.required,
            Validators.minLength(1),
            Validators.maxLength(500),
          ],
        ],
        expectedOutcome: [
          step.expectedOutcome,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(500),
          ],
        ],
        additionalInfo: [
          step.additionalInfo,
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(500),
          ],
        ],
        feedback: [
          step.feedback,
          [Validators.minLength(10), Validators.maxLength(500)],
        ],
        stepResult: [
          step.stepResult,
          [Validators.minLength(10), Validators.maxLength(500)],
        ],
      });
        if (step.stepResultId) {
        this.testScriptService.getStepResult(step.stepResultId).subscribe((stepResult) => {
          formGroup.patchValue({
            stepResult: stepResult.stepResultName,
          });
        });
      }
  
      return formGroup;
    });
  
    const formArray = this.fb.array(testStepFGs);
    this.editForm.setControl('testSteps', formArray); 
  }
  
  // toggleEditForm(): void {
  //   this.showEditForm = !this.showEditForm;
  //   if (this.showEditForm) {
  //     this.loadTestScriptDetails(); 
  //     this.checkEditPermissions();
  //     this.ngOnInit();
  //   }
  // }

  toggleEditForm(): void {
    //this.showEditForm = !this.showEditForm;
    if (this.showEditForm == true) {
      this.confirmationService.confirm({
        header: 'Cancel',
        message: 'Are you sure you want to cancel? All unsaved changes will be lost.',
        accept: () => {
          this.showEditForm = false;
        },
        reject: () => {
        }
      });
    }
    else{
      this.showEditForm = true;
      this.loadTestScriptDetails(); 
      this.checkEditPermissions();
      this.ngOnInit();
    }
  }

  saveTestScriptDetails(): void {
    console.log(this.editForm);

    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
    // console.log(this.editForm);
    if (
      JSON.stringify(this.initialFormValue) ===
      JSON.stringify(this.editForm.value)
    ) 
    {
      this.confirmationService.confirm({
        header: 'Confirm',
        message: 'No changes were made, would you like to stop editing?',
        accept: () => {
          this.showEditForm = false;
          return;}, 
          reject: () => {
        
          }
    });}
    this.testScript = {
      ...this.testScript,
      ...this.editForm.value,
    };
    // if (this.testScript!.testScriptId && this.editForm) {
    //   this.testScriptService
    //     .updateTestScript(this.testScript!.testScriptId, this.testScript)
    //     .subscribe(() => {
    //       if (this.testScript!.testScriptId) {
    //         this.testScriptService
    //           .getTestScript(this.testScript!.testScriptId)
    //           .subscribe((updatedTestScript) => {
    //             this.testScript = updatedTestScript;
    //             this.showEditForm = false;
    //             this.checkEditPermissions();
    //           });
    //       }
    //     });
    // }
    if (
      JSON.stringify(this.initialFormValue) !==
      JSON.stringify(this.editForm.value)
    ) {
      this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to update this test script details?',
      accept: () => {
        if (this.editForm && this.testScript!.testScriptId)
          this.testScriptService.updateTestScript(this.testScript!.testScriptId, this.testScript).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Test script details updated successfully',
              key: 'bc'
            });
            if (this.testScript!.testScriptId) {
              this.testScriptService
                .getTestScript(this.testScript!.testScriptId)
                .subscribe((updatedTestScript) => {
                  this.testScript = updatedTestScript;
                  this.showEditForm = false;
                  this.checkEditPermissions();
                });
            }
          },
        error => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update test script',
            key: 'bc'
          });
        }
      );},
      reject: () => {
      }
  });}
  }

  deleteTestScript(): void {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to archive this test script?',
      accept: () => {
        if (this.testScript && this.testScript.testScriptId)
          this.testScriptService.archiveTestScript(this.testScript!.testScriptId).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Test script archived successfully',
              key: 'bc'
            });
          this.router.navigate(['/project', this.testScript!.projectId]); 
        },
        error => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to archive test script',
            key: 'bc'
          });
        }
      );},
      reject: () => {
      }
  });
  }
  unarchiveTestScript(): void {
    this.confirmationService.confirm({
      header: 'Confirm',
      message: 'Are you sure you want to unarchive this test script?',
      accept: () => {
        if (this.testScript && this.testScript.testScriptId)
          this.testScriptService.unarchiveTestScript(this.testScript!.testScriptId).subscribe(() => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Test script unarchived successfully',
              key: 'bc'
            });
          this.router.navigate(['/project', this.testScript!.projectId]); 
        },
        error => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to unarchive test script',
            key: 'bc'
          });
        }
      );},
      reject: () => {
      }
  });
  }

  startEditing(index: number): void {
    if (
      this.testScript!.statusTypeId !== 1 &&
      this.testScript!.statusTypeId !== 3
    ) 
    // {
    //   alert('This test script cannot be edited.');
    //   return;
    // }
    {this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'This test script cannot be edited.',
      key: 'bc'
    });}
    this.editingStepIndex = index;
    this.addingNewStepIndex = null;
    this.testStepsFormArray.at(index).enable();
  }

  saveTestStep(index: number): void {
    const updatedTestStep = this.testStepsFormArray.at(index).value;
    if (this.testStepsFormArray.at(index).invalid) {
      this.testStepsFormArray.at(index).markAllAsTouched();
      return;
    }
    console.log(updatedTestStep);
    this.confirmationService.confirm({
      header: 'Confirm Update',
      message: 'Are you sure you want to update this test step?',
      accept: () => {
        this.testScriptService.updateTestStep(updatedTestStep.testStepId, updatedTestStep).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Test step updated successfully',
              key: 'bc'
            });
            if (this.testScript!.testScriptId)
            this.loadTestSteps(this.testScript!.testScriptId);
            this.testStepData = {};
            this.editingStepIndex = null;
          },
          error => {
            console.log(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update test step',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
        }
    });
    // this.testScriptService
    //   .updateTestStep(updatedTestStep.testStepId, updatedTestStep)
    //   .subscribe(() => {
    //     if (this.testScript!.testScriptId) {
    //       this.loadTestSteps(this.testScript!.testScriptId);
    //       this.editingStepIndex = null;
    //       this.testStepData = {};
    //     }
    //   });
  }

  cancelEdit(): void {
    if (this.addingNewStepIndex !== null) {
      const newStep = this.testStepsFormArray.at(this.addingNewStepIndex).value;
      const hasData = Object.values(newStep).some(
        (value) => value !== null && value !== ''
      );

      if (hasData) {
          this.confirmationService.confirm({
            header: 'Unsaved Changes',
            message: 'You have unsaved changes. Do you really want to discard them?',
            accept: () => {
              if (this.addingNewStepIndex !== null) {
          this.testStepsFormArray.removeAt(this.addingNewStepIndex);
          this.addingNewStepIndex = null;
        }
      },
      reject: () => {
      }
    });
      } else {
        this.testStepsFormArray.removeAt(this.addingNewStepIndex);
        this.addingNewStepIndex = null;
      }
    }
    this.editingStepIndex = null;
    this.checkEditPermissions();
  }

  addNewTestStepRow(index: number): void {
    if (
      this.testScript!.statusTypeId !== 1 &&
      this.testScript!.statusTypeId !== 3
    ) 
    // {
    //   alert('This test script cannot be edited.');
    //   return;
    // }
    {this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'This test script cannot be edited.',
      key: 'bc'
    }); return;}
    this.addingNewStepIndex = index;
    const newTestStep = this.fb.group({
      testStepId: [null],
      testStepDescription: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      testStepRole: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
        ],
      ],
      testStepName: [
        '',
        [
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ],
      ],
      testData: [
        '',
        [
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(500),
        ],
      ],
      expectedOutcome: [
        '', 
        [
          Validators.required,
          Validators.minLength(3), 
          Validators.maxLength(500)
        ]],

      additionalInfo: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(500),
        ],
      ],
      feedback: ['', [ Validators.minLength(10), Validators.maxLength(500)]],
      stepResult: ['', [ Validators.minLength(10), Validators.maxLength(500)]],
    });

    this.testStepsFormArray.insert(index, newTestStep);
    this.editingStepIndex = index; // Start editing the new row
  }

  saveNewTestStep(index: number): void {
    const newTestStep = this.testStepsFormArray.at(index).value;
    if (this.testStepsFormArray.at(index).invalid) {
      this.testStepsFormArray.at(index).markAllAsTouched();
      return;
    }
      console.log('New Test Step Data:', newTestStep);
      const isValid = newTestStep.valid;
      console.log('Valid Step Data:', isValid);
      console.log(this.testScript?.testScriptId);

      this.confirmationService.confirm({
      header: 'Confirm Save',
      message: 'Are you sure you want to save this test step?',
      accept: () => {
        this.testScriptService.createTestStep(newTestStep, this.testScript?.testScriptId!).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Test step saved successfully',
              key: 'bc'
            });
            if (this.testScript!.testScriptId)
            this.loadTestSteps(this.testScript!.testScriptId);
            this.addingNewStepIndex = null;
            this.editingStepIndex = null;
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to save test step',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
        }
    });

  }

  deleteTestStep(index: number): void {
    if (
      this.testScript!.statusTypeId !== 1 &&
      this.testScript!.statusTypeId !== 3
    ) 
    // {
    //   alert('This test script cannot be edited.');
    //   return;
    // }
    {this.messageService.add({
      severity: 'error',
      summary: 'Error',
      detail: 'This test script cannot be edited.',
      key: 'bc'
    });}
    const testStepId = this.testStepsFormArray.at(index).value.testStepId;
    this.confirmationService.confirm({
      header: 'Confirm Delete',
      message: 'Are you sure you want to delete this test step?',
      accept: () => {
        this.testScriptService.removeTestStep(testStepId).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Test step delete successfully',
            key: 'bc'
          });
        this.testStepsFormArray.removeAt(index); // Remove the step from the form array'
        },
        error => {
          console.log(error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete test step',
            key: 'bc'
          });
        }
      );
    },
    reject: () => {
      }
    });
  }

loadTeams(testScript: TestScript): void {
    this.teamService.getTeams().subscribe((data: any) => {
      this.teams = data;
if(testScript.projectId){
      this.projectService.getProject(testScript.projectId).subscribe((proj)=>{
        this.teamId = proj.teamId;
        this.loadTeamMembers(this.teamId);
      })}
    });
  }

loadTheme(testScript: TestScript): void {
if(testScript.projectId){

      this.projectService.getProject(testScript.projectId).subscribe((proj)=>{
        var cId = proj.clientId;
        this.clientThemeId = cId;
      })};
  }
   //Get Client Themes
loadThemes(clientId: string) {
    this.themeService.getClientThemes(clientId).subscribe((data: any) => {
      this.themes = data;
    });
  //Load Theme Selection Modal
  this.showThemeModal = true;
  }

  //Get Logos 
  loadLogos(themeId: string) {
    this.themeService.getThemeFullById(themeId).subscribe((data: any) => {
      this.theme = data;
    });
    this.themeService.getFontById(this.theme.fontId).subscribe((font) => {
      this.font = font;
    })
    this.logoService.getThemeLogos(themeId).subscribe((logo: any) =>{
      this.logos = logo;
    })
  //Load Theme Selection Modal
  this.closeThemeList();
  this.showLogoModal = true;
  }

  //Get Colours
  loadColours(logoId: string) {
    if(this.theme.themeId)
    this.colourService.getThemeColourSchemes(this.theme.themeId).subscribe((data: any) => {
      this.colours = data;
    });
    this.logoService.getLogoById(logoId).subscribe((logo: any)=>{
      this.logo = logo
    })
  this.closeLogoList();
  this.showColoursModal = true;
  }

  finaliseTheme(colourId: string){
    // this.themeService.getCFullById(colourId).subscribe((data: any)=>
    // {
    //   this.Scolour = data;
    // })
    this.confirmationService.confirm({
      header: 'Confirm Apply Theme & Export',
      message: 'Are you sure you want to export this test script?',
      accept: () => {
        this.themeService.getCFullById(colourId).subscribe((data: any)=>
          {
            this.Scolour = data;
            this.messageService.add({
              severity: 'success',
              summary: 'Assigned',
              detail: 'Test script exported successfully using the selected theme',
              key: 'bc'
            });
            this.exportTs();
            this.closeColoursList();
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to export test script',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
      }
    });
  }

  closeThemeList(){
    this.showThemeModal = false;
  }
  closeLogoList(){
    this.showLogoModal = false;
  }
  closeColoursList(){
    this.showColoursModal = false;
  }
  // onTeamSelect(event: Event): void {
  //   const selectElement = event.target as HTMLSelectElement;
  //   this.selectedTeamId = String(selectElement.value);
  //   this.loadTeamMembers(this.selectedTeamId);
  // }


  openAssignTeamMemberModal(): void {
    this.teamService.getTeamMembers(this.teamId).subscribe((data: any) => {
      this.teamMembers = data;
      this.showAssignTeamMemberModal = true;
    });
  }

  closeAssignTeamMemberModal(): void {
    this.showAssignTeamMemberModal = false;
  }

  loadTeamMembers(teamId: string): void {
    this.teamService.getTeamMembers(teamId).subscribe((data: any) => {
      this.teamMembers = data;
    });
  }

  onMemberSelect(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.selectedMemberId = String(selectElement.value);
    console.log('Selected Team ID:', this.teamId);
    console.log('Selected Member ID:', this.selectedMemberId);
    console.log('Test Script:', this.testScript?.testScriptId);
    if (this.teamId) {
      this.assignTs(this.selectedMemberId, this.teamId);
    } else {
      console.error('Missing team ID or test script ID');
    }
  }

  


  assignTs(assignU: string, assignT: string): void {
    if (!this.selectTSId) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Test Script Selected',
        detail: 'Please select a test script before assigning.',
        key: 'bc'
      });
      return;
    }
  
    this.confirmationService.confirm({
      header: 'Confirm Assignment',
      message: 'Are you sure you want to assign this test script?',
      accept: () => {
        this.testScriptService.assign(assignU, this.testScript?.testScriptId!, assignT).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Assigned',
              detail: 'Test script assigned successfully',
              key: 'bc'
            });
            this.loadTestScriptDetails();
            location.reload();
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to assign test script',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
      }
    });
  }
  
  // signOff(): void {
  //   if (
  //     confirm('Are you sure you want to approve this test script?') &&
  //     this.testScript!.projectId
  //   ) {
  //     this.testScriptService
  //       .signOff(this.testScript!.projectId, 'Signed')
  //       .subscribe(() => {
  //         this.loadTestScriptDetails();
  //         location.reload();
  //       });
  //   }
  // }

  goBack(): void {
    this.router.navigate(['/project', this.testScript!.projectId]); 
  }

  checkEditPermissions(): void {
    const isEditable = this.testScript!.statusTypeId === 1 || 3;
    if (isEditable) {
      this.editForm.get('process')?.enable();
      this.editForm.get('test')?.enable();
      this.editForm.get('testScriptDescription')?.enable();
      this.testStepsFormArray.controls.forEach((control) => control.enable());
    } else {
      this.editForm.get('process')?.disable();
      this.editForm.get('test')?.disable();
      this.editForm.get('testScriptDescription')?.disable();
      this.testStepsFormArray.controls.forEach((control) => control.disable());
    }
  }
exportTs(): void{
const argbColor = this.hexToArgb(this.Scolour.colour);

  const workbook = new Workbook();
  const worksheet = workbook.addWorksheet(this.testScript!.test);
  const imagePath = 'assets/company-logo.png';
  const imageDimensions = { width: 150, height: 100 }; 
  const imageDimensions2 = { width: 443, height: 114 }; 
    this.http.get(imagePath, { responseType: 'blob' }).subscribe((imageBlob) => {
      const reader = new FileReader();
      reader.readAsDataURL(imageBlob);
      reader.onloadend = () => {
        const base64data = reader.result as string;   
        console.log(base64data);
        this.addImageToWorksheet2(workbook, worksheet, base64data, 'B1', imageDimensions2);
        ;}})
  this.addImageToWorksheet(workbook, worksheet, this.logo.logoImage, 'A1', imageDimensions);
  this.adjustCellSizeToImage(worksheet, 'A1', imageDimensions);
  this.adjustCellSizeToImage2(worksheet, 'B1', imageDimensions2);

   // Add header rows
    // worksheet.addRow(['Testing Results, details, screenshots, issues']);
    worksheet.addRow([]); // Empty row
    worksheet.addRow(['Process', this.testScript!.process]);
    worksheet.addRow(['Test', this.testScript!.test]);
    worksheet.addRow(['Description', this.testScript!.testScriptDescription]);
    worksheet.addRow([]); // Empty row
    var headerRow: any;
    if(this.testScript?.statusTypeId == 1 || this.testScript?.statusTypeId == 3 || this.testScript?.statusTypeId == 2){
    headerRow = worksheet.addRow([
      'Test Step',
      'Description of Test Step',
      'Role',
      'Data',
      'Expected Outcome',
      'Additional Information',
    ]);}
    else {
      headerRow = worksheet.addRow([
        'Test Step',
        'Description of Test Step',
        'Role',
        'Data',
        'Expected Outcome',
        'Additional Information',
        'Feedback',
        // 'Step Result'
      ]);}
    if (this.testScript!.testScriptId) {
      this.testScriptService
        .getAllSteps(this.testScript!.testScriptId)
        .subscribe(
          (testSteps: TestStep[]) => {
            if(this.testScript?.statusTypeId == 1 || this.testScript?.statusTypeId == 3 || this.testScript?.statusTypeId == 2){
            // Select specific attributes for each test step
            this.exportData = testSteps.map((step) => ({
              testStepName: step.testStepName,
              testStepDescription: step.testStepDescription,
              testStepRole: step.testStepRole,
              testData: step.testData,
              expectedOutcome: step.expectedOutcome,
              additionalInformation: step.additionalInfo,
            }));}
            else {
               // Select specific attributes for each test step
            this.exportData = testSteps.map((step) => ({
              testStepName: step.testStepName,
              testStepDescription: step.testStepDescription,
              testStepRole: step.testStepRole,
              testData: step.testData,
              expectedOutcome: step.expectedOutcome,
              additionalInformation: step.additionalInfo,
              feedback: step.feedback,
              // stepResult: step.stepResult,
            }));
            }

            // Add data rows
            // const headerRow = worksheet.addRow(Object.keys(this.exportData[0]));
            this.exportData.forEach((step: TestStep) => {
              worksheet.addRow(Object.values(step));
            });
            if (!worksheet.columns) {
              worksheet.columns = [];
              for (let i = 0; i < headerRow.cellCount; i++) {
                worksheet.columns.push({ key: `col${i}`, width: 10 });
              }
            }

            worksheet.columns.forEach((column, index) => {
              let maxLength = 0;
              worksheet.eachRow((row, rowNumber) => {
                const cell = row.getCell(index + 1); 
                const columnLength = cell.value
                  ? cell.value.toString().length
                  : 10;
                if (columnLength > maxLength) {
                  maxLength = columnLength;
                }
              });
              column.width = maxLength + 10; // Add some extra space
            });
            // Style header rows
            for (let i = 1; i <= 7; i++) {
              const row = worksheet.getRow(i);
              row.eachCell((cell) => {
                cell.font = {
                  name: this.font.fontName,
                  size: this.theme.fontSize,
                  color: { argb: '#000000' },
                  bold: true,
                };
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: argbColor },
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              });
            }

            // Style data rows
            for (let i = 8; i <= worksheet.rowCount; i++) {
              const row = worksheet.getRow(i);
              row.eachCell((cell) => {
                cell.font = {
                  name: this.font.fontName,
                  size: this.theme.fontSize,
                  color: { argb: '#000000' },
                };
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: argbColor },
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                  top: { style: 'thin', color: { argb: '#000000'} },
                  left: { style: 'thin', color: { argb: '#000000' } },
                  bottom: { style: 'thin', color: { argb: '#000000' } },
                  right: { style: 'thin', color: { argb: '#000000'} },
                };
              });
            }

            // Generate Excel file and save it
            workbook.xlsx.writeBuffer().then((buffer) => {
              const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              saveAs(blob, `TestScript_${this.getCurrentUTCDate()}.xlsx`);
            });
          },
          (error) => {
            console.error('Error fetching test steps:', error);
          }
        );
    }
}
 // Helper function to convert #RRGGBB to AARRGGBB (ARGB format)
 hexToArgb(hex: string): string {
  hex = hex.replace('#', '');
  return 'FF' + hex.toUpperCase();
}
private addImageToWorksheet(workbook: Workbook, worksheet: Worksheet, base64Image: string, cellAddress: string, imageDimensions2: { width: number, height: number }): void {
  const imageId = workbook.addImage({
    base64: base64Image,
    extension: 'png',
  });

  worksheet.addImage(imageId, {
    tl: { col: 0, row: 0 }, 
    ext: imageDimensions2,
    editAs: 'oneCell', 
  });
}

private adjustCellSizeToImage(worksheet: Worksheet, cellAddress: string, imageDimensions: { width: number, height: number }): void {
  const column = worksheet.getColumn(1); // Column A
  const row = worksheet.getRow(1); // Row 1
  column.width = imageDimensions.width / 8.5;
  row.height = imageDimensions.height * 0.95;

  worksheet.getCell(cellAddress).alignment = { vertical: 'middle', horizontal: 'center' };

}
private addImageToWorksheet2(workbook: Workbook, worksheet: Worksheet, base64Image: string, cellAddress: string, imageDimensions: { width: number, height: number }): void {
  const imageId = workbook.addImage({
    base64: base64Image,
    extension: 'png',
  });

  worksheet.addImage(imageId, {
    tl: { col: 1, row: 0 }, 
    ext: imageDimensions,
    editAs: 'oneCell', 
  });
}

private adjustCellSizeToImage2(worksheet: Worksheet, cellAddress: string, imageDimensions: { width: number, height: number }): void {
  const column = worksheet.getColumn(2); // Column B
  const row = worksheet.getRow(1); // Row 1
  column.width = imageDimensions.width / 8.5;
  row.height = imageDimensions.height * 0.95;

  worksheet.getCell(cellAddress).alignment = { vertical: 'middle', horizontal: 'center' };

}
  //Old Export
  exportTss(): void {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(this.testScript!.test);
    // Add header rows
    // worksheet.addRow(['Testing Results, details, screenshots, issues']);
    worksheet.addRow(['Process', this.testScript!.process]);
    worksheet.addRow(['Test', this.testScript!.test]);
    worksheet.addRow(['Description', this.testScript!.testScriptDescription]);
    worksheet.addRow([]); // Empty row
    // const headerRow = worksheet.addRow([
    //   'Test Step',
    //   'Description of Test Step',
    //   'Role',
    //   'Data',
    //   'Additional Information',
    // ]);
    var headerRow: any;
    if(this.testScript?.statusTypeId == 1 || this.testScript?.statusTypeId == 3 || this.testScript?.statusTypeId == 2){
    headerRow = worksheet.addRow([
      'Test Step',
      'Description of Test Step',
      'Role',
      'Data',
      'Expected Outcome',
      'Additional Information',
    ]);}
    else {
      headerRow = worksheet.addRow([
        'Test Step',
        'Description of Test Step',
        'Role',
        'Data',
        'Expected Outcome',
        'Additional Information',
        'Feedback',
        // 'Step Result'
      ]);}
    //get theme
    
    // // Add data rows
    // this.exportData.forEach((step: TestStep) => {
    //   worksheet.addRow([step.testStepName, step.testStepDescription,
    //     step.testStepRole, step.testData, step.additionalInfo]);
    // });
    if (this.testScript!.testScriptId) {
      this.testScriptService
        .getAllSteps(this.testScript!.testScriptId)
        .subscribe(
          (testSteps: TestStep[]) => {
            if(this.testScript?.statusTypeId == 1 || this.testScript?.statusTypeId == 3 || this.testScript?.statusTypeId == 2){
              // Select specific attributes for each test step
              this.exportData = testSteps.map((step) => ({
                testStepName: step.testStepName,
                testStepDescription: step.testStepDescription,
                testStepRole: step.testStepRole,
                testData: step.testData,
                expectedOutcome: step.expectedOutcome,
                additionalInformation: step.additionalInfo,
              }));}
              else {
                 // Select specific attributes for each test step
              this.exportData = testSteps.map((step) => ({
                testStepName: step.testStepName,
                testStepDescription: step.testStepDescription,
                testStepRole: step.testStepRole,
                testData: step.testData,
                expectedOutcome: step.expectedOutcome,
                additionalInformation: step.additionalInfo,
                feedback: step.feedback,
                // stepResult: step.stepResult,
              })
            );}
            // // console.log(this.exportData);
            // this.exportData.forEach((step: TestStep) => {
            //   if (step.stepResultId) {
            //     this.testScriptService.getStepResult(step.stepResultId).subscribe((stepResult) => {
            //         step.stepResult= stepResult.stepResultName;
            //     });
            //     console.log(step);
            //   }
            // });
            this.exportData.forEach((step: TestStep) => {
                worksheet.addRow(Object.values(step));
              //}
            });
    
            // Initialize columns if undefined
            if (!worksheet.columns) {
              worksheet.columns = [];
              for (let i = 0; i < headerRow.cellCount; i++) {
                worksheet.columns.push({ key: `col${i}`, width: 10 });
              }
            }

            // Calculate column widths based on the longest content in each column
            worksheet.columns.forEach((column, index) => {
              let maxLength = 0;
              worksheet.eachRow((row, rowNumber) => {
                const cell = row.getCell(index + 1); 
                const columnLength = cell.value
                  ? cell.value.toString().length
                  : 10;
                if (columnLength > maxLength) {
                  maxLength = columnLength;
                }
              });
              column.width = maxLength + 10; // Add some extra space
            });
            // Style header rows
            for (let i = 1; i <= 5; i++) {
              const row = worksheet.getRow(i);
              row.eachCell((cell) => {
                cell.font = {
                  name: 'Arial',
                  size: 12,
                  color: { argb: 'FFFFFFFF' },
                  bold: true,
                };
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: '869ec3' },
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
              });
            }

            // Style data rows
            for (let i = 6; i <= worksheet.rowCount; i++) {
              const row = worksheet.getRow(i);
              row.eachCell((cell) => {
                cell.font = {
                  name: 'Arial',
                  size: 11,
                  color: { argb: 'FF000000' },
                };
                cell.fill = {
                  type: 'pattern',
                  pattern: 'solid',
                  fgColor: { argb: 'cfd1d3' },
                };
                cell.alignment = { vertical: 'middle', horizontal: 'center' };
                cell.border = {
                  top: { style: 'thin', color: { argb: 'FF000000' } },
                  left: { style: 'thin', color: { argb: 'FF000000' } },
                  bottom: { style: 'thin', color: { argb: 'FF000000' } },
                  right: { style: 'thin', color: { argb: 'FF000000' } },
                };
              });
            }

            // Generate Excel file and save it
            workbook.xlsx.writeBuffer().then((buffer) => {
              const blob = new Blob([buffer], {
                type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
              });
              saveAs(blob, `TestScript_${this.getCurrentUTCDate()}.xlsx`);
            });
          },
          (error) => {
            console.error('Error fetching test steps:', error);
          }
        );
    }
  }
  private getCurrentUTCDate(): string {
    const currentDate = new Date();
    return `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth() + 1)
      .toString()
      .padStart(2, '0')}-${currentDate
      .getUTCDate()
      .toString()
      .padStart(2, '0')}`;
  }

  // Comments -------------------------
  user$: Observable<AuthUser | null>;
  users: AspUsers[] = [];
  filteredComments: Comment [] = [];

  getUsers(): void {
    this.userService.getUsers().subscribe((users) => (this.users = users));
  }


  loadComments(): void {
    this.commentsService.getComments().subscribe((comments) => {
      this.comments = comments.filter((x) => x.testScriptId == this.tsId);
      this.filteredComments = this.comments;
      this.logCommentForm = this.fb.group({
        commentTitle: ['', Validators.required],
        commentLine: ['', Validators.required],
      });

      this.editCommentForm = this.fb.group({
        commentTitle: ['', Validators.required],
        commentLine: ['', Validators.required],
      });
    });
  }

  onCommentSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredComments = this.comments.filter(
      (comment) =>
        comment.commentTitle.toLowerCase().includes(searchTerm) ||
      comment.commentLine.toLowerCase().includes(searchTerm) ||
      comment.userEmail.toLowerCase().includes(searchTerm) ||
        this.getCommentUser(comment).toLowerCase().includes(searchTerm)
    );
  }

  getCurrentUserEmail(): Observable<string | undefined> {
    return this.user$.pipe(map((user) => user?.email));
  }

  getCommentUser(comment: Comment) {
    var user = this.users.find((x) => x.userEmailAddress == comment.userEmail);
    return user?.userFirstName + ' ' + user?.userSurname
      ? user?.userFirstName + ' ' + user?.userSurname
      : 'Anonymous User';
  }

  toggleAddComment() {
    this.showAddCommentform = !this.showAddCommentform;
    this.showAddCommentButton = false;
    this.showEditCommentform = false;
    this.showCommentsList = false;
  }
  comment!: Comment;
  
  logComment() {
    // if (!this.isLoggedIn) {
    //   alert('Please log in to add a comment.');
    //   return;
    // }
    // else{
      if (this.logCommentForm.invalid) {
        //alert('Fill all required fields');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields', key: 'bc' });

        return;
      }
    
      const newComment: CommentViewModel = this.logCommentForm.value;
      newComment.mentions = this.commentMentions;
      newComment.testScriptId = this.tsId;
    
      console.log('New Comment:', newComment); // Log this to check
      console.log('Add comment button clicked');
      this.getCurrentUserEmail()
      .pipe(
        takeUntil(this.destroy$)).subscribe((email) => {
        if (email == null || email == undefined) {
          // alert('Cannot bind your user credentials to the comment.');
          return;
        } else {
          newComment.userEmail = email;
        }
    
        // Assign additional notification fields
        newComment.notificationTitle = newComment.commentTitle;
        newComment.message = newComment.commentLine;
        newComment.notificationTypeID = 1; // Example: Comment Mention type
        newComment.projectID = this.tsId; // Assuming this is available
    
        // Create the comment and send notifications
        this.commentsService.createComment(newComment) .pipe(
          takeUntil(this.destroy$)).subscribe(
          (createdComment) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Comment Logged successfully',
              key: 'bc',
            });
            this.logCommentForm.reset();
            // this.loadComments();
            // this.showAddCommentform = false;
            // this.showAddCommentButton = true;
            this.loadComments();
            this.showAddCommentform = false;
            this.showAddCommentButton = true;
            this.showCommentsList = true;
    
            if (this.commentMentions.length > 0) {
              this.commentMentions.forEach(mention => {
                mention.commentId = createdComment.commentId; 
              });
    
              this.commentsService.notifyMention(this.commentMentions).subscribe(
                () => {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Mentions notified successfully',
                    key: 'bc',
                  });
                  console.log('Mentions notified successfully');
                },
                (error) => {
                  this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to notify mentions:',
                    key: 'bc',
                  });
                  console.error('Failed to notify mentions:', error);
                }
              );
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to Create Status',
              key: 'bc',
            });
          }
        );
      });
   

  }

  invokeUpdateComment(Id: string) {
    this.commentsService.getCommentById(Id)
    .pipe(
      takeUntil(this.destroy$))
    .subscribe({
      next: (comment: Comment) => {
        this.editCommentForm.patchValue({
          commentTitle: comment.commentTitle,
          commentLine: comment.commentLine,
        });
        this.commentToUpdateId = comment.commentId;

        this.getCurrentUserEmail().subscribe((emmail) => {
          if (comment.userEmail !== emmail) {
            // alert('You do not have permission to modify this comment');
            return;
          }

          // Proceed if permissions are correct
          this.showEditCommentform = true;
          this.showAddCommentButton = false;
          this.showAddCommentform = false;
          this.showCommentsList = false;
        });
      },
      error: (error) => {
        console.error('Error fetching comment:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch comment details',
        });
      },
    });
  }

  confirmUpdateComment(): void {
    if (this.editCommentForm.invalid) {
      // alert('Fill all required fields');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields', key: 'bc' });

      return;
    }
    this.confirmationService.confirm({
      message: `Are you sure you want to Update Comment?`,
      header: 'Update Comment?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateComment();
      },
    });
  }

  updateComment() {
    if (this.editCommentForm.invalid) {
      // alert('Fill all required fields');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Please fill in all required fields', key: 'bc' });

      return;
    }
  
    this.getCurrentUserEmail() .pipe(
      takeUntil(this.destroy$)).subscribe((email) => {
      const commentToUpdate = this.comments.find(
        (x) => x.commentId === this.commentToUpdateId
      );
  
      if (commentToUpdate?.userEmail !== email) {
        // alert('You do not have permission to modify this comment');
        return;
      }
  
      const updatedComment: CommentViewModel = {
        ...this.editCommentForm.value, // Copy form values
        mentions: this.commentMentions, // Ensure mentions are included
        testScriptId: this.tsId, // Add test script ID
        userEmail: email, // Set the current user’s email
        notificationTitle: this.editCommentForm.value.commentTitle, // Notification title
        message: this.editCommentForm.value.commentLine, // Notification message
        notificationTypeID: 1, // Example: Comment Mention type
        projectID: this.tsId // Assuming this is available
      };
  
      console.log('Updated Comment:', updatedComment); // Log for debugging
  
      this.commentsService
        .updateComment(updatedComment, this.commentToUpdateId) .pipe(
          takeUntil(this.destroy$))
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Comment updated successfully',
              key: 'bc',
            });
            this.editCommentForm.reset();
            this.loadComments();
            this.showEditCommentform = false;
            this.showAddCommentButton = true;
            this.showAddCommentform = false;
            this.showCommentsList = true;
          },
          (error) => {
            console.error('Error updating comment:', error); // Log the error
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update comment',
              key: 'bc',
            });
          }
        );
    });
  }

  confirmDeleteComment(Id: string): void {
    var comment = this.comments.find((x) => x.commentId == Id);

    this.getCurrentUserEmail().subscribe((email) => {
      if (comment?.userEmail !== email) {
        // alert('You do not have permission to modify this comment');
        return;
      }
    });

    this.confirmationService.confirm({
      message: `Are you sure you want to Delete Comment?`,
      header: 'Delete Comment?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteComment(Id);
        this.loadComments();
      },
    });
  }
  
  // This will hold the mention details for the current comment
  commentMentions: CommentMentionVM[] = []; 
isPopupOpen: boolean = false; // Track if the popup is open

TrackerMethod1(event: any): void {
  const inputValue = event.target.value;
  const cursorPosition = event.target.selectionStart; 

  // Check if '@' is typed at the current cursor position and the popup is not already open
  if (inputValue.charAt(cursorPosition - 1) === '@' && !this.isPopupOpen) {
    this.openUserPopup(cursorPosition); 
  }

  if (this.detectBackspace(event)) {
    this.removeMention(inputValue);
  }
}

openUserPopup(cursorPosition: number): void {
  this.isPopupOpen = true;

  // Get the current user's email from your authentication or user service
  const currentUserEmail = this.getCurrentUserEmail();

  const dialogRef = this.dialog.open(UserPopupComponent, {
    width: '400px',
    data: {
      users: this.teamMembers,
      currentUserEmail: currentUserEmail // Pass the current user's email
    }
  });

  dialogRef.afterClosed().subscribe((selectedUser) => {
    if (selectedUser) {
      this.insertUserAtCursor(selectedUser, cursorPosition);
    }
    this.isPopupOpen = false; // Reset the flag when the popup is closed
  });
}

insertUserAtCursor(selectedUser: TeamMember, cursorPosition: number): void {
  const userName = `${selectedUser.userFirstName} ${selectedUser.userSurname}`;

  // Determine which form is active and get the appropriate commentLine control
  let commentControl = this.logCommentForm.get('commentLine');
  if (this.showEditCommentform) {
    commentControl = this.editCommentForm.get('commentLine');
  }

  if (commentControl && commentControl.value) {
    const currentText = commentControl.value;

    // Sanitize user name if necessary
    const sanitizedUserName = userName.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Handle out-of-bounds cursor position
    const newCursorPosition = Math.min(Math.max(0, cursorPosition), currentText.length);
    const newText = currentText.slice(0, newCursorPosition) + `${sanitizedUserName}` + currentText.slice(newCursorPosition);

    commentControl.setValue(newText);

    // Add mention details
    this.commentMentions.push({
      userEmail: selectedUser.userEmailAddress,
      commentId: this.tsId,
      userId: selectedUser.userId,
      comment: newText
    });
  }
}


detectBackspace(event: KeyboardEvent): boolean {
  return event.key === 'Backspace';
}

removeMentions(inputValue: string): void {
  const mentionRegex = /@\S+ \S+/g;
  const mentions = inputValue.match(mentionRegex);

  if (mentions) {
    mentions.forEach(mention => {
      const userEmail = mention.split(' ')[1];
      this.commentMentions = this.commentMentions.filter(m => m.userEmail !== userEmail);
    });
  }
}

onUserSelected(userEmail: string, testScriptId: string): void {
  const mention: CommentMentionVM = {
    userEmail: userEmail,
    commentId: testScriptId,
    userId: '',  
    comment: ''  
  };

  this.commentMentions.push(mention);

  console.log('User selected:', userEmail);
}

removeMention(userEmail: string): void {
  this.commentMentions = this.commentMentions.filter(
    (mention) => mention.userEmail !== userEmail
  );
  console.log('Mention removed for:', userEmail); 
}

    
  deleteComment(commentId: string) {
    var comment = this.comments.find((x) => x.commentId == commentId);

    this.getCurrentUserEmail().subscribe((email) => {
      if (comment?.userEmail !== email) {
        // alert('You do not have permission to modify this comment');
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You do not have permission to modify this comment!', key: 'bc' });

        return;
      }
    });

    this.commentsService.deleteComment(commentId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Comment Deleted successfully',
          key: 'bc',
        });
        this.loadComments();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to Delete comment',
          key: 'bc',
        });
      }
    );
  }

  cancelAddComment() {
    this.loadComments();
    this.showAddCommentform = false;
    this.showAddCommentButton = true;
    this.showCommentsList = true;
  }

  cancelUpdateComment() {
    this.loadComments();
    this.showEditCommentform = false;
    this.showAddCommentButton = true;
    this.showAddCommentform = false;
    this.showCommentsList = true;
  }

  clearComments() {
    this.logCommentForm.reset();
    this.comments = [];
    this.commentMentions = [];
  }

  
}

// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute, Router } from '@angular/router';
// import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
// import { TestScript } from '../../../../models/testscript/testscripts';
// import { TestStep } from '../../../../models/testscript/teststeps';
// import { Defect } from '../../../../models/testscript/defects';
// import { TestScriptsServices } from '../../../../services/testscripts/testscripts.services';
// import { DefectsServices } from '../../../../services/defects/defects.services';
// import { TestScriptAssignment } from '../../../../models/testscript/testscriptassignment';
// import { trigger, state, style, transition, animate } from '@angular/animations';
// import { CommonModule } from '@angular/common';
// import { Workbook, ImagePosition, Worksheet } from 'exceljs';
// import { saveAs } from 'file-saver';

// import { CommentsService } from '../../../../services/comments/comments.service';
// import { Comment } from '../../../../models/comment/comment.model';
// import { CommentViewModel } from '../../../../models/comment/comment.model';
// import { MessageService, ConfirmationService } from 'primeng/api';
// // import { NgbDatepickerModule, NgbOffcanvas, OffcanvasDismissReasons } from '@ng-bootstrap/ng-bootstrap';

// @Component({
//   selector: 'app-testscripts-update',
//   templateUrl: './testscripts-update.component.html',
//   styleUrl: './testscripts-update.component.scss',
//   animations: [
//     trigger('rotateChevron', [
//       state('true', style({ transform: 'rotate(180deg)' })),
//       state('false', style({ transform: 'rotate(0deg)' })),
//       transition('true <=> false', animate('300ms ease-in-out')),
//     ]),
//     trigger('toggleTable', [
//       transition(':enter', [
//         style({ opacity: 0, height: '0px' }),
//         animate('300ms ease-out', style({ opacity: 1, height: '*' })),
//       ]),
//       transition(':leave', [
//         style({ opacity: 1, height: '*' }),
//         animate('300ms ease-in', style({ opacity: 0, height: '0px' })),
//       ]),
//     ]),
//   ],
// })
// export class TestscriptsUpdateComponent {
//   testScript!: TestScript;
//   testScriptAssignment!: TestScriptAssignment;
//   editForm: FormGroup;
//   showEditForm: boolean = false;
//   editingStepIndex: number | null = null;
//   addingNewStepIndex: number | null = null;
//   testStepData: any = {};
//   showAddButtonIndex: number | null = null;
//   initialFormValue: any;
//   showDefects: boolean = false;
//   defects: Defect [] = [];
//   showModal: boolean = false;
//   logDefectForm!: FormGroup;
//   exportData : any = [];

//   comments: Comment[] = [];
//   logCommentForm!: FormGroup;
//   editCommentForm!: FormGroup;
//   commentToUpdateId!: string;
//   tsId!: string;
//   showAddCommentform = false;
//   showAddCommentButton = true;
//   showEditCommentform = false;
//   showCommentsList = true;

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     public testScriptService: TestScriptsServices,
//     public defectService: DefectsServices,
//     public fb: FormBuilder,

//     public commentsService: CommentsService,
//     public messageService: MessageService,
//     public confirmationService: ConfirmationService
//   ) {
//     this.editForm = this.fb.group({
//       process: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(10),
//           Validators.maxLength(30),
//         ],
//       ],
//       test: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(10),
//           Validators.maxLength(30),
//         ],
//       ],
//       testScriptDescription: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(10),
//           Validators.maxLength(150),
//         ],
//       ],
//       testSteps: this.fb.array([]),
//     });
//   }

//   ngOnInit(): void {
//     const testScriptId = this.route.snapshot.paramMap.get('testScriptId');
//     if (testScriptId) {
//       this.tsId = testScriptId;
//       this.testScriptService
//         .getTestScript(testScriptId)
//         .subscribe((testScript) => {
//           this.testScript = testScript;
//           this.loadTestScriptDetails();
//           this.loadTestSteps(testScriptId);
//           this.loadDefects(testScriptId);
//           this.initializeForm(testScriptId);
//         });
//     }
//     this.loadComments();
//   }

//   initializeForm(testScriptId: string): void {
//     this.logDefectForm = this.fb.group({
//       defectDescription: [
//         '',
//         [
//           Validators.required,
//           Validators.minLength(10),
//           Validators.maxLength(150),
//         ],
//       ],
//       testScriptId: [testScriptId],
//     });
//   }
//   loadTestScriptDetails(): void {
//     this.editForm.patchValue({
//       process: this.testScript.process,
//       test: this.testScript.test,
//       testScriptDescription: this.testScript.testScriptDescription

//     });
//     this.initialFormValue = this.editForm.value;
//   }

//   loadTestSteps(testScriptId: string): void {
//     this.testScriptService.getAllSteps(testScriptId).subscribe((testSteps) => {
//       this.setTestSteps(testSteps);
//       // this.exportData = testSteps;
//     });
//   }
//   loadDefects(testScriptId: string): void {
//     this.defectService.getDefects(testScriptId).subscribe((defects) => {
//       this.defects = defects;
//     });
//   }

//   openModal(): void {
//     this.showModal = true;
//   }

//   closeModal(): void {
//     this.showModal = false;
//   }
//   toggleShowDefects() {
//     this.showDefects = !this.showDefects;
//   }
//   getFormattedDate(date: any): string {
//     if (!date) {
//       return '';
//     }

//     const dateObj = new Date(date);
//     if (isNaN(dateObj.getTime())) {
//       return '';
//     }

//     const day = dateObj.getDate();
//     const month = dateObj.toLocaleString('default', { month: 'long' });
//     const year = dateObj.getFullYear();

//     return `${day} ${month} ${year}`;
//   }
//   logDefect(): void {
//     if (this.logDefectForm.invalid) {
//       this.logDefectForm.markAllAsTouched();
//       return;
//     }
//     const newDefect = this.logDefectForm.value;

//     this.defectService.logDefect(newDefect).subscribe ((defect) =>{
//       this.router.navigate(['/testscript-update', defect.testScriptId]);
//       this.closeModal();
//       location.reload();
//     })

//   }

//   deleteDefect(d: Defect): void {
//     if (confirm('Are you sure you want to delete this defect?') && d.defectId) {
//       this.defectService.removeDefect(d.defectId).subscribe(() => {
//         // this.router.navigate(['/testscript-update', this.testScript.testScriptId]);
//         location.reload();

//       });
//     }
//   }
//   get testStepsFormArray(): FormArray {
//     return this.editForm.get('testSteps') as FormArray;
//   }

//   setTestSteps(testSteps: TestStep[]): void {
//     const testStepFGs = testSteps.map(step => this.fb.group({
//       testStepId: [step.testStepId],
//       testStepDescription: [step.testStepDescription, [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       testStepRole: [step.testStepRole, [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
//       testStepName: [step.testStepName, [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       testData: [step.testData, [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
//       additionalInfo: [step.additionalInfo, [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       //feedback: [step.feedback, [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       //stepResult: [step.stepResult, [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       // stepOrder : [step.]
//     }));

//     const testStepFormArray = this.fb.array(testStepFGs);
//     this.editForm.setControl('testSteps', testStepFormArray);
//   }

//   toggleEditForm(): void {
//     this.showEditForm = !this.showEditForm;
//     if (this.showEditForm) {
//       this.loadTestScriptDetails(); // Load current values into form controls
//       this.checkEditPermissions();
//       this.ngOnInit();
//     }
//   }

//   saveTestScriptDetails(): void {
//     if (this.editForm.invalid) {
//       this.editForm.markAllAsTouched();
//       return;
//     }
//     if (
//       JSON.stringify(this.initialFormValue) ===
//       JSON.stringify(this.editForm.value)
//     ) {
//       if (confirm('No changes were made, would you like to stop editing?')) {
//         this.showEditForm = false;
//         return;
//       }
//     }
//     this.testScript = {
//       ...this.testScript,
//       ...this.editForm.value,
//     };
//     if (this.testScript.testScriptId) {
//       this.testScriptService
//         .updateTestScript(this.testScript.testScriptId, this.testScript)
//         .subscribe(() => {
//           if (this.testScript.testScriptId) {
//             this.testScriptService
//               .getTestScript(this.testScript.testScriptId)
//               .subscribe((updatedTestScript) => {
//                 this.testScript = updatedTestScript;
//                 this.showEditForm = false;
//                 this.checkEditPermissions();
//               });
//           }
//         });
//     }
//   }

//   deleteTestScript(): void {
//     if (
//       confirm('Are you sure you want to archive this test script?') &&
//       this.testScript.testScriptId
//     ) {
//       this.testScriptService
//         .archiveTestScript(this.testScript.testScriptId)
//         .subscribe(() => {
//           this.router.navigate(['/project', this.testScript.projectId]); // Navigate back to the  list or another appropriate route
//         });
//     }
//   }

//   // deleteTestScript(testscript: TestScript): void {
//   //   this.confirmationService.confirm({
//   //     header: 'Confirm Deletion',
//   //     message: 'Are you sure you want to archive this test script?',
//   //     accept: () => {
//   //       if (testscript.testScriptId){
//   //       this.testScriptService.removeTestStep(testscript.testScriptId).subscribe(() => {
//   //         this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Test Script archived successfully', key: 'bc' });
//   //         this.router.navigate(['/project', testscript.projectId]); // Navigate back to the  list or another appropriate route
//   //       }, error => {
//   //         this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to archive test script', key: 'bc' });
//   //       });}
//   //     },
//   //     reject: () => {
//   //       // Optional: Handle rejection if needed
//   //     }
//   //   });
//   // }
//   startEditing(index: number): void {
//     if (
//       this.testScript.statusTypeId !== 1 &&
//       this.testScript.statusTypeId !== 3
//     ) {
//       alert('This test script cannot be edited.');
//       return;
//     }
//     this.editingStepIndex = index;
//     this.addingNewStepIndex = null;
//     this.testStepsFormArray.at(index).enable();
//   }

//   saveTestStep(index: number): void {
//     const updatedTestStep = this.testStepsFormArray.at(index).value;
//     if (this.testStepsFormArray.at(index).invalid) {
//       this.testStepsFormArray.at(index).markAllAsTouched();
//       return;
//     }
//     this.testScriptService
//       .updateTestStep(updatedTestStep.testStepId, updatedTestStep)
//       .subscribe(() => {
//         if (this.testScript.testScriptId) {
//           this.loadTestSteps(this.testScript.testScriptId);
//           this.editingStepIndex = null;
//           this.testStepData = {};
//         }
//       });
//   }

//   cancelEdit(): void {
//     if (this.addingNewStepIndex !== null) {
//       const newStep = this.testStepsFormArray.at(this.addingNewStepIndex).value;
//       const hasData = Object.values(newStep).some(
//         (value) => value !== null && value !== ''
//       );

//       if (hasData) {
//         if (
//           confirm(
//             'You have unsaved changes. Do you really want to discard them?'
//           )
//         ) {
//           this.testStepsFormArray.removeAt(this.addingNewStepIndex);
//           this.addingNewStepIndex = null;
//         }
//       } else {
//         this.testStepsFormArray.removeAt(this.addingNewStepIndex);
//         this.addingNewStepIndex = null;
//       }
//     }
//     this.editingStepIndex = null;
//     this.checkEditPermissions();
//   }

//   addNewTestStepRow(index: number): void {
//     if (
//       this.testScript.statusTypeId !== 1 &&
//       this.testScript.statusTypeId !== 3
//     ) {
//       alert('This test script cannot be edited.');
//       return;
//     }
//     this.addingNewStepIndex = index;
//     const newTestStep = this.fb.group({
//       testStepId: [null],
//       testStepDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       testStepRole: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(15)]],
//       testStepName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       testData: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(15)]],
//       additionalInfo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       // feedback: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       // stepResult: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]],
//       });

//     this.testStepsFormArray.insert(index, newTestStep);
//     // this.updateStepOrder();
//     this.editingStepIndex = index; // Start editing the new row
//   }

//   saveNewTestStep(index: number): void {
//     const newTestStep = this.testStepsFormArray.at(index).value;
//     if (this.testStepsFormArray.at(index).invalid) {
//       this.testStepsFormArray.at(index).markAllAsTouched();
//       return;
//     }
//     if (this.testScript.testScriptId) {
//       this.testScriptService
//         .createTestStep(newTestStep, this.testScript.testScriptId)
//         .subscribe(() => {
//           if (this.testScript.testScriptId) {
//             this.loadTestSteps(this.testScript.testScriptId);
//             this.addingNewStepIndex = null;
//             this.editingStepIndex = null;
//           }
//         });
//     }
//   }

//   deleteTestStep(index: number): void {
//     if (
//       this.testScript.statusTypeId !== 1 &&
//       this.testScript.statusTypeId !== 3
//     ) {
//       alert('This test script cannot be edited.');
//       return;
//     }
//     const testStepId = this.testStepsFormArray.at(index).value.testStepId;
//     this.testScriptService.removeTestStep(testStepId).subscribe(() => {
//       this.testStepsFormArray.removeAt(index); // Remove the step from the form array
//       // this.updateStepOrder(); // Update the order of remaining steps
//     });
//   }

//   assignTs(): void {
//     if (confirm('Are you sure you want to assign this test script?')) {
//       // this.testScriptService.assignTestScript(this.testScript.testScriptId).subscribe(() => {
//       //   this.loadTestScriptDetails();
//       //   location.reload();
//       // });
//     }
//   }

//   signOff(): void {
//     if (confirm('Are you sure you want to approve this template?') && this.testScript.projectId) {
//       this.testScriptService.signOff(this.testScript.projectId, 'Signed').subscribe(() => {
//         this.loadTestScriptDetails();
//         location.reload();
//       });
//     }
//   }

//   goBack(): void {
//     this.router.navigate(['/project', this.testScript.projectId]); // Navigate back to the  list or another appropriate route
//   }

//   checkEditPermissions(): void {
//     const isEditable = this.testScript.statusTypeId === 1 || 2;
//     if (isEditable) {
//       this.editForm.get('process')?.enable();
//       this.editForm.get('test')?.enable();
//       this.editForm.get('testScriptDescription')?.enable();
//       this.testStepsFormArray.controls.forEach((control) => control.enable());
//     } else {
//       this.editForm.get('process')?.disable();
//       this.editForm.get('test')?.disable();
//       this.editForm.get('testScriptDescription')?.disable();
//       this.testStepsFormArray.controls.forEach((control) => control.disable());
//     }
//   }

//   //Export
//   exportTs(): void{

//     const workbook = new Workbook();
//     const worksheet = workbook.addWorksheet(this.testScript.test);
//     // Add header rows
//     // worksheet.addRow(['Testing Results, details, screenshots, issues']);
//     worksheet.addRow(['Process', this.testScript.process]);
//     worksheet.addRow(['Test', this.testScript.test]);
//     worksheet.addRow(['Description', this.testScript.testScriptDescription]);
//     worksheet.addRow([]); // Empty row
//     const headerRow = worksheet.addRow(['Test Step',  'Description of Test Step', 'Role', 'Data', 'Additional Information']);
//     // // Add data rows
//     // this.exportData.forEach((step: TestStep) => {
//     //   worksheet.addRow([step.testStepName, step.testStepDescription,
//     //     step.testStepRole, step.testData, step.additionalInfo]);
//     // });
//     if(this.testScript.testScriptId){
//       this.testScriptService.getAllSteps(this.testScript.testScriptId).subscribe(
//         (testSteps: TestStep[]) => {
//           // Select specific attributes for each test step
//           this.exportData = testSteps.map(step => ({
//             testStepName: step.testStepName,
//             testStepDescription: step.testStepDescription,
//             testStepRole: step.testStepRole,
//             testData: step.testData,
//             additionalInformation: step.additionalInfo
//           }));

//     // Add data rows
//     // const headerRow = worksheet.addRow(Object.keys(this.exportData[0]));
//     this.exportData.forEach((step: TestStep) => {
//       worksheet.addRow(Object.values(step));
//     });
//     // Initialize columns if undefined
//   if (!worksheet.columns) {
//     worksheet.columns = [];
//     for (let i = 0; i < headerRow.cellCount; i++) {
//       worksheet.columns.push({ key: `col${i}`, width: 10 });
//     }
//   }

// // Calculate column widths based on the longest content in each column
// worksheet.columns.forEach((column, index) => {
//   let maxLength = 0;
//   worksheet.eachRow((row, rowNumber) => {
//     const cell = row.getCell(index + 1); // getCell is 1-based index
//     const columnLength = cell.value ? cell.value.toString().length : 10;
//     if (columnLength > maxLength) {
//       maxLength = columnLength;
//     }
//   });
//   column.width = maxLength + 10; // Add some extra space
// });
//     // Style header rows
//     for (let i = 1; i <= 5; i++) {
//       const row = worksheet.getRow(i);
//       row.eachCell((cell) => {
//         cell.font = { name: 'Arial', size: 12, color: { argb: 'FFFFFFFF' }, bold: true };
//         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '869ec3' } };
//         cell.alignment = { vertical: 'middle', horizontal: 'center' };
//       });
//     }

//     // Style data rows
//     for (let i = 6; i <= worksheet.rowCount; i++) {
//       const row = worksheet.getRow(i);
//       row.eachCell((cell) => {
//         cell.font = { name: 'Arial', size: 11, color: { argb: 'FF000000' } };
//         cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'cfd1d3' } };
//         cell.alignment = { vertical: 'middle', horizontal: 'center' };
//         cell.border = {
//           top: { style: 'thin', color: { argb: 'FF000000' } },
//           left: { style: 'thin', color: { argb: 'FF000000' } },
//           bottom: { style: 'thin', color: { argb: 'FF000000' } },
//           right: { style: 'thin', color: { argb: 'FF000000' } },
//         };
//       });
//     }

//     // Generate Excel file and save it
//     workbook.xlsx.writeBuffer().then((buffer) => {
//       const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
//       saveAs(blob, `TestScript_${this.getCurrentUTCDate()}.xlsx`);
//     });
//   },
//   (error) => {
//     console.error('Error fetching test steps:', error);
//   });
// }}
//   private getCurrentUTCDate(): string {
//     const currentDate = new Date();
//     return `${currentDate.getUTCFullYear()}-${(currentDate.getUTCMonth() + 1).toString().padStart(2, '0')}-${currentDate.getUTCDate().toString().padStart(2, '0')}`;
//   }

//   loadComments(): void {
//     this.commentsService.getComments().subscribe((comments) => {
//       this.comments = comments.filter(x=>x.testScriptId==this.tsId);

//       this.logCommentForm = this.fb.group({
//         commentTitle: ['', Validators.required],
//         commentLine: ['', Validators.required],
//       });

//       this.editCommentForm = this.fb.group({
//         commentTitle: ['', Validators.required],
//         commentLine: ['', Validators.required],
//       });
//     });
//   }

//   toggleAddComment() {
//     this.showAddCommentform = !this.showAddCommentform;
//     this.showAddCommentButton = false;
//     this.showEditCommentform = false;
//   }

//   logComment() {
//     if (this.logCommentForm.invalid) {
//       alert('Fill all required fields');
//       return;
//     }

//     const newComment: CommentViewModel = this.logCommentForm.value;
//     newComment.testScriptId = this.tsId; // Fix: Corrected the assignment statement

//     this.commentsService.createComment(newComment).subscribe(
//       () => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'Comment Logged successfully',
//           key: 'bc',
//         });
//         this.logCommentForm.reset();
//         this.loadComments();
//         this.showAddCommentform = false;
//         this.showAddCommentButton = true;
//       },
//       (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to Create Status',
//           key: 'bc',
//         });
//       }
//     );
//   }

//   invokeUpdateComment(Id: string) {
//     this.commentsService.getCommentById(Id).subscribe({
//       next: (comment: Comment) => {
//         this.editCommentForm.patchValue({
//           commentTitle: comment.commentTitle,
//           commentLine: comment.commentLine,
//         });
//         this.commentToUpdateId = comment.commentId;
//       },
//       error: (error) => {
//         console.error('Error fetching comment:', error);
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to fetch comment details',
//         });
//       },
//     });
//     this.showEditCommentform = true;
//     this.showAddCommentButton = false;
//     this.showAddCommentform = false;
//     this.showCommentsList = false;
//   }

//   confirmUpdateComment(): void {
//     if (this.editCommentForm.invalid) {
//       alert('Fill all required fields');
//       return;
//     }
//     this.confirmationService.confirm({
//       message: `Are you sure you want to Update Comment?`,
//       header: 'Update Comment?',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//         this.updateComment();
//       },
//     });
//   }

//   updateComment() {
//     if (this.editCommentForm.invalid) {
//       alert('Fill all required fields');
//       return;
//     }
//     const updatedComment: CommentViewModel = {
//       ...this.editCommentForm.value,
//     };
//     updatedComment.testScriptId = this.tsId;
//     console.log('Updated Comment:', updatedComment); // Add this line
//     this.commentsService
//       .updateComment(updatedComment, this.commentToUpdateId)
//       .subscribe(
//         () => {
//           this.messageService.add({
//             severity: 'success',
//             summary: 'Success',
//             detail: 'comment Updated successfully',
//             key: 'bc',
//           });
//           this.editCommentForm.reset();
//           this.loadComments();
//           this.showEditCommentform = false;
//           this.showAddCommentButton = true;
//           this.showAddCommentform = false;
//           this.showCommentsList = true;
//         },
//         (error) => {
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: 'Failed to Update Comment',
//             key: 'bc',
//           });
//         }
//       );
//   }

//   confirmDeleteComment(Id: string): void {
//     this.confirmationService.confirm({
//       message: `Are you sure you want to Delete Comment?`,
//       header: 'Delete Comment?',
//       icon: 'pi pi-exclamation-triangle',
//       accept: () => {
//         this.deleteComment(Id);
//       },
//     });
//   }

//   deleteComment(commentId: string) {
//     this.commentsService.deleteComment(commentId).subscribe(
//       () => {
//         this.messageService.add({
//           severity: 'success',
//           summary: 'Success',
//           detail: 'Comment Deleted successfully',
//           key: 'bc',
//         });
//         this.loadComments();
//       },
//       (error) => {
//         this.messageService.add({
//           severity: 'error',
//           summary: 'Error',
//           detail: 'Failed to Delete comment',
//           key: 'bc',
//         });
//       }
//     );
//   }

//   cancelAddComment() {
//     this.showAddCommentform = false;
//     this.showAddCommentButton = true;
//   }

//   cancelUpdateComment() {
//     this.showEditCommentform = false;
//     this.showAddCommentButton = true;
//     this.showAddCommentform = false;
//     this.showCommentsList = true;
//   }
// }
