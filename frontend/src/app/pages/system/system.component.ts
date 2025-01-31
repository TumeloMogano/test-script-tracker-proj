import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { StatusType } from '../../models/status/status.model';
import { TagType } from '../../models/tag/tagtype.model';
import { Status, StatusViewModel } from '../../models/status/statustype.model';
import { Tag, TagViewModel } from '../../models/tag/tag.model';
import { StatusService } from '../../services/statuses/status.service';
import { TagService } from '../../services/tags/tag.service';
import { ProjectsService } from '../../services/projects/projects.service';
import { Project } from '../../models/project';
import { Alert } from 'bootstrap';
import * as bootstrap from 'bootstrap';
import { Permissions } from '../../models/permissions.enums';
import { PermissionsService } from '../../services/auth/permissions.service';

@Component({
  selector: 'app-system',
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss',
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
export class SystemComponent implements OnInit, AfterViewChecked {
  //STATUS -----------------------
  createStatusForm: FormGroup;
  editStatusForm: FormGroup;

  statusTypes: StatusType[] = [];
  statuses: Status[] = [];
  filteredStatuses: Status[] = [];
  paginatedStatuses: Status[] = [];

  projects: Project[] = [];

  statusToUpdate: Status | null = null;

  pageSize = 5;
  currentPage = 1;
  totalPages = 0;

  showStatusTable = true;
  showAddStatus = true;
  showEditStatus = false;

  Permissions = Permissions;

  constructor(
    private statusService: StatusService,
    private projectService: ProjectsService,
    private tagService: TagService,
    public router: Router,
    private confimationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder,
    private permissionsService: PermissionsService
  ) {
    //STATUS -----------------------
    this.createStatusForm = this.formBuilder.group({
      statusName: ['', Validators.required],
      statusDescription: ['', Validators.required],
      statusTypeId: [null, Validators.required],
      projectId: [null, Validators.required],
    });

    this.editStatusForm = this.formBuilder.group({
      statusName: ['', Validators.required],
      statusDescription: ['', Validators.required],
      statusTypeId: [null, Validators.required],
      projectId: [null, Validators.required],
    });

    //TAG ------------------------
    this.createTagForm = this.formBuilder.group({
      tagName: ['', Validators.required],
      tagDescription: ['', Validators.required],
      tagTypeId: ['', Validators.required],
    });

    this.editTagForm = this.formBuilder.group({
      tagName: ['', Validators.required],
      tagDescription: ['', Validators.required],
      tagTypeId: ['', Validators.required],
    });
  }


  ngOnInit(): void {
    this.loadStatusTypes();
    this.loadStatuses();
    this.loadProjects();

    this.loadTags();
    this.loadTagTypes();
  }

  ngAfterViewChecked(): void {
    this.initializeTooltips();
  }

  loadStatusTypes(): void {
    this.statusService.getStatusTypes().subscribe((data: StatusType[]) => {
      this.statusTypes = data;
    });
  }

  loadStatuses(): void {
    this.statusService.getStatuses().subscribe((data: Status[]) => {
      this.statuses = data;
      this.filteredStatuses = data;
      this.currentPage = 1; // Reset current page to 1
      this.calculateTotalPages();
      this.updatePaginatedStatuses();
    });
  }

  loadProjects(): void {
    this.projectService.getProjects().subscribe((data: Project[]) => {
      this.projects = data;
    });
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
          this.loadStatuses(); // Reload statuses after adding a new one
          this.showAddStatus = false; // Hide the add status form
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

  hasPermission(permission: Permissions): boolean {
    return this.permissionsService.hasPermission(permission);
  }

  onStatusSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredStatuses = this.statuses.filter(
      (status) =>
        status.statusName.toLowerCase().includes(searchTerm) ||
        status.statusDescription.toLowerCase().includes(searchTerm) ||
        status.projectId.toLowerCase().includes(searchTerm) ||
        this.getProjectName(status.projectId).toLowerCase().includes(searchTerm)
    );
    this.currentPage = 1; // Reset current page to 1
    this.calculateTotalPages();
    this.updatePaginatedStatuses();
  }

  getStatusTypeName(statusTypeId: number): string {
    const statusType = this.statusTypes.find(
      (type) => type.statusTypeId === statusTypeId
    );
    return statusType ? statusType.statusTypeName : '';
  }

  getProjectName(projectId: string): string {
    const project = this.projects.find((proj) => proj.projectId === projectId);
    return project ? project.projectName : 'N/A';
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredStatuses.length / this.pageSize);
  }

  updatePaginatedStatuses() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.paginatedStatuses = this.filteredStatuses.slice(startIndex, endIndex);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedStatuses();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedStatuses();
    }
  }

  toggleShowStatusTable() {
    this.showStatusTable = !this.showStatusTable;
  }

  toggleShowAddStatus() {
    this.showAddStatus = !this.showAddStatus;
  }

  toggleShowEditStatus() {
    this.showEditStatus = !this.showEditStatus;
  }

  cancelAddStatus(): void {
    this.showAddStatus = !this.showAddStatus;
  }

  cancelEditStatus(): void {
    this.showEditStatus = !this.showEditStatus;
    this.showStatusTable = true;
    this.statusToUpdate = null;
    this.editStatusForm.reset();
  }

  invokeUpdateStatus(status: Status): void {
    this.router.navigate(['/edit-status', status.statusId]);
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
            this.loadStatuses(); // Reload statuses after updating
            this.cancelEditStatus(); // Hide the edit status form
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

  confirmDeleteStatus(statusId: string): void {
    this.confimationService.confirm({
      message: `Are you sure you want to Delete status?`,
      header: 'Delete Status?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteStatus(statusId);
      },
    });
  }

  deleteStatus(statusId: string) {
    this.statusService.deleteStatus(statusId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Status Deleted successfully',
          key: 'bc',
        });
        this.loadStatuses(); // Reload statuses after deleting
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to Delete Status',
          key: 'bc',
        });
      }
    );
  }

  get f() {
    return this.createStatusForm.controls;
  }

  get editF() {
    return this.editStatusForm.controls;
  }

  //---------------------------- TAG SECTION ----------------------------------------------
  createTagForm: FormGroup;
  editTagForm: FormGroup;
  showAddTag: boolean = true;
  showEditTag: boolean = false;
  showTagTable: boolean = true;
  tags: Tag[] = [];
  paginatedTags: Tag[] = [];
  tagTypes: TagType[] = [];
  currentTagPage: number = 1;
  totalTagPages: number = 1;
  tagToUpdateId!: string;

  get fTag() {
    return this.createTagForm.controls;
  }

  get editFTag() {
    return this.editTagForm.controls;
  }

  loadTags() {
    this.tagService.getTags().subscribe((tags) => {
      this.tags = tags;
      this.paginatedTags = tags;
      this.paginateTags();
    });
  }

  loadTagTypes() {
    this.tagService.getTagTypes().subscribe((types) => {
      this.tagTypes = types;
    });
  }

  addTag() {
    if (this.createTagForm.invalid) {
      return;
    }

    const newTag: TagViewModel = this.createTagForm.value;
    this.tagService.createTag(newTag).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tag Created successfully',
          key: 'bc',
        });
        this.loadTags();
        this.createTagForm.reset();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to Create Tag',
          key: 'bc',
        });
      }
    );
  }

  invokeUpdateTag(tag: Tag) {
    this.router.navigate(['/edit-tag', tag.tagId]);
  }

  updateTag() {
    if (this.editTagForm.invalid) {
      return;
    }

    const updatedTag: TagViewModel = this.editTagForm.value;
    this.tagService.updateTag(updatedTag, this.tagToUpdateId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tag Updated successfully',
          key: 'bc',
        });
        this.loadTags();
        this.editTagForm.reset();
        this.showEditTag = false;
        this.showTagTable = true;
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to Update Tag',
          key: 'bc',
        });
      }
    );
  }

  confirmDeleteTag(tagId: string): void {
    this.confimationService.confirm({
      message: `Are you sure you want to Delete Tag?`,
      header: 'Delete Tag?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTag(tagId);
      },
    });
  }

  deleteTag(tagId: string) {
    this.tagService.deleteTag(tagId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tag Deleted successfully',
          key: 'bc',
        });
        this.loadTags();
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to Delete Tag',
          key: 'bc',
        });
      }
    );
  }

  cancelAddTag() {
    this.createTagForm.reset();
    this.showAddTag = false;
  }

  cancelEditTag() {
    this.editTagForm.reset();
    this.showEditTag = false;
    this.showTagTable = true;
  }

  onTagSearch(event: Event) {
    const searchTerm = (event.target as HTMLInputElement).value.toLowerCase();
    this.paginatedTags = this.tags.filter(
      (tag) =>
        tag.tagName.toLowerCase().includes(searchTerm) ||
        tag.tagDescription.toLowerCase().includes(searchTerm) ||
        this.getTagTypeName(tag.tagTypeId).toLowerCase().includes(searchTerm)
    );
  }

  getTagTypeName(tagTypeId: number): string {
    const type = this.tagTypes.find((t) => t.tagTypeId === tagTypeId);
    return type ? type.tagtypeName : '';
  }

  paginateTags() {
    /*
    this.totalTagPages = Math.ceil(this.tags.length / this.pageSize);
    this.paginatedTags = this.tags.slice(
      (this.currentTagPage - 1) * this.pageSize,
      this.currentTagPage * this.pageSize
    );
    */
  }

  previousTagPage() {
    if (this.currentTagPage > 1) {
      this.currentTagPage--;
      this.paginateTags();
    }
  }

  nextTagPage() {
    if (this.currentTagPage < this.totalTagPages) {
      this.currentTagPage++;
      this.paginateTags();
    }
  }

  toggleShowAddTag() {
    this.showAddTag = !this.showAddTag;
  }

  toggleShowTagTable() {
    this.showTagTable = !this.showTagTable;
  }
}
