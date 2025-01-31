import { Component, OnInit, AfterViewChecked} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/clients/client.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ClientRepresentative } from '../../../models/client/clientrep.model';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-edit-clientrep',
  templateUrl: './edit-clientrep.component.html',
  styleUrl: './edit-clientrep.component.scss'
})
export class EditClientrepComponent implements OnInit, AfterViewChecked {
  editClientRepForm: FormGroup;
  clientRepId: string;
  clientId: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.editClientRepForm = this.formBuilder.group({
      repName: ['', Validators.required],
      repSurname: ['', Validators.required],
      repIDNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      repContactNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      repEmailAddress: ['', [Validators.required, Validators.email]],
      clientId: [null, Validators.required]
    });
    this.clientRepId = this.route.snapshot.paramMap.get('clientRepId')!;
    this.clientId = this.route.snapshot.paramMap.get('clientId')!;
  }

  ngOnInit(): void {
      this.loadClientRepData();
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

  loadClientRepData(): void {
    this.clientService.getClientRepById(this.clientRepId).subscribe({
      next: (clientRep: ClientRepresentative) => {
        this.editClientRepForm.patchValue(clientRep);
        this.clientId = clientRep.clientId;
      },
      error: (error) => {
        console.error('Error fetching client representative:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to fetch client representative',
          key: 'bc'
        });
      }
    });
  }

  updateClientRep(): void {
    if (this.editClientRepForm.valid) {
      this.confirmationService.confirm({
        message:'Are you sure you want to update this client representative?',
        header: 'Update Client Representative?',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          const updatedClientRep: ClientRepresentative = this.editClientRepForm.value;
          this.clientService.updateClientRep(this.clientRepId, updatedClientRep).subscribe({
            next: () => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Client representative updated successfully',
                key: 'bc'
              });
              this.router.navigate(['/client', updatedClientRep.clientId]);
            },
            error: (error) => {
              console.error('Error updating client representative:',error);
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update client representative',
                key: 'bc'
              });
            }
          });
        }
      });
    } else {
      this.editClientRepForm.markAllAsTouched();
      this.messageService.add({
        severity: 'info',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields'
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/client', this.clientId]);
  }

  cancel(): void {
    this.confirmationService.confirm({
      header: 'Cancel Update?',
      message: 'Are you sure you want to cancel? All unsaved changes will be lost.',
      accept: () => {
        this.router.navigate(['/client', this.clientId]);
      }
    });
  }

  get f() { return this.editClientRepForm.controls; }
}
