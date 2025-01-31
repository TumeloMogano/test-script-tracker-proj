import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ClientService } from '../../../services/clients/client.service';
import { City } from '../../../models/client/city.model';
import { Client } from '../../../models/client/client.model';

@Component({
  selector: 'app-edit-client',
  templateUrl: './edit-client.component.html',
  styleUrls: ['./edit-client.component.scss']
})
export class EditClientComponent {
  editClientForm: FormGroup;
  client: Client | undefined;
  cities: City[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private clientService: ClientService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { 
    this.editClientForm =this.formBuilder.group({
      clientName: ['',Validators.required],
      clientEmail: ['',[Validators.required, Validators.email]],
      clientNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      clientRegistrationNr: ['', Validators.required],
      addressStreetNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      addressStreetName: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      cityId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('clientId')!;
    this.loadClient(clientId);
    this.loadCities();
  }

  loadClient(clientId: string): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (client: Client) => {
        this.client = client;
        this.editClientForm.patchValue({
          clientName: client.clientName,
          clientEmail: client.clientEmail,
          clientNumber: client.clientNumber,
          clientRegistrationNr: client.clientRegistrationNr,
          addressStreetNumber: client.addressStreetNumber,
          addressStreetName: client.addressStreetName,
          postalCode: client.postalCode,
          cityId: client.cityId
        });
      },
      error: (error) => {
        console.error('Error fetching client:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch client details' });
      }
    });
  }

  loadCities(): void {
    this.clientService.getCities().subscribe({
      next: (cities: City[]) => {
        this.cities = cities;
      },
      error: (error) => {
        console.error('Error fetching cities:', error);
      }
    });
  }

  confirmUpdate(): void {
    this.confirmationService.confirm({
      header: 'Update Client?',
      message: `Are you sure you want to update client: ${this.client?.clientName}?`,
      accept: () => {
        this.onSubmit();
      }
    });
  }

  confirmCancel(): void {
    this.confirmationService.confirm({
      header: 'Cancel Client Update?',
      message: 'Are you sure you want to cancel this operation?',
      accept: () => {
        this.cancel();
      }
    })
  }

  onSubmit(): void {
    if (this.editClientForm.valid) {
      const updatedClient: Client = {
        clientId: this.client?.clientId || '',
        ...this.editClientForm.value
      };

      this.clientService.updateClient(updatedClient.clientId, updatedClient).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Client updated successfully', key: 'bc' });
          this.router.navigate(['/client', updatedClient.clientId]);
        },
        error: (error) => {
          console.error('Error updating client:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update client', key: 'bc' });
        }   
      });
    } else {
      this.editClientForm.markAllAsTouched();
      this.messageService.add({ severity: 'info', summary: 'Validation Error', detail: 'Please fill in all required fields', key: 'bc' });
    }
  }

  cancel(): void {
    this.router.navigate(['/client', this.client?.clientId]);
  }

  get f() { return this.editClientForm.controls; }

}
