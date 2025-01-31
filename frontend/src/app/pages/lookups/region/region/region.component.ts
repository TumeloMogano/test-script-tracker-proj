import { Component } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { LookupService } from '../../../../services/lookups/lookup.service';
import { Region, RegionDto } from '../../../../models/client/region.model';
import { Country } from '../../../../models/client/country.model';

@Component({
  selector: 'app-region',
  templateUrl: './region.component.html',
  styleUrls: ['./region.component.scss']
})
export class RegionComponent {
  countries: Country[] = [];
  regions: RegionDto[] = [];
  showModal: boolean = false;
  isUpdate: boolean = false;
  region: RegionDto = { regionId: 0, regionName: '', countryId: 0 };
  page: number = 1;

  constructor(
    private lookupService: LookupService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadCountries();
    this.loadRegions();
  }

  loadCountries(): void {
    this.lookupService.getAllCountries().subscribe({
      next: (data: Country[]) => this.countries = data,
      error: (error) => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error fetching countries', key: 'tl'})
    });
  }

  loadRegions(): void {
    this.lookupService.getAllRegions().subscribe({
      next: (data: RegionDto[]) => this.regions = data,
      error: (error) => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error fetching regions', key: 'tl'})
    });
  }

  openModal(isUpdate: boolean, region?: RegionDto): void {
    this.isUpdate = isUpdate;
    if (isUpdate && region) {
      this.region = { ...region };
    } else {
      this.region = { regionId: 0, regionName: '', countryId: 0 };
    }
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveRegion(): void {
    const action = this.isUpdate ? 'update' : 'add';
    const confirmationMessage = this.isUpdate ? 'Are you sure you want to update this region?' : 'Are you sure you want to add this region?';

    this.confirmationService.confirm({
      message: confirmationMessage,
      accept: () => {
        if (this.isUpdate) {
          this.lookupService.updateRegion(this.region).subscribe({
            next: () => {
              this.loadRegions();
              this.closeModal();
              this.messageService.add({severity: 'success', summary: 'Success', detail: 'Region updated successfully', key: 'tl'});
            },
            error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error updating region', key: 'tl'})
          });
        } else {
          this.lookupService.addRegion(this.region).subscribe({
            next: () => {
              this.loadRegions();
              this.closeModal();
              this.messageService.add({severity: 'success', summary: 'Success', detail: 'Region added successfully', key: 'tl'});
            },
            error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error adding region', key: 'tl'})
          });
        }
      }
    });
  }

  deleteRegion(regionId: number): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this region?',
      accept: () => {
        this.lookupService.deleteRegion(regionId).subscribe({
          next: () => {
            this.loadRegions();
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Region deleted successfully', key: 'tl'});
          },
          error: () => this.messageService.add({severity: 'error', summary: 'Error', detail: 'Error deleting region', key: 'tl'})
        });
      }
    });
  }
}
