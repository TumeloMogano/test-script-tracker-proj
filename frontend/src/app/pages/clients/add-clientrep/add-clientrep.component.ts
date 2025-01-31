import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/clients/client.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AspUsersServices } from '../../../services/aspnetusers/aspnetusers';
import { AspUsers } from '../../../models/aspusers';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-add-clientrep',
  templateUrl: './add-clientrep.component.html',
  styleUrls: ['./add-clientrep.component.scss'],
})
export class AddClientrepComponent implements OnInit, AfterViewChecked {
  addClientRepForm: FormGroup;
  clientId: string;
  userRep!: AspUsers;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private userService: AspUsersServices
  ) {
    this.addClientRepForm = this.formBuilder.group({
      repName: ['', Validators.required],
      repSurname: ['', Validators.required],
      repIDNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      repContactNumber: [ '', [Validators.required, Validators.pattern(/^\d+$/)]],
      repEmailAddress: ['', [Validators.required, Validators.email]],
      clientId: [null, Validators.required],
    });
    this.clientId = this.route.snapshot.paramMap.get('clientId')!;
  }

  ngOnInit(): void {
    this.addClientRepForm.patchValue({ clientId: this.clientId });
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

  onSubmit(): void {
    if (this.addClientRepForm.valid) {
      this.clientService
        .createClientRep(this.addClientRepForm.value)
        .subscribe({
          next: () => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Client Representative created successfully',
              key: 'bc',
            });
            var clientEmail = this.addClientRepForm.value.repEmailAddress;
            this.userService.registerClientRep('client', clientEmail).subscribe({
              next:() =>{
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Client Representative registered successfully',
                  key: 'bc',
                });
              }
            })
            this.router.navigate(['/client', this.clientId]);
          },
          error: (error) => {
            console.error('Error creating client representative:', error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create client representative',
              key: 'bc',
            });
          },
        });
    } else {
      this.addClientRepForm.markAllAsTouched();
      this.messageService.add({
        severity: 'info',
        summary: 'Validation Error',
        detail: 'Please fill in all required fields',
        key: 'bc',
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/client', this.clientId]);
  }

  cancel(): void {
    this.confirmationService.confirm({
      header: 'Cancel Add Client Rep?',
      message: 'Are you sure you want to cancel?.',
      accept: () => {
        this.router.navigate(['/client', this.clientId]);
      },
    });
  }

  get f() { return this.addClientRepForm.controls; }
}
