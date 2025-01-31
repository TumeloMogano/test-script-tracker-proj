import { Component, OnInit } from '@angular/core';
import { Region } from '../../../../models/client/region.model';
import { Country } from '../../../../models/client/country.model';
import { City, CityDto } from '../../../../models/client/city.model';
import { LookupService } from '../../../../services/lookups/lookup.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.scss']
})
export class CityComponent implements OnInit{
  countries: Country[] = [];
  regions: Region[] = [];
  cities: CityDto[] = [];
  showModal: boolean = false;
  isUpdate: boolean = false;
  city: CityDto = { cityId: 0, cityName: '', regionId: 0 };
  selectedCountryId: number | null = null;
  page: number = 1;

  constructor(
    private lookupService: LookupService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCountries();
    this.loadCities();
  }

  loadCountries(): void {
    this.lookupService.getAllCountries().subscribe({
      next: (data: Country[]) => this.countries = data,
      error: (error) => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error fetching countries', key: 'tl'})
    });
  }

  loadCities(): void {
    this.lookupService.getAllCities().subscribe({
      next: (data: CityDto[]) => this.cities = data,
      error: (error) => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error fetching cities', key: 'tl'})
    });
  }

  onCountryChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    this.selectedCountryId = Number(target.value);
    this.loadRegions();
  }

  loadRegions(): void {
    if (this.selectedCountryId) {
      this.lookupService.getRegionsByCountry(this.selectedCountryId).subscribe({
        next: (data: Region[]) => this.regions = data,
        error: (error) => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error fetching regions', key: 'tl'})
      });
    } else {
      this.regions = [];
    }
  }

  openModal(isUpdate: boolean, city?: CityDto): void {
    this.isUpdate = isUpdate;
    if (isUpdate && city) {
      this.city = { ...city };
      this.selectedCountryId = this.countries.find(country => country.countryId === this.city.regionId)?.countryId || null;
      this.loadRegions();
    } else {
      this.city = { cityId: 0, cityName: '', regionId: 0 };
      this.selectedCountryId = null;
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveCity(): void {
    const confirmationMessage = this.isUpdate ? 'Are you sure you want to update this city?' : 'Are you sure you want to add this city?';

    this.confirmationService.confirm({
      message: confirmationMessage,
      accept: () => {
        if (this.isUpdate) {
          this.lookupService.updateCity(this.city).subscribe({
            next: () => {
              this.loadCities();
              this.closeModal();
              this.messageService.add({severity: 'success', summary: 'Success', detail: 'City updated successfully', key: 'tl'});
            },
            error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error updating city', key: 'tl'})
          });
        } else {
          this.lookupService.addCity(this.city).subscribe({
            next: () => {
              this.loadCities();
              this.closeModal();
              this.messageService.add({severity: 'success', summary: 'Success', detail: 'City added successfully', key: 'tl'});
            },
            error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error adding city', key: 'tl'})
          });
        }
      }
    });
  }

  deleteCity(cityId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this city?',
      accept: () => {
        this.lookupService.deleteCity(cityId).subscribe({
          next: () => {
            this.loadCities();
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'City deleted successfully', key: 'tl'});
          },
          error: (error) => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error deleting city', key: 'tl'})
        });
      }
    });
  }

}
