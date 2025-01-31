import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ProjectsService } from '../../../services/projects/projects.service';
import { Project } from '../../../models/project';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {

  projectForm = new FormGroup({
    projectName: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(30)]),
    startDate: new FormControl('', [Validators.required, this.startDateValidator.bind(this)]),
    endDate: new FormControl('', [Validators.required, this.endDateValidator.bind(this)]),
    projectDescription: new FormControl('', [Validators.required, Validators.minLength(30), Validators.maxLength(150)]),
    clientId: new FormControl('', Validators.required)
  });
  project: Project | undefined;
  originalStartDate: Date | undefined;

  constructor(
    private route: ActivatedRoute,
    private router: Router,    
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private projectsService: ProjectsService
  ) { }

  ngOnInit(): void {
    const projectId = this.route.snapshot.params['projectId'];
    this.projectsService.getProject(projectId).subscribe(result => {
      this.project = result;
      if (this.project && this.project.startDate) {
        this.originalStartDate = new Date(this.project.startDate); 
      }
      this.projectForm.patchValue({
        projectName: this.project?.projectName || '',
        startDate: this.project?.startDate ? this.formatDate(this.project.startDate) : '',
        endDate: this.project?.endDate ? this.formatDate(this.project.endDate) : '',
        projectDescription: this.project?.projectDescription || '',
        clientId: this.project?.clientId.toString() || ''
      });
    });
  }

  private formatDate(date: Date): string {
    const d = new Date(date);
    const month = '' + (d.getMonth() + 1);
    const day = '' + d.getDate();
    const year = d.getFullYear();

    return [year, month.padStart(2, '0'), day.padStart(2, '0')].join('-');
  }

  // cancel() {
  //   this.router.navigate(['/project', this.project!.projectId]);
  // }

  cancel(): void {
    this.confirmationService.confirm({
      header: 'Cancel',
      message: 'Are you sure you want to cancel? All unsaved changes will be lost.',
      accept: () => {
        this.router.navigate(['/project', this.project!.projectId]);
      }
    });
  }

  

  onSubmit(): void {
    if (this.projectForm.invalid) {
      this.projectForm.markAllAsTouched();
      return;
    }
  
    if (!this.project) {
      return;
    }
  
    const projectFormValue = this.projectForm.value;
    const projectData: Partial<Project> = {
      projectName: projectFormValue.projectName || this.project.projectName,
      startDate: projectFormValue.startDate ? new Date(projectFormValue.startDate) : this.project.startDate,
      endDate: projectFormValue.endDate ? new Date(projectFormValue.endDate) : this.project.endDate,
      projectDescription: projectFormValue.projectDescription || this.project.projectDescription,
      clientId: projectFormValue.clientId || undefined
    };
  
    this.confirmationService.confirm({
      header: 'Confirm Update',
      message: 'Are you sure you want to update this project?',
      accept: () => {
        this.projectsService.editProject(this.project!.projectId, projectData).subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Updated',
              detail: 'Project updated successfully',
              key: 'bc'
            });
            this.router.navigate(['/project', this.project!.projectId]);
          },
          error => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update project',
              key: 'bc'
            });
          }
        );
      },
      reject: () => {
        
      }
    });
  }

  startDateValidator(control: FormControl): { [key: string]: boolean } | null {
    if (!control.value) {
      return null;
    }
    const startDate = new Date(control.value);
    if (this.originalStartDate && startDate < this.originalStartDate) {
      return { 'originalStartDateInvalid': true };
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
}
