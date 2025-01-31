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
  selector: 'app-edit-tag',
  templateUrl: './edit-tag.component.html',
  styleUrl: './edit-tag.component.scss',
})
export class EditTagComponent implements OnInit {
  editTagForm: FormGroup;
  tags: Tag[] = [];
  tagTypes: TagType[] = [];
  tagToUpdateId!: string;

  get editFTag() {
    return this.editTagForm.controls;
  }

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
    this.editTagForm = this.formBuilder.group({
      tagName: ['', Validators.required],
      tagDescription: ['', Validators.required],
      tagTypeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const tagId = this.route.snapshot.paramMap.get('tagId')!;
    this.loadTagTypes();
    this.loadTags();
    this.loadTag(tagId);
  }

  loadTags() {
    this.tagService.getTags().subscribe((tags) => {
      this.tags = tags;
    });
  }

  loadTagTypes() {
    this.tagService.getTagTypes().subscribe((types) => {
      this.tagTypes = types;
    });
  }

  loadTag(Id: string): void {
    this.tagService.getTagById(Id).subscribe({
      next: (tag: Tag) => {
        this.editTagForm.patchValue({
          tagName: tag.tagName,
          tagDescription: tag.tagDescription,
          tagTypeId: tag.tagTypeId,
        });
        this.tagToUpdateId = tag.tagId;
      },
      error: (error) => {
        console.error('Error fetching tag:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch tag details',
        });
      },
    });
  }

  cancelEditTag(): void {
    this.router.navigate(['/system']);
  }

  confirmUpdate(): void {
    this.confimationService.confirm({
      message: `Are you sure you want to Update Tag?`,
      header: 'Update Tag?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.updateTag();
      },
    });
  }

  updateTag() {
    if (this.editTagForm.invalid) {
      return;
    }
    const updatedTag: TagViewModel = {
      ...this.editTagForm.value,
      tagTypeId: Number(this.editTagForm.value.tagTypeId), // Convert to number
    };
    console.log('Updated Tag:', updatedTag); // Add this line
    this.tagService.updateTag(updatedTag, this.tagToUpdateId).subscribe(
      () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Tag Updated successfully',
          key: 'bc',
        });
        this.editTagForm.reset();
        this.router.navigate(['/system']);
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

  cancel(): void {
    this.confimationService.confirm({
      message: 'Are you sure you want to cancel?',
      header: 'Cancel Tag Update?',
      accept: () => {
        this.router.navigate(['/system']);
      }
    });
  }
}
