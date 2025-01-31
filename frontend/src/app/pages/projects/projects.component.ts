import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ProjectsService } from '../../services/projects/projects.service';
import { Project } from '../../models/project';
import { Client } from '../../models/client';
import { Router } from '@angular/router';
import * as bootstrap from 'bootstrap'; 
import { PermissionsService } from '../../services/auth/permissions.service';
import { Permissions } from '../../models/permissions.enums';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit, AfterViewChecked {
  projects: Project[] = [];
  filteredProjects: Project[] = [];
  clients: Client[] = [];
  filteredClients: Client[] = [];
  searchTerm: string = '';
  clientSearchTerm: string = '';
  showClientModal: boolean = false;
  page: number = 1;
  projectPhases: { phaseId: number; phaseName: string }[] = []; 
  selectedPhaseId: number | null = null; 
  isActiveFilter: boolean | null = null;

  Permissions = Permissions;

  constructor(
    private projectsService: ProjectsService,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private permissionsService: PermissionsService,
    private authService: AuthService
    ) {}

  ngOnInit(): void {
    this.loadProjects();
    this.loadProjectPhases();
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

  loadProjects(): void {
    if (this.hasPermission(Permissions.SystemAdministrator)) {
      this.loadClientsAndProjects();
    } else {
      this.loadUserFilteredProjects();
    }
  }

  loadProjectPhases(): void {
    this.projectsService.getPhases().subscribe((phases) => {
      this.projectPhases = phases;
    });
  }

  loadClientsAndProjects(): void {
    this.projectsService.getClients().subscribe(clients => {
      this.clients = clients;
      this.filteredClients = clients;

      console.log('Loaded Clients:', clients);

      this.projectsService.getProjects().subscribe(projects => {
        this.projects = projects;
        this.filteredProjects = projects;

        console.log('Loaded Projects:', projects);
        this.cdr.detectChanges();
      });
    });
  }

  loadUserFilteredProjects(): void {
    this.projectsService.getClients().subscribe(clients => {
      this.clients = clients;
      this.filteredClients = clients;

      const userId = this.authService.getCurrentUserId();
      if (userId) {
        this.projectsService.getFilteredProjectsForUser(userId).subscribe(projects => {
          this.projects = projects;
          this.filteredProjects = projects;
          this.cdr.detectChanges();
        });
      } else {
        console.error('User ID is undefined');
      }
    }); 
  }

  getClientName(clientId: string): string {
    const client = this.clients.find(client => client.clientId === clientId);
    return client ? client.clientName : 'Unknown';
  }

  deleteProject(projectId: string): void {
    if (projectId) {
      this.projectsService.deleteProject(projectId).subscribe(() => {
        this.projects = this.projects.filter(project => project.projectId !== projectId);
        this.filterProjects();
        this.cdr.detectChanges();
      });
    } else {
      console.error('Project ID is undefined');
    }
  }

  addProject(): void {
    this.router.navigate(['/create-project']);
  }

  viewProject(projectId: string): void {
    this.router.navigate(['/project', projectId]);
  }
  

  filterProjects(): void {
    const term = this.searchTerm.toLowerCase().trim();
    console.log('Search Term:', term);

    if (term) {
      this.filteredProjects = this.projects.filter(project =>
        project.projectName.toLowerCase().includes(term) ||
        this.getClientName(project.clientId).toLowerCase().includes(term)
      );
      console.log('Filtered Projects:', this.filteredProjects); 
    } else {
      this.filteredProjects = this.projects;
    }
    this.cdr.detectChanges();
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredProjects = this.projects;
  }

  openClientModal(): void {
    this.showClientModal = true;
    this.clientSearchTerm = '';
    this.filteredClients = this.clients;
  }

  closeClientModal(): void {
    this.showClientModal = false;
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissionsService.hasPermission(permission)
  }

  filterClients(): void {
    const term = this.clientSearchTerm.toLowerCase().trim();
    this.filteredClients = this.clients.filter(client => client.clientName.toLowerCase().includes(term));
  }

  selectClient(clientId: string): void {
    this.router.navigate(['/add-project', clientId]);
    this.closeClientModal();
  }

  // onFilterChange(): void {
  //   const selectedPhaseId = Number(this.selectedPhaseId);
  
  //   if (selectedPhaseId) {
  //     this.filteredProjects = this.projects.filter(project => project.phaseId === selectedPhaseId);
  //   } 
  //   else if (this.isActiveFilter == true)
  //   {
  //     this.filteredProjects = this.projects.filter(project => project.isActive === true);
  //   }
  //   else if (this.isActiveFilter == false)
  //   {
  //     this.filteredProjects = this.projects.filter(project => project.isActive === false);
  //   }
  //   else {
  //     this.filteredProjects = [...this.projects];
  //   }
  // }  
  

  // onFilterChange(): void {
  //   console.log('Selected isActiveFilter:', this.isActiveFilter); // Debugging line

  //   const selectedPhaseId = Number(this.selectedPhaseId);
    
  //   this.filteredProjects = this.projects.filter(project => {
  //     const matchesPhase = !selectedPhaseId || project.phaseId === selectedPhaseId;
  //     const matchesIsActive = this.isActiveFilter === null || (project.isActive == true ) === (this.isActiveFilter == true)
  //     || (project.isActive == false ) === (this.isActiveFilter == false);
      
  //     // Return true if both conditions are satisfied
  //     return matchesPhase && matchesIsActive;
  //   });
  //   console.log('Filtered Projects:', this.filteredProjects); // Debug filtered results

  // }

  onFilterChange(): void {
    const selectedProjectPhaseId = Number(this.selectedPhaseId);

    if (selectedProjectPhaseId) {
      this.filteredProjects = this.projects.filter(project => project.phaseId === selectedProjectPhaseId);
    } else {
      this.filteredProjects = [...this.projects];
    }
  }
  
  
  clearFilters(): void {
    this.selectedPhaseId = null;
    //this.isActiveFilter = null;
    //this.searchQuery = '';
    this.filteredProjects = [...this.projects];
  }
}

