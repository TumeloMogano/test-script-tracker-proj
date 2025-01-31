import { Component, ElementRef, OnInit, AfterViewChecked, Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { TemplateService } from '../../../services/template/template.service';
import { Template } from '../../../models/template/template.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Permissions } from '../../../models/permissions.enums';
import { PermissionsService } from '../../../services/auth/permissions.service';
import { animate } from '@angular/animations';

import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-template-list',
  templateUrl: './template-list.component.html',
  styleUrls: ['./template-list.component.scss']
})
export class TemplateListComponent implements OnInit, AfterViewChecked {
  templates: Template[] = [];
  filteredTemplates: Template[] = [];
  searchQuery: string = '';
  addTemplateForm: FormGroup;
  showModal: boolean = false;
  templateStatuses: { tempStatusId: number; tempStatusName: string }[] = []; 
  selectedTemplateStatusId: number | null = null; 
  page: number = 1;

  Permissions = Permissions;
  messages: Message[] = [];
  
  constructor(
    private templateService: TemplateService,
    private router: Router,    
    private confirmationService: ConfirmationService,
    private permissionService: PermissionsService,
    private renderer: Renderer2, // Add Renderer2 to dynamically manipulate DOM
    private el: ElementRef,
    private messageService: MessageService,
    private fb: FormBuilder
  ) {
    this.addTemplateForm = this.fb.group({
      templateName: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      templateTest: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(100)]],
      templateDescription: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]]
    });
  }

  ngOnInit(): void {
    this.loadTemplates();
    this.showMessage();
    this.loadTemplateStatuses();
  }


  loadTemplates(): void {
    this.templateService.getAllTemplates().subscribe((templates) => {
      this.templates = templates;
      this.filteredTemplates = templates;
    });
  }

  loadTemplateStatuses(): void {
    this.templateService.getTemplateStatuses().subscribe((statuses) => {
      this.templateStatuses = statuses;
    });
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

  onSearch(): void {
    const query = this.searchQuery.toLowerCase();
    this.filteredTemplates = this.templates.filter(template =>
      template.templateName.toLowerCase().includes(query) ||
      template.templateTest.toLowerCase().includes(query) ||
      //template.templateStatusName?.toLowerCase().includes(query) ||
      template.templateDescription.toLowerCase().includes(query)
    );
  }

  openModal(): void {
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  viewTemplate(templateId: string): void {
    this.router.navigate(['/template', templateId]);
  }

  createTemplate(): void {
    if (this.addTemplateForm.invalid) {
      this.addTemplateForm.markAllAsTouched();
      return;
    }

    const newTemplate = this.addTemplateForm.value;

    this.confirmationService.confirm({
      header: `Are you sure you want to create the template: ${newTemplate.templateName}?`,
      message: 'Please confirm to proceed.',
      accept: () => {
        this.templateService.createTemplate(newTemplate).subscribe((template) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Template created successfully', key: 'bc' });
          this.router.navigate(['/template', template.templateId]);
          this.closeModal();
        }, error =>{
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create template', key: 'bc'});
        });;
      },
      reject: () => {
        this.closeModal();      }
    });
  }

  hasPermission(requiredPermission: Permissions): boolean {
    return this.permissionService.hasPermission(requiredPermission);
  }

  showMessage() {
    this.messages = [
      {
        severity: 'info',
        summary: 'Authorization:',
        detail: `Administrator granted access to review templates, Proceed to review higlighted Templates. `,
        sticky: true
      }
    ];
  }


  onFilterChange(): void {
    const selectedStatusId = Number(this.selectedTemplateStatusId);

    if (selectedStatusId) {
      this.filteredTemplates = this.templates.filter(template => template.tempStatusId === selectedStatusId);
    } else {
      this.filteredTemplates = [...this.templates];
    }
  }

  onReviewTemplatesClick(): void {

    this.selectedTemplateStatusId = 3;
    this.filteredTemplates = this.templates.filter(template => template.tempStatusId === 3);
    document.getElementById('templateTable')?.scrollIntoView({ behavior: 'smooth'});
  }

  clearFilters(): void {
    this.selectedTemplateStatusId = null;
    this.searchQuery = '';
    this.filteredTemplates = [...this.templates];
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredTemplates = [...this.templates];
  }

  hasPendingReviewTemplates(): boolean {
    return this.templates.some(template => template.tempStatusId === 3);
  }

}
