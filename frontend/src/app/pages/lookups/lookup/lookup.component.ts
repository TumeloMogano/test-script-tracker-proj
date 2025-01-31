import { Component, OnInit } from '@angular/core';
import { Country } from '../../../models/client/country.model';
import { LookupService } from '../../../services/lookups/lookup.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-lookup',
  templateUrl: './lookup.component.html',
  styleUrls: ['./lookup.component.scss']
})
export class LookupComponent implements OnInit{
  countries: Country[] = [];
  showModal: boolean = false;
  isUpdate: boolean = false;
  country: Country = { countryId: 0, countryName: '' };

  constructor(
    private lookupService: LookupService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  loadCountries(): void {
    this.lookupService.getAllCountries().subscribe({
      next: (data: Country[]) => this.countries = data,
      error: (error) => console.error('Error fetching countries:', error)
    });
  }

  openModal(isUpdate: boolean, country?: Country): void {
    this.isUpdate = isUpdate;
    if (isUpdate && country) {
      this.country = { ...country };
    } else {
      this.country = { countryId: 0, countryName: '' };
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCountry(): void {
    const action = this.isUpdate ? 'update' : 'add';
    const confirmationMessage = this.isUpdate ? 'Are you sure you want to update this country?' : 'Are you sure you want to add this country?';

    this.confirmationService.confirm({
      message: confirmationMessage,
      accept: () => {
        if (this.isUpdate) {
          this.lookupService.updateCountry(this.country).subscribe({
            next: () => {
              this.loadCountries();
              this.closeModal();
              this.messageService.add({severity: 'success', summary: 'Success', detail: 'Country updated successfully', key: 'tl'});
            },
            error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error updating country', key: 'tl'})
          });
        } else {
          this.lookupService.addCountry(this.country).subscribe({
            next: () => {
              this.loadCountries();
              this.closeModal();
              this.messageService.add({severity: 'success', summary: 'Success', detail: 'Country added successfully', key: 'tl'});
            },
            error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error adding country', key: 'tl'})
          });
        }
      }
    });
  }

  deleteCountry(countryId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this country?',
      accept: () => {
        this.lookupService.deleteCountry(countryId).subscribe({
          next: () => {
            this.loadCountries();
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Country deleted successfully', key: 'tl'});
          },
          error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error deleting country', key: 'tl'})
        });
      }
    });
  }
}
