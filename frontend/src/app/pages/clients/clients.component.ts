import { Component, OnInit,AfterViewChecked } from '@angular/core';
import { ClientService } from '../../services/clients/client.service';
import { Client } from '../../models/client/client.model';
import { Router } from '@angular/router';
import { Country } from '../../models/client/country.model';
import { Region } from '../../models/client/region.model';
import { City } from '../../models/client/city.model';
import * as bootstrap from 'bootstrap'; 
import { Permissions } from '../../models/permissions.enums';
import { PermissionsService } from '../../services/auth/permissions.service';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, AfterViewChecked{
  clients: Client[] = [];
  filteredClients: Client[] = [];
  countries: Country[] = [];
  regions: Region[] = [];
  cities: City[] = [];
  selectedCountryId: number | null = null;
  selectedRegionId: number | null = null;
  selectedCityId: number | null = null;
  searchTerm: string = '';
  page: number = 1;

  Permissions = Permissions;

  constructor(
    private clientService: ClientService,
    public router: Router,
    private permissionService: PermissionsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadClients();
    this.loadCountries();
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

  loadClients(): void {
    if (this.hasPermission(Permissions.SystemAdministrator)) {
      this.loadAllClients();
    } else {
      this.loadUserFilteredClients();
    }
  }

  loadAllClients(): void {
    this.clientService.getClients().subscribe({
      next: (data: Client[]) => {
        this.clients = data;
        this.filteredClients = data;
      },
      error: (error) => {
        console.error('Error fetching clients:', error);
      }
    });
  }

  loadUserFilteredClients(): void {
    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.clientService.getClientsFilteredForUser(userId).subscribe((clients: Client[]) => {
        this.clients = clients;
        this.filteredClients = clients;
      });
    }
  }

  loadCountries(): void {
    this.clientService.getAllCountries().subscribe({
      next: (data: Country[]) => {
        this.countries = data;
      },
      error: (error) => {
        console.error('Error fetching countries:', error);
      }
    });
  }

  onCountryChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const countryId = Number(target.value);

    this.selectedCountryId = countryId;
    this.selectedRegionId = null;
    this.selectedCityId = null;
    this.regions = [];
    this.cities = [];
    this.filteredClients = [];

    if (countryId) {
      this.clientService.getClientsByCountry(countryId).subscribe({
        next: (data: Client[]) => {
          this.filteredClients = data;
        },
        error: (error) => {
          console.error('Error fetching clients:', error);
        }
      });

      this.clientService.getRegionByCountry(countryId).subscribe({
        next: (data: Region[]) => {
          this.regions = data;
        },
        error: (error) => {
          console.error('Error fetching regions:', error);
        }
      });
    } else {
      this.loadClients();
    }
  }

  onRegionChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const regionId = Number(target.value);

    this.selectedRegionId = regionId;
    this.selectedCityId = null;
    this.cities = [];
    this.filteredClients = [];

    if (regionId) {
      this.clientService.getClientsByRegion(regionId).subscribe({
        next: (data: Client[]) => {
          this.filteredClients = data;
        },
        error: (error) => {
          console.error('Error fetching clients:', error);
        }
      });

      this.clientService.getCitiesByRegion(regionId).subscribe({
        next: (data: City[]) => {
          this.cities = data;
        },
        error: (error) => {
          console.error('Error fetching cities:', error);
        }
      });
    } else if (this.selectedCountryId) {
      this.onCountryChange(event);
    } else {
      this.loadClients();
    }
  }

  onCityChange(event: Event): void {
    const target = event.target as HTMLSelectElement;
    const cityId = Number(target.value);

    this.selectedCityId = cityId;
    this.filteredClients = [];

    if (cityId) {
      this.clientService.getClientsByCity(cityId).subscribe({
        next: (data: Client[]) => {
          this.filteredClients = data;
        },
        error: (error) => {
          console.error('Error fetching clients:', error);
        }
      });
    } else if (this.selectedRegionId) {
      this.onRegionChange(event);
    } else if (this.selectedCountryId) {
      this.onCountryChange(event);
    } else {
      this.loadClients();
    }
  }

  viewClient(clientId: string): void {
    this.router.navigate(['/client', clientId]);
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredClients = this.clients.filter(client => 
      client.clientName.toLowerCase().includes(searchTerm) ||
      client.clientEmail.toLowerCase().includes(searchTerm) ||
      client.clientNumber.toString().toLowerCase().includes(searchTerm) 
      
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredClients = this.clients;
  }

  clearFilters(): void {
    this.selectedCountryId = null;
    this.selectedRegionId = null;
    this.selectedCityId = null;
    this.loadClients(); // Load all clients when filters are cleared
    this.regions = [];
    this.cities = [];
    this.filteredClients = this.clients;
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissionService.hasPermission(permission)
  }

}
