import { Component, OnInit } from '@angular/core';
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
  selector: 'app-add-tag',
  templateUrl: './add-tag.component.html',
  styleUrl: './add-tag.component.scss',
})
export class AddTagComponent implements OnInit {
  createTagForm: FormGroup;
  tags: Tag[] = [];
  tagTypes: TagType[] = [];

  constructor(
    private statusService: StatusService,
    private projectService: ProjectsService,
    private tagService: TagService,
    public router: Router,
    private confimationService: ConfirmationService,
    private messageService: MessageService,
    private formBuilder: FormBuilder
  ) {
    this.createTagForm = this.formBuilder.group({
      tagName: ['', Validators.required],
      tagDescription: ['', Validators.required],
      tagTypeId: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadTags();
    this.loadTagTypes();
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
        this.router.navigate(['/system']);
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

  cancel(): void {
    this.confimationService.confirm({
      message: 'Are you sure you want to cancel?',
      header: 'Cancel Update?',
      accept: () => {
        this.router.navigate(['/system']);
      }
    });
  }

  cancelAddTag() {
    this.router.navigate(['/system']);
  }

  get fTag() {
    return this.createTagForm.controls;
  }
}
