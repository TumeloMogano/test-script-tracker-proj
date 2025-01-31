import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { StatusType } from '../../../models/status/status.model';
import { TagType } from '../../../models/tag/tagtype.model';
import {
  Status,
  StatusViewModel,
} from '../../../models/status/statustype.model';
import { Tag, TagViewModel } from '../../../models/tag/tag.model';
import { StatusService } from '../../../services/statuses/status.service';
import { TagService } from '../../../services/tags/tag.service';
import { ProjectsService } from '../../../services/projects/projects.service';
import { Project } from '../../../models/project';
import { Alert } from 'bootstrap';

@Component({
  selector: 'app-edit-status',
  templateUrl: './edit-status.component.html',
  styleUrl: './edit-status.component.scss',
})
export class EditStatusComponent implements OnInit {
  editStatusForm: FormGroup;
  statusTypes: StatusType[] = [];
  projects: Project[] = [];
  statusToUpdate: Status | null = null;
  statuses: Status[] = [];

  constructor(
    private statusService: StatusService,
    private projectService: ProjectsService,
    private tagService: TagService,
    public router: Router,
    private confimationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute
  ) {
    //STATUS -----------------------
    this.editStatusForm = this.formBuilder.group({
      statusName: ['', Validators.required],
      statusDescription: ['', Validators.required],
      statusTypeId: [null, Validators.required],
      projectId: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    const statusId = this.route.snapshot.paramMap.get('statusId')!;
    this.loadStatusTypes();
    this.loadProjects();
    this.loadStatuses();
    this.loadStatus(statusId);
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

  loadStatuses(): void {
    this.statusService.getStatuses().subscribe((data: Status[]) => {
      this.statuses = data;
    });
  }

  loadStatus(Id: string): void {
    this.statusService.getStatusById(Id).subscribe({
      next: (status: Status) => {
        this.statusToUpdate = status;
        this.editStatusForm.patchValue({
          statusName: status.statusName,
          statusDescription: status.statusDescription,
          statusTypeId: status.statusTypeId,
          projectId: status.projectId,
        });
      },
      error: (error) => {
        console.error('Error fetching status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch status details',
        });
      },
    });
  }

  confirmUpdate(): void {
    this.confimationService.confirm({
      message: `Are you sure you want to update the status: ${this.statusToUpdate?.statusName}?`,
      header: 'Update Status ?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateStatus();
      },
    });
  }

  updateStatus() {
    if (this.editStatusForm.valid && this.statusToUpdate) {
      const updatedStatus: StatusViewModel = this.editStatusForm.value;

      this.statusService
        .updateStatus(updatedStatus, this.statusToUpdate.statusId)
        .subscribe(
          () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Status Updated successfully',
              key: 'bc',
            });
            this.editStatusForm.reset();
            this.router.navigate(['/system']);
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to Update Status',
              key: 'bc',
            });
          }
        );
    } else {
      this.editStatusForm.markAllAsTouched();
    }
  }

  get editF() {
    return this.editStatusForm.controls;
  }

  cancelEditStatus(): void {
    this.router.navigate(['/system']);
  }

  cancel(): void {
    this.confimationService.confirm({
      message: 'Are you sure you want to cancel?',
      header: 'Cancel Status Update?',
      accept: () => {
        this.router.navigate(['/system']);
      }
    });
  }
}
