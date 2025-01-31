import { Component, HostListener, OnInit, AfterViewChecked } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TeamService } from '../../../services/teams/team.service';
import { ConfirmationService, Message, MessageService } from 'primeng/api';
import { Team, TeamMember, TeamUser } from '../../../models/team/team.model';
import { AddTeamMember } from '../../../models/team/team.model';
import { trigger, state, style, transition, animate } from '@angular/animations';

import * as bootstrap from 'bootstrap'; 
import { AuthService } from '../../../services/auth/auth.service';
import { Permissions } from '../../../models/permissions.enums';
import { PermissionsService } from '../../../services/auth/permissions.service';

@Component({
  selector: 'app-manage-team',
  templateUrl: './manage-team.component.html',
  styleUrls: ['./manage-team.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('200ms ease-in', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class ManageTeamComponent implements OnInit, AfterViewChecked {
  team: Team | null = null;
  teamId: string | null = null;
  teamMembers: TeamMember[] = [];
  dropdownOpen: string | null = null;
  users: TeamUser[] = [];
  selectedUsers: { userId: string, isTeamLead: boolean }[] = [];
  isAddingTeamMembers = false;
  page: number = 1;
  isTeamLeadFlag: boolean = false;  
  canAddMember: boolean = false;
  canAddTeamLead: boolean = false;

  messages: Message[] = [];
  hasReachedMaxMembers: boolean = false;
  Permissions = Permissions;
  maxTeamMessages: Message[] = [];

  constructor(
    private teamService: TeamService,
    public router: Router,
    private route: ActivatedRoute,
    private confirmationService: ConfirmationService,
    private permissionService: PermissionsService,
    private messageService: MessageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.teamId = this.route.snapshot.paramMap.get('teamId');
    if (this.teamId) {
      this.loadTeam(this.teamId);
      this.loadTeamMembers(this.teamId);
    }
    this.loadUsers();
    this.showMessage();
    this.checkCanAddMember();
    this.checkCanAddTeamLead();
    this.showMaxTeamMemberMessage();
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

  loadTeam(teamId: string): void {
    this.teamService.getTeamById(teamId).subscribe({
      next: (team: Team) => {
        this.team = team;
      },
      error: (error) => {
        console.error('Error fetching team:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch team details', key: 'bc' });
      }
    });
  }

  loadTeamMembers(teamId: string): void {
    this.teamService.getTeamMembers(teamId).subscribe({
      next: (members: TeamMember[]) => {
        this.teamMembers = members;
      },
      error: (error) => {
        console.error('Error fetching team members:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch team members', key: 'bc' });
      }
    });
  }

  loadUsers(): void {
    this.teamService.getAvailableUsers(this.teamId!).subscribe({
      next: (users: TeamUser[]) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error fetching available users:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to fetch available users', key: 'bc' });
      }
    });
  }

  // Check if you can add a team lead
  checkCanAddTeamLead(): void {
    this.teamService.canAddTeamLead(this.teamId!).subscribe(
      (canAdd) => {
        this.canAddTeamLead = canAdd;
      },
      (error) => {
        console.error('Error checking if team lead can be added', error);
      }
    );
  }

  // Check if you can add a member to the team
  checkCanAddMember(): void {
    this.teamService.canAddMemberToTeam(this.teamId!).subscribe(
      (canAdd) => {
        this.canAddMember = canAdd;
      },
      (error) => {
        console.error('Error checking if member can be added', error);
      }
    );
  }

  editTeam(teamId: string | undefined): void {
    this.router.navigate(['/edit-team', teamId]);
  }

  confirmDelete(teamId: string | undefined): void {
    if (teamId) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the following team?',
        header: 'Delete Team?',
        accept: () => {
          this.deleteTeam(teamId);
        },
        reject: () => {
          console.log('Rejected Deletion');
          this.loadTeam(teamId);
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Team ID', key: 'bc' });
    }
  }

  deleteTeam(teamId: string | undefined): void {
    if (teamId) {
      this.teamService.deleteTeam(teamId).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team Deleted Successfully', key: 'bc' });
          this.router.navigate(['/teams']);
        },
        error: (error) => {
          const errorMessage = error.error?.message ;
          console.error('Error deleting team:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: errorMessage, key: 'bc' });
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Team ID' });
    }
  }

  toggleDropdown(userId: string, event: MouseEvent): void {
    event.stopPropagation(); // Prevent the click from propagating to the document
    this.dropdownOpen = this.dropdownOpen === userId ? null : userId;
  }

  isDropdownOpen(userId: string): boolean {
    return this.dropdownOpen === userId;
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const clickedElement = event.target as HTMLElement;
    if (!clickedElement.closest('.dropdown-container')) {
      this.dropdownOpen = null;
    }
  }

  confirmRemoveMember(teamId: string, userId: string): void {
    if (teamId && userId) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to remove this team member?',
        header: 'Remove Team Member?',
        accept: () => {
          this.removeTeamMember(teamId, userId);
        },
        reject: () => {
          console.log('Rejected Removal');
        }
      });
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Invalid Team ID or User ID', key: 'bc' });
    }
  }

  removeTeamMember(teamId: string, userId: string): void {
    this.teamService.removeTeamMember(teamId, userId).subscribe({
      next: () => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team member removed successfully', key: 'bc' });
        this.loadTeamMembers(teamId); // Reload the team members after removal
        this.loadUsers();
        this.checkCanAddTeamLead();
        this.checkCanAddMember();
      },
      error: (error) => {
        console.error('Error removing team member:', error);
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to remove team member', key: 'bc' });
      }
    });
  }

  onIsTeamLeadChange(member: TeamMember, newIsTeamLeadValue: boolean): void {
    if (member.isTeamLead !== newIsTeamLeadValue) {
      this.confirmationService.confirm({
        message: 'Are you sure you want to proceed?',
        header: 'Confirm Team Lead update',
        accept: () => {
          this.updateTeamLeadStatus(member.userId, newIsTeamLeadValue);
        },
        reject: () => {
          setTimeout(() => {
            member.isTeamLead = !newIsTeamLeadValue;
          }, 0);
        }
      });
    }

  }

  updateTeamLeadStatus(userId: string, isTeamLead: boolean): void {
    if (this.teamId) {
      this.teamService.updateIsTeamLead(this.teamId, userId, isTeamLead).subscribe({
        next: () => {
          const member = this.teamMembers.find(m => m.userId === userId);
          if (member) {
            member.isTeamLead = isTeamLead;
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team Lead status updated successfully', key: 'tl' });
          this.checkCanAddMember();
          this.checkCanAddTeamLead();
        },
        error: (error) => {
          console.error('Error updating team lead status:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update team lead status', key: 'bc' });
        }
      });
    }
  }

  getTeamMemberCount(): number {
    return this.teamMembers.length;
  }

  goBack(): void {
    this.router.navigate(['/teams']);
  }

  showAddMemberSection(): void {
    this.isAddingTeamMembers = true;
  }

  addSelectedUser(user: TeamUser): void {
    //check if user is already selected
    const existingUser = this.selectedUsers.find(u => u.userId === user.userId);
    if (!existingUser) {
      //add user with initial isTeaamLead set to false, as they have not been selected yet
      this.selectedUsers.push({ userId: user.userId, isTeamLead: false });
      //this.messageService.add({ severity: 'success', summary: 'User Selected', detail: `User with name ${user.userFirstName} has been selected`, key: 'bc' });
    }   
  }

  removeSelectedUser(userId: string): void {
    this.selectedUsers = this.selectedUsers.filter(u => u.userId !== userId);
    //this.messageService.add({ severity: 'info', summary: 'User Removed', detail: `User with ID ${userId} has been removed from selection`, key: 'bc' });
  }

  toggleIsTeamLead(userId: string): void {
    const user = this.selectedUsers.find(u => u.userId === userId);
    if (user) {
      user.isTeamLead = !user.isTeamLead;
    } else {
      //if user is not yet selected, add them with isTeamLead set to true
      const selectedUser = this.users.find(u => u.userId === userId);
      if (selectedUser) {
        this.selectedUsers.push({ userId: userId, isTeamLead: true});
      }
    }
  }

  isTeamLead(userId: string): boolean {
    const user = this.selectedUsers.find(u => u.userId === userId);
    return user ? user.isTeamLead : false;
  }

  isSelected(userId: string): boolean {
    return this.selectedUsers.some(u => u.userId === userId);
  }

  showMessage() {
    this.messages = [
      {
        severity: 'info',
        summary: 'Team members:',
        detail: `Please select new team member(s), Click submit to add selected members. `,
        sticky: true
      }
    ];
  }

  showMaxTeamMemberMessage() {
    this.maxTeamMessages = [
      {
        severity: 'info',
        summary: 'Team:',
        detail: `This team has reached it's maximum member limit. Please contact administrator to add or remove team members.
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; `,
        sticky: true
      }
    ];
  }

  confirmAddTeamMembers(): void {
    this.confirmationService.confirm({
      header: 'Add Team Members?',
      message: 'Are you sure you want to add these team members?',
      accept: () => {
        this.addTeamMembers();
      }
    });
  }

  addTeamMembers(): void {
    if (this.teamId) {
      const newTeamMembers = this.selectedUsers.map(user => ({
        teamId: this.teamId!,
        userId: user.userId,
        isTeamLead: user.isTeamLead
      }));

      this.teamService.addTeamMembers(this.teamId, newTeamMembers).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Team Member(s) Added Successfully', key: 'bc' });
          this.selectedUsers = [];
          this.isAddingTeamMembers = false;
          this.loadTeamMembers(this.teamId!);
          this.loadUsers();
          this.checkCanAddMember();
          this.checkCanAddTeamLead();
        },
        error: (error) => {
          console.error('Error adding team members:', error);
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to Add Team Members', key: 'bc' });
        }
      });
    }
  }

  confirmCancelAddingMembers(): void {
    this.confirmationService.confirm({
      header: 'Cancel?',
      message: 'Are you sure you want to cancel this operation?',
      accept: () => {
        this.newMemberCancel();
      }
    })
  }

  newMemberCancel(): void {
    this.isAddingTeamMembers = false;
  }

  hasSelectedUsers(): boolean {
    return this.selectedUsers.length > 0;
  }

  hasPermission(permission: Permissions): boolean {
    return this.permissionService.hasPermission(permission)
  }
}
