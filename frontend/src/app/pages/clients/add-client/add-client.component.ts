import { Component, ElementRef, OnInit, ViewChild, viewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ClientService } from '../../../services/clients/client.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Client } from '../../../models/client/client.model';
import { City } from '../../../models/client/city.model';
import { Country } from '../../../models/client/country.model';
import { Region } from '../../../models/client/region.model';


@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.scss']
})
export class AddClientComponent implements OnInit {
  @ViewChild('firstInput', { static: true }) firstInput!: ElementRef;

  createClientForm: FormGroup;
  countries: Country[] = [];
  regions: Region[] = [];
  cities: City[] = [];
  selectedCountryId: number | null = null;
  selectedRegionId: number | null = null;
  selectedCityId: number | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private clientService: ClientService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService

  ) {
    this.createClientForm = this.formBuilder.group({
      clientName: ['', Validators.required],
      clientEmail: ['', [Validators.required, Validators.email]],
      clientNumber: ['',[Validators.required, Validators.pattern(/^\d+$/), Validators.minLength(10), Validators.maxLength(10)]],
      clientRegistrationNr: ['', Validators.required],
      addressStreetNumber: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      addressStreetName: ['', Validators.required],
      postalCode: ['', [Validators.required, Validators.pattern(/^\d+$/)]],
      countryId: [null, Validators.required],
      regionId: [null, Validators.required],
      cityId: [null, Validators.required],
      addClientRep: [{ value: false, disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadCountries();

    this.createClientForm.valueChanges.subscribe(() => {
      this.checkAddClientRepCheckBox();
    });
     setTimeout(() => this.firstInput.nativeElement.focus(), 0);
  }

  loadCountries(): void {
    this.clientService.getAllCountries().subscribe({
      next: (data: Country[]) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Error loading countries', error);
      }
    });
  }

  loadRegions(countryId: number): void {
    this.clientService.getRegionByCountry(countryId).subscribe({
      next: (data: Region[]) => {
        this.regions = data;
      },
      error: (error) => {
        console.error('Error fetching regions:', error);
      }
    });
  }

  loadCities(regionId: number): void {
    this.clientService.getCitiesByRegion(regionId).subscribe({
      next: (data: City[]) => {
        this.cities = data;
      },
      error: (error) => {
        console.error('Error fetching cities:', error);
      }
    });
  }

  onSubmit(): void {
    // Mark all form fields as touched to trigger validation messages
    this.createClientForm.markAllAsTouched();

    // Check if form is valid before showing the confirmation dialog
    if (this.createClientForm.valid) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to add new client?',
        header: 'Confirm Submission',
        accept: () => {
          const newClient: Client = {
            clientId: '',
            clientName: this.createClientForm.value.clientName,
            clientEmail: this.createClientForm.value.clientEmail,
            clientNumber: this.createClientForm.value.clientNumber.toString(),
            clientRegistrationNr: this.createClientForm.value.clientRegistrationNr.toString(),
            addressStreetName: this.createClientForm.value.addressStreetName,
            addressStreetNumber: this.createClientForm.value.addressStreetNumber.toString(),
            postalCode: this.createClientForm.value.postalCode.toString(),
            cityId: this.selectedCityId || 0
          };

          console.log('Payload:', newClient);

          this.clientService.createClient(newClient).subscribe({
            next: (createdClient: Client) => {
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Client Created Successfully', key: 'bc' });

              if (this.createClientForm.value.addClientRep) {
                this.router.navigate(['/add-clientrep', createdClient.clientId]);
              } else {
                this.router.navigate(['/client', createdClient.clientId]);
              }
            },
            error: (error) => {
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create client', key: 'bc' });
              console.log(this.createClientForm);
            }
          });
        }
      });
    } else {
      // Show validation error message if the form is invalid
      this.messageService.add({ severity: 'warn', summary: 'Validation Error', detail: 'Please fill in all required fields', key: 'bc' });
    }
  }      

      

  // toggleAddClientRepCheckbox(): void {
  //   if (this.createClientForm.valid) {
  //     this.createClientForm.get('addClientRep')?.enable();
  //   } else {
  //     this.createClientForm.get('addClientRep')?.disable();
  //   }
  // }

  checkAddClientRepCheckBox(): void {
    if (this.createClientForm.valid) {
      if (this.createClientForm.get('addClientRep')?.disabled) {
        this.createClientForm.get('addClientRep')?.enable({ emitEvent: false });
      }
    } else {
      if (this.createClientForm.get('addClientRep')?.enabled) {
        this.createClientForm.get('addClientRep')?.disable({ emitEvent: false });
      }
    }
  }

  onCountryChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      const selectedCountryId = target.value;
      if (selectedCountryId) {
        this.loadRegions(Number(selectedCountryId));
        this.createClientForm.controls['regionId'].setValue(null);
        this.cities = [];
      }
    }
  }

  onRegionChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      const selectedRegionId = target.value;
      if (selectedRegionId) {
        this.loadCities(Number(selectedRegionId));
        this.createClientForm.controls['cityId'].setValue(null);
      }
    }
  }

  onCityChange(event: Event): void {
    const target = event.target as HTMLSelectElement | null;
    if (target) {
      this.selectedCityId = Number(target.value);
    }
  }

  onBlur(): void {
    this.createClientForm.markAllAsTouched();
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  cancel(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to cancel?',
      header: 'Cancel Operation',
      accept: () => {
        this.router.navigate(['/clients']);
      }
    });
  }

  get f() { return this.createClientForm.controls; }

}
