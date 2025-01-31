import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClientService } from '../../../services/clients/client.service';
import { Client } from '../../../models/client/client.model';
import { Project } from '../../../models/project';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ClientRepresentative } from '../../../models/client/clientrep.model';
import { ThemeService } from '../../../services/theme/theme.service';
import { ProjectsService } from '../../../services/projects/projects.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Theme } from '../../../models/theme';

import * as bootstrap from 'bootstrap';
import { Permissions } from '../../../models/permissions.enums';
import { PermissionsService } from '../../../services/auth/permissions.service';

@Component({
  selector: 'app-client-detail',
  templateUrl: './client-detail.component.html',
  styleUrls: ['./client-detail.component.scss'],
  animations: [
    trigger('rotateChevron', [
      state('true', style({ transform: 'rotate(180deg)' })),
      state('false', style({ transform: 'rotate(0deg)' })),
      transition('true <=> false', animate('300ms ease-in-out'))
    ]),
    trigger('toggleTable', [
      transition(':enter', [
        style({ opacity: 0, height: '0px' }),
        animate('300ms ease-out', style({ opacity: 1, height: '*'}))
      ]),
      transition(':leave', [
        style({ opacity: 1, height: '*'}),
        animate('300ms ease-in', style({ opacity: 0, height: '0px'}))
      ])
    ])
  ]
})
export class ClientDetailComponent implements OnInit, AfterViewChecked{
  client: Client| undefined;
  clientReps: ClientRepresentative[] = [];
  hasClientReps: boolean = false;
  hasThemes: boolean = false;
  themes: Theme[] = [];
  hasProjects: boolean = false;
  projects: Project[] = [];
  showClientReps = true;
  showProjects = true;
  showThemes = true;
  showClientDetails = true;
  numThemes: number = 0;
  canAddThemes: boolean = false;


  Permissions = Permissions;

  constructor(
    private route: ActivatedRoute,
    private clientService: ClientService,
    private themeService: ThemeService,
    private projectService: ProjectsService,
    private permissionService: PermissionsService,
    private router: Router,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    const clientId = this.route.snapshot.paramMap.get('clientId')!;
    this.loadClient(clientId);
    this.loadClientReps(clientId);    
    this.loadClientThemes(clientId);
    this.loadClientProjects(clientId);
    this.loadClientLogo(clientId);
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

  loadClient(clientId: string): void {
    this.clientService.getClientById(clientId).subscribe({
      next: (client: Client) => {
        this.client = client;
        console.log('Payload:' ,client);
      },
      error: (error) => {
        console.error('Error fetching client:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch client details', key: 'bc' });
      }
    });
  }

  loadClientLogo(clientId: string): void {
    this.clientService.getLogoByClientId(clientId).subscribe({
      next: (response: { logoImage: string }) => {
        if (this.client) {
          this.client.logoImage = response.logoImage;
        }
      },
      error: (error) => {
        console.error('Error fetching client logo:', error);
      }
    });
  }

  loadClientReps(clientId: string): void {
    this.clientService.getClientRepsByClientId(clientId).subscribe({
      next: (reps: ClientRepresentative[]) => {
        this.clientReps = reps;
        this.hasClientReps = reps.length > 0;
      },
      error: (error) => {
        console.error('Error fetching client representatives:',error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch client representatives', key: 'bc' });
      }
    });
  }

  loadClientThemes(clientId: string): void {
    this.themeService.getClientThemes(clientId).subscribe((themes: Theme[]) => {
      this.themes = themes;
      this.hasThemes = themes.length > 0;
      this.numThemes = this.themes.length;
      console.log('Loaded Themes No.:', themes.length);
      console.log('Loaded Themes:', themes);

      // if (themes.length < 3) {
      //   this.canAddThemes = true;
      // }
      // else if (themes.length = 2){
      //   this.canAddThemes = true;
      // }
      // else{
      //   this.canAddThemes = false;
      // }
    });
  }

  loadClientProjects(clientId: string): void {
    this.projectService.getClientProjects(clientId).subscribe((projects: Project[]) => {
      this.projects = projects;
      this.hasProjects = projects.length > 0;
    });
  }

  addClientRep(): void {
    this.router.navigate(['/add-clientrep', this.client?.clientId]);
  }

  addClientProject(): void {
    this.router.navigate(['/add-project', this.client?.clientId], { queryParams: { clientId: this.client?.clientId } });
  }

  updateClientRep(clientRepId: string): void {
    this.router.navigate(['/edit-clientrep', clientRepId]);
  }

  updateProject(projectId: string): void {
    this.router.navigate(['/edit-project', projectId]);
  }

  confirmDeleteClientRep(clientRepId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this client representative?',
      header: 'Delete Confirmation',
      accept: () => {
        this.deleteClientRep(clientRepId);
      }
    });
  }

  deleteClientRep(clientRepId: string): void {
    this.clientService.deleteClientRep(clientRepId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Client Representative deleted successfully', key: 'bc' });
        this.loadClientReps(this.client?.clientId!); // Reload the client representatives
      },
      error: (error) => {
        console.error('Error deleting client representative:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete client representative', key: 'bc' });
      }
    });
  }

  updateClient(): void {
    this.router.navigate(['/edit-client', this.client?.clientId]);
  }

  confirmDelete(): void {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete the client: ${this.client?.clientName}?`,
      header: 'Delete Client?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteClient();
      }
    });
  }

  deleteClient(): void {
    if (this.client){
      this.clientService.deleteClient(this.client.clientId).subscribe({
        next: (response: any) => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: response.message , key: 'bc' });
          this.router.navigate(['/clients']);
        },
        error: (error: any) => {
          const errorMessage = error.error?.message || 'Failed to delete client' ;
          console.error('Error deleting client:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage, key: 'bc' })
        }
      });
    }
  }

  confirmDeleteTheme(themeId: string, clientId: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this theme?',
      header: 'Delete Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.deleteTheme(themeId, clientId);
      }
    });
  }

  deleteTheme(themeId: string, clientId: string): void {   
      this.themeService.deleteTheme(themeId).subscribe({
        next: () => {
          this.messageService.add({ 
                severity: 'success',
                summary: 'Success',
                detail: 'Theme deleted successfully',
                key: 'bc'});
          this.loadClientThemes(clientId);
        },
        error: (error) => {
          console.error('Error deleting theme:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete theme', key: 'bc' });
        }      
      });
    
  }

  deleteProject(projectId: string): void {
    if (confirm('Are you sure you want to delete this theme?')) {
      this.projectService.deleteProject(projectId).subscribe(() => {
      });
    }
  }

  viewThemeDetails(themeId: string): void {
    this.router.navigate(['/theme-details', themeId]);
  }

  addClientTheme(): void {
    // if(this.numThemes = 3)
    // {
    //   this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Sorry! You cannot add more than 3 themes for 1 client', key: 'bc' });

    // }
    // else
    // {
      this.router.navigate(['/add-theme', this.client?.clientId]);
    //}
    
  }

  goBack(): void {
    this.router.navigate(['/clients']);
  }

  toggleShowClientDetails() {
    this.showClientDetails = !this.showClientDetails;
  }

  toggleShowClientReps() {
    this.showClientReps = !this.showClientReps;
  }

  toggleShowThemes() {
    this.showThemes = !this.showThemes;
  }

  toggleShowProjects() {
    this.showProjects = !this.showProjects;
  }


  goToProject(projectId: string, clientId: string): void {
    this.router.navigate(['/project', projectId], { queryParams: { clientId: clientId } });
  }
  
  hasPermission(permission: Permissions): boolean {
    return this.permissionService.hasPermission(permission)
  }

}
