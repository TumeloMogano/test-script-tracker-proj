import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { StatusType } from '../../../models/status/status.model';
import { Project } from '../../../models/project';
import { StatusService } from '../../../services/statuses/status.service';
import { ProjectsService } from '../../../services/projects/projects.service';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { StatusViewModel } from '../../../models/status/statustype.model';

@Component({
  selector: 'app-add-status',
  templateUrl: './add-status.component.html',
  styleUrl: './add-status.component.scss',
})
export class AddStatusComponent implements OnInit {
  createStatusForm: FormGroup;
  projectControl = new FormControl();
  statusTypes: StatusType[] = [];
  projects: Project[] = [];
  filteredProjects!: Observable<Project[]>;
  selectedProjectName: string | null = null;

  constructor(
    private statusService: StatusService,
    private projectService: ProjectsService,
    public router: Router,
    private confimationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.createStatusForm = this.formBuilder.group({
      statusName: ['', Validators.required],
      statusDescription: ['', Validators.required],
      statusTypeId: [null, Validators.required],
      projectId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadStatusTypes();
    this.loadProjects();
    this.filteredProjects = this.projectControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filterProjects(value))
    );
  }

  private _filterProjects(value: string): Project[] {
    const filterValue = value.toLowerCase();
    return this.projects.filter((project) =>
      project.projectName.toLowerCase().includes(filterValue)
    );
  }

  loadStatusTypes(): void {
    this.statusService.getStatusTypes().subscribe((data: StatusType[]) => {
      this.statusTypes = data;
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe((data: Project[]) => {
      this.projects = data;
    });
  }

  onProjectSelected(projectId: string): void {
    // Set the projectId in the form control
    this.createStatusForm.patchValue({ projectId });

    // Subscribe to filteredProjects to access the project list
    this.filteredProjects.subscribe((projects) => {
      const selectedProject = projects.find((p) => p.projectId === projectId);
      this.selectedProjectName = selectedProject
        ? selectedProject.projectName
        : null;
    });
  }

  addStatus(): void {
    if (this.createStatusForm.valid) {
      const newStatus: StatusViewModel = this.createStatusForm.value;
  
      this.statusService.createStatus(newStatus).subscribe(
        () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Status Created successfully',
            key: 'bc',
          });
          this.createStatusForm.reset();
  
          // Redirect and then refresh the system page
          this.router.navigateByUrl('/system', { skipLocationChange: true }).then(() => {
            this.router.navigate(['/system']);
          });
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
    } else {
      this.createStatusForm.markAllAsTouched();
    }
  }
  

  cancelAddStatus() {
    this.router.navigate(['/system']);
  }

  cancel(): void {
    this.confimationService.confirm({
      message: 'Are you sure you want to cancel?',
      header: 'Cancel?',
      accept: () => {
        this.router.navigate(['/system']);
      }
    });
  }

  get f() {
    return this.createStatusForm.controls;
  }
}
