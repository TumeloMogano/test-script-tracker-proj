import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { TeamService } from '../../services/teams/team.service';
import { Router } from '@angular/router';
import { Team } from '../../models/team/team.model';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ChangeDetectorRef } from '@angular/core';
import { PermissionsService } from '../../services/auth/permissions.service';
import { Permissions } from '../../models/permissions.enums';
import { AuthService } from '../../services/auth/auth.service';


@Component({
  selector: 'app-teams',
  templateUrl: './teams.component.html',
  styleUrls: ['./teams.component.scss']
})
export class TeamsComponent implements OnInit{
  teams: Team[] = [];
  selectedTeam: Team | null = null;
  filteredTeams: Team[] = []; 
  searchTerm: string = '';
  dropdownOpen: string | null = null;
  minDate: string | null = null;
  maxDate: string | null = null;
  dateValidationError: boolean = false;
  page: number = 1;
  
  Permissions = Permissions;

  constructor(
    private teamService: TeamService,
    public router: Router,
    private confimationService: ConfirmationService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private renderer: Renderer2,
    private permissionsService: PermissionsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadTeams();
  }

  loadTeams(): void {
    if (this.hasPermission(Permissions.SystemAdministrator)) {
      this.loadAllTeams();
    } else {
      this.loadUserFilteredTeams();
    }
  }

  loadAllTeams(): void {
    this.teamService.getTeams().subscribe((data: Team[]) => {
      this.teams = data;
      this.filteredTeams = data;
    });
  }

  loadUserFilteredTeams(): void {
    const userId = this.authService.getCurrentUserId();

    if (userId) {
      this.teamService.getFilteredTeamsForUser(userId).subscribe((teams: Team[]) => {
        this.teams = teams;
        this.filteredTeams = teams;
      });
    } else {
      console.error('User ID is undefined');
    }
  }



  applyDateFilter(): void {
    this.dateValidationError = false;

    if (this.minDate && this.maxDate && new Date(this.minDate) > new Date(this.maxDate)) {
      this.dateValidationError = true;
      return;
    }

    this.filteredTeams = this.teams.filter(team => {
      const creationDate = new Date(team.creationDate!);
      const min = this.minDate ? new Date(this.minDate) : null;
      const max = this.maxDate ? new Date(this.maxDate) : null;

      return (!min || creationDate >= min) && (!max || creationDate <= max);
    });    
  }

  clearDateFilters(): void {
    this.minDate = null;
    this.maxDate = null;
    this.dateValidationError = false;
    this.filteredTeams = this.teams;
  }

  toggleDropdown(teamId: string, event: MouseEvent): void {
    event.stopPropagation(); //Prevent the click from propagating to the document
    console.log(`Toggling dropdown for teamId: ${teamId}`);
    this.dropdownOpen = this.dropdownOpen === teamId ? null : teamId;
    console.log(`Dropdown state: ${this.dropdownOpen}`);
    this.cdr.detectChanges();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.dropdown-container')) {
      this.dropdownOpen = null;
      this.cdr.detectChanges();
    }
  }

  isDropdownOpen(teamId: string): boolean {
    return this.dropdownOpen === teamId;    
  }

  manageTeam(teamId: string): void {
    this.router.navigate(['/team', teamId]);
  }

  onSearch(event: any): void {
    const searchTerm = event.target.value.toLowerCase();
    this.filteredTeams = this.teams.filter(team => 
      team.teamName.toLowerCase().includes(searchTerm) ||
      team.teamDescription.toLowerCase().includes(searchTerm) ||
      (team.creationDate?.toString().toLowerCase() ?? '').includes(searchTerm)
    );
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredTeams = this.teams;
  }


  hasPermission(permission: Permissions): boolean {
    return this.permissionsService.hasPermission(permission)
  }

  
}
