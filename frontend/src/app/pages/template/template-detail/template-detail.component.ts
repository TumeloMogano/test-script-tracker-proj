import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TemplateService } from '../../../services/template/template.service';
import { Template, TemplateTestStep } from '../../../models/template/template.model';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';

import * as bootstrap from 'bootstrap';
import { PermissionsService } from '../../../services/auth/permissions.service';
import { Permissions } from '../../../models/permissions.enums';

@Component({
  selector: 'app-template-detail',
  templateUrl: './template-detail.component.html',
  styleUrls: ['./template-detail.component.scss']
})
export class TemplateDetailComponent implements OnInit, AfterViewChecked {
  template!: Template;
  editForm: FormGroup;
  showEditForm: boolean = false;
  editingStepIndex: number | null = null;
  addingNewStepIndex: number | null = null;
  tempStepData: any = {};
  showAddButtonIndex: number | null = null;
  initialFormValue: any;
  initialTestSteps: any[] = [];
  displayRejectDialog: boolean = false;
  feedback: string = '';
  isEditedStep: boolean = false;
  numTestSteps: number = 0;
  Permissions = Permissions;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public templateService: TemplateService,    
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private permissionService: PermissionsService,
    public fb: FormBuilder
  ) {
    this.editForm = this.fb.group({
      templateName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      templateTest: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      templateDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],
      testSteps: this.fb.array([])
    });
  }

  ngOnInit(): void {
    const templateId = this.route.snapshot.paramMap.get('templateId');
    if (templateId) {
      this.templateService.getTemplateById(templateId).subscribe((template) => {
        this.template = template;       
        this.loadTemplateDetails();
        this.loadTestSteps(template.templateId);
        
      });
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

  /* Permissions check method */
  hasPermission(requiredPermission: Permissions): boolean {
    return this.permissionService.hasPermission(requiredPermission);
  }




  loadTemplateDetails(): void {
    this.editForm.patchValue({
      templateName: this.template.templateName,
      templateTest: this.template.templateTest,
      templateDescription: this.template.templateDescription
    });
    this.initialFormValue = this.editForm.value;
  }

  loadTestSteps(templateId: string): void {
    this.templateService.getTemplateTestSteps(templateId).subscribe((testSteps) => {
      this.setTestSteps(testSteps);
      this.numTestSteps = testSteps.length;
    });
  }

  get testStepsFormArray(): FormArray {
    return this.editForm.get('testSteps') as FormArray;
  }

  setTestSteps(testSteps: TemplateTestStep[]): void {
    const testStepFGs = testSteps.map(step => this.fb.group({
      tempTestStepId: [step.tempTestStepId],
      tempTestStepDescription: [step.tempTestStepDescription, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      tempTestStepRole: [step.tempTestStepRole, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      tempTestStep: [step.tempTestStep, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      tempTestStepData: [step.tempTestStepData, [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      tempAdditionalInfo: [step.tempAdditionalInfo, [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    }));
    const testStepFormArray = this.fb.array(testStepFGs);
    this.editForm.setControl('testSteps', testStepFormArray);
    this.initialTestSteps = this.testStepsFormArray.value;
  }

  toggleEditForm(): void {
    this.showEditForm = !this.showEditForm;
    if (this.showEditForm) {
      this.loadTemplateDetails();
      this.checkEditPermissions();
    }
  }


  saveTemplateDetails(): void {
    if (this.editForm.invalid) {
      this.editForm.markAllAsTouched();
      return;
    }
  
    if (JSON.stringify(this.initialFormValue) === JSON.stringify(this.editForm.value)) {
      this.confirmationService.confirm({
        header: 'No Changes Detected',
        message: 'No changes were made. Would you like to stop editing?',
        accept: () => {
          this.showEditForm = false;
        },
        reject: () => {
        }
      });
      return;
    }
  
    this.confirmationService.confirm({
      header: 'Confirm Save',
      message: 'Do you want to save the changes?',
      accept: () => {
        this.template = {
          ...this.template,
          ...this.editForm.value
        };
  
        this.templateService.updateTemplate(this.template.templateId, this.template).subscribe(() => {
          this.templateService.getTemplateById(this.template.templateId).subscribe((updatedTemplate) => {
            this.template = updatedTemplate;
            this.showEditForm = false;
            this.checkEditPermissions();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Template updated successfully', key: 'bc' });
          });
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update template', key: 'bc' });
        });
      },
      reject: () => {
      }
    });
  }


  deleteTemplate(): void {
    this.confirmationService.confirm({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this template? This will delete the linked template test steps as well.',
      accept: () => {
        this.templateService.removeTemplate(this.template.templateId).subscribe(() => {
          this.messageService.add({ severity: 'success', summary: 'Deleted', detail: 'Template deleted successfully', key: 'bc' });
          this.router.navigate(['/template-list']);
        }, error => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete template', key: 'bc' });
        });
      },
      reject: () => {
      }
    });
  }

  cancelTemplateEdit(): void {
    this.confirmationService.confirm({
      header: 'Cancel',
      message: 'Are you sure you want to cancel? All unsaved changes will be lost.',
      accept: () => {
        this.showEditForm = false;
        this.toggleEditForm;
      },
      reject: () => {
      }
    });
  }
  

  startEditing(index: number): void {
    if (this.template.tempStatusId !== 1) {
      alert('This template cannot be edited.');
      return;
    }
    this.editingStepIndex = index;
    this.addingNewStepIndex = null;
    this.testStepsFormArray.at(index).enable();
  }


  saveTestStep(index: number): void {
    const updatedTestStep = this.testStepsFormArray.at(index).value;
    const originalTestStep = this.initialTestSteps[index];
  
    if (this.testStepsFormArray.at(index).invalid) {
      this.testStepsFormArray.at(index).markAllAsTouched();
      return;
    }
  
    const changesMade = JSON.stringify(updatedTestStep) !== JSON.stringify(originalTestStep);
  
    if (!changesMade) {
      this.messageService.add({
        severity: 'info',
        summary: 'No Changes',
        detail: 'No changes were made.',
        key: 'bc'
      });
      this.editingStepIndex = null;
      return;
    }
  
    this.confirmAndSave(updatedTestStep, index);
  }



  saveNewTestStep(index: number): void {
    const newTestStep = this.testStepsFormArray.at(index).value;
  
    if (this.testStepsFormArray.at(index).invalid) {
      this.testStepsFormArray.at(index).markAllAsTouched();
      return;
    }
  
    this.confirmationService.confirm({
      header: 'Confirm Save',
      message: 'Are you sure you want to save this test step?',
      accept: () => {
        this.templateService.addTemplateTestStep(this.template.templateId, newTestStep).subscribe(
          () => {
            window.location.reload();
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Test step saved successfully',
              key: 'bc'
            });
            this.loadTestSteps(this.template.templateId);
            this.addingNewStepIndex = null;
            this.editingStepIndex = null;
          },
          error => {
            window.location.reload();
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

  confirmAndSave(updatedTestStep: any, index: number): void {
    this.confirmationService.confirm({
      header: 'Confirm Save',
      message: 'Are you sure you want to save changes to this test step?',
      accept: () => {
        this.templateService.updateTemplateTestStep(updatedTestStep.tempTestStepId, updatedTestStep).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Test step saved successfully',
              key: 'bc'
            });
            this.loadTestSteps(this.template.templateId);
            this.editingStepIndex = null;
            this.tempStepData = {};
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

  cancelEdit(): void {
    if (this.addingNewStepIndex !== null) {
      const newStep = this.testStepsFormArray.at(this.addingNewStepIndex).value;
      const hasData = Object.values(newStep).some(value => value !== null && value !== '');
  
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
    } else {
      this.editingStepIndex = null;
    }
  }


  addNewTestStepRow(index: number): void {
    if (this.template.tempStatusId !== 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'This template cannot be edited.',
        key: 'bc'
      });
      return;
    }
  
    this.addingNewStepIndex = index;
    const newTestStep = this.fb.group({
      tempTestStepId: [null],
      tempTestStepDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      tempTestStepRole: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      tempTestStep: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      tempTestStepData: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
      tempAdditionalInfo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
    });
    this.testStepsFormArray.insert(index, newTestStep);

    this.editingStepIndex = index;
  }
  
  

  deleteTestStep(index: number): void {
    if (this.template.tempStatusId !== 1) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'This template cannot be edited.',
        key: 'bc'
      });
      return;
    }
  
    this.confirmationService.confirm({
      header: 'Confirm Deletion',
      message: 'Are you sure you want to delete this test step?',
      accept: () => {
        const testStepId = this.testStepsFormArray.at(index).value.tempTestStepId;
        this.templateService.removeTemplateTestStep(testStepId).subscribe(
          () => {
            this.testStepsFormArray.removeAt(index); 
            this.messageService.add({
              severity: 'success',
              summary: 'Deleted',
              detail: 'Test step deleted successfully',
              key: 'bc'
            });
          },
          error => {
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


  submitTemplate(): void {
    if(this.numTestSteps > 0)
    {
      this.confirmationService.confirm({
        header: 'Confirm Submission',
        message: 'Are you sure you want to submit this template for review?',
        accept: () => {
          this.templateService.submitTemplate(this.template.templateId, this.template).subscribe(
            () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Submitted',
                detail: 'Template submitted successfully for review',
                key: 'bc'
              });
              this.loadTemplateDetails();
              location.reload();
            },
            error => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to submit template',
                key: 'bc'
              });
            }
          );
        },
        reject: () => {
        }
      });
    }
    else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'There are NO test steps in this template, please add test steps before you can submit!',
        key: 'bc'
      });    }
  }
  

  approveTemplate(): void {
    this.confirmationService.confirm({
      header: 'Confirm Approval',
      message: 'Are you sure you want to approve this template?',
      accept: () => {
        this.templateService.approveTemplate(this.template.templateId, this.template).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Approved',
              detail: 'Template approved successfully',
              key: 'bc'
            });
            this.loadTemplateDetails();
            location.reload();
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to approve template',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
      }
    });
  }
  

  rejectTemplate(): void {
    this.displayRejectDialog = true;
  }

  confirmRejection(): void {
    this.confirmationService.confirm({
      header: 'Confirm Rejection',
      message: 'Are you sure you want to reject this template?',
      accept: () => {
        this.template.feedback = this.feedback;
        this.templateService.rejectTemplate(this.template.templateId, this.template).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Rejected',
              detail: 'Template rejected successfully',
              key: 'bc'
            });
            this.loadTemplateDetails();
            location.reload();
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to reject template',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
        this.displayRejectDialog = false; 
      }
    });
  }

  acknowledgeRejection(): void {
    this.confirmationService.confirm({
      header: 'Confirm Acknowledgment',
      message: 'Are you sure you want to acknowledge the rejection?',
      accept: () => {
        this.templateService.acknowledgeRejection(this.template.templateId, this.template).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Acknowledged',
              detail: 'Rejection acknowledged successfully',
              key: 'bc'
            });
            this.loadTemplateDetails();
            location.reload(); 
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to acknowledge rejection',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
      }
    });
  }


  reDraftTemplate(): void {
    this.confirmationService.confirm({
      header: 'Confirm Re-Draft',
      message: 'Are you sure you want to re-draft this template?',
      accept: () => {
        this.templateService.reDraftTemplate(this.template.templateId, this.template).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Re-Drafted',
              detail: 'Template re-drafted successfully',
              key: 'bc'
            });
            this.loadTemplateDetails();
            location.reload(); 
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to re-draft template',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
      }
    });
  }


  copyTemplate(): void {
    this.confirmationService.confirm({
      header: 'Confirm Copy',
      message: 'Are you sure you want to copy this template?',
      accept: () => {
        this.templateService.copyTemplate(this.template.templateId).subscribe(
          (newTemplate) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Copied',
              detail: 'Template copied successfully',
              key: 'bc'
            });
            this.router.navigate(['/template-detail', newTemplate.templateId]);
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to copy template',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
      }
    });
  }
  

  goBack(): void {
    this.router.navigate(['/template-list']);
  }

  checkEditPermissions(): void {
    const isEditable = this.template.tempStatusId === 1;
    if (isEditable) {
      this.editForm.get('templateName')?.enable();
      this.editForm.get('templateTest')?.enable();
      this.editForm.get('templateDescription')?.enable();
      this.testStepsFormArray.controls.forEach(control => control.enable());
    } else {
      this.editForm.get('templateName')?.disable();
      this.editForm.get('templateTest')?.disable();
      this.editForm.get('templateDescription')?.disable();
      this.testStepsFormArray.controls.forEach(control => control.disable());
    }
  }

  
}


